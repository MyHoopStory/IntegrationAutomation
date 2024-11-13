[k3s_master]
${k3s_master_vm_names[0]} ansible_host=${k3s_master_vm_ips[0]}

[k3s_control_nodes]
%{ for i in range(1, length(k3s_master_vm_names)) ~}
${k3s_master_vm_names[i]} ansible_host=${k3s_master_vm_ips[i]}
%{ endfor ~}

[k3s_workers]
%{ for i, name in k3s_worker_vm_names ~}
${name} ansible_host=${k3s_worker_vm_ips[i]}
%{ endfor ~}

[postgresql_db]
${postgresql_vm_name} ansible_host=${postgresql_vm_ip}

[all:vars]
ansible_user=${ansible_user}
ansible_ssh_private_key_file=${ansible_ssh_key}
