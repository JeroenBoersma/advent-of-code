// Use the flattree as input (contains all info)

// Add some variables
const totalSpace = 70000000, requiredSize = 30000000;

// Space needed
spaceNeeded = requiredSize - (totalSpace - flattree.directories.filter(d => d.path.length === 0)[0].size)

// find closest match, filter + sort
flattree.directories.filter(d => d.size >= spaceNeeded).sort((a, b) => (a.size - spaceNeeded) - (b.size - spaceNeeded))[0].size