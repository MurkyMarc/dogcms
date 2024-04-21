import './App.css'
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from './pages/Home/Home';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';
import { Login } from './pages/Login/Login';
import { SignUp } from './pages/Signup/SignUp';
import { PageContainer } from './components/PageContainer';
import { Account } from './pages/Account/Account';
import { AccountProfile } from './pages/Account/components/AccountProfile';
import AccountNotifications from './pages/Account/components/AccountNotifications';
import AccountRoot from './pages/Account/components/AccountRoot';
import Dashboard from './pages/Dashboard/Dashboard';
import MyDogs from './pages/Dashboard/MyDogs';
import MyWalks from './pages/Dashboard/Walks';
import Schedules from './pages/Dashboard/Schedules';
import { DogProfile } from './pages/Dashboard/DogProfile';
import { Messages } from './pages/Dashboard/Messages/Messages';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PageContainer />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account/>}>
          <Route path="/account" element={<AccountRoot/>} />
          <Route path="/account/profile" element={<AccountProfile />} />
          <Route path="/account/notifications" element={<AccountNotifications />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="/dashboard" element={<MyDogs />} />
          <Route path="/dashboard/dogs/:id" element={<DogProfile />} />
          <Route path="/dashboard/walks" element={<MyWalks />} />
          <Route path="/dashboard/schedules" element={<Schedules />} />
          <Route path="/dashboard/messages" element={<Messages />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
