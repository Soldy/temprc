![alt tag](https://travis-ci.com/Soldy/temprc.svg?branch=master)


# temprc

Simple temporally full block data storage for scientific calculation.




Example:

``` javascript
    const temprc = new (require('temprc')).temprc('tempdb');

    temprc.set('variable', {'test':'test string'});

    let data = temprc.get('variable');
    console.log(data.test);
    //    output : test string

```



Set variable :


``` javascript
    temprc.set(name, data);

```


Get variable :


``` javascript
    let out = temprc.get(name);
    // out = value

```

Check variable existence :


``` javascript
    let out = temprc.check(name);
    // out = true or false (boolean)

```

List all stored variable : 

```javascript

    let out = temprc.list();
    // out = [all variable name] (array)

```

Get all elements form the db:

```javascript
    let out = temprc.all();
    // out = object with all element
```

Remove one element:

```javascript

   temprc.del(name);
   // out = true or false (boolean)
```

Force data save 

```javascript

   temprc.save();
```

Setup autosave (enable/disable)

```javascript

   temprc.setup('autosave', true || false);
   // default is : true
```

Setup hash (enable/disable)

```javascript

   temprc.setup('hash', true || false);
   // default is : true
```



