# Trade Reporter - Full Stack Application

A modern, full-stack transaction management system for reporting and managing trade transactions. The application consists of a React frontend with a professional dashboard interface and a Spring Boot REST API backend with comprehensive transaction management capabilities.

## Project Structure

```
trade-reporter/
├── trade-transaction-reporter/          # Spring Boot Backend (Java 17, Maven)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/tradereporter/
│   │   │   │   ├── controller/         # REST API endpoints
│   │   │   │   ├── service/            # Business logic
│   │   │   │   ├── model/              # JPA entities
│   │   │   │   ├── repository/         # Data access layer
│   │   │   │   ├── dto/                # Data transfer objects
│   │   │   │   ├── exception/          # Exception handling
│   │   │   │   └── config/             # Configuration classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                       # Unit and integration tests
│   ├── pom.xml                         # Maven configuration
│   ├── .github/workflows/
│   │   └── maven.yml                   # GitHub Actions CI workflow
│   └── README.md                       # Backend documentation
│
└── trade-reporter-frontend/            # React Frontend (Vite, Tailwind)
    ├── client/
    │   ├── src/
    │   │   ├── pages/                  # Page components
    │   │   ├── components/             # Reusable UI components
    │   │   ├── lib/                    # Utility functions and API client
    │   │   ├── config.ts               # Configuration
    │   │   ├── App.tsx                 # Main app component
    │   │   └── index.css               # Global styles
    │   ├── public/                     # Static assets
    │   └── index.html
    ├── package.json
    └── README.md
```

## Technology Stack

### Backend
- **Java 17** - Modern Java runtime
- **Spring Boot 3.x** - Enterprise application framework
- **Maven** - Dependency management and build tool
- **Spring Data JPA** - Object-relational mapping
- **H2 Database** - In-memory database (no setup required)
- **Springdoc-OpenAPI** - Swagger/OpenAPI documentation
- **Spring Validation** - Input validation framework

### Frontend
- **React 19** - UI library
- **Vite** - Modern build tool
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Axios** - HTTP client
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Wouter** - Lightweight routing

## Features

### Dashboard
The dashboard provides a comprehensive overview of all transactions with real-time metrics including total transaction count, pending items, completed transactions, and total transaction amount. Recent transactions are displayed in an easy-to-scan table format.

### Transaction Management
Submit new transactions through an intuitive form with validation for all required fields. The form includes dropdown selectors for instrument types, currencies, and transaction statuses, ensuring data consistency and accuracy.

### Transaction Filtering
Filter transactions by status (PENDING, COMPLETED, CANCELLED) to focus on specific transaction types. The filtering is applied in real-time with a simple dropdown selector and refresh button.

### Date Range Reports
Generate comprehensive reports for any date range with summary statistics including total records, total amount, and breakdown by status. Export reports as CSV files for further analysis in spreadsheet applications.

### API Documentation
Interactive Swagger UI documentation is available at `/swagger-ui.html` when the backend is running, allowing developers to explore and test all API endpoints directly.

## Getting Started

### Prerequisites
- Java Development Kit (JDK) 17 or newer
- Maven 3.6 or newer
- Node.js 18+ and npm or pnpm
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd trade-transaction-reporter
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

4. Access the H2 console at `http://localhost:8080/h2-console` with credentials:
   - JDBC URL: `jdbc:h2:mem:tradedb`
   - User: `sa`
   - Password: (leave blank)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd trade-reporter-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file with the backend API URL:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

   The frontend will be available at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions` | Submit a new transaction |
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions?status=PENDING` | Filter transactions by status |
| GET | `/api/transactions/report?from=2024-01-01&to=2024-12-31` | Get transactions within date range |

## Sample API Requests

### Submit a Transaction
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

### Get All Transactions
```bash
curl http://localhost:8080/api/transactions
```

### Filter by Status
```bash
curl http://localhost:8080/api/transactions?status=COMPLETED
```

### Get Date Range Report
```bash
curl "http://localhost:8080/api/transactions/report?from=2024-01-01&to=2024-12-31"
```

## Development Workflow

### Making Changes

**Backend Changes:**
1. Modify Java files in `trade-transaction-reporter/src/main/java/`
2. Rebuild with `mvn clean install`
3. Restart the Spring Boot application

**Frontend Changes:**
1. Modify React components in `trade-reporter-frontend/client/src/`
2. Changes are automatically reflected in the browser with Vite's hot module replacement
3. Check the browser console for any TypeScript or runtime errors

### Running Tests

**Backend Tests:**
```bash
cd trade-transaction-reporter
mvn test
```

**Frontend Type Checking:**
```bash
cd trade-reporter-frontend
pnpm check
```

## GitHub Actions CI/CD

The backend includes a GitHub Actions workflow that automatically runs tests on every push. The workflow is configured in `.github/workflows/maven.yml` and performs the following steps:

1. Checks out the code
2. Sets up Java 17
3. Builds the project with Maven
4. Runs all unit and integration tests

To enable CI/CD, ensure the workflow file is present and commit it to your repository.

## Deployment

### Backend Deployment
The Spring Boot application can be deployed to any Java-compatible platform such as AWS Elastic Beanstalk, Heroku, or a traditional server. Build a JAR file with `mvn clean package` and run it with `java -jar target/trade-transaction-reporter-0.0.1-SNAPSHOT.jar`.

### Frontend Deployment
The React frontend can be deployed to platforms like Vercel, Netlify, or AWS S3 with CloudFront. Build the production bundle with `pnpm build` and deploy the `dist` folder.

### Environment Configuration
Update the `VITE_API_URL` environment variable in the frontend deployment to point to the production backend API URL.

## Troubleshooting

### CORS Issues
If the frontend cannot reach the backend, ensure CORS is properly configured. The backend includes CORS configuration that allows requests from all origins. For production, update the `CorsConfig.java` file to restrict origins to your frontend domain.

### Database Connection
The H2 in-memory database is automatically created on application startup. No manual database setup is required. Data persists only during the application session.

### Port Conflicts
If port 8080 (backend) or 3000 (frontend) is already in use, modify the port in `application.properties` (backend) or use `pnpm dev -- --port 3001` (frontend).

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.
