import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import referralService from '../services/referralService';
import authService from '../services/authService'; // Import the auth service

const FeedPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Get the current user's ID once when the component loads
  const currentUserId = authService.getCurrentUserId();

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const data = await referralService.getAllReferrals();
        setReferrals(data);
      } catch (error) {
        console.error('Failed to fetch referrals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const handleApply = async (id) => {
    try {
      await referralService.applyToReferral(id);
      alert('Application successful!');
      // Optionally, you could update the UI to show the user has applied
    } catch (error) {
      alert(error.response?.data?.msg || 'Failed to apply');
    }
  };

  const filteredReferrals = referrals.filter(
    (ref) =>
      ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center text-xl">Loading feed...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Referral Feed</h1>
      <input
        type="text"
        placeholder="Search by title or company..."
        className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-4">
        {filteredReferrals.length > 0 ? (
          filteredReferrals.map((ref) => (
            <Link to={`/referral/${ref._id}`} className="block hover:bg-gray-50">
            <div key={ref._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{ref.title}</h2>
                    <p className="text-gray-600">{ref.company}</p>
                    <p className="text-sm text-gray-500 mt-1">Posted by: {ref.user.name}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      ref.status === 'Open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {ref.status}
                  </span>
              </div>
              <p className="my-3 text-gray-700">{ref.description}</p>
              
              {/* This is the crucial logic */}
              {ref.user._id !== currentUserId && ref.status === 'Open' && (
                <button
                  onClick={() => handleApply(ref._id)}
                  className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                >
                  Apply
                </button>
              )}
            </div>
            </Link>
            
          ))
        ) : (
          <p>No referrals found.</p>
        )}
      </div>
    </div>
  );
};

export default FeedPage;