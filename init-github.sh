#!/bin/bash

# Trade Reporter - GitHub Repository Initialization Script
# This script initializes the project for GitHub and prepares it for deployment

set -e

echo "=========================================="
echo "Trade Reporter - GitHub Setup"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    echo "✓ Git repository initialized"
else
    echo "✓ Git repository already exists"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Backend
trade-transaction-reporter/target/
trade-transaction-reporter/.classpath
trade-transaction-reporter/.project
trade-transaction-reporter/.settings/
trade-transaction-reporter/*.iml
trade-transaction-reporter/.idea/

# Frontend
trade-reporter-frontend/node_modules/
trade-reporter-frontend/dist/
trade-reporter-frontend/.env.local
trade-reporter-frontend/.env.*.local
trade-reporter-frontend/pnpm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
EOF
    echo "✓ .gitignore created"
else
    echo "✓ .gitignore already exists"
fi

# Add all files
echo ""
echo "Adding files to Git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Trade Reporter full-stack application

- Spring Boot REST API backend with transaction management
- React frontend with dashboard and reporting features
- H2 in-memory database integration
- Swagger/OpenAPI documentation
- GitHub Actions CI/CD workflow
- Comprehensive documentation and setup guides" || echo "Note: Commit may already exist"

echo ""
echo "=========================================="
echo "✓ GitHub initialization complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/trade-reporter.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "For more information, see README.md and SETUP_GUIDE.md"
