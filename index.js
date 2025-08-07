const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // use promise-based fs
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

let properties = [];

// Load properties from JSON file at startup
async function loadProperties() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    properties = JSON.parse(data);
    console.log(`Loaded ${properties.length} properties from file.`);
  } catch (err) {
    console.error('Failed to load properties:', err);
    properties = []; // fallback to empty array
  }
}

// Save updated properties to JSON file
async function saveProperties() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(properties, null, 2));
  } catch (err) {
    console.error('Failed to save properties:', err);
  }
}

// Calculate average price for a given suburb
function calculateAveragePrice(suburb) {
  const suburbProperties = properties.filter(p => p.suburb === suburb);
  if (suburbProperties.length === 0) return null;

  const total = suburbProperties.reduce((sum, p) => sum + p.salePrice, 0);
  return total / suburbProperties.length;
}

// Middleware
app.use(cors());
app.use(express.json());

// POST /addProperty
app.post('/addProperty', async (req, res) => {
  const { address, suburb, salePrice, description } = req.body;

  if (!address || !suburb || !salePrice || !description) {
    return res.status(400).json({ error: 'Missing required fields: address, suburb, salePrice, description' });
  }

  const newProperty = { address, suburb, salePrice, description };
  properties.push(newProperty);

  await saveProperties();

  res.status(201).json({
    message: 'Property added successfully',
    property: newProperty
  });
});

// GET /properties?suburb=SuburbA
app.get('/properties', (req, res) => {
  const suburbFilter = req.query.suburb?.toLowerCase();
  let results = properties;

  if (suburbFilter) {
    results = results.filter(p => p.suburb.toLowerCase() === suburbFilter);
  }

  const enrichedResults = results.map(property => {
    const avgPrice = calculateAveragePrice(property.suburb);
    let comparison = 'equal';
    if (property.salePrice > avgPrice) comparison = 'above';
    else if (property.salePrice < avgPrice) comparison = 'below';

    return {
      address: property.address,
      salePrice: property.salePrice,
      priceComparedToAvg: comparison,
    };
  });

  res.json(enrichedResults);
});

// Start server
app.listen(PORT, async () => {
  await loadProperties(); // ensure properties are loaded before accepting requests
  console.log(`Server running at http://localhost:${PORT}`);
});
