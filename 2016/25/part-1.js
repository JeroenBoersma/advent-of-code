input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// create parser
parser = (instructions, program, command) => Object.keys(instructions).indexOf(command.cmd) !== -1 && (instructions[command.cmd](...[program, ...command.args]) || true) || console.error(`Command ${command.cmd} not found`);
// create command reader
command = (line) => {const c = line.split(' '); return {'cmd': c.shift(), 'args': c}};
// add instructions
instructions = {};
// copy x on the register if a int or copies a value
instructions.cpy = (program, x, y) => program.register[y] = isNaN(x) ? program.register[x] : parseInt(x);
// increase x in the register
instructions.inc = (program, x) => program.register[x]++;
// decrease x in the register
instructions.dec = (program, x) => program.register[x]--;

// jump if x is non-zero to line y
instructions.jnz = (program, x, y) => (isNaN(x) && program.register[x] !== undefined && program.register[x] !== 0 || !isNaN(x) && parseInt(x) !== 0) && (program.line += y - 1)

instructions.out = (program, x) => program.output.push(isNaN(x) ? program.register[x] : parseInt(x));

// program
program = (code, input, instructions, maxRuns) => {
  maxRuns = maxRuns || 100000;
  const program = {line: 0, register: input, output: []};
  while (--maxRuns > 0 && code[program.line]) {
    parser(instructions, program, code[program.line]);
    program.line++;
  };
  return program.output;
}

// run program
program(
  input.map(l => command(l)),
  (register = {a: 0}),
  instructions
 );

// read register
register

// brute force
for (let a = 0; a < 1000; a++){output = program(
  input.map(l => command(l)),
  (register = {a: a}),
  instructions
 ).join(''); if (output.match(/^(01)+$/)) {console.log(a, output); break; }; }
// show found result
