// CONSTANTS
const DOMAIN_CATEGORY = 'Domain Format Decks';
const DECKMASTER_PARAM_KEY = 'deckmaster'
const DECKMASTER_LOCATION_PARAM_KEY = 'dm_location'
const DECK_PATH_REGEXP = new RegExp(`/deck/.+`);
const PLAYTEST_PATH_REGEXP = new RegExp(`/decks/playtest/.*`);

// HELPERS
const getCardLocation = (cardType) => {
    let extraDeckTypesRegExp = /fusion|synchro|xyz|link/i
    return extraDeckTypesRegExp.test(cardType) ? 'extra' : 'main';
}
const injectCardIntoDeck = (cardId, location) => {
    let deck = window[`${location}_deck`];
    !!deck && deck.push(cardId);
}
const buildURLWithCardInfo = (url, cardId, location) => {
    return `${url}&${DECKMASTER_PARAM_KEY}=${cardId}&${DECKMASTER_LOCATION_PARAM_KEY}=${location}`;
}

// PER PAGE FUNCTIONS
const onDeckPathDOMContentLoaded = () => {
    let sideDeck = JSON.parse(window.sidedeckjs);
    let deckmasterId = sideDeck[0];
    let cardInDOM = document.querySelector(`[data-name="${deckmasterId}"]`);
    let cardType = cardInDOM.dataset.cardtype;
    let deckmasterLocation = getCardLocation(cardType);
    let linkInDOM = document.querySelector("a[href*='decks/playtest']");
    if (!linkInDOM) return;
    linkInDOM.href = buildURLWithCardInfo(linkInDOM.href, deckmasterId, deckmasterLocation);
}
const onPlayTestDOMContentLoaded = () => {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    let deckmasterId = searchParams.get(DECKMASTER_PARAM_KEY);
    let deckmasterLocation = searchParams.get(DECKMASTER_LOCATION_PARAM_KEY);
    if (!deckmasterId || !deckmasterLocation) return;
    injectCardIntoDeck(deckmasterId, deckmasterLocation)
}

// EVENTS
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (DECK_PATH_REGEXP.test(path) && window.category === DOMAIN_CATEGORY) {
        onDeckPathDOMContentLoaded();
    } else if (PLAYTEST_PATH_REGEXP.test(path)) {
        onPlayTestDOMContentLoaded();
    }
})
