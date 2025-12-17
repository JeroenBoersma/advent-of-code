const calculate2 = coords => {
        const sizes = [];

        for (let a = 0; a < coords.length - 1; a++) {
            for (let b = a + 1; b < coords.length; b++) {
                const current = coords[a], next = coords[b],
                    size = (Math.abs(current[0] - next[0]) + 1) * (Math.abs(current[1] - next[1]) + 1);

                // check if it fall within square outer bounds

                console.log(current, next, gridXY[current[0]], gridXY[next[0]])
                

                sizes.push(size);
            }
        }

        return sizes.sort((a, b) => a - b)
    },
    gridXY = coords.reduce((c, [x, y]) => {
        c[x] = c[x] || {}
        c[x][y] = true;
        return c;
    }, {}),
    gridYX = coords.reduce((c, [y, x]) => {
        c[x] = c[x] || []
        c[x][y] = true;
        return c;
    }, {}),
    validSquares = (grid) => {

        const valid = {};

        Object.keys(grid).map(l => {
            const i = Object.keys(grid[l]).map(i => parseInt(i)),
                min = Math.min(...i),
                max = Math.max(...i)

            valid[l] = {};
            
            for (let a = min; a <= max; a++) {
                valid[l][a] = true;
            }
        })

        return valid;
    },
    paint = (grid, valid) => {
        const maxX = Math.max(...Object.keys(grid)),
            maxY = Math.max(...Object.values(grid).map(l => Object.keys(l)).flatMap(a => a));

        let result = '';
        for (let y = 0; y <= maxY + 1; y++) {
            for (let x = 0; x <= maxX + 1; x++) {
                const char = (grid[x] && grid[x][y]) ? '#' : (valid[x] && valid[x][y] ? 'X' : '.');
                result += char;
            }
            result += '\n';
        }

        return result;
    }
    

console.log(paint(gridXY, validSquares(gridXY)))