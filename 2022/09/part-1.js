input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// create tracker
const createTracker = () => {
  const tracker = {
    'head': {'x': 0, 'y': 0, 'visited': {}, 'trail': []},
    'tail': {'x': 0, 'y': 0, 'visited': {}, 'trail': []}
  };

  // log inital positions
  logTrail(tracker.head);
  logTrail(tracker.tail);

  return tracker;
}

// add logger
const logTrail = (knot) => {
  const key = `${knot.x},${knot.y}`;

  knot.trail.push({
    'x': knot.x,
    'y': knot.y
  });

  knot.visited[key] = knot.visited[key] || 1;
  knot.visited[key]++;
}

// create mover
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

  for (let a = 0, distance = 0; a < movement; a++) {
    // head just always moves
    tracker.head[d] += m;
    logTrail(tracker.head);

    // tail needs to drag if distance >= 2
    let distance = Math.max(Math.abs(tracker.head.x - tracker.tail.x), Math.abs(tracker.head.y - tracker.tail.y));

    // So far away
    if (distance > 1) {
      tracker.tail.x = tracker.head.x;
      tracker.tail.y = tracker.head.y;

      // Move to last position of the head
      tracker.tail[d] -= m;
      logTrail(tracker.tail);
    }
  }

  return tracker;
};

// excute command
tracker = input.map(i => i.split(' ')).reduce((tracker, i) => mover(tracker, i[0], parseInt(i[1])), createTracker());

// get visited positions
Object.keys(tracker.tail.visited).length;
