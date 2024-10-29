interface CustomToolbarProps {
  date: Date
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
}

export const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return <div>CustomToolbar</div>
}
