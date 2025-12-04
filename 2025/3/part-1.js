const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);


function empower(nmbrs, many) {
    if (many < 1) return 0;

    const cleaned = nmbrs.map(c => parseInt(c)),
          result = [];

    let toRemove = cleaned.length - many;

    cleaned.map(i => {

        while (result.length && toRemove > 0 && i > result[result.length - 1]) {
            result.pop();
            toRemove--;
        }

        result.push(i);
    });

    while (toRemove-- > 0) {
        result.pop();
    }

    return result.reduce((c, i, k) => c + i* Math.pow(10, many-k-1), 0);
}

// empower([9, 8, 1, 1, 1], 2); // 98
// empower([8, 9, 1, 1, 1], 2); // 91
// empower([8, 9, 2, 1, 1], 2); // 92

// empower([8, 9, 1, 1, 1], 3); // 911
// empower([9, 8, 1, 1, 2], 3); // 982
// empower([8, 9, 1, 1, 2], 3); // 912

const result = input.map(line => {
    const nmbrs = line.split('').map(n => parseInt(n))
    return empower(nmbrs, 2);
});

console.log(result, result.reduce((c, n) => c + n, 0))
