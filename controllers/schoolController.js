const { pool } = require('../config/database');
const { sortSchoolsByDistance } = require('../utils/distanceCalculator');

/**
 * Add a new school to the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    
    const connection = await pool.getConnection();
    
    // Check if school with same name and address already exists
    const [existingSchools] = await connection.execute(
      'SELECT id FROM schools WHERE name = ? AND address = ?',
      [name, address]
    );
    
    if (existingSchools.length > 0) {
      connection.release();
      return res.status(409).json({
        success: false,
        message: 'A school with this name and address already exists'
      });
    }
    
    // Insert new school
    const [result] = await connection.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    
    // Fetch the newly created school
    const [newSchool] = await connection.execute(
      'SELECT * FROM schools WHERE id = ?',
      [result.insertId]
    );
    
    connection.release();
    
    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: newSchool[0]
    });
    
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

/**
 * Get all schools sorted by distance from user location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    const connection = await pool.getConnection();
    
    // Fetch all schools
    const [schools] = await connection.execute(
      'SELECT id, name, address, latitude, longitude, created_at, updated_at FROM schools ORDER BY name'
    );
    
    connection.release();
    
    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found',
        data: [],
        total: 0
      });
    }
    
    // Sort schools by distance from user location
    const sortedSchools = sortSchoolsByDistance(schools, parseFloat(latitude), parseFloat(longitude));
    
    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: sortedSchools,
      total: sortedSchools.length,
      userLocation: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    });
    
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

/**
 * Get a specific school by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    
    const [schools] = await connection.execute(
      'SELECT * FROM schools WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    if (schools.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'School retrieved successfully',
      data: schools[0]
    });
    
  } catch (error) {
    console.error('Error getting school:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

module.exports = {
  addSchool,
  listSchools,
  getSchoolById
}; 