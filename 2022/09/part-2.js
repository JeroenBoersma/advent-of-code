// consider a length
const ROPE_LENGTH = 10;

// refactor createTracker can make a long ropes
const createTracker = (ropeLength) => {
  const init = JSON.stringify({'x': 0, 'y': 0, 'visited': {}, 'trail': []}),
        tracker = {
          'head': JSON.parse(init),
          'tail': (new Array(ropeLength-1)).fill(1).map(() => JSON.parse(init))
        };

  // log inital positions
  logTrail(tracker.head);
  tracker.tail.map(t => logTrail(t));

  return tracker;
}

// Add measure distances between 2 items
const measureDistance = (head, tail, axis) => Math.abs(head[axis] - tail[axis]);
const withinDistance = (head, tail) => Math.max(measureDistance(head, tail, 'x'), measureDistance(head, tail, 'y')) <= 1;

// Refactor mover so it can drag a long tail
const mover = (tracker, direction, movement) => {
  let d = 'x', m = 1;
  switch (direction) {
    case 'U':
      d = 'y';
    case 'L':
      m = -1;
      break;
    case 'D':
      d = 'y';
    case 'R':
      break;
    default:
      console.log(`Direction "${direction}" not defined`);
  }

  for (let a = 0; a < movement; a++) {
    // head just always moves
    tracker.head[d] += m;
    logTrail(tracker.head);

    // now we need to move every tail, every tail is anothers head
    tracker.tail.reduce((head, tail, index) => {

      // So far away, check where to move next
      if (! withinDistance(head, tail)) {

        const distance = {
          'x': head.x - tail.x,
          'y': head.y - tail.y
        };

        tail.x += distance.x < 0 ? Math.max(-1, distance.x) : Math.min(1, distance.x);
        tail.y += distance.y < 0 ? Math.max(-1, distance.y) : Math.min(1, distance.y);
      }

      // Log result
      logTrail(tail);
      // Next knot
      return tail;

      // I totally went bazinka on this one, utter failure.. see history... KISS was the solution
      // This is why we have plotters, reversers, and everything now
    }, tracker.head);
  }

  return tracker;
};

// plotter - helper to find pesky bug
const plotter = (tracker, step) => {

  step = step !== undefined ? parseInt(step) : tracker.head.trail.length - 1;

  if (!tracker.head.trail[step]) return;

  // normalize
  const knots = [
    tracker.head.trail[step],
    ...(tracker.tail.map(k => k.trail[step]))
  ];

  // search size
  const size = tracker.head.trail.slice(0, step).reduce((size, t) => {

    size.minX = Math.min(size.minX, t.x);
    size.maxX = Math.max(size.maxX, t.x);

    size.minY = Math.min(size.minY, t.y);
    size.maxY = Math.max(size.maxY, t.y);

    return size;
  }, {'minX': 0, 'minY': 0, 'maxX': 0, 'maxY': 0});

  // Initialize grid + margin of 1
  const grid = (new Array(size.maxY - size.minY + 3)).fill(1).map(() => (new Array(size.maxX - size.minX + 3)).fill('.'));

  grid.toString = (c) => grid.map(l => l.join(c !== undefined ? c : '')).join('\n');

  // Plot tail of last item
  grid[1 + 0 - size.minY][1 + 0 - size.minX] = 's';

  // plot tail
  if (step === tracker.head.trail.length - 1) {
    tracker.tail.slice(-1)[0].trail.map(knot => {
      grid[1 + knot.y - size.minY][1 + knot.x - size.minX] = '#';
    });
  }

  // Plot knots on grid
  const l = knots.length - 1;
  knots.reverse().map((knot, i) => {
    grid[1 + knot.y - size.minY][1 + knot.x - size.minX] = l - i === 0 ? 'H' : (l-i);
  });

  return grid;
}

// replay a recorded trail
const play = (tracker) => {

  const duration = tracker.head.trail.length, interval = 150;

  let step = 0, i;

  const e = () => {
    if (step >= duration) {
      stop();
      return;
    }

    console.clear();
    console.log(plotter(tracker, step++).toString());
  }

  const stop = () => clearInterval(i);

  i = setInterval(e, interval);

  return stop;
};

// it would be awesome to go back in time to debug that pesky little bug || THIS ITSELF IS BUGGY :-/
const reverse = (tracker) => {
  const knots = [...tracker.tail];

  if (tracker.head.trail.length < 2) {
    // oldest
    return tracker;
  }

  knots.unshift(tracker.head);

  knots.map(knot => {
    // reduce current visited
    const key = `${knot.x},${knot.y}`,
          last = knot.trail.pop(); // reduce trail

    knot.visited[key]--;
    knot.visited[key] === 0 && delete knot.visited[key];

    // set position to last
    knot.x = last.x;
    knot.y = last.y;
  });

  return tracker;
}

// Run with length
tracker = input.map(i => i.split(' ')).reduce((tracker, i) => mover(tracker, i[0], parseInt(i[1])), createTracker(ROPE_LENGTH));
Object.keys(tracker.tail[tracker.tail.length - 1].visited).length;

// Plot output
console.log(plotter(tracker).toString());

// Reverse a step - known buggy :-p
reverse(tracker)
