const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const sorted = input.map(r => r.split('   ')).reduce((c, r, i) => {c[0].push(parseInt(r[0]));c[1].push(parseInt(r[1])); return c}, [[], []]).map(c => c.sort());

sorted[0].map((r, i) => Math.abs(r - sorted[1][i])).reduce((c, r) => c + r, 0)