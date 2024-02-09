import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { FaHandsHelping } from 'react-icons/fa';
import { RiLoginBoxFill } from "react-icons/ri";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopNavbar = () => {
  const { token, clearAuthData } = useAuth();
  const navigate = useNavigate(); 
  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  return (
    <div className="top-navbar">
      <h3>
        <strong>सAMVAAD</strong>
      </h3>
      <div>
            <NavLink to="/help" activeclasscame="active">
              <FaHandsHelping className="icons" />
            </NavLink>
        {token ? (
          <>
            <NavLink to="/profile" activeclasscame="active" style={{ marginLeft: '20px' }}>
              <MdAccountCircle className="icons" />
            </NavLink>
            <RiLogoutBoxRLine className="icons" onClick={handleLogout} style={{ marginLeft: '20px' }} />
          </>
        ) : (
          <>
            <NavLink to="/loginorregister" activeclasscame="active" style={{ marginLeft: '20px' }}>
            <RiLoginBoxFill className="icons" />
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;


