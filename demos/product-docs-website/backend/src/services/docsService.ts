import { Doc } from '../types/Doc';
import * as path from 'path';
import * as fs from 'fs';

let cache: Doc[] | null = null;

function loadDocs(): Doc[] {
  if (!cache) {
    const docsPath = path.join(__dirname, '../../../docs-data/docs.json');
    const raw = fs.readFileSync(docsPath, 'utf-8');
    const docs = JSON.parse(raw) as Doc[];

    // Sort by order (ascending) then title (alphabetically)
    cache = [...docs].sort((a, b) => {
      const ao = a.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.title.localeCompare(b.title);
    });
  }
  return cache;
}

export function getAllDocs(): Doc[] {
  return loadDocs();
}

export function findDocById(id: string): Doc | undefined {
  return loadDocs().find((d) => d.id === id);
}

export interface DocsQuery {
  q?: string;
  category?: string;
}

export function filterDocs(query: DocsQuery): Doc[] {
  const all = loadDocs();
  const q = query.q?.trim().toLowerCase();
  const cat = query.category?.trim().toLowerCase();

  return all.filter((doc) => {
    // Filter by category if provided
    if (cat && doc.category.toLowerCase() !== cat) {
      return false;
    }

    // Filter by search query if provided
    if (!q) {
      return true;
    }

    // Search in title, category, product_family, and tags
    const haystack = [
      doc.title,
      doc.category,
      doc.product_family,
      ...(doc.tags ?? [])
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}
