# Push Docker Image to Registry

To reduce build time in EasyPanel, push your locally built image to a Docker registry.

## Option 1: Docker Hub (Recommended - Easiest)

### 1. Login to Docker Hub
```bash
docker login
```

### 2. Tag your image
```bash
docker tag postiz-app_postiz:latest YOUR_DOCKERHUB_USERNAME/postiz-app:latest
# Example: docker tag postiz-app_postiz:latest stephenlovino/postiz-app:latest
```

### 3. Push the image
```bash
docker push YOUR_DOCKERHUB_USERNAME/postiz-app:latest
```

### 4. Update docker-compose.prod.yml
Replace the `build:` section with:
```yaml
services:
  postiz:
    image: YOUR_DOCKERHUB_USERNAME/postiz-app:latest
    # Remove the build: section
```

---

## Option 2: GitHub Container Registry (ghcr.io)

### 1. Create a GitHub Personal Access Token
- Go to: https://github.com/settings/tokens
- Create token with `write:packages` permission

### 2. Login to GitHub Container Registry
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### 3. Tag your image
```bash
docker tag postiz-app_postiz:latest ghcr.io/YOUR_GITHUB_USERNAME/postiz-app:latest
# Example: docker tag postiz-app_postiz:latest ghcr.io/StephenLovino/postiz-app:latest
```

### 4. Push the image
```bash
docker push ghcr.io/YOUR_GITHUB_USERNAME/postiz-app:latest
```

### 5. Update docker-compose.prod.yml
Replace the `build:` section with:
```yaml
services:
  postiz:
    image: ghcr.io/YOUR_GITHUB_USERNAME/postiz-app:latest
    # Remove the build: section
```

---

## Option 3: Private Registry (if you have one)

```bash
docker tag postiz-app_postiz:latest YOUR_REGISTRY/postiz-app:latest
docker push YOUR_REGISTRY/postiz-app:latest
```

---

## After Pushing

1. Update `docker-compose.prod.yml` to use the image instead of building
2. Commit and push the changes
3. Deploy to EasyPanel - it will pull the pre-built image (much faster!)

## Image Size

The image is ~5.5GB, so pushing may take 10-20 minutes depending on your upload speed.

