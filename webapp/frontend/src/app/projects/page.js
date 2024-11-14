'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import styles from '../styles/shared.module.css';
import Link from 'next/link';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5001/projects', {
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
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Error fetching projects: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navigation />
      <div className="container">
        <h2 className="mb-4">Projects</h2>
        <div className="row">
          {projects.map((project, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className={`card ${styles.card}`}>
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text">
                    <strong>Backup Schedule:</strong> {project.backup_schedule}<br />
                    <strong>Maintenance Windows:</strong> {project.maintenance_windows}
                  </p>
                  <Link 
                    href={`/project-details/${project.name}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
