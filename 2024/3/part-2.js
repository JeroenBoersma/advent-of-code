
const thingy2 = /(don't\(\)|do\(\))|mul\((\d+),(\d+)\)/g

let yes;
yes = 1;yes=1;Array.from(input.join('\n').matchAll(thingy2)).map(([m, yn, a, b]) => yn ? (yn === 'do()' ? (yes = 1) : yes = 0) * 0 : (!yn && yes ? (a * b) : 0)).reduce((c, n) => c + n, 0) 