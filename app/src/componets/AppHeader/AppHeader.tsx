import { useRef, type ChangeEvent, type ReactNode } from 'react'
import '../../../css/AppHeader.css'

type Props = {
  onExport: () => void
  onRegex: () => void
  onExamples: () => void
  onImport: (file: File) => void
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default function AppHeader({
  onExport,
  onRegex,
  onExamples,
  onImport,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null)

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''

    if (file) onImport(file)
  }

  return (
    <header className="app-header">
      <div className="app-header-brand">
        <svg
          className="app-header-logo"
          width="34"
          height="34"
          viewBox="0 0 36 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m15 11-7 12m13-12 7 12M12 27h12" />
          <circle cx="18" cy="7" r="5" />
          <circle cx="7" cy="27" r="5" />
          <circle cx="29" cy="27" r="5" />
          <circle cx="29" cy="27" r="2" />
        </svg>

        <span>Automata Builder</span>
      </div>

      <nav className="app-header-actions" aria-label="Automaton actions">
        <button
          className="app-header-button"
          type="button"
          onClick={onExamples}
        >
          Examples
          <Icon>
            <path d="m7 10 5 5 5-5" />
          </Icon>
        </button>

        <button
          className="app-header-button app-header-primary"
          type="button"
          onClick={onRegex}
        >
          <Icon>
            <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" />
          </Icon>
          Regex
        </button>

        <input
          ref={fileInput}
          className="app-header-file-input"
          type="file"
          accept=".json,application/json"
          aria-label="Import automaton JSON"
          onChange={handleImport}
        />

        <button
          className="app-header-button"
          type="button"
          onClick={() => fileInput.current?.click()}
        >
          <Icon>
            <path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5" />
          </Icon>
          Import
        </button>

        <button
          className="app-header-button"
          type="button"
          onClick={onExport}
        >
          <Icon>
            <path d="M12 3v13m-5-5 5 5 5-5M4 15v5h16v-5" />
          </Icon>
          Export
        </button>
      </nav>
    </header>
  )
}

