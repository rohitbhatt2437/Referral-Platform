const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our auth middleware

// Import Models
const Profile = require('../models/Profile');
const User = require('../models/User');

router.get('/me', auth, async (req, res) => {
  try {
    // Find the profile based on the user ID from the token
    // Populate it with the user's name from the 'User' collection
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/', auth, async (req, res) => {
  const { headline, skills, education, experience } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (headline) profileFields.headline = headline;
  if (skills) {
    // We want skills to be an array of strings
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
  }
  if (education) profileFields.education = education;
  if (experience) profileFields.experience = experience;

  try {
    // Using findOneAndUpdate with upsert: true
    // This will update the profile if it exists, or create it if it doesn't
    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users referrals
    
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User and profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;