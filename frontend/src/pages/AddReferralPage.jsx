import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import referralService from '../services/referralService';

const AddReferralPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
  });
  const [message, setMessage] = useState('');

  const { title, company, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await referralService.createReferral(formData);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      setMessage('Failed to post referral. Please try again.');
      console.error(error);
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
            Post a New Referral
          </h1>
          {message && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {message}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={company}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg w-full"
          >
            Post Referral
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReferralPage;