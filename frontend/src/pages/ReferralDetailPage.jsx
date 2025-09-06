import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import referralService from '../services/referralService';
import authService from '../services/authService';

const ReferralDetailPage = () => {
  const { id } = useParams(); // Gets the ':id' from the URL
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = authService.getCurrentUserId();

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const data = await referralService.getReferralById(id);
        setReferral(data);
      } catch (error) {
        console.error('Failed to fetch referral details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferral();
  }, [id]); // Re-run the effect if the ID in the URL changes

  if (loading) return <p className="text-center text-xl">Loading Referral...</p>;
  if (!referral) return <p className="text-center text-xl">Referral not found.</p>;

  const isOwner = referral.user._id === currentUserId;

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{referral.title}</h1>
          <p className="text-xl text-gray-600 mt-1">{referral.company}</p>
          <p className="text-sm text-gray-500 mt-2">Posted by: {referral.user.name}</p>
        </div>
        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
            referral.status === 'Open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
        }`}>
          {referral.status}
        </span>
      </div>
      <hr className="my-6" />
      <div>
        <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{referral.description}</p>
      </div>

      {/* Only show the 'Applicants' section if the current user is the owner */}
      {isOwner && (
        <div className="mt-8">
          <hr className="my-6" />
          <h2 className="text-2xl font-semibold mb-4">Applicants ({referral.applications.length})</h2>
          {referral.applications.length > 0 ? (
            <ul className="space-y-3">
              {referral.applications.map((app) => (
                <li key={app._id} className="bg-gray-100 p-3 rounded-md">
                  <p className="font-semibold">{app.user.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No one has applied yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralDetailPage;