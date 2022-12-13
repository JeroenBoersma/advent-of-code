input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// a typical 1^n problem
// Learned about "A* Search Algorithm" and others

const MAX_INCREASE = 1;

// Generate map with initial data
const createHeightMap = input => input.map(r => r.split(''))
    .map((l, y) => l.map((m, x) => ({
        'char':     m,          // visible value
        'start':    m === 'S',  // is start
        'end':      m === 'E',  // is end
        'height':   m === 'S' ? 0 : m === 'E' ? 26 : m.charCodeAt() % 97, // get height in measurable format
        'active':   true,       // tell if active
        'score':    {
            'g': Infinity, // from current
            'h': Infinity, // distance to goal
            'f': Infinity  // score g + h
        },
        'pos': {
            'x': x,
            'y': y
        },
        'tubes': [],
        'parent': null
    })));

// Get all marks around current point
const getMarksAround = (heightMap, mark) => {
    const pos = mark.pos,
        mX = pos.x,
        mY = pos.y;

    // x, y
    return [
        [1, 0],     // r
        [0, 1],     // d
        [-1, 0],    // l
        [0, -1],    // u
    ].map(nextPos => {
        const [x, y] = nextPos,
        nextMark = (heightMap[mY+y] ?? [])[mX+x] ?? null;

        return nextMark;
    }).filter(x => x && x.active);
}

// Check from current which max 4 (u,d,l,r) next are valid
const fillTubesOnMap = heightMap => {
    heightMap.flat().map(mark => {
        const height = mark.height;

        // Initialize empty tubes
        mark.tubes = [];

        if (mark.end) {
            // We will never go past end
            return mark;
        }

        // Get all items connected
        getMarksAround(heightMap, mark).map(nextMark => {
            const nextHeight = nextMark.height,
                diff = nextHeight - height;

            // Only go up
            if (diff > MAX_INCREASE) {
                return;
            }

            if (nextMark.start) {
                // We will never go back
                return;
            }

            // Possible route
            mark.tubes.push(nextMark);
        });

        return mark;
    });

    return heightMap;
}

// Get start, end
const getRouteStart = heightMap => heightMap.flat().filter(m => m.start)[0],
    getRouteEnd = heightMap => heightMap.flat().filter(m => m.end)[0],
    getAllHeightItems = (heightMap, height) => heightMap.flat().filter(m => m.active && m.height === height);

// method to follow next
const findRoutes = (mark, end, routes, visited) => {
    routes = routes || [];

    visited = visited || [];
    visited = [...visited]; // Don't create a reference

    // We don't wan't to go back
    // const next = mark.tubes.filter(n => n !== mark);

    // we also don't walk in circles
    if (visited.indexOf(mark) > -1) {
        return Infinity;
    }

    // push self to route
    visited.push(mark);

    // if finish \\ HOORAY
    if (mark === end) {
        // Add visited to routes
        routes.push([...visited]);

        // Only the finish will return true
        return visited.length;
    }

    // Count posible routes
    return Math.min(Infinity, ...mark.tubes.map(next => findRoutes(next, end, routes, visited)));
};

// Trying to find the whole route from S to E is a long way
// This will take too long to compute
// We need to come up with a solution to cleanup garbage

