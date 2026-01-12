# Glean Search Integration Plan

## 📝 Quick Answers to Your Questions

### Q1: "My data is already in Google Drive - do I need to index it?"
**❌ NO!** If your Glean instance already has Google Drive connected, your docs are already indexed and searchable. You can skip all the indexing code and go straight to adding the search UI.

### Q2: "Do I need an API key or can my logged-in user authenticate?"
**✅ BOTH OPTIONS WORK!**

| Option | API Key Required? | Best For |
|--------|------------------|----------|
| **SSO Auth** | ❌ No API key needed! | Internal apps where users have Glean accounts |
| **Token-Based** | ⚠️ Yes (backend only) | Public sites or guest access |

**Recommendation**: Start with **SSO Auth** (no API key) - it's 5 minutes to implement!

---

## Overview

This document outlines the implementation plan for integrating Glean search into the Product Docs Site.

### ✅ Your Situation (Simplified Approach)

Since your product docs are **already in Google Drive** and Glean is likely already indexing GDrive:
- ❌ **NO INDEXING NEEDED** - Your docs are already searchable in Glean
- ✅ **JUST ADD FRONTEND SEARCH** - You only need to integrate the search UI
- ✅ **TWO AUTH OPTIONS** - SSO (no API key) or Token-based (needs backend API key)

## What You'll Get

- **Search your product docs** - Already indexed via Google Drive connector
- **Search ALL enterprise content** - Confluence, Slack, emails, etc.
- **AI-powered results** - Glean's intelligent ranking
- **Chat/Assistant** - Ask questions about your docs

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Product Docs Frontend                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Option A: Web SDK     │  Option B: Custom Search UI  │  │
│  │  (Modal/Embedded)      │  (Full Control)              │  │
│  └──────────────┬──────────┴────────────┬────────────────┘  │
└─────────────────┼────────────────────────┼──────────────────┘
                  │                        │
                  ▼                        ▼
         ┌────────────────┐      ┌─────────────────┐
         │  Glean Web SDK │      │  Glean Search   │
         │  (JavaScript)  │      │  API (REST)     │
         └────────┬───────┘      └────────┬────────┘
                  │                        │
                  └────────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │   Glean Backend      │
                    │   Search Index       │
                    └──────────────────────┘
                               ▲
                               │
                    ┌──────────┴───────────┐
                    │  Indexing Pipeline   │
                    │  (Node.js Script)    │
                    └──────────────────────┘
                               ▲
                               │
                    ┌──────────┴───────────┐
                    │  docs-data/docs.json │
                    └──────────────────────┘
```

## Prerequisites

### 1. Glean Setup
- [ ] Access to your Glean instance (e.g., `medtronic.glean.com`)
- [ ] Confirm Google Drive is connected to Glean
- [ ] Verify you can search your docs in Glean web app

### 2. Choose Your Authentication Method

#### Option 1: SSO Authentication (Recommended - Easiest)
**✅ NO API KEY NEEDED!**

- Users log in with their existing Glean account via SSO
- Frontend automatically handles authentication
- Best for internal enterprise apps
- Works if users already have Glean access

**Requirements:**
- Users must have Glean accounts
- Your company uses SSO (Google, Okta, Azure AD, etc.)
- Third-party cookies must be enabled in browser

**Environment Variables (.env):**
```bash
# frontend/.env
VITE_GLEAN_INSTANCE=medtronic
VITE_GLEAN_BACKEND=https://medtronic-be.glean.com
VITE_GLEAN_APP_DOMAIN=medtronic.glean.com
```

#### Option 2: Token-Based Authentication (For Public/Guest Access)
**⚠️ API KEY REQUIRED (Backend Only)**

- Your backend fetches tokens from Glean
- Frontend never sees the API key
- Users don't need Glean accounts
- Works with third-party cookies blocked

**Requirements:**
- Glean admin access to create API tokens
- Backend server to fetch tokens

**Environment Variables (.env):**
```bash
# backend/.env
GLEAN_CLIENT_API_TOKEN=your_client_token_here
GLEAN_INSTANCE=medtronic
PORT=4000

