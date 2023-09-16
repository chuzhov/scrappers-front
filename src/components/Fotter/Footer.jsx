import {
  FaGithubSquare,
  FaLinkedin,
  FaTelegram,
  FaSlack,
} from 'react-icons/fa';

import './Footer.css';
import '../../variables.css';

function Footer() {
  return (
    <div className="footer">
      <div className="footer-links">
        <a href="https://github.com/chuzhov">
          <FaGithubSquare size={20} className="footer-social-icon" />
        </a>
        <a href="https://linkedin.com/in/dan-chuzhov">
          <FaLinkedin size={20} className="footer-social-icon" />
        </a>
        <a href="https://t.me/danchuz">
          <FaTelegram size={20} className="footer-social-icon" />
        </a>
        {/* <a href="https://">
          <FaSlack size={20} color="var(--primary-color)" />
        </a> */}
      </div>
      <div className="footer-copyright">
        <p>© 2023 Dan Chuzhov Web Ingineering</p>
      </div>
    </div>
  );
}

export default Footer;
