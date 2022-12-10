input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// Create helpers to turn data into usefull stuff
parser = (structure, output) => {
    if (output[0] === '$') { // command
      const command = output.substring(2, 4);
      if (command === 'cd') {
         const direction = output.substring(5);
         if (direction === '..') {
           structure.path.length && structure.path.pop(); // one level up
         } else if (direction === '/') {
           structure.path = ['']; // root dir
           structure.directories.push({
             'name': '/',
             'size': 0,
             'files': [],
             'path': []
           });
         } else {
           // Sanity check --- it's the filesystem you know
           if (structure.directories.filter(d => d.path.join('/') === structure.path.join('/')).filter(d => d.name === direction).length < 1) {
             console.error(`Cannot move into non-existing directory ${structure.path.join('/')}/${direction}`);
           }
           structure.path.push(direction); // one level down
         }
      }
      // ls can be ignored because it's the only other command
    } else {
      // read directories and files where directories are not that important having the structure
      if (output.substring(0, 4) !== 'dir ') {
        const file = output.match(/^(\d+)\s+(.+)$/);
        structure.files.push({
          'name': file[2],
          'size': parseInt(file[1]),
          'path': [...structure.path]
        });
      } else {
        // sanity check if directory exists
        structure.directories.push({
          'name': output.substring(4),
          'size': 0,
          'files': [],
          'path': [...structure.path]
        });
      }
    }

    return structure;
  }

  // transform to flat tree with files and directories
  flattree = input.reduce(parser, {path: [], files: [], directories: []})
  // add total size per directories
  flattree.directories.forEach(d => {const l = d.path.length, p = d.path.join('/') + '/' + d.name; d.files = flattree.files.filter(f => l === 0 || f.path.join('/').indexOf(p) === 0); d.size = d.files.reduce((t, f) => t + f.size, 0)})

  // find large directories
  flattree.directories.filter(d => d.size < 100000).reduce((t, d) => t + d.size, 0);