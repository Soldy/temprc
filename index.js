const fs = require("fs");



exports.temprc=function(storageFile){
    /*
     * @param {string} id
     * @public
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
     */
    this.del=function(id){
        if(typeof id !== "string")
            return false;
        delete db[id];
        save();
        return true;
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     */
    this.set=function(id, val){
        if (typeof id !== "string")
            return false;
        if (typeof val === "underfined")
            return false;
        db[id] = val;
        save();
        return true;
    };
    /*
     * @param {string}- id
     * @public
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
     */
    this.all=function(){
        if(
            (typeof id !== "string") ||
            (typeof db[id] !== "undefined")
        )
            return true;
        return false;
    };
    /*:
     * @private
     */
    let index = function(){
        db = JSON.parse(fs.readFileSync(dbFile).toString());
    };
    /*:
     * @private
     */
    let read = function(){
        db = JSON.parse(fs.readFileSync(dbFile).toString());
    };
    /*
     *@private
     */
    let save = async function(){
        if(writing === true)
            return rewrite = true;
        writing = true;
        fs.writeFileSync(dbFile, JSON.stringify(db));
        writing = false;
        if (rewrite === false )
            return true;
        rewrite = false;
        return save();
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
    let db = {};
    /*
     * @private
     */
    let dbFile = storageFile;
    //costructor
};


