// refactored part one to functions
// turn to BigInt

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
// Math cannot handle BigInt

// We do not need this anymore now we have a better relax function
// Leave it because I learned something new today
const NUMBER_TYPE = BigInt;

const run = (input, rounds) => {
    const monkeys = seperateMonkeys(input),
        doRelax = makeDoRelax(monkeys);

    runMonkeyBussiness(monkeys, rounds, doRelax);

    return monkeys;
}

const debug = (input, rounds) => {
    const monkeys = run(input, rounds);
    console.log(`== After round ${rounds} ==`);
    monkeys.map((m, i) => console.log(`Monkey ${i} inspected items ${m.inspections} times.`));

    const mb = [...monkeys].sort((m1, m2) => m1.inspections - m2.inspections).slice(-2).reduce((c, m) => c * m.inspections, 1);
    console.log(`Monkey Business: ${mb}`);

    return monkeys;
}

// rewrite relax function
const makeDoRelax = (monkeys) => {

    // At some point you will have repetition
    // If max division is reached the same pattern will repeat

    const maxDivider = monkeys.reduce((d, m) => d * m.divider, NUMBER_TYPE(1));
    const doRelax = item => item % maxDivider;

    return doRelax;
}

// Show inspections after x // debug
debug(input, 1);
debug(input, 20);
debug(input, 1000);
debug(input, 2000);
debug(input, 3000);
debug(input, 6000);
debug(input, 7000);
debug(input, 8000);
debug(input, 10000);

// Find 2 most active monkeys and calculate monkey business
run(input, 10000, 1).sort((m1, m2) => m1.inspections - m2.inspections).slice(-2).reduce((c, m) => c * m.inspections, 1);