# frontend/.env
VITE_GLEAN_INSTANCE=medtronic
VITE_GLEAN_BACKEND=https://medtronic-be.glean.com
VITE_GLEAN_APP_DOMAIN=medtronic.glean.com
```

---

## ⏭️ SKIP Part 1: Indexing (Not Needed)

**Your docs are already in Glean via Google Drive!**

You can skip directly to Part 2 (Frontend Integration).

If later you want to index additional metadata or custom fields, see the original indexing section at the end of this document.

---

## Part 1 (Alternative): Verify Your Docs Are Searchable

### Quick Test

1. Go to your Glean instance: `https://medtronic.glean.com` (or your domain)
2. Search for one of your product doc titles
3. ✅ If you see results from Google Drive → You're ready to integrate!
4. ❌ If not → Check with your Glean admin to enable Google Drive connector

---

## 🚀 QUICK START: 5-Minute SSO Integration

For users who already have Glean accounts, this is the fastest way to get started:

```bash
cd frontend
npm install @gleanwork/web-sdk
```

Add this to `frontend/.env`:
```bash
VITE_GLEAN_APP_DOMAIN=medtronic.glean.com  # Replace with your domain
```

Create `frontend/src/components/GleanSearchSSO.tsx`:
```typescript
import { useEffect, useRef } from 'react';

export function GleanSearchSSO() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://${import.meta.env.VITE_GLEAN_APP_DOMAIN}/embedded-search-latest.min.js`;
    script.defer = true;

    script.onload = () => {
      const GleanWebSDK = (window as any).GleanWebSDK;
      if (GleanWebSDK && containerRef.current) {
        // SSO is the default - no authMethod needed!
        GleanWebSDK.attach(containerRef.current);
      }
    };

    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  return <div ref={containerRef} style={{ width: '100%' }} />;
}
```

Add to your `App.tsx`:
```typescript
import { GleanSearchSSO } from './components/GleanSearchSSO';

// Add anywhere in your app
<GleanSearchSSO />
```

**That's it!** Users click the search box → SSO login → Start searching.

---

## Part 2: Complete Frontend Integration

Choose based on your authentication needs:
- **Section 2A**: SSO Authentication (no API key needed)
- **Section 2B**: Token-Based Authentication (needs backend API key)

### Original Indexing Code (For Reference)

If you later decide you need custom indexing beyond Google Drive, here's how:

### Step 1.1: Install Dependencies

```bash
cd backend
npm install @gleanwork/api-client dotenv
npm install --save-dev @types/dotenv
```

### Step 1.2: Create Datasource Configuration

Create `backend/src/glean/datasourceConfig.ts`:

```typescript
import { Glean } from '@gleanwork/api-client';

export interface DatasourceConfig {
  name: string;
  displayName: string;
  datasourceCategory: 'PUBLISHED_CONTENT';
  urlRegex: string;
  isUserReferencedByEmail: boolean;
}

export const productDocsDatasource: DatasourceConfig = {
  name: 'medtronic-product-docs',
  displayName: 'Product Documentation',
  datasourceCategory: 'PUBLISHED_CONTENT',
  urlRegex: '^https://drive\\.google\\.com/.*',
  isUserReferencedByEmail: true
};

export async function createDatasource(client: Glean): Promise<void> {
  try {
    // Note: You only need to run this ONCE to create the datasource
    // After creation, comment this out or add a check
    console.log('Creating datasource:', productDocsDatasource.displayName);

    // This endpoint may vary - check Glean API docs for exact method
    // await client.indexing.addDatasource(productDocsDatasource);

    console.log('✓ Datasource created successfully');
  } catch (error) {
    console.error('Error creating datasource:', error);
    throw error;
  }
}
```

### Step 1.3: Create Indexing Service

Create `backend/src/glean/indexingService.ts`:

```typescript
import { Glean } from '@gleanwork/api-client';
import { Doc } from '../types/Doc';

interface GleanDocument {
  datasource: string;
  objectType: string;
  id: string;
  title: string;
  body: {
    mimeType: string;
    textContent: string;
  };
  permissions: {
    allowAnonymousAccess: boolean;
  };
  viewURL: string;
  customProperties?: Array<{
    name: string;
    value: string;
  }>;
}

