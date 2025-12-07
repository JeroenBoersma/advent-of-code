const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const grid = input.map(x => x.split('')),
    positions = [
        [-1, -1],
        [-1,  0],
        [-1,  1],
        
        [ 0, -1],
        [ 0,  1],

        [ 1, -1],
        [ 1,  0],
        [ 1,  1],
    ],

    around = (grid, y, x) => positions.reduce((c, [y1, x1]) => c + (grid[y + y1] && grid[y + y1][x + x1] === '@' ? 1 : 0), 0),

    findRolls = (grid) => grid.map((r, y) => r.map((c, x) => c !== '@' ? 0 : (around(grid, y, x) < 4 ? 1 : 0))),
    countRolls = (grid) => grid.reduce((s, r) => s + r.reduce((c, s) => c + s, 0), 0)

    calculate = (grid) => countRolls(findRolls(grid))


console.log(calculate(grid))

