input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

input
    // this one goes from left to right - first try
    // .map(i => {
    //     // https://regex101.com/
    //     const regExp = /(one|two|three|four|five|six|seven|eight|nine)/sg,
    //         match = i.match(regExp);
    //     if (match) {
    //         i = match.reduce((i, m) => i.replace(m, ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].indexOf(m) + 1), i);
    //     }

    //     return i;
    // })
    // extend with words, replace later
    .map((i, d) => i.replace(
        /((?<!\d|one|two|three|four|five|six|seven|eight|nine)(\d|one|two|three|four|five|six|seven|eight|nine).*(\d|one|two|three|four|five|six|seven|eight|nine)(?!\d|one|two|three|four|five|six|seven|eight|nine)|(\d|one|two|three|four|five|six|seven|eight|nine))/, 
        '$2$3$4$4'
    ))// $1 ' + input[d]))
    // replace words
    .map(i => {
        const regExp = /(one|two|three|four|five|six|seven|eight|nine)/sg,
            match = i.match(regExp);
        if (match) {
            i = match.reduce((i, m) => i.replace(m, ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].indexOf(m) + 1), i);
        }

        return i.replace(/[^\d]+/g, '');
    })
    // .filter(i => i)
    .map(i => isNaN(i) ? 0 : parseInt(i))
    .reduce((c, i) => c + i, 0);
