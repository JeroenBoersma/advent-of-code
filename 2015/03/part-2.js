// they walk the same grid and but have different positions
// all even instructions goto santa, all un-even goto robot-santa

// create position, lame and easy
robotPos = {...pos};

// reset
grid = {0: {0: 2}};
pos.reset(); robotPos.reset();

// choose a parser and handle both
input.split('').map((v, i) => i % 2 === 0 ? parser(v, pos, grid) : parser(v, robotPos, grid));

// count grid
Object.keys(grid).reduce((s, y) => s + Object.keys(grid[y]).length, 0)