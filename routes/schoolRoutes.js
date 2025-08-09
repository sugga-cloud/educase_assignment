const express = require('express');
const router = express.Router();
const { 
  addSchool, 
  listSchools, 
  getSchoolById 
} = require('../controllers/schoolController');
const { 
  validateAddSchool, 
  validateListSchools, 
  handleValidationErrors 
} = require('../middleware/validation');

// Route to add a new school
router.post('/addSchool', validateAddSchool, handleValidationErrors, addSchool);

// Route to list schools sorted by proximity
router.get('/listSchools', validateListSchools, handleValidationErrors, listSchools);

// Route to get a specific school by ID
router.get('/school/:id', getSchoolById);

module.exports = router; 