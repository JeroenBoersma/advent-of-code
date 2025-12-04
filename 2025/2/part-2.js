const result2 = input.reduce((result, line) => {

    // check validity
    const numbers = line.split('-').map(m => parseInt(m));

    for (let n = numbers[0]; n <= numbers[1]; n++) {

        const s = n.toString(), l = s.length;

        for (let a = 1; a < l; a++) {
            const f = s.substring(0, a);

            if (s.split(f).filter(z => !!z).length === 0) {
                console.log(f, n);
                result += n;
                break;
            }
        }

    }

    return result;
}, 0);

console.log(result2)