# Product Documentation Backend API

Express.js API for serving Medtronic product documentation metadata.

## Features

- RESTful API for product documentation
- Filter by category and search query
- TypeScript with strict mode
- Test-driven development with Jest
- CORS enabled for frontend integration

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
npm install
```

## Running the Server

Development mode (with hot reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The API will be available at `http://localhost:4000`

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## API Endpoints

### GET /api/docs

Get all documents or filter by query parameters.

**Query Parameters:**
- `q` (optional): Search query - filters by title, category, product_family, and tags
- `category` (optional): Filter by exact category name (case-insensitive)

**Examples:**
```bash
# Get all documents
curl http://localhost:4000/api/docs

# Search for "Micra"
curl http://localhost:4000/api/docs?q=Micra

# Filter by category
curl http://localhost:4000/api/docs?category=Micra

# Combined filters
curl http://localhost:4000/api/docs?category=Micra&q=VR2
```

**Response:** Array of Document objects
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

### GET /api/docs/:id

Get a single document by ID.

**Parameters:**
- `id`: Document ID (e.g., "micra-vr2-technical-specifications")

**Examples:**
```bash
curl http://localhost:4000/api/docs/micra-vr2-technical-specifications
```

**Response (200):** Single Document object
```json
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
```

**Response (404):** Document not found
```json
{
  "error": "Not found"
}
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts          # Express app configuration
│   ├── server.ts         # HTTP server bootstrap
│   ├── routes/
│   │   └── docs.ts       # Document routes
│   ├── services/
│   │   └── docsService.ts # Data access and filtering
│   └── types/
│       └── Doc.ts        # TypeScript interfaces
├── test/
│   ├── docsService.test.ts  # Service tests
│   └── docsRoutes.test.ts   # Route/API tests
├── package.json
├── tsconfig.json
└── jest.config.cjs
```

## Testing

The backend follows Test-Driven Development (TDD) principles:

1. **Service Tests** (`test/docsService.test.ts`):
   - Document loading and caching
   - Sorting by order and title
   - Filtering by category and search query
   - Case-insensitive search
   - Edge cases (empty queries, non-existent IDs)

2. **Route Tests** (`test/docsRoutes.test.ts`):
   - HTTP status codes
   - Response structure
   - Query parameter handling
   - CORS headers
   - Error responses

Current test coverage: Aiming for 80%+

## Development Notes

- Data is loaded from `../docs-data/docs.json` at startup
- Documents are cached in memory for performance
- All searches are case-insensitive
- Search queries are trimmed automatically
- Category filters are exact match (after lowercasing)
