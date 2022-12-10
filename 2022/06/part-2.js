// Yeah, allready created a constant for this ;)
// search for fourteen unique characters forward
const C=14; for (let a = 0; a < input.length - C; a++) {const chunk = input.substring(a,a+C), uniq = chunk.split('').sort().reduce((a, c) => {a.indexOf(c) === -1 && a.push(c); return a;}, []); if (uniq.length === C) {console.log(a+C, chunk); break;}}