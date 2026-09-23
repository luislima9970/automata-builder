interface Props {
  status: "idle" | "accepted" | "rejected";
}

function AcceptingTag({ status }: Props) {
  if (status === "idle") return null;

  return (
    <span className={`result-tag ${status}`}>
      {status === "accepted" ? "✓ Accepted" : "✕ Rejected"}
    </span>
  );
}

export default AcceptingTag;