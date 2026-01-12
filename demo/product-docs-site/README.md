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
   - Unit tests for all service functions (11 tests passing)

2. **Story 2: Express API**
   - REST API endpoints:
     - `GET /api/docs` - List all docs with optional filtering
     - `GET /api/docs/:id` - Get single document by ID
   - CORS support
   - Integration tests using Supertest (8 tests passing)

3. **Story 3: Frontend Implementation**
   - React + TypeScript + Vite SPA
   - Component architecture:
     - FiltersBar: Search and category filtering
     - DocCard: Individual document display
     - DocsList: List rendering with empty state
     - App: API integration and state management
   - Vite proxy configured for /api routes
   - Component tests with Vitest + RTL (15 tests passing)

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

## Frontend Application

### Installation

```bash
cd frontend
npm install
```

### Running the App

First, start the backend API:
```bash
cd backend
npm run dev  # Runs on http://localhost:4000
```

Then, in a separate terminal, start the frontend:
```bash
cd frontend
npm run dev  # Runs on http://localhost:5173
```

The frontend will proxy API requests to the backend automatically.

### Running Frontend Tests

```bash
cd frontend
npm test
```

All 15 tests pass:
- FiltersBar component tests (4 tests)
- DocsList component tests (4 tests)
- App component tests (7 tests)

### Frontend Architecture

- **FiltersBar**: Search input and category dropdown for filtering documents
- **DocCard**: Displays individual document with title, category, description, and PDF link
- **DocsList**: Renders list of DocCard components or "No documents found" message
- **App**: Main component that fetches from API and manages filter state

## Project Structure

```
demo/product-docs-site/
├── README.md
├── IMPLEMENTATION_PLAN.md
├── docs-data/
│   └── docs.json                    # Product documentation metadata
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.cjs
│   ├── src/
│   │   ├── types/
│   │   │   └── Doc.ts              # TypeScript interface
│   │   ├── services/
│   │   │   └── docsService.ts      # Data access & filtering
│   │   ├── routes/
│   │   │   └── docs.ts             # Express routes
│   │   ├── index.ts                # Express app setup
│   │   └── server.ts               # HTTP server bootstrap
│   └── test/
│       ├── docsService.test.ts     # Service unit tests
│       └── docsRoutes.test.ts      # API integration tests
└── frontend/
    ├── package.json
    ├── vite.config.ts              # Vite config with API proxy
    ├── tsconfig.json
    ├── index.html
    ├── src/
    │   ├── main.tsx                # Entry point
    │   ├── App.tsx                 # Main app component
    │   ├── types/
    │   │   └── Doc.ts              # TypeScript interface
    │   ├── components/
    │   │   ├── FiltersBar.tsx      # Search and category filters
    │   │   ├── DocCard.tsx         # Individual document display
    │   │   └── DocsList.tsx        # Document list renderer
    │   └── tests/
    │       ├── setup.ts            # Test configuration
    │       ├── FiltersBar.test.tsx # FiltersBar tests
    │       ├── DocsList.test.tsx   # DocsList tests
    │       └── App.test.tsx        # App integration tests
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

### Frontend Tests

- ✅ **FiltersBar Component** (4 tests)
  - Renders search input and category select
  - Calls onSearchChange when typing
  - Calls onCategoryChange when selecting
  - Displays all category options

- ✅ **DocsList Component** (4 tests)
  - Renders "No documents found" for empty array
  - Renders correct number of DocCard components
  - Does not show empty state when docs present
  - Renders doc details correctly

- ✅ **App Component** (7 tests)
  - Displays loading state initially
  - Displays docs after successful fetch
  - Displays error message when fetch fails
  - Filters docs when search input changes
  - Filters docs when category changes
  - Renders FiltersBar with extracted categories
  - Shows "No documents found" for empty results

## Test Summary

- **Backend Tests**: 19/19 passing (Jest + Supertest)
  - Service layer: 11 tests
  - API routes: 8 tests
- **Frontend Tests**: 15/15 passing (Vitest + React Testing Library)
  - FiltersBar: 4 tests
  - DocsList: 4 tests
  - App: 7 tests
- **Total**: 34/34 tests passing ✅

## Development Notes

- All code follows TypeScript strict mode
- Backend tests use Jest with ts-jest
- Frontend tests use Vitest with React Testing Library
- API tests use Supertest for HTTP assertions
- CORS is enabled for frontend integration
- Express app is exported separately from server for testability
- Vite proxy configured for seamless frontend-backend integration
