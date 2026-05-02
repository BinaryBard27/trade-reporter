# Trade Transaction Reporter API

This project provides a RESTful API for managing and reporting trade transactions. It's built with Spring Boot 3.x, Java 17, Maven, Spring Data JPA, and uses an H2 in-memory database for simplicity.

## Features

*   **Transaction Management**: Submit and list trade transactions.
*   **Filtering**: Filter transactions by status.
*   **Reporting**: Generate transaction reports within a specified date range.
*   **Data Validation**: Input validation for transaction data.
*   **API Documentation**: Interactive API documentation using Swagger/OpenAPI (springdoc-openapi).
*   **CI Workflow**: GitHub Actions workflow to run tests on every push.

## Technologies Used

*   **Java 17**
*   **Spring Boot 3.x**
*   **Maven**
*   **Spring Data JPA**
*   **H2 Database** (in-memory)
*   **Lombok**
*   **Springdoc-openapi** (for Swagger UI)
*   **GitHub Actions**

## Setup Instructions

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository (if applicable):**

    ```bash
    git clone <repository-url>
    cd trade-transaction-reporter
    ```

2.  **Prerequisites:**

    Ensure you have Java Development Kit (JDK) 17 or newer installed.

3.  **Build the project:**

    Navigate to the project root directory and build the project using Maven:

    ```bash
    mvn clean install
    ```

4.  **Run the application:**

    You can run the Spring Boot application using the Maven Spring Boot plugin:

    ```bash
    mvn spring-boot:run
    ```

    The application will start on `http://localhost:8080`.

## API Endpoints

The API provides the following endpoints:

### 1. Submit a new trade transaction

*   **URL**: `/api/transactions`
*   **Method**: `POST`
*   **Content-Type**: `application/json`
*   **Request Body Example**:

    ```json
    {
        "tradeId": "TRD001",
        "instrumentType": "EQUITY",
        "amount": 1500.75,
        "currency": "USD",
        "status": "PENDING",
        "tradeDate": "2024-04-25"
    }
    ```

*   **Sample `curl` command**:

    ```bash
    curl -X POST http://localhost:8080/api/transactions \
    -H "Content-Type: application/json" \
    -d '{"tradeId": "TRD001", "instrumentType": "EQUITY", "amount": 1500.75, "currency": "USD", "status": "PENDING", "tradeDate": "2024-04-25"}'
    ```

### 2. List all transactions

*   **URL**: `/api/transactions`
*   **Method**: `GET`
*   **Sample `curl` command**:

    ```bash
    curl http://localhost:8080/api/transactions
    ```

### 3. Filter transactions by status

*   **URL**: `/api/transactions?status={status}`
*   **Method**: `GET`
*   **Query Parameter**: `status` (e.g., `PENDING`, `COMPLETED`, `CANCELLED`)
*   **Sample `curl` command**:

    ```bash
    curl http://localhost:8080/api/transactions?status=PENDING
    ```

### 4. Get a date-range report

*   **URL**: `/api/transactions/report?from={startDate}&to={endDate}`
*   **Method**: `GET`
*   **Query Parameters**:
    *   `from`: Start date (format: `YYYY-MM-DD`)
    *   `to`: End date (format: `YYYY-MM-DD`)
*   **Sample `curl` command**:

    ```bash
    curl http://localhost:8080/api/transactions/report?from=2024-01-01&to=2024-12-31
    ```

## Swagger UI

Once the application is running, you can access the Swagger UI for interactive API documentation at:

`http://localhost:8080/swagger-ui.html`

## H2 Console

The H2 console is enabled for inspecting the in-memory database. You can access it at:

`http://localhost:8080/h2-console`

Use the following credentials:
*   **JDBC URL**: `jdbc:h2:mem:tradedb`
*   **User Name**: `sa`
*   **Password**: (leave blank)

## GitHub Actions CI Workflow

The project includes a GitHub Actions workflow (`.github/workflows/maven.yml`) that automatically builds the project and runs tests on every push to the repository. This ensures code quality and prevents regressions.
