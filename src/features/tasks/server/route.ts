// 외부 라이브러리
import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { Query, ID } from "node-appwrite"

// 내부 모듈
import { sessionMiddleware } from "@/lib/session-middleware"
import { createTaskSchema } from "../schemas"
import { getMember } from "@/features/members/utils"
import { DATABASE_ID, TASKS_ID } from "@/config"
import { Task, TaskStatus } from "../types"
import { createAdminClient } from "@/lib/appwrite"
import { PROJECTS_ID, MEMBERS_ID } from "@/config"
import { Project } from "@/features/projects/types"

const app = new Hono()
  // 일감 조회
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      // 관리자 클라이언트 생성
      const { users } = await createAdminClient()
      // 데이터베이스 가져오기
      const databases = c.get("databases")
      // 현재 인증된 사용자 정보 가져오기
      const user = c.get("user")

      // 요청 쿼리에서 유효한 매개변수 추출
      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid("query")

      // 현재 사용자가 워크스페이스의 멤버인지 확인
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      // 멤버가 아닌 경우 에러 반환
      if (!member) {
        return c.json({ message: "워크스페이스에 속한 멤버가 아닙니다." }, 403)
      }

      // 데이터베이스 쿼리 배열 초기화
      const query = [
        Query.equal("workspaceId", workspaceId), // 워크스페이스 ID로 필터링
        Query.orderDesc("$createdAt"), // 생성일 기준 내림차순 정렬
      ]

      // 프로젝트 ID가 제공된 경우 쿼리에 추가
      if (projectId) {
        query.push(Query.equal("projectId", projectId))
      }

      // 상태가 제공된 경우 쿼리에 추가
      if (status) {
        query.push(Query.equal("status", status))
      }

      // 담당자 ID가 제공된 경우 쿼리에 추가
      if (assigneeId) {
        query.push(Query.equal("assigneeId", assigneeId))
      }

      // 마감일이 제공된 경우 쿼리에 추가
      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate))
      }

      // 검색어가 제공된 경우 쿼리에 추가
      if (search) {
        query.push(Query.search("name", search))
      }

      // 데이터베이스에서 일감 목록 조회
      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      )

      // 일감에 연관된 프로젝트 ID와 담당자 ID 추출
      const projectIds = tasks.documents.map((task) => task.projectId)
      const assigneeIds = tasks.documents.map((task) => task.assigneeId)

      // 관련 프로젝트 정보 조회
      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      )

      // 관련 멤버 정보 조회
      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      )

      // 담당자 정보에 사용자 이름과 이메일 추가
      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId)
          return { ...member, name: user.name, email: user.email }
        })
      )

      // 일감 데이터에 프로젝트와 담당자 정보 추가
      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        )
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        )

        return {
          ...task,
          project,
          assignee,
        }
      })

      // 완성된 일감 데이터를 JSON 형식으로 응답
      return c.json({ data: { ...tasks, documents: populatedTasks } })
    }
  )

  // 일감 생성
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      // 사용자 정보 가져오기
      const user = c.get("user")
      // 데이터베이스 가져오기
      const databases = c.get("databases")

      // 일감 데이터 추출
      const { name, status, workspaceId, projectId, dueDate, assigneeId } =
        c.req.valid("json")

      // 현재 사용자가 지정된 워크스페이스의 멤버인지 확인
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      // 멤버가 아닌 경우 403 Forbidden 에러 반환
      if (!member) {
        return c.json({ error: "워크스페이스에 속한 멤버가 아닙니다." }, 403)
      }

      // 동일한 상태와 워크스페이스 내에서 가장 높은 position 값을 가진 일감 조회
      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      )

      // 새로운 일감의 position 값 계산
      // 기존 일감이 있으면 그 position보다 1 큰 값, 없으면 1000으로 설정
      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1
          : 1000

      // 새로운 일감 생성
      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
        }
      )

      return c.json({ data: task })
    }
  )

  // 일감 삭제
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user")
    const databases = c.get("databases")
    // 일감 ID 추출
    const { taskId } = c.req.param()

    // 일감 조회
    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    )

    // 현재 사용자가 일감의 워크스페이스에 속한 멤버인지 확인
    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    })

    // 멤버가 아닌 경우 403 에러 반환
    if (!member) {
      return c.json({ error: "워크스페이스에 속한 멤버가 아닙니다." }, 401)
    }

    // 일감 삭제
    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId)

    return c.json({ data: { $id: task.$id } })
  })

  // 일감 업데이트
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()), // 부분 업데이트 허용
    async (c) => {
      // 사용자 정보 가져오기
      const user = c.get("user")
      // 데이터베이스 가져오기
      const databases = c.get("databases")

      // 일감 데이터 추출
      const { name, status, projectId, dueDate, assigneeId, description } =
        c.req.valid("json")

      // 일감 ID 추출
      const { taskId } = c.req.param()

      // 기존 일감 조회
      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      )

      // 현재 사용자가 지정된 워크스페이스의 멤버인지 확인
      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      })

      // 멤버가 아닌 경우 401 Unauthorized 에러 반환
      if (!member) {
        return c.json({ error: "워크스페이스에 속한 멤버가 아닙니다." }, 401)
      }

      // 일감 업데이트
      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          projectId,
          assigneeId,
          dueDate,
          description,
        }
      )

      return c.json({ data: task })
    }
  )

  // 일감 상세 조회
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user")
    const databases = c.get("databases")
    const { users } = await createAdminClient()
    const { taskId } = c.req.param()

    // 일감 조회
    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    )

    // 현재 사용자가 일감의 워크스페이스에 속한 멤버인지 확인
    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    })

    if (!currentMember) {
      return c.json({ error: "워크스페이스에 속한 멤버가 아닙니다." }, 401)
    }

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    )

    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    )

    const user = await users.get(member.userId)

    const assignee = { ...member, name: user.name, email: user.email }

    return c.json({ data: { ...task, project, assignee } })
  })

export default app
