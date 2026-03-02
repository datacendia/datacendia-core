# Contributing to Datacendia

Thank you for your interest in contributing to Datacendia -- The Defensible AI Platform.

## Quick Start

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/datacendia-core.git
cd datacendia-core

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start infrastructure
docker compose up -d postgres redis neo4j ollama

# Run migrations
cd backend && npx prisma db push && cd ..

# Start development
npm run dev          # Frontend on :5173
cd backend && npm run dev  # Backend on :3001
```

## Development Workflow

1. **Fork** the repository
2. **Create a branch** from `master`: `git checkout -b feat/my-feature`
3. **Make changes** following the coding standards below
4. **Test** your changes
5. **Commit** with conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
6. **Push** and open a Pull Request

## Branch Naming

- `feat/description` -- New features
- `fix/description` -- Bug fixes
- `docs/description` -- Documentation
- `refactor/description` -- Code refactoring
- `test/description` -- Test additions

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(council): add cross-examination mode
fix(auth): handle expired JWT refresh tokens
docs: update deployment guide for Kubernetes
refactor(api): consolidate route handlers
```

## Coding Standards

### TypeScript
- Strict mode enabled
- No `any` types unless absolutely necessary (document why)
- Use `interface` over `type` for object shapes
- Explicit return types on exported functions

### React
- Functional components only
- Named exports (not default) for components
- Custom hooks prefixed with `use`
- Prop interfaces named `ComponentNameProps`

### Backend
- Express route handlers in `backend/src/routes/`
- Business logic in `backend/src/services/`
- Prisma for database access
- Zod for request validation

### File Organization
- One component per file
- Co-locate tests with source (`Component.test.tsx`)
- Index files for barrel exports

## What to Contribute

### Good First Issues
- Look for issues labeled `good-first-issue`
- Documentation improvements
- Test coverage additions
- Bug fixes with clear reproduction steps

### High Impact
- New council deliberation modes
- Industry vertical agents
- Compliance framework integrations
- Performance improvements
- Accessibility improvements

### Community vs Enterprise

See [COMMUNITY.md](COMMUNITY.md) for the boundary between open-source and enterprise features. Community contributions should target community-edition directories only.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive experience for everyone.

## Questions?

- Open a [GitHub Discussion](https://github.com/datacendia/datacendia-core/discussions)
- Email: community@datacendia.com

Thank you for helping make AI decisions defensible.
