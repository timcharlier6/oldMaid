import inquirer from 'inquirer';
import readline from 'readline';
import select from 'cli-select';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(chalk.yellow("SELECT:"));

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
}

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

const discardPairs = (playerHand, computerHand, language) => {
    let en = language === 'English';
    let dirtyHand = [...playerHand];
    let dirtyComputerHand = [...computerHand];

    console.log(en ? chalk.yellow('\n╭─────────────────────────────────────╮\n│ You should remove all your pairs... │\n╰─────────────────────────────────────╯\n') : chalk.yellow('\n╭─────────────────────────────────────────╮\n│ Vous devez enlevez toutes vos paires... │\n╰─────────────────────────────────────────╯\n'));

    const promptPairSelection = () => {
        inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedCards',
                message: en ? chalk.cyan('Select two pairs to discard:') : chalk.cyan('Selectionnez deux pairs a defausser:'),
                choices: dirtyHand,
                validate: validatePairSelection
            }
        ]).then(handlePairSelection);
    }

    const validatePairSelection = (input) => {
        if (input.length !== 2 || input[0].split(" ")[0] !== input[1].split(" ")[0]) {
            return en ? chalk.red('Please select a pair.') : chalk.red('Veuillez selectionner une pair.');
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
            en ? console.log(chalk.yellow(`You have ${pairsRemaining.length / 2} pairs remaining.`)) : console.log(chalk.yellow(`Il vous reste ${pairsRemaining.length / 2 } pairs.`));
            promptPairSelection();
        } else {
            en ? console.log(chalk.green("No pairs left.")) : console.log(chalk.green("Plus de pairs."));
        }
    };


    dirtyComputerHand = filterHand(dirtyComputerHand);

    const removedCards = computerHand.length - dirtyComputerHand.length;
    console.log(en ? chalk.yellow(`\nComputer has removed ${removedCards / 2} pairs from his hand, it remains ${dirtyComputerHand.length} cards.`) : chalk.yellow(`\nL'ordinateur a defausse ${removedCards / 2} de sa main, il lui reste ${dirtyComputerHand.length} cartes.`));
    console.log(computerHand + '\n' + dirtyComputerHand);

    promptPairSelection();
};



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

(async () => {
    const selectedLanguage = await selectPromise;
    const oldMaid = new OldMaid(selectedLanguage);
    // Pass both player's and computer's hands to discardPairs function
    discardPairs(oldMaid.hands[0], oldMaid.hands[1], selectedLanguage);
})();

