# Trade Reporter - Architecture Documentation

This document describes the system architecture, design patterns, and technical decisions behind Trade Reporter.

## System Overview

Trade Reporter is a full-stack web application consisting of two main components:

1. **Backend API** - Spring Boot REST API for transaction management
2. **Frontend UI** - React single-page application for user interaction

Both components communicate via HTTP REST APIs with JSON payloads.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/HTTPS
                         │
        ┌────────────────┴────────────────┐
        │                                 │
┌───────▼─────────────┐        ┌─────────▼──────────┐
│  React Frontend     │        │  Spring Boot API   │
│  (Port 3000)        │        │  (Port 8080)       │
│                     │        │                    │
│ - Dashboard         │        │ - Controllers      │
│ - Forms             │        │ - Services         │
│ - Reports           │        │ - Repositories     │
│ - Routing           │        │ - Entities         │
└─────────────────────┘        └─────────┬──────────┘
                                         │
                                    JDBC/SQL
                                         │
                               ┌─────────▼──────────┐
                               │  H2 Database       │
                               │  (In-Memory)       │
                               │                    │
                               │ - Transactions     │
                               │ - Indices          │
                               └────────────────────┘
```

## Backend Architecture

### Layered Architecture

The backend follows a classic three-layer architecture pattern:

```
┌────────────────────────────────────────┐
│      Controller Layer                  │
│  (REST Endpoints, Request Handling)    │
└─────────────────┬──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│      Service Layer                     │
│  (Business Logic, Transactions)        │
└─────────────────┬──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│      Repository Layer                  │
│  (Data Access, JPA Operations)         │
└─────────────────┬──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│      Database Layer                    │
│  (H2 In-Memory Database)               │
└────────────────────────────────────────┘
```

### Core Components

**TransactionController**
- Handles HTTP requests and responses
- Validates input parameters
- Delegates to service layer
- Returns appropriate HTTP status codes

**TransactionService**
- Implements business logic
- Manages transactions
- Performs data transformations
- Handles error scenarios

**TransactionRepository**
- Extends JpaRepository for CRUD operations
- Provides custom query methods
- Manages database interactions

**Transaction Entity**
- JPA entity representing transaction data
- Maps to database table
- Includes validation annotations

### Configuration

**CorsConfig** - Enables cross-origin requests from frontend

**OpenApiConfig** - Configures Swagger/OpenAPI documentation

**GlobalExceptionHandler** - Centralized exception handling and error responses

## Frontend Architecture

### Component Structure

```
App (Root Component)
├── Sidebar (Navigation)
├── Dashboard (Home Page)
│   ├── MetricCards
│   └── TransactionTable
├── SubmitTransaction (Form Page)
│   └── TransactionForm
├── Transactions (List Page)
│   ├── FilterSection
│   └── TransactionTable
└── Report (Report Page)
    ├── DateRangeSelector
    ├── StatisticsCards
    └── ReportTable
```

### State Management

- **React Hooks** - Local component state with `useState`
- **React Hook Form** - Form state and validation
- **Context API** - Theme context for dark/light mode

### API Integration

**API Client** (`lib/api.ts`)
- Axios instance with base configuration
- Request/response interceptors
- Error handling and transformation
- Typed API methods

## Data Flow

### Transaction Submission Flow

```
1. User fills form in SubmitTransaction component
2. Form validation with Zod schema
3. Submit button triggers onSubmit handler
4. API client sends POST request to /api/transactions
5. Backend TransactionController receives request
6. TransactionService validates and saves transaction
7. TransactionRepository persists to H2 database
8. Response returned to frontend
9. Toast notification shown to user
10. User redirected to transactions list
```

### Transaction Retrieval Flow

```
1. Dashboard/Transactions component mounts
2. useEffect triggers API call
3. API client sends GET request to /api/transactions
4. Backend TransactionController queries database
5. TransactionService retrieves and transforms data
6. TransactionRepository executes JPA query
7. Results returned to frontend
8. Component state updated with data
9. UI re-renders with transaction data
```

## Database Schema

### Transactions Table

```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trade_id VARCHAR(255) NOT NULL,
    instrument_type VARCHAR(255) NOT NULL,
    amount DECIMAL(38,2) NOT NULL,
    currency VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    trade_date DATE NOT NULL
);
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/transactions` | Create new transaction |
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions?status=X` | Filter by status |
| GET | `/api/transactions/report?from=X&to=Y` | Date range report |

## Security Considerations

### CORS Configuration
- Allows requests from frontend origin
- Restricts HTTP methods
- Configurable for production

### Input Validation
- Spring Validation annotations
- Zod schema validation on frontend
- Server-side validation required

### Error Handling
- Global exception handler
- Consistent error response format
- No sensitive data in error messages

## Performance Considerations

### Backend
- Connection pooling with HikariCP
- Lazy loading for associations
- Query optimization with proper indexing
- Caching potential for frequently accessed data

### Frontend
- Code splitting with Vite
- Lazy loading of routes
- Component memoization
- Efficient re-renders with React hooks

## Scalability

### Horizontal Scaling
- Stateless backend design
- Load balancer compatible
- Session-less authentication ready

### Vertical Scaling
- Database connection pooling
- Query optimization
- Caching strategies

### Future Improvements
- Implement pagination for large datasets
- Add database indexing strategies
- Implement API rate limiting
- Add caching layer (Redis)
- Implement message queuing for async operations

## Deployment Architecture

### Development
- Local backend on port 8080
- Local frontend on port 3000
- H2 in-memory database

### Production
- Containerized deployment with Docker
- Nginx reverse proxy
- External database (MySQL/PostgreSQL)
- CDN for static assets
- SSL/TLS encryption

## Technology Decisions

### Backend
- **Spring Boot** - Mature, feature-rich framework
- **Maven** - Standard build tool for Java projects
- **H2** - Easy setup, no external dependencies for dev
- **JPA/Hibernate** - Standard ORM for Java

### Frontend
- **React** - Component-based, large ecosystem
- **Vite** - Fast build tool, excellent DX
- **TypeScript** - Type safety and better IDE support
- **Tailwind CSS** - Utility-first, rapid development
- **shadcn/ui** - High-quality pre-built components

## Testing Strategy

### Backend
- Unit tests for services
- Integration tests for controllers
- Mock repositories for isolation

### Frontend
- Component testing with React Testing Library
- Type checking with TypeScript
- Manual testing for UI/UX

## Monitoring & Observability

### Backend
- Spring Boot Actuator endpoints
- Application logs
- Error tracking

### Frontend
- Browser console logging
- Network request monitoring
- Performance metrics

---

For more details, see README.md and individual component documentation.
