const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const parseCardInput = (input) => input.map(row => {
        const parsed = row.match(/^Card\s+(\d+):((\s+\d+)+)+\s+\|((\s+\d+)+)+\s*$/),
            card = parseInt(parsed[1]),
            winning = parsed[2].split(/\s+/).filter(s => s.length).map(s => parseInt(s)).sort((a, b) => a - b),
            mine = parsed[4].split(/\s+/).filter(s => s.length).map(s => parseInt(s)).sort((a, b) => a - b)
            ;
        return {
            "card": card,
            'winning': winning,
            "mine": mine
        };
    }),
    calculateScores = (cards) => 
        cards.map(card => ({
            ...card,
            "match": card.mine.filter(n => card.winning.indexOf(n) !== -1).length
        })).map(card => ({
            ...card,
            "score": (s => s < 1 ? 0 : Math.pow(2, s - 1))(card.match)
        }));

const cards = parseCardInput(input),
    sum = calculateScores(cards).reduce((c, card) => c + card.score, 0);