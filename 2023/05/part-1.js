const input = document.body.firstChild.innerText.split('\n');

const readAlmanac = input => {

        // Let's normalize first
        let group = [];
        const groups = input.reduce((groups, line) => {
            if (line === '') {
                groups.push(group);
                group = [];

                return groups;
            }

            group.push(line);

            return groups;
        }, []);

        if (group.length) {
            groups.push(group);
        }

        const almanac = {};

        const updateOrCreateEntry = (name) => (almanac[name] || {
            "name": name,
            "numbers": [],
            "mapping": {},
            "to": {}
        });

        // Parse groups to a almanac
        groups.forEach(group => {

            // clone to leave original unmodified
            group = [...group];

            // get type / name
            const entryType = group.shift();
            const isMap = !!entryType.match(/ map:$/);

            const name = isMap ? entryType.split(' ')[0].split('-')[2] : entryType.split(/s?:/)[0];

            const entry = updateOrCreateEntry(name);

            // check if map of list of ingredients
            if (! isMap) {
                // ingredients
                entry.numbers = entryType.split(/s?:\s*/)[1].split(/\s+/).map(n => Number(n));
            } else {
                // create mapping
                entry.mapping[entryType.split(' ')[0].split('-')[0]]
                    = group.map(g => g.split(/\s+/).map(n => Number(n))).map(g => ({
                        "source": g[1],
                        "destination": g[0], 
                        "size": g[2], 
                    })).sort((a, b) => a.source - b.source);
            }

            almanac[entry.name] = entry;
        });

        // add relations
        Object.values(almanac).forEach(({"name": to, "mapping": mapping}) => 
            Object.keys(mapping).forEach(from => almanac[from].to[to] = almanac[to])
        );

        return almanac;
    },

    mapNumber = (number, mapping) => {
        mapping = [...mapping];

        while (map = mapping.shift()) {
            if (number >= map.source && number < map.source + map.size) {
                return map.destination + (number - map.source);
            }
        }

        return number;
    },

    createStacks = (current) => {
        const stacks = [];

        const subStacksPerTo = Object.values(current.to).map(entry => createStacks(entry));

        // last in line
        if (subStacksPerTo.length === 0) {
            return [[current]];
        }

        subStacksPerTo.forEach(subStacks => subStacks.map(stack => {
            stacks.push([current, ...stack]);
        }));

        return stacks;
    },

    createListsFromAlmanac = (almanac, source, stacks) => {
        const lists = [],
            createEntry = (entry, number) => ({"entry": entry, "number": number}),
            from = almanac[source];

        // walk per number
        from.numbers.forEach(number => {
            stacks.forEach(stack => {
                stack = [...stack];

                const list = [];

                for (let current, last, nextNumber = number; current = stack.shift();) {
                    const mapping = current.mapping[(last ?? {}).name] ?? []

                    // convert number
                    nextNumber = mapNumber(nextNumber, mapping);
                    // push to list
                    list.push(createEntry(current, nextNumber));

                    last = current;
                }

                lists.push(list);
            });            
        });

        return lists;
    };


const almanac = readAlmanac(input),
    lists = createListsFromAlmanac(almanac, 'seed', createStacks(almanac['seed'])),
    lowest = lists.map(l => [...l].pop().number).sort((a, b) => a > b ? 1 : (a < b ? -1 : 0)).shift();

