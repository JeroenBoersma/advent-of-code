
const solveGhostMaze = (instructions, maze, start, finish, allowed) => {
        
        const max = instructions.length,
            begin = Object.keys(maze).filter(e => e.match(start)),
            end = Object.keys(maze).filter(e => e.match(finish));

        const gcd = (a, b) => (a ? gcd(b % a, a) : b);

        let steps = 0,
            current = begin,
            mazes = current.length,
            direction;

        const finished = [];
        

        while (true) {
            direction = instructions[steps % max];

            // we did a step
            steps++;

            // next step in all mazes
            current = current.map(current => {
                const next = maze[current][direction];

                if (end.indexOf(next) > -1 && finished.indexOf(steps) === -1) {
                    finished.push(steps);
                }

                return next;
            });

            // if all are finished
            if (mazes <= finished.length) {
                // done
                break;
            }

            if (allowed-- < 0) {
                // circuit breaker
                return -1;
            }
        }

        return finished.reduce((c, b) => (c * b) / gcd(c, b), 1);
    };

const sum2 = solveGhostMaze(instructions, maze, /A$/, /Z$/, Infinity);