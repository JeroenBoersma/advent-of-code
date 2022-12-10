// use both treegrids
// reconsider a scoring system

// create a calculator
calculator = (x, y, h) => {
    const t = treegridRotated[x].slice(0, y).reverse(),
          l = treegrid[y].slice(0, x).reverse(),
          r = treegrid[y].slice(x+1),
          b = treegridRotated[x].slice(y+1),
          f = function(h2) {return !(this.stop = this.stop || h <= h2)},
          i = {'stop': false},
          c = (a) => Math.min(a.length, a.filter(f, {...i}).length + 1)
          score = c(t) * c(l) * c(r) * c(b);

   /* // debug data, just add a / in front of this line and done
   return {
     'x' : x,
     'y': y,
     'h': h,
     'v': {'t': t, 'l': l, 'r': r, 'b': b},
     's': {'t': c(t), 'l': c(l), 'r': c(r), 'b': c(b)},
     't': score
   };//*/
   return score;
  };

  // calculate
  scenicScores = treegrid.map((row, y) => row.map((h, x) => calculator(x, y, h)));

  // get the max possible value
  // basic sort did not work the first time :/ -> added explicit sorting a-b
  scenicScores.flat().sort((a,b) => a - b).pop()
