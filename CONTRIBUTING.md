# Contributing to Live Server++

First off, thank you for considering contributing to Live Server++! 🎉

This document provides guidelines for contributing to the project. Following these guidelines helps maintain code quality and makes the review process smoother.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Testing](#testing)

---

## 📜 Code of Conduct

This project follows a simple code of conduct:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

---

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**

- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or GIFs (if applicable)
- VS Code version
- Operating system
- Extension version

**Use this template:**

```markdown
**Description:**
Brief description of the bug

**Steps to Reproduce:**

1. Open file X
2. Click on Y
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**

- VS Code Version: 1.85.0
- OS: Windows 11 / macOS 14 / Ubuntu 22.04
- Extension Version: 1.0.0

**Screenshots:**
[Attach if relevant]
```

### Suggesting Features

Feature suggestions are welcome! Before suggesting:

1. Check if it's already been suggested
2. Ensure it aligns with the project's goals
3. Consider if it's broadly useful

**Use this template:**

```markdown
**Feature Description:**
Clear description of the feature

**Use Case:**
Why is this feature needed? What problem does it solve?

**Proposed Solution:**
How should it work?

**Alternatives Considered:**
Other approaches you've thought about
```

### Pull Requests

We actively welcome pull requests for:

- Bug fixes
- Documentation improvements
- New features (discuss first in an issue)
- Performance improvements
- Code refactoring

---

## 🛠️ Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [VS Code](https://code.visualstudio.com/)
- Git

### Setup Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/live-server-plus-plus.git
cd live-server-plus-plus

# 3. Add upstream remote
git remote add upstream https://github.com/MohdYahyaMahmodi/live-server-plus-plus.git

# 4. Install dependencies
npm install

# 5. Compile TypeScript
npm run compile

# 6. Open in VS Code
code .

# 7. Press F5 to launch Extension Development Host
```

### Running the Extension

1. Press `F5` in VS Code
2. A new "Extension Development Host" window opens
3. Open a folder with HTML files
4. Right-click an HTML file → "Open with Live Server++"
5. Make changes and see them reflected

### Watching for Changes

```bash
# Terminal 1: Watch TypeScript compilation
npm run watch

# Then press F5 to reload the extension
```

---

## 📁 Project Structure

```
live-server-plus-plus/
├── src/
│   ├── extension.ts      # Extension entry point, commands
│   ├── server.ts         # HTTP/WebSocket server logic
│   └── types.ts          # TypeScript interfaces
├── out/                  # Compiled JavaScript (gitignored)
├── node_modules/         # Dependencies (gitignored)
├── .vscode/
│   ├── launch.json       # Debug configuration
│   └── tasks.json        # Build tasks
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
└── README.md
```

### Key Files

- **`src/extension.ts`**: Extension activation, command registration, VS Code API integration
- **`src/server.ts`**: HTTP server, WebSocket server, file watching, caching logic
- **`src/types.ts`**: Shared TypeScript interfaces

---

## 📏 Coding Standards

### TypeScript Style

- Use TypeScript strict mode
- Add type annotations for public APIs
- Use `const` over `let` when possible
- Prefer `async/await` over callbacks

### Code Formatting

```bash
# Run linter
npm run lint
```

### Naming Conventions

- **Variables/Functions**: `camelCase`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private properties**: prefix with `_` (optional)

### Comments

- Add JSDoc comments for public methods
- Explain "why" not "what" in comments
- Keep comments concise

**Example:**

```typescript
/**
 * Finds an available port starting from the given port number.
 * Increments port if already in use.
 * @param startPort - The port to start checking from
 * @returns Promise resolving to an available port number
 */
private async findAvailablePort(startPort: number): Promise<number> {
  // Implementation
}
```

---

## 📤 Submitting Changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Build process, dependencies, etc.

**Examples:**

```bash
feat(server): add CSS hot reload support
fix(cache): prevent memory leak with large files
docs(readme): update installation instructions
refactor(extension): simplify command registration
```

### Pull Request Process

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. **Make Changes**

   - Write clean, documented code
   - Follow coding standards
   - Test your changes thoroughly

3. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: your descriptive message"
   ```

4. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**

   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Link any related issues

6. **PR Review**
   - Address review comments
   - Push additional commits if needed
   - Once approved, a maintainer will merge

### PR Checklist

Before submitting, ensure:

- [ ] Code compiles without errors (`npm run compile`)
- [ ] Linter passes (`npm run lint`)
- [ ] Changes are tested in Extension Development Host
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow conventions
- [ ] PR description clearly explains changes

---

## 🧪 Testing

### Manual Testing

1. Launch Extension Development Host (F5)
2. Test the following scenarios:
   - Start/stop server
   - Edit HTML/CSS/JS without saving
   - Verify live reload works
   - Check CSS hot reload
   - Test console forwarding
   - Verify port auto-increment
   - Test with different browsers

### Testing Checklist

- [ ] Server starts successfully
- [ ] Browser opens automatically
- [ ] Live reload works as you type
- [ ] CSS updates without full reload
- [ ] Console logs appear in Output panel
- [ ] Server stops cleanly
- [ ] No memory leaks after multiple start/stop cycles
- [ ] Works with nested directory structures
- [ ] Handles large files gracefully
- [ ] Port auto-increments when busy

---

## 📝 Documentation

When adding features:

- Update `README.md` with new settings/features
- Add entries to `CHANGELOG.md`
- Update code comments
- Consider adding examples

---

## 🎯 Areas to Contribute

Looking for ideas? Check out:

- **Performance**: Optimize caching, reduce memory usage
- **Features**: Proxy support, custom middleware, HTTPS
- **Documentation**: Tutorials, better examples
- **Testing**: Automated tests, edge case coverage
- **Bug Fixes**: Check the issues page

---

## 💬 Questions?

- Open an [issue](https://github.com/MohdYahyaMahmodi/live-server-plus-plus/issues) for questions
- Check existing issues/PRs first

---

## 🙏 Thank You!

Every contribution, no matter how small, is valued and appreciated!

**Happy coding!** 🚀
