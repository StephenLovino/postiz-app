#!/bin/bash
# Script to push Postiz Docker image to GitHub Container Registry

set -e

GITHUB_USERNAME="stephenlovino"  # Must be lowercase for Docker registry
IMAGE_NAME="postiz-app"
TAG="latest"
FULL_IMAGE_NAME="ghcr.io/${GITHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "📦 Tagging image..."
docker tag postiz-app_postiz:latest ${FULL_IMAGE_NAME}

echo "🔐 Logging in to GitHub Container Registry..."
echo "Please enter your GitHub Personal Access Token (with write:packages permission):"
echo "Get one at: https://github.com/settings/tokens"
read -s GITHUB_TOKEN

echo $GITHUB_TOKEN | docker login ghcr.io -u ${GITHUB_USERNAME} --password-stdin

echo "⬆️  Pushing image to ${FULL_IMAGE_NAME}..."
echo "This may take 10-20 minutes (image is ~5.5GB)..."
docker push ${FULL_IMAGE_NAME}

echo "✅ Image pushed successfully!"
echo ""
echo "Next steps:"
echo "1. Update docker-compose.prod.yml to use: ${FULL_IMAGE_NAME}"
echo "2. Commit and push the changes"
echo "3. Deploy to EasyPanel"

