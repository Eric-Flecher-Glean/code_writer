# Technical Implementation Plan: Product Documentation Website

## Executive Summary

This document outlines a test-driven development (TDD) approach to building a simple, responsive website that lists and provides access to Medtronic product documentation stored in Google Drive. The website will display product documentation for cardiac devices including the Micra leadless pacemaker family and other medical devices.

## Product Documentation Inventory

Based on the Google Drive folder analysis, the following product documentation is available:

### Micra Leadless Pacemaker Family
- `01_Micra VR2 technical specifications.pdf`
- `02_Micra VR2 spec sheet (Western Europe).pdf`
- `02_Micra AV2 technical specifications.pdf`
- `03_Micra AV MC1AVR1 implant manual with MRI and EMI precautions.pdf`
- `04_Micra portfolio brochure (AV2 and VR2).pdf`
- `04_Living with the Micra leadless pacemaker.pdf`
- `01_Micra AV2 product page.html`
- `03_Micra AV2 and VR2 product page (EMEA).html`

### Other Cardiac Products
- `01_Coronary product catalog.pdf`
- `02_Symplicity Spyral brochure.pdf`

### Additional Resources
- `products.csv` - Product catalog with model numbers, pricing, and specifications
- `DATA_DICTIONARY.md` - Data dictionary for synthetic Medtronic data

**Total Documents**: 12+ PDFs, HTML files, and data files

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui (optional, for polished UI components)
- **Icons**: Lucide React

### Testing
- **Unit/Integration Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Test Coverage**: nyc/c8

### Data Source Integration
- **API Layer**: Express.js or Next.js API Routes
- **Google Drive API**: Google Drive API v3 for programmatic access
- **Authentication**: Service Account or OAuth 2.0

### Deployment
- **Hosting**: Vercel, Netlify, or GitHub Pages
- **CI/CD**: GitHub Actions

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React App                                        │  │
│  │  - Product List Component                         │  │
│  │  - Search/Filter Component                        │  │
│  │  - Document Viewer Component                      │  │
│  │  - Category Navigation                            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │  /api/documents - List all documents              │  │
│  │  /api/documents/:id - Get document details        │  │
│  │  /api/categories - Get document categories        │  │
│  │  /api/search?q=query - Search documents           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ Google Drive API
                      ▼
┌─────────────────────────────────────────────────────────┐
│            Google Drive Folder                           │
│  folder: 1KuN_YhLOk4KTdORa0rdpG24hLyd4kjfP              │
│  - PDF Documents                                         │
│  - HTML Resources                                        │
│  - CSV/Markdown Data Files                              │
└─────────────────────────────────────────────────────────┘
```

## Data Model

### Document Entity
```typescript
interface ProductDocument {
  id: string;                    // Google Drive file ID
  name: string;                  // Display name
  fileName: string;              // Original filename
  category: DocumentCategory;    // Product category
  fileType: 'pdf' | 'html' | 'csv' | 'markdown';
  size: number;                  // File size in bytes
  lastModified: Date;            // Last modification date
  thumbnailUrl?: string;         // Optional thumbnail
  downloadUrl: string;           // Direct download link
  viewUrl: string;              // Google Drive viewer URL
  description?: string;          // Optional description
  productFamily?: string;        // e.g., "Micra", "Symplicity"
  modelNumber?: string;          // e.g., "MC1VR2", "MC2AVR1"
}

enum DocumentCategory {
  TECHNICAL_SPECS = 'Technical Specifications',
  USER_MANUAL = 'User Manual',
  PRODUCT_BROCHURE = 'Product Brochure',
  PATIENT_EDUCATION = 'Patient Education',
  CATALOG = 'Product Catalog',
  DATA_REFERENCE = 'Data Reference'
}
```

## TDD Implementation Phases

### Phase 1: Project Setup & Infrastructure (Week 1)

#### Test Cases
1. **Test**: Project builds successfully with TypeScript
2. **Test**: ESLint configuration passes with no errors
3. **Test**: Prettier formats code consistently
4. **Test**: Basic Vitest setup runs and passes smoke test

#### Implementation
```bash
# Initialize project
npm create vite@latest product-docs-site -- --template react-ts
cd product-docs-site
npm install

# Install dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react
npm install axios

