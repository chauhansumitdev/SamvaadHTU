import { Link } from 'react-router-dom';
import logo from '../assets/home.png'
function Sidebar() {
  return (
    <div className='sidebarfull'>
        <div className="logocontainer">
        <img src={logo} alt="logo" className='logo'/>
        </div>
      <div className="App">
        <div className="sidebar">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/create">Create</Link>
              </li>
              <li>
              </li>
              <li>
                <Link to="/responses">Responses</Link>
              </li>
              <li>
                <Link to="/activity">Activity</Link>
              </li>
            </ul>
          </nav>
        </div>
    </div>
    </div>
  );
}

export default Sidebar;
