// input
input = document.body.firstChild.innerText.split('\n\n');

// stacks parser => get positions, number of stacks and transform
inputCrates = input[0].split('\n')
stacks = inputCrates.pop().split('').map((c, i) => c === ' ' ? null : inputCrates.map(l => l.split('')[i])).filter(e => e).map(s => s.reverse().filter(s => s !== ' '));

// get movements
movements = input[1].split('\n').filter(l => l.length > 0).map(m => {const r = m.match(/move (\d+) from (\d+) to (\d+)/); return {'move': parseInt(r[1]), 'from': parseInt(r[2]) - 1, 'to': parseInt(r[3]) - 1}});

// execute movements
stacksAfterMovements = movements.reduce((stacks, i) => {const moveCrates = stacks[i.from].slice(0-i.move).reverse(); stacks[i.from] = stacks[i.from].slice(0, stacks[i.from].length-i.move); stacks[i.to].push(...moveCrates); return stacks.map(e => [...e]);}, stacks.map(e => [...e]));

// generate code
stacksAfterMovements.map(s => [...s].pop()).join('')