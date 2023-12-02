const 
    input = document.body.firstChild.innerText.split('\n').filter(l => l.length),
    total = '12 red cubes, 13 green cubes, and 14 blue cubes';


// normalize the data, so we can do funky stuff with it
const normalizeInput = input => input.map(row => {
        const parsed = row.split(': '),
            game = parseInt(parsed[0].match(/\d+$/)[0]),
            hands = parsed[1].split('; ')
                .map(h => h.split(', ')
                .map(c => c.match(/(\d+)\s+(\S+)/))
                .map(c => ({'qty': parseInt(c[1]), 'color': c[2]})));//match(/Game (\d+): (((\d+) (red|green|blue)+(, )?)+(; |$))+/g),
            sums = {};

        let cubes = 0;
        hands.forEach(h => h.forEach(c => {
                sums[c.color] = sums[c.color] ?? 0;
                sums[c.color] = Math.max(sums[c.color], c.qty);
            })
        );

        Object.keys(sums).forEach(c => cubes += sums[c]);
        
        return {
            'game': game,
            'hands': hands,
            'sum': sums,
            'cubes': cubes
        };
    }),
    normalizeTotals = input => input.match(/(\d+) ([^ ]+)/g).map(t => t.split(' ')).map(t => ({'qty': parseInt(t[0]), 'color': t[1]})),
    filterGames = (games, totals) => 
        games.filter(game => 
            !totals.reduce((c, t) => c || game.sum[t.color] > t.qty, false)
        ),
    sumGames = games => games.reduce((t, g) => t + g.game, 0)
;

// game parser
const games = normalizeInput(input), // normalize games
    totals = normalizeTotals(total) // normalize totals
    filtered = filterGames(games, totals) // filter games
    sum = sumGames(filtered) // sum game totals
; 

console.log(sum);