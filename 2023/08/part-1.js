const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const createInstructions = input => input[0].split(''),
    createMaze = input => {
        const elements = [...input];
        
        // remove first instruction
        elements.shift();

        const maze = {};
        
        elements.map(element => element.split(' = '))
            .map(element => {
                const match = element[1].match(/^\(([^,]+), ([^,]+)\)$/)
                element[1] = {
                    "L": match[1],
                    "R": match[2]
                };
                return element;
            })
            .forEach(element => maze[element[0]] = element[1]);
        

        
        return maze;
    },
    solveMaze = (instructions, maze, start, finish, allowed) => {
        

        const max = instructions.length;

        let steps = 0,
            current = start,
            direction;

        while (true) {
            direction = instructions[steps % max];

            // we did a step
            steps++;

            // next step
            current = maze[current][direction];

            if (current === finish) {
                // done
                break;
            }

            if (allowed-- < 0) {
                // circuit breaker
                return -1;
            }
        }


        return steps;
    };

const instructions = createInstructions(input),
    maze = createMaze(input),
    sum = solveMaze(instructions, maze, 'AAA', 'ZZZ', 10000000);