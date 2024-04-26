import inquirer from 'inquirer';

const interactivePairSelection = (hand) => {
    let remainingHand = [...hand];

    const promptPairSelection = () => {
        inquirer
            .prompt([
                {
                    type: 'checkbox',
                    name: 'selectedCards',
                    message: 'Select two pairs:',
                    choices: remainingHand,
                    validate: validatePairSelection
                }
            ])
            .then(handlePairSelection);
    }

    const validatePairSelection = (input) => {
        if (input.length !== 2 || input[0].split(" ")[0] !== input[1].split(" ")[0]) {
            return 'Please select a pair.';
        }
        return true;
    };

    const handlePairSelection = (answers) => {
        const [firstCard, secondCard] = answers.selectedCards;
        const indexFirstCard = remainingHand.indexOf(firstCard);
        const indexSecondCard = remainingHand.indexOf(secondCard);

        if (indexFirstCard !== -1 && indexSecondCard !== -1) {
            remainingHand.splice(indexFirstCard, 1);
            remainingHand.splice(indexSecondCard - 1, 1);
        }

        const pairsRemaining = findPairs(remainingHand);

        if (pairsRemaining.length > 0) {
            console.log(`There are ${pairsRemaining.length / 2} pairs remaining.`);
            promptPairSelection();
        } else {
            console.log("No pairs left.");
        }
    };

    const findPairs = (hand) => {
        const pairs = [];
        hand.forEach((card, index) => {
            const cardValue = card.split(' ')[0];
            const pairIndex = hand.findIndex((otherCard, otherIndex) => {
                return index !== otherIndex && otherCard.split(' ')[0] === cardValue;
            });
            if (pairIndex !== -1) {
                pairs.push(index, pairIndex);
            }
        });
        return pairs;
    };

    promptPairSelection();
};

const hand = [
    '2 of Hearts', '2 of Spades', '3 of Spades', '3 of Hearts', '3 of Clubs', '4 of Diamonds',
    '5 of Spades', '5 of Hearts', '6 of Hearts', '6 of Diamonds', '6 of Spades', '6 of Clubs',
    '7 of Clubs', '7 of Spades', '7 of Diamonds', '8 of Diamonds', '8 of Clubs', '9 of Diamonds',
    '9 of Hearts', '10 of Clubs', '10 of Spades', 'Jack of Hearts', 'Queen of Spades',
    'Queen of Diamonds', 'King of Diamonds', 'King of Club'
];

interactivePairSelection(hand);

