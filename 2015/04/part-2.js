
const zeroLength = 6, zeros = (new Array(zeroLength)).fill('0').join(''), limit = 10000000;
for (let i=0;i<limit;i++) {const give = input + i, hash = MD5(give); if (hash.substr(0, zeroLength) === zeros) {console.log(i, hash);break}}
