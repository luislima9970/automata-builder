interface Props {
  word: string
  consumedCharacters: number
  failedCharacterIndex: number | null
}

export default function InputProgress({
  word,
  consumedCharacters,
  failedCharacterIndex,
}: Props) {
  return (
    <span className="input-progress" aria-label="Input progress">
      {Array.from(word).map((character, index) => {
        const state =
          index === failedCharacterIndex
            ? 'failed'
            : index < consumedCharacters
              ? 'consumed'
              : ''

        return (
          <span
            key={index}
            className={`input-progress-character ${state}`}
          >
            {character}
          </span>
        )
      })}
    </span>
  )
}
