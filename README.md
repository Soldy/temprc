# temprc

Simple temporaly full block data storage for scientific calculation.




Example:

``` javascript
    const temprc = new (require('temprc')).base({
        'storage':'storage', // storage file or directory'
        'type':'single', // database type (single or multi) /optional/
        'name':'name' // database name /optional/
    });

    temprc.set('variable', {'test':'test string'}, 'database');

    let data = temprc.get('variable', 'database');
    console.log(data.test);
    //    output : test string

```



Set variable :


``` javascript
    temprc.set(name, data, 'database');

```


Get variable :


``` javascript
    let out = temprc.get(name, 'database');
    // out = value

```

Check variable existence :


``` javascript
    let out = temprc.check(name, 'database');
    // out = true or false (boolean)

```

List all stored variable : 

```javascript

    let out = temprc.list('database');
    // out = [all variable name] (array)

```

Get all elements form the db:

```javascript
    let out = temprc.all('database');
    // out = object with all element
```

Remove one element:

```javascript

   let out = temprc.del(name, database);
   // out = true or false (boolean)
```

Force data save 

```javascript

   temprc.save('database');
```

Setup autosave (enable/disable)

```javascript

   temprc.setup('autosave', true || false, 'database');
   // default is : true
```

Setup hash (enable/disable)

```javascript

   temprc.setup('hash', true || false, 'database');
   // default is : true
```



