import { Doc } from "../types/Doc";
import { DocCard } from "./DocCard";

interface DocsListProps {
  docs: Doc[];
}

export function DocsList({ docs }: DocsListProps) {
  if (docs.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#666",
          fontSize: "16px",
        }}
      >
        No documents found
      </div>
    );
  }

  return (
    <div>
      {docs.map((doc) => (
        <DocCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
}
