# Kombee Observability Hackathon App

A full-stack application featuring simplified authentication, product CRUD with professional table layout, and advanced observability demonstration tools.

## Features

- **Simplified Auth**: Pure Name, Email, Password registration and login.
- **Product Management**: 
  - Professional table layout with Material UI.
  - Client-side pagination.
  - Simplified flat data model.
- **Observability Stack**:
  - **Prometheus & Grafana**: Metrics visualization.
  - **Loki**: Log aggregation.
  - **Tempo**: Distributed tracing.
  - **Custom Anomaly Injection**: Test your dashboards with `/api/chaos` endpoints.
  - **Load Testing**: k6 script included for stress testing.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+

### Installation

1. Clone the repository.
2. Build and start the services:
   ```bash
   docker compose up --build
   ```
3. Access the app:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5001/api](http://localhost:5001/api)
   - Grafana: [http://localhost:3000](http://localhost:3000) (admin/admin)

## Load Testing

Run the included k6 script via Docker:
```bash
cat load-test.js | docker run --rm -i --network="host" grafana/k6 run -
```

## Chaos Endpoints
Test observability by hitting these endpoints:
- Delay: `/api/chaos/delay`
- Errors: `/api/chaos/error`
- Heavy Query: `/api/chaos/heavy`

## Video Link
https://drive.google.com/file/d/1g8cE6Ih3gyQL_dANaSKTsiV0pgXaqPGG/view
