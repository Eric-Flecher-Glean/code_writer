import { getAllDocs, findDocById, filterDocs } from "../src/services/docsService";

describe("docsService", () => {
  describe("getAllDocs", () => {
    it("should return all documents", () => {
      const docs = getAllDocs();
      expect(docs).toBeDefined();
      expect(Array.isArray(docs)).toBe(true);
      expect(docs.length).toBeGreaterThan(0);
    });

    it("should return documents sorted by order then title", () => {
      const docs = getAllDocs();

      // Check that documents are sorted by order field
      for (let i = 0; i < docs.length - 1; i++) {
        const currentOrder = docs[i].order ?? Number.MAX_SAFE_INTEGER;
        const nextOrder = docs[i + 1].order ?? Number.MAX_SAFE_INTEGER;

        if (currentOrder === nextOrder) {
          // If orders are equal, should be sorted by title
          expect(docs[i].title.localeCompare(docs[i + 1].title)).toBeLessThanOrEqual(0);
        } else {
          expect(currentOrder).toBeLessThan(nextOrder);
        }
      }
    });
  });

  describe("findDocById", () => {
    it("should return a document for a known id", () => {
      const doc = findDocById("micra-vr2-technical-specifications");
      expect(doc).toBeDefined();
      expect(doc?.id).toBe("micra-vr2-technical-specifications");
      expect(doc?.title).toBe("Micra VR2 technical specifications");
    });

    it("should return undefined for an unknown id", () => {
      const doc = findDocById("non-existent-id");
      expect(doc).toBeUndefined();
    });
  });

  describe("filterDocs", () => {
    it("should return all docs when no query is provided", () => {
      const filtered = filterDocs({});
      const all = getAllDocs();
      expect(filtered.length).toBe(all.length);
    });

    it("should filter by category only", () => {
      const filtered = filterDocs({ category: "Micra" });
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((doc) => {
        expect(doc.category).toBe("Micra");
      });
    });

    it("should filter by category case-insensitively", () => {
      const filtered = filterDocs({ category: "micra" });
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((doc) => {
        expect(doc.category.toLowerCase()).toBe("micra");
      });
    });

    it("should filter by search query in title", () => {
      const filtered = filterDocs({ q: "technical" });
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((doc) => {
        const haystack = [
          doc.title,
          doc.category,
          doc.product_family,
          ...(doc.tags ?? [])
        ]
          .join(" ")
          .toLowerCase();
        expect(haystack).toContain("technical");
      });
    });

    it("should filter by search query in tags", () => {
      const filtered = filterDocs({ q: "brochure" });
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((doc) => {
        const haystack = [
          doc.title,
          doc.category,
          doc.product_family,
          ...(doc.tags ?? [])
        ]
          .join(" ")
          .toLowerCase();
        expect(haystack).toContain("brochure");
      });
    });

    it("should apply both query and category filters (AND logic)", () => {
      const filtered = filterDocs({ q: "technical", category: "Micra" });
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((doc) => {
        expect(doc.category).toBe("Micra");
        const haystack = [
          doc.title,
          doc.category,
          doc.product_family,
          ...(doc.tags ?? [])
        ]
          .join(" ")
          .toLowerCase();
        expect(haystack).toContain("technical");
      });
    });

    it("should return empty array when no documents match filters", () => {
      const filtered = filterDocs({ q: "nonexistentquery12345" });
      expect(filtered).toEqual([]);
    });
  });
});
