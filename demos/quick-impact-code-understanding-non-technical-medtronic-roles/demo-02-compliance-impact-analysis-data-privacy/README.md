# Demo Idea 2 – "What Customer Data Does This Feature Access?" – Compliance Impact Analysis

**Title:** "What Customer Data Does This Feature Access?" - Compliance Impact Analysis

**Scenario:** A compliance officer needs to complete a Data Privacy Impact Assessment (DPIA) for GDPR. They need to know: "Does our patient monitoring dashboard access or store any personally identifiable health information?"

**User Role:** Privacy/Compliance Officer (non-technical)

**Demo Question:**  "In the patient monitoring dashboard, what personal data fields are accessed, stored, or transmitted? Show me patient names, medical record numbers, dates of birth, addresses, or any PHI being handled."

**Live Flow:**
- Ask the question naturally to code search
- Show results identifying data access points in the codebase
- Highlight: patient.name, patient.mrn, patient.dob fields being queried
- Surface database queries showing PHI storage
- Find API calls transmitting data to external systems
- Show data retention logic (how long data is kept)

**Business Value:** Compliance teams can audit data handling without technical expertise, ensuring GDPR/HIPAA compliance, completing required assessments faster, and identifying privacy risks before regulatory audits.

**Non-Technical Value Proposition:** "Ask compliance questions in plain English - get specific answers about what data your systems touch, without reading thousands of lines of code."

**Risk Notes:** Very high business value for regulated industries. Shows data lineage without deep technical knowledge. Clear, actionable compliance insights.
