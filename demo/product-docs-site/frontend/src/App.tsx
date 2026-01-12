import { useEffect, useState } from "react";
import { Doc } from "./types/Doc";
import { FiltersBar } from "./components/FiltersBar";
import { DocsList } from "./components/DocsList";

function App() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch all docs on mount to get categories
    fetch("/api/docs")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load docs");
        return r.json();
      })
      .then((data: Doc[]) => {
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((doc) => doc.category))
        ).sort();
        setCategories(uniqueCategories);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (category !== "All") params.set("category", category);

    const url = `/api/docs${params.toString() ? "?" + params.toString() : ""}`;

    setLoading(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load docs");
        return r.json();
      })
      .then((data: Doc[]) => {
        setDocs(data);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>
        Product Documentation
      </h1>

      <FiltersBar
        search={search}
        category={category}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Loading...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fee",
            color: "#c00",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          Error: {error}
        </div>
      )}

      {!loading && !error && <DocsList docs={docs} />}
    </div>
  );
}

export default App;
