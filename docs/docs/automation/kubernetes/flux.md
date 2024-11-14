# Flux CD

## Overview

Flux CD manages our GitOps workflow, handling continuous delivery of applications and infrastructure configurations to our K3s cluster.

## Architecture

- Source Controller: Monitors Git repositories
- Kustomize Controller: Handles manifest reconciliation
- Helm Controller: Manages Helm releases
- Notification Controller: Manages alerts and events

## Installation

### Prerequisites

- K3s cluster running
- Git repository configured
- Kubernetes credentials available

### Bootstrap Process

```bash
flux bootstrap github \

--owner=$GITHUB_USER \

--repository=fleet-infra \

--branch=main \

--path=./clusters/production \

--personal
```


## Repository Structure

```plaintext
├── clusters/

│ └── production/

│ ├── infrastructure/

│ └── apps/

├── infrastructure/

└── apps/
```


## Key Components

### Sources

**##Key Components**

**### Sources**

```yaml
apiVersion: source.toolkit.fluxcd.io/v1

kind: GitRepository

metadata:

name: fleet-infra

namespace: flux-system

spec:

interval: 1m

url: https://github.com/$GITHUB_USER/fleet-infra

ref:

branch: main
```

Kustomizations

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1

kind: Kustomization

metadata:

name: apps

namespace: flux-system

spec:

interval: 10m

path: ./clusters/production/apps

prune: true

sourceRef:

kind: GitRepository

name: fleet-infra
```


## Monitoring

### Health Checks

**## Monitoring**

**### Health Checks**

```plaintext
flux check

flux get all

flux get kustomizations
```


### Troubleshooting

Common issues and solutions:

1. Repository Access

   - Verify SSH keys
   - Check repository permissions
   - Validate webhook configuration
2. Reconciliation Failures

   - Check source status
   - Verify YAML syntax
   - Review controller logs
3. Resource Conflicts

   - Check namespace conflicts
   - Verify resource names
   - Review kustomization overlays

## Best Practices

- Use semantic versioning for releases
- Implement proper RBAC controls
- Regular backup of Flux system
- Monitor reconciliation metrics
