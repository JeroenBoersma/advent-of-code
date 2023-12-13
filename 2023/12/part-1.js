const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const readPaper = input => input.map(l => (g => ({"group": g[0], "numbers": g[1].split(',').map(n => parseInt(n))}))(l.split(' '))),
        noQuestions = l => l.replace(/\?/g, '.'),
        permutateLine = (line, regexp, permutations, prefix) => {
            permutations = permutations ?? [];
            prefix = prefix ?? '';

            const a = line.indexOf('?');

            if (a < 0) {
                // no more questions
                const result = prefix + line;
                if (result.match(regexp)) {
                    permutations.push(result);
                }

                return permutations;
            }

            // replace first ?
            if (a > -1) {
                const start = noQuestions(line.substring(0, a)), end = line.substring(a + 1, line.length);
                // this can be 2 other things
                // # or .
                ['#', '.'].forEach(c => permutateLine(end, regexp, permutations, prefix + start + c));
            }

            return permutations;//.filter((p, i, a) => a.indexOf(p) === i);
            // return permutations.reduce((c, p) => {c.indexOf(p) < 0 && c.push(p); return c;}, []);
        },
        createRegExpFromNumbers = numbers => new RegExp('^\\.*' + numbers.map(n => "#".repeat(n)).join('\\.+') + '\\.*$'),
        createASolutionList = paper => {
            const solutions = [];

            paper.forEach((line, i) => {
                console.log('Line ' + (i+1));
                // create regexp based on second input
                const regexp = createRegExpFromNumbers(line.numbers);

                permutateLine(line.group, regexp).filter(l => l.match(regexp)).forEach(l => solutions.push(l));
            });

            return solutions;
        };

const paper = readPaper(input),
    solutions = createASolutionList(paper),
    sum = solutions.length;
