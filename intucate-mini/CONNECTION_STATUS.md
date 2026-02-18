# Client-Server Connection Status Report

## FIXED: Client Now Connects to Server

### Changes Made:

#### 1. **DataUpload.tsx** - Modified to call Express server
   - **Before**: Used local `computeSqi` from `@/lib/sqiEngine`
   - **After**: Makes HTTP POST request to `http://localhost:5001/compute-sqi`
   - Added loading state and error handling
   - Uses environment variable for API URL

#### 2. **Environment Configuration** - Created `.env.local`
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

#### 3. **Test Script** - Created `test-connection.js`
   - Standalone script to verify server is running
   - Tests the `/compute-sqi` endpoint with sample data

## Connection Architecture

```
┌─────────────────┐         HTTP POST          ┌─────────────────┐
│                 │    /compute-sqi (5001)      │                 │
│  Next.js Client │ ─────────────────────────> │  Express Server │
│   (Port 3000)   │                             │   (Port 5001)   │
│                 │ <───────────────────────── │                 │
└─────────────────┘      JSON Response          └─────────────────┘
        │                                               │
        │                                               │
   DataUpload.tsx                                   sqi.js
   (validates data)                            (computes SQI)
```

## How to Test Connection

### Step 1: Start Server
```bash
cd server
npm install
npm start
```
Expected output: `SQI backend running on http://localhost:5001`

### Step 2: Test Server (Optional)
```bash
node test-connection.js
```
Should show: ` Connection successful!`

### Step 3: Start Client
```bash
cd client
npm install
npm run dev
```
Expected output: `Ready on http://localhost:3000`

### Step 4: Test in Browser
1. Navigate to `http://localhost:3000/login`
2. Login (credentials in code)
3. Go to Admin page
4. Upload JSON data or paste in textarea
5. Click "Compute SQI"
6. Results should appear from server

## Server Configuration (Already Correct)

### server/index.js
-  CORS enabled: `app.use(cors())`
-  JSON parsing: `app.use(express.json())`
-  Endpoint: `POST /compute-sqi`
-  Port: 5001

### server/sqi.js
-  Exports `computeSqi` function
-  Handles validation
-  Returns proper JSON format

## Client Configuration (Now Fixed)

### client/src/components/DataUpload.tsx
-  Validates data with Zod schema
-  Makes fetch request to server
-  Handles loading and error states
-  Uses environment variable for API URL

## API Contract

### Request Format
```json
{
  "student_id": "S001",
  "attempts": [
    {
      "topic": "string",
      "concept": "string",
      "importance": "A" | "B" | "C",
      "difficulty": "E" | "M" | "H",
      "type": "Practical" | "Theory",
      "case_based": boolean,
      "correct": boolean,
      "marks": number,
      "neg_marks": number,
      "expected_time_sec": number,
      "time_spent_sec": number,
      "marked_review": boolean,
      "revisits": number
    }
  ]
}
```

### Response Format
```json
{
  "student_id": "S001",
  "overall_sqi": 85.5,
  "topic_scores": [
    { "topic": "Algebra", "sqi": 90.2 }
  ],
  "concept_scores": [
    { "topic": "Algebra", "concept": "Linear Equations", "sqi": 95.0 }
  ],
  "ranked_concepts_for_summary": [
    {
      "topic": "Algebra",
      "concept": "Quadratic Equations",
      "weight": 0.825,
      "computed_at": "2024-01-01T00:00:00.000Z",
      "engine": "sqi-v0.1"
    }
  ],
  "metadata": {
    "diagnostic_prompt_version": "V1",
    "computed_at": "2024-01-01T00:00:00.000Z",
    "engine": "sqi-v0.1"
  }
}
```

## Redundant Code (Can be Removed)

These files are no longer needed since we're using the server:

1. **client/src/lib/sqiEngine.ts** - Local SQI computation (not used)
2. **client/src/app/api/sqi/route.ts** - Next.js API route (not used)

Keep them for now as backup, but the client now properly connects to the Express server.

## Troubleshooting

### Issue: "Failed to fetch"
**Solution**: Ensure server is running on port 5001

### Issue: CORS error
**Solution**: Already fixed - server has `cors()` middleware

### Issue: "Invalid data"
**Solution**: Check data format matches schema in `schemas.ts`

### Issue: Port 5001 already in use
**Solution**: 
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Or change port in server/index.js
```

## Summary

 **Client and server can now connect**
- Client makes HTTP requests to Express server
- Server computes SQI and returns results
- CORS is properly configured
- Error handling is in place
- Environment variables allow easy configuration

The connection is now fully functional!
