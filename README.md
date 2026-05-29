# BizTrak - Integrated Business Management System

Enterprise-grade business management platform for vehicle rentals, vehicle sales, fleet operations, customer management, payroll, and financial tracking.

---

# Overview

Integrated Business Management System is a full-stack enterprise platform designed to modernize and centralize all business operations.

The system replaces manual and paper-based workflows with a unified digital ecosystem consisting of:

* Desktop Admin Application (Electron)
* Customer Web Platform (Next.js)
* Shared Backend API (NestJS)
* Supabase PostgreSQL Database

The platform is designed for scalability, offline capability, multi-role access control, and future multi-branch expansion.

---

# System Architecture

## High-Level Stack

| Layer            | Technology                    |
| ---------------- | ----------------------------- |
| Desktop App      | Electron + React + TypeScript |
| Web Platform     | Next.js + TypeScript          |
| Backend API      | NestJS                        |
| Database         | Supabase PostgreSQL           |
| Authentication   | Supabase Auth                 |
| Storage          | Supabase Storage              |
| Realtime         | Supabase Realtime             |
| State Management | Zustand + TanStack Query      |
| Styling          | TailwindCSS + Shadcn UI       |
| Offline Storage  | SQLite (`better-sqlite3`)     |
| PDF Generation   | Puppeteer                     |
| Deployment       | Vercel + Render               |

---

# Monorepo Structure

```bash
biztrak/
│
├── apps/
│   ├── api/          # NestJS backend
│   ├── desktop/      # Electron desktop application
│   └── web/          # Next.js customer website
│
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── ui/           # Shared UI components
│   └── utils/        # Shared utility functions
│
├── turbo.json
├── package.json
└── README.md
```

---

# Core Features

## Fleet Management

* Vehicle registry
* Vehicle lifecycle tracking
* Maintenance tracking
* Insurance & road tax expiry alerts
* Vehicle media uploads
* Availability management
* Website listing sync

## Rental Management

* Rental booking workflow
* Vehicle reservation system
* Pickup & return inspections
* Mileage & fuel tracking
* Late fee calculations
* Rental contracts
* Payment tracking
* Receipt generation

## Vehicle Sales

* Full payment sales
* Installment plans
* Trade-in management
* Sales agreements
* Ownership transfer logging

## Financial System

* Invoice generation
* Receipt generation
* Expense tracking
* Currency conversion support
* Mobile money support
* Revenue analytics
* Financial reporting

## Payroll

* Employee salary records
* Payroll processing
* Payslip generation
* Payroll reporting

## CRM

* Customer profiles
* Document uploads
* Rental history
* Purchase history
* Blacklisting system

## Notifications

* Internal alerts
* Email notifications
* WhatsApp/SMS notifications
* Maintenance reminders
* Return reminders

## Audit Logs

Every action in the system is logged with:

* Timestamp
* User
* Role
* Module
* Action
* Before/After state
* Device information

---

# Roles & Permissions

| Role        | Description                  |
| ----------- | ---------------------------- |
| Super Admin | Full unrestricted access     |
| Admin       | Full operational control     |
| Finance     | Financial operations only    |
| Worker      | Operational field tasks      |
| Customer    | Self-service customer access |

RBAC is enforced through:

* NestJS Guards
* Supabase JWT
* Supabase RLS Policies
* Frontend route protection

---

# Applications

# 1. Desktop Admin System

Electron-based installable application for internal staff.

## Features

* Offline support
* Local SQLite caching
* PDF generation
* Native printing
* Real-time sync
* Fleet management
* Rentals
* Sales
* Payroll
* Analytics dashboard

## Intended Users

* Super Admin
* Admin
* Finance
* Workers

---

# 2. Customer Web Platform

Next.js-based public website.

## Features

* Vehicle listings
* Rental inquiries
* Purchase inquiries
* Customer registration
* Document uploads
* Rental history
* Customer dashboard

---

# 3. Backend API

NestJS-based centralized business logic server.

## Responsibilities

* Authentication
* Authorization
* Business logic
* PDF generation
* Notification handling
* Audit logging
* Database coordination
* Realtime event handling

---

# Database

The system uses Supabase PostgreSQL with Row-Level Security (RLS).

## Major Tables

### Core

