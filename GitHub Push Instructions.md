# GitHub Push Instructions

Follow these steps to push the Trade Reporter project to GitHub.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in to your account
2. Click the **+** icon in the top right and select **New repository**
3. Enter repository name: `trade-reporter`
4. Add description: "Full-stack transaction management system with Spring Boot and React"
5. Choose visibility: **Public** (or Private if preferred)
6. **Do NOT** initialize with README, .gitignore, or license (we have these)
7. Click **Create repository**

## Step 2: Initialize Git and Push

From the project root directory (`/home/ubuntu/trade-reporter`), run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Trade Reporter full-stack application

- Spring Boot 3.x REST API backend with transaction management
- React 19 frontend with dashboard and reporting features
- H2 in-memory database integration
- Swagger/OpenAPI documentation
- GitHub Actions CI/CD workflow
- Comprehensive documentation and setup guides"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/trade-reporter.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Push

1. Go to your GitHub repository URL: `https://github.com/YOUR_USERNAME/trade-reporter`
2. Verify that all files are present
3. Check that the README.md is displayed on the main page

## Step 4: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Verify that the CI/CD workflow is present
4. The workflow will automatically run on future pushes

## Step 5: Add Repository Topics (Optional)

1. Go to repository settings
2. Add topics: `spring-boot`, `react`, `rest-api`, `transaction-management`

## Step 6: Configure Repository Settings (Optional)

1. **Branch Protection**: Go to Settings → Branches → Add rule for `main`
   - Require pull request reviews
   - Require status checks to pass

2. **Collaborators**: Go to Settings → Collaborators to add team members

3. **Secrets**: Go to Settings → Secrets and variables → Actions
   - Add any API keys or secrets needed for CI/CD

## Troubleshooting

### Authentication Issues

If you get authentication errors:

```bash
# Use SSH (recommended)
git remote set-url origin git@github.com:YOUR_USERNAME/trade-reporter.git

# Or use personal access token with HTTPS
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/trade-reporter.git
```

### Already Exists Error

If the repository already has commits:

```bash
# Force push (use with caution)
git push -u origin main --force
```

### Large Files

If you get "file too large" errors:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.jar"
git lfs track "*.zip"

# Add and commit
git add .gitattributes
git commit -m "Add Git LFS tracking"
git push
```

## After Push

### Set Up Collaborators

1. Go to Settings → Collaborators
2. Add team members by username or email

### Configure Deployment

1. For backend: Use GitHub Actions to deploy to AWS, Heroku, etc.
2. For frontend: Connect to Vercel or Netlify for automatic deployments

### Create Issues and Discussions

1. Use Issues for bug reports and feature requests
2. Use Discussions for questions and ideas

## Useful Git Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Create a new branch for features
git checkout -b feature/your-feature-name

# Push a feature branch
git push origin feature/your-feature-name

# Create a pull request from GitHub UI

# Update local repository
git pull origin main

# Sync with upstream (if forked)
git fetch upstream
git rebase upstream/main
git push origin main
```

## Next Steps

1. **Invite Collaborators**: Add team members to the repository
2. **Set Up CI/CD**: Configure GitHub Actions for automated testing and deployment
3. **Enable Discussions**: Enable GitHub Discussions for community engagement
4. **Create Releases**: Tag releases with version numbers
5. **Document**: Keep README and documentation up to date

## Additional Resources

- [GitHub Documentation](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub CLI](https://cli.github.com)

---

For more information, see README.md, SETUP_GUIDE.md, and DEPLOYMENT.md