export class GleanIndexingService {
  private client: Glean;
  private datasourceName: string;

  constructor(apiToken: string, instance: string) {
    this.client = new Glean({
      apiToken,
      instance
    });
    this.datasourceName = 'medtronic-product-docs';
  }

  /**
   * Convert our Doc format to Glean's document format
   */
  private convertToGleanDocument(doc: Doc): GleanDocument {
    // Create searchable text from all fields
    const searchableText = [
      doc.title,
      doc.description || '',
      doc.category,
      doc.product_family,
      ...(doc.tags || [])
    ].join(' ');

    return {
      datasource: this.datasourceName,
      objectType: 'ProductDocument',
      id: doc.id,
      title: doc.title,
      body: {
        mimeType: 'text/plain',
        textContent: searchableText
      },
      permissions: {
        allowAnonymousAccess: true // Adjust based on your security requirements
      },
      viewURL: doc.pdf_url,
      customProperties: [
        { name: 'category', value: doc.category },
        { name: 'product_family', value: doc.product_family },
        ...(doc.tags || []).map(tag => ({ name: 'tag', value: tag }))
      ]
    };
  }

  /**
   * Index a single document to Glean
   */
  async indexDocument(doc: Doc): Promise<void> {
    const gleanDoc = this.convertToGleanDocument(doc);

    try {
      await this.client.indexing.indexDocument({
        document: gleanDoc
      });
      console.log(`✓ Indexed: ${doc.title}`);
    } catch (error) {
      console.error(`✗ Failed to index ${doc.title}:`, error);
      throw error;
    }
  }

  /**
   * Index all documents in bulk
   */
  async indexAllDocuments(docs: Doc[]): Promise<void> {
    console.log(`Starting bulk index of ${docs.length} documents...`);

    let successful = 0;
    let failed = 0;

    for (const doc of docs) {
      try {
        await this.indexDocument(doc);
        successful++;
      } catch (error) {
        failed++;
      }
    }

    console.log(`\nIndexing complete:`);
    console.log(`  ✓ Successful: ${successful}`);
    console.log(`  ✗ Failed: ${failed}`);
  }

  /**
   * Delete a document from Glean index
   */
  async deleteDocument(docId: string): Promise<void> {
    try {
      await this.client.indexing.deleteDocument({
        datasource: this.datasourceName,
        objectType: 'ProductDocument',
        docId
      });
      console.log(`✓ Deleted: ${docId}`);
    } catch (error) {
      console.error(`✗ Failed to delete ${docId}:`, error);
      throw error;
    }
  }
}
```

### Step 1.4: Create Indexing Script

Create `backend/src/scripts/indexToGlean.ts`:

```typescript
import * as dotenv from 'dotenv';
import { getAllDocs } from '../services/docsService';
import { GleanIndexingService } from '../glean/indexingService';

// Load environment variables
dotenv.config();

async function main() {
  const apiToken = process.env.GLEAN_INDEXING_API_TOKEN;
  const instance = process.env.GLEAN_INSTANCE;

  if (!apiToken || !instance) {
    console.error('Error: Missing required environment variables');
    console.error('Please set: GLEAN_INDEXING_API_TOKEN, GLEAN_INSTANCE');
    process.exit(1);
  }

  try {
    // Initialize Glean indexing service
    const indexingService = new GleanIndexingService(apiToken, instance);

    // Get all docs from our data store
    const docs = getAllDocs();
    console.log(`Found ${docs.length} documents to index\n`);

    // Index all documents
    await indexingService.indexAllDocuments(docs);

    console.log('\n✓ Indexing completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Go to Glean admin console');
    console.log('2. Enable the "Product Documentation" datasource');
    console.log('3. Make it visible to users or test groups');
  } catch (error) {
    console.error('\n✗ Indexing failed:', error);
    process.exit(1);
  }
}

main();
```

### Step 1.5: Add NPM Scripts

Update `backend/package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "glean:index": "ts-node src/scripts/indexToGlean.ts",
    "glean:create-datasource": "ts-node src/glean/datasourceConfig.ts"
  }
}
```

### Step 1.6: Run Indexing

```bash
# First time only: Create the datasource
npm run glean:create-datasource

