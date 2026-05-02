# Contributing to Trade Reporter

Thank you for your interest in contributing to Trade Reporter! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and professional in all interactions with other contributors and maintainers.

## Getting Started

### Prerequisites
- Java Development Kit (JDK) 17 or newer
- Maven 3.6 or newer
- Node.js 18 or newer
- pnpm (or npm/yarn)
- Git

### Setting Up Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/trade-reporter.git
   cd trade-reporter
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/trade-reporter.git
   ```

4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Set up the project:**
   ```bash
   # Backend setup
   cd trade-transaction-reporter
   mvn clean install
   
   # Frontend setup
   cd ../trade-reporter-frontend
   pnpm install
   echo "VITE_API_URL=http://localhost:8080/api" > .env.local
   ```

## Development Workflow

### Backend Development

1. **Make changes** in `trade-transaction-reporter/src/`

2. **Run tests:**
   ```bash
   cd trade-transaction-reporter
   mvn test
   ```

3. **Build the project:**
   ```bash
   mvn clean install
   ```

4. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

### Frontend Development

1. **Make changes** in `trade-reporter-frontend/client/src/`

2. **Type check:**
   ```bash
   cd trade-reporter-frontend
   pnpm check
   ```

3. **Build the project:**
   ```bash
   pnpm build
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

## Commit Guidelines

Follow these guidelines when committing your changes:

1. **Use clear, descriptive commit messages:**
   ```
   feat: Add transaction filtering by date range
   fix: Resolve CORS issue with frontend requests
   docs: Update API documentation
   style: Format code according to project standards
   refactor: Simplify transaction service logic
   test: Add unit tests for transaction controller
   ```

2. **Keep commits atomic** - each commit should represent a single logical change

3. **Reference issues** when applicable:
   ```
   fix: Resolve transaction validation issue (#123)
   ```

## Pull Request Process

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title describing the changes
   - Detailed description of what was changed and why
   - Reference to related issues
   - Screenshots for UI changes

4. **Ensure CI/CD passes:**
   - All GitHub Actions workflows must pass
   - No merge conflicts
   - Code quality checks pass

5. **Address review feedback:**
   - Respond to comments
   - Make requested changes
   - Push updates to the same branch

## Code Style Guidelines

### Backend (Java)

- Follow Google Java Style Guide
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Keep methods focused and concise

### Frontend (React/TypeScript)

- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety
- Keep components focused and reusable
- Use meaningful component and variable names

## Testing

### Backend Tests

```bash
cd trade-transaction-reporter
mvn test
```

### Frontend Type Checking

```bash
cd trade-reporter-frontend
pnpm check
```

## Documentation

- Update README.md if you add new features
- Document API changes in comments
- Add inline comments for complex logic
- Update SETUP_GUIDE.md for setup/deployment changes

## Reporting Issues

When reporting bugs, please include:

1. **Description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Screenshots** or error messages
5. **Environment** (OS, Java version, Node version, etc.)

## Feature Requests

When suggesting features, please:

1. **Describe the feature** clearly
2. **Explain the use case** and benefits
3. **Provide examples** if applicable
4. **Discuss implementation** approach if you have ideas

## Questions?

- Check existing issues and discussions
- Review the README.md and SETUP_GUIDE.md
- Open a new discussion if your question isn't answered

## License

By contributing to Trade Reporter, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Trade Reporter! Your efforts help make this project better for everyone.
