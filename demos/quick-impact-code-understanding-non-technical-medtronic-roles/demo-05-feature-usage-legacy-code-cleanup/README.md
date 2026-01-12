# Demo Idea 5 – "Is This Feature Actually Being Used?" – Legacy Code Cleanup Decision

**Title:** "Is This Feature Actually Being Used?" - Legacy Code Cleanup Decision

**Scenario:** Engineering wants to deprecate an old "manual calibration" feature to reduce maintenance burden. Product manager needs to know: "Is any customer still using this? What would break if we remove it?"

**User Role:** Product Manager (non-technical)

**Demo Question:**  "Where is the manual calibration feature called in the codebase? Are there any customer-specific configurations, special workflows, or integrations that depend on it? Show me if it's deprecated, marked as legacy, or actively maintained."

**Live Flow:**
- Search for manual calibration references across codebase
- Show code comments: "// DEPRECATED - Retained for Customer XYZ contractual requirement"
- Find configuration files with customer-specific flags
- Surface recent commits: Last modified 3 years ago vs. active features modified last week
- Identify hard dependencies in integration code

**Business Value:** Product managers make informed deprecation decisions based on actual usage data and dependencies, avoiding customer disruptions and contractual violations while safely reducing technical debt.

**Non-Technical Value Proposition:** "Before deprecating features, understand who still depends on them - ask the codebase, not just the team's institutional memory."

**Risk Notes:** Shows strategic product decisions enabled by code understanding. Prevents costly customer escalations. Clear ROI in technical debt reduction.
