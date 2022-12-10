// new strategy on same input

// list all -1st basements
input.split('').reduce((f, d, i) => ((f === -1 && console.log(i)) && false || (f += d === '(' ? 1 : -1)), 0);
// read first one