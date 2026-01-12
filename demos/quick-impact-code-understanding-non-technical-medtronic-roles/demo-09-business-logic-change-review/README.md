# Demo Idea 9 – "What Business Logic Changed in This Module?" – Code Review for Business Stakeholders

**Title:** "What Business Logic Changed in This Module?" - Code Review for Business Stakeholders

**Scenario:** A business analyst hears: "We refactored the pricing calculation module." They need to understand: "Did the actual pricing logic change, or just the code structure? Will customer invoices be affected?"

**User Role:** Business Analyst (non-technical)

**Demo Question:**  "In the recent refactoring of the pricing calculation module (commits from last week), did any business logic change? Show me modifications to discount calculations, tax rules, or pricing tiers - not just code structure changes."

**Live Flow:**
- Search code diffs between old and new versions
- Show structural changes (renamed functions, reorganized files) - NOT business logic
- Highlight business logic changes: discount_threshold changed from 1000 to 1500
- Surface comments: "// Refactoring only - no logic changes per BA approval"
- Identify test changes that might indicate logic modifications

**Business Value:** Business analysts can verify that "technical refactoring" doesn't inadvertently change business rules, preventing revenue leakage, customer billing errors, and contract compliance issues.

**Non-Technical Value Proposition:** "When engineering says 'we just refactored,' verify that business logic stayed intact - ask about business rules, not syntax."

**Risk Notes:** Shows business-technical collaboration. Prevents "accidental" business logic changes. Very practical for finance/billing systems.
