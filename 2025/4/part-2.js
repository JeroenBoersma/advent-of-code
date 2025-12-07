

const manyCalculations = (grid) => {
        let result = 0, s = 1000;
        while (s-- > 0) {
            let rolls = findRolls(grid),
                n = countRolls(rolls);

            if (n < 1) break;

            rolls.map((r, y) => r.map((c, x) => c === 1 && (grid[y][x] = '*')));

            result += n;
        }    

        return result;
    }



console.log(manyCalculations(grid));