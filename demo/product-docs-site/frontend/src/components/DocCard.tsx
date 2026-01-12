import { Doc } from "../types/Doc";

interface DocCardProps {
  doc: Doc;
}

export function DocCard({ doc }: DocCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: "#fff",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#333" }}>
        {doc.title}
      </h3>
      <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
        <strong>Category:</strong> {doc.category} | <strong>Product Family:</strong>{" "}
        {doc.product_family}
      </div>
      {doc.description && (
        <p style={{ fontSize: "14px", color: "#555", margin: "8px 0" }}>
          {doc.description}
        </p>
      )}
      <a
        href={doc.pdf_url}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          marginTop: "8px",
          padding: "6px 12px",
          backgroundColor: "#007bff",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        View PDF
      </a>
    </div>
  );
}
