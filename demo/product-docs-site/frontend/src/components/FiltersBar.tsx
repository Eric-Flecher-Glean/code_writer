interface FiltersBarProps {
  search: string;
  category: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function FiltersBar({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}: FiltersBarProps) {
  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          flex: 1,
          padding: "8px 12px",
          fontSize: "14px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          minWidth: "200px",
        }}
      >
        <option value="All">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
