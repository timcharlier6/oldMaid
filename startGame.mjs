import chalk from "chalk";
import inquirer from 'inquirer';

let startGame = (hands, isEnglish) => {
    let en = isEnglish;
    let playerHand = hands.playerHand;
    let computerHand = hands.computerHand;

    const promptPlayer = () => {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'playerInput',
                message: chalk.cyan(en ? '\nPress Enter to pick a random card from your opponent\'s hand:\n' : '\nAppuyez sur Entrée pour choisir une carte au hasard dans la main de votre adversaire :\n'),
            }
        ]);
    };

    const promptComputer = () => {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'computerInput',
                message: chalk.cyan(en ? '\nPress Enter to let the computer draw a random card from your hand:\n' : '\nAppuyez sur Entrée pour laisser l\'ordinateur tirer une carte au hasard dans votre main :\n'),
            }
        ]);
    };

    const removeComputerPair = (hand) => {
        let i = 0;
        while (i < hand.length - 1) {
            let j = i + 1;
            while (j < hand.length) {
                if (hand[i].split(" ")[0] === hand[j].split(" ")[0]) {
                    // Remove the pair
                    console.log(chalk.red(en ? 'Computer removed two cards from his hand.' : 'L\'ordinateur a retire deux cartes de sa main.'));
                    hand.splice(j, 1);
                    hand.splice(i, 1);
                    i = 0; // Reset i to check for new pairs
                    break; // Exit inner loop after removing a pair
                }
                j++;
            }
            if (j === hand.length) {
                // No pair found at current i, move to the next element
                i++;
            }
        }
        return hand;
    };

    const removePlayerPair = (hand) => {
        let i = 0;
        while (i < hand.length - 1) {
            let j = i + 1;
            while (j < hand.length) {
                if (hand[i].split(" ")[0] === hand[j].split(" ")[0]) {
                    // Remove the pair
                    console.log(en ? chalk.green(`Removing ${hand[j]} and ${hand[i]}`) : chalk.green(`Vous vous debarassez de ${hand[i]} et ${hand[j]}`));
                    hand.splice(j, 1);
                    hand.splice(i, 1);
                    i = 0; // Reset i to check for new pairs
                    break; // Exit inner loop after removing a pair
                }
                j++;
            }
            if (j === hand.length) {
                // No pair found at current i, move to the next element
                i++;
            }
        }
        return hand;
    };

    const pickRandomCard = () => {
        const randomIndex = Math.floor(Math.random() * computerHand.length);
        let newCard = computerHand.splice(randomIndex, 1)[0];
        playerHand.push(newCard);
        console.log(en ? chalk.magenta(`\nYou took ${newCard}.\n`) : chalk.magenta(`\nVous avez pris ${newCard}\n`));
        playerHand = removePlayerPair(playerHand);
        console.log(chalk.yellow(en ? `\nYou have ${playerHand.length} cards in your hand.` : `\nVous avez ${playerHand.length} cartes dans votre main.`));
        console.log(chalk.yellow(en ? `Computer has ${computerHand.length} cards.\n` : `\nL\'ordinateur a ${computerHand.length} cartes.\n`));
    };

    const computerDrawCard = () => {
        const randomIndex = Math.floor(Math.random() * playerHand.length);
        let cardWithdraw = playerHand.splice(randomIndex, 1)[0];
        computerHand.push(cardWithdraw);
        console.log(en ? chalk.blue(`\nComputer took ${cardWithdraw} from your hand.\n`) : chalk.blue(`\nL\'ordinateur a pris ${cardWithdraw} de votre main.\n`));
        computerHand = removeComputerPair(computerHand);
        console.log(chalk.yellow(en ? `\nComputer's hand has ${computerHand.length} cards.\n` : `\nLa main de l'ordinateur a ${computerHand.length} cartes.\n`));
        console.log(chalk.yellow(en ? `\nYou have ${playerHand.length} cards in your hand.` : `\nVous avez ${playerHand.length} cartes dans votre main.`));
    };

    const playRound = async () => {
        console.log(chalk.cyan(en ? '\nYou\'re hand:\n' : '\nVotre main\n'));
        console.log(chalk.cyan(playerHand));
        console.log(" ");
        await promptPlayer();
        if (computerHand.length === 0 || playerHand === 0) {
            gameOver();
            return;
        }
        pickRandomCard();
        await promptComputer();
        if (computerHand.length === 0 || playerHand === 0) {
            gameOver();
            return;
        }
        computerDrawCard();
    };

    const gameOver = () => {
        console.log(chalk.red('Game Over!'));
        if (playerHand.length === 0) {
            console.log(chalk.green('\tYou Win!'));
            console.log(chalk.bold(en ? `\t\tComputer has the ${computerHand[0]}` : `\t\tL'ordinateur a la ${computerHand[0]}\n\n`));
        } else if (computerHand.length === 0) {
            console.log(chalk.red('\tYou Lose!'));
            console.log(chalk.bold(en ? `\t\tYou have the ${playerHand[0]}` : `\t\tVous avez la ${playerHand[0]}\n\n`));
        } else {
            console.log('error');
        }
    };

    const startGameLoop = async () => {
        console.log(en ? chalk.cyan('\n╭────────────────────────────────────────────────────────╮\n│ You should pick random cards from opponent\'s hand          │\n╰────────────────────────────────────────────────────────╯\n') : chalk.cyan('\n╭────────────────────────────────────────────────────────────╮\n│ Vous devez choisir des cartes au hasard dans la main de votre │\n│ adversaire                                                    │\n╰────────────────────────────────────────────────────────────╯\n'));


        while (playerHand.length > 0 || computerHand.length > 0) {
            await playRound();
        }
        gameOver();
    };

    startGameLoop();
};

export default startGame;

