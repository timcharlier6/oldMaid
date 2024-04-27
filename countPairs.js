const countPairs = (hand) => {
    const pairs = [];
    hand.forEach((card, index) => {
        const pairIndex = hand.findIndex((otherCard, otherIndex) => {
            return index !== otherIndex && otherCard.split(' ')[0] === card.split(' ')[0];
        });
        if (pairIndex !== -1) {
            pairs.push(index, pairIndex);
        }
    });
    return pairs;
};
