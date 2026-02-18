# Client-Server Connection Setup

## Architecture
- **Server (Express)**: Port 5001 - Handles SQI computation
- **Client (Next.js)**: Port 3000 - Frontend UI

## How to Run

### 1. Start the Server
```bash
cd server
npm install
npm start
```
Server will run at: http://localhost:5001

### 2. Start the Client
```bash
cd client
npm install
npm run dev
```
Client will run at: http://localhost:3000

## Connection Flow
1. User uploads data via DataUpload component
2. Client validates data using Zod schema
3. Client sends POST request to `http://localhost:5001/compute-sqi`
4. Server computes SQI and returns results
5. Client displays results via SqiResults component

## API Endpoint
**POST** `http://localhost:5001/compute-sqi`

**Request Body:**
```json
{
  "student_id": "S001",
  "attempts": [
    {
      "topic": "Algebra",
      "concept": "Linear Equations",
      "importance": "A",
      "difficulty": "M",
      "type": "Practical",
      "case_based": false,
      "correct": true,
      "marks": 4,
      "neg_marks": 1,
      "expected_time_sec": 120,
      "time_spent_sec": 100,
      "marked_review": false,
      "revisits": 0
    }
  ]
}
```

**Response:**
```json
{
  "student_id": "S001",
  "overall_sqi": 85.5,
  "topic_scores": [...],
  "concept_scores": [...],
  "ranked_concepts_for_summary": [...],
  "metadata": {...}
}
```

## CORS Configuration
Server has CORS enabled to accept requests from the Next.js client.

## Environment Variables
Create `.env.local` in client folder:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Troubleshooting

### Connection Refused
- Ensure server is running on port 5001
- Check if port is not blocked by firewall

### CORS Errors
- Server already has `cors()` middleware enabled
- If issues persist, check browser console

### Data Validation Errors
- Ensure data matches the schema in `client/src/lib/schemas.ts`
- Check server logs for detailed error messages
