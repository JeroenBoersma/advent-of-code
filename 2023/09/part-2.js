
const extraPolate2 = diffs => diffs.map(g => [...g].reverse().reduce((c, l) => l.slice(0,1)[0] - c, 0));

const sum2 = extraPolate2(diffs).reduce((c,n) => c + n, 0);