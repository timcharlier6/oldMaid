function filterHand(hand, filteredHand = [], index = 0) {
    function countOccurrences(hand, card) {
            let count = 0;
        for (let i = 0; i < hand.length; i++) {
            if (hand[i].split(" ")[0] === card.split(" ")[0]) {
                count++;
            }
        }
        return count;
    }

    if (index >= hand.length) {
        return filteredHand;
    }

    let card = hand[index];
    let count = countOccurrences(hand, card);

    // Here you can implement your conditions for different counts
    if (count === 4) {
    } else if (count === 3) {
        filteredHand.push(card); // Push one card
        // Discard two cards
        let discardedCount = 0;
        for (let i = index; i < hand.length && discardedCount < 2; i++) {
            if (hand[i].split(" ")[0] === card.split(" ")[0]) {
                hand.splice(i, 1);
                discardedCount++;
            }
        }
    } else if (count === 2) {
    } else {
        filteredHand.push(card);
    }

    return filterHand(hand, filteredHand, index + 1);
}
