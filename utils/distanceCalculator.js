/**
 * Calculate the distance between two geographical coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Convert degrees to radians
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Sort schools by distance from user location
 * @param {Array} schools - Array of school objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {Array} Sorted array of schools with distance information
 */
const sortSchoolsByDistance = (schools, userLat, userLon) => {
  return schools.map(school => ({
    ...school,
    distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
  })).sort((a, b) => a.distance - b.distance);
};

module.exports = {
  calculateDistance,
  sortSchoolsByDistance
}; 