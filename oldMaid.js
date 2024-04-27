

class OldMaid {
    constructor(language) {
        this.suits = ['\u2665', '\u2666', '\u2663', '\u2660'];
        this.ranks = language === 'English' ? ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'] : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valet', 'Dame', 'Roi', 'As'];
        this.players = 2;
        this.language = language;
        this.deck = this.createDeck();
        this.hands = this.dealCards();
    }

    createDeck() {

        let deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                deck.push(`${rank} ${suit}`);
            }
        }

        const indexToRemove = this.language === 'English' ? deck.indexOf('Queen \u2665') : deck.indexOf('Dame \u2665');
        if (indexToRemove !== -1) {
            deck.splice(indexToRemove, 1);
        }

        return this.shuffle(deck);
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    dealCards() {
        let hands = Array.from({ length: this.players }, () => []);
        let currentPlayer = 0;

        while (this.deck.length > 0) {
            hands[currentPlayer].push(this.deck.pop());
            currentPlayer = (currentPlayer + 1) % this.players;
        }

        hands.forEach((hand) => {
            hand.sort((a, b) => {
                const rankA = a.split(' ')[0];
                const rankB = b.split(' ')[0];
                return this.ranks.indexOf(rankA) - this.ranks.indexOf(rankB);
            });
        })

        return hands;
    }
}

module.exports = OldMaid;
