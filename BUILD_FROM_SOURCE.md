# Building Postiz from Source

This guide explains how to build Postiz from source to enable Google Sign-In and remove the Authentik OAuth button.

## Why Build from Source?

The pre-built Docker image (`ghcr.io/gitroomhq/postiz-app:latest`) has Authentik OAuth hardcoded into the frontend. Since `NEXT_PUBLIC_*` variables are baked into Next.js at build time, we need to build from source to customize the OAuth provider.

## Changes Made

1. **Dockerfile.dev**: Updated to accept `NEXT_PUBLIC_*` build arguments
2. **docker-compose.prod.yml**: Changed from using pre-built image to building from source
3. **OAuth Configuration**: Set `POSTIZ_GENERIC_OAUTH=false` and empty OAuth display name to show Google Sign-In

## Building Locally

### Prerequisites

- Docker and Docker Compose installed
- At least 4GB RAM available for the build
- Sufficient disk space (~5GB for node_modules and build artifacts)

### Build Command

```bash
# Build the image
docker-compose -f docker-compose.prod.yml build postiz

# Or build and start all services
docker-compose -f docker-compose.prod.yml up --build
```

### Build Time

The build process typically takes **15-30 minutes** depending on your system:
- `pnpm install`: ~5-10 minutes
- `pnpm run build`: ~10-20 minutes

### Troubleshooting Build Issues

If the build fails due to memory issues:

1. **Increase Docker memory limit** (Docker Desktop → Settings → Resources → Memory)
2. **Use build cache**: The build will be faster on subsequent runs
3. **Build on a more powerful machine**: Consider using a CI/CD service or a VPS with more resources

## Deploying to EasyPanel

1. **Push your code** to your repository
2. **In EasyPanel**, update your Docker Compose configuration:
   - The `postiz` service will now build from source instead of using the pre-built image
   - Make sure all build args are correctly set in the `build.args` section
3. **Redeploy** the application

### Important Notes for EasyPanel

- **Build timeout**: EasyPanel may have a build timeout. If the build times out, you may need to:
  - Build the image locally and push to a Docker registry
  - Use EasyPanel's build settings to increase timeout (if available)
  - Consider using GitHub Actions or another CI/CD service to build and push the image

## Verifying Google Sign-In

After building and deploying:

1. Navigate to `/auth` or `/auth/login`
2. You should see **"Continue with Google"** button instead of "Sign in with Authentik"
3. The Google Sign-In button should work if you've configured:
   - `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` in EasyPanel environment variables
   - Added the redirect URI `https://your-domain.com/auth/google/callback` in Google Cloud Console

## Environment Variables

### Build-Time Variables (in `build.args`)

These are baked into the frontend at build time:

- `NEXT_PUBLIC_BACKEND_URL`: Your API URL
- `NEXT_PUBLIC_POSTIZ_OAUTH_DISPLAY_NAME`: Leave empty for Google Sign-In
- `POSTIZ_GENERIC_OAUTH`: Set to `"false"` for Google Sign-In
- `IS_GENERAL`: Set to `"true"` for general/public mode

### Runtime Variables (in `environment`)

These are used by the backend at runtime:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Your JWT secret
- `YOUTUBE_CLIENT_ID` / `YOUTUBE_CLIENT_SECRET`: Google OAuth credentials
- All other API keys and secrets

## Alternative: Build and Push to Registry

If EasyPanel's build environment is too limited, you can:

1. **Build locally** or use GitHub Actions
2. **Push to a Docker registry** (Docker Hub, GitHub Container Registry, etc.)
3. **Update docker-compose.prod.yml** to use your custom image:

```yaml
services:
  postiz:
    image: your-registry/postiz-app:latest  # Your custom image
    # ... rest of config
```

Then update EasyPanel to use this image instead of building from source.

