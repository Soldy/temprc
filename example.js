
const temprc = new (require('./index.js')).temprc('db.js');

console.log(
    temprc.hash()
);
temprc.set('test1','hopp');
console.log(
    temprc.get('test1')
);
console.log(
    temprc.list()
);
console.log(
    temprc.hashCheck()
);
console.log(
    temprc.check('test1')
);
console.log(
    temprc.hash()
);
console.log(
    temprc.hashCheck()
);
console.log(
    temprc.del('test1')
);
