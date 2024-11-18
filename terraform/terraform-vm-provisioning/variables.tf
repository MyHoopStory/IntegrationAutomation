variable "vcenter_username" {}
variable "vcenter_password" {}
variable "vcenter_server" {}
variable "vm_template" {}
variable "datacenter" {}
variable "datastore" {}
variable "network" {}
variable "resource_pool" {}
variable "k3s_master_vm_names" {}
variable "k3s_worker_vm_names" {}
variable "postgresql_vm_name" {}
variable "ssh_public_key" {
  description = "SSH public key for VM access"
  type        = string
  default     = "/home/ansible/.ssh/id_rsa.pub"
}

data "local_file" "ssh_public_key" {
  filename = var.ssh_public_key
}
