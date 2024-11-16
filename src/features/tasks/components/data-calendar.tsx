import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"

import { Task } from "../types"

import { ko } from "date-fns/locale"
import { useState } from "react"

import "react-big-calendar/lib/css/react-big-calendar.css"
import "./data-calendar.css"
import { EventCard } from "./event-card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
const locales = {
  ko: ko,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface DataCalendarProps {
  data: Task[]
}

interface CustomToolbarProps {
  date: Date
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
}

// 일감 캘린더 컴포넌트
export const DataCalendar = ({ data }: DataCalendarProps) => {
  // 커스텀 툴바 컴포넌트
  const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onNavigate("PREV")}
        className="flex items-center"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(date, "yyyy년 MM월", { locale: ko })}</p>
      </div>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onNavigate("NEXT")}
        className="flex items-center"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={() => onNavigate("TODAY")}
        className="text-sm"
      >
        오늘
      </Button>
    </div>
  )

  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  )

  // 일감 이벤트 배열
  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }))

  // 캘린더 내비게이션 핸들러
  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      // 이전 달로 이동
      setValue(subMonths(value, 1))
    } else if (action === "NEXT") {
      // 다음 달로 이동
      setValue(addMonths(value, 1))
    } else {
      // 오늘 날짜로 설정
      setValue(new Date())
    }
  }

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar={true}
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      // 요일 포맷
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  )
}
