input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const createRule = (i) => new RegExp(i.replace(/^(\d+)-(\d+)\s(.+)$/, '([^$3]|^)$3{$1,$2}([^$3]|$)'))

passwords = input.map(i => i.split(': '))
    .map(i => {
        const password = {},
            rule = createRule(i[0]),
            match = (p) => p.match(rule),
            isValid = () => match(password.input.split('').sort().join('')) !== null;

        password.isValid = isValid;
        password.input = i[1];

        // Debug
        // password.sorted = password.input.split('').sort().join('');
        // password.rule = rule;
        // password.match = match(password.sorted);
        // password.orig = i.join(': ');

        return password;
    });

// Non matching
// passwords.filter(p => !p.isValid());

passwords.filter(p => p.isValid()).length;
