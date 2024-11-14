# Kubernetes Networking

## Overview

Our K3s cluster uses Cilium as the primary CNI (Container Network Interface) provider, offering enhanced networking capabilities and security features.

## Network Architecture

### Core Components

- Cilium CNI
- MetalLB for load balancing
- CoreDNS for service discovery
- Ingress NGINX for external access

## Cilium Configuration

### Installation

```yaml
helm install cilium cilium/cilium \

--namespace kube-system \

--set kubeProxyReplacement=strict \

--set k8sServiceHost=${API_SERVER_IP} \

--set k8sServicePort=6443
```

### Network Policies

```yaml
apiVersion: "cilium.io/v2"

kind: CiliumNetworkPolicy

metadata:

name: "secure-pods"

spec:

endpointSelector:

matchLabels:

app: secure-app

ingress:

* fromEndpoints:
* matchLabels:

app: authorized-client
```

## Load Balancer Setup

### MetalLB Configuration

```yaml
apiVersion: metallb.io/v1beta1

kind: IPAddressPool

metadata:

name: first-pool

namespace: metallb-system

spec:

addresses:

* 192.168.1.240-192.168.1.250
```

apiVersion: metallb.io/v1beta1

kind: IPAddressPool

metadata:

name: first-pool

namespace: metallb-system

spec:

addresses:

* 192.168.1.240-192.168.1.250

## DNS Management

### CoreDNS Configuration

```yaml
apiVersion: v1

kind: ConfigMap

metadata:

name: coredns

namespace: kube-system

data:

Corefile: |

.:53 {

errors

health

kubernetes cluster.local in-addr.arpa ip6.arpa {

pods insecure

fallthrough in-addr.arpa ip6.arpa

}

forward . /etc/resolv.conf

cache 30

loop

reload

loadbalance

}
```

## Troubleshooting

### Common Issues

1. Pod Communication

   - Check Cilium status
   - Verify network policies
   - Review pod logs
2. Service Discovery

   - Validate CoreDNS configuration
   - Check service definitions
   - Test DNS resolution
3. Load Balancer Issues

   - Verify IP pool configuration
   - Check service annotations
   - Review MetalLB logs

### Diagnostic Commands

#Check Cilium status

## Monitoring

- Cilium Hubble UI for network visibility
- Prometheus metrics for network performance
- Grafana dashboards for visualization
