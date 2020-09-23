const fs = require('fs');
const crypto = require('crypto');

exports.temprc=function(storageFile, indexes){
    /*
     * @public
     * @returns {boolean}
     */
    this.save = function(){
        return save();
    };
    /*
     * @param {string} name
     * @param {string} value
     * @public
     * @returns boolean
     */
    this.setup = function(name, value){
        if(
            (name.toLowerCase() === 'autosave')&&
            (([true,false]).indexOf(value)>-1)
        ){
            autoSave = value;
            return true;
        }
        if(
            (name.toLowerCase() === 'hash')&&
            (([true,false]).indexOf(value)>-1)
        ){
            hashCheck = value;
            return true;
        }
        return false;
    };
    /*
     * @public
     * @returns boolean
     */
    this.indexRefresh = function(){

    };
    /*
     * @param {string} id
     * @public
     * @returns mixed
     */
    this.get=function(id){
        if(typeof id !== 'string')
            return false;
        if(typeof db[id] === 'undefined')
            return undefined;
        updateLastGet();
        return db[id];
    };
    /*
     * @public
     * @returns string
     */
    this.hash=function(){
        return hashCalculation();
    };
    /*
     * @public
     * @returns string
     */
    this.hashCheck=function(){
        return checkHash();
    };
    /*
     * @param {string} id
     * @public
     * @returns boolean
     */
    this.del=function(id){
        if(typeof id !== 'string')
            return false;
        delete db[id];
        saveAuto();
        updateLastSet();
        return true;
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     * @returns  boolean
     */
    this.set=function(id, val){
        if (typeof id !== 'string')
            return false;
        if (typeof val === 'undefined')
            return false;
        db[id] = val;
        saveAuto();
        updateLastSet();
        return true;
    };
    /*
     * @param {string}- id
     * @public
     * @returns boolean
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
     * @returns object 
     */
    this.all=function(){
        return db;
    };
    /*
     *
     * @public
     * @returns array
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
        updateLastSet();
    };
    /*
     * @param {string}- id
     * @param {object}- container
     * @private
     * @returns boolean
     */
    let indexTo = function(id, container){
        if(indexEnable === false)
            return false;
        for(let i in container)
            if(indexable.indexOf(i) > -1)
                dbIndex[i][db[id][i]]=id;
        updateLastSet();
        return true;
    };
    /*
     * @private
     * @returns boolean
     */
    let indexAll = function(){
        if(indexEnable === false)
            return false;
        for(let id in db)
            indexTo(id, db[id]);
        updateLastSet();
        return true;
    };
    /*
     * @private
     * @returns boolean
     */
    let read = function(){
        db = JSON.parse(
            fs.readFileSync(dbFile).toString()
        );
        if (hashCheck === true)
            return checkHash();
        updateLastRead();
        return true;
    };
    /*
     * @private
     * @returns boolean
     */
    let checkHash = function(){
        readHash();
        return (
            hashCalculation() === hash
        );
    };
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
        updateLastSave();
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
    };
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
    };
    /*
     * @private
     * @returns boolean
     */
    let updateLastGet = function (){
        stats.lastSet = (+new Date);
        return true;
    };
    /*
     * @private
     * @returns boolean
     */
    let updateLastSet = function (){
        stats.lastSet = (+new Date);
        return true;
    };
    /*
     * @private
     * @returns boolean
     */
    let updateLastSave = function (){
        stats.lastSave = (+new Date);
        return true;
    };
    /*
     * @private
     * @returns boolean
     */
    let updateLastRead = function (){
        stats.lastRead = (+new Date);
        return true;
    };
    /*
     * @private
     * @returns object
     *
     */
    let stats = {
        count:0,
        bytes:0,
        index:0,
        start:(+new Date),
        lastSet:(+new Date),
        lastGet:(+new Date),
        lastSave:(+new Date),
        lastCount:(+new Date)
    };
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
    if(typeof indexes !== 'undefined'){
        indexable = indexes;
        indexEnable = true;
        for(let i of indexable)
            dbIndex[i] = {};
    }
    try{
        read();
    }catch(e){}
};


