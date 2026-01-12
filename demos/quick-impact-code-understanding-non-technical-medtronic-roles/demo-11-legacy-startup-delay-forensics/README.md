# Demo Idea 11 – Legacy Code Forensics: "Why Is There a 30-Second Delay Before Device Startup?"

**Title:** Legacy Code Forensics: "Why Is There a 30-Second Delay Before Device Startup?"

**Scenario:** A UX designer receives customer complaint: "Why does the device take 30 seconds to boot? Competitors boot in 10 seconds." Designer needs historical context before proposing changes.

**User Role:** UX Designer or Customer Experience Manager (non-technical)

**Demo Question:**  "In the device startup sequence, why is there a 30-second initialization delay? Show me code comments, commit history, bug fixes, or safety requirements that explain this timing."

**Live Flow:**
- Search for startup delay implementation
- Show code: sleep(30) // DO NOT REDUCE - See DEVICE-SAFETY-441
- Find linked issue from 2017: "Hardware capacitors require 28-30s stabilization before reliable operation"
- Surface field incident report: "Premature startup caused voltage spike - 3 device failures"
- Highlight comments: "Tested with hardware team - minimum 30s for all environmental conditions"

**Business Value:** Design teams understand engineering constraints and safety requirements before proposing changes, preventing re-introduction of known issues and focusing improvement efforts on actually changeable parameters.

**Non-Technical Value Proposition:** "Before challenging engineering decisions, understand the 'why' - there might be hardware, safety, or field-learned reasons invisible to current team members."

**Risk Notes:** Perfect example of institutional knowledge preservation. Shows cross-functional collaboration value. Prevents repeated mistakes.
