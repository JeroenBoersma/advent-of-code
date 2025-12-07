const input = document.body.firstChild.innerText.split('\n\n').filter(l => l.length);


const ranges = input[0].split('\n').map(r => r.split('-').map(i => parseInt(i))),
      ingredients = input[1].split('\n').filter(l => l.length).map(r => parseInt(r)),
      howFresh = () => ingredients.filter(i => ranges.reduce((c, [b, e]) => c || (b <= i && i <= e), false)).length;


console.log(howFresh());