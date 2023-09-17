import { LuMenu } from 'react-icons/lu';
import { GiOctopus } from 'react-icons/gi';

import './Header.css';
import '../../variables.css';
function Header({ user }) {
  return (
    <>
      <div className="header">
        <div className="user__wrapper">
          <GiOctopus size={26} className="user__icon" />
          <p>{user}</p>
        </div>
        <div className="menu__wrapper">
          <button>
            <LuMenu size={26} className="menu__icon" />
          </button>
        </div>
      </div>
      <h1 className="header__title">Збирач даних із сайтів Постачальників</h1>
    </>
  );
}

export default Header;
