
const temprc = new (require('./index.js')).base({});
temprc.create({
    "storage":"db",
    "name":"multi",
    "type":"multi"
});

(async function(){
console.log(
    await temprc.hash()
);
console.log(
    await temprc.set('test1','hopp')
);
console.log(
    await temprc.get('test1')
);
console.log(
    await temprc.list()
);
console.log(
    await temprc.check('test1')
);
console.log(
    await temprc.hash()
);
console.log(
    await temprc.del('test1')
);
console.log(
    await temprc.hash('multi')
);
console.log(
    await temprc.set('test1','hopp', 'multi')
);
console.log(
    await temprc.get('test1','multi')
);
console.log(
    await temprc.list('multi')
);
console.log(
    await temprc.check('test1','multi')
);
console.log(
    await temprc.hash('multi')
);

console.log(
    await temprc.del('test1', 'multi')
);


})();
