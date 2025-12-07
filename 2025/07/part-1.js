const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

let start = [];

const grid = input.map((l, y) => l.split('').map((c, x) => {
                        if (c === 'S') {
                            start = [y, x];
                        }
                        return c;
                    }))
                    .filter((r, y) => y % 2 === 0),
      splitter = (y, x, useDedup = true) => {

        const dedup = {};

        const worker = (y, x) => {
            let total = 0;

            if (x < 0) {
                return 0;
            } else if (x >= grid[0].length) {
                return 0;
            }

            while (++y && y < grid.length) {
                if (grid[y][x] === '^') {
                    if (useDedup && dedup[y] && dedup[y][x] !== undefined) {
                        // already processed

                        !useDedup && (total += dedup[y][x]);
                        break;
                    }

                    dedup[y] = dedup[y] || {};
                    dedup[y][x] = dedup[y][x] || (worker(y, x - 1) + worker(y, x + 1));

                    total++;

                    total += dedup[y][x];
                    break;
                }
            }

            return total;
        }


        return worker(y, x);
      };


console.log(splitter(start[0], start[1]))