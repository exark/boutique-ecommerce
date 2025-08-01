import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-parallax">
      <video 
        className="hero-video"
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="/images/4782414-uhd_3840_2160_30fps.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
      <div className="hero-slogan">
        <h1>Découvrez la nouvelle collection tendance&nbsp;!</h1>
      </div>
    </section>
  );
} 