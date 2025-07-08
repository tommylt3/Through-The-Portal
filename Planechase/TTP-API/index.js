import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const decks = {};

// Utility: Shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Roll planar die
app.get('/roll', (req, res) => {
  const roll = Math.floor(Math.random() * 6);
  const result = roll === 0 ? 'chaos' : roll === 1 ? 'planeswalk' : 'blank';
  res.json({ result });
});

// Create deck
app.post('/deck/:lobbyId', async (req, res) => {
  const { lobbyId } = req.params;
  if (decks[lobbyId]) return res.json(decks[lobbyId]);

  try {
    const response = await fetch('https://api.scryfall.com/cards/search?q=t%3Aplane');
    const data = await response.json();

    const allPlanes = data.data.map(card => ({
      name: card.name,
      image: card.image_uris.png,
      scryfall_uri: card.scryfall_uri,
    }));

    shuffle(allPlanes);
    decks[lobbyId] = {
      deck: allPlanes,
      currentIndex: 0,
    };

    res.json(decks[lobbyId]);

  } catch (error) {
    console.error('Deck generation error:', error);
    res.status(500).json({ error: 'Failed to fetch cards from Scryfall' });
  }
});

// Get deck and current index
app.get('/deck/:lobbyId', (req, res) => {
  const deck = decks[req.params.lobbyId];
  if (!deck) return res.status(404).json({ error: 'Deck not found' });
  res.json(deck);
});

// Update current index
app.post('/deck/:lobbyId/currentIndex', (req, res) => {
  const { lobbyId } = req.params;
  const { currentIndex } = req.body;

  if (!decks[lobbyId]) return res.status(404).json({ error: 'Deck not found' });

  if (typeof currentIndex === 'number') {
    decks[lobbyId].currentIndex = currentIndex;
    return res.json({ message: 'Index updated' });
  }

  res.status(400).json({ error: 'Invalid index' });
});

// Delete deck
app.delete('/deck/:lobbyId', (req, res) => {
  const { lobbyId } = req.params;
  if (decks[lobbyId]) {
    delete decks[lobbyId];
    res.json({ message: `Deck for lobby ${lobbyId} deleted.` });
  } else {
    res.status(404).json({ error: 'Deck not found' });
  }
});

app.listen(port, () => {
  console.log(`Planechase API running at http://localhost:${port}`);
});
