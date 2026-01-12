import request from "supertest";
import app from "../src/index";

describe("Docs API Routes", () => {
  describe("GET /api/docs", () => {
    it("should return 200 and an array of documents", async () => {
      const response = await request(app).get("/api/docs");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should have correct document structure", async () => {
      const response = await request(app).get("/api/docs");

      const doc = response.body[0];
      expect(doc).toHaveProperty("id");
      expect(doc).toHaveProperty("title");
      expect(doc).toHaveProperty("category");
      expect(doc).toHaveProperty("product_family");
      expect(doc).toHaveProperty("pdf_url");
    });

    it("should filter documents by query parameter q", async () => {
      const response = await request(app).get("/api/docs?q=Micra");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned docs should match the query
      response.body.forEach((doc: any) => {
        const haystack = [
          doc.title,
          doc.category,
          doc.product_family,
          ...(doc.tags ?? [])
        ]
          .join(" ")
          .toLowerCase();
        expect(haystack).toContain("micra");
      });
    });

    it("should filter documents by category parameter", async () => {
      const response = await request(app).get("/api/docs?category=Micra");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned docs should have the specified category
      response.body.forEach((doc: any) => {
        expect(doc.category).toBe("Micra");
      });
    });

    it("should filter by both q and category", async () => {
      const response = await request(app).get("/api/docs?q=technical&category=Micra");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((doc: any) => {
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

    it("should return empty array when no documents match", async () => {
      const response = await request(app).get("/api/docs?q=nonexistentquery12345");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/docs/:id", () => {
    it("should return 200 and the document for a known id", async () => {
      const response = await request(app).get("/api/docs/micra-vr2-technical-specifications");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", "micra-vr2-technical-specifications");
      expect(response.body).toHaveProperty("title", "Micra VR2 technical specifications");
      expect(response.body).toHaveProperty("category");
      expect(response.body).toHaveProperty("pdf_url");
    });

    it("should return 404 for an unknown id", async () => {
      const response = await request(app).get("/api/docs/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Not found");
    });
  });
});