const cleanupHeightMap = (heightMap) => {
    const flatMap = heightMap.flat();

    /**
     * STEP ONE -- REMOVE ISLANDS
     */
    flatMap.map(mark => {
        const collectMarks = [],
            collect = next => {
                if (collectMarks.indexOf(next) > -1) {
                    return;
                }

                collectMarks.push(next);

                next.tubes.filter(m => m.height <= mark.height + MAX_INCREASE)
                    .map(m => collect(m));
            },
            isIsland = mark => collectMarks.filter(m => m.height !== mark.height).length < 1;

        if (!mark.active || mark.start || mark.end) {
            return;
        }

        // Collect items
        collect(mark);

        if (isIsland(mark)) {
            // disable while island and remove nexts
            collectMarks.map(m => {
                console.log(`ISLAND MARK: ${m.char}(${m.pos.x}, ${m.pos.y})`);

                // Remove link to this item
                getMarksAround(heightMap, m).map(a => a.tubes = a.tubes.filter(n => n !== m));

                m.active = false;
                m.tubes = [];
            });
        }
    });

    /**
     * STEP TWO -- CLEAN EDGES
     *
     * edges cleanup
     *
     * ...
     * .aa
     * .ab
     *
     * both x+1 and y+1 get to b
     * only one needs to stay
     */
    flatMap.map(mark => {
        let edges = [];
        mark.tubes.map(next => next.tubes.filter(e => {

            // allow two way pass
            if (mark === e) {
                return true;
            }

            // already exists
            if (edges.indexOf(e) > -1) {
                console.log(`EXISTING PATH: ${next.char}(${next.pos.x}, ${next.pos.y}) to ${e.char}(${e.pos.x}, ${e.pos.y}) from ${mark.char} (${mark.pos.x}, ${mark.pos.y})`)
                return false;
            }

            edges.push(e);

            return true;
        }));

        return mark;
    });

    /**
     * STEP TREE -- REMOVE RECURSIVE LINKS
     */
    let recursiveItems = [];
    while ((recursiveItems = flatMap.filter(mark => mark.active && !mark.end && mark.tubes.length === 1 && mark.tubes[0].tubes.filter(n => n === mark).length)).length > 0) {
        recursiveItems.map(mark => {
            mark.tubes[0].tubes = mark.tubes[0].tubes.filter(n => n !== mark);
            console.log(`RECURSION REMOVED: ${mark.char}(${mark.pos.x}, ${mark.pos.y})`);
        });
    }

    /**
     * STEP FOUR -- REMOVE END POINTS
     */
    let endMarks = [];
    while ((endMarks = flatMap.filter(mark => mark.active && !mark.end && mark.tubes.length === 1 && getMarksAround(heightMap, mark).length === 1)).length > 0) {
        endMarks.map(mark => {
            console.log(`END POINTS: ${mark.char}(${mark.pos.x}, ${mark.pos.y})`);

            mark.active = false;
            mark.tubes = [];
        });
    }

    /**
     * LAST STEP -- REMOVE DEAD ENDS
     *
     * All links to dead ends can be removed as next candidates
     * Till no dead ends are left
     */
    let deadEnds = [];
    while ((deadEnds = flatMap.filter(mark => mark.active && !mark.end && mark.tubes.length < 1)).length > 0) {
        deadEnds.map(mark => {
            // Remove all pointers to self
            getMarksAround(heightMap, mark).map(around => around.tubes = around.tubes.filter(next => next !== mark));

            console.log(`DEAD END: ${mark.char}(${mark.pos.x}, ${mark.pos.y}) disabled`);

            // disable item
            mark.active = false;
        });
        break;
    }

    // Move up the mountain fast
    flatMap.map(m => m.tubes.sort((a, b) => b.height - a.height));
};

const findShortestRoute = (start, end) => {
    let routes = [];

    // Search perfect routes
    findRoutes(start, end, routes);

    console.log(`ROUTES FOUND: ${routes.length} from ${start.char}(${start.pos.x}, ${start.pos.y}) to ${end.char}(${end.pos.x}, ${end.pos.y})`);

    return routes.sort((a, b) => a.length - b.length).shift()
};

const plotRoute = (heightMap, route) => {
    const grid = (new Array(heightMap.length)).fill(1)
        .map(l => (new Array(heightMap[0].length).fill('.')));

    if (route.length < 1) {
        heightMap.flat().filter(m => m.active).map(mark => {
            const pos = mark.pos,
                x = pos.x,
                y = pos.y;

            grid[y][x] = mark.char;
        });
    }

    route.map((r, i) => {
        const pos = r.pos,
            x = pos.x,
            y = pos.y,
            next = route[i+1];

        let char = r.char;

        if (! r.end && next) {

            const nextPos = next.pos,
                nextX = nextPos.x,
                nextY = nextPos.y;

            switch (true) {
                case nextX - x > 0:
                    char = '>';
                    break;
                case nextX - x < 0:
                    char = '<';
                    break;
                case nextY - y > 0:
                    char = 'v';
                    break;
                case nextY - y < 0:
                    char = '^';
                    break;
            }
        }

        grid[y][x] = char;
    });

    console.log(grid.map(l => l.join('')).join('\n'));
};

const heightMap = fillTubesOnMap(createHeightMap(input)),
    routeStart  = getRouteStart(heightMap),
    routeEnd    = getRouteEnd(heightMap);

// Remove garbage
cleanupHeightMap(heightMap);

// Find fastest route
fastestRoute = findShortestRoute(routeStart, routeEnd);

// plot fastest route
plotRoute(heightMap, fastestRoute || []);

// fastest route
fastestRoute.length - 1;

