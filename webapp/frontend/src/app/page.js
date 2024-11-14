// pages/index.js
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles/shared.module.css';
import ParticlesBackground from './components/ParticlesBackground';

const Home = () => {
  return (
    <div className={styles.wrapper}>
      <nav className={`nav nav-pills flex-column flex-sm-row p-2 mb-5 ${styles.nav}`}>
        <Link href="/" className="flex-sm-fill text-sm-center nav-link active">Home</Link>
        <Link href="/create-project" className="flex-sm-fill text-sm-center nav-link">Create Project</Link>
        <Link href="/projects" className="flex-sm-fill text-sm-center nav-link">Projects</Link>
        <Link 
          href="#" 
          className="flex-sm-fill text-sm-center nav-link disabled"
          data-bs-toggle="tooltip" 
          data-bs-placement="bottom" 
          data-bs-title="Coming Soon!"
        >
          Warehouse Tracking
        </Link>
        <Link 
          href="#" 
          className="flex-sm-fill text-sm-center nav-link disabled"
          data-bs-toggle="tooltip" 
          data-bs-placement="bottom" 
          data-bs-title="Coming Soon!"
        >
          Automation Hub
        </Link>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col d-flex justify-content-center mb-4">
            <Image 
              src="/images/Technologent_Logo_2C.webp"
              alt="Technologent Logo"
              width={400}
              height={100}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            <h2 className={styles.tagLine}>Where technology and people intersect</h2>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col">
            <div className={`card d-flex align-items-center justify-content-center mx-auto w-75 ${styles.card} ${styles.mainCard}`}>
              <div className={styles.particleContainer}>
                <ParticlesBackground />
              </div>
              <Image 
                src="/images/TCGTSplash.png"
                alt="One Technologent"
                width={800}
                height={400}
                className="card-img-top"
                style={{ position: 'relative', zIndex: 1 }}
              />
              <div className={`card-body ${styles.cardBody}`} style={{ position: 'relative', zIndex: 1 }}>
                <h5 className={styles.cardTitle}>The Las Vegas Innovation Center</h5>
                <p className="card-text">
                  A single-story building that is located in a business district south of the Las
                  Vegas Strip in Nevada. Located near Harry Reid International Airport, this facility encompasses the
                  Integration Center and customer accommodations in an easily accessible and comfortable office
                  environment. Lodging and amenities are plentiful in the surrounding area.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col text-center">
            <h3 className={styles.sectionTitle}>The Innovation Center provides both....</h3>
          </div>
        </div>

        <div className={styles.cardContainer}>
          <div className="row g-4">
            <div className="col-md-6">
              <div className={`card ${styles.card}`}>
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src="/images/empower.png"
                    alt="Empowering Your Possibilities"
                    width={400}
                    height={300}
                    className={styles.cardImage}
                  />
                </div>
                <div className={`card-body ${styles.cardBody}`}>
                  <h5 className={styles.cardTitle}>Office and Collaboration Space</h5>
                  <p className="card-text">Office accommodations are provided for staff and customers, allowing normal workday activities while visiting the Integration Center.</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className={`list-group-item ${styles.listItem}`}>Office space and conference room</li>
                  <li className={`list-group-item ${styles.listItem}`}>Kitchen and lounge</li>
                  <li className={`list-group-item ${styles.listItem}`}>WebEx Boards and other amenities</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`card ${styles.card}`}>
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src="/images/Let-s-Move-Forward.png"
                    alt="Let's Move Forward"
                    width={400}
                    height={300}
                    className={styles.cardImage}
                  />
                </div>
                <div className={`card-body ${styles.cardBody}`}>
                  <h5 className={styles.cardTitle}>Integration Lab and Warehouse</h5>
                  <p className="card-text">The Integration Center (IC) is a dedicated facility designed for systems integration, storage, assembly, configuration, and testing.</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className={`list-group-item ${styles.listItem}`}>Receive and store customer equipment</li>
                  <li className={`list-group-item ${styles.listItem}`}>Server Rack installations / builds</li>
                  <li className={`list-group-item ${styles.listItem}`}>Network Staging and Configuration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
