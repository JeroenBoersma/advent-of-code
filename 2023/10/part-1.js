const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const directions = {
        "S": [ // start can go any direction
            {"x": 0, "y": 1},
            {"x": -1, "y": 0},
            {"x": 0, "y": -1},
            {"x": 1, "y": 0},
        ],
        "F": [ // bottom to right
            {"x": 1, "y": 0},
            {"x": 0, "y": 1},
        ], 
        "L": [ // top to right
            {"x": 1, "y": 0},
            {"x": 0, "y": -1},
        ], 
        "7": [ // bottom to left
            {"x": -1, "y": 0},
            {"x": 0, "y": 1},
        ], 
        "J": [ // top to left
            {"x": -1, "y": 0},
            {"x": 0, "y": -1},
        ],
        "|": [ // top to bottom
            {"x": 0, "y": 1},
            {"x": 0, "y": -1},
        ],
        "-": [ // left to right
            {"x": 1, "y": 0},
            {"x": -1, "y": 0},
        ],
        ".": [] // dead end
    },
    allowed = Object.keys(directions),
    createGrid = input => input.map(
        // create a basic object
        (l, y) => l.split('').map((c, x) => ({"shape": allowed.indexOf(c) > -1 ? c : '.', "x": x, "y": y, "neighbors": []}))
    ).map(
        // add all possible neighbors
        (l, y, grid) => l.map(e => {
                e.neighbors = directions[e.shape].map(c => (grid[c.y + e.y] ?? [])[c.x+e.x] ?? null)
                    .filter(n => n && n.shape !== '.');

                return e;
            } 
        )
    ),
    cleanGrid = grid => {

        const isDeadEnd = element => {
            if (element.shape === '.') {
                return true;
            }

            if (element.neighbors.length < 2) {
                element.neighbors = []; // update to not fall twice for this dead end

                // should at least have 2 connections
                return true;
            }

            // check if connected both ways
            element.neighbors = element.neighbors.filter(neighbor => neighbor.neighbors.indexOf(element) > -1);

            if (element.neighbors.length < 2) {
                element.neighbors = []; // update to not fall twice for this dead end
                
                // not connected somewhere
                return true;    
            }

            // valid link
            return false;
        };
        
        let numCleaned = 0;
        while (true) {

            numCleaned = 0;

            grid.forEach(l => l.forEach(e => {
                if (e.shape === '.') {
                    // is already a dead end
                    return;
                }

                if (isDeadEnd(e)) {
                    e.shape = '.';
                    numCleaned++;
                }
            }));

            if (numCleaned < 1) {
                break;
            }
        }

        return grid;
    },
    printGrid = grid => grid.map(l => console.log(l.map(e => e.shape).join(''))),
    findStart = grid => grid.map(l => l.filter(e => e.shape === 'S')).filter(l => l.length)[0][0],
    createPath = (start, end) => {
        const path = [];

        let current = start.neighbors[0]; // go one direction

        while (true) {
            // console.log(current);

            if (current === end) {
                //  break on end, you reached your destination
                break;
            }

            // if you go back - exit - circuit braker
            if (!current || path.indexOf(current) > -1) {
                return -1;
            }
            path.push(current); // only once

            // find next one
            current = current.neighbors.filter(n => path.indexOf(n) < 0)[0];
        }

        path.unshift(start);
        return path;
    },
    solveMaze = (start, end) => createPath(start, end).length;

const grid = cleanGrid(createGrid(input)),
    start = findStart(grid),
    size = solveMaze(start, start),
    sum = size / 2;

printGrid(grid);