import OldMaid from './oldMaid.js';
import selectPromise from './language.mjs';
import discardPairs from './discardPairs.mjs'


(async () => {
    const selectedLanguage = await selectPromise;
    const oldMaid = new OldMaid(selectedLanguage);
    discardPairs(oldMaid.hands[0], oldMaid.hands[1], selectedLanguage);
})();

