'use client';

import { useEffect, useRef, memo } from 'react';
import Image from 'next/image';

interface TimelineYear {
  year: string;
  title: string;
  gtaContent: string;
  egyptContent: string;
  image: string;
  isActive?: boolean;
}

function ImpactSection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const timeline: TimelineYear[] = [
    {
      year: "2025",
      title: "Record-Breaking Year",
      gtaContent: "1,965 lunch bags, 530 winter kits, 460 food packages, 430+ hot meals, 150+ toy bags. Camp day for 111 children. $108K raised for Gaza relief.",
      egyptContent: "370 food packs, 330 meat packs. Camp day for 63 children including Gazan evacuees.",
      image: "/assets/years/2025.jpg",
      isActive: true
    },
    {
      year: "2024",
      title: "Gaza Relief & Growth",
      gtaContent: "720 lunch bags, 150 hygiene kits, 170 hot meals. Camp day for 80 children. $197K+ raised at Gala for Gaza relief.",
      egyptContent: "660 food packs distributed. Camp day for 43 orphans with meals and toys.",
      image: "/assets/years/2024.jpg"
    },
    {
      year: "2023",
      title: "Expanding Programs",
      gtaContent: "559 lunch bags, 130 food packages, 100 toy bags, 25 hot meals to unhoused communities.",
      egyptContent: "400 non-perishable food packages distributed to vulnerable families.",
      image: "/assets/years/2023.jpg"
    },
    {
      year: "2022",
      title: "Growing the Movement",
      gtaContent: "670 lunch bags for unhoused, 135 food packages, 50 toy bags distributed to families.",
      egyptContent: "255 non-perishable food packages to vulnerable communities.",
      image: "/assets/years/2022.jpg"
    },
    {
      year: "2021",
      title: "The Beginning",
      gtaContent: "130 hot meals to unhoused, 104 food packages to families and shelters. Weekly virtual halaqas.",
      egyptContent: "450 non-perishable food packages to vulnerable families during the pandemic.",
      image: "/assets/years/2021.jpg"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const rows = timelineRef.current?.querySelectorAll('.timeline-row');
    rows?.forEach((row) => observer.observe(row));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="impact" className="section impact-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Journey</span>
          <h2 className="section-title">Our Impact</h2>
          <div className="section-line"></div>
          <p className="section-description">From humble beginnings to a year-round movement.</p>
        </div>

        <div className="timeline-v2" ref={timelineRef}>
          <div className="timeline-center-line"></div>
          
          {timeline.map((item, index) => (
            <div key={item.year} className={`timeline-row ${index % 2 === 0 ? 'left' : 'right'}`}>
              {index % 2 === 0 ? (
                <>
                  <div className="timeline-card glass-card">
                    <h3>{item.title}</h3>
                    <p><strong>GTA:</strong> {item.gtaContent}</p>
                    <p><strong>Egypt:</strong> {item.egyptContent}</p>
                  </div>
                  <div className={`timeline-dot ${item.isActive ? 'active' : ''}`}>
                    <span>{item.year}</span>
                  </div>
                  <div className="timeline-image">
                    <Image 
                      src={item.image} 
                      alt={`Ramadan Giving ${item.year}`}
                      width={320}
                      height={240}
                      loading="lazy"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="timeline-image">
                    <Image 
                      src={item.image} 
                      alt={`Ramadan Giving ${item.year}`}
                      width={320}
                      height={240}
                      loading="lazy"
                    />
                  </div>
                  <div className={`timeline-dot ${item.isActive ? 'active' : ''}`}>
                    <span>{item.year}</span>
                  </div>
                  <div className="timeline-card glass-card">
                    <h3>{item.title}</h3>
                    <p><strong>GTA:</strong> {item.gtaContent}</p>
                    <p><strong>Egypt:</strong> {item.egyptContent}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(ImpactSection);

