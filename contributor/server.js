const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'experts.json');

app.use(express.json());

// Initialize data file if it doesn't exist
async function initializeData() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([], null, 2));
  }
}

// Middleware to handle CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/api/experts', async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading experts:', err);
    res.status(500).json({ error: 'Failed to load experts' });
  }
});

app.post('/api/experts', async (req, res) => {
  try {
    const { name, email, skills, message, rating } = req.body;
    if (!name || !email || !skills || !rating) {
      return res.status(400).json({ error: 'Missing required fields: name, email, skills, or rating' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const newExpert = { name, email, skills, message, rating, initial: name[0].toUpperCase() };
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    data.push(newExpert);
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    res.status(201).json(newExpert);
  } catch (err) {
    console.error('Error saving expert:', err);
    res.status(500).json({ error: 'Failed to save expert' });
  }
});

initializeData().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Server initialization failed:', err);
});
