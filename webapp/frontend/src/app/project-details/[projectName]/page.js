'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/shared.module.css';
import Navigation from '../../components/Navigation';


const ProjectDetails = () => {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectName = params?.projectName;
        if (!projectName) return;

        const decodedName = decodeURIComponent(projectName);
        
        const response = await fetch(`http://localhost:5001/projects/${encodeURIComponent(decodedName)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Error fetching project: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params?.projectName]);

  if (loading) return <div>Loading project details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <>
      <Navigation />

      <div className="container">
        <div className={`card ${styles.card} mb-4`}>
          <div className="card-body">
            <h2 className="card-title mb-4">{project.name}</h2>
            
            <div className="row">
              <div className="col-md-6">
                <h4>General Information</h4>
                <ul className="list-group mb-4">
                  <li className="list-group-item"><strong>Backup Schedule:</strong> {project.backup_schedule}</li>
                  <li className="list-group-item"><strong>Maintenance Windows:</strong> {project.maintenance_windows}</li>
                  <li className="list-group-item"><strong>WSUS Update Strategy:</strong> {project.wsus_update_strategy}</li>
                </ul>

                <h4>Network Configuration</h4>
                <ul className="list-group mb-4">
                  <li className="list-group-item"><strong>NTP Server IP:</strong> {project.property_ntp_server_ip}</li>
                  <li className="list-group-item"><strong>Domain Controller IP:</strong> {project.domain_controller_ip}</li>
                  <li className="list-group-item"><strong>Primary DNS IP:</strong> {project.primary_dns_ip}</li>
                  <li className="list-group-item"><strong>Secondary DNS IP:</strong> {project.secondary_dns_ip}</li>
                </ul>
              </div>

              <div className="col-md-6">
                <h4>Shipping Information</h4>
                {project.shipping_address?.map((address, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <p>{address.address_line1}<br />
                         {address.address_line2 && <>{address.address_line2}<br /></>}
                         {address.city}, {address.state} {address.postal_code}<br />
                         {address.country}
                      </p>
                    </div>
                  </div>
                ))}

                <h4>Contact Information</h4>
                {project.shipping_contact?.map((contact, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <p><strong>Name:</strong> {contact.first_name} {contact.last_name}<br />
                         <strong>Phone:</strong> {contact.phone1}<br />
                         {contact.phone2 && <><strong>Alternative Phone:</strong> {contact.phone2}<br /></>}
                         <strong>Email:</strong> {contact.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Link href="/projects" className="btn btn-secondary">
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;