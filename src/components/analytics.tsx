import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { AnalyticsCard } from "./analytics-card"
import { DottedSeparator } from "./dotted-separator"

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  const getVariant = (difference: number) => {
    if (difference > 0) return "up"
    if (difference < 0) return "down"
    return "neutral"
  }

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shadow-0">
      <div className="w-full flex flex-low">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="일감 개수"
            value={data.taskCount}
            variant={getVariant(data.taskDifference)}
            increaseValue={data.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="할당된 일감 개수"
            value={data.assignedTaskCount}
            variant={getVariant(data.assignedTaskDifference)}
            increaseValue={data.assignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="완료된 일감 개수"
            value={data.completedTaskCount}
            variant={getVariant(data.completedTaskDifference)}
            increaseValue={data.completedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="지연된 일감 개수"
            value={data.overdueTaskCount}
            variant={getVariant(data.overdueTaskDifference)}
            increaseValue={data.overdueTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="미완료 일감 개수"
            value={data.incompletedTaskCount}
            variant={getVariant(data.incompletedTaskDifference)}
            increaseValue={data.incompletedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
