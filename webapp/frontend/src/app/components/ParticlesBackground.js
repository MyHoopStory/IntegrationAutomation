'use client';

import { useCallback } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          opacity: 0
        },
        fpsLimit: 60,
        interactivity: {
          detect_on: "window",
          events: {
            onHover: {
              enable: false
            },
            onClick: {
              enable: false
            },
            resize: {
              enable: true,
              delay: 0.5
            }
          }
        },
        particles: {
          color: {
            value: "#004E98"
          },
          links: {
            color: "#FF6700",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1.5
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "out"
            }
          },
          number: {
            value: 80,
            density: {
              enable: true,
              area: 800
            }
          },
          opacity: {
            value: 0.5
          },
          size: {
            value: { min: 1, max: 4 }
          }
        },
        detectRetina: true,
        fullScreen: {
          enable: false
        }
      }}
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: -1,
        top: 0,
        left: 0,
        pointerEvents: "none"
      }}
    />
  );
};

export default ParticlesBackground; 