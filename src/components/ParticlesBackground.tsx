'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    particlesJS: (id: string, config: object) => void;
  }
}

/**
 * Optimized Particles Background
 * - Lazy loads the particles.js library
 * - Reduces particle count on mobile for better performance
 * - Only initializes when visible (intersection observer)
 */
export default function ParticlesBackground() {
  const initialized = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Skip particles if user prefers reduced motion
    if (prefersReducedMotion) return;

    // Use Intersection Observer to lazy load
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isVisible || initialized.current || prefersReducedMotion) return;
    
    // Detect mobile for reduced particles
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 50;

    // Load particles.js script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.particlesJS !== 'undefined') {
        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: particleCount,
              density: {
                enable: true,
                value_area: 1000
              }
            },
            color: {
              value: ['#2D6E7A', '#D4AF37', '#3D8A99']
            },
            shape: {
              type: ['circle', 'triangle'],
              stroke: {
                width: 0,
                color: '#000000'
              }
            },
            opacity: {
              value: 0.4,
              random: true,
              anim: {
                enable: !isMobile, // Disable animations on mobile
                speed: 0.5,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 4,
              random: true,
              anim: {
                enable: !isMobile, // Disable animations on mobile
                speed: 2,
                size_min: 0.5,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: isMobile ? 100 : 150,
              color: '#2D6E7A',
              opacity: 0.15,
              width: 1
            },
            move: {
              enable: true,
              speed: isMobile ? 0.8 : 1.5,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: !isMobile, // Disable on mobile
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: !isMobile, // Disable hover on mobile
                mode: 'grab'
              },
              onclick: {
                enable: !isMobile, // Disable click on mobile
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 0.4
                }
              },
              push: {
                particles_nb: 3
              }
            }
          },
          retina_detect: true
        });
        initialized.current = true;
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup not needed as particles container stays
    };
  }, [isVisible, prefersReducedMotion]);

  // Don't render anything if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return <div ref={containerRef} id="particles-js" aria-hidden="true" />;
}
