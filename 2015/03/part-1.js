input = document.body.firstChild.innerText.split('\n').filter(l => l.length)[0];

// consider 2D object grid
grid = {0: {0: 1}};

// keep track of position, start at 0,0 (arrays start at zero)
pos = {
  'reset': function() { this.x = this.y = 0 },
  'update': function (instruction) {
    switch (instruction) {
      case '<':
        this.x--;
        break;
      case '>':
        this.x++;
        break;
      case '^':
        this.y--;
        break;
      case 'v':
        this.y++;
        break;
      default:
        console.error(`Invalid instruction: ${instruction}`);
    }
  },
  'x': 0,
  'y': 0
};

// parser
parser = (instruction, pos, grid) => {
  pos.update(instruction);
  grid[pos.y] = grid[pos.y] || {};
  grid[pos.y][pos.x] = (grid[pos.y][pos.x] || 0) + 1;
}

// walk instructions, updated version with grid and pos as a param
input.split('').map(i => parser(i, pos, grid));

// flatten the grid to get total visited houses
Object.keys(grid).reduce((s, y) => s + Object.keys(grid[y]).length, 0)
