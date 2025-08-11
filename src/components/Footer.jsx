import React from 'react';
import './Footer.css';
import logo from '../assets/logo-solene.webp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Section Logo et Description */}
        <div className="footer__section">
          <div className="footer__logo">
            <img src={logo} alt="Logo Solène" />
          </div>
          <p className="footer__description">
            Découvrez notre collection exclusive de vêtements féminins élégants et tendance. 
            Solène vous accompagne dans votre style avec des pièces uniques et de qualité.
          </p>
          <div className="footer__social">
            <a href="https://www.facebook.com/profile.php?id=61578789780680" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="mailto:solene.handmade.crochet@gmail.com" aria-label="Email">
              <EmailIcon />
            </a>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="footer__section">
          <h3 className="footer__title">Navigation</h3>
          <ul className="footer__links">
            <li><Link to="/home">Notre collection</Link></li>
            <li><Link to="/categories">Catégories</Link></li>
            <li><Link to="/cart">Panier</Link></li>
          </ul>
        </div>

        {/* Section Informations */}
        <div className="footer__section">
          <h3 className="footer__title">Informations</h3>
          <ul className="footer__links">
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/politique-confidentialite">Politique de confidentialité</Link></li>
            <li><Link to="/conditions-vente">Conditions de vente</Link></li>
            {/*  <li><Link to="/retours-echanges">Retours et échanges</Link></li> */}
          </ul>
        </div>

        {/* Section Contact */}
        <div className="footer__section">
          <h3 className="footer__title">Contact</h3>
          <div className="footer__contact">
            <div className="footer__contact-item">
              <LocationOnIcon />
              <span>123 Rue de la Mode<br />75001 Paris, France</span>
            </div>
            <div className="footer__contact-item">
              <PhoneIcon />
              <span>+33 1 23 45 67 89</span>
            </div>
            <div className="footer__contact-item">
              <EmailIcon />
              <span>solene.handmade.crochet@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="footer__bottom">
        <div className="footer__bottom-content">
          <p>&copy; {currentYear} Solène Boutique. Tous droits réservés.</p>
          <p>Créé avec ❤️ pour les femmes élégantes</p>
        </div>
      </div>
    </footer>
  );
} 