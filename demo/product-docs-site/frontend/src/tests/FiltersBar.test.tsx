import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FiltersBar } from "../components/FiltersBar";

describe("FiltersBar", () => {
  it("renders search input and category select", () => {
    const mockOnSearchChange = vi.fn();
    const mockOnCategoryChange = vi.fn();

    render(
      <FiltersBar
        search=""
        category="All"
        categories={["Micra", "Aurora EV-ICD"]}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(
      screen.getByPlaceholderText("Search documents...")
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing in search input", async () => {
    const user = userEvent.setup();
    const mockOnSearchChange = vi.fn();
    const mockOnCategoryChange = vi.fn();

    render(
      <FiltersBar
        search=""
        category="All"
        categories={["Micra"]}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search documents...");
    await user.type(searchInput, "test");

    expect(mockOnSearchChange).toHaveBeenCalled();
    expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
    // Each character triggers a change, final value is cumulative
    const lastCallValue = mockOnSearchChange.mock.calls[mockOnSearchChange.mock.calls.length - 1][0];
    expect(lastCallValue).toBe("t");
  });

  it("calls onCategoryChange when selecting a category", async () => {
    const user = userEvent.setup();
    const mockOnSearchChange = vi.fn();
    const mockOnCategoryChange = vi.fn();

    render(
      <FiltersBar
        search=""
        category="All"
        categories={["Micra", "Aurora EV-ICD"]}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "Micra");

    expect(mockOnCategoryChange).toHaveBeenCalledWith("Micra");
  });

  it("displays all category options", () => {
    const mockOnSearchChange = vi.fn();
    const mockOnCategoryChange = vi.fn();
    const categories = ["Micra", "Aurora EV-ICD", "PulseSelect"];

    render(
      <FiltersBar
        search=""
        category="All"
        categories={categories}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText("All Categories")).toBeInTheDocument();
    categories.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });
});
