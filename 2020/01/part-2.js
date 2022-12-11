// find total summing
score = [];
for (let a = 0; a < report.length - 2; a++)
    for (let c = a + 1; c < report.length - 1; c++)
        for (let b = report.length - 1; b > c; b--)
            report[a] + report[b] + report[c] === TOTAL && score.push(report[a], report[b], report[c]);

score.slice(0,3).reduce((t, i) => t * i, 1);
