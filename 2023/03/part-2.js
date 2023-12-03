
const groupByGears = engine => {
    const gears = [], 
        createGear = (x, y, c) => ({
            'x': x,
            'y': y,
            'c': c,
            'numbers': []
        }),
        findOrCreateGear = (x, y, c) => {
            const gear = gears.filter(gear => gear.x === x && gear.y === y)

            if (gear.length) {
                return gear[0];
            }

            const newGear = createGear(x, y, c);
            gears.push(newGear);

            return newGear;
        };

    engine.forEach(number => number.chars.forEach(({x: x, y: y, c: c}) => {
        const gear = findOrCreateGear(x, y, c);

        // check if number already exists or add
        gear.numbers.filter(n => n === number).length ||
            gear.numbers.push(number);
    }));
    
    return gears;
}

const gears = groupByGears(engine),
    sum2 = gears.filter(gear => gear.c === '*' && gear.numbers.length === 2)
        .reduce((t, gear) => gear.numbers.reduce((t, number) => t * number.number, 1) + t, 0);