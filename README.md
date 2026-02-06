# Incident Triage Console

A modern frontend application for managing and triaging system incidents, built with **Vue 3**, **TypeScript**, and **Vuetify**.

## 🏗 MACH Architecture & Design Philosophy

This project is architected to align with **MACH** (Microservices, API-First, Cloud-Native, Headless) principles, demonstrating how a frontend codebase can be structured for enterprise scale.

### 🧩 Microservices Ready

The frontend treats the backend as a set of distinct, domain-specific services rather than a monolithic API.

- **Service Layer**: The `src/services` and `src/api` directories are structured to interact with independent services (e.g., `incidentService`, `contentService`).
- **Decoupling**: The Store layer (`incidentStore.ts`) uses these services to fetch data, keeping the UI completely decoupled from the data source implementation.

### ☁️ Cloud-Native & API-First

- **Resiliency**: The API client (`client.ts`) implements **automated retries with exponential backoff** for network errors and 5xx responses. This ensures robustness in distributed, cloud environments where transient failures are common.
- **Strict Typing**: All API interactions benefit from strict TypeScript DTO patterns and Mapper functions (`IncidentMapper.ts`), ensuring a clean contract between frontend and backend.

### 🗣️ Headless Content (Simulation)

- **Content as a Service**: The application simulates a Headless CMS integration via `ContentStore` (`contentStore.ts`).
- **Dynamic Content**: UI strings and labels are fetched dynamically (e.g., via `getContent(...)`) rather than being hardcoded. This paves the way for easy integration with platforms like Contentful or Sanity, and simplifies localization.

## ⚠️ Demo Limitations

### Server-Side Pagination

**Note**: This project is a **demo** implementation. As such, it currently **simulates** data fetching but does **not** implement server-side pagination.

- The `fetchAll` method retrieves all mock incidents at once.
- In a real production environment (`Enterprise Ready`), this would be replaced with a paginated endpoint (e.g., `GET /incidents?page=1&limit=50`) to handle large datasets efficiently.

## 🛠 Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with Vitest

```sh
npm run test:unit
```

### Lint with ESLint

```sh
npm run lint
```
