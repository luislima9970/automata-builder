import type { ReactNode } from 'react'
import '../../css/Sidebar.css'
import type { Tool } from '../data/Tool'
import SidebarButton from './SidebarButton'

interface Props {
  selectedTool: Tool
  onToolSelect: (tool: Tool) => void
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

const tools: {
  tool: Tool
  title: string
  icon: ReactNode
}[] = [
  {
    tool: 'pointer',
    title: 'Select and move',
    icon: (
      <Icon>
        <path d="m5 3 14 9-7 1.5L8.5 20 5 3Z" />
      </Icon>
    ),
  },
  {
    tool: 'state',
    title: 'Add state',
    icon: (
      <Icon>
        <circle cx="10" cy="14" r="7" />
        <path d="M18 2v6M15 5h6" />
      </Icon>
    ),
  },
  {
    tool: 'transition',
    title: 'Add transition',
    icon: (
      <Icon>
        <circle cx="4" cy="12" r="2" />
        <path d="M6 12h15m-5-5 5 5-5 5" />
      </Icon>
    ),
  },
  {
    tool: 'accept',
    title: 'Toggle accepting state',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5.5" />
      </Icon>
    ),
  },
  {
    tool: 'erasor',
    title: 'Delete state or transition',
    icon: (
      <Icon>
        <path d="m4 14 9-10a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-8 9H9l-5-4a2 2 0 0 1 0-3Z" />
        <path d="m9 9 8 8M13 21h8" />
      </Icon>
    ),
  },
]

export default function Sidebar({ selectedTool, onToolSelect }: Props) {
  return (
    <aside className="sidebar" aria-label="Editing tools">
      {tools.map(({ tool, title, icon }) => (
        <SidebarButton
          key={tool}
          tool={tool}
          selectedTool={selectedTool}
          onToolSelect={onToolSelect}
          title={title}
          icon={icon}
        />
      ))}
    </aside>
  )
}

