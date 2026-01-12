# Demo Idea 12 – "What Data Flows Through This Integration?" – API Documentation for Sales

**Title:** "What Data Flows Through This Integration?" - API Documentation for Sales

**Scenario:** A sales engineer is in a customer meeting. Customer asks: "What specific data points does your device send to our Epic EMR through the HL7 interface?" Sales engineer needs immediate technical answer.

**User Role:** Sales Engineer (technical enough to understand concepts, but not a developer)

**Demo Question:**  "In the Epic HL7 integration module, what patient data fields are transmitted? Show me the data mapping - what device measurements map to which HL7 segments and fields."

**Live Flow:**
- Search for Epic integration and HL7 message construction
- Show data mapping: Heart Rate → OBX|1|NM|8867-4^Heart Rate
- Highlight transmitted fields: Vitals, device ID, timestamp, alarm status
- Surface data NOT sent: Patient demographics (pulled from Epic, not sent)
- Find configuration options: Customizable data elements per customer

**Business Value:** Sales engineers can answer technical integration questions in real-time during customer meetings, increasing deal velocity and customer confidence without waiting for presales engineering backup.

**Non-Technical Value Proposition:** "When customers ask detailed integration questions, query the actual implementation - get authoritative answers faster than Slack-ing engineering."

**Risk Notes:** Empowers sales teams with technical accuracy. Reduces dependency on engineering for standard questions. User (Eric) will relate to this scenario directly!
