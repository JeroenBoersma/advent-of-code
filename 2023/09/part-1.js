const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const parseNumbers = input => input.map(row => row.split(/\s+/).map(n => parseInt(n))),
    runDown = numbers => numbers.map(line => {
        const result = [],
            makeDiff = nums => {
                const diff = [];

                for (let a = 0; a < nums.length - 1; a++) {
                    const n1 = nums[a], n2 = nums[a+1];
                    diff.push(n2 - n1);
                }

                return diff;
            };

        result.push(line);

        let diff, last = line;

        while (diff = makeDiff(last)) {
            result.push(diff);
            last = diff;

            if (diff.filter(n => n !== 0).length === 0) {
                break;
            } 
        }

        return result;
    }),
    extraPolate = diffs => diffs.map(g => [...g].reverse().reduce((c, l) => c + l.slice(-1)[0], 0));

const numbers = parseNumbers(input),
    diffs = runDown(numbers),
    sum = extraPolate(diffs).reduce((c,n) => c + n, 0);