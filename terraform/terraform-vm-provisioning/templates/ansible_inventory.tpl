[k3s_master]
10.77.250.211 hostname=k3s-master-0

[k3s_control_nodes]
%{ for i in range(1, length(k3s_master_vm_names)) ~}
10.77.250.21${i + 1} hostname=k3s-master-${i}
%{ endfor ~}

[k3s_workers]
%{ for i, name in k3s_worker_vm_names ~}
10.77.250.21${i + 4} hostname=k3s-worker-${i}
%{ endfor ~}

[postgresql_db]
10.77.250.216 hostname=postgresql-db

[all:vars]
ansible_user=${ansible_user}
ansible_ssh_private_key_file=${ansible_ssh_key}
ansible_ssh_common_args='-o StrictHostKeyChecking=no'