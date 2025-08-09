const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testSchool = {
  name: "Test University",
  address: "123 Test Street, Test City, TC 12345",
  latitude: 40.7128,
  longitude: -74.0060
};

async function testAPI() {
  console.log('🧪 Testing School Management API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('   Status:', healthResponse.status);
    console.log('');

    // Test 2: API Documentation
    console.log('2. Testing API Documentation...');
    const docsResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ API Documentation:', docsResponse.data.message);
    console.log('   Version:', docsResponse.data.version);
    console.log('');

    // Test 3: Add School
    console.log('3. Testing Add School...');
    const addResponse = await axios.post(`${BASE_URL}/addSchool`, testSchool);
    console.log('✅ School Added:', addResponse.data.message);
    console.log('   School ID:', addResponse.data.data.id);
    console.log('   School Name:', addResponse.data.data.name);
    console.log('');

    // Test 4: List Schools
    console.log('4. Testing List Schools...');
    const listResponse = await axios.get(`${BASE_URL}/listSchools?latitude=40.7128&longitude=-74.0060`);
    console.log('✅ Schools Listed:', listResponse.data.message);
    console.log('   Total Schools:', listResponse.data.total);
    console.log('   First School:', listResponse.data.data[0]?.name);
    console.log('   Distance to first school:', listResponse.data.data[0]?.distance, 'km');
    console.log('');

    // Test 5: Get School by ID
    console.log('5. Testing Get School by ID...');
    const schoolId = addResponse.data.data.id;
    const getResponse = await axios.get(`${BASE_URL}/school/${schoolId}`);
    console.log('✅ School Retrieved:', getResponse.data.message);
    console.log('   School Name:', getResponse.data.data.name);
    console.log('');

    // Test 6: Validation Error (Invalid Latitude)
    console.log('6. Testing Validation Error...');
    try {
      await axios.post(`${BASE_URL}/addSchool`, {
        ...testSchool,
        latitude: 100 // Invalid latitude
      });
    } catch (error) {
      console.log('✅ Validation Error Caught:', error.response.data.message);
      console.log('   Error Details:', error.response.data.errors[0]?.message);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('📚 API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run tests
testAPI(); 