const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const machines = input.map(l => l.match(/^\[([^\]]+)\] (.*) \{([^\}]+)\}/))
                .map(l => ({
                    lights: l[1].split('').map(b => b === '#'), 
                    buttons: l[2].replace(/[\(\)]/g, '').split(' ').map(b => b.split(',').map(i => parseInt(i))),
                    joltage: l[3].split(',').map(i => parseInt(i))
                })),
      validateLights = (lights, target) => lights.reduce((b, l, i) => b && l === target[i], true),
      visualizeLights = lights => lights.map(x => x ? '#' : '.').join(''),
      startSequences = () => {
        const result = [],
              premutate = (buttons) => {
                const permuations = [];

                const clone = [...buttons];

                while (clone.length > 0) {

                  for (let a = 1; a < clone.length; a++) {
                      permuations.push([...clone.slice(0, a)]);
                  }

                  clone.shift();
                }

                return permuations;
              },
              validateButtons = (buttons, lights) => {
                const target = lights.map(x => false);

                buttons.map(b => b.map(i => target[i] = !target[i]))

                return validateLights(lights, target)
              }

        machines.forEach(({lights, buttons}) => {
            const permuations = premutate(buttons).sort((a, b) => a.length - b.length);

            console.log(permuations)


            for (let a = 0; a < permuations.length; a++) {
              if (validateButtons(permuations[a], lights)) {
                result.push(permuations[a]);
                return;
              }
            }

            console.log(visualizeLights(lights), permuations)

        });

        return result;
      }

console.log(startSequences().reduce((c, s) => c + s.length, 0));