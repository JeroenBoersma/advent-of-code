
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

    numbers.forEach(number => number.chars.forEach(({x: x, y: y, c: c}) => {
        const gear = findOrCreateGear(x, y, c);
        console.log(gear)
        gear.numbers.push(number);
    }));
    
    return gears;
}

const gears = groupByGears(engine)