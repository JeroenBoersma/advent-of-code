input = document.body.firstChild.innerText.split("\n").filter((l) => l.length);

// My goal is to simulate
// a sync clock
// a cpu where you can write code to
// a monitor which can have tools

// like a real example where you don't have access to the cpu itself, but you can monitor it

// consider a clock
const bootClock = () => {
  const clock = {};

  let cycle = 0,
    hooks = [],
    running = false;

  const tick = () => {
      clock.cycle = ++cycle;
      hooks.map((h) => h(cycle, clock));

      running && setTimeout(tick, 0);
    },
    start = () => {
      running = true;
      tick();
    },
    stop = () => {
      running = false;
    },
    reset = () => {
      stop();
      clock.cycle = cycle = 0;
    },
    hook = (hook) => {
      hooks.push(hook);
    },
    unhook = (hook) => {
      hooks = hooks.filter((h) => h !== hook);
    };

  // properties
  clock.cycle = cycle;

  // control
  clock.start = start;
  clock.stop = stop;
  clock.reset = reset;
  clock.tick = tick;

  // hooks can be added and removed on a running clock
  clock.hook = hook;
  clock.unhook = unhook;

  return clock;
};

// consider a CPU
const bootCPU = (clock) => {
  const cpu = {},
    programm = [],
    register = { X: 1 };

  let running = false,
    step = 0;

  const write = (p) => {
      (programm.length = 0) || p.map((i) => programm.push(i));
      cpu.size = programm.length;
    },
    run = () => {
      end();
      running = true;
      clock.hook(next);
    },
    next = (cycle, clock) => {
      cpu.size = programm.length;
      (running &&
        step < programm.length &&
        (programm[step++](cpu, clock) || true)) ||
        end();
    },
    end = () => {
      running && clock.unhook(next);
      step = 0;
      running = false;
    };

  cpu.write = write;
  cpu.run = run;

  // My register
  cpu.register = register;
  cpu.size = 0;

  return cpu;
};

// consider a programm
const assembler = (input) => {
  // noop // one tick
  // addx // two ticks

  const noop = () => {},
    addx = (a) => (cpu) => (cpu.register.X += a);

  const programm = [];

  input.map((instr) => {
    switch (instr.substring(0, 4)) {
      case "noop":
        programm.push(noop);
        break;
      case "addx":
        // Is just a noop + add
        programm.push(noop);
        programm.push(addx(parseInt(instr.substring(5))));
        break;
    }
  });

  return programm;
};

// consider a output // a monitor replacement in our case
const createMonitor = (clock) => {
  const monitor = {};

  let services = [];

  const hook = (cycle, clock) => {
      services.map((s) => s.service(cycle, clock));
    },
    plug = () => {
      clock.hook(hook);
    },
    unplug = () => {
      clock.unhook(hook);
    },
    add = (name, service) => {
      remove(name);
      services.push({
        name: name,
        service: service,
      });
    },
    remove = (name) => {
      services = services.filter((s) => s.name !== name);
    };

  monitor.plug = plug;
  monitor.unplug = unplug;

  monitor.add = add;
  monitor.remove = remove;

  return monitor;
};

// calculate strength
const createCalculator = () => {
  const calculator = {};

  let total = 0;

  const strength = (cycle, x) => cycle * x,
    rule = (cycle) => (cycle - 20) % 40 === 0,
    reset = (cycle) => cycle === 1 && (calculator.total = total = 0),
    add = (cycle, x) => {
      reset(cycle);
      rule(cycle) && (total += strength(cycle, x));

      calculator.total = total;
    };

  calculator.add = add;
  calculator.total = total;

  return calculator;
};

// ##################### EXECUTION ##############

// now boot
clock = bootClock();

// assemle the programm
programm = assembler(input);

// create CPU
cpu = bootCPU(clock);

// load the programm
cpu.write(programm);

// Monitoring

// This is a smart device we are adding
monitor  = createMonitor(clock);

// attach our smart monitor
monitor.plug();

// auto stop
monitor.add('auto-stop', (cycle, clock) => {cycle > 500 && clock.stop();})

// Log X to console
monitor.add('monitor-x', ((cpu) => (cycle) => {
  ((cycle - 20) % 40 === 0) && cycle < cpu.size && console.log(`Current X on clock-cycle ${cycle}: ${cpu.register.X}`)
})(cpu));
//monitor.remove('monitor-x')

// Reset X if clock resets
monitor.add('reset-x', (cpu => cycle => cycle === 1 && (cpu.register.X = 1))(cpu));

// add calculator
calculator = createCalculator();
monitor.add('calculate-strength', ((cpu, calculator) => cycle => cpu.size > cycle && calculator.add(cycle, cpu.register.X))(cpu, calculator));

// run the programm
cpu.run(); // nothing happens until you start the clock

// run clock
//clock.reset();
clock.start();

// optionaly
clock.stop();

