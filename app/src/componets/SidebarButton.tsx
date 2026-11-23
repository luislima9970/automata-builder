import type { ReactNode } from 'react'
import type { Tool } from '../data/Tool'

interface Props {
    tool: Tool
    selectedTool: Tool
    onToolSelect: (tool: Tool) => void
    title: string
    icon: ReactNode
}

export default function SidebarButton({
    tool,
    selectedTool,
    onToolSelect,
    title,
    icon,
}: Props) {
    return (
        <button
            type="button"
            className={`sidebar-button${selectedTool === tool ? ' selected' : ''}`}
            onClick={() => onToolSelect(tool)}
            title={title}
            aria-label={title}
            aria-pressed={selectedTool === tool}
        >
            {icon}
        </button>
    )
}

