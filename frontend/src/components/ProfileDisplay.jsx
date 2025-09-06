import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const ProfileDisplay = ({ profile }) => {
  if (!profile) {
    return <p>No profile data available.</p>;
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8">
      <div className="flex items-center space-x-6">
        {/* We can add a profile picture here in the future */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{profile.user.name}</h1>
          <p className="text-xl text-indigo-600 font-light">{profile.professionalTitle}</p>
          <div className="flex space-x-4 mt-2 text-gray-500">
            {profile.social?.linkedin && <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin size={24} /></a>}
            {profile.social?.github && <a href={profile.social.github} target="_blank" rel="noopener noreferrer"><FaGithub size={24} /></a>}
            {profile.social?.twitter && <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter size={24} /></a>}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">About</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <span key={index} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </div>
      {/* You would add similar styled sections for Experience and Education */}
    </div>
  );
};

export default ProfileDisplay;