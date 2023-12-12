const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const createAUniverse = input => input.map(l => l.split('')),
    expandTheUniverse = (universe, age) => {
        age = age || 1;

        const expandedUniverse = [];
        for (let a = 0; a < universe.length; a++) {
            const line = [...universe[a]];
            expandedUniverse.push(line);

            if (line.filter(g => g !== '.').length < 1) {
                for (let i = 0; i < age; i++) {
                    expandedUniverse.push([...line]);
                }
            }
        }
        
        return expandedUniverse;
    },
    rotateTheUniverse = universe => universe[0].map((c, x) => universe.map(l => l[x])),
    indexTheUniverse = universe => universe.map((l, y) => l.map((c, x) => ({"type": c, "x": x, "y": y}))),
    galaxiesAreAwesome = universe => universe.reduce((c, l) => l.filter(g => g.type !== '.').reduce((c, g) => (() => {c.push(g); return c;})(), c), []).map((g, i) => ({...g, "number": i+1})),
    distanceBetweenTwoGalaxies = (galaxyA, galaxyB) => Math.abs(galaxyA.x - galaxyB.x) + Math.abs(galaxyA.y - galaxyB.y),
    totalDistanceWithinTheUniverseBetweenGalaxies = galaxies => {
        const distance = [];

        for (let a = 0; a < galaxies.length; a++) {
            for (let b = a + 1; b < galaxies.length; b++) {
                distance.push({
                    "distance": distanceBetweenTwoGalaxies(galaxies[a], galaxies[b]),
                    "from": galaxies[a].number,
                    "to": galaxies[b].number,
                });
            }
        }

        return distance;
    };

const enormousUniverse = rotateTheUniverse(expandTheUniverse(rotateTheUniverse(expandTheUniverse(createAUniverse(input))))),
    indexedUniverse = indexTheUniverse(enormousUniverse),
    galaxyList = galaxiesAreAwesome(indexedUniverse),
    sum = totalDistanceWithinTheUniverseBetweenGalaxies(galaxyList).reduce((c, d) => c + d.distance, 0);