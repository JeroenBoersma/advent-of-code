input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const initPaths = input => input.map(l => l.split(' -> ').map(c => c.split(',').map(i => parseInt(i))));

const initGrid = paths => {
    const size = {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0,
        },
        items = {},
        grid = {
            size: size,
            items: items
        },
        boundaries = (index, method, initial) => paths.reduce((carry, row) => method(carry, ...row.map(column => column[index])), initial);

    // find boundaries
    size.minX = boundaries(0, Math.min, Infinity);
    size.maxX = boundaries(0, Math.max, 0) + 1;

    size.minY = boundaries(1, Math.min, 0);
    size.maxY = boundaries(1, Math.max, 0) + 1;

    paths.map(path => {
        for (let index = 1; index < path.length; index++) {
            let last = path[index - 1],
                current = path[index],
                temp;

            // Always work low to high
            if (current[0] < last[0] || current[1] < last[1]) {
                temp = current;
                current = last;
                last = temp;
            }

            for (let y = last[1]; y <= current[1]; y++) {
                for (let x = last[0]; x <= current[0]; x++) {
                    const item = getItem(items, x, y);

                    // Set to rock
                    item.char = '#';
                    item.rock = true;
                }
            }
        }
    });

    return grid;
};

const createItem = (x, y) => ({
        pos: {
            x: x,
            y: y
        },
        char: '.',
        sand: false,
        rock: false,
        source: false
    }),
    setItem = (items, item) => {const row = items[item.pos.y] || {}; row[item.pos.x] = item; items[item.pos.y] = row; return item;},
    getItem = (items, x, y) => (items[y] ?? {})[x] ?? setItem(items, createItem(x, y));

const pourSand = (grid, startX, startY) => {

    const size = grid.size, items = grid.items;

    startX = startX ?? size.minX;
    startY = startY ?? Math.floor((size.maxY - size.minY) / 2);
    maxRuns = size.maxY - startY;

    // Init start
    const startItem = getItem(items, startX, startY);
    startItem.source = true;
    startItem.char = '+';

    const canPourSandOnItem = (item) => {
        if (item.rock || item.sand || item.source) {
            return false;
        }

        if (item.pos.x < size.minX - 1 || item.pos.x > size.maxX + 1) {
            return false;
        }

        return true;
    }

    /**
     * rules
     * - straight down (0,1)
     * - one down/left (-1,1)
     * - one down/right (1,1)
     */
    const nextItem = (current) => [
            {x: 0, y: 1},
            {x: -1, y: 1},
            {x: 1, y: 1}
        ].map(pos => getItem(items, current.pos.x + pos.x, current.pos.y + pos.y))
        .filter(item => canPourSandOnItem(item))
        .shift();

    let endless;
    do {
        endless = maxRuns;

        let current = startItem, item;
        while (endless-- > 0 && (item = nextItem(current))) {
            item.char = '~';

            current = item;
        }

        if (endless > 0) {
            current.char = 'o';
            current.sand = true;
        }

        if (current === startItem) {
            // Cannot pour more sand in my own eyes
            break;
        }

    } while (endless > 0);

    return grid;
};

const plotGrid = (grid) => {

    const plot = [],
        size = grid.size,
        maxYLength = (size.maxY + '').length,
        maxXLength = (size.maxX + '').length,
        items = grid.items;

    // add x number
    for (let xc = 0; xc < maxXLength; xc++) {
        // add header
        const header = [];

        // x,y of plot 0,0 == empty
        header.push(' '.repeat((size.maxY + '').length - 0 + 1));

        for (let x = size.minX, xd = ''; x < size.maxX; x++) {
            xd = ' '.repeat(maxXLength - (x + '').length) + x;
            header.push(xd[xc]);
        }

        plot.push(header.join(''));
    }

    for (let y = size.minY; y < size.maxY; y++) {
        const row = [];

        // add y number
        row.push(' '.repeat(maxYLength - (y + '').length) + y + ' ');

        for (let x = size.minX; x < size.maxX; x++) {
            row.push(((items[y] ?? [])[x] ?? {}).char || '.');
        }

        plot.push(row.join(''));
    }

    console.log(plot.join('\n'));
};


grid = initGrid(initPaths(input));

pourSand(grid, 500, 0);
plotGrid(grid);

// count sand
[...Object.values(grid.items)].map(row => [...Object.values(row)].filter(item => item.sand)).filter(row => row.length).reduce((c, r) => c + r.length, 0)