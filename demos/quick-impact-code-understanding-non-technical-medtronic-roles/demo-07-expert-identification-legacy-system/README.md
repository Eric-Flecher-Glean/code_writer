# Demo Idea 7 – "Who Knows About This Legacy System?" – Expert Identification

**Title:** "Who Knows About This Legacy System?" - Expert Identification

**Scenario:** A project manager is planning migration from a 15-year-old patient data archive system. They need to know: "Who has worked on this code recently? Who understands how it works?"

**User Role:** Project Manager (non-technical)

**Demo Question:**  "For the legacy patient data archive system in the /archive/patient-data directory, who has contributed code in the last 3 years? Who wrote the original implementation? Are there any critical components with single points of knowledge?"

**Live Flow:**
- Search code history and contributors for that directory
- Show contributor breakdown: "Original author: Sarah Chen (departed 2018)"
- Identify recent contributors: "Maintained by: James Park (2021-2024, now on different team)"
- Highlight orphaned code: "Critical encryption module: No commits since 2019, 1 contributor (departed)"
- Surface documentation gaps: Files with no comments or docs

**Business Value:** Project managers identify knowledge risks, plan knowledge transfer sessions, and allocate appropriate time/resources for legacy system migration - preventing project delays due to "nobody knows how this works."

**Non-Technical Value Proposition:** "Before planning migrations or deprecations, understand the knowledge landscape - who knows what, and where the risks are."

**Risk Notes:** Shows people + code intersection. Valuable for succession planning and risk management. Can demonstrate with Git history without executing code.
