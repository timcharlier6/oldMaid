import chalk from "chalk";
import inquirer from 'inquirer';
import countPairs from "./countPairs.js";
import filterHand from "./filterHand.mjs";
import startGame from "./startGame.mjs";

const discardPairs = (playerHand, computerHand, language) => {
    let en = language === 'English';
    let dirtyHand = [...playerHand];
    let dirtyComputerHand = [...computerHand];

    console.log(en ? chalk.cyan('\n╭─────────────────────────────────────╮\n│ You should remove all your pairs... │\n╰─────────────────────────────────────╯\n') : chalk.cyan('\n╭─────────────────────────────────────────╮\n│ Vous devez enlevez toutes vos paires... │\n╰─────────────────────────────────────────╯\n'));
    let filteredComputerHand = filterHand(dirtyComputerHand);
    const removedCards = computerHand.length - filteredComputerHand.length;
    console.log(en ? chalk.blue(`\nComputer has removed ${removedCards / 2} pairs from his hand, he has ${filteredComputerHand.length} cards.\n`) : chalk.blue(`\nL'ordinateur a defausse ${removedCards / 2} cartes de sa main, il lui reste ${filteredComputerHand.length} cartes.\n`));
    //console.log(computerHand + '\n' + filteredComputerHand);

    const promptPairSelection = () => {
        inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedCards',
                message: en ? chalk.cyan('Select a pair or a sqare to discard:') : chalk.cyan('Selectionnez une pair ou un carre a defausser:'),
                choices: dirtyHand,
                validate: validatePairSelection
            }
        ]).then(handlePairSelection);
    }

    const validatePairSelection = (input) => {
        let valid = input.length === 2 && input[0].split(" ")[0] === input[1].split(" ")[0] || input.length === 4 && input[0].split(" ")[0] === input[1].split(" ")[0] && input[1].split(" ")[0] === input[2].split(" ")[0] && input[2].split(" ")[0] === input[3].split(" ")[0] ;
            if (!valid) {
            return en ? chalk.red('Please select pairs!') : chalk.red('Veuillez selectionner des pairs!');
        } else {
            return true;
        }
    };

    const handlePairSelection = (answers) => {
        let remainingChoices;
        if (answers.selectedCards.length === 2) {
            const [firstCard, secondCard] = answers.selectedCards;
            remainingChoices = dirtyHand.filter(card => card !== firstCard && card !== secondCard);
        } else if (answers.selectedCards.length === 4) {
            const [firstCard, secondCard, thirdCard, fourthCard] = answers.selectedCards;
            remainingChoices = dirtyHand.filter(card => card !== firstCard && card !== secondCard && card !== thirdCard && card !== fourthCard);
        }

        dirtyHand = [...remainingChoices];

        const pairsRemaining = countPairs(dirtyHand);

        if (pairsRemaining.length > 0) {
            en ? console.log(chalk.yellow(`You have ${pairsRemaining.length / 2} pairs remaining.`)) : console.log(chalk.yellow(`Il vous reste ${pairsRemaining.length / 2 } pairs.`));
            promptPairSelection();
        } else {
            en ? console.log(chalk.green("No pairs left. Starting game...")) : console.log(chalk.green("Plus de pairs. Debut du jeu..."));
            let filteredHands = { playerHand: dirtyHand, computerHand: filteredComputerHand };
            startGame(filteredHands, en);
        }
    };

    promptPairSelection();
};

export default discardPairs;
