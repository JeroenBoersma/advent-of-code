input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const TOTAL = 2020;

report = input.map(i => parseInt(i))
    .sort((a, b) => b - a);

// find total summing
score = [];
for (let a = 0; a < report.length; a++)
    for (let b = report.length - 1; b > a; b--)
        report[a] + report[b] === TOTAL && score.push(report[a], report[b]);

score.slice(0,2).reduce((t, i) => t * i, 1);
