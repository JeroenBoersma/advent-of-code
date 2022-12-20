input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// Convert input to useable data
const inputToData = (input, sensors, beacons) => {
    input.map(l => {
        const m = [...l.matchAll(/((Sensor|beacon)\s+(is\s)?at)\s+(x=(\-?\d+),\s*(y=(\-?\d+)))/g)];

        const searchBeacon = (beacon, beacons) => beacons.filter(b => b.pos.x === beacon.pos.x && b.pos.y === beacon.pos.y)[0] ?? null;

        if (m[0][2] !== 'Sensor') {
            m[2] = m[0];
            m[0] = m[1];
            m[1] = m[2];
            delete m[2];
        }

        const sensor = {
                "type": "sensor",
                "pos": {
                    "x": parseInt(m[0][5]),
                    "y": parseInt(m[0][7]),
                },
                "beacon": null,
                "distance": Infinity
            },
            beacon = {
                "type": "beacon",
                "pos": {
                    "x": parseInt(m[1][5]),
                    "y": parseInt(m[1][7]),
                },
                "sensors": []
            };

        // If multiple items link to the same beacon, use the same data
        sensor.beacon = searchBeacon(beacon, beacons) ?? beacon;
        sensor.distance = getDistance(sensor, beacon);

        sensor.beacon.sensors.push(sensor);

        sensors.push(sensor);
        beacon.sensors.length && beacons.push(beacon);
    });
}

const getBoundaries = (sensors, beacons) => {
        let minX, maxX, minY, maxY;

        const findValue = (key, method, data, init) => method(init, ...data.map(i => i.pos[key]));

        // Lookup based on x / y for beacons and sensors
        minX = findValue('x', Math.min, beacons, findValue('x', Math.min, sensors, Infinity));
        maxX = findValue('x', Math.max, beacons, findValue('x', Math.max, sensors, minX));

        minY = findValue('y', Math.min, beacons, findValue('y', Math.min, sensors, Infinity));
        maxY = findValue('y', Math.max, beacons, findValue('y', Math.max, sensors, minY));

        // take in account distance
        minX = Math.min(minX, ...sensors.map(sensor => minX - Math.abs(sensor.pos.x - sensor.beacon.pos.x)));
        maxX = Math.max(maxX, ...sensors.map(sensor => maxX + Math.abs(sensor.pos.x - sensor.beacon.pos.x)));

        minY = Math.min(minY, ...sensors.map(sensor => minY - Math.abs(sensor.pos.y - sensor.beacon.pos.y)));
        maxY = Math.max(maxY, ...sensors.map(sensor => maxY + Math.abs(sensor.pos.y - sensor.beacon.pos.y)));

        return [minX, maxX, minY, maxY];
    },
    getDistance = (item1, item2) => {
        return Math.abs(item1.pos.x - item2.pos.x) + Math.abs(item1.pos.y - item2.pos.y);
    }

const fillGrid = (grid, sensors, beacons) => {

    const [minX, maxX, minY, maxY] = getBoundaries(sensors, beacons),
        items = grid.items;

    grid.boundaries.minX = minX;
    grid.boundaries.maxX = maxX;

    grid.boundaries.minY = minY;
    grid.boundaries.maxY = maxY;

    // Put items into correct place
    beacons.map(beacon => {
        const pos = beacon.pos,
            row = items[pos.y] || {};

        row[pos.x] = beacon;
        items[pos.y] = row;
    });

    // Put items into correct place
    sensors.map(sensor => {
        const pos = sensor.pos,
            row = items[pos.y] || {};

        row[pos.x] = sensor;
        items[pos.y] = row;
    });

    return grid;
};

const createCoverageReport = (grid, sensors, focusRow) => {

    const items = grid.items
    let coverage = {
        'c': 0,
        'i': {}
    };

    sensors.map(sensor => {
        const b = grid.boundaries,
            sp = sensor.pos,
            distance = sensor.distance;

        const minY = sp.y - distance,
            maxY = sp.y + distance;

        // Check if within focusrow
        if (focusRow < minY || focusRow > maxY) {
            // No need to check
            return;
        }

        let y = focusRow;
        {
        // for (let y = focusRow; y < focusRow; y++) {
            const nd = getDistance(sensor, {pos:{x:sp.x,y:y}}),
                minX = Math.max(b.minX, sp.x - (distance-nd)),
                maxX = Math.min(b.maxX, sp.x + (distance-nd) + 1);

            // console.log(sp, distance, minY, maxY, minX, maxX);

            const row = items[y] || null;
            for (let x = minX; x < maxX; x++) {
                // if (row[x]) {
                //     continue;
                // }

                const i = (row && row[x] || coverage.i[x]) ? 0 : 1;

                coverage.c += i;
                coverage.i[x] = 1;

                // const d = getDistance(sensor, {pos: {x: x, y: y}});

                // Within distance
                // if (d <= distance) {
                    // const item = row[x] || {
                    //         "type": "coverage",
                    //         "pos": {
                    //             "x": x,
                    //             "y": y
                    //         },
                    //         // "sensors": []
                    //     };

                    // if (item.type === 'coverage') {
                    //     item.sensors.push(sensor);
                    // }

                    // row[x] = item;
                // }
            }

            // items[y] = row;
        }
    });

    return coverage;
}

const plotGrid = (grid) => {

    const b = grid.boundaries,
        items = grid.items,
        minX = b.minX,
        minY = b.minY,
        maxX = b.maxX,
        maxY = b.maxY;

    const result = [];
    for (let y = minY; y < maxY; y++) {
        const row = [];

        for (let x = minX; x < maxX; x++) {
            const item = (items[y] || {})[x] || null;

            switch (true) {
                case (! item):
                    row.push('.');
                    break;

                case item.type === 'sensor':
                    row.push('S');
                    break;

                case item.type === 'beacon':
                    row.push('B');
                    break;

                default:
                    row.push('#')
            }
        }
        result.push(row.join(''));
    }

    console.log(result.join('\n'));
};

const CHECK_ROW = 2000000;
// const CHECK_ROW = 10;

const sensors = [], beacons = [], grid = {
    "boundaries": {
        "minX": 0,
        "maxX": 0,
        "minY": 0,
        "maxY": 0
    },
    items: {}
};

// Start programm
inputToData(input, sensors, beacons);
fillGrid(grid, sensors, beacons);

const check = createCoverageReport(grid, sensors, CHECK_ROW);

// plotGrid(grid);

// Object.values(grid.items[CHECK_ROW]).filter(i => i.type === 'coverage').length
// Object.values(check).reduce((c, i) => c + i, 0)
check.c;