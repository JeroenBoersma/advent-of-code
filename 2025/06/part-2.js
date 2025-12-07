
const rotated = input.map(r => r.split(''))
                     .reduce((c, r) => {
                        r.map((i, x) => {
                            c[x] = c[x] || '';
                            c[x] += i
                        })

                        return c;
                     }, [])
                     .reverse()
                     .join('\n')
                     .split(/\n +\n/),
        operators2 = rotated.map(l => l.split('').pop()),

        numbers2 = rotated.map(l => l.replace(/[\+\*]/, '').trim().split(/\s+/).map(x => parseInt(x)))


console.log(grandTotal(numbers2, operators2))
