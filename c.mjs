import inquirer from 'inquirer';
import readline from 'readline';
import select from 'cli-select';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//const suits = ['\u2665', '\u2666', '\u2663', '\u2660']; // Hearts, Diamonds, Clubs, Spades
//const suits = ['\u2661', '\u2662', '\u2667', '\u2664']; // Hearts, Diamonds, Clubs, Spades (Different styles for French)
console.log("SELECT:");

const selectPromise = new Promise((resolve, reject) => {
    select(
        {
            values: ['English', 'Francais'],
            valueRenderer: (value, selected) => {
                if (selected) {
                    return chalk.underline(value);
                }
                return value;
            }
        }, (selected) => {
            resolve(selected.value); // Resolve the promise with the selected value
            rl.close();
        }
    );
});

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

    sortHand() {
    }
}

const discardPairs = (hand, language) => {
    let en = language === 'English';
    let dirtyHand = [...hand];
    console.log(en ? '\n╭─────────────────────────────────────╮\n│ You should remove all your pairs... │\n╰─────────────────────────────────────╯\n' : '\n╭─────────────────────────────────────────╮\n│ Vous devez enlevez toutes vos paires... │\n╰─────────────────────────────────────────╯\n');

    const promptPairSelection = () => {
        inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedCards',
                message: en ? 'Select two pairs to discard:' : 'Selectionnez deux pairs a defausser:',
                choices: dirtyHand,
                validate: validatePairSelection
            }
        ]).then(handlePairSelection);
    }

    const validatePairSelection = (input) => {
        if (input.length !== 2 || input[0].split(" ")[0] !== input[1].split(" ")[0]) {
            return en ? 'Please select a pair.' : 'Veuillez selectionner une pair.';
        } else {
            return true;
        }
    };

    const handlePairSelection = (answers) => {
        const [firstCard, secondCard] = answers.selectedCards;
        const remainingChoices = dirtyHand.filter(card => card !== firstCard && card !== secondCard);
        dirtyHand = [...remainingChoices];

        const pairsRemaining = countPairs(dirtyHand);

        if (pairsRemaining.length > 0) {
            en ? console.log(`There are ${pairsRemaining.length / 2} pairs remaining.`) : console.log(`Il reste ${pairsRemaining.length / 2 } pairs.`);
            promptPairSelection();
        } else {
            en ? console.log("No pairs left.") : console.log("Plus de pairs.");
        }
    };

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

    promptPairSelection();
};

(async () => {
    const selectedLanguage = await selectPromise;
    const oldMaid = new OldMaid(selectedLanguage);
    discardPairs(oldMaid.hands[0], selectedLanguage);
})();


