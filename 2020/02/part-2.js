
// Update the rule
const createRule = (i) => new RegExp(i.replace(/^(\d+)-(\d+)\s(.+)$/, (m, first, second, char) => {
    first = parseInt(first) - 1;
    second = parseInt(second) - 2 - first;

    // either on the first place or on the second place
    return `^(.{${first}}${char}.{${second}}[^${char}]|.{${first}}[^${char}].{${second}}${char})`;
}))

passwords = input.map(i => i.split(': '))
    .map(i => {
        const password = {},
            rule = createRule(i[0]),
            match = (p) => p.match(rule),
            isValid = () => match(password.input) !== null;

        password.isValid = isValid;
        password.input = i[1];

        // Debug
        password.rule = rule;
        password.match = match(password.input);
        password.orig = i.join(': ');

        return password;
    });

passwords.filter(p => p.isValid()).length;

