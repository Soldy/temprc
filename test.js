const nanoTest  = new (require('nanoTest')).test();
const temprc = new (require('./index.js')).temprc('db.js');

nanoTest.add(
    'size',
    {
        'function':temprc.size,
        'options':[]
    },
    '===',
    0
);

nanoTest.add(
    'empty',
    {
        'function':temprc.empty,
        'options':[]
    },
    '===',
    true
);



nanoTest.add(
    'check',
    {
        'function':temprc.check,
        'options':['test1']
    },
    '===',
    false
);

nanoTest.add(
    'hash',
    {
        'function':temprc.hash
    },
    '===',
    '27c74670adb75075fad058d5ceaf7b20c4e7786c83bae8a32f626f9782af34c9a33'+
    'c2046ef60fd2a7878d378e29fec851806bbd9a67878f3a9f1cda4830763fd'
);

nanoTest.add(
    'hash check',
    {
        'function':temprc.hashCheck
    },
    '===',
    true
);


nanoTest.add(
    'set',
    {
        'function':temprc.set,
        'options':['test1', 'hopp']
    },
    '===',
    true
);

nanoTest.add(
    'size',
    {
        'function':temprc.size,
        'options':[]
    },
    '===',
    1
);

nanoTest.add(
    'empty',
    {
        'function':temprc.empty,
        'options':[]
    },
    '===',
    false
);


nanoTest.add(
    'get',
    {
        'function':temprc.get,
        'options':['test1']
    },
    '===',
    'hopp'
);

nanoTest.add(
    'list',
    {
        'function':temprc.list
    },
    'j==',
    ['test1']
);


nanoTest.add(
    'check ',
    {
        'function':temprc.check,
        'options':['test1']
    },
    '===',
    true
);

nanoTest.add(
    'del ',
    {
        'function':temprc.del,
        'options':['test1']
    },
    '===',
    true
);

nanoTest.add(
    'check ',
    {
        'function':temprc.check,
        'options':['test1']
    },
    '===',
    false 
);
nanoTest.run();
