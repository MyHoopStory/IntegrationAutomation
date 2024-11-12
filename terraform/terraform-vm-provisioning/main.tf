provider "vsphere" {
  user           = var.vcenter_username
  password       = var.vcenter_password
  vsphere_server = vcenter_server

  # If using self-signed certs
  allow_unverified_ssl = true
}

# Define the data source for the template VM
data "vsphere_virtual_machine" "template" {
  name          = "var.vm_template"
  datacenter_id = "your_datacenter_id"
}

# Define the virtual machine resource
resource "vsphere_virtual_machine" "vm" {
  name             = "test-vm"
  resource_pool_id = "your_resource_pool_id"
  datastore_id     = "your_datastore_id"
  num_cpus         = 2
  memory           = 4096
  guest_id         = "ubuntu64Guest"
  network_interface {
    network_id   = "your_network_id"
    adapter_type = "vmxnet3"
  }

  disk {
    label            = "disk0"
    size             = 20
    eagerly_scrub    = false
    thin_provisioned = true
  }

  clone {
    template_uuid = data.vsphere_virtual_machine.template.id
  }
}
