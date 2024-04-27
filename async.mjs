import OldMaid from './oldMaid.js';
import selectPromise from './language.mjs';
import discardPairs from './discardPairs.mjs';


let filteredHands = async () => {
    const selectedLanguage = await selectPromise;
    const oldMaid = new OldMaid(selectedLanguage);
    return discardPairs(oldMaid.hands[0], oldMaid.hands[1], selectedLanguage);
};

console.log(filteredHands);
