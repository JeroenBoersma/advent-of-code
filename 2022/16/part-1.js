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

const calculateRoutePotential = (valves, currentName, ignore, steps) => {
        const current = valves[currentName];

        if (steps < 1) {
            return 0;
        }

        ignore = ignore || [];

        let rate = 0;
        if (ignore.indexOf(currentName) === -1) {
            rate = current.rate;
            ignore.push(currentName);
        }


        const score = current.tunnelsTo
            .filter(name => ignore.indexOf(name) === -1)
            .reduce((c, name) => c + calculateRoutePotential(valves, name, [...ignore]), 0, steps - 1);

        return rate + (score / 2);
    },

    solveCave = (valves, currentName, maxTime, state, path) => {

    state = state || {
        "flow": 0,
        "total": 0,
        "time": 0,
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

    const open = Object.keys(state.open);

    // emulate some logging
    console.log(`== Minute ${state.time} ==`);
    if (state.flow < 1) {
        console.log(`No valves are open.`);
    } else {
        console.log(`Valves ${open.join(', ')} are open, releasing ${state.flow} pressure.`);
    }

    if (state.left <= 0) {
        // times up
        return state;
    }

    path.push(currentName);

    const potentials = current.tunnelsTo.map(t => ({"name": t, "score": calculateRoutePotential(valves, t, [...path, ...open], state.left)}))
        .sort((a, b) => a.score > b.score ? -1 : (a.score < b.score ? 1 : 0));

    // open valve asap
    if (current.rate > potentials[0].score && ! state.open[current.name]) {
        state.flow += current.rate; // the flow can be updated
        state.open[current.name] = state.time; // register when the valve was opened

        console.log(`You open valve ${currentName}.`);

        // counts towards 1 minute to open a valve
        return solveCave(valves, currentName, maxTime, state, [...path]);
    } 

    // move around
    potentials.forEach(potential => {
        const tunnel = potential.name;

        if (state.left <= 0) {
            // time's up
            return;
        }

        // if (path.indexOf(tunnel) !== -1) {
        //     // already visited
        //     return;
        // }

        console.log(`You move to valve ${tunnel}.`);
        solveCave(valves, tunnel, maxTime, state, [...path]);
    });

    // go back
    return state;//solveCave(valves, path[path.length - 1], maxTime, state, [...path]);
};

// START PROGRAMM

const valves = createValves(input);

const MAX_TIME = 30;

solveCave(valves, 'AA', MAX_TIME);