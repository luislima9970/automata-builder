import '../../css/CanvasControl.css'

interface Props {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
}

export default function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFit,
}: Props) {
  return (
    <div
      className="canvas-controls"
      role="group"
      aria-label="Canvas controls"
    >
      <button
        type="button"
        aria-label="Zoom out"
        onClick={onZoomOut}
        disabled={zoom <= 0.1}
      >
        −
      </button>

      <span className="canvas-zoom">
        {Math.round(zoom * 100)}%
      </span>

      <button
        type="button"
        aria-label="Zoom in"
        onClick={onZoomIn}
        disabled={zoom >= 5}
      >
        +
      </button>

      <span className="canvas-controls-divider" />

      <button
        type="button"
        className="canvas-fit"
        title="Fit and recenter automaton"
        onClick={onFit}
      >
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
          <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
  )
}

