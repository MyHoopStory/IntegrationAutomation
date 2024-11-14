# K3s Cluster Setup

## Overview

Our infrastructure uses K3s as a lightweight Kubernetes distribution, deployed and managed through Ansible automation.

## Architecture

- Single master node deployment
- Multiple worker nodes (configurable)
- Embedded etcd for high availability
- Customized for edge computing environments

## Installation Process

### Prerequisites

- Ubuntu 22.04 LTS on all nodes
- Minimum 4GB RAM for master nodes
- Minimum 2GB RAM for worker nodes
- Network connectivity between nodes

### Deployment Steps

1. Base System Configuration
2. K3s Server Installation
3. Worker Node Registration
4. Network Plugin Setup
5. Storage Configuration

## Configuration

### Server Configuration

```yaml
k3s_server:

node-ip: "{{ ansible_host }}"

tls-san:

* "{{ k3s_registration_address }}"

disable:

* traefik

flannel-backend: "none" # Using Cilium
```


### Agent Configuration

```yaml
k3s_agent:

node-ip: "{{ ansible_host }}"

server: "https://{{ k3s_registration_address }}:6443"
```


## Validation

The system performs several checks:

- Node registration status
- Control plane health
- Network connectivity
- Storage provisioner status

## Troubleshooting

Common issues and solutions:

1. Node Registration Failures

   - Check network connectivity
   - Verify node token
   - Review k3s service logs
2. Network Plugin Issues

   - Validate CNI configuration
   - Check pod networking
   - Review Cilium status

## Validation

The system performs several checks:

- Node registration status
- Control plane health
- Network connectivity
- Storage provisioner status

## Troubleshooting

Common issues and solutions:

1. Node Registration Failures

   - Check network connectivity
   - Verify node token
   - Review k3s service logs
2. Network Plugin Issues

   - Validate CNI configuration
   - Check pod networking
   - Review Cilium status
