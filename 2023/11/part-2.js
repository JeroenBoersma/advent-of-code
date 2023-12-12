// sooo much older... let's cook that cpu and memory

const AGE = 1000000;

const expandTheIndexedUniverse = (universe, age, direction) => {
        const expandedUniverse = [];
        for (let a = 0, i = 0; a < universe.length; a++) {
            if (universe[a].filter(g => g.type !== '.').length < 1) {
                i+=age-1;
            }

            const line = [...universe[a]].map(g => ({...g, [direction]: a+i}));
            expandedUniverse.push(line);
        }
        
        return expandedUniverse;
    };

const olderUniverse = createAUniverse(input),
    millionYearsUniverse = expandTheIndexedUniverse(rotateTheUniverse(expandTheIndexedUniverse(indexTheUniverse(olderUniverse), AGE, 'x')), AGE, 'y'),
    galaxyList2 = galaxiesAreAwesome(millionYearsUniverse),
    sum2 = totalDistanceWithinTheUniverseBetweenGalaxies(galaxyList2).reduce((c, d) => c + d.distance, 0);