// Global Variables
const currentURL = window.location.href;
var currentCard = document.getElementById("main-content");
const currentGame = currentURL.split('/').pop();
const atWizards = currentURL.split('/').at(0);
const seed = parseInt(currentGame, 36);
const scryfallAPI = 'https://api.scryfall.com/cards/search?q=t%3Aplane';// Only Planes From Scryfall
var allPlaneCards = []; // All The Planes From Scryfall
var planeIterator = -1;
var totalCardCount = 0;

// On Webpage Load
document.addEventListener("DOMContentLoaded", function () {
    getCards(scryfallAPI);
    leftClicked();
});

// Disables Context Menu
currentCard.addEventListener("contextmenu", (e) => { e.preventDefault() });

// On Right-Click Of Plane, Planeswalk 
function rightClicked() {
    window.open(allPlaneCards[planeIterator].scryfall_uri, "_blank");
}

// On Left-Click of Plane 
function leftClicked() {
    console.log("click");
    planeIterator += 1;
    cardPic = document.getElementById("card");
    cardPic.src = allPlaneCards[planeIterator].image;
    cardPic.style.transform = "rotate(90deg)";
}

// We Make Sure Each Player Has Same Plane By Sorting The List
function sortData() {
    // Alphabetically Sorts Cards
    allPlaneCards.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    prngShuffle(allPlaneCards);
}

function prngShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap arr[i] and arr[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


// Gets All Valid Planes Cards For Planechase
function getCards(apiUrl) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response body as JSON
        })
        .then(data => {
            // Create Array of All Planes In MTG
            totalCardCount = data["total_cards"];
            allPlaneCards = data["data"];
            // Parses Scryfall Data Into Neccessary Fields
            allPlaneCards = allPlaneCards.map(card => {
                return {
                    name: card.name,
                    image: card.image_uris.png,
                    scryfall_uri: card.scryfall_uri
                };
            });
            sortData();
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}