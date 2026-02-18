// Test script to verify server connection
// Run with: node test-connection.js

const testData = {
  student_id: "S001",
  attempts: [
    {
      topic: "Algebra",
      concept: "Linear Equations",
      importance: "A",
      difficulty: "M",
      type: "Practical",
      case_based: false,
      correct: true,
      marks: 4,
      neg_marks: 1,
      expected_time_sec: 120,
      time_spent_sec: 100,
      marked_review: false,
      revisits: 0
    },
    {
      topic: "Algebra",
      concept: "Quadratic Equations",
      importance: "B",
      difficulty: "H",
      type: "Theory",
      case_based: false,
      correct: false,
      marks: 5,
      neg_marks: 1,
      expected_time_sec: 180,
      time_spent_sec: 200,
      marked_review: true,
      revisits: 2
    }
  ]
};

async function testConnection() {
  try {
    console.log('Testing connection to http://localhost:5001/compute-sqi...\n');
    
    const response = await fetch('http://localhost:5001/compute-sqi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('✅ Connection successful!\n');
    console.log('Response:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nMake sure the server is running:');
    console.error('  cd server');
    console.error('  npm start');
  }
}

testConnection();
