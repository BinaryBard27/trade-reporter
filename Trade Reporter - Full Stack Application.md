# Trade Reporter - Full Stack Application

A comprehensive, production-ready transaction management system built with modern technologies. This full-stack application enables users to submit, manage, filter, and report on trade transactions through an intuitive web interface backed by a robust REST API.

## Overview

Trade Reporter is a complete solution for transaction management featuring a React-based frontend dashboard and a Spring Boot REST API backend. The application provides real-time transaction tracking, advanced filtering capabilities, and comprehensive reporting features.

## Project Structure

```
trade-reporter/
├── trade-transaction-reporter/          # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   ├── .github/workflows/
│   │   └── maven.yml                   # CI/CD workflow
│   └── README.md
│
└── trade-reporter-frontend/            # React Frontend
    ├── client/
    ├── package.json
    └── README.md
```

## Quick Start

### Prerequisites
- Java Development Kit (JDK) 17+
- Maven 3.6+
- Node.js 18+ with pnpm
- Git

### Backend Setup (Spring Boot)

```bash
cd trade-transaction-reporter
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup (React)

```bash
cd trade-reporter-frontend
pnpm install
echo "VITE_API_URL=http://localhost:8080/api" > .env.local
pnpm dev
```

Frontend runs on `http://localhost:3000`

## Features

**Dashboard**: Real-time overview with transaction metrics, pending items, completed transactions, and total amounts.

**Transaction Submission**: User-friendly form with validation for creating new transactions with instrument types, currencies, and status tracking.

**Advanced Filtering**: Filter transactions by status (PENDING, COMPLETED, CANCELLED) with instant results.

**Date Range Reports**: Generate comprehensive reports for any date range with summary statistics and CSV export capability.

**API Documentation**: Interactive Swagger UI at `/swagger-ui.html` for exploring and testing all endpoints.

**Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS and shadcn/ui components.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend Language | Java 17 |
| Backend Framework | Spring Boot 3.x |
| Build Tool | Maven |
| Database | H2 (in-memory) |
| Frontend Library | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| HTTP Client | Axios |
| Form Management | React Hook Form |
| Validation | Zod |
| Routing | Wouter |
| CI/CD | GitHub Actions |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions` | Submit a new transaction |
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions?status=PENDING` | Filter by status |
| GET | `/api/transactions/report?from=DATE&to=DATE` | Generate date range report |

## Sample Requests

**Submit Transaction:**
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "tradeId": "TRD001",
    "instrumentType": "EQUITY",
    "amount": 1500.75,
    "currency": "USD",
    "status": "PENDING",
    "tradeDate": "2024-04-25"
  }'
```

**Get Transactions:**
```bash
curl http://localhost:8080/api/transactions
```

**Filter by Status:**
```bash
curl http://localhost:8080/api/transactions?status=COMPLETED
```

**Generate Report:**
```bash
curl "http://localhost:8080/api/transactions/report?from=2024-01-01&to=2024-12-31"
```

## Development

### Backend Development
- Modify Java files in `trade-transaction-reporter/src/main/java/`
- Rebuild with `mvn clean install`
- Run tests with `mvn test`

### Frontend Development
- Modify React components in `trade-reporter-frontend/client/src/`
- Changes auto-refresh with Vite's HMR
- Type check with `pnpm check`

## Deployment

### Backend Deployment
Build JAR: `mvn clean package`
Run: `java -jar target/trade-transaction-reporter-0.0.1-SNAPSHOT.jar`

### Frontend Deployment
Build: `pnpm build`
Deploy the `dist` folder to Vercel, Netlify, or AWS S3 + CloudFront

## CI/CD

The project includes GitHub Actions workflow for automated testing. On every push:
1. Backend builds with Maven
2. All tests run automatically
3. Build status is reported

## Troubleshooting

**CORS Issues**: Ensure the backend CORS configuration allows your frontend URL.

**Port Conflicts**: Modify `application.properties` (backend) or use `pnpm dev -- --port 3001` (frontend).

**Database**: H2 in-memory database is auto-created. No manual setup needed.

## Documentation

- **Backend**: See `trade-transaction-reporter/README.md`
- **Frontend**: See `trade-reporter-frontend/README.md`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, open a GitHub issue or contact the development team.

---

**Built with ❤️ using modern web technologies**
