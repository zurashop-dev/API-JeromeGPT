const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const GITHUB_TOKEN = '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'; // Replace with your GitHub Personal Access Token
const OWNER = 'zurashop-dev'; // Replace with your GitHub username
const REPO = 'API-JeromeGPT'; // Replace with your repository name
const PATH = 'database/rating.json'; // File path in the repo
const BRANCH = 'main'; // Branch name

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

async function getFileShaAndContent() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (response.status === 404) {
    // File not found, return null sha and empty content
    return { sha: null, content: '[]' };
  }
  if (!response.ok) throw new Error('Failed to get file from GitHub');
  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { sha: data.sha, content };
}

app.get('/api/rating', async (req, res) => {
  try {
    const { content } = await getFileShaAndContent();
    res.json(JSON.parse(content));
  } catch (err) {
    console.error('Error getting rating:', err);
    res.status(500).json({ error: 'Failed to load rating data' });
  }
});

app.post('/api/rating', async (req, res) => {
  try {
    const { name, email, skills, message, rating } = req.body;
    if (!name || !email || !Array.isArray(skills) || !Number.isInteger(rating)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });

    const { sha, content } = await getFileShaAndContent();
    let data = JSON.parse(content);
    data.push({ name, email, skills: skills.filter(s => s.trim()), message: message || '', rating, initial: name[0].toUpperCase() });
    const newContent = Buffer.from(JSON.stringify(data, null, 2)).toBase64();

    const putUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
    const putBody = {
      message: 'Update rating.json with new expert',
      content: newContent,
      branch: BRANCH,
      sha: sha  // Only if file exists
    };
    const putResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(putBody)
    });
    if (!putResponse.ok) throw new Error('Failed to update file on GitHub');
    res.status(201).json(req.body);
  } catch (err) {
    console.error('Error saving rating:', err);
    res.status(500).json({ error: 'Failed to save rating data' });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const GITHUB_TOKEN = 'your_github_pat_here'; // Replace with your GitHub Personal Access Token
const OWNER = 'your_github_username'; // Replace with your GitHub username
const REPO = 'your_repo_name'; // Replace with your repository name
const PATH = 'rating.json'; // File path in the repo
const BRANCH = 'main'; // Branch name

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

async function getFileShaAndContent() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (response.status === 404) {
    // File not found, return null sha and empty content
    return { sha: null, content: '[]' };
  }
  if (!response.ok) throw new Error('Failed to get file from GitHub');
  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { sha: data.sha, content };
}

app.get('/api/rating', async (req, res) => {
  try {
    const { content } = await getFileShaAndContent();
    res.json(JSON.parse(content));
  } catch (err) {
    console.error('Error getting rating:', err);
    res.status(500).json({ error: 'Failed to load rating data' });
  }
});

app.post('/api/rating', async (req, res) => {
  try {
    const { name, email, skills, message, rating } = req.body;
    if (!name || !email || !Array.isArray(skills) || !Number.isInteger(rating)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });

    const { sha, content } = await getFileShaAndContent();
    let data = JSON.parse(content);
    data.push({ name, email, skills: skills.filter(s => s.trim()), message: message || '', rating, initial: name[0].toUpperCase() });
    const newContent = Buffer.from(JSON.stringify(data, null, 2)).toBase64();

    const putUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
    const putBody = {
      message: 'Update rating.json with new expert',
      content: newContent,
      branch: BRANCH,
      sha: sha  // Only if file exists
    };
    const putResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(putBody)
    });
    if (!putResponse.ok) throw new Error('Failed to update file on GitHub');
    res.status(201).json(req.body);
  } catch (err) {
    console.error('Error saving rating:', err);
    res.status(500).json({ error: 'Failed to save rating data' });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
