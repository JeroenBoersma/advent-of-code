// continue

const addMinimumToGames = (games) => games.map(game => {
        // clone object
        game = {...game};

        const minimum = {};

        game.hands.forEach(h => h.forEach(c => minimum[c.color] = Math.max(minimum[c.color] ?? 0, c.qty)));

        const power = Object.keys(minimum).reduce((p, c) => p * minimum[c], 1);

        game.minimum = minimum;
        game.power = power;

        return game;
    }),
    powerGames = (games) => games.reduce((p, g) => p + g.power, 0)
;

const gamesWithMinimums = addMinimumToGames(games),
    sum2 = powerGames(gamesWithMinimums);