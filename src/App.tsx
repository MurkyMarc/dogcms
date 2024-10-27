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
import AccountSettings from './pages/Account/components/AccountSettings';
import Dashboard from './pages/Dashboard/Dashboard';
import MyDogs from './pages/Dashboard/MyDogs';
import MyWalks from './pages/Dashboard/Walks';
import { DogProfile } from './pages/Dashboard/DogProfile';
import { CreateDogProfile } from './pages/Dashboard/CreateDogProfile';
import { Conversations } from './pages/Dashboard/Messages/Conversations';
import AccountAddress from './pages/Account/components/AccountAddress';
import CreateWalk from './pages/Dashboard/components/CreateWalk';
import EditWalk from './pages/Dashboard/components/EditWalk';
import Walk from './pages/Dashboard/components/Walk';
import WalkChat from './pages/Dashboard/components/WalkChat';
import Packages from './pages/Dashboard/Packages/Packages';
import Schedule from './pages/Schedule/Schedule';
import AdminPricing from './pages/Dashboard/Pricing/AdminPricing';

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
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/account" element={<Account/>}>
          <Route path="/account" element={<AccountSettings/>} />
          <Route path="/account/profile" element={<AccountProfile />} />
          <Route path="/account/notifications" element={<AccountNotifications />} />
          <Route path="/account/address" element={<AccountAddress />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="/dashboard" element={<MyDogs />} />
          <Route path="/dashboard/dogs/new" element={<CreateDogProfile />} />
          <Route path="/dashboard/dogs/:id" element={<DogProfile />} />
          <Route path="/dashboard/walks" element={<MyWalks />} />
          <Route path="/dashboard/walks/new" element={<CreateWalk />} />
          <Route path="/dashboard/walk/:id" element={<Walk />} />
          <Route path="/dashboard/walk/:id/edit" element={<EditWalk />} />
          <Route path="/dashboard/walk/:id/chat" element={<WalkChat />} />
          <Route path="/dashboard/conversations" element={<Conversations />} />
          <Route path="/dashboard/packages" element={<Packages />} />
          <Route path="/dashboard/pricing" element={<AdminPricing />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
