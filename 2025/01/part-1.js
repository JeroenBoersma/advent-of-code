const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const start = 50, min = 0, max = 100;

let result = input.map(r => Math.abs((r[0] === 'L' ? min - max : 0) + (parseInt(r.substring(1)) % 100)))
        .reduce((r, v) => {
            r.push((r[r.length - 1] + v) % 100);
            return r;
        }, [start])

console.log(result, result.filter(v => v === min).length)
