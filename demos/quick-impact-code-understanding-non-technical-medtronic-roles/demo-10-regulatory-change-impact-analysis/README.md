# Demo Idea 10 – "Where Would We Need to Change Code for This Regulatory Update?" – Change Impact Analysis

**Title:** "Where Would We Need to Change Code for This Regulatory Update?" - Change Impact Analysis

**Scenario:** Regulatory affairs announces: "New FDA guidance requires device alarms to persist for minimum 30 seconds, up from 15." Engineering lead needs to scope: "How many places in the code would we need to change?"

**User Role:** Engineering Manager or Regulatory PM (may be non-technical)

**Demo Question:**  "Where in the codebase are alarm duration timeouts defined? Show me all constants, configuration files, and functions that control how long alarms display. Are there multiple alarm types with different timeout values?"

**Live Flow:**
- Search for alarm timeout implementations
- Show multiple locations: ALARM_DISPLAY_DURATION = 15000 // milliseconds
- Find configuration files with timeout settings
- Identify different alarm types: critical (30s), warning (15s), info (5s)
- Surface impact: 12 files across 3 modules would need updates

**Business Value:** Project planners can accurately scope regulatory change requests, estimate effort, identify testing requirements, and provide realistic timelines to regulatory bodies - preventing under-scoped projects.

**Non-Technical Value Proposition:** "Estimate engineering effort for regulatory changes without being an engineer - find all the affected code points automatically."

**Risk Notes:** Shows project scoping with code evidence. Prevents under-estimation. Valuable for any regulatory change (FDA, EU MDR, HIPAA updates).
