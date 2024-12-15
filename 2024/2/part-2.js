
const 
safer = input.map(r => r.split(/\s+/).map(r => parseInt(r))).map(r => {
    let correction = 1, limit = 3, result = [];

    for (let i = 1, last = r[0]; i < r.length; i++) {
        let diff = r[i] -  last;
        if (diff === 0 || Math.abs(diff) > limit) {
            correction--;
            continue;
        }

        last = r[i];
        result.push(diff);

    }

    console.log(r, result)

    return true;

}).filter(r => r);