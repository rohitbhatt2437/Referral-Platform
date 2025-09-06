import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';

const ProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    headline: '',
    skills: '',
    // We'll keep education and experience simple for now
  });
  const [message, setMessage] = useState('');

  // Fetch existing profile data when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getMyProfile();
        setFormData({
          headline: profile.headline || '',
          skills: profile.skills.join(', ') || '',
        });
      } catch (error) {
        console.log('No existing profile found, creating a new one.');
      }
    };
    fetchProfile();
  }, []);

  const { headline, skills } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileService.createOrUpdateProfile({ headline, skills });
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg">
        <form
          onSubmit={onSubmit}
          className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
            Edit Your Profile
          </h1>
          {message && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {message}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="headline">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              value={headline}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="e.g., Full Stack Developer"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={skills}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="e.g., React, Node.js, MongoDB"
            />
            <p className="text-xs text-gray-500 mt-1">Please use comma separated values.</p>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg w-full"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;