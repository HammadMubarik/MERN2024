import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

{/* Nav bar  */ }
const NavLinks = props => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <Link to="/">
          ALL USERS
        </Link>
      </li>
      {auth.isLoggedIn && (
        <li>
          <Link to={`/${auth.userId}/places`}>MY PLACES</Link>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Link to="/new">ADD PLACE</Link>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <Link to="/auth">AUTHENTICATE</Link>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
