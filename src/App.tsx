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

        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
