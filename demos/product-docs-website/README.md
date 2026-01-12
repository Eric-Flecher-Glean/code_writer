# Product Documentation Website

A test-driven, simple website that lists Medtronic product documentation from Google Drive.

## Overview

This demo showcases a TDD approach to building a documentation portal with:
- Backend API built with Express.js and TypeScript
- Static product documentation metadata
- Comprehensive test coverage with Jest
- RESTful API design
- Future: React frontend (coming soon)

## Project Structure

```
product-docs-website/
├── docs-data/
│   └── docs.json              # Product documentation metadata
├── backend/
│   ├── src/                   # TypeScript source code
│   ├── test/                  # Jest tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.cjs
│   └── README.md
└── frontend/                  # Coming soon: React + Vite
```

## Product Documentation

The system includes documentation for the following Medtronic products:

### Micra Leadless Pacemakers (8 documents)
- Micra VR2 and AV2 technical specifications
- Product brochures and manuals
- Patient education materials
- Regional product pages (EMEA)

### Coronary Products (1 document)
- Complete coronary product catalog

### Hypertension Treatment (1 document)
- Symplicity Spyral renal denervation system

### Reference Data (2 documents)
- Product CSV database
- Data dictionary

**Total: 12 documents**

## Quick Start

### Backend API

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

The API will be available at `http://localhost:4000`

Try it:
```bash
# Get all documents
curl http://localhost:4000/api/docs

# Search for Micra products
curl http://localhost:4000/api/docs?q=Micra

# Filter by category
curl http://localhost:4000/api/docs?category=Micra
```

## Features

### Implemented (Phase 1: Backend)
- ✅ RESTful API with Express.js
- ✅ Document filtering by category and search query
- ✅ TypeScript with strict type checking
- ✅ Comprehensive test coverage (80%+)
- ✅ Test-driven development approach
- ✅ CORS enabled for frontend integration
- ✅ In-memory caching for performance
- ✅ Case-insensitive search

### Coming Soon (Phase 2: Frontend)
- ⏳ React + Vite frontend
- ⏳ Search and filter UI
- ⏳ Document list with categories
- ⏳ PDF preview links
- ⏳ Responsive design
- ⏳ E2E tests with Playwright

## API Documentation

### Endpoints

#### `GET /api/docs`
List all documents or filter by query parameters.

**Query Parameters:**
- `q`: Search query (searches title, category, product_family, tags)
- `category`: Filter by category (case-insensitive)

**Example Response:**
```json
[
  {
    "id": "micra-vr2-technical-specifications",
    "title": "Micra VR2 technical specifications",
    "category": "Micra",
    "product_family": "Leadless Pacemakers",
    "pdf_url": "https://drive.google.com/file/d/...",
    "description": "Technical specifications for Micra VR2...",
    "tags": ["technical", "specs", "vr2"],
    "order": 2
  }
]
```

#### `GET /api/docs/:id`
Get a single document by ID.

**Returns:** Document object or 404 error

## Testing

The project follows strict TDD principles:

### Backend Tests
```bash
cd backend
npm test
```

**Test Coverage:**
- Service layer: `docsService.test.ts`
  - Document loading and caching
  - Sorting algorithms
  - Filter logic (category, search, combined)
  - Edge cases and error handling

- API layer: `docsRoutes.test.ts`
  - HTTP endpoints
  - Query parameter parsing
  - Response status codes
  - CORS headers
  - Error responses

## Development Approach

This project was built using **Test-Driven Development (TDD)**:

1. ✅ Write failing tests first
2. ✅ Implement minimal code to pass tests
3. ✅ Refactor for quality
4. ✅ Repeat

### Phase 1: Backend Implementation ✅

**Story 1: Project Setup & Data Layer**
- Created `docs.json` with 12 product documents
- Set up TypeScript, Jest, Express
- Configured strict type checking

**Story 2: Document Service (TDD)**
- Wrote tests for `getAllDocs()`, `findDocById()`, `filterDocs()`
- Implemented data loading with caching
- Implemented sorting by order + title
- Implemented filtering with AND logic

**Story 3: API Routes (TDD)**
- Wrote Supertest integration tests
- Implemented `GET /api/docs` with query params
- Implemented `GET /api/docs/:id`
- Added CORS support

## Data Source

Product documentation metadata is sourced from:
- Google Drive folder: `1KuN_YhLOk4KTdORa0rdpG24hLyd4kjfP`
- Analyzed using Glean Document Reader
- Curated into `docs-data/docs.json`

## Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Language:** TypeScript 5.x
- **Testing:** Jest + Supertest
- **Code Quality:** Strict TypeScript, ESLint (future)

### Frontend (Planned)
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Testing:** Vitest + React Testing Library + Playwright
- **Styling:** Tailwind CSS

## Contributing

This is a demo project following the implementation plan in `IMPLEMENTATION_PLAN.md`.

## Next Steps

1. **Phase 2**: Frontend Implementation
   - Set up React + Vite project
   - Create components (DocsList, FiltersBar, DocCard)
   - Write component tests
   - Implement responsive design

2. **Phase 3**: Integration
   - Connect frontend to backend API
   - Add E2E tests
   - Performance optimization
   - Deployment configuration

## License

MIT

## Links

- Implementation Plan: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- Backend README: [backend/README.md](./backend/README.md)
- GitHub Repository: [Eric-Flecher-Glean/code_writer](https://github.com/Eric-Flecher-Glean/code_writer)
