const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const createEngineSchema = (rows) => {
    
    // create a x,y grid
    const grid = rows.map(row => row.split('')),
        numbers = [],
        createNumber = (x, y) => ({
            'number': 0,
            'valid': false,
            'chars': [],
            'position': {
                'x': x,
                'y': y,
                'w': 0,
                'h': 1
            }
        });

    let number = null;
    grid.forEach((row, y) => row.forEach((n, x) => {
        // only look at the numbers
        if (isNaN(n)) {
            if (number) {
                numbers.push(number);
                number = null;
            }
            return;
        }
        number = number ?? createNumber(x, y);

        // calculate number
        number.number = number.number * 10 + parseInt(n);
        number.position.w++;

        // validate
        [ // x,y around
            [x + -1, y + -1],
            [x +  0, y + -1],
            [x +  1, y + -1],
            [x + -1, y +  0],
            [x +  1, y +  0],
            [x + -1, y +  1],
            [x +  0, y +  1],
            [x +  1, y +  1],
        ].forEach(([x, y]) => {
            if (! grid[x] || !grid[x][y]) {
                return;
            }

            grid[y][x].match(/^[^\d\.]$/) && number.chars.push({
                'x': x,
                'y': y,
                'g': grid[y][x]
            })
        });

        number.valid = number.chars.length > 0;
    }));

    
    return numbers;
}

const engine = createEngineSchema(input),
    sum = engine.filter(n => n.valid).reduce((c, n) => c + n.number, 0);