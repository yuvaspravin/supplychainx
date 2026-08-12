# SupplyChainX — Multi-Tier Supply Chain Risk & Relationship Navigator

SupplyChainX is a graph-backed supply chain intelligence application built using **CognoDB Cloud** and **openCypher over the Bolt protocol**.

It enables real-time visualization and analysis of complex multi-tier supply networks, sub-component manufacturing dependencies, and downstream disruption propagation.

The application helps identify the **blast radius of a supplier failure** across multiple levels of the supply chain — from suppliers and components to finished retail products.

---

## 🚀 Key Features

- 🌐 **Multi-tier supply chain graph visualization**
- 🔍 **1–4 hop dependency traversal**
- 💥 **Blast Radius Impact Analysis**
- 🏭 Supplier-to-supplier relationship tracking
- ⚙️ Component manufacturing dependency mapping
- 📦 Downstream product impact identification
- ⚡ Parameterized Cypher queries
- 🔄 Automatic database retry and connection handling
- 🧩 Modular React component architecture
- 🚀 Performance optimization using `React.memo` and `useCallback`
- ☁️ CognoDB Cloud integration through Bolt protocol

---

## 🎯 Use Case & Problem Statement

Modern manufacturing relies on deeply interconnected global supply networks.

A single disruption at a lower-tier supplier — such as:

- Semiconductor shortages
- Factory downtime
- Raw material shortages
- Shipping delays
- Supplier shutdowns

can propagate through multiple tiers of the supply chain.

For example:

```text
Raw Material Supplier
        ↓
Component Manufacturer
        ↓
Sub-Assembly Supplier
        ↓
Final Product Manufacturer
        ↓
Retail Product
```

When a supplier fails, businesses need to quickly determine:

> **Which components, manufacturers, and retail products will be affected?**

SupplyChainX solves this problem using a graph-based data model that allows multi-hop relationships to be traversed efficiently.

---

## 🧠 Why a Graph Database?

Traditional relational databases require multiple `JOIN` operations or recursive SQL queries to calculate multi-tier supplier dependencies.

For example:

```text
Supplier
   ↓
Component
   ↓
Sub-Assembly
   ↓
Product
```

As the dependency depth increases, relational queries can become increasingly complex and expensive.

With a graph database, relationships are first-class entities, making traversal-based queries much more natural.

### Relational Database

```text
Supplier
   ↓
JOIN
   ↓
Component
   ↓
JOIN
   ↓
Manufacturer
   ↓
JOIN
   ↓
Product
```

### Graph Database

```text
Supplier ──SUPPLIES──> Manufacturer
    │
    └──MANUFACTURING──> Component
                            │
                            └──ASSEMBLED_INTO──> Product
```

This makes graph traversal particularly well suited for:

- Dependency analysis
- Supply chain mapping
- Impact analysis
- Relationship discovery
- Multi-tier traversal

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React Client    │
                    │                     │
                    │  CatalogPanel       │
                    │  NodeGrid           │
                    │  NodeCard           │
                    │  BlastRadiusCard    │
                    └──────────┬──────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌─────────────────────┐
                    │    Node.js Server   │
                    │                     │
                    │  API Routes         │
                    │  Query Services     │
                    │  Retry Logic        │
                    │  Database Config    │
                    └──────────┬──────────┘
                               │
                               │ Bolt Protocol
                               ▼
                    ┌─────────────────────┐
                    │   CognoDB Cloud     │
                    │                     │
                    │  Companies          │
                    │  Components         │
                    │  Products           │
                    │  Relationships      │
                    └─────────────────────┘
```

---

# 🗃️ Graph Data Model

SupplyChainX uses three primary node types.

## Nodes

| Label       | Properties                                   |
| ----------- | -------------------------------------------- |
| `Company`   | `id`, `name`, `country`, `tier`, `riskScore` |
| `Component` | `id`, `name`, `category`, `leadTimeDays`     |
| `Product`   | `id`, `name`, `sku`, `price`                 |

## Relationships

| Relationship     | Properties               | Description                           |
| ---------------- | ------------------------ | ------------------------------------- |
| `SUPPLIES`       | `contractVal`, `primary` | Company supplies another company      |
| `MANUFACTURING`  | —                        | Company manufactures a component      |
| `ASSEMBLED_INTO` | `quantityPerUnit`        | Component is assembled into a product |

### Graph Structure

```text
(:Company)
     │
     │ SUPPLIES
     ▼
(:Company)
     │
     │ MANUFACTURING
     ▼
(:Component)
     │
     │ ASSEMBLED_INTO
     ▼
(:Product)
```

---

# 🔎 Main Cypher Queries

## 1. Multi-Hop Blast Radius Analysis

This query traverses the supply chain from a selected company and identifies downstream products affected by a disruption.

```cypher
MATCH (start:Company {id: $companyId})
MATCH path = (start)-[:SUPPLIES|MANUFACTURING|ASSEMBLED_INTO*1..4]->(affected:Product)
RETURN path, affected, length(path) AS depth
```

The query uses a parameterized `$companyId` rather than directly interpolating user input.

### Example

```text
Supplier A
    │
    ▼
Manufacturer B
    │
    ▼
Component C
    │
    ▼