# Setup Tailwind
npx tailwindcss init -p
```

#### Configuration Files
- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - E2E test configuration
- `tsconfig.json` - TypeScript strict mode
- `.eslintrc.cjs` - Linting rules
- `.prettierrc` - Code formatting

### Phase 2: Google Drive API Integration (Week 1-2)

#### Test Cases
1. **Test**: `fetchDocuments()` returns array of documents
2. **Test**: `fetchDocuments()` handles API errors gracefully
3. **Test**: Document metadata is correctly parsed
4. **Test**: File type detection works for PDF, HTML, CSV
5. **Test**: Rate limiting is respected (mock API)
6. **Test**: Authentication credentials are validated

#### Implementation
```typescript
// src/services/googleDrive.service.ts
import { google } from 'googleapis';

export class GoogleDriveService {
  private drive;

  constructor(apiKey: string) {
    this.drive = google.drive({ version: 'v3', auth: apiKey });
  }

  async fetchDocuments(folderId: string): Promise<ProductDocument[]> {
    // Implementation
  }

  async getDocumentMetadata(fileId: string): Promise<ProductDocument> {
    // Implementation
  }
}
```

#### Test File
```typescript
// src/services/__tests__/googleDrive.service.test.ts
describe('GoogleDriveService', () => {
  it('should fetch documents from folder', async () => {
    const service = new GoogleDriveService(mockApiKey);
    const docs = await service.fetchDocuments('test-folder-id');
    expect(docs).toHaveLength(12);
  });

  it('should categorize Micra documents correctly', async () => {
    const service = new GoogleDriveService(mockApiKey);
    const docs = await service.fetchDocuments('test-folder-id');
    const microDocs = docs.filter(d => d.productFamily === 'Micra');
    expect(microDocs.length).toBeGreaterThan(0);
  });
});
```

### Phase 3: Document List Component (Week 2)

#### Test Cases
1. **Test**: DocumentList renders loading state initially
2. **Test**: DocumentList displays all documents after loading
3. **Test**: Each document shows name, category, and file type
4. **Test**: Document list is empty state when no documents
5. **Test**: Error state displays when API fails
6. **Test**: Documents are grouped by category
7. **Test**: Clicking document opens preview/download

#### Implementation
```typescript
// src/components/DocumentList.tsx
import { useEffect, useState } from 'react';
import { ProductDocument } from '../types';
import { googleDriveService } from '../services';

export function DocumentList() {
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Implementation

  return (
    <div className="document-list">
      {/* Render logic */}
    </div>
  );
}
```

#### Test File
```typescript
// src/components/__tests__/DocumentList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { DocumentList } from '../DocumentList';

describe('DocumentList', () => {
  it('renders loading state initially', () => {
    render(<DocumentList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays documents after successful fetch', async () => {
    render(<DocumentList />);
    await waitFor(() => {
      expect(screen.getByText(/Micra VR2 technical specifications/i))
        .toBeInTheDocument();
    });
  });

  it('groups documents by category', async () => {
    render(<DocumentList />);
    await waitFor(() => {
      expect(screen.getByText(/Technical Specifications/i))
        .toBeInTheDocument();
      expect(screen.getByText(/Product Brochure/i))
        .toBeInTheDocument();
    });
  });
});
```

### Phase 4: Search & Filter Component (Week 2-3)

#### Test Cases
1. **Test**: Search input filters documents by name
2. **Test**: Search is case-insensitive
3. **Test**: Category filter shows only selected category
4. **Test**: Multiple filters work together (AND logic)
5. **Test**: Product family filter works correctly
6. **Test**: File type filter (PDF, HTML, etc.) works
7. **Test**: "Clear filters" button resets all filters
8. **Test**: Search debouncing prevents excessive API calls
9. **Test**: No results message appears when filters return empty

#### Implementation
```typescript
// src/components/SearchFilter.tsx
import { useState, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { debounce } from '../utils';

interface SearchFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onFilterChange({ searchQuery: query, category: selectedCategory });
    }, 300),
    [selectedCategory]
  );

  // Implementation
}
```

#### Test File
```typescript
// src/components/__tests__/SearchFilter.test.tsx
describe('SearchFilter', () => {
  it('filters documents by search query', async () => {
    const onFilterChange = vi.fn();
    render(<SearchFilter onFilterChange={onFilterChange} />);

    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'Micra VR2');

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ searchQuery: 'Micra VR2' })
      );
    });
  });
});
```

### Phase 5: Category Navigation (Week 3)

#### Test Cases
1. **Test**: Sidebar shows all unique categories
2. **Test**: Category count badge shows correct number
3. **Test**: Clicking category filters document list
4. **Test**: Active category is visually highlighted
5. **Test**: "All Documents" option shows all
6. **Test**: Responsive sidebar collapses on mobile

#### Implementation
```typescript
// src/components/CategorySidebar.tsx
import { DocumentCategory } from '../types';

