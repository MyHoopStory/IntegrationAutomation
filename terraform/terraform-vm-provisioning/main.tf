resource "null_resource" "get_vcenter_token" {
  provisioner "local-exec" {
    command = "bash get_token.sh"
  }
}

provider "vsphere" {
  user           = "ansible@vsphere.local"
  password       = "Password@123"
  vsphere_server = "10.77.248.50"
  allow_unverified_ssl = true
}

# Datacenter data source
data "vsphere_datacenter" "dc" {
  name = var.datacenter
}

# vSphere network data source to get the network ID
data "vsphere_network" "network" {
  name          = var.network
  datacenter_id = data.vsphere_datacenter.dc.id
}

# Datastore data source
data "vsphere_datastore" "ds" {
  name          = var.datastore
  datacenter_id = data.vsphere_datacenter.dc.id
}

# Reference the template VM using a data source
data "vsphere_virtual_machine" "template" {
  name          = var.vm_template
  datacenter_id = data.vsphere_datacenter.dc.id
}

# Compute Cluster data source
data "vsphere_compute_cluster" "cluster" {
  name          = var.resource_pool
  datacenter_id = data.vsphere_datacenter.dc.id
}


resource "vsphere_virtual_machine" "k3s_master" {
  count             = length(var.k3s_master_vm_names)
  name              = var.k3s_master_vm_names[count.index]
  datastore_id      = data.vsphere_datastore.ds.id
  resource_pool_id = data.vsphere_compute_cluster.cluster.resource_pool_id
  num_cpus          = 2
  memory            = 4096
  guest_id          = "ubuntu64Guest"

  network_interface {
    network_id   = data.vsphere_network.network.id
    adapter_type = "vmxnet3"
    mac_address  = "00:50:56:a9:${count.index}:00:00"  # Unique MAC address for worker
  }

  disk {
    label           = "disk0"
    size            = 64
    thin_provisioned = true
  }

  clone {
    template_uuid = data.vsphere_virtual_machine.template.id

    customize {
      linux_options {
        host_name = "k3s-master-${count.index}"
        domain    = "lvic-techlab.com"
      }

      network_interface {
        ipv4_address = "10.77.250.21${count.index + 1}"  # Static IPs 10.77.250.211-10.77.250.213
        ipv4_netmask = 24
      }

      ipv4_gateway = "10.77.250.1"
    }
  }

  extra_config = {
    "guestinfo.userdata" = base64encode(<<-EOT
      #cloud-config
      users:
        - name: serveradmin
          sudo: ALL=(ALL) NOPASSWD:ALL
          shell: /bin/bash
          ssh_authorized_keys:
            - ${file("/home/ansible/.ssh/id_rsa.pub")}
    EOT
    )
    "guestinfo.userdata.encoding" = "base64"
    "guestinfo.metadata" = base64encode(<<-EOT
      network:
        version: 2
        ethernets:
          ens192:
            dhcp4: false
    EOT
    )
    "guestinfo.metadata.encoding" = "base64"
  }
}


# Define K3s Worker VM using the customization
resource "vsphere_virtual_machine" "k3s_worker" {
  count             = length(var.k3s_worker_vm_names)
  name              = var.k3s_worker_vm_names[count.index]
  datastore_id      = data.vsphere_datastore.ds.id
  resource_pool_id = data.vsphere_compute_cluster.cluster.resource_pool_id
  num_cpus          = 2
  memory            = 4096
  guest_id          = "ubuntu64Guest"

  network_interface {
    network_id   = data.vsphere_network.network.id
    adapter_type = "vmxnet3"
    mac_address  = "00:50:56:a9:${count.index + 3}:00:00"  # Unique MAC address for worker
  }

  disk {
    label           = "disk0"
    size            = 64
    thin_provisioned = true
  }

  clone {
    template_uuid = data.vsphere_virtual_machine.template.id
    
    customize {
      linux_options {
        host_name = "k3s-worker-${count.index}"
        domain     = "lvic-techlab.com"
      }

      network_interface {
        ipv4_address = "10.77.250.21${count.index + 4}"  # Static IPs 10.77.250.214-10.77.250.215
        ipv4_netmask = 24
      }

      ipv4_gateway = "10.77.250.1"
    }
  }

  extra_config = {
    "guestinfo.userdata" = base64encode(<<-EOT
      #cloud-config
      users:
        - name: serveradmin
          sudo: ALL=(ALL) NOPASSWD:ALL
          shell: /bin/bash
          ssh_authorized_keys:
            - ${file("/home/ansible/.ssh/id_rsa.pub")}
    EOT
    )
    "guestinfo.userdata.encoding" = "base64"
    "guestinfo.metadata" = base64encode(<<-EOT
      network:
        version: 2
        ethernets:
          ens192:
            dhcp4: false
    EOT
    )
    "guestinfo.metadata.encoding" = "base64"
  }
}


# Define PostgreSQL DB VM using the customization
resource "vsphere_virtual_machine" "postgresql_db" {
  name              = var.postgresql_vm_name
  datastore_id      = data.vsphere_datastore.ds.id
  resource_pool_id = data.vsphere_compute_cluster.cluster.resource_pool_id
  num_cpus          = 2
  memory            = 4096
  guest_id          = "ubuntu64Guest"

  network_interface {
    network_id   = data.vsphere_network.network.id
    adapter_type = "vmxnet3"
    mac_address  = "00:50:56:a9:a6:00:00"
  }

  disk {
    label           = "disk0"
    size            = 64
    thin_provisioned = true
  }

  clone {
    template_uuid = data.vsphere_virtual_machine.template.id

    customize {
      linux_options {
        host_name = "postgresql-db"
        domain    = "lvic-techlab.com"
      }

      network_interface {
        ipv4_address = "10.77.250.216"  # Static IP for PostgreSQL DB
        ipv4_netmask = 24
      }

      ipv4_gateway = "10.77.250.1"
    }
  }

  extra_config = {
    "guestinfo.userdata" = base64encode(<<-EOT
      #cloud-config
      users:
        - name: serveradmin
          sudo: ALL=(ALL) NOPASSWD:ALL
          shell: /bin/bash
          ssh_authorized_keys:
            - ${file("/home/ansible/.ssh/id_rsa.pub")}
    EOT
    )
    "guestinfo.userdata.encoding" = "base64"
    "guestinfo.metadata" = base64encode(<<-EOT
      network:
        version: 2
        ethernets:
          ens192:
            dhcp4: false
    EOT
    )
    "guestinfo.metadata.encoding" = "base64"
  }
}


# Add a delay to wait for the VMs to be fully provisioned and their IPs to be assigned
resource "time_sleep" "wait_for_ips" {
  depends_on = [
    vsphere_virtual_machine.k3s_master,
    vsphere_virtual_machine.k3s_worker,
    vsphere_virtual_machine.postgresql_db,
  ]
  create_duration = "1m"  # Adjust as necessary for your environment
}
