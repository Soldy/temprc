const fs = require('fs');
const crypto = require('crypto');

exports.temprc=function(storageFile, indexes){
    /*
     * @public
     * @var boolean
     */
    this.save = function(){
        return save();
    };
    /*
     * @param {string} name
     * @param {string} value
     * @public
     * @var boolean
     */
    this.setup = function(name, value){
        if(
            (name.toLowerCase() === 'autosave')&&
            (([true,false]).indexOf(value)>-1)
        ){
            autoSave = value;
            return true;
        };
        if(
            (name.toLowerCase() === 'hash')&&
            (([true,false]).indexOf(value)>-1)
        ){
            hashCheck = value;
            return true;
        };
        return false;
    };
    /*
     * @public
     * @var boolean
     */
    this.indexRefresh = function(){

    }
    /*
     * @param {string} id
     * @public
     * @var mixed
     */
    this.get=function(id){
        if(typeof id !== 'string')
            return false;
        if(typeof db[id] === 'undefined')
            return undefined;
        return db[id];
    };
    /*
     * @public
     * @var string
     */
    this.hash=function(){
        return hashCalculation();
    };
    /*
     * @public
     * @var string
     */
    this.hashCheck=function(){
        return checkHash();
    };
    /*
     * @param {string} id
     * @public
     * @var boolean
     */
    this.del=function(id){
        if(typeof id !== 'string')
            return false;
        delete db[id];
        saveAuto();
        return true;
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     * @var  boolean
     */
    this.set=function(id, val){
        if (typeof id !== 'string')
            return false;
        if (typeof val === 'underfined')
            return false;
        db[id] = val;
        saveAuto();
        return true;
    };
    /*
     * @param {string}- id
     * @public
     * @var boolean
     */
    this.check=function(id){
        if(
            (typeof id !== 'string') ||
            (typeof db[id] !== 'undefined')
        )
            return true;
        return false;
    };
    /*
     * @public
     * @var object 
     */
    this.all=function(){
        return db;
    };
    /*
     *
     * @public
     * @var array
     */
    this.list=function(){
        let out = [];
        for(let i in  db)
            out.push(i);
        return out;
    };
    /*
     * @private
     */
    let indexClear = function(id){
        if(indexEnable === false)
            return false;
        for(let i of indexable)
            if(typeof db[id][i] !== 'undefined')
                if(typeof dbIndex[i][db[id][i]] !== 'undefined')
                    delete dbIndex[i][db[id][i]];
    };
    /*
     * @param {string}- id
     * @param {object}- container
     * @private
     * @var boolean
     */
    let indexTo = function(id, container){
        if(indexEnable === false)
            return false;
        for(let i in container)
            if(indexable.indexOf(i) > -1)
                 dbIndex[i][db[id][i]]=id;
        return true;
    };
    /*
     * @private
     * @var boolean
     */
    let indexAll = function(){
        if(indexEnable === false)
            return false;
        for(let id in db)
            indexTo(id, db[id]);
        return true;
    };
    /*
     * @private
     * @var boolean
     */
    let read = function(){
        db = JSON.parse(
            fs.readFileSync(dbFile).toString()
        );
        if (hashCheck === true)
            return checkHash();
        return true;
    };
    /*
     * @private
     * @var boolean
     */
    let checkHash = function(){
        readHash()
        return (
            hashCalculation() === hash
        );
    }
    /*
     * @private
     */
    let readHash = function(){
        hash=fs.readFileSync(dbFile+'.hash').toString();
    };
    /*
     * @private
     */
    let saveAuto = async function(){
        if(autoSave === true)
            return save();
        return false;
    };
    /*
     * @private
     */
    let save = async function(){
        if(writing === true)
            return rewrite = true;
        writing = true;
        fs.writeFileSync(
            dbFile,
            JSON.stringify(db)
        );
        if (hashCheck === true)
            saveHash();
        writing = false;
        if (rewrite === false )
            return true;
        rewrite = false;
        return save();
    };
    /*
     * @private
     */
    let saveHash =  function(){
        fs.writeFileSync(
            dbFile+'.hash',
            hashCalculation()
        );
    }
    /*
     * @private
     */
    let hashCalculation = function(){
        return crypto.createHash('sha512')
            .update(
                JSON.stringify(db),
                'utf8'
            )
            .digest('hex');
    }
    /*
     * @private
     */
    let writing = false;
    /*
     * @private
     */
    let rewrite = false;
    /*
     * @private
     */
    let autoSave = true;
    /*
     * @private
     */
    let indexEnable = false;
    /*
     * @private
     */
    let hashCheck = true;
    /*
     * @private
     */
    let hash = '';
    /*
     * @private
     */
    let db = {};
    /*
     * @private
     */
    let dbFile = storageFile;
    /*
     * @private
     * @var object
     */
    let dbIndex = {};
    /*
     * @private
     * @var array
     */
    let indexable = [];
    //costructor
    if(typeof indexes !== "undefined"){
        indexable = indexes;
        indexEnable = true;
        for(let i of indexable)
            dbIndex[i] = {};
    };
    try{
        read();
    }catch(e){};
};


