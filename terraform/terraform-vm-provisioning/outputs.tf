# Output the name of the main K3s Master VM
output "k3s_master_name" {
  value = vsphere_virtual_machine.k3s_master[0].name
}

# Output the names of K3s Control Nodes
output "k3s_control_names" {
  value = [for i in range(1, length(vsphere_virtual_machine.k3s_master)) : vsphere_virtual_machine.k3s_master[i].name]
}

# Output the names of K3s Worker VMs
output "k3s_worker_names" {
  value = [for worker in vsphere_virtual_machine.k3s_workers : worker.name]
}

# Output the name of the PostgreSQL DB VM
output "postgresql_db_name" {
  value = vsphere_virtual_machine.postgresql_db.name
}


# Output the IP address of the main K3s Master VM
output "k3s_master_ip" {
  value = vsphere_virtual_machine.k3s_master[0].default_ip_address
}

# Output the IP addresses of K3s Control Nodes
output "k3s_control_ips" {
  value = [for i in range(1, length(vsphere_virtual_machine.k3s_master)) : vsphere_virtual_machine.k3s_master[i].default_ip_address]
}

# Output the IP addresses of K3s Worker VMs
output "k3s_worker_ips" {
  value = [for worker in vsphere_virtual_machine.k3s_workers : worker.default_ip_address]
}

# Output the IP address of the PostgreSQL DB VM
output "postgresql_db_ip" {
  value = vsphere_virtual_machine.postgresql_db.default_ip_address
}

output "k3s_master_vm_names" {
  value = vsphere_virtual_machine.k3s_master[*].name
}

output "k3s_master_vm_ips" {
  value = vsphere_virtual_machine.k3s_master[*].default_ip_address
}

output "k3s_worker_vm_names" {
  value = vsphere_virtual_machine.k3s_workers[*].name
}

output "k3s_worker_vm_ips" {
  value = vsphere_virtual_machine.k3s_workers[*].default_ip_address
}

output "postgresql_vm_name" {
  value = vsphere_virtual_machine.postgresql_db.name
}

output "postgresql_vm_ip" {
  value = vsphere_virtual_machine.postgresql_db.default_ip_address
}

output "ansible_inventory" {
  value = templatefile("${path.module}/templates/ansible_inventory.tpl", {
    k3s_master_vm_names = vsphere_virtual_machine.k3s_master[*].name
    k3s_master_vm_ips = vsphere_virtual_machine.k3s_master[*].default_ip_address
    k3s_worker_vm_names = vsphere_virtual_machine.k3s_workers[*].name
    k3s_worker_vm_ips = vsphere_virtual_machine.k3s_workers[*].default_ip_address
    postgresql_vm_name = vsphere_virtual_machine.postgresql_db.name
    postgresql_vm_ip = vsphere_virtual_machine.postgresql_db.default_ip_address
    ansible_user = "serveradmin"
    ansible_ssh_key = "/home/ansible/.ssh/id_rsa"
  })
}
