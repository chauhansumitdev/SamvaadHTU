import { Route, Routes } from 'react-router-dom';
import SocialMedia from '../components/SocialMedia';
import Post from '../components/Post';
import Report from '../components/Report';
import Camera from '../components/Camera';
import Notifications from '../components/Notifications';
import Chat from '../components/Chat';
import EmergencyInApp from '../components/EmergencyInApp';
import Profile from '../components/Profile';
import LoginForm from '../components/LoginForm';
import FormList from '../components/FormList';
import FormRenderer from '../components/FormRenderer';

const AppRouter = () => {
  return (
    <>
      <Routes>
          <Route path="/" element={<SocialMedia />} />
          <Route path="/help" element={<EmergencyInApp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post" element={<Post />} />
          <Route path="/report" element={<Report />} />
          <Route path="/camera" element={<Camera  />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/loginorregister" element={<LoginForm />} />
          <Route path="/forms" element={<FormList />} />
          <Route path="/form/:formId" element={<FormRenderer />} />
        </Routes>
    </>
  );
};

export default AppRouter;