Product D
```

If **Supplier A** experiences an outage, SupplyChainX can traverse the graph and identify **Product D** as an affected downstream product.

---

## 2. Full Graph Retrieval

The following query retrieves nodes and their outgoing relationships for graph visualization:

```cypher
MATCH (n)
OPTIONAL MATCH (n)-[r]->(m)
RETURN n, r, m
LIMIT 200
```

This allows the frontend to construct and render the supply chain network.

---

# 🛡️ Error Resilience & Security

## Connection Pool & Retry Logic

CognoDB Cloud instances may experience cold-start delays.

SupplyChainX includes automatic retry logic in:

```text
server/config/database.js
```

This allows the application to gracefully retry failed initial connections instead of immediately returning a `500` error.

---

## 🔐 Parameterized Cypher Queries

All dynamic query values are passed using parameters.

Example:

```javascript
{
  companyId;
}
```

instead of directly injecting values into the Cypher query.

This helps protect the application against **Cypher injection vulnerabilities**.

---

# ⚛️ Frontend Architecture

The React frontend is divided into focused, reusable components.

```text
client/
│
├── components/
│   ├── CatalogPanel
│   ├── NodeCard
│   ├── BlastRadiusCard
│   └── NodeGrid
│
└── ...
```

### Performance Optimizations

The application uses:

```javascript
React.memo();
```

to prevent unnecessary component re-renders.

It also uses:

```javascript
useCallback();
```

to maintain stable callback references when passing functions between components.

This helps keep the graph UI responsive as the amount of rendered data increases.

---

# 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- React Hooks
- `React.memo`
- `useCallback`

### Backend

- Node.js
- Express.js
- Bolt Protocol
- openCypher

### Database

- CognoDB Cloud
- Graph Database

### Development

- npm
- Git
- GitHub
- Vite

---

# 📁 Project Structure

```text
SupplyChainX/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CatalogPanel
│   │   │   ├── NodeCard
│   │   │   ├── BlastRadiusCard
│   │   │   └── NodeGrid
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   ├── services/
│   ├── seed/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# ⚙️ Local Setup & Execution

## Prerequisites

Make sure the following are installed:

- **Node.js v18+**
- npm
- A **CognoDB Cloud** instance

Create a free `c0` CognoDB instance from the CognoDB Cloud console.

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/supplychainx.git

cd supplychainx
```

---

## 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000

COGNODB_URI=bolt+s://<your-instance-id>.databases.cognodb.cloud:7687

COGNODB_USER=cognodb

COGNODB_PASSWORD=<your_saved_password>
```

> **Important:** Never commit your `.env` file or database credentials to GitHub.

Add the following to `.gitignore`:

```gitignore
.env
node_modules/
```

---

# 🌱 3. Install Backend Dependencies

```bash
cd server

npm install
```

---

# 🗄️ 4. Seed the Database

Populate CognoDB with the sample companies, components, products, and relationships:

```bash
npm run seed
```

---

# ▶️ 5. Start the Backend Server

```bash
npm run dev
```

The backend server will run on:

```text
http://localhost:5000
```

---

# 💻 6. Launch the Frontend

Open a new terminal:

```bash
cd client

npm install

npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🔄 Example Supply Chain Flow

Consider the following network:

```text
┌─────────────────────┐
│  Silicon Supplier   │
└──────────┬──────────┘
           │
        SUPPLIES
           │
           ▼
┌─────────────────────┐
│ Chip Manufacturer   │
└──────────┬──────────┘
           │
       MANUFACTURING
           │
           ▼
┌─────────────────────┐
│   Microprocessor    │
└──────────┬──────────┘
           │
      ASSEMBLED_INTO
           │
           ▼
┌─────────────────────┐
│   Smart Appliance   │
└─────────────────────┘
```

If the **Silicon Supplier** experiences an outage, SupplyChainX can traverse the graph and identify the downstream **Smart Appliance** as an affected product.

---

# 💥 Blast Radius Analysis

The core functionality of SupplyChainX is the ability to determine how far a disruption propagates through the supply network.

```text
Supplier Failure
       │
       ▼
Tier 1 Supplier
       │
       ▼
Tier 2 Supplier
       │
       ▼
Component
       │
       ▼
Finished Product
       │
       ▼
Retail Impact
```

The application can identify the affected downstream products within a configurable traversal depth.

Current implementation:

```text
1 → 4 hops
```

---

# 📊 Risk Intelligence

Each company can maintain a risk score:

```text
Company
├── name
├── country
├── tier
└── riskScore
```

This enables future capabilities such as:

- Supplier risk ranking
- High-risk supplier identification
- Country-level supply risk
- Critical component detection
- Product vulnerability scoring
- Alternative supplier discovery
- Supply chain resilience analysis

---

# 🔮 Future Enhancements

Potential future improvements include:

- [ ] Real-time supplier risk monitoring
- [ ] Interactive graph visualization
- [ ] Supplier alternative recommendations
- [ ] Risk heatmaps
- [ ] Country-level disruption analysis
- [ ] Critical component identification
- [ ] Automated supplier risk scoring
- [ ] Historical disruption tracking
- [ ] Exportable impact reports
- [ ] Authentication and role-based access
- [ ] Advanced graph analytics
- [ ] AI-powered supply chain risk recommendations

---

# 📦 Submission Deliverables

## GitHub Repository

```text
https://github.com/your-username/supplychainx
```

Replace `your-username` with your actual GitHub username before submission.

---

# 📝 Summary

**SupplyChainX** demonstrates how graph databases can simplify and accelerate complex multi-tier supply chain analysis.

By representing companies, components, products, and their relationships as a connected graph, the application enables rapid traversal of supply dependencies and provides an intuitive way to understand the downstream impact of supplier disruptions.

### Core Concept

```text
Supplier
   ↓
Multi-Tier Dependencies
   ↓
Components
   ↓
Products
   ↓
Blast Radius
```

**SupplyChainX turns complex supply chain relationships into an actionable, navigable graph.**
