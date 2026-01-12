# Product Docs Listing Site

A test-driven simple web site that lists product PDFs from a curated collection of Medtronic product documentation.

## Overview

This demo implements a backend API for serving and filtering product documentation. The implementation follows test-driven development (TDD) principles with comprehensive unit and integration tests.

## Current Implementation Status

### ✅ Completed Stories

1. **Story 1: Data Layer & Service Logic**
   - Static JSON data store (`docs-data/docs.json`)
   - TypeScript type definitions
   - Document service with filtering and search
   - Unit tests for all service functions

2. **Story 2: Express API**
   - REST API endpoints:
     - `GET /api/docs` - List all docs with optional filtering
     - `GET /api/docs/:id` - Get single document by ID
   - CORS support
   - Integration tests using Supertest

### 📋 Pending Stories

3. **Story 3: Frontend Implementation**
   - React + Vite SPA
   - Search and filter UI
   - Component tests

## Backend API

### Installation

```bash
cd backend
npm install
```

### Running Tests

```bash
npm test
```

All tests pass (19/19):
- Service layer unit tests (11 tests)
- API route integration tests (8 tests)

### Running the API Server

```bash
npm run dev
```

Server will start on `http://localhost:4000`

### API Endpoints

#### GET /api/docs

List all documents with optional filtering.

**Query Parameters:**
- `q` (optional) - Search query for title, category, product_family, or tags
- `category` (optional) - Filter by exact category name

**Examples:**
```bash
# Get all documents
curl http://localhost:4000/api/docs

# Search for "Micra"
curl http://localhost:4000/api/docs?q=Micra

# Filter by category
curl http://localhost:4000/api/docs?category=Micra

# Combine filters
curl http://localhost:4000/api/docs?q=technical&category=Micra
```

#### GET /api/docs/:id

Get a single document by ID.

**Example:**
```bash
curl http://localhost:4000/api/docs/micra-vr2-technical-specifications
```

**Responses:**
- `200 OK` - Returns document object
- `404 Not Found` - Document with given ID doesn't exist

## Project Structure

```
demo/product-docs-site/
├── README.md
├── IMPLEMENTATION_PLAN.md
├── docs-data/
│   └── docs.json                    # Product documentation metadata
└── backend/
    ├── package.json
    ├── tsconfig.json
    ├── jest.config.cjs
    ├── src/
    │   ├── types/
    │   │   └── Doc.ts              # TypeScript interface
    │   ├── services/
    │   │   └── docsService.ts      # Data access & filtering
    │   ├── routes/
    │   │   └── docs.ts             # Express routes
    │   ├── index.ts                # Express app setup
    │   └── server.ts               # HTTP server bootstrap
    └── test/
        ├── docsService.test.ts     # Service unit tests
        └── docsRoutes.test.ts      # API integration tests
```

## Document Schema

Each document in `docs-data/docs.json` has the following structure:

```typescript
{
  id: string;                    // Unique slug identifier
  title: string;                 // Display title
  category: string;              // Product category
  product_family: string;        // Higher-level product grouping
  pdf_url: string;              // Google Drive URL
  description?: string;          // Optional description
  tags?: string[];              // Optional tags for search
  order?: number;               // Optional sort order
}
```

## Test Coverage

### Service Tests (`docsService.test.ts`)
- ✅ `getAllDocs()` returns all documents
- ✅ Documents are sorted by order then title
- ✅ `findDocById()` finds existing documents
- ✅ `findDocById()` returns undefined for unknown IDs
- ✅ `filterDocs()` with no query returns all docs
- ✅ Filter by category (case-insensitive)
- ✅ Filter by search query (title, tags, etc.)
- ✅ Combined category + query filters (AND logic)
- ✅ Empty results for non-matching queries

### API Tests (`docsRoutes.test.ts`)
- ✅ `GET /api/docs` returns 200 and array
- ✅ Documents have correct structure
- ✅ Filter by `q` parameter
- ✅ Filter by `category` parameter
- ✅ Combined filters work correctly
- ✅ Empty array for no matches
- ✅ `GET /api/docs/:id` returns 200 for valid ID
- ✅ `GET /api/docs/:id` returns 404 for invalid ID

## Next Steps

To complete the full implementation:

1. **Frontend (Story 3)**
   - Set up React + Vite + TypeScript
   - Implement `FiltersBar` component
   - Implement `DocsList` and `DocCard` components
   - Write component tests with React Testing Library
   - Connect to backend API

2. **Deployment**
   - Add deployment configuration
   - Environment-specific configs
   - Production build process

## Development Notes

- All code follows TypeScript strict mode
- Tests use Jest with ts-jest
- API tests use Supertest for HTTP assertions
- CORS is enabled for frontend integration
- Express app is exported separately from server for testability
