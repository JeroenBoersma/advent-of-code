const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const coords = input.map(l => l.split(',').map(i => parseInt(i))),
    calculate = coords => {
        const sizes = [];

        for (let a = 0; a < coords.length - 1; a++) {
            for (let b = a + 1; b < coords.length; b++) {
                const current = coords[a], next = coords[b];
                sizes.push((Math.abs(current[0] - next[0]) + 1) * (Math.abs(current[1] - next[1]) + 1));
            }
        }

        return sizes.sort((a, b) => a - b)
    }
    

console.log(calculate(coords).pop())
