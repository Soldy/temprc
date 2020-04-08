![alt tag](https://travis-ci.com/Soldy/confrc.svg?branch=master)


# confrc


```
{
   'config':'value'
}

```

```javascript

const confrc = new (require('./index.js')).confrc();

if(!confrc.check('someConfig'){
    process.exit(5); 
};
let someConfig = copnfrc.get('comeConfig');

```

