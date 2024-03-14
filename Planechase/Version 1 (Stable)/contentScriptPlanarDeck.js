if (typeof init === 'undefined') {

    // Global Definitions
    const scryfallAPI = 'https://api.scryfall.com/cards/search?q=t%3Aplane';// Only Planes From Scryfall
    var allPlaneCards = []; // All The Planes From Scryfall
    var planeIterator = 0;
    var totalCardCount = 0;
    const currentURL = window.location.href;
    const currentGame = currentURL.split('/').pop();
    const seed = parseInt(currentGame, 36);

    const init = function () {

        // Planar Deck
        let x = getCards(); // Gets and Sorts Cards Using Scryfall API

        // The Planar Deck
        const injectElement = document.createElement('div'); // Div To Hold Img
        injectElement.className = 'plane';
        const imgElement = document.createElement('img'); // Img from Scryfall
        imgElement.className = 'plane_img';

        // Listeners
        injectElement.addEventListener("contextmenu", rightClicked); // Scryfall
        injectElement.addEventListener("click", leftClicked); // Next Card
        document.addEventListener("keydown", toggleVisibility); // Toggles Planar Deck Visibility
        document.addEventListener("keydown", next)
        document.addEventListener("keydown", previous)
        injectElement.appendChild(imgElement);
        document.body.appendChild(injectElement);
    }


    // Planar Deck Methods

    // On Right Click Of Planar Deck This Will Be Called And Pull Up The Current Cards Scryfall Page
    const rightClicked = function (event) {
        window.open(allPlaneCards[planeIterator].scryfall_uri, "_blank");
        event.preventDefault();
    }

    // On Left Click Of Planar Deck This Will Be Called And Flip To The Next Card
    const leftClicked = function (event) {
        planeIterator += 1;
        cardPic = document.querySelector('.plane_img');
        cardPic.src = allPlaneCards[planeIterator].image;
        cardPic.style.transform = "rotate(90deg)";
    }

    // Collects, Shuffles, and Sorts All Planechase Cards For Planar Deck
    const getCards = function getCards() {
        fetch(scryfallAPI)
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
                        scryfall_uri: card.scryfall_uri,
                        intVal: seed % (card.tcgplayer_id * parseInt(card.name.replace(/\s/g, '').toUpperCase(), 26))
                    };
                });
                // Alphabetically Sorts Cards
                allPlaneCards.sort((a, b) => {
                    const nameA = a.intVal;
                    const nameB = b.intVal;

                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Fetch error:', error);
            });
    }

    // On Key Press of CNTRL + SHIFT + H, Hides Planar Deck 
    const toggleVisibility = function toggleVisibility(event) {
        if (event.ctrlKey && event.shiftKey && event.key === "H") {
            const divContainer = document.querySelector(".plane");
            if (divContainer.style.visibility == "hidden" || divContainer.style.visibility === "") {
                divContainer.style.visibility = "visible";
            }
            else {
                divContainer.style.visibility = "hidden";
            }
        }
    }

    // On Key Press of Right Arrow, Next Plane
    const next = function next(event) {
        if (event.keyCode == '39') {
            if (planeIterator < allPlaneCards.length - 1) {
                planeIterator += 1;
                cardPic = document.querySelector('.plane_img');
                cardPic.src = allPlaneCards[planeIterator].image;
                cardPic.style.transform = "rotate(90deg)";
            }
        }
    }

    // On Key Press of Left Arrow, Previous Plane
    const previous = function previous(event) {
        if (event.keyCode == '37') {
            if (planeIterator > 0) {
                planeIterator -= 1;
                cardPic = document.querySelector('.plane_img');
                cardPic.src = allPlaneCards[planeIterator].image;
                cardPic.style.transform = "rotate(90deg)";
            }
        }
    }

    init();
}

