# temprc

##What is this?

It is a binary tree holder for my science projects.\
I used MongoDB for this purpose in the past. However, an interaction changes 90% of the set. Saving variables one by one with separated calls is slow. More effective to store everything with one shot from time to time.\
The temprc can work in two ways.Single or multi.\

###Single

The single is relatively easy to save everything to one big JSON file.\
The top-level keys are accessible from the control interface. This is fine when the set is smaller than 2 Gigabytes.  If not, there is the Multi.\


###Multi

The multi is a separate file store for a collection of over 2 gigabytes. But the value has to be less than 2 gigabytes.






Example:

``` javascript
    const temprc = new (require('temprc')).base({
        'storage':'storage', // storage file or directory'
        'type':'single', // database type (single or multi) /optional/
        'name':'name' // database name /optional/
    });

    temprc.set('variable', {'test':'test string'}, 'database');

    let data = await temprc.get('variable', 'database');
    console.log(data.test);
    //    output : test string

```



Set variable :


``` javascript
    temprc.set(name, data, 'database');

```


Get variable :


``` javascript
    let out = await temprc.get(name, 'database');
    // out = value

```

Check variable existence :


``` javascript
    let out = await temprc.check(name, 'database');
    // out = true or false (boolean)

```

List all stored variable : 

```javascript

    let out = await temprc.list('database');
    // out = [all variable name] (array)

```

Get all elements form the db:

```javascript
    let out = await temprc.all('database');
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



