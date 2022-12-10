input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// transform to columns
columnData = input.map(l => l.split('')).reduce((a, l) => {l.map((c, i) => a[i].push(c)); return a}, (new Array(input[0].length)).fill(1).map(c => []));

// group by chars
commonChars = columnData.map(l => l.sort().reduce((a, c) => {a[c] = a[c] || 0; a[c]++; return a;}, {}));

// find most common
commonChars.map(l => {const max = Object.values(l).sort().reverse().shift(); return Object.keys(l).filter(v => l[v] === max).shift()}).join('')
