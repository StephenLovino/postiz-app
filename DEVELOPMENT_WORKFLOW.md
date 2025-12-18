# Development Workflow: Dual-Repo Strategy

This document explains how to maintain AHA Social Manager across two GitHub repositories while keeping them in sync.

## Repository Structure

1. **`origin` (StephenLovino/postiz-app)**: 
   - Your fork of the upstream Postiz repository
   - Used for pulling upstream updates from `gitroomhq/postiz-app`
   - Maintains clear fork lineage and development history

2. **`aha` (StephenLovino/aha-social-manager)**:
   - Public-facing repository with AHA branding
   - This is the canonical source users see and link to
   - Contains the same codebase but with AHA Social Manager branding

## Workflow: Syncing Upstream Changes

When you want to pull updates from the upstream Postiz repository:

### 1. Add/Update Upstream Remote (if not already added)

```bash
git remote add upstream https://github.com/gitroomhq/postiz-app.git
# Or if it already exists:
git remote set-url upstream https://github.com/gitroomhq/postiz-app.git
```

### 2. Fetch and Merge Upstream Changes

```bash
# Fetch latest from upstream
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Resolve any conflicts if they occur
# (Common areas: branding strings, logos, package.json names)

# After resolving conflicts:
git add .
git commit -m "chore: merge upstream Postiz changes"
```

### 3. Push to Both Repositories

```bash
# Push to your fork (origin)
git push origin main

# Push to AHA Social Manager repo (aha)
git push aha main
```

## Handling Conflicts

Common conflict areas when merging upstream:

- **Branding strings**: `Postiz` vs `AHA Social Manager`
  - Keep AHA branding in your version
- **Logo/image references**: `/postiz.svg` vs `/logo.svg`
  - Keep AHA assets
- **Package names**: `@postiz/*` vs `@aha/*`
  - Keep AHA naming
- **README.md**: 
  - Keep AHA attribution section, merge feature updates

## Best Practices

1. **Always test locally** after merging upstream changes
2. **Review conflicts carefully** - don't auto-accept upstream branding
3. **Keep commits clean** - use descriptive commit messages
4. **Sync both repos** - always push to both `origin` and `aha` after merging
5. **Tag releases** - when you make significant changes, tag both repos:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   git push aha v1.0.0
   ```

## Quick Reference

```bash
# View all remotes
git remote -v

# Fetch from upstream
git fetch upstream

# Merge upstream into main
git merge upstream/main

# Push to both repos
git push origin main && git push aha main
```

## Notes

- The `origin` remote maintains the fork relationship with upstream Postiz
- The `aha` remote is the public-facing repo for AHA Social Manager
- Both repos should always have the same codebase (except for branding differences)
- The AGPL-3.0 license requires the source to be publicly accessible, which is satisfied by the `aha-social-manager` repo

