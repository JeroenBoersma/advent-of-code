
const gridWithOneMaze = (grid, path) => [...grid].map(l => 
        [...l].map(e => 
            (path.indexOf(e) > -1 ? e : {...e, "shape": ".", "neighbors": []})
        )
    ),
    countInsides = (grid, path) => {
        let holeSize = 0;

        // if we go right all the time, the everything on the right can be an inside
        grid.forEach(l => {
            let onPipe = false, onPipeState = 0, inside = false
            l.forEach(e => {
                onPipe = e.shape !== '.';
                if (onPipe && onPipeState < 1) {
                    onPipeState = 1;
                } else if (onPipe && e.shape === '-') {
                    onPipeState++;
                } else if (!onPipe) {
                    onPipeState = 0;
                }

                console.log(e, onPipe, onPipeState)

                if (!onPipe && onPipeState === 0) {
                    // hop over pipe changes state
                    inside = !inside;

                    if (inside) {
                        // e.shape = 'I';
                    }
                }

                inside && (holeSize++) && (onPipeState = 0);
            })
        });

        return holeSize;
    }
    ;

const path = createPath(start, start),
    grid2 = gridWithOneMaze(grid, path),
    sum2 = countInsides(grid2, path);
