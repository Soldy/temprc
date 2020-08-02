const fs = require("fs");



exports.temprc=function(storageFile, indexes){
    /*
     * @public
     * @var boolean
     */
    this.save = function(){
        return save();
    };
    /*
     * @public
     * @var boolean
     */
    this.setup = function(name, value){
        if(
            (name === 'autosave')&&
            (([true,false]).indexOf(value)>-1)
        ){
            autoSave = value;
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
        if(typeof id !== "string")
            return false;
        if(typeof db[id] === "undefined")
            return undefined;
        return db[id];
    };
    /*
     * @param {string} id
     * @public
     * @var boolean
     */
    this.del=function(id){
        if(typeof id !== "string")
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
        if (typeof id !== "string")
            return false;
        if (typeof val === "underfined")
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
            (typeof id !== "string") ||
            (typeof db[id] !== "undefined")
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
            if(typeof db[id][i] !== "undefined")
                if(typeof dbIndex[i][db[id][i]] !== "undefined")
                    delete dbIndex[i][db[id][i]];
    };
    /*
     * @private
     */
    let indexTo = function(id, container){
        if(indexEnable === false)
            return false;
        for(let i in container)
            if(indexable.indexOf(i) > -1)
                 dbIndex[i][db[id][i]]=id;
    };
    /*
     * @private
     */
    let indexAll = function(id, container){
        if(indexEnable === false)
            return false;
        for(let id in db)
            indexTo(id, db[id]);
    };
    /*
     * @private
     */
    let read = function(){
        db = JSON.parse(
            fs.readFileSync(dbFile).toString()
        );
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
        writing = false;
        if (rewrite === false )
            return true;
        rewrite = false;
        return save();
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
    let db = {};
    /*
     * @private
     */
    let dbFile = storageFile;
    /*
     * @private
     */
    let indexEnable = false;
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


