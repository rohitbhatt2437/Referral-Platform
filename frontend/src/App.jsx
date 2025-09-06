import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute'; 
import ProfilePage from './pages/ProfilePage'; 
import AddReferralPage from './pages/AddReferralPage';
import FeedPage from './pages/FeedPage';
import ReferralDetailPage from './pages/ReferralDetailPage';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* 2. Wrap the DashboardPage route */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />          
            <Route
              path="/add-referral"
              element={
                <PrivateRoute>
                  <AddReferralPage />
                </PrivateRoute>
              }
            />
            <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
            <Route
              path="/referral/:id"
              element={
                <PrivateRoute>
                  <ReferralDetailPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;