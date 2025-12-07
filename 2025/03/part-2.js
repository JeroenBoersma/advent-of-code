
const result2 = input.map(line => {
    const nmbrs = line.split('').map(n => parseInt(n))
    return empower(nmbrs, 12);
});

console.log(result2, result2.reduce((c, n) => c + n, 0))