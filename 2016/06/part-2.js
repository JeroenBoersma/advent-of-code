// don't reverse order of the commonChars map and you have the least common letter
// find least common
commonChars.map(l => {const max = Object.values(l).sort().shift(); return Object.keys(l).filter(v => l[v] === max).shift()}).join('')