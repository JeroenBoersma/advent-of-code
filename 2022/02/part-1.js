// read input from the browser
input = document.body.firstChild.innerText.split('\n');

// create games and normalize data
// AX => R
// BY => P
// CZ => S
games = input.map(g => g.split(' ').map(e =>
  e.replace(/[AX]/, 'R')
   .replace(/[BY]/, 'P')
   .replace(/[CZ]/, 'S')
)).filter(g => g.length > 1).map(g => {return {'input': g}})

// helper for the winner
winner = (a, b) =>
  a === b ? 0 // draw
  : (a === 'P' && b === 'R' || a === 'R' && b === 'S' || a === 'S' && b === 'P' ? -1 : 1); // all wins or loses

// helper for the score, note playing Scissors all the time increases your chances
score = e => {return {'P': 2, 'S': 3, 'R': 1}[e]}

// add scores for each
games = games.map(g => {
  const w = winner(...g.input);
  g.elf = score(g.input[0]) + (w === -1 ? 6 : (w === 0 ? 3 : 0));
  g.you = score(g.input[1]) + (w === 1 ? 6 : (w === 0 ? 3 : 0));
  return g
})

// get scores
scoreElf = games.reduce((c, g) => c + g.elf, 0);
scoreYou = games.reduce((c, g) => c + g.you, 0);