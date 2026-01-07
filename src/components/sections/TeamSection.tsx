'use client';

import Image from 'next/image';

export default function TeamSection() {
  const team = [
    {
      title: "Community Leaders",
      description: "Our dedicated organizers who make everything possible.",
      image: "/assets/images/team1.jpg"
    },
    {
      title: "Volunteers",
      description: "The heart and soul of our distribution efforts.",
      image: "/assets/images/team2.jpg"
    },
    {
      title: "Youth Ambassadors",
      description: "Inspiring the next generation of changemakers.",
      image: "/assets/images/team3.jpg"
    }
  ];

  return (
    <section id="team" className="section team-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our People</span>
          <h2 className="section-title">Our Team</h2>
          <div className="section-line"></div>
          <p className="section-description">Powered by hundreds of volunteers, united by compassion.</p>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-avatar">
                <Image 
                  src={member.image} 
                  alt={member.title}
                  width={140}
                  height={140}
                />
                <div className="avatar-ring"></div>
              </div>
              <h3>{member.title}</h3>
              <p>{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

