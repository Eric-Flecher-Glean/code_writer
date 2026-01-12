import { getAllDocs, findDocById, filterDocs, DocsQuery } from '../src/services/docsService';
import { Doc } from '../src/types/Doc';

describe('docsService', () => {
  describe('getAllDocs', () => {
    it('should return an array of documents', () => {
      const docs = getAllDocs();
      expect(Array.isArray(docs)).toBe(true);
      expect(docs.length).toBeGreaterThan(0);
    });

    it('should return documents sorted by order then title', () => {
      const docs = getAllDocs();

      // Check that docs with order field come first
      const docsWithOrder = docs.filter(d => d.order !== undefined);
      const docsWithoutOrder = docs.filter(d => d.order === undefined);

      if (docsWithOrder.length > 1) {
        for (let i = 0; i < docsWithOrder.length - 1; i++) {
          const current = docsWithOrder[i].order ?? Number.MAX_SAFE_INTEGER;
          const next = docsWithOrder[i + 1].order ?? Number.MAX_SAFE_INTEGER;
          expect(current).toBeLessThanOrEqual(next);
        }
      }
    });

    it('should return documents with required fields', () => {
      const docs = getAllDocs();
      docs.forEach(doc => {
        expect(doc).toHaveProperty('id');
        expect(doc).toHaveProperty('title');
        expect(doc).toHaveProperty('category');
        expect(doc).toHaveProperty('product_family');
        expect(doc).toHaveProperty('pdf_url');
        expect(typeof doc.id).toBe('string');
        expect(typeof doc.title).toBe('string');
        expect(typeof doc.category).toBe('string');
        expect(typeof doc.product_family).toBe('string');
        expect(typeof doc.pdf_url).toBe('string');
      });
    });
  });

  describe('findDocById', () => {
    it('should return a document when id exists', () => {
      const allDocs = getAllDocs();
      const firstDoc = allDocs[0];

      const found = findDocById(firstDoc.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(firstDoc.id);
    });

    it('should return undefined when id does not exist', () => {
      const found = findDocById('non-existent-id-12345');
      expect(found).toBeUndefined();
    });

    it('should return the correct document for a known id', () => {
      const found = findDocById('micra-vr2-technical-specifications');
      expect(found).toBeDefined();
      expect(found?.title).toContain('Micra VR2');
      expect(found?.category).toBe('Micra');
    });
  });

  describe('filterDocs', () => {
    it('should return all docs when no query is provided', () => {
      const query: DocsQuery = {};
      const filtered = filterDocs(query);
      const all = getAllDocs();
      expect(filtered.length).toBe(all.length);
    });

    it('should filter by category', () => {
      const query: DocsQuery = { category: 'Micra' };
      const filtered = filterDocs(query);

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(doc => {
        expect(doc.category.toLowerCase()).toBe('micra');
      });
    });

    it('should filter by search query in title', () => {
      const query: DocsQuery = { q: 'technical' };
      const filtered = filterDocs(query);

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(doc => {
        const searchableText = [
          doc.title,
          doc.category,
          doc.product_family,
          ...(doc.tags ?? [])
        ].join(' ').toLowerCase();
        expect(searchableText).toContain('technical');
      });
    });

    it('should filter by search query in tags', () => {
      const query: DocsQuery = { q: 'brochure' };
      const filtered = filterDocs(query);

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(doc => {
        const searchableText = [
          doc.title,
          doc.category,
          doc.product_family,
          ...(doc.tags ?? [])
        ].join(' ').toLowerCase();
        expect(searchableText).toContain('brochure');
      });
    });

    it('should apply AND filter when both category and query are provided', () => {
      const query: DocsQuery = { category: 'Micra', q: 'VR2' };
      const filtered = filterDocs(query);

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(doc => {
        expect(doc.category.toLowerCase()).toBe('micra');
        const searchableText = [
          doc.title,
          doc.category,
          doc.product_family,
          ...(doc.tags ?? [])
        ].join(' ').toLowerCase();
        expect(searchableText).toContain('vr2');
      });
    });

    it('should be case-insensitive for category filter', () => {
      const query1: DocsQuery = { category: 'MICRA' };
      const query2: DocsQuery = { category: 'micra' };
      const query3: DocsQuery = { category: 'Micra' };

      const filtered1 = filterDocs(query1);
      const filtered2 = filterDocs(query2);
      const filtered3 = filterDocs(query3);

      expect(filtered1.length).toBe(filtered2.length);
      expect(filtered2.length).toBe(filtered3.length);
    });

    it('should be case-insensitive for search query', () => {
      const query1: DocsQuery = { q: 'TECHNICAL' };
      const query2: DocsQuery = { q: 'technical' };

      const filtered1 = filterDocs(query1);
      const filtered2 = filterDocs(query2);

      expect(filtered1.length).toBe(filtered2.length);
    });

    it('should return empty array when no matches found', () => {
      const query: DocsQuery = { q: 'nonexistent-search-term-xyz' };
      const filtered = filterDocs(query);
      expect(filtered.length).toBe(0);
    });

    it('should handle empty string queries', () => {
      const query: DocsQuery = { q: '', category: '' };
      const filtered = filterDocs(query);
      const all = getAllDocs();
      expect(filtered.length).toBe(all.length);
    });

    it('should trim whitespace from queries', () => {
      const query1: DocsQuery = { q: '  technical  ', category: '  Micra  ' };
      const query2: DocsQuery = { q: 'technical', category: 'Micra' };

      const filtered1 = filterDocs(query1);
      const filtered2 = filterDocs(query2);

      expect(filtered1.length).toBe(filtered2.length);
    });
  });
});
