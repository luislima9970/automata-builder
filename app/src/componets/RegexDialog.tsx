import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Automata } from '../../../automata-lib/src/core/Automata'
import { NFABuilder } from '../../../automata-lib/src/algorithms/NFABuilder'
import './../../css/RegexDialog.css'

interface Props {
  onClose: () => void
  onGenerate: (automata: Automata) => void
}

export default function RegexDialog({ onClose, onGenerate }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [regex, setRegex] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let automata: Automata

    try {
      automata = NFABuilder.buildRegex(regex)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to generate automaton.'
      )
      return
    }

    onGenerate(automata)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="regex-dialog"
      aria-labelledby="regex-title"
      onCancel={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="regex-dialog-heading">
          <h2 id="regex-title">Build from regex</h2>

          <button
            className="regex-dialog-close"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p className="regex-dialog-description">
          Generate an NFA from a regular expression.
        </p>

        <label htmlFor="regex-expression">Regular expression</label>

        <input
          id="regex-expression"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          placeholder="(a|b)*abb"
          value={regex}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'regex-help regex-error' : 'regex-help'}
          onChange={(event) => {
            setRegex(event.target.value)
            setError('')
          }}
        />

        <p id="regex-help" className="regex-dialog-help">
          Supports |, *, +, ?, parentheses and ε. Leave empty for epsilon.
        </p>

        {error && (
          <p id="regex-error" className="regex-dialog-error" role="alert">
            {error}
          </p>
        )}

        <p className="regex-dialog-notice">
          Generating will replace the current automaton.
        </p>

        <div className="regex-dialog-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button className="regex-dialog-submit" type="submit">
            Generate NFA
          </button>
        </div>
      </form>
    </dialog>
  )
}

