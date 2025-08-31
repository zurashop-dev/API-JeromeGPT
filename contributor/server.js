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

app.get('/api/experts', async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load experts' });
  }
});

app.post('/api/experts', async (req, res) => {
  try {
    const { name, email, skills, message, rating } = req.body;
    if (!name || !email || !skills || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newExpert = { name, email, skills, message, rating, initial: name[0].toUpperCase() };
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    data.push(newExpert);
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    res.status(201).json(newExpert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save expert' });
  }
});

initializeData().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