* users
* roles
* user_roles
* permissions
* audit_logs

### Fleet

* vehicles
* vehicle_images
* vehicle_documents
* vehicle_maintenance
* vehicle_timeline

### Rentals

* rentals
* rental_payments
* rental_contracts
* rental_inspections

### Sales

* sales
* sale_payments
* trade_ins
* sale_agreements

### Financial

* invoices
* receipts
* expenses
* currencies

### CRM

* customers
* customer_documents
* employees
* employee_payroll

---

# Offline Support

The desktop application supports offline operation using SQLite.

## Offline-Capable Features

| Feature         | Offline Support |
| --------------- | --------------- |
| View vehicles   | Yes             |
| View customers  | Yes             |
| Active rentals  | Yes             |
| Create rentals  | Queued          |
| Record payments | Queued          |
| Generate PDFs   | Yes             |
| Print documents | Yes             |
| Upload photos   | Queued          |

Queued actions automatically synchronize when connectivity is restored.

---

# Development Phases

## Phase 1 — Foundation

* Monorepo setup
* Authentication
* RBAC
* Fleet module
* Supabase setup

## Phase 2 — Rental System

* Rental workflow
* Inspections
* Contracts
* Payments
* CRM

## Phase 3 — Sales & Financials

* Vehicle sales
* Payroll
* Reports
* Notifications

## Phase 4 — Web Platform

* Public website
* Customer accounts
* Scheduling
* Customer dashboard

## Phase 5 — Advanced Features

* Offline sync
* WhatsApp/SMS
* Performance optimization
* Multi-branch preparation

---

# UI/UX Direction

## Brand Palette

| Color        | Hex       |
| ------------ | --------- |
| Deep Navy    | `#2C3E50` |
| Silver       | `#BDC3C7` |
| Amber Orange | `#E67E22` |
| White        | `#FFFFFF` |
| Light Gray   | `#F4F6F7` |

## Design Philosophy

Timeless Classic Elegance for Business.

The system UI is designed to be:

* Professional
* Fast
* Readable
* Enterprise-grade
* Mobile responsive
* Dark/light mode compatible

---

# Getting Started

## Prerequisites

* Node.js 22+
* npm
* Supabase account
* Render account
* Vercel account

---

# Installation

## Clone Repository

```bash
git clone https://github.com/NeXTendo/businessTrak.git
cd businessTrak
```

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create `.env` files for each application.

Example:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

DATABASE_URL=

JWT_SECRET=

RESEND_API_KEY=
AFRICAS_TALKING_API_KEY=
```

---

# Running Development Servers

## Start All Apps

```bash
npm dev
```

## Individual Applications

### Web

```bash
npm run dev --workspace=@chatowa/web
```

### Desktop

```bash
npm run dev --workspace=@chatowa/desktop
```

### API

```bash
npm run dev --workspace=@chatowa/api
```

---

# Build Commands

```bash
npm build
```

---

# Deployment

## Web Platform

* Provider: Vercel

## API

* Provider: Render

## Database

* Provider: Supabase

## Desktop App

* Distributed as installable Electron application

---

# Security

The system implements enterprise-grade security through:

* JWT authentication
* Role-based access control
* Supabase Row-Level Security
* Audit logging
* Route guards
* Secure file storage
* Permission-based UI rendering

---

# Future Scope

Planned future enhancements include:

* GPS vehicle tracking
* Online payments
* Multi-branch management
* Mobile application
* Advanced analytics
* AI-assisted reporting
* Multi-language support

---

# Finalized Technology Decisions

| Decision          | Choice                   |
| ----------------- | ------------------------ |
| Desktop Framework | Electron                 |
| Web Framework     | Next.js                  |
| Backend           | NestJS                   |
| Database          | Supabase PostgreSQL      |
| Auth              | Supabase Auth            |
| Offline Support   | SQLite                   |
| PDF Engine        | Puppeteer                |
| State Management  | Zustand + TanStack Query |
| Monorepo Tooling  | Turborepo                |

---

# Maintainer

## Chatowa Investments

Internal enterprise system developed for operational management, fleet control, customer management, rentals, sales, payroll, and financial reporting.

System Architect:
Pumulo Mubiana

---

# License

TechOhns.

Confidential and not for public redistribution.
#
