const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const numbers = input.slice(0, input.length - 1).map(x => x.trim().split(/\s+/).map(n => parseInt(n)))
                     .reduce((c, r, y) => {

                        r.map((i, x) => {
                            c[x] = c[x] || [];
                            c[x][y] = i
                        });

                        return c
                     }, []),
        operators = input.slice(-1)[0].trim().split(/\s+/),

        calculate = (op, nums) => op === '*' ? nums.reduce((c, i) => c * i, 1) : nums.reduce((c, i) => c + i, 0),

        grandTotal = (numbers, operators) => calculate('+', numbers.map((l, i) => calculate(operators[i], l)))


console.log(grandTotal(numbers, operators))
