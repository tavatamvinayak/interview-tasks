// backend/index.js
const express = require('express');
const cors = require('cors');
const { computeSqi } = require('./sqi');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.method, req.path, req.body )
  next();

})

app.post('/compute-sqi', (req, res) => {
  try {
    const result = computeSqi(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Calculation failed' });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`SQI backend running on http://localhost:${PORT}`);
});