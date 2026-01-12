import request from 'supertest';
import app from '../src/index';

describe('Docs API Routes', () => {
  describe('GET /api/docs', () => {
    it('should return 200 and an array of documents', async () => {
      const response = await request(app)
        .get('/api/docs')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter by category query parameter', async () => {
      const response = await request(app)
        .get('/api/docs?category=Micra')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((doc: any) => {
        expect(doc.category.toLowerCase()).toBe('micra');
      });
    });

    it('should filter by search query parameter', async () => {
      const response = await request(app)
        .get('/api/docs?q=technical')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter by both category and search query', async () => {
      const response = await request(app)
        .get('/api/docs?category=Micra&q=VR2')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((doc: any) => {
        expect(doc.category.toLowerCase()).toBe('micra');
      });
    });

    it('should return empty array when no matches found', async () => {
      const response = await request(app)
        .get('/api/docs?q=nonexistent-xyz-123')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should handle multiple query parameters correctly', async () => {
      const response = await request(app)
        .get('/api/docs?category=Data&q=dictionary')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/docs/:id', () => {
    it('should return 200 and the document when id exists', async () => {
      const response = await request(app)
        .get('/api/docs/micra-vr2-technical-specifications')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('id', 'micra-vr2-technical-specifications');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('category');
      expect(response.body).toHaveProperty('pdf_url');
    });

    it('should return 404 when id does not exist', async () => {
      const response = await request(app)
        .get('/api/docs/nonexistent-id-12345')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Not found');
    });

    it('should return correct document structure', async () => {
      const response = await request(app)
        .get('/api/docs/micra-portfolio-brochure-av2-vr2')
        .expect(200);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        category: expect.any(String),
        product_family: expect.any(String),
        pdf_url: expect.any(String)
      });
    });
  });

  describe('CORS', () => {
    it('should have CORS headers enabled', async () => {
      const response = await request(app)
        .get('/api/docs')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
