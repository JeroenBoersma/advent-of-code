// get the input from the browser
input = document.body.firstChild.innerHTML.split('\n');

// create elves
elf = 1; elves = input.map((c) => {return {'cal': c, 'elf': (elf += (c === '' ? 1 : 0))}}).filter(e => e.cal !== '');

// group by elves
lastElves = []; groupedElves = elves.reduce((carry, elf) => {
  if (lastElves.length && elf.elf != lastElves[0].elf) {
    carry.push(lastElves); lastElves = [];
  }
  lastElves.push(elf);
  return carry;
}, []);

// add some metadata
groupedElvesWithMeta = groupedElves.map(group => {
  return {
    'elf': group[0].elf,
    'calories': group.map((elf) => parseInt(elf.cal)),
    'total': group.reduce((carry, elf) => carry + parseInt(elf.cal), 0)
  }
});

// sort by total, reverse and read first
groupedElvesWithMeta.sort((a, b) => a.total - b.total).reverse()[0].total
