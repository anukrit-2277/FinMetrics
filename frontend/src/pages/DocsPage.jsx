import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineBookOpen,
  HiOutlineCube,
  HiOutlineCode,
  HiOutlineShieldCheck,
  HiOutlineDatabase,
  HiOutlineCog,
  HiOutlineLightningBolt,
  HiOutlinePlay,
  HiOutlineArrowLeft,
  HiOutlineKey,
  HiOutlineMenu,
  HiX,
} from 'react-icons/hi';

const sections = [
  { id: 'introduction', label: 'Introduction', icon: <HiOutlineBookOpen /> },
  { id: 'architecture', label: 'Architecture', icon: <HiOutlineCube /> },
  { id: 'tech-stack', label: 'Tech Stack', icon: <HiOutlineCode /> },
  { id: 'api-reference', label: 'API Reference', icon: <HiOutlineLightningBolt /> },
  { id: 'access-control', label: 'Access Control', icon: <HiOutlineShieldCheck /> },
  { id: 'database', label: 'Database Schema', icon: <HiOutlineDatabase /> },
  { id: 'getting-started', label: 'Getting Started', icon: <HiOutlinePlay /> },
  { id: 'configuration', label: 'Configuration', icon: <HiOutlineCog /> },
  { id: 'security', label: 'Security', icon: <HiOutlineKey /> },
];

function CodeBlock({ children, title }) {
  return (
    <div className="docs-code-block">
      {title && <div className="docs-code-title">{title}</div>}
      <pre><code>{children}</code></pre>
    </div>
  );
}

