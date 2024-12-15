
const thingy2 = /(don't\(\)|do\(\))|mul\((\d+),(\d+)\)/g

let yes = 1
Array.from(input.join('\n').matchAll(thingy2)).map(([m, yn, a, b]) => yes ? (a * b): 0).reduce((c, n) => c + n, 0) 