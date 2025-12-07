const input = document.body.firstChild.innerText.split(/[,\n]/).filter(l => l.length);

const result = input.reduce((result, line) => {

    // check validity
    const numbers = line.split('-').map(m => parseInt(m));

    for (let n = numbers[0]; n <= numbers[1]; n++) {

        const s = n.toString(), l = s.length;
        if (l % 2 > 0) continue;

        // console.log(s.substring(0, l / 2),  s.substring(l / 2))

        if (s.substring(0, l / 2) === s.substring(l / 2)) {
            // console.log(n);
            result += n;
        }
    }

    return result;
}, 0);

console.log(result)
