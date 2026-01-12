import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { Doc } from "../types/Doc";

const mockDocs: Doc[] = [
  {
    id: "micra-vr2",
    title: "Micra VR2 specifications",
    category: "Micra",
    product_family: "Leadless Pacemakers",
    pdf_url: "https://example.com/micra.pdf",
    description: "Technical specifications",
  },
  {
    id: "aurora",
    title: "Aurora EV-ICD brochure",
    category: "Aurora EV-ICD",
    product_family: "ICDs",
    pdf_url: "https://example.com/aurora.pdf",
  },
];

describe("App", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("displays loading state initially", () => {
    global.fetch = vi.fn(() =>
      new Promise(() => {}) // Never resolves to keep loading state
    ) as any;

    render(<App />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays docs after successful fetch", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDocs),
      })
    ) as any;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Micra VR2 specifications")).toBeInTheDocument();
    });

    expect(screen.getByText("Aurora EV-ICD brochure")).toBeInTheDocument();
  });

  it("displays error message when fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as any;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it("filters docs when search input changes", async () => {
    const user = userEvent.setup();

    // Mock all fetch calls
    global.fetch = vi.fn((url) => {
      return Promise.resolve({
        ok: true,
        json: () => {
          if (url.includes("q=Micra")) {
            return Promise.resolve([mockDocs[0]]); // Only Micra doc
          }
          return Promise.resolve(mockDocs);
        },
      });
    }) as any;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Micra VR2 specifications")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search documents...");
    await user.type(searchInput, "Micra");

    await waitFor(() => {
      const calls = (global.fetch as any).mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall).toBe("/api/docs?q=Micra");
    });
  });

  it("filters docs when category changes", async () => {
    const user = userEvent.setup();

    // Mock all fetch calls
    global.fetch = vi.fn((url) => {
      return Promise.resolve({
        ok: true,
        json: () => {
          if (url.includes("category=Micra")) {
            return Promise.resolve([mockDocs[0]]); // Only Micra doc
          }
          return Promise.resolve(mockDocs);
        },
      });
    }) as any;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Micra VR2 specifications")).toBeInTheDocument();
    });

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "Micra");

    await waitFor(() => {
      const calls = (global.fetch as any).mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall).toBe("/api/docs?category=Micra");
    });
  });

  it("renders FiltersBar with extracted categories", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDocs),
      })
    ) as any;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Aurora EV-ICD")).toBeInTheDocument();
    });

    // Categories should be in the select dropdown
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });

  it("shows 'No documents found' when API returns empty array", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as any;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("No documents found")).toBeInTheDocument();
    });
  });
});
