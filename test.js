const nanoTest  = new (require('nanoTest')).test();
const temprc = new (require('./index.js')).base({});
temprc.easy(
    'db',
    'multi',
    'multi'
);


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
    'stats',
    {
        'function':temprc.stats
    },
    '!==',
    false
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
nanoTest.add(
    'size multi',
    {
        'function':temprc.size,
        'options':['multi']
    },
    '===',
    0
);

nanoTest.add(
    'empty multi',
    {
        'function':temprc.empty,
        'options':['multi']
    },
    '===',
    true
);



nanoTest.add(
    'check multi',
    {
        'function':temprc.check,
        'options':['test1','multi']
    },
    '===',
    false
);

nanoTest.add(
    'hash multi',
    {
        'function':temprc.hash,
        'options':['multi']
    },
    '===',
    '27c74670adb75075fad058d5ceaf7b20c4e7786c83bae8a32f626f9782af34c9a33'+
    'c2046ef60fd2a7878d378e29fec851806bbd9a67878f3a9f1cda4830763fd'
);

nanoTest.add(
    'hash check multi',
    {
        'function':temprc.hashCheck,
        'options':['multi']
    },
    '===',
    true
);


nanoTest.add(
    'stats',
    {
        'function':temprc.stats,
        'options':['multi']
    },
    '!==',
    false
);


nanoTest.add(
    'set multi',
    {
        'function':temprc.set,
        'options':['test1', 'hopp','multi']
    },
    '===',
    true
);

nanoTest.add(
    'size multi',
    {
        'function':temprc.size,
        'options':['multi']
    },
    '===',
    1
);

nanoTest.add(
    'empty',
    {
        'function':temprc.empty,
        'options':['multi']
    },
    '===',
    false
);


nanoTest.add(
    'get multi',
    {
        'function':temprc.get,
        'options':['test1','multi']
    },
    '===',
    'hopp'
);

nanoTest.add(
    'list multi',
    {
        'function':temprc.list,
        'optioons':['multi']
    },
    'j==',
    ['test1']
);


nanoTest.add(
    'check multi',
    {
        'function':temprc.check,
        'options':['test1','multi']
    },
    '===',
    true
);

nanoTest.add(
    'del multi',
    {
        'function':temprc.del,
        'options':['test1','multi']
    },
    '===',
    true
);

nanoTest.add(
    'check multi',
    {
        'function':temprc.check,
        'options':['test1','multi']
    },
    '===',
    false 
);
nanoTest.run();