# Index all documents
npm run glean:index
```

### Step 1.7: Enable in Glean Admin

1. Go to `https://{instance}.glean.com/admin/datasources`
2. Find "Product Documentation" datasource
3. Enable it for "All teammates" or "Test group only"
4. Documents should appear in search within a few minutes

---

## Part 2A: SSO Authentication (Full Implementation)

This section expands on the 5-minute quick start with full customization options.

### Benefits of SSO Auth
- ✅ No API keys needed
- ✅ Leverages existing Glean user accounts
- ✅ Automatic permission enforcement
- ✅ Zero backend code required

### Option A: Web SDK Integration (Recommended - Easiest)

### Benefits
- ✅ Fastest implementation (minimal code)
- ✅ Pre-built UI components
- ✅ Automatic updates from Glean
- ✅ Multiple display options (modal, sidebar, embedded)
- ✅ Built-in chat/assistant support

### A.1: Install Dependencies

```bash
cd frontend
npm install @gleanwork/web-sdk
```

### A.2: Create Glean Search Component

Create `frontend/src/components/GleanSearch.tsx`:

```typescript
import { useEffect, useRef } from 'react';

interface GleanSearchProps {
  variant?: 'modal' | 'embedded' | 'sidebar';
}

export function GleanSearch({ variant = 'modal' }: GleanSearchProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically load Glean SDK
    const script = document.createElement('script');
    script.src = `https://${import.meta.env.VITE_GLEAN_APP_DOMAIN}/embedded-search-latest.min.js`;
    script.defer = true;

    script.onload = () => {
      const GleanWebSDK = (window as any).GleanWebSDK;

      if (!GleanWebSDK) {
        console.error('Glean Web SDK failed to load');
        return;
      }

      const options = {
        // SSO is default - no authMethod or authToken needed!
        backend: import.meta.env.VITE_GLEAN_BACKEND,
        customizations: {
          features: {
            chatMenu: true,
            feedback: true,
          },
          container: {
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
          }
        }
      };

      // Render based on variant
      if (variant === 'modal' && containerRef.current) {
        GleanWebSDK.attach(containerRef.current, options);
      } else if (variant === 'embedded' && containerRef.current) {
        GleanWebSDK.renderSearchBox(containerRef.current, options);
      } else if (variant === 'sidebar') {
        GleanWebSDK.renderSidebar(options);
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [variant]);

  if (variant === 'sidebar') {
    return null; // Sidebar renders itself
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: variant === 'embedded' ? '400px' : 'auto'
      }}
    />
  );
}
```

### A.3: Add to Main App

Update `frontend/src/App.tsx`:

```typescript
import { GleanSearch } from './components/GleanSearch';

// Add before the existing search bar
<div style={{ marginBottom: '20px' }}>
  <h2>Enhanced Search (Glean)</h2>
  <GleanSearch variant="modal" />
</div>

<div style={{ marginBottom: '20px' }}>
  <h2>Basic Search (Local Docs Only)</h2>
  <FiltersBar
    search={search}
    category={category}
    categories={categories}
    onSearchChange={setSearch}
    onCategoryChange={setCategory}
  />
</div>
```

### A.4: Variant Options

**Modal Search** (Simple overlay):
```typescript
<GleanSearch variant="modal" />
```

**Embedded Search** (Full search page):
```typescript
<GleanSearch variant="embedded" />
```

**Sidebar** (Floating sidebar):
```typescript
<GleanSearch variant="sidebar" />
```

---

## Part 2B: Token-Based Authentication (Backend Required)

Use this approach when:
- Users don't have Glean accounts
- You want seamless auth without SSO popup
- Third-party cookies are blocked
- Building public-facing docs site

### Token-Based Web SDK

You'll need to add a backend endpoint that fetches tokens from Glean.

#### Step 2B.1: Create Backend Token Endpoint

Create `backend/src/routes/glean.ts`:

```typescript
import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