interface CategorySidebarProps {
  categories: Array<{ name: string; count: number }>;
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategorySidebar({
  categories,
  activeCategory,
  onCategorySelect
}: CategorySidebarProps) {
  return (
    <nav className="category-sidebar">
      <button
        className={activeCategory === 'all' ? 'active' : ''}
        onClick={() => onCategorySelect('all')}
      >
        All Documents
      </button>
      {categories.map(cat => (
        <button
          key={cat.name}
          className={activeCategory === cat.name ? 'active' : ''}
          onClick={() => onCategorySelect(cat.name)}
        >
          {cat.name}
          <span className="badge">{cat.count}</span>
        </button>
      ))}
    </nav>
  );
}
```

### Phase 6: Document Preview Component (Week 3-4)

#### Test Cases
1. **Test**: PDF documents show inline viewer
2. **Test**: Download button is available for all documents
3. **Test**: HTML documents render in iframe
4. **Test**: Document metadata displays (size, date, type)
5. **Test**: "Open in Google Drive" link works
6. **Test**: Modal closes on ESC key or backdrop click
7. **Test**: Loading state while document loads

#### Implementation
```typescript
// src/components/DocumentPreview.tsx
import { FileText, Download, ExternalLink } from 'lucide-react';
import { ProductDocument } from '../types';

interface DocumentPreviewProps {
  document: ProductDocument;
  onClose: () => void;
}

export function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header>
          <h2>{document.name}</h2>
          <div className="actions">
            <a href={document.downloadUrl} download>
              <Download /> Download
            </a>
            <a href={document.viewUrl} target="_blank" rel="noopener">
              <ExternalLink /> Open in Drive
            </a>
          </div>
        </header>

        <div className="preview-container">
          {document.fileType === 'pdf' && (
            <iframe src={document.viewUrl} title={document.name} />
          )}
          {/* Other file type handlers */}
        </div>
      </div>
    </div>
  );
}
```

### Phase 7: Responsive Design & Accessibility (Week 4)

#### Test Cases
1. **Test**: Mobile viewport shows hamburger menu
2. **Test**: Tablet viewport has appropriate breakpoints
3. **Test**: Desktop viewport shows full sidebar
4. **Test**: Keyboard navigation works (Tab, Enter, ESC)
5. **Test**: Screen reader announcements are correct
6. **Test**: Color contrast meets WCAG AA standards
7. **Test**: Focus indicators are visible
8. **Test**: Images have alt text

#### Implementation
- Responsive breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop)
- ARIA labels for all interactive elements
- Semantic HTML (nav, main, article, aside)
- Focus management for modals
- Skip-to-content link

### Phase 8: Performance Optimization (Week 4)

#### Test Cases
1. **Test**: Initial page load < 3 seconds
2. **Test**: Document list virtualizes for 100+ items
3. **Test**: Images lazy load below the fold
4. **Test**: API responses are cached (5 minutes)
5. **Test**: Bundle size < 200KB (gzipped)
6. **Test**: Lighthouse score > 90

#### Implementation
- React.lazy() for code splitting
- Virtual scrolling with `react-window`
- Service worker for offline support
- Image optimization with WebP format
- Memoization of expensive computations

### Phase 9: E2E Testing (Week 4-5)

#### Playwright Test Cases
```typescript
// e2e/product-docs.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Product Documentation Website', () => {
  test('should load and display document list', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.document-list')).toBeVisible();
    await expect(page.locator('.document-item')).toHaveCount(12);
  });

  test('should filter by search query', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="search"]', 'Micra VR2');
    await expect(page.locator('.document-item')).toHaveCount(4);
  });

  test('should open document preview', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Micra VR2 technical specifications');
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('should navigate using keyboard', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    // Verify navigation occurred
  });
});
```

### Phase 10: CI/CD & Deployment (Week 5)

#### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## File Structure

```
product-docs-site/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── CategorySidebar.test.tsx
│   │   │   ├── DocumentList.test.tsx
│   │   │   ├── DocumentPreview.test.tsx
│   │   │   └── SearchFilter.test.tsx
│   │   ├── CategorySidebar.tsx
│   │   ├── DocumentList.tsx
│   │   ├── DocumentPreview.tsx
│   │   └── SearchFilter.tsx
│   ├── services/
│   │   ├── __tests__/
│   │   │   └── googleDrive.service.test.ts
│   │   └── googleDrive.service.ts
│   ├── utils/
│   │   ├── __tests__/
│   │   │   ├── debounce.test.ts
│   │   │   └── fileHelpers.test.ts
│   │   ├── debounce.ts
│   │   └── fileHelpers.ts
│   ├── types/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useDocuments.ts
│   │   └── useSearch.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── e2e/
│   ├── product-docs.spec.ts
│   └── accessibility.spec.ts
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── tailwind.config.js
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

