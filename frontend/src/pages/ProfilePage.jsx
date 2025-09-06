import { useState, useEffect } from 'react';
import ProfileDisplay from '../components/ProfileDisplay';
import ProfileForm from '../components/ProfileForm';
import profileService from '../services/profileService';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getMyProfile();
        setProfile(data);
      } catch (error) {
        console.log('No profile exists for this user.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Loading Profile...</p>;

  // If no profile exists, force the user into editing mode
  if (!profile && !editing) {
      setEditing(true);
  }

  return (
    <div>
      {editing ? (
        <ProfileForm />
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setEditing(true)}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          </div>
          <ProfileDisplay profile={profile} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;