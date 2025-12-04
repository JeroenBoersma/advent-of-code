
const code = 0, result2 = input.reduce((result, v) => {
            const direction = (v[0] === 'L' ? -1 : 1),
                number = parseInt(v.substring(1));

            for (let a = 0; a < number; a++) {
                result = (result + (direction * 1) + max) % max;

                if (result === min) {
                    code++;
                }
            }

            console.log(result)

            return result;
        }, start);

console.log(result2, code, '0x' + code.toString(16).toUpperCase());
