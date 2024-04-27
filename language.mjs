import select from "cli-select";
import readline from 'readline';
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

export default selectPromise;
