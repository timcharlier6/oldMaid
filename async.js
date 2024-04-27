
(async () => {
    const selectedLanguage = await selectPromise;
    const oldMaid = new OldMaid(selectedLanguage);
    // Pass both player's and computer's hands to discardPairs function
    discardPairs(oldMaid.hands[0], oldMaid.hands[1], selectedLanguage);
})();

