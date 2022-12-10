// continue with same input, see above

// execute movements don't reverse items
stacksAfterMovements = movements.reduce((stacks, i) => {const moveCrates = stacks[i.from].slice(0-i.move); stacks[i.from] = stacks[i.from].slice(0, stacks[i.from].length-i.move); stacks[i.to].push(...moveCrates); return stacks.map(e => [...e]);}, stacks.map(e => [...e]));

// generate code
stacksAfterMovements.map(s => [...s].pop()).join('')