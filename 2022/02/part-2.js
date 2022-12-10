// update the games from input from the last step
games = input.map(g => g.split(' ')
    // we know what the elve does
    .map(e => e.replace(/[A]/, 'R').replace(/[B]/, 'P').replace(/[C]/, 'S'))).filter(g => g.length > 1)
    // just map based on the rules: Y = return the same as elf, otherwise map
    .map(g => [
      g[0], g[1] === 'Y' ? g[0]
        : (g[1] === 'X' ? {'P' : 'R', 'S' : 'P', 'R' : 'S'}[g[0]] // lose
          : {'P' : 'S', 'S' : 'R', 'R' : 'P'}[g[0]]) // win
     ])
    .map(g => {return {'input': g}})

// run the rest of the code again
games = games.map(g => {const w = winner(...g.input); g.elf = score(g.input[0]) + (w === -1 ? 6 : (w === 0 ? 3 : 0)); g.you = score(g.input[1]) + (w === 1 ? 6 : (w === 0 ? 3 : 0)); return g})

// get scores
scoreElf = games.reduce((c, g) => c + g.elf, 0);
scoreYou = games.reduce((c, g) => c + g.you, 0);