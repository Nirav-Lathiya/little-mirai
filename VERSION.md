# Version Management

This project uses [Semantic Versioning](https://semver.org/) for version management.

## Version Format
Versions follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Current Version
**v0.1.0** - Initial release with complete e-commerce functionality

## Release Process

### Automated Version Bumping

Use the following npm scripts for version management:

```bash
# Patch version (0.1.0 -> 0.1.1)
npm run release:patch

# Minor version (0.1.0 -> 0.2.0)
npm run release:minor

# Major version (0.1.0 -> 1.0.0)
npm run release:major

# Push tags to remote
npm run release:push
```

### Manual Process

If you prefer manual control:

1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Commit changes
4. Create git tag: `git tag v1.2.3`
5. Push: `git push origin main --tags`

## Git Tags

All releases are tagged with semantic versions:
- `v0.1.0` - Initial release
- Future tags will follow: `v0.2.0`, `v1.0.0`, etc.

## Branching Strategy

- `main`: Production-ready code
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-name`
- Releases: Tagged from `main` branch

## Release Checklist

- [ ] Update `CHANGELOG.md` with new features/bug fixes
- [ ] Run tests: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] Update version: `npm run release:patch/minor/major`
- [ ] Push tags: `npm run release:push`

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for detailed change history.