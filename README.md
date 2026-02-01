\# Enterprise Issue Tracking System with SLA



\## 📌 Project Overview

This project is an enterprise-style Issue Tracking System designed to simulate real-world IT support and service request workflows.  

It allows employees to raise issues, support teams to resolve them, and the system automatically tracks SLA compliance and audit history.



This project reflects real production support environments used in ERP and enterprise IT teams.



---



\## 🎯 Key Features

\- Issue creation with priority and category

\- Defined issue lifecycle: OPEN → IN\_PROGRESS → RESOLVED

\- Priority-based SLA calculation

\- SLA status tracking (MET / BREACHED)

\- Status history for audit and analysis

\- RESTful APIs using Node.js

\- MySQL database integration

\- GitHub version control



---



\## 🛠️ Technology Stack

\- Backend: Node.js (Express)

\- Database: MySQL

\- Version Control: Git \& GitHub

\- API Testing: Postman



---



\## 🗂️ Database Design



\### Tables Used

\- `users` – stores employee and support user details

\- `issues` – stores issue information and SLA status

\- `issue\_status\_history` – maintains audit trail of status changes

\- `sla\_rules` – defines SLA hours for each priority



---



\## 🔄 Issue Workflow

1\. Employee raises an issue

2\. Issue status starts as \*\*OPEN\*\*

3\. Support engineer updates status to \*\*IN\_PROGRESS\*\*

4\. Issue is resolved and marked \*\*RESOLVED\*\*

5\. SLA is calculated automatically

6\. SLA result is stored and audited



---



\## ⏱️ SLA Rules



| Priority  | SLA Time |

|----------|----------|

| LOW      | 72 hours |

| MEDIUM   | 48 hours |

| HIGH     | 24 hours |

| CRITICAL | 4 hours  |



---



\## 🔌 API Endpoints



\### Create Issue

\*\*POST\*\* `/issues`



```json

{

&nbsp; "title": "VPN not connecting",

&nbsp; "description": "Unable to connect to company VPN",

&nbsp; "category": "Network",

&nbsp; "priority": "HIGH",

&nbsp; "created\_by": 1

}

Response



Issue created successfully



Update Issue Status



PUT /issues/{id}/status



{

&nbsp; "new\_status": "RESOLVED"

}





Response



Status updated \& SLA calculated



✅ Expected Output

Issues Table

issue\_id | status   | resolved\_at           | sla\_status

1        | RESOLVED | 2026-01-31 13:08:07   | MET



Status History

OPEN → IN\_PROGRESS → RESOLVED



