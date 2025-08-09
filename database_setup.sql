-- School Management Database Setup Script
-- Run this script in your MySQL database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS schools;

-- Create schools table
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO schools (name, address, latitude, longitude) VALUES
('Harvard University', 'Cambridge, MA 02138, USA', 42.3744, -71.1169),
('Massachusetts Institute of Technology', 'Cambridge, MA 02139, USA', 42.3601, -71.0589),
('Stanford University', 'Stanford, CA 94305, USA', 37.4275, -122.1697),
('University of California, Berkeley', 'Berkeley, CA 94720, USA', 37.8719, -122.2585),
('Yale University', 'New Haven, CT 06520, USA', 41.3163, -72.9223),
('Princeton University', 'Princeton, NJ 08544, USA', 40.3573, -74.6672),
('Columbia University', 'New York, NY 10027, USA', 40.8075, -73.9626),
('University of Pennsylvania', 'Philadelphia, PA 19104, USA', 39.9522, -75.1932),
('Duke University', 'Durham, NC 27708, USA', 36.0016, -78.9382),
('University of Chicago', 'Chicago, IL 60637, USA', 41.7897, -87.5997);

-- Verify the data
SELECT * FROM schools ORDER BY name;

-- Show table structure
DESCRIBE schools;

-- Show indexes
SHOW INDEX FROM schools; 