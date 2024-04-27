import chalk from "chalk";
import inquirer from 'inquirer';
import countPairs from "./countPairs.js";
import filterHand from "./filterHand.mjs";

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

export default discardPairs;
