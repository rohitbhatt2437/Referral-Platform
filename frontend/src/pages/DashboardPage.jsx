import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileService from '../services/profileService';
import referralService from '../services/referralService';

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile and referrals in parallel
        const profileData = await profileService.getMyProfile();
        const referralsData = await referralService.getMyReferrals();
        
        setProfile(profileData);
        setReferrals(referralsData);
      } catch (err) {
        // If the profile doesn't exist, the backend sends a 400 error.
        // We'll handle this gracefully.
        if (err.response && err.response.status === 400) {
            setProfile(null); // Explicitly set profile to null
        } else {
            setError('Failed to load dashboard data. Please try again.');
        }
        // Still load referrals even if profile fails
        try {
            const referralsData = await referralService.getMyReferrals();
            setReferrals(referralsData);
        } catch (referralErr) {
             setError('Failed to load profile and referral data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty array ensures this effect runs only once when the component mounts

  const handleStatusChange = async (referralId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
      const updatedReferral = await referralService.updateReferralStatus(referralId, newStatus);
      
      // Update the state to reflect the change instantly on the UI
      setReferrals((prevReferrals) =>
        prevReferrals.map((ref) =>
          ref._id === referralId ? { ...ref, status: updatedReferral.status } : ref
        )
      );
    } catch (error) {
      console.error('Failed to update status', error);
      // Optionally, show an error message to the user
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Your Dashboard</h1>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}

      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Profile</h2>
        <Link to="/profile" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
          Edit Profile
        </Link>
      </div>
        {profile ? (
          <div>
            <h3 className="text-xl font-bold">{profile.user.name}</h3>
            <p className="text-gray-600">{profile.headline}</p>
            <p className="mt-2">
              <strong>Skills:</strong> {profile.skills.join(', ')}
            </p>
          </div>
        ) : (
          <div>
            <p>You have not yet set up a profile. Please add your info.</p>
            {/* We will add a link to create a profile later */}
          </div>
        )}
      </div>

      {/* Referrals Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Posted Referrals</h2>
          <Link to="/add-referral" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
            + Post Referral
          </Link>
        </div>
        {referrals.length > 0 ? (
          <ul className="space-y-4">
            {referrals.map((referral) => (
              <li key={referral._id} className="border p-4 rounded-md flex justify-between items-center">

                <Link
                  to={`/referral/${referral._id}`}
                  className="block p-4 flex-1 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{referral.title}</h3>
                      <p className="text-gray-700">{referral.company}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          referral.status === "Open"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        Status: {referral.status}
                      </span>
                      <p className="text-sm mt-1">
                        Applications: {referral.applications.length}
                      </p>
                    </div>
                  </div>
                </Link>
                <div>
                  <button
                    onClick={() => handleStatusChange(referral._id, referral.status)}
                    className={`font-bold py-2 px-4 rounded-lg text-sm ${
                      referral.status === 'Open'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {referral.status === 'Open' ? 'Mark as Closed' : 'Re-open'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not posted any referrals yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;