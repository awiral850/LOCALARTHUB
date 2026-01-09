const express = require('express');
const admin = require('../firebase');
const { verifyUser } = require('../authMiddleware');

const router = express.Router();

// Endpoint to become seller - sets custom claim 'seller' for the authenticated user
router.post('/become-seller', verifyUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    console.log('Attempting to set seller role for user:', uid);
    
    // get existing custom claims
    const userRecord = await admin.auth().getUser(uid);
    console.log('User record fetched:', userRecord.email);
    
    const existing = userRecord.customClaims || {};
    const newClaims = Object.assign({}, existing, { seller: true });
    console.log('New claims:', newClaims);
    
    await admin.auth().setCustomUserClaims(uid, newClaims);
    console.log('Seller role set successfully');
    
    res.json({ message: 'Seller role granted. Please sign out and sign in again to refresh token.' });
  } catch (e) {
    console.error('Error setting seller role:', e.message);
    console.error('Full error:', e);
    res.status(500).json({ message: 'Failed to set seller role: ' + e.message });
  }
});

module.exports = router;
