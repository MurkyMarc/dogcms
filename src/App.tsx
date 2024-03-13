import './App.css'
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { PageContainer } from './components/PageContainer';
import { Account } from './pages/Account';
import { AccountProfile } from './components/AccountProfile';
import AccountNotifications from './components/AccountNotifications';
import AccountRoot from './components/AccountRoot';

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
