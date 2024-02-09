import React from 'react';
import { NavLink } from 'react-router-dom'; 
import {
  FaCamera,
  FaRegPlusSquare,
  FaFileSignature,
  FaHome,
  FaRobot
} from 'react-icons/fa';
import { IoIosNotifications } from 'react-icons/io';

const BottomIcons = () => {
  return (
    <div className="bottom-icons">
      <div className="container-icons">
        <NavLink to="/" activeclassname="active">
          <FaHome className="icons" />
        </NavLink>
        <NavLink to="/post" activeclassname="active">
          <FaRegPlusSquare className="icons" />
        </NavLink>
        <NavLink to="/report" activeclassname="active">
          <FaFileSignature className="icons" />
        </NavLink>
        <NavLink to="/camera" activeclassname="active">
          <FaCamera className="icons" />
        </NavLink>
        <NavLink to="/notifications" activeclassname="active">
          <IoIosNotifications className="icons" />
        </NavLink>
        <NavLink to="/chat" activeclassname="active">
          <FaRobot className="icons" />
        </NavLink>
      </div>
    </div>
  );
};

export default BottomIcons;
