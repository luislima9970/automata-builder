import { useEffect, useRef } from 'react'
import type { Automata } from '../../../automata-lib/src/core/Automata'
import { automataExamples } from '../data/automataExamples'
import '../../css/ExampleDialog.css'

interface Props {
  onClose: () => void
  onSelect: (automata: Automata) => void
}

export default function ExamplesDialog({ onClose, onSelect }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="examples-dialog"
      aria-labelledby="examples-title"
      onCancel={onClose}
    >
      <div className="examples-heading">
        <div>
          <h2 id="examples-title">Explore an example</h2>
          <p>Small automata to build your intuition.</p>
        </div>

        <button
          className="examples-close"
          type="button"
          aria-label="Close examples"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="examples-list">
        {automataExamples.map((example) => (
          <button
            key={example.id}
            className="example-card"
            type="button"
            onClick={() => {
              onSelect(example.create())
              onClose()
            }}
          >
            <div className="example-card-heading">
              <span className="example-name">{example.name}</span>
              <span className="example-badge">DFA</span>
            </div>

            <p className="example-description">{example.description}</p>

            <div className="example-words">
              <span className="example-words-label">Accepts</span>

              {example.accepted.map((word) => (
                <code className="example-accepted" key={word}>
                  {word}
                </code>
              ))}
            </div>

            <div className="example-words">
              <span className="example-words-label">Rejects</span>

              {example.rejected.map((word) => (
                <code className="example-rejected" key={word}>
                  {word}
                </code>
              ))}
            </div>
          </button>
        ))}
      </div>

      <p className="examples-notice">
        All examples use the alphabet 0 and 1. ε means empty input.
        Selecting an example replaces the current automaton.
      </p>
    </dialog>
  )
}

