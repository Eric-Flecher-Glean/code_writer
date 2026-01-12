# Demo Idea 1 – "Why Did This Medical Device Feature Work This Way?" – Legacy Code Forensics

**Title:** "Why Did This Medical Device Feature Work This Way?" - Legacy Code Forensics

**Scenario:** A product manager receives customer feedback: "Why does the insulin pump require 3-button confirmation for bolus delivery instead of 2 like competitors?" The original engineer left 5 years ago. PM needs to understand the design rationale before proposing changes.

**User Role:** Product Manager (non-technical)

**Demo Question:**  "In the insulin pump bolus delivery code, why is there a 3-step confirmation process? Show me the code comments, commit messages, and any safety-related logic that explains this decision."

**Live Flow:**
- Ask the question to Glean's code search in natural language
- Show results highlighting the confirmation logic with inline comments
- Surface a commit message from 2019: "Added third confirmation per FDA Human Factors guidance - prevent accidental overdose during single-hand operation"
- Find linked Jira ticket: "SAFETY-2847: Patient safety review requires additional confirmation"
- Show how PM now understands this is a regulatory safety requirement, not arbitrary UX

**Business Value:** Product managers can understand design rationale and regulatory constraints before proposing changes, preventing costly redesign cycles and potential compliance violations. Institutional knowledge is preserved even after staff turnover.

**Non-Technical Value Proposition:** "You don't need to read code - just ask why something works the way it does, and get business context, not syntax."

**Risk Notes:** Uses real code search with comments and commit history. Shows business context extraction from technical artifacts. Very compelling for knowledge retention.
