input = document.body.firstChild.innerText.split('\n\n').filter(l => l.length);

const NUMBER_TYPE = Number;

// Create operation builder
const makeOperation = (() => {

    const   old_times   = old => old * old,
            old_plus    = old => old + old,
            times       = p => old => old * p,
            plus        = p => old => old + p;

    return (input) => {
        const instruction = input.match(/^(.+)\s+([\+\*])\s+(.+)/),
                operation = instruction[2],
                part1 = instruction[1],
                part2 = instruction[3];

        if (part1 === 'old' && part1 === part2) {
            return operation === '+' ? old_plus : old_times
        }

        return operation === '+' ? plus(NUMBER_TYPE(part2)) : times(NUMBER_TYPE(part2));
    };
})();

// seperate monkeys
const seperateMonkeys = (input) => {
    const NUMBER_SYMBOL = typeof NUMBER_TYPE(1) === 'bigint' ? 'BigInt': 'Number';
    return input.map((i, m) => {
        const monkey = {
                'items': [],
                'operation': () => 1,
                'divider': 1,
                'rules': [],
                'inspections': 0
            },
            data = i.split('\n');

        // get items and set initial woried score
        monkey.items = data[1].split(': ')[1].split(/,\s+/).map(w => NUMBER_TYPE(w));

        // make a valid operator
        const operation = data[2].split(': new = ')[1];
        // First run I used a eval function //
        //monkey.operation = Function('old', 'return ' + operation.replace(/(\d+)/, m => NUMBER_SYMBOL + '(' + m + ')') + '');
        monkey.operation = makeOperation(operation);

        // test
        monkey.divider = NUMBER_TYPE(data[3].match(/\d+$/)[0]);

        // next monkey
        monkey.rules = [4,5].map(r => parseInt(data[r].match(/\d+$/)[0]))

        return monkey;
    });
};

const runMonkeyBussiness = (monkeys, rounds, doRelax) => {
    // Create a zero, everything to optimize performance
    const zero = NUMBER_TYPE(0);

    for (let r = 0, nextMonkey; r < rounds; r++)
        monkeys.forEach(monkey => {
            monkey.items.forEach(item => {
                // Oh, that monkey again
                monkey.inspections++;

                // go crazy and relax a little
                item = doRelax(monkey.operation(item));

                // throw to right monkey
                nextMonkey = item % monkey.divider === zero ?  monkey.rules[0] : monkey.rules[1];
                monkeys[nextMonkey].items.push(item);
            });

            // Empty items
            monkey.items = [];
        });
}

monkeys = seperateMonkeys(input);
runMonkeyBussiness(monkeys, 20, item => NUMBER_TYPE(Math.floor(Number(item) / 3)));

// Find 2 most active monkeys and calculate monkey business
monkeys.sort((m1, m2) => m1.inspections - m2.inspections).slice(-2).reduce((c, m) => c * m.inspections, 1);
