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
                "distance": Infinity,
                "boundaries": {
                    "minX": -Infinity,
                    "maxX": Infinity,
                    "minY": -Infinity,
                    "maxY": Infinity,
                }
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

        sensor.boundaries.minX = sensor.pos.x - sensor.distance;
        sensor.boundaries.maxX = sensor.pos.x + sensor.distance;
        sensor.boundaries.minY = sensor.pos.y - sensor.distance;
        sensor.boundaries.maxY = sensor.pos.y + sensor.distance;

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
    getDistanceForDirection = (item1, item2, direction) =>
        Math.abs(item1.pos[direction] - item2.pos[direction]),
    getDistance = (item1, item2) =>
        getDistanceForDirection(item1, item2, 'x') + getDistanceForDirection(item1, item2, 'y');

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
        't': 0,
        'i': {}
    };

    // Sort on x left to right
    const boundaries = {},
        sensorKey = sensor => sensor.pos.x + 'x' + sensor.pos.y,
        sortedSensors = sensors.filter(sensor => sensor.boundaries.minY <= focusRow && sensor.boundaries.maxY >= focusRow)
            .map(sensor => {
                const key = sensorKey(sensor),
                    distance = getDistance(sensor, {pos: {x: sensor.pos.x, y: focusRow}});

                boundaries[key] = {
                    minX: (sensor.pos.x - (sensor.distance - distance)),
                    maxX: (sensor.pos.x + (sensor.distance - distance)),
                }

                return sensor;
            })
            .sort((a, b) => {
                const keyA = sensorKey(a),
                    keyB = sensorKey(b);

                return boundaries[keyA].minX - boundaries[keyB].minX;
            });

    const area = Object.values(boundaries).sort((a, b) => a.minX - b.minX === 0 ? a.maxX - b.maxX : a.minX - b.minX)
        .map(b => ({
            minX: Math.max(b.minX, grid.boundaries.minX),
            maxX: Math.min(b.maxX, grid.boundaries.maxX)
        }))
        .reduce((c, b) => {
            const l = c[c.length - 1];

            // l fully covered by b
            if (l && l.maxX <= b.maxX && l.minX >= b.minX) {
                l.maxX = b.maxX;
                return c;
            }

            // continious range up
            if (l && l.maxX <= b.maxX && l.maxX >= b.minX) {
                l.maxX = b.maxX;
                return c;
            }

            // l covers b
            if (l && l.maxX >= b.maxX && l.minX <= b.minX) {
                return c;
            }

            c.push(b);

            return c;
        }, []);

    // fully covered, no calculations
    if (area.length === 1 && area[0].maxX - area[0].minX === grid.boundaries.maxX - grid.boundaries.minX) {
        coverage.t = area[0].maxX - area[0].minX;
        return coverage;
    }

    let lastMinX = grid.boundaries.minX;

    sortedSensors.map(sensor => {
        const b = grid.boundaries;//,
            // sb = sensor.boundaries,
            // sp = sensor.pos,
            // distance = sensor.distance;

        // Check if within focusrow
        // if (focusRow < sb.minY || focusRow > sb.maxY) {
        //     // No need to check
        //     return coverage;
        // }

        const y = focusRow;
        {
        // for (let y = focusRow; y < focusRow; y++) {
            const key = sensorKey(sensor),
                sb = boundaries[key],
                minX = Math.max(lastMinX, sb.minX),
                maxX = Math.min(b.maxX, sb.maxX + 1);

            lastMinX = maxX - 2;

            const row = items[y] || null;
            for (let x = minX; x < maxX; x++) {
                // if (row[x]) {
                //     continue;
                // }

                const i = (row && row[x] || coverage.i[x]) ? 0 : 1;

                coverage.c += i;
                coverage.t += coverage.i[x] ? 0 : 1;
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