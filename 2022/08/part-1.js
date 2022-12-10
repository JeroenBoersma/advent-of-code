input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// create a grids (rotated for faster access)
treegrid = input.map(l => l.split('').map(i => parseInt(i)));
treegridRotated = new Array(treegrid[0].length).fill(1).map((r, i) => (new Array(treegrid.length).fill(1).map((r, i2) => treegrid[i2][i])));

// used often, so cache
size = {'h': treegrid.length, 'w': treegrid[0].length}

// walk inner trees and see if visible
visibleTrees = 0; for (let x = 1; x < size.w - 1; x++) for (let y = 1; y < size.h - 1; y++) {
  const h = treegrid[y][x];
  let visible = false;

  // look to the edges
  // if visible on one end, stop bothering others

  // up
  visible = visible || h > treegridRotated[x].slice(0, y).sort().reverse()[0];
  // left
  visible = visible || h > treegrid[y].slice(0, x).sort().reverse()[0];
  // right
  visible = visible || h > treegrid[y].slice(x+1).sort().reverse()[0];
  // down
  visible = visible || h > treegridRotated[x].slice(y+1).sort().reverse()[0];

  visible && visibleTrees++;
}

// Add outside visible trees
visibleTrees += (size.h + size.w) * 2 - 4;
