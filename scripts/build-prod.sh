#!/bin/bash

# Set registry (defaults to GitHub Container Registry)
GITHUB_USERNAME=${GITHUB_USERNAME:-"your-github-username"}
REGISTRY=${1:-"ghcr.io/$GITHUB_USERNAME"}
VERSION=${2:-"latest"}

# Build production images
echo "Building production images..."
docker build \
  -f webapp/Dockerfile.prod \
  --target frontend -t ${REGISTRY}/webapp-frontend:${VERSION} \
  --target backend -t ${REGISTRY}/webapp-backend:${VERSION} \
  ./webapp

# Login to GitHub Container Registry
echo "Logging into GitHub Container Registry..."
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# Push images
echo "Pushing images to registry..."
docker push ${REGISTRY}/webapp-frontend:${VERSION}
docker push ${REGISTRY}/webapp-backend:${VERSION} 