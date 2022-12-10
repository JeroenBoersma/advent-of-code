input = document.body.firstChild.innerHTML.split('\n').filter(l => l.length)[0];
// search for four unique characters forward
const C=4; for (let a = 0; a < input.length - C; a++) {const chunk = input.substring(a,a+C), uniq = chunk.split('').sort().reduce((a, c) => {a.indexOf(c) === -1 && a.push(c); return a;}, []); if (uniq.length === C) {console.log(a+C, chunk); break;}}
// echoes the number + the chunk