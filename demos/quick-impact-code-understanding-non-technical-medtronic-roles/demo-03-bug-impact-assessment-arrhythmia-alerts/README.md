# Demo Idea 3 – "Which Customers Are Affected by This Bug?" – Impact Assessment

**Title:** "Which Customers Are Affected by This Bug?" - Impact Assessment

**Scenario:** Support escalates a critical bug: "Cardiac monitor freezes when processing arrhythmia alerts." Support manager (non-technical) needs to know: "Is this all customers or just specific device models/firmware versions?"

**User Role:** Support Manager or Incident Commander (non-technical)

**Demo Question:**  "In the arrhythmia alert processing code, are there any device model checks, firmware version dependencies, or configuration flags that would limit which customers experience this issue?"

**Live Flow:**
- Ask the question to code search
- Show conditional logic: if device_model == 'CM-5000' and firmware_version < '3.2.1':
- Highlight configuration dependencies
- Surface comments: "// Legacy models use different processing algorithm"
- Show how this narrows impact to specific customer segment

**Business Value:** Non-technical incident commanders can quickly scope impact, prioritize customer communications, and allocate engineering resources appropriately - turning a "panic escalation" into a targeted response.

**Non-Technical Value Proposition:** "During critical incidents, you can't wait for engineers to analyze code. Ask impact questions immediately and get scoping information in seconds."

**Risk Notes:** Shows business-critical decision making without technical skills. Very relevant for medical device recalls/safety notifications. Time-sensitive value.
