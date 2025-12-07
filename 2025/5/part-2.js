

const freshIdsTotal = (ranges) => {
        const sortedRanges = ranges.map(x => x.map(c => c + 0))
                                   .sort((a, b) => a[0] === b[0] && a[1] - b[1] > 0 ? 1 : a[0] - b[0]);


        let total = 0, current = sortedRanges.shift(), row;
        while (row = sortedRanges.shift()) {
            
            if (row[1] <= current[1]) {
                continue;
            } else if (row[0] > current[1]) {
                total += 1 + (current[1] - current[0])
                current = row;
            } else if (row[0] <= current[1]) {
                current = [
                    current[0],
                    row[1]
                ]
            }
        }

        total += 1 + (current[1] - current[0]);

        return total

    }

console.log(freshIdsTotal(ranges))