// Endpoint to fetch Glean auth token
router.post('/api/glean/token', async (req, res) => {
  const apiToken = process.env.GLEAN_CLIENT_API_TOKEN;
  const instance = process.env.GLEAN_INSTANCE;

  if (!apiToken || !instance) {
    return res.status(500).json({ error: 'Glean not configured' });
  }

  try {
    const response = await fetch(
      `https://${instance}-be.glean.com/rest/api/v1/createauthtoken`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Glean API error: ${response.status}`);
    }

    const data = await response.json();
    res.json({ token: data.token, expiresAt: data.expiresAt });
  } catch (error) {
    console.error('Error fetching Glean token:', error);
    res.status(500).json({ error: 'Failed to fetch Glean token' });
  }
});

export default router;
```

Register the route in `backend/src/index.ts`:
```typescript
import gleanRoutes from './routes/glean';

app.use(gleanRoutes);
```

#### Step 2B.2: Update Frontend Component

Create `frontend/src/components/GleanSearchToken.tsx`:

```typescript
import { useEffect, useRef, useState } from 'react';

export function GleanSearchToken() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Fetch token from backend
  const fetchToken = async () => {
    try {
      const response = await fetch('/api/glean/token', { method: 'POST' });
      const data = await response.json();
      setAuthToken(data.token);
      return data.token;
    } catch (error) {
      console.error('Failed to fetch Glean token:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (!authToken || !containerRef.current) return;

    const script = document.createElement('script');
    script.src = `https://${import.meta.env.VITE_GLEAN_APP_DOMAIN}/embedded-search-latest.min.js`;
    script.defer = true;

    script.onload = () => {
      const GleanWebSDK = (window as any).GleanWebSDK;
      if (GleanWebSDK && containerRef.current) {
        GleanWebSDK.attach(containerRef.current, {
          authMethod: 'token',
          authToken: authToken,
          backend: import.meta.env.VITE_GLEAN_BACKEND,
          onAuthTokenRequired: fetchToken  // Refresh when token expires
        });
      }
    };

    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [authToken]);

  return <div ref={containerRef} style={{ width: '100%' }} />;
}
```

---

## Part 2C: Custom Search API Integration (Advanced)

### Benefits
- ✅ Complete UI/UX control
- ✅ Custom result rendering
- ✅ Combine local + Glean results
- ✅ Advanced filtering logic
- ✅ Custom analytics/tracking

### B.1: Install Dependencies

```bash
cd frontend
npm install @gleanwork/api-client
```

### B.2: Create Glean API Client

Create `frontend/src/services/gleanClient.ts`:

```typescript
import { Glean } from '@gleanwork/api-client';

export const gleanClient = new Glean({
  apiToken: import.meta.env.VITE_GLEAN_CLIENT_API_TOKEN,
  instance: import.meta.env.VITE_GLEAN_INSTANCE
});
```

### B.3: Create Search Service

Create `frontend/src/services/gleanSearchService.ts`:

```typescript
import { gleanClient } from './gleanClient';

export interface GleanSearchResult {
  title: string;
  url: string;
  snippet: string;
  datasource: string;
  lastModified?: string;
  relevanceScore?: number;
}

export interface GleanSearchOptions {
  query: string;
  pageSize?: number;
  datasources?: string[]; // Filter to specific sources
  facetFilters?: Array<{
    facetName: string;
    values: string[];
  }>;
}

export class GleanSearchService {
  /**
   * Search across Glean index
   */
  async search(options: GleanSearchOptions): Promise<GleanSearchResult[]> {
    const { query, pageSize = 20, datasources, facetFilters = [] } = options;

    // Add datasource filter if specified
    if (datasources && datasources.length > 0) {
      facetFilters.push({
        facetName: 'datasource',
        values: datasources
      });
    }

    try {
      const response = await gleanClient.client.search.search({
        query,
        pageSize,
        requestOptions: {
          facetFilters
        }
      });

      return (response.results || []).map(result => ({
        title: result.title || 'Untitled',
        url: result.url || '#',
        snippet: result.snippet || '',
        datasource: result.datasource || 'unknown',
        lastModified: result.lastModified,
        relevanceScore: result.relevanceScore
      }));
    } catch (error) {
      console.error('Glean search error:', error);
      throw error;
    }
  }

  /**
   * Search only product docs
   */
  async searchProductDocs(query: string): Promise<GleanSearchResult[]> {
    return this.search({
      query,
      datasources: ['medtronic-product-docs']
    });
  }

  /**
   * Search all enterprise content
   */
  async searchAll(query: string): Promise<GleanSearchResult[]> {
    return this.search({ query });
  }

  /**
   * Autocomplete suggestions
   */
  async autocomplete(partialQuery: string): Promise<string[]> {
    try {
      const response = await gleanClient.client.search.autocomplete({
        query: partialQuery,
        maxResults: 5
      });

      return (response.suggestions || []).map(s => s.text || '');
    } catch (error) {
      console.error('Glean autocomplete error:', error);
      return [];
    }
  }
}

export const gleanSearchService = new GleanSearchService();
```

### B.4: Create Enhanced Search Component

Create `frontend/src/components/EnhancedSearch.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { gleanSearchService, GleanSearchResult } from '../services/gleanSearchService';
import { Doc } from '../types/Doc';

interface EnhancedSearchProps {
  onResultClick?: (result: GleanSearchResult) => void;
}

export function EnhancedSearch({ onResultClick }: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GleanSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchScope, setSearchScope] = useState<'docs' | 'all'>('docs');

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const searchResults = searchScope === 'docs'
          ? await gleanSearchService.searchProductDocs(query)
          : await gleanSearchService.searchAll(query);

        setResults(searchResults);
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [query, searchScope]);

  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search with Glean..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #4A90E2',
            borderRadius: '6px',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ marginRight: '20px' }}>
          <input
            type="radio"
            value="docs"
            checked={searchScope === 'docs'}
            onChange={() => setSearchScope('docs')}
          />
          {' '}Product Docs Only
        </label>
        <label>
          <input
            type="radio"
            value="all"
            checked={searchScope === 'all'}
            onChange={() => setSearchScope('all')}
          />
          {' '}All Enterprise Content
        </label>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Searching...
        </div>
      )}

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fee',
          color: '#c00',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
            Found {results.length} results
          </h3>
          {results.map((result, idx) => (
            <div
              key={idx}
              onClick={() => onResultClick?.(result)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: '#fff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#4A90E2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#4A90E2', textDecoration: 'none' }}
                >
                  {result.title}
                </a>
              </h4>
              {result.snippet && (
                <p style={{ margin: '0 0 8px 0', color: '#555', fontSize: '14px' }}>
                  {result.snippet}
                </p>
              )}
              <div style={{ fontSize: '12px', color: '#999' }}>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '3px',
                  marginRight: '8px'
                }}>
                  {result.datasource}
                </span>
                {result.lastModified && (
                  <span>Updated: {new Date(result.lastModified).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
```

### B.5: Integrate into App

Update `frontend/src/App.tsx`:

```typescript
import { EnhancedSearch } from './components/EnhancedSearch';

function App() {
  // ... existing state ...

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>
        Product Documentation
      </h1>

      {/* Enhanced Glean Search */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px' }}>
          🔍 Enhanced Search
        </h2>
        <EnhancedSearch
          onResultClick={(result) => {
            console.log('Clicked:', result);
            window.open(result.url, '_blank');
          }}
        />
      </div>

      {/* Existing local search */}
      <div>
        <h2 style={{ marginBottom: '15px', fontSize: '18px' }}>
          📄 Browse All Docs
        </h2>
        <FiltersBar
          search={search}
          category={category}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />

        {/* ... rest of existing code ... */}
      </div>
    </div>
  );
}
```

---

## Testing Strategy

### 1. Backend Indexing Tests

Create `backend/test/glean/indexingService.test.ts`:

```typescript
import { GleanIndexingService } from '../../src/glean/indexingService';
import { Doc } from '../../src/types/Doc';

describe('GleanIndexingService', () => {
  const mockDoc: Doc = {
    id: 'test-doc',
    title: 'Test Document',
    category: 'Test',
    product_family: 'Test Family',
    pdf_url: 'https://example.com/test.pdf',
    description: 'Test description',
    tags: ['test', 'mock']
  };

  it('should convert Doc to Glean document format', () => {
    // Test the conversion logic
  });

  it('should handle indexing errors gracefully', async () => {
    // Test error handling
  });

  it('should index multiple documents in sequence', async () => {
    // Test bulk indexing
  });
});
```

### 2. Frontend Search Tests

Create `frontend/src/tests/EnhancedSearch.test.tsx`:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedSearch } from '../components/EnhancedSearch';
import { gleanSearchService } from '../services/gleanSearchService';

// Mock the Glean service
jest.mock('../services/gleanSearchService');

describe('EnhancedSearch', () => {
  it('should render search input', () => {
    render(<EnhancedSearch />);
    expect(screen.getByPlaceholderText(/search with glean/i)).toBeInTheDocument();
  });

  it('should call Glean API when user types', async () => {
    const mockSearch = jest.spyOn(gleanSearchService, 'searchProductDocs');

    render(<EnhancedSearch />);
    const input = screen.getByPlaceholderText(/search with glean/i);

    await userEvent.type(input, 'test query');

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('test query');
    });
  });

  it('should display results', async () => {
    const mockResults = [
      {
        title: 'Test Doc',
        url: 'https://example.com',
        snippet: 'Test snippet',
        datasource: 'product-docs'
      }
    ];

    jest.spyOn(gleanSearchService, 'searchProductDocs')
      .mockResolvedValue(mockResults);

    render(<EnhancedSearch />);
    const input = screen.getByPlaceholderText(/search with glean/i);

    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('Test Doc')).toBeInTheDocument();
    });
  });
});
```

### 3. Integration Testing Checklist

- [ ] Documents successfully index to Glean
- [ ] Search returns relevant results
- [ ] Filters work correctly (datasource, category)
- [ ] Error handling works for API failures
- [ ] Authentication tokens are valid
- [ ] Results link to correct URLs
- [ ] Performance is acceptable (<2s search)

---

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured in production
- [ ] API tokens created and stored securely
- [ ] Glean datasource created and enabled
- [ ] Initial document indexing completed
- [ ] Tests passing (backend + frontend)

### Production Deployment
- [ ] Backend environment variables set
- [ ] Frontend environment variables set (Vite requires `VITE_` prefix)
- [ ] CORS configured properly
- [ ] API rate limits understood
- [ ] Error monitoring configured
- [ ] Logging configured for search analytics

### Post-Deployment
- [ ] Verify search works in production
- [ ] Monitor API usage and performance
- [ ] Set up automated indexing (cron job or webhook)
- [ ] Train users on new search capabilities
- [ ] Gather feedback and iterate

---

## Decision Matrix

### Authentication Methods Comparison

| Feature | SSO Auth (2A) | Token-Based (2B) | Custom API (2C) |
|---------|---------------|------------------|-----------------|
| **API Key Required** | ❌ None | ⚠️ Backend only | ⚠️ Frontend + Backend |
| **User Login** | SSO popup | Silent/automatic | N/A |
| **Implementation Time** | 5 minutes | 30 minutes | 4-8 hours |
| **Best For** | Internal apps | Public sites | Full customization |
| **Code Complexity** | Very low | Low | Medium |
| **Third-party cookies** | Required | Works without | Works without |

### UI Implementation Comparison

| Feature | Web SDK (2A/2B) | Custom API (2C) |
|---------|-----------------|-----------------|
| **Implementation Time** | 5-30 minutes | 4-8 hours |
| **Code Complexity** | Low | Medium |
| **UI Customization** | Limited | Full control |
| **Maintenance** | Glean handles updates | You maintain UI |
| **Chat/Assistant** | Built-in | Requires additional work |
| **Result Rendering** | Glean's design | Custom design |
| **Recommended For** | Quick POC, standard UX | Custom brand, advanced features |

---

## Recommended Approach (Updated for Your Scenario)

### ⚡ Fast Track: SSO Authentication (Recommended)

**Day 1 (15 minutes)**
1. ✅ Verify docs are searchable in Glean web app
2. ✅ Install Web SDK: `npm install @gleanwork/web-sdk`
3. ✅ Add environment variable: `VITE_GLEAN_APP_DOMAIN`
4. ✅ Copy the Quick Start component (GleanSearchSSO)
5. ✅ Add to your App.tsx

**Done!** Users click search → SSO login → Search all enterprise content

### 🔧 If You Need Token-Based (Alternative Path)

**Week 1: Basic Implementation**
1. Create backend API token endpoint
2. Implement GleanSearchToken component
3. Test token refresh flow
4. Deploy and validate

### 🚀 Future Enhancements (Optional)

**Phase 2: UI Customization**
- Customize search result rendering
- Add category filters specific to your docs
- Implement search analytics tracking
- Add autocomplete suggestions

**Phase 3: Advanced Features**
- Integrate Glean Assistant/Chat
- Build custom search dashboard
- Add A/B testing for relevance
- Implement result caching

### 💡 Hybrid Approach (Best of Both)

Keep your existing local search for simple filtering, add Glean for:
- Enterprise-wide search across all data sources
- AI-powered semantic search
- Chat/Q&A interface
- Advanced filters and facets

```typescript
// Show both options in your UI
<div>
  <h3>Quick Filter (Local)</h3>
  <FiltersBar ... />  {/* Your existing component */}

  <h3>Enterprise Search (Powered by Glean)</h3>
  <GleanSearchSSO />  {/* New Glean component */}
</div>
```

---

## Troubleshooting

### Common Issues

**1. "401 Unauthorized" errors**
- Check API token is valid
- Verify token has correct permissions
- Ensure token hasn't expired

**2. Documents not appearing in search**
- Check datasource is enabled in Glean admin
- Wait 5-10 minutes for indexing to complete
- Verify permissions allow users to see docs

**3. CORS errors in frontend**
- Ensure backend CORS is configured
- Check Glean domain is whitelisted
- Verify environment variables are set

**4. Web SDK not loading**
- Check script URL is correct
- Verify app domain matches your Glean instance
- Check browser console for errors

---

## Additional Resources

- [Glean Developer Portal](https://developers.glean.com)
- [Glean Web SDK Docs](https://developers.glean.com/libraries/web-sdk/overview)
- [Glean Search API Docs](https://developers.glean.com/guides/search/overview)
- [Glean Indexing API Docs](https://developers.glean.com/api-info/indexing/getting-started/overview)
- [Authentication Guide](https://developers.glean.com/api-info/client/authentication/overview)

---

## Next Steps

### For SSO Authentication (Recommended - No API Key)

1. ✅ **Verify your docs** - Search for them at your Glean instance
2. ✅ **Install Web SDK** - `npm install @gleanwork/web-sdk`
3. ✅ **Add environment variable** - Just `VITE_GLEAN_APP_DOMAIN`
4. ✅ **Copy Quick Start code** - See "5-Minute SSO Integration" section
5. ✅ **Test** - Users will get SSO login popup

**Total time: 15 minutes** ⚡

### For Token-Based Authentication (If Needed)

1. ✅ **Get API token** from Glean admin console
2. ✅ **Add backend endpoint** - See Part 2B for code
3. ✅ **Update frontend component** - Use GleanSearchToken
4. ✅ **Test token refresh** - Ensure tokens renew before expiry

**Total time: 1-2 hours** 🔧

### For Custom API Integration (Advanced)

1. ✅ **Install API client** - `npm install @gleanwork/api-client`
2. ✅ **Build custom UI** - See Part 2C for examples
3. ✅ **Implement search service** - Custom result rendering
4. ✅ **Add analytics** - Track search behavior

**Total time: 4-8 hours** 🚀

---

## Support Resources

- **Glean Developer Portal**: https://developers.glean.com
- **Web SDK Docs**: https://developers.glean.com/libraries/web-sdk/overview
- **Authentication Guide**: https://developers.glean.com/libraries/web-sdk/authentication/overview
- **Your Glean CSM**: Contact for admin access and configuration help
- **Developer Support**: Available through your Glean instance

---

## Summary

**You asked**:
1. ❓ Do I need to index my data? → ❌ **NO** - Already in GDrive
2. ❓ Do I need an API key? → ✅ **NO** - Use SSO auth (or optional token-based)

**Fastest path**:
- 15 minutes with SSO authentication
- Zero backend code needed
- Just install Web SDK and add one component

**What you get**:
- Search your Google Drive docs
- Search ALL enterprise content (Slack, Confluence, etc.)
- AI-powered results
- Optional chat/assistant interface

For questions or support, contact your Glean customer success team or developer support.