function DocsPage() {
  const [active, setActive] = useState('introduction');
  const [mobileNav, setMobileNav] = useState(false);

  const scrollTo = (id) => {
    setActive(id);
    setMobileNav(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="docs-page">
      {/* Top navbar */}
      <header className="docs-topbar">
        <Link to="/dashboard" className="docs-back-link">
          <HiOutlineArrowLeft />
          Back to Dashboard
        </Link>
        <div className="docs-topbar-right">
          <span className="docs-topbar-badge">v1.0</span>
          <span className="docs-topbar-title">Documentation</span>
          <button className="docs-mobile-toggle" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </header>

      <div className="docs-layout">
        {/* Sidebar */}
        <nav className={`docs-sidebar ${mobileNav ? 'docs-sidebar-open' : ''}`}>
          <div className="docs-sidebar-label">DOCUMENTATION</div>
          {sections.map((s) => (
            <button
              key={s.id}
              className={`docs-sidebar-item ${active === s.id ? 'active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="docs-sidebar-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Overlay for mobile */}
        {mobileNav && <div className="docs-overlay" onClick={() => setMobileNav(false)} />}

        {/* Main Content */}
        <main className="docs-content">
          {/* Introduction */}
          <section id="introduction" className="docs-section">
            <h1 className="docs-hero-title">FinMetrics</h1>
            <p className="docs-hero-subtitle">
              Full-stack Finance Dashboard with Role-Based Access Control, Financial Records Management, 
              and Analytics APIs. Built with Node.js, Express, PostgreSQL, and React.
            </p>

            <div className="docs-divider" />

            <h2>Overview</h2>
            <p>
              FinMetrics is a <strong>finance dashboard system</strong> where different users interact with 
              financial records based on their role. The system supports storage and management of financial 
              entries, user roles, permissions, and summary-level analytics.
            </p>
            <p>
              The architecture follows a <strong>layered pattern</strong> — Routes → Controllers → Services → 
              Prisma ORM → PostgreSQL, with cross-cutting concerns handled by middleware (authentication, 
              RBAC, validation, error handling).
            </p>

            <div className="docs-divider" />

            <h2>Key Features</h2>
            <div className="docs-features-grid">
              <div className="docs-feature-card">
                <div className="docs-feature-icon" style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: '#dc2626' }}>
                  <HiOutlineShieldCheck />
                </div>
                <h4>Role-Based Access Control</h4>
                <p>Three roles — Viewer, Analyst, Admin — with middleware-level enforcement on every endpoint.</p>
              </div>
              <div className="docs-feature-card">
                <div className="docs-feature-icon" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                  <HiOutlineDatabase />
                </div>
                <h4>Financial Records CRUD</h4>
                <p>Create, read, update, soft-delete transactions with filtering, search, and pagination.</p>
              </div>
              <div className="docs-feature-card">
                <div className="docs-feature-icon" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
                  <HiOutlineLightningBolt />
                </div>
                <h4>Analytics Dashboard</h4>
                <p>Aggregated APIs for income/expense totals, category breakdown, and monthly trends.</p>
              </div>
              <div className="docs-feature-card">
                <div className="docs-feature-icon" style={{ backgroundColor: 'rgba(168,85,247,0.12)', color: '#a855f7' }}>
                  <HiOutlineKey />
                </div>
                <h4>Secure Authentication</h4>
                <p>Session-based auth with bcrypt hashing (12 rounds), strong password policy, and rate limiting.</p>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="docs-section">
            <h2>Architecture</h2>
            <p>The backend follows a clean <strong>layered architecture</strong> with clear separation of concerns:</p>

            <CodeBlock title="Request Flow">
{`Client (React) ──► Express API ──► Service Layer ──► Prisma ORM ──► PostgreSQL
                        │
                ┌───────┼───────┐
           Middleware:   │       │
           • Auth        │       │
           • RBAC        │       │
           • Validation  │       │
           • Rate Limit  │       │
           • Error       │       │
           Handler       │       │`}
            </CodeBlock>

            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Layer</th>
                    <th>Responsibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>Routes</code></td><td>HTTP method mapping, middleware chaining</td></tr>
                  <tr><td><code>Controllers</code></td><td>Request/response handling, delegates to services</td></tr>
                  <tr><td><code>Services</code></td><td>Business logic, data processing, Prisma queries</td></tr>
                  <tr><td><code>Middleware</code></td><td>Auth, RBAC, validation, error handling</td></tr>
                  <tr><td><code>Validators</code></td><td>express-validator rules for input sanitization</td></tr>
                </tbody>
              </table>
            </div>

            <CodeBlock title="Project Structure">
{`backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.js              # Seed script with test accounts
├── src/
│   ├── app.js               # Express entry point
│   ├── config/
│   │   ├── db.js            # Prisma client singleton
│   │   └── session.js       # Session config
│   ├── controllers/         # Request handlers
│   ├── middleware/           # Auth, RBAC, validation, errors, rate limit
│   ├── routes/              # HTTP route definitions
│   ├── services/            # Business logic layer
│   └── validators/          # Input validation rules
└── tests/
    └── api.test.js          # Integration tests (31 tests)`}
            </CodeBlock>
          </section>

          {/* Tech Stack */}
          <section id="tech-stack" className="docs-section">
            <h2>Tech Stack</h2>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Technology</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Runtime</td><td><code>Node.js 18+</code></td><td>Industry standard, async I/O</td></tr>
                  <tr><td>Framework</td><td><code>Express.js</code></td><td>Lightweight, mature ecosystem</td></tr>
                  <tr><td>Database</td><td><code>PostgreSQL</code></td><td>ACID compliance, Decimal precision for finance</td></tr>
                  <tr><td>ORM</td><td><code>Prisma</code></td><td>Type-safe queries, schema-as-code, migrations</td></tr>
                  <tr><td>Auth</td><td><code>express-session + bcrypt</code></td><td>Server-side sessions, instant revocation</td></tr>
                  <tr><td>Validation</td><td><code>express-validator</code></td><td>Declarative, middleware-based</td></tr>
                  <tr><td>Rate Limiting</td><td><code>express-rate-limit</code></td><td>Brute-force protection</td></tr>
                  <tr><td>Testing</td><td><code>Jest + Supertest</code></td><td>Integration testing with HTTP assertions</td></tr>
                  <tr><td>Frontend</td><td><code>React 19 (Vite)</code></td><td>Fast builds, modern DX</td></tr>
                  <tr><td>Charts</td><td><code>Recharts</code></td><td>React-native charting library</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* API Reference */}
          <section id="api-reference" className="docs-section">
            <h2>API Reference</h2>

            <h3>Authentication</h3>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                    <th>Auth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><span className="docs-method post">POST</span></td><td><code>/api/auth/login</code></td><td>Login with email & password</td><td>No</td></tr>
                  <tr><td><span className="docs-method post">POST</span></td><td><code>/api/auth/logout</code></td><td>Destroy session</td><td>Yes</td></tr>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/auth/me</code></td><td>Get current user</td><td>Yes</td></tr>
                  <tr><td><span className="docs-method put">PUT</span></td><td><code>/api/auth/change-password</code></td><td>Change password</td><td>Yes</td></tr>
                </tbody>
              </table>
            </div>

            <h3>Users <span className="docs-role-badge">Admin Only</span></h3>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/users</code></td><td>List all users</td></tr>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/users/roles</code></td><td>List all roles</td></tr>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/users/:id</code></td><td>Get user by ID</td></tr>
                  <tr><td><span className="docs-method post">POST</span></td><td><code>/api/users</code></td><td>Create user</td></tr>
                  <tr><td><span className="docs-method put">PUT</span></td><td><code>/api/users/:id</code></td><td>Update user</td></tr>
                  <tr><td><span className="docs-method delete">DELETE</span></td><td><code>/api/users/:id</code></td><td>Deactivate user (soft)</td></tr>
                </tbody>
              </table>
            </div>

            <h3>Transactions</h3>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                    <th>Roles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/transactions</code></td><td>List with filters + pagination</td><td>All</td></tr>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/transactions/categories</code></td><td>Distinct categories</td><td>All</td></tr>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/transactions/:id</code></td><td>Get by ID</td><td>All</td></tr>
                  <tr><td><span className="docs-method post">POST</span></td><td><code>/api/transactions</code></td><td>Create transaction</td><td>Admin</td></tr>
                  <tr><td><span className="docs-method put">PUT</span></td><td><code>/api/transactions/:id</code></td><td>Update transaction</td><td>Admin</td></tr>
                  <tr><td><span className="docs-method delete">DELETE</span></td><td><code>/api/transactions/:id</code></td><td>Soft delete</td><td>Admin</td></tr>
                </tbody>
              </table>
            </div>

            <h3>Query Parameters — <code>GET /api/transactions</code></h3>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Param</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>type</code></td><td>string</td><td>Filter by INCOME or EXPENSE</td></tr>
                  <tr><td><code>category</code></td><td>string</td><td>Filter by category name</td></tr>
                  <tr><td><code>startDate</code></td><td>ISO date</td><td>Filter from date</td></tr>
                  <tr><td><code>endDate</code></td><td>ISO date</td><td>Filter to date</td></tr>
                  <tr><td><code>search</code></td><td>string</td><td>Search in category and notes (case-insensitive)</td></tr>
                  <tr><td><code>page</code></td><td>number</td><td>Page number (default: 1)</td></tr>
                  <tr><td><code>limit</code></td><td>number</td><td>Items per page (default: 20)</td></tr>
                </tbody>
              </table>
            </div>

            <h3>Dashboard Analytics</h3>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                    <th>Roles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/dashboard/summary</code></td><td>Total income, expenses, balance, count</td><td>All</td></tr>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/dashboard/recent</code></td><td>Last 10 transactions</td><td>All</td></tr>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/dashboard/category-totals</code></td><td>Category-wise breakdown</td><td>Analyst+</td></tr>
                  <tr><td><span className="docs-method get">GET</span></td><td><code>/api/dashboard/trends</code></td><td>Monthly trends (12 months)</td><td>Analyst+</td></tr>
                </tbody>
              </table>
            </div>

            <h3>Sample Response — Dashboard Summary</h3>
            <CodeBlock title="GET /api/dashboard/summary">
{`{
  "success": true,
  "data": {
    "totalIncome": 32270,
    "totalExpenses": 9215,
    "netBalance": 23055,
    "transactionCount": 20
  }
}`}
            </CodeBlock>
          </section>

          {/* Access Control */}
          <section id="access-control" className="docs-section">
            <h2>Access Control Matrix</h2>
            <p>
              RBAC is enforced at the <strong>middleware level</strong> via <code>authorize()</code> — even if 
              a user bypasses the frontend, the API rejects unauthorized requests with <code>403 Forbidden</code>.
            </p>

            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Viewer</th>
                    <th>Analyst</th>
                    <th>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>View dashboard summary</td><td>✅</td><td>✅</td><td>✅</td></tr>
                  <tr><td>View recent transactions</td><td>✅</td><td>✅</td><td>✅</td></tr>
                  <tr><td>View analytics (charts)</td><td>❌</td><td>✅</td><td>✅</td></tr>
                  <tr><td>View all transactions</td><td>❌</td><td>✅</td><td>✅</td></tr>
                  <tr><td>Create / Edit / Delete transactions</td><td>❌</td><td>❌</td><td>✅</td></tr>
                  <tr><td>Manage users</td><td>❌</td><td>❌</td><td>✅</td></tr>
                  <tr><td>View own profile</td><td>✅</td><td>✅</td><td>✅</td></tr>
                  <tr><td>Change own password</td><td>✅</td><td>✅</td><td>✅</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Database Schema */}
          <section id="database" className="docs-section">
            <h2>Database Schema</h2>
            <CodeBlock title="Entity Relationship">
{`┌──────────────┐     ┌──────────────────┐     ┌────────────────────┐
│    roles     │     │      users       │     │   transactions     │
├──────────────┤     ├──────────────────┤     ├────────────────────┤
│ id (PK)      │◄────│ role_id (FK)     │◄────│ user_id (FK)       │
│ name (UNIQUE)│     │ id (PK)          │     │ id (PK)            │
│ created_at   │     │ email (UNIQUE)   │     │ amount Decimal(12,2│
└──────────────┘     │ name             │     │ type INCOME/EXPENSE│
                     │ password (bcrypt)│     │ category           │
                     │ is_active        │     │ date               │
                     │ created_at       │     │ notes              │
                     │ updated_at       │     │ is_deleted (soft)  │
                     └──────────────────┘     │ created_at         │
                                              │ updated_at         │
                                              └────────────────────┘`}
            </CodeBlock>

            <h3>Design Decisions</h3>
            <ul className="docs-list">
              <li><code>Decimal(12,2)</code> for amount — avoids floating-point precision errors in financial data</li>
              <li><code>is_deleted</code> soft delete — preserves audit trail; transactions are never physically removed</li>
              <li><code>bcrypt</code> with 12 salt rounds for password hashing</li>
              <li>Indexed columns: <code>userId</code>, <code>type</code>, <code>category</code>, <code>date</code>, <code>isDeleted</code></li>
            </ul>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="docs-section">
            <h2>Getting Started</h2>

            <h3>Prerequisites</h3>
            <ul className="docs-list">
              <li>Node.js 18+</li>
              <li>PostgreSQL 14+</li>
              <li>npm or yarn</li>
            </ul>

            <h3>Installation</h3>
            <CodeBlock title="Terminal">
{`# Clone the repository
git clone <repo-url>
cd FinMetrics

# Backend setup
cd backend
npm install
cp .env.example .env     # Configure your database URL

# Run database migrations
npx prisma migrate dev --name init

# Seed test data
node prisma/seed.js

# Start the backend
npm run dev               # http://localhost:5001

# Frontend setup (separate terminal)
cd ../frontend
npm install
npm run dev               # http://localhost:5173`}
            </CodeBlock>

            <h3>Test Accounts (Seeded)</h3>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><span className="docs-role admin">Admin</span></td><td><code>admin@finmetrics.com</code></td><td><code>Admin@2025!</code></td></tr>
                  <tr><td><span className="docs-role analyst">Analyst</span></td><td><code>analyst@finmetrics.com</code></td><td><code>Analyst@2025!</code></td></tr>
                  <tr><td><span className="docs-role viewer">Viewer</span></td><td><code>viewer@finmetrics.com</code></td><td><code>Viewer@2025!</code></td></tr>
                </tbody>
              </table>
            </div>

            <h3>Running Tests</h3>
            <CodeBlock title="Terminal">
{`cd backend
npm test

# Output: 31 passing tests covering:
# • Health check & 404 handling
# • Authentication validation
# • RBAC enforcement (all 3 roles)
# • Input validation
# • Dashboard API response shapes
# • Pagination`}
            </CodeBlock>
          </section>

          {/* Configuration */}
          <section id="configuration" className="docs-section">
            <h2>Configuration</h2>

            <h3>Environment Variables</h3>
            <CodeBlock title=".env">
{`DATABASE_URL="postgresql://user:password@localhost:5432/finmetrics"
PORT=5001
SESSION_SECRET="your-session-secret-here"
NODE_ENV=development`}
            </CodeBlock>

            <h3>Rate Limiting</h3>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Scope</th>
                    <th>Limit</th>
                    <th>Window</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>General API (<code>/api/*</code>)</td><td>100 requests</td><td>15 minutes</td></tr>
                  <tr><td>Auth routes (login, change password)</td><td>10 requests</td><td>15 minutes</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="docs-section">
            <h2>Security & Design Tradeoffs</h2>

            <h3>Security Measures</h3>
            <ul className="docs-list">
              <li><strong>Password hashing</strong> — bcrypt with 12 salt rounds</li>
              <li><strong>Strong password policy</strong> — min 8 chars, uppercase, lowercase, digit, special character</li>
              <li><strong>Session-based auth</strong> — httpOnly cookies, server-side session store</li>
              <li><strong>Rate limiting</strong> — prevents brute-force on login and password change</li>
              <li><strong>RBAC middleware</strong> — enforced at route level, not just UI</li>
              <li><strong>Input validation</strong> — express-validator on all mutating endpoints</li>
              <li><strong>Soft delete</strong> — financial records preserved for audit trail</li>
              <li><strong>Passwords never exposed</strong> — excluded from all API responses</li>
            </ul>

            <h3>Design Tradeoffs</h3>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Decision</th>
                    <th>Benefit</th>
                    <th>Tradeoff</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Sessions over JWT</td><td>Instant revocation, simpler</td><td>Not stateless</td></tr>
                  <tr><td>PostgreSQL</td><td>Data persistence, real queries</td><td>Requires external DB</td></tr>
                  <tr><td>Prisma ORM</td><td>Schema-as-code, type safety</td><td>Abstraction layer</td></tr>
                  <tr><td>Soft delete</td><td>Audit trail</td><td>Complex queries</td></tr>
                  <tr><td>Monolith</td><td>Simple deployment</td><td>Less scalable</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer */}
          <div className="docs-footer">
            <p>Built with ❤️ for the Backend Development Assessment</p>
            <p>FinMetrics © {new Date().getFullYear()} — React, Express, PostgreSQL, Prisma</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DocsPage;
