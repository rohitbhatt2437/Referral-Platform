import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const SignupPage = () => {
  // Hook to programmatically navigate to other pages
  const navigate = useNavigate();

  // State to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State for displaying messages (errors or success)
  const [message, setMessage] = useState('');

  // Destructure for easier access in the form
  const { name, email, password } = formData;

  // Function to update state when user types in an input field
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Function to handle form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Call the signup service with the form data
      await authService.signup({ name, email, password });
      
      // If signup is successful, redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      // If there's an error (e.g., user already exists), display the message from the backend
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.msg) ||
        error.message ||
        error.toString();
      setMessage(errorMessage);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={onSubmit}
          className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
            Create an Account
          </h1>

          {/* Display message if it exists */}
          {message && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {message}
            </p>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              minLength="6"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;