## Environment Variables

```bash
# .env.example
VITE_GOOGLE_DRIVE_API_KEY=your_api_key_here
VITE_GOOGLE_DRIVE_FOLDER_ID=1KuN_YhLOk4KTdORa0rdpG24hLyd4kjfP
VITE_APP_NAME=Medtronic Product Documentation
```

## Google Drive API Setup

### Step 1: Enable Google Drive API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Drive API
4. Create credentials (API Key or Service Account)

### Step 2: Set Folder Permissions
- Ensure the folder `1KuN_YhLOk4KTdORa0rdpG24hLyd4kjfP` is:
  - Publicly readable (for API Key approach), OR
  - Shared with service account email (for Service Account approach)

### Step 3: API Quota & Rate Limiting
- Default quota: 1000 requests/100 seconds/user
- Implement exponential backoff for rate limit errors
- Cache responses for 5 minutes to reduce API calls

## Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables
   - Implement domain restrictions in Google Cloud Console

2. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self';
                  script-src 'self';
                  style-src 'self' 'unsafe-inline';
                  img-src 'self' https://drive.google.com;
                  frame-src https://drive.google.com;">
   ```

3. **Input Validation**
   - Sanitize search queries
   - Validate file IDs before API calls
   - Prevent XSS in document names

## Monitoring & Analytics

1. **Error Tracking**: Sentry or similar
2. **Performance Monitoring**: Web Vitals
3. **User Analytics**: Google Analytics (optional)
4. **API Usage Tracking**: Monitor quota consumption

## Success Metrics

1. **Performance**
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3s
   - Cumulative Layout Shift < 0.1

2. **Testing**
   - Unit test coverage > 80%
   - E2E tests cover all critical paths
   - Zero accessibility violations

3. **User Experience**
   - Mobile responsive on all devices
   - Works offline with service worker
   - Search returns results < 200ms

## Future Enhancements

1. **Advanced Search**
   - Full-text search within PDFs
   - Fuzzy matching
   - Search history

2. **Document Management**
   - Version history
   - Related documents
   - Recently viewed

3. **Collaboration**
   - Share document links
   - Comments/annotations
   - Bookmark documents

4. **Integration**
   - Glean AI search integration
   - CRM integration for sales enablement
   - Analytics on document usage

## Estimated Timeline

- **Week 1**: Setup, infrastructure, Google Drive API integration
- **Week 2**: Document list, search/filter components
- **Week 3**: Category navigation, document preview
- **Week 4**: Responsive design, performance optimization
- **Week 5**: E2E testing, CI/CD, deployment

**Total**: 5 weeks for MVP

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.300.0",
    "googleapis": "^128.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.32",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

## Conclusion

This implementation plan follows TDD principles with comprehensive test coverage at every phase. The architecture is simple yet scalable, focusing on the core requirement of listing and accessing product documentation from Google Drive. By following this plan, the development team will deliver a high-quality, tested, and maintainable product documentation website.

## References

- Product Documentation Folder: https://drive.google.com/drive/folders/1KuN_YhLOk4KTdORa0rdpG24hLyd4kjfP
- Google Drive API Documentation: https://developers.google.com/drive/api/v3/about-sdk
- React Testing Library: https://testing-library.com/react
- Playwright: https://playwright.dev
- Vitest: https://vitest.dev
