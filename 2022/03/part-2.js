// read input from the browser
input = document.body.firstChild.innerHTML.split('\n').filter(l => l.length > 1);
// create the groups of 3 elves
groups = input.reduce((c, v, i) => {i % 3 === 0 ? c.push([v]) : c[c.length - 1].push(v); return c}, []);
// search for groups badge per group, return the first
badges = groups.map(g => {
  const r = new RegExp(`[${g[0]}]`, 'g'),
        m = g[1].match(r),
        r2 = new RegExp(`[${m.join('')}]`, 'g');
  return g[2].match(r2)[0]
});

// calculate the badges priority
badges.map(c => priority(c)).reduce((c, v) => c + v, 0);