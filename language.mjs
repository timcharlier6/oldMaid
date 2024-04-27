import chalk from "chalk";
import select from "cli-select";

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

