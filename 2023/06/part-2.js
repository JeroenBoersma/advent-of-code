


const gameData2 = gameData.map(row => row.join('')).map(row => [parseInt(row)]),
    records2 = beatTheRecord(gameData2[0], gameData2[1]),
    sum2 = records2.reduce((c, r) => c *r.length, 1);