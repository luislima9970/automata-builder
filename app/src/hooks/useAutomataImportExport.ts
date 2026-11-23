import { useState } from 'react'
import { AutomataSerializer } from '../../../automata-lib/src/serializers/AutomataSerializer'
import type { Automata } from '../../../automata-lib/src/core/Automata'

interface Options {
  automata: Automata
  onImport: (automata: Automata) => void
}

export function useAutomataImportExport({ automata, onImport }: Options) {
  const [error, setError] = useState<string | null>(null)

  async function importAutomata(file: File): Promise<void> {
    setError(null)

    try {
      const json = await file.text()
      const imported = AutomataSerializer.deserialize(json)

      onImport(imported)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to import automaton.'
      )
    }
  }

  function exportAutomata(): void {
    setError(null)

    try {
      const json = AutomataSerializer.serialize(automata)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')

      anchor.href = url
      anchor.download = 'automaton.json'

      try {
        document.body.appendChild(anchor)
        anchor.click()
      } finally {
        anchor.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to export automaton.'
      )
    }
  }

  function clearError(): void {
    setError(null)
  }

  return {
    importAutomata,
    exportAutomata,
    error,
    clearError,
  }
}

