
// add a floor to the grid

const addAFloorToTheGrid = grid => {

    const size = grid.size,
        items = grid.items,

        floorY = size.maxY + 2,
        height = floorY - size.minY;

    // It can never get wider than maxY - minY in both directions
    size.maxY = floorY;

    size.minX -= height;
    size.maxX += height;

    // Add floor
    for (let x = size.minX; x < size.maxX; x++) {
        const item = getItem(items, x, floorY - 1);
        item.char = '#';
        item.rock = true;
    }

    return grid;
};

addAFloorToTheGrid(grid);

pourSand(grid, 500, 0);
plotGrid(grid);

[...Object.values(grid.items)].map(row => [...Object.values(row)].filter(item => item.sand)).filter(row => row.length).reduce((c, r) => c + r.length, 0)
