// strart from sections

// replace checkOverlap functionality
checkOverlap = (s) => s[0][1] >= s[1][0] && s[0][0] <= s[1][1] || s[1][1] >= s[0][0] && s[1][0] <= s[0][1];

// get overlapping itms
overlapping = sections.filter(checkOverlap);
overlapping.length;
