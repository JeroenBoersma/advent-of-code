const createCRT = (clock) => {
  const crt = {},
    width = 40,
    height = 6,
    max = width * height,
    white = "#",
    black = ".";

  let blank = new Array(height)
      .fill(1)
      .map((i) => new Array(width).fill(1).map((p) => black)),
    output = [],
    register;

  const image = () => output.map((r) => r.join("")).join("\n"),
    clear = () => {
      output = [...blank.map((l) => [...l])];
    },
    signal = (cycle) => {
      if (!register) {
        return;
      }

      const pos = (cycle - 1) % max,
        X = register.X - 1,
        x = pos % width,
        y = Math.floor(pos / width),
        sprite = new Array(width).fill(black);

      sprite[X] = sprite[X + 1] = sprite[X + 2] = white;

      output[y][x] = sprite[x];
    },
    plug = (cpu) => {
      register = cpu.register;
      clock.hook(signal);
    },
    unplug = () => {
      register = null;
      clock.unhook(signal);
    };

  // create blank screen
  clear();

  crt.image = image;

  crt.plug = plug;
  crt.unplug = unplug;

  crt.clear = clear;

  return crt;
};

// create crt monitor
crt = createCRT(clock);

// Plug to cpu
crt.plug(cpu);

// stop the clock after 240 cycles
monitor.add("stop-crt", (cycle, clock) => cycle >= 240 && clock.stop());

// re-run programm
clock.reset();
cpu.run();
clock.start();

// Get the image
console.log(crt.image());

// ############### BONUS ###############

// show display during updates every four cycles
monitor.add('show-display', (crt => cycle => (cycle - 1) % 4 === 0 && console.log(crt.image()))(crt));

clock.reset();
cpu.run();
clock.start();
