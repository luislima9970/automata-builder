import { useLayoutEffect, useRef, useState } from 'react'

interface Props {
  x: number
  y: number
  name: string
  editable: boolean
  onRename: (name: string) => boolean
}

export default function StateName({
  x,
  y,
  name,
  editable,
  onRename,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const finishedRef = useRef(false)

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  const [fontSize, setFontSize] = useState(14)
  const [invalid, setInvalid] = useState(false)

  useLayoutEffect(() => {
    if (editing && editable) {
      inputRef.current?.focus()
      inputRef.current?.select()
      return
    }

    const text = textRef.current
    if (!text) return

    text.setAttribute('font-size', '14')

    const width = text.getComputedTextLength()
    const size = width > 44 ? (14 * 44) / width : 14

    text.setAttribute('font-size', String(size))
    setFontSize(size)
  }, [name, editing, editable])

  function startEditing() {
    if (!editable) return

    finishedRef.current = false
    setDraft(name)
    setInvalid(false)
    setEditing(true)
  }

  function cancel() {
    finishedRef.current = true
    setEditing(false)
  }

  function save(fromBlur: boolean) {
    if (finishedRef.current) return

    const nextName = draft.trim()

    if (!nextName || !onRename(nextName)) {
      if (fromBlur) {
        cancel()
      } else {
        setInvalid(true)
      }

      return
    }

    finishedRef.current = true
    setEditing(false)
  }

  return (
    <g
      onDoubleClick={(event) => {
        event.stopPropagation()
        startEditing()
      }}
    >
      {editing && editable ? (
        <foreignObject
          x={x - 24}
          y={y - 13}
          width={48}
          height={26}
          onMouseDown={(event) => event.stopPropagation()}
          onMouseUp={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <input
            ref={inputRef}
            className="state-name-input"
            aria-label="State name"
            aria-invalid={invalid}
            title={invalid ? 'Use a nonempty, unique name' : 'State name'}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              setInvalid(false)
            }}
            onBlur={() => save(true)}
            onKeyDown={(event) => {
              event.stopPropagation()

              if (event.key === 'Enter') {
                event.preventDefault()
                save(false)
              }

              if (event.key === 'Escape') {
                event.preventDefault()
                cancel()
              }
            }}
            onKeyUp={(event) => event.stopPropagation()}
          />
        </foreignObject>
      ) : (
        <text
          ref={textRef}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize={fontSize}
          style={{ cursor: editable ? 'text' : 'inherit' }}
        >
          {name}
        </text>
      )}
    </g>
  )
}

