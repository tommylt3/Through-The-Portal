if (!window.__planechase_initialized__) {
  window.__planechase_initialized__ = true;

  const API_BASE = 'http://localhost:3000';
  const lobbyId = window.location.href.split('/').pop();

  let allPlaneCards = [];
  let planeIterator = 0;
  let container;

  const initPlanechase = async () => {
    const success = await fetchDeck();

    if (!success || allPlaneCards.length === 0) {
      console.error("Planechase deck failed to load.");
      return;
    }

    container = document.createElement('div');
    container.className = 'plane';

    const img = document.createElement('img');
    img.className = 'plane_img';

    container.appendChild(img);
    document.body.appendChild(container);

    container.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const card = allPlaneCards[planeIterator];
      if (card) window.open(card.scryfall_uri, '_blank');
    });

    container.addEventListener("click", () => {
      nextCard();
    });

    window.addEventListener("message", (event) => {
      if (event.source === window && event.data.type === "TOGGLE_PLANECHASE") {
        toggleVisibility();
      }
    });

    renderCard();
  };

  async function fetchDeck() {
    try {
      let res = await fetch(`${API_BASE}/deck/${lobbyId}`);
      let data;

      if (res.ok) {
        data = await res.json();
      } else {
        const createRes = await fetch(`${API_BASE}/deck/${lobbyId}`, { method: 'POST' });
        data = await createRes.json();
      }

      if (Array.isArray(data)) {
        allPlaneCards = data;
        planeIterator = 0;
      } else if (data && Array.isArray(data.deck)) {
        allPlaneCards = data.deck;
        planeIterator = typeof data.currentIndex === 'number' ? data.currentIndex : 0;
      } else {
        throw new Error("Invalid deck format");
      }

      return true;
    } catch (err) {
      console.error("Failed to load deck:", err);
      return false;
    }
  }

  function renderCard() {
    const card = allPlaneCards[planeIterator];
    const img = container.querySelector('.plane_img');
    if (!img || !card) return;
    img.src = card.image;
    img.alt = card.name;
  }

  function nextCard() {
    if (!Array.isArray(allPlaneCards)) return;
    planeIterator = (planeIterator + 1) % allPlaneCards.length;
    renderCard();
    syncIndex();
  }

  function syncIndex() {
    if (!Array.isArray(allPlaneCards) || allPlaneCards.length === 0) return;
    fetch(`${API_BASE}/deck/${lobbyId}/currentIndex`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentIndex: planeIterator })
    }).catch(console.error);
  }

  function toggleVisibility() {
    if (!container) return;
    container.style.visibility = container.style.visibility === 'hidden' ? 'visible' : 'hidden';
  }

  initPlanechase();
}
