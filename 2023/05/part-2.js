

const normalizeConversions = (almanac, name) => {
        const normalized = {};

        const normalizeMapping = (mapping) => {

            

            for (let a = 0; a < mapping.length; a++) {}

            return mapping;
        };

        const current = {...almanac[name]};

        normalized[name] = current;
        current.to = {};

        // reduce rules to one list of all rules so head and tail can be linked as one mutation
        createStacks(almanac[name]).forEach(stack => {
            // we already know we start at current
            stack.shift();

            const tail = {...stack.pop()},
                tailMapping = tail.mapping;

            let mapping = [];

            // reset tail mapping
            tail.mapping = {
                [name]: mapping
            };

            let last = current;
            for (let current; current = stack.shift();) {

                // normalize mapping
                mapping = [...mapping, ...current.mapping[(last ?? {}).name] ?? []];
                last = current;
            }

            // push last mapping
            mapping = [...mapping, ...tailMapping[last.name] ?? []];

            mapping = normalizeMapping(mapping);

            console.log(mapping);

            // update tail
            normalized[name].to[tail.name] = tail;
            normalized[tail.name] = tail;
        });

        return normalized;
    },

    searchLowestFromRanges = (almanac, name, lowest) => {
        almanac = {...almanac};

        // we could create a mapping table once so it becomes faster to move a number from a to b in one mutation
        // this saves a lot of steps 

        const entry = {...almanac[name]};
        entry.numbers = [...entry.numbers];

        const ranges = new Array(Math.floor(entry.numbers.length / 2)).fill(1).map((e, i) => ({
                "from": entry.numbers[i * 2],
                "size": entry.numbers[i * 2 + 1]
            }))
            .map(r => ({...r, "to": r.from + r.size}))
            .sort((a, b) => a.from - b.from);

        const stacks = createStacks(entry);

        ranges.forEach(range => {
            for (let n = range.from, x = 0; x < range.size; x++) {
                (number => {
                    const newEntry = {...entry};
                    newEntry.numbers = [number];

                    almanac[name] = newEntry;

                    const lists = createListsFromAlmanac(almanac, 'seed', stacks);
                    lowest = Math.min(lowest, lists[0].pop().number);
                })(n+x);
            }
        });

        return lowest;
    };


// wait for it to walk all numbers, use lowest from last result within the range 
const normalizedAlmanac = normalizeConversions(almanac, 'seed'),
     lowestRange = lists.filter((e, i) => i % 2 === 0).map(l => [...l].pop().number).sort((a,b) => a - b).shift(),
     lowest2 = searchLowestFromRanges(normalizedAlmanac, 'seed', lowestRange);
