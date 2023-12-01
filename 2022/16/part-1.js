input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const createValves = input => {
    const valves = {};

    input.map(row => {
        const line = row.match(/Valve ([A-Z]{2}) has flow rate=(\d+); tunnels* leads* to valves* (.+)$/);

        const name = line[1],
            rate = parseInt(line[2]),
            tunnelsTo = line[3].split(', ');

        valves[name] = {
            "name": name,
            "rate": rate,
            "tunnelsTo": tunnelsTo
        }
    });

    return valves;
};

const solveCave = (valves, currentName, maxTime, state, path) => {

    state = state || {
        "flow": 0,
        "total": 0,
        "time": 1,
        "left": maxTime,
        "open": {},
        "visited": {},
        "history": []
    };

    path = path || [];

    const current = valves[currentName];

    // Update stats
    state.visited[current.name] = true;
    state.history.push(current.name + ' => ' + state.flow);

    state.time++;
    state.left--;
    state.total += state.flow;

    if (state.left <= 0) {
        // times up
        return state;
    }

    // open valve
    if (current.rate > 0 && ! state.open[current.name]) {
        state.flow += current.rate;
        state.open[current.name] = true;

        return solveCave(valves, currentName, maxTime, state, path);
    }

    path.push(currentName);

    // move
    current.tunnelsTo.map(tunnel => {
        if (path.indexOf(tunnel) !== -1 && tunnel !== path[0]) {
            // already visited
            return;
        }

        if (state.left <= 0) {
            return;
        }

        solveCave(valves, tunnel, maxTime, state, [...path]);
    });

    return state;
};

// START PROGRAMM

const valves = createValves(input);

const MAX_TIME = 30;

solveCave(valves, 'AA', MAX_TIME);