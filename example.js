
const temprc = new (require('./index.js')).base({});

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
})();
