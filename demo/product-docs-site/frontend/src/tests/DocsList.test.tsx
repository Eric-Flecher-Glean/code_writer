import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DocsList } from "../components/DocsList";
import { Doc } from "../types/Doc";

describe("DocsList", () => {
  it("renders 'No documents found' when docs array is empty", () => {
    render(<DocsList docs={[]} />);

    expect(screen.getByText("No documents found")).toBeInTheDocument();
  });

  it("renders the correct number of DocCard components", () => {
    const mockDocs: Doc[] = [
      {
        id: "doc-1",
        title: "Test Doc 1",
        category: "Test",
        product_family: "Test Family",
        pdf_url: "https://example.com/doc1.pdf",
      },
      {
        id: "doc-2",
        title: "Test Doc 2",
        category: "Test",
        product_family: "Test Family",
        pdf_url: "https://example.com/doc2.pdf",
      },
    ];

    render(<DocsList docs={mockDocs} />);

    expect(screen.getByText("Test Doc 1")).toBeInTheDocument();
    expect(screen.getByText("Test Doc 2")).toBeInTheDocument();
  });

  it("does not render 'No documents found' when docs are present", () => {
    const mockDocs: Doc[] = [
      {
        id: "doc-1",
        title: "Test Doc 1",
        category: "Test",
        product_family: "Test Family",
        pdf_url: "https://example.com/doc1.pdf",
      },
    ];

    render(<DocsList docs={mockDocs} />);

    expect(screen.queryByText("No documents found")).not.toBeInTheDocument();
  });

  it("renders doc details correctly", () => {
    const mockDocs: Doc[] = [
      {
        id: "doc-1",
        title: "Micra VR2 specifications",
        category: "Micra",
        product_family: "Leadless Pacemakers",
        pdf_url: "https://example.com/micra.pdf",
        description: "Technical specifications for Micra VR2",
      },
    ];

    render(<DocsList docs={mockDocs} />);

    expect(screen.getByText("Micra VR2 specifications")).toBeInTheDocument();
    expect(screen.getByText(/Category:/)).toBeInTheDocument();
    expect(screen.getByText(/Product Family:/)).toBeInTheDocument();
    expect(
      screen.getByText("Technical specifications for Micra VR2")
    ).toBeInTheDocument();
    expect(screen.getByText("View PDF")).toBeInTheDocument();
  });
});
