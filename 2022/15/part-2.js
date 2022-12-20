
const SEARCH_BOUNDARIES = {
    minX: 0,
    minY: 0,
    maxX: 4000000,
    maxY: 4000000,
};

// const SEARCH_BOUNDARIES = {
//     minX: 0,
//     minY: 0,
//     maxX: 20,
//     maxY: 20
// };

// Update boundaries
grid.boundaries.minX = Math.max(SEARCH_BOUNDARIES.minX, grid.boundaries.minX);
grid.boundaries.minY = Math.max(SEARCH_BOUNDARIES.minY, grid.boundaries.minY);
grid.boundaries.maxX = Math.min(SEARCH_BOUNDARIES.maxX, grid.boundaries.maxX);
grid.boundaries.maxY = Math.min(SEARCH_BOUNDARIES.maxY, grid.boundaries.maxY);

const candidates = []; // HEAT UP THAT MACHINE
const rowtotal = grid.boundaries.maxX - grid.boundaries.minX;
for (let y = grid.boundaries.minY; y < grid.boundaries.maxY; y++) {

    y % 10 === 0 && console.log(`CHECKING LINE ${y}`);
    const c = createCoverageReport(grid, sensors, y);

    // Check if current row is a candidate
    if (c.c !== rowtotal) {
        candidates.push([y, c]);
        break;
    }
    // delete non used row
    // delete grid.items[y];
}

// fillGrid(grid, sensors, beacons);

candidates.map(c => {
    // I had deleted the items line
    // createCoverageReport(grid, sensors, y);

    const y = c[0], row = c[1];
    for (let x = grid.boundaries.minX; x < grid.boundaries.maxX; x++) {
        const item = row[x] ?? null;
        if (null === item) {
            const tf = 4000000 * x + y;
            console.log(`YOUR DISTRESS BEACON IS HERE (${x}, ${y}) TF = ${tf}`);
        }
    }
});

