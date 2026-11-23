import { useCallback, useEffect, useReducer, useRef } from 'react'

interface HistoryEntry<T> {
  before: T
  after: T
}

interface Options<T> {
  capture: () => T
  restore: (snapshot: T) => void
}

const HISTORY_LIMIT = 5

export function useEditorHistory<T>({
  capture,
  restore,
}: Options<T>) {
  const undoStack = useRef<HistoryEntry<T>[]>([])
  const redoStack = useRef<HistoryEntry<T>[]>([])
  const pendingSnapshot = useRef<{ value: T } | null>(null)

  const [, forceRender] = useReducer(
    (value: number) => value + 1,
    0,
  )

  const beginEdit = useCallback(() => {
    if (pendingSnapshot.current !== null) return

    pendingSnapshot.current = {
      value: structuredClone(capture()),
    }
  }, [capture])

  const commitEdit = useCallback(() => {
    const pending = pendingSnapshot.current
    if (pending === null) return

    const after = structuredClone(capture())
    pendingSnapshot.current = null

    if (JSON.stringify(pending.value) === JSON.stringify(after)) {
      return
    }

    undoStack.current.push({
      before: pending.value,
      after,
    })

    undoStack.current = undoStack.current.slice(-HISTORY_LIMIT)
    redoStack.current = []

    forceRender()
  }, [capture])

  const cancelEdit = useCallback(() => {
    const pending = pendingSnapshot.current
    if (pending === null) return

    restore(structuredClone(pending.value))
    pendingSnapshot.current = null

    forceRender()
  }, [restore])

  const undo = useCallback(() => {
    if (pendingSnapshot.current !== null) return

    const entry =
      undoStack.current[undoStack.current.length - 1]

    if (!entry) return

    restore(structuredClone(entry.before))

    undoStack.current.pop()
    redoStack.current.push(entry)

    forceRender()
  }, [restore])

  const redo = useCallback(() => {
    if (pendingSnapshot.current !== null) return

    const entry =
      redoStack.current[redoStack.current.length - 1]

    if (!entry) return

    restore(structuredClone(entry.after))

    redoStack.current.pop()
    undoStack.current.push(entry)

    forceRender()
  }, [restore])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target

      if (
        target instanceof Element &&
        target.closest(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
        )
      ) {
        return
      }

      if (document.querySelector('dialog[open]')) return
      if (event.isComposing || event.altKey) return
      if (!(event.ctrlKey || event.metaKey)) return
      if (event.key.toLowerCase() !== 'z') return

      event.preventDefault()

      if (event.repeat) return

      if (event.shiftKey) {
        redo()
      } else {
        undo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [undo, redo])

  return {
    beginEdit,
    commitEdit,
    cancelEdit,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
  }
}

