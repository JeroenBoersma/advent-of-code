const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const junctions = input.map(l => l.split(',').map(x => parseInt(x))).map(a => ({x: a[0], y: a[1], z: a[2]})),
    distance = (a, b) => Math.abs(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2))),
    zero = {x: 0, y: 0, z: 0},
    closest = (a, junctions) => {
        const distances = [];

        junctions.forEach(e => {
            if (e === a) return;

            // a -> b === b -> a
            // check if in cache
            const keyAB = cacheKey(a, e), keyBA = cacheKey(e, a);

            if (! connectionCaches[keyAB] || ! connectionCaches[keyBA]) {
                connectionCaches[keyAB] = connectionCaches[keyBA] = distance(a, e);
            }

            distances.push({
                a: a,
                b: e,
                dist: connectionCaches[keyAB] || connectionCaches[keyBA] 
            })
        })

        return distances.sort((a, b) => a.dist - b.dist)
    },
    connectionCaches = {},
    cacheKey = (a, b) => 
                    a.x + ',' + a.y + ',' + a.z + 
                    '-' + 
                    b.x + ',' + b.y + ',' + b.z,
    closestArray = (junctions) => {
        const allDistances = [], yesYes = {};

        junctions.forEach(j => allDistances.push(...closest(j, junctions)));

        return allDistances.sort((a, b) => a.dist - b.dist)
            .filter(({a, b}) => {
                const keyA = cacheKey(a, b), keyB = cacheKey(b, a);

                if (yesYes[keyB]) return false;
                return yesYes[keyA] = true;
            });
    },
    connect = (allDistances, max = allDistances.length) => {
        const pointers = junctions.map((j, i) => i),
            circuits = pointers.map(i => [i]);


        max = max > allDistances.length ? allDistances.length : max;

        for (let i = 0; i < max; i++) {
            const {a, b} = allDistances[i],
                keyA = pointers[junctions.indexOf(a)],
                keyB = pointers[junctions.indexOf(b)];

            if (keyA === keyB) continue;

            circuits[keyA].push(...circuits[keyB]);
            circuits[keyB].forEach(i => pointers[i] = keyA);
            circuits[keyB].length = 0;
        }

        return circuits.filter(c => c.length > 0).map(c => c.map(i => junctions[i]))
            .sort((a, b) => b.length - a.length)
    },
    multipleLargest = (circuits, n) => circuits.slice(0, n).reduce((t, c) => t * c.length, 1);

console.log(multipleLargest(connect(closestArray(junctions), 1000), 3))
