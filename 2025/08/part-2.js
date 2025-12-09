
const connect2 = (allDistances) => {
        const pointers = junctions.map((j, i) => i),
            circuits = pointers.map(i => [i]);

        let max = circuits.length;

        for (const i in allDistances) {
            const {a, b} = allDistances[i],
                keyA = pointers[junctions.indexOf(a)],
                keyB = pointers[junctions.indexOf(b)];

            if (keyA === keyB) continue;

            circuits[keyA].push(...circuits[keyB]);
            circuits[keyB].forEach(i => pointers[i] = keyA);
            circuits[keyB].length = 0;

            if (max === circuits[keyA].length) {
                return [[a, b]];
            };
        }

        return circuits.filter(c => c.length > 0).map(c => c.map(i => junctions[i]))
            .sort((a, b) => b.length - a.length)
    },
    multipleFirstAndLastX = (circuits) => circuits[0].x * circuits[circuits.length - 1].x;

console.log(multipleFirstAndLastX(connect2(closestArray(junctions))[0]))
