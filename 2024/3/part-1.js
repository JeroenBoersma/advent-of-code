const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const thingy = /mul\((\d+),(\d+)\)/g

Array.from(input[0].matchAll(thingy)).map(([m, a, b]) => a * b).reduce((c, n) => c + n, 0) 