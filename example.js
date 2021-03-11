
const temprc = new (require('./index.js')).base({});
temprc.create({
    "storage":"db",
    "name":"multi",
    "type":"multi"
});

(async function(){
console.log(
    temprc.hash()
);
console.log(
    temprc.set('test1','hopp')
);
console.log(
    temprc.get('test1')
);
console.log(
    temprc.list()
);
console.log(
    temprc.check('test1')
);
console.log(
    temprc.hash()
);
console.log(
    temprc.del('test1')
);
console.log(
    temprc.hash('multi')
);
console.log(
    temprc.set('test1','hopp', 'multi')
);
console.log(
    temprc.get('test1','multi')
);
console.log(
    temprc.list('multi')
);
console.log(
    temprc.check('test1','multi')
);
console.log(
    temprc.hash('multi')
);

console.log(
    temprc.del('test1', 'multi')
);


})();
