interface Props {
  word: string
  consumedCharacters: number
}

export default function InputProgress({
  word,
  consumedCharacters,
}: Props) {
  return (
    <span className="input-progress" aria-label="Input progress">
      {Array.from(word).map((character, index) => (
        <span
          key={index}
          className={
            index < consumedCharacters
              ? 'input-progress-character consumed'
              : 'input-progress-character'
          }
        >
          {character}
        </span>
      ))}
    </span>
  )
}

