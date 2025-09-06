const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our auth middleware

// Import Models
const Referral = require('../models/Referral');
const User = require('../models/User');


router.post('/', auth, async (req, res) => {
  try {
    const { title, company, description, status } = req.body;

    const newReferral = new Referral({
      title,
      company,
      description,
      status,
      user: req.user.id, // Link the referral to the logged-in user
    });

    const referral = await newReferral.save();
    res.json(referral);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/', auth, async (req, res) => {
  try {
    // Find referrals and sort by most recent first
    const referrals = await Referral.find({ user: req.user.id }).sort({ date: -1 });
    res.json(referrals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.put('/:id', auth, async (req, res) => {
    try {
        let referral = await Referral.findById(req.params.id);

        if (!referral) return res.status(404).json({ msg: 'Referral not found' });

        // Make sure user owns the referral
        if (referral.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { title, company, description, status } = req.body;
        
        // Build updated referral object
        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (company) updatedFields.company = company;
        if (description) updatedFields.description = description;
        if (status) updatedFields.status = status;

        referral = await Referral.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true } // Return the modified document
        );

        res.json(referral);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    let referral = await Referral.findById(req.params.id);

    if (!referral) return res.status(404).json({ msg: 'Referral not found' });

    // Make sure user owns the referral
    if (referral.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await referral.remove();

    res.json({ msg: 'Referral removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate('user', ['name']) // Get the name of the user who posted
      .sort({ date: -1 });
    res.json(referrals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.post('/apply/:id', auth, async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);

    // Check if the referral exists
    if (!referral) {
      return res.status(404).json({ msg: 'Referral not found' });
    }

    // Check if the user has already applied
    if (referral.applications.some((app) => app.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'You have already applied to this referral' });
    }
    
    // Check if the user is the one who posted it
    if (referral.user.toString() === req.user.id) {
        return res.status(400).json({ msg: 'You cannot apply to your own referral' });
    }

    referral.applications.unshift({ user: req.user.id });
    await referral.save();
    res.json(referral.applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/status/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    let referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({ msg: 'Referral not found' });
    }

    // Ensure the user owns the referral
    if (referral.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Validate the status
    if (status !== 'Open' && status !== 'Closed') {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    referral.status = status;
    await referral.save();
    res.json(referral);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate('user', ['name']) // Get the poster's name
      .populate('applications.user', ['name']); // Get the applicants' names

    if (!referral) {
      return res.status(404).json({ msg: 'Referral not found' });
    }
    res.json(referral);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;