const nanoTest  = new (require("nanoTest")).test();
const temprc = new (require('./index.js')).temprc('db.js');


nanoTest.add(
    "check test1 check",
    {
        "function":temprc.check,
        "options":['test1']
    },
    "===",
    false
);

nanoTest.add(
    "check test1 set",
    {
        "function":temprc.set,
        "options":['test1', 'hopp']
    },
    "===",
    true
);

nanoTest.add(
    "check test1 get",
    {
        "function":temprc.get,
        "options":['test1']
    },
    "===",
    "hopp"
);

nanoTest.add(
    "check test1 check ",
    {
        "function":temprc.check,
        "options":['test1']
    },
    "===",
    true
);

nanoTest.add(
    "check test1 del ",
    {
        "function":temprc.del,
        "options":['test1']
    },
    "===",
    true
);

nanoTest.add(
    "check test1 check ",
    {
        "function":temprc.check,
        "options":['test1']
    },
    "===",
   false 
);
nanoTest.run();
