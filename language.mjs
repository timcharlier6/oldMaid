import select from "cli-select";

import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




// ASCII art spelling out "OLD MAID"
const oldMaid = `
  OOO   L       DDD      M   M  AAAA III  DDD
 O   O  L       D  D     MM MM  A  A  I   D  D
 O   O  L       D   D    M M M  AAAA  I   D   D
 O   O  L       D  D     M   M  A  A  I   D  D
  OOO   LLLLL   DDD      M   M  A  A III  DDD
`;
function funkyBorder(text) {
    const border = chalk.yellow('\t♫♫♪♫♪♫♪♫♪♪♫♪♫♫♪♫♪♫♪♫♪♫♪♫♪♫♪♫♪');
    const formattedText = chalk.bold.white(text);
    return `${border}\n${formattedText}\n${border}\n`;
}
console.log(funkyBorder(chalk.magentaBright("\n\t\tWelcome user!\n")));
console.log(chalk.bold.green(oldMaid));
console.log(chalk.bold.cyan("\n\tPlease choose a language:\n"));

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

export default selectPromise;
