// pages/create-project.js

'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../styles/shared.module.css';
import Navigation from '../components/Navigation';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    shipping_address: { address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '' },
    shipping_contact: { first_name: '', last_name: '', phone1: '', phone2: '', email: '' },
    
    // Server Info
    backup_schedule: '',
    maintenance_windows: '',
    windows_2003_sql_2005_vm_needed: false,
    wsus_update_strategy: '',
    
    // Network Info
    gateway_top_of_rack_switch: '',
    top_of_rack_connectivity: '',
    property_ntp_server_ip: '',
    domain_controller_ip: '',
    primary_dns_ip: '',
    secondary_dns_ip: '',
    vlan_to_network_mapping: '',
    smtp_address: '',
    smtp_from_address: '',
    smtp_alert_address: '',
    
    // DC-DNS-AD Information
    igt_building_domain_advantage: false,
    igt_building_domain_sbx: false,

    // VLANs
    vlans: [],

    // VSANs
    vsans: [],

    // VMs
    vms: [],
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData((prevData) => {
      if (name.includes('shipping_address')) {
        const key = name.split('.')[1];
        return { ...prevData, shipping_address: { ...prevData.shipping_address, [key]: value } };
      }
      if (name.includes('shipping_contact')) {
        const key = name.split('.')[1];
        return { ...prevData, shipping_contact: { ...prevData.shipping_contact, [key]: value } };
      }
      if (name.includes('vlans')) {
        const index = parseInt(name.split('[')[1].split(']')[0]);
        const key = name.split('.')[1];
        const updatedVlans = [...prevData.vlans];
        updatedVlans[index] = { ...updatedVlans[index], [key]: isCheckbox ? checked : value };
        return { ...prevData, vlans: updatedVlans };
      }
      if (name.includes('vsans')) {
        const index = parseInt(name.split('[')[1].split(']')[0]);
        const key = name.split('.')[1];
        const updatedVsans = [...prevData.vsans];
        updatedVsans[index] = { ...updatedVsans[index], [key]: value };
        return { ...prevData, vsans: updatedVsans };
      }
      if (name.includes('vms')) {
        const index = parseInt(name.split('[')[1].split(']')[0]);
        const key = name.split('.')[1];
        const updatedVms = [...prevData.vms];
        updatedVms[index] = { ...updatedVms[index], [key]: value };
        return { ...prevData, vms: updatedVms };
      }
      return isCheckbox ? { ...prevData, [name]: checked } : { ...prevData, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/project', formData);
      if (response.status === 200) {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  // Add new states for temporary values
  const [currentVlan, setCurrentVlan] = useState({ 
    name: '', 
    vlan_id: '', 
    network: '', 
    gateway_ip: '', 
    is_igt_switch_gateway: false, 
    dhcp_scopes: '', 
    dhcp_ip_helper_ip: '' 
  });
  const [currentVsan, setCurrentVsan] = useState({ name: '', vlan: '' });
  const [currentVm, setCurrentVm] = useState({ 
    name: '', 
    vlan_id: '', 
    network: '', 
    default_gateway: '', 
    gateway_location: '' 
  });

  const addVlan = () => {
    if (currentVlan.name && currentVlan.vlan_id) {
      setFormData(prev => ({
        ...prev,
        vlans: [...prev.vlans, currentVlan]
      }));
      // Clear all VLAN fields
      setCurrentVlan({ 
        name: '', 
        vlan_id: '', 
        network: '', 
        gateway_ip: '', 
        is_igt_switch_gateway: false, 
        dhcp_scopes: '', 
        dhcp_ip_helper_ip: '' 
      });
    }
  };

  const addVsan = () => {
    if (currentVsan.name && currentVsan.vlan) {
      setFormData(prev => ({
        ...prev,
        vsans: [...prev.vsans, currentVsan]
      }));
      // Clear the current VSAN fields
      setCurrentVsan({ name: '', vlan: '' });
    }
  };

  const addVm = () => {
    if (currentVm.name && currentVm.vlan_id) {
      setFormData(prev => ({
        ...prev,
        vms: [...prev.vms, currentVm]
      }));
      // Clear the current VM fields
      setCurrentVm({ 
        name: '', 
        vlan_id: '', 
        network: '', 
        default_gateway: '', 
        gateway_location: '' 
      });
    }
  };

  const removeVlan = (index) => {
    setFormData(prev => ({
      ...prev,
      vlans: prev.vlans.filter((_, i) => i !== index)
    }));
  };

  const removeVsan = (index) => {
    setFormData(prev => ({
      ...prev,
      vsans: prev.vsans.filter((_, i) => i !== index)
    }));
  };

  const removeVm = (index) => {
    setFormData(prev => ({
      ...prev,
      vms: prev.vms.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <h1 className={styles.title}>Create New Project</h1>
        <form onSubmit={handleSubmit} className={styles.card}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Project Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className={styles.input}
            />
          </div>

          <h2 className={styles.subtitle}>Shipping Address</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Address Line 1:</label>
            <input 
              type="text" 
              name="shipping_address.address_line1" 
              value={formData.shipping_address.address_line1} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>Address Line 2:</label>
            <input 
              type="text" 
              name="shipping_address.address_line2" 
              value={formData.shipping_address.address_line2} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>City:</label>
            <input 
              type="text" 
              name="shipping_address.city" 
              value={formData.shipping_address.city} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>State:</label>
            <input 
              type="text" 
              name="shipping_address.state" 
              value={formData.shipping_address.state} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>Postal Code:</label>
            <input 
              type="text" 
              name="shipping_address.postal_code" 
              value={formData.shipping_address.postal_code} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>Country:</label>
            <input 
              type="text" 
              name="shipping_address.country" 
              value={formData.shipping_address.country} 
              onChange={handleChange}
              className={styles.input} 
            />
          </div>

          <h2 className={styles.subtitle}>Shipping Contact</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>First Name:</label>
            <input 
              type="text" 
              name="shipping_contact.first_name" 
              value={formData.shipping_contact.first_name} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>Last Name:</label>
            <input 
              type="text" 
              name="shipping_contact.last_name" 
              value={formData.shipping_contact.last_name} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>Phone 1:</label>
            <input 
              type="text" 
              name="shipping_contact.phone1" 
              value={formData.shipping_contact.phone1} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>Phone 2:</label>
            <input 
              type="text" 
              name="shipping_contact.phone2" 
              value={formData.shipping_contact.phone2} 
              onChange={handleChange}
              className={styles.input} 
            />
            <label className={styles.label}>Email:</label>
            <input 
              type="email" 
              name="shipping_contact.email" 
              value={formData.shipping_contact.email} 
              onChange={handleChange}
              className={styles.input} 
            />
          </div>

          <h2 className={styles.subtitle}>Server Info</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Backup Schedule:</label>
            <input 
              type="text" 
              name="backup_schedule" 
              value={formData.backup_schedule} 
              onChange={handleChange}
              className={styles.input} 
            />
            
            <label className={styles.label}>Maintenance Windows:</label>
            <input 
              type="text" 
              name="maintenance_windows" 
              value={formData.maintenance_windows} 
              onChange={handleChange}
              className={styles.input} 
            />
            
            <label className={styles.label}>Windows 2003 SQL 2005 VM Needed:</label>
            <input 
              type="checkbox" 
              name="windows_2003_sql_2005_vm_needed" 
              checked={formData.windows_2003_sql_2005_vm_needed} 
              onChange={handleChange}
              className={styles.input} 
            />
            
            <label className={styles.label}>WSUS Update Strategy:</label>
            <input 
              type="text" 
              name="wsus_update_strategy" 
              value={formData.wsus_update_strategy} 
              onChange={handleChange}
              className={styles.input} 
            />
          </div>

          <h2 className={styles.subtitle}>Network Info</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Gateway for Top of Rack Switch:</label>
            <input
              type="text"
              name="gateway_top_of_rack_switch"
              value={formData.gateway_top_of_rack_switch}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Top of Rack Connectivity:</label>
            <input
              type="text"
              name="top_of_rack_connectivity"
              value={formData.top_of_rack_connectivity}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Property NTP Server IP:</label>
            <input
              type="text"
              name="property_ntp_server_ip"
              value={formData.property_ntp_server_ip}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>IP Address and Subnet Mask of Domain Controller:</label>
            <input
              type="text"
              name="domain_controller_ip"
              value={formData.domain_controller_ip}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>IP Address of Primary DNS:</label>
            <input
              type="text"
              name="primary_dns_ip"
              value={formData.primary_dns_ip}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>IP Address of Secondary DNS:</label>
            <input
              type="text"
              name="secondary_dns_ip"
              value={formData.secondary_dns_ip}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>VLAN IDs to Network Mapping:</label>
            <input
              type="text"
              name="vlan_to_network_mapping"
              value={formData.vlan_to_network_mapping}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>SMTP Address (IP and Hostname):</label>
            <input
              type="text"
              name="smtp_address"
              value={formData.smtp_address}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>SMTP From Address:</label>
            <input
              type="text"
              name="smtp_from_address"
              value={formData.smtp_from_address}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>SMTP Alert Address:</label>
            <input
              type="text"
              name="smtp_alert_address"
              value={formData.smtp_alert_address}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <h2 className={styles.subtitle}>DC-DNS-AD Information</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>IGT Building Domain for Advantage:</label>
            <input 
              type="checkbox" 
              name="igt_building_domain_advantage" 
              checked={formData.igt_building_domain_advantage} 
              onChange={handleChange}
              className={styles.input} 
            />
            
            <label className={styles.label}>IGT Building Domain for SBX:</label>
            <input 
              type="checkbox" 
              name="igt_building_domain_sbx" 
              checked={formData.igt_building_domain_sbx} 
              onChange={handleChange}
              className={styles.input} 
            />
          </div>

          <h2 className={styles.subtitle}>VLANs</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name:</label>
            <input
              type="text"
              value={currentVlan.name}
              onChange={(e) => setCurrentVlan({...currentVlan, name: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>VLAN ID:</label>
            <input
              type="text"
              value={currentVlan.vlan_id}
              onChange={(e) => setCurrentVlan({...currentVlan, vlan_id: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>Network:</label>
            <input
              type="text"
              value={currentVlan.network}
              onChange={(e) => setCurrentVlan({...currentVlan, network: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>Gateway IP:</label>
            <input
              type="text"
              value={currentVlan.gateway_ip}
              onChange={(e) => setCurrentVlan({...currentVlan, gateway_ip: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={currentVlan.is_igt_switch_gateway}
                onChange={(e) => setCurrentVlan({...currentVlan, is_igt_switch_gateway: e.target.checked})}
                className={styles.checkbox}
              />
              Is IGT Switch Gateway
            </label>
            <label className={styles.label}>DHCP Scopes:</label>
            <input
              type="text"
              value={currentVlan.dhcp_scopes}
              onChange={(e) => setCurrentVlan({...currentVlan, dhcp_scopes: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>DHCP IP Helper IP:</label>
            <input
              type="text"
              value={currentVlan.dhcp_ip_helper_ip}
              onChange={(e) => setCurrentVlan({...currentVlan, dhcp_ip_helper_ip: e.target.value})}
              className={styles.input}
            />
            <button type="button" onClick={addVlan} className={styles.button}>Add VLAN</button>
          </div>

          {/* Display added VLANs */}
          {formData.vlans.length > 0 && (
            <div className={styles.tableContainer}>
              <h3>Added VLANs:</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>VLAN ID</th>
                    <th>Network</th>
                    <th>Gateway IP</th>
                    <th>IGT Switch Gateway</th>
                    <th>DHCP Scopes</th>
                    <th>DHCP IP Helper</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.vlans.map((vlan, index) => (
                    <tr key={index}>
                      <td>{vlan.name}</td>
                      <td>{vlan.vlan_id}</td>
                      <td>{vlan.network}</td>
                      <td>{vlan.gateway_ip}</td>
                      <td>{vlan.is_igt_switch_gateway ? 'Yes' : 'No'}</td>
                      <td>{vlan.dhcp_scopes}</td>
                      <td>{vlan.dhcp_ip_helper_ip}</td>
                      <td>
                        <button 
                          onClick={() => removeVlan(index)}
                          className={`${styles.button} ${styles.buttonDanger}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className={styles.subtitle}>VSANs</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name:</label>
            <input
              type="text"
              value={currentVsan.name}
              onChange={(e) => setCurrentVsan({...currentVsan, name: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>VLAN:</label>
            <input
              type="text"
              value={currentVsan.vlan}
              onChange={(e) => setCurrentVsan({...currentVsan, vlan: e.target.value})}
              className={styles.input}
            />
            <button type="button" onClick={addVsan} className={styles.button}>Add VSAN</button>
          </div>

          {/* Display added VSANs */}
          {formData.vsans.length > 0 && (
            <div className={styles.tableContainer}>
              <h3>Added VSANs:</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>VLAN</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.vsans.map((vsan, index) => (
                    <tr key={index}>
                      <td>{vsan.name}</td>
                      <td>{vsan.vlan}</td>
                      <td>
                        <button 
                          onClick={() => removeVsan(index)}
                          className={`${styles.button} ${styles.buttonDanger}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className={styles.subtitle}>VMs</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>VM Name:</label>
            <input
              type="text"
              value={currentVm.name}
              onChange={(e) => setCurrentVm({...currentVm, name: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>VLAN ID:</label>
            <input
              type="text"
              value={currentVm.vlan_id}
              onChange={(e) => setCurrentVm({...currentVm, vlan_id: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>Network:</label>
            <input
              type="text"
              value={currentVm.network}
              onChange={(e) => setCurrentVm({...currentVm, network: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>Default Gateway:</label>
            <input
              type="text"
              value={currentVm.default_gateway}
              onChange={(e) => setCurrentVm({...currentVm, default_gateway: e.target.value})}
              className={styles.input}
            />
            <label className={styles.label}>Gateway Location:</label>
            <input
              type="text"
              value={currentVm.gateway_location}
              onChange={(e) => setCurrentVm({...currentVm, gateway_location: e.target.value})}
              className={styles.input}
            />
            <button type="button" onClick={addVm} className={styles.button}>Add VM</button>
          </div>

          {/* Display added VMs */}
          {formData.vms.length > 0 && (
            <div className={styles.tableContainer}>
              <h3>Added VMs:</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>VLAN ID</th>
                    <th>Network</th>
                    <th>Default Gateway</th>
                    <th>Gateway Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.vms.map((vm, index) => (
                    <tr key={index}>
                      <td>{vm.name}</td>
                      <td>{vm.vlan_id}</td>
                      <td>{vm.network}</td>
                      <td>{vm.default_gateway}</td>
                      <td>{vm.gateway_location}</td>
                      <td>
                        <button 
                          onClick={() => removeVm(index)}
                          className={`${styles.button} ${styles.buttonDanger}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button type="submit" className={styles.button}>
            Create Project
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
