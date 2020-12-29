'use strict';
const fs = require('fs');
const crypto = require('crypto');

/*
 * @param {string} storage file or directory or binary allocation
 * @param {array} indexes
 * @prototype
 */
 
exports.temprc=function(storageFD, setIn, indexes){
    /*
     * @public
     * @return {boolean}
     */
    this.save = function(){
        return save();
    };
    /*
     * @public
     * @return {object} setup
     */
    this.setup = function(){
        return setup;
    };
    /*
     * @public
     * @return {boolean}
     */
    this.indexRefresh = function(){

    };
    /*
     * @param {string} id
     * @public
     * @return {mixed}
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
     * @return {string}
     */
    this.hash=function(){
        return hashCalculation();
    };
    /*
     * @public
     * @return {string}
     */
    this.hashCheck=function(){
        return checkHash();
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
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
     * @return  {boolean}
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
     * @return {boolean}
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
     * @return {object}
     */
    this.full=function(){
        return db;
    };
    /*
     * @public
     * @return {object}
     */
    this.all=function(){
        let list = [];
        for (let i in db)
            list.push(db[i]);
        return list;
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list=function(){
        let out = [];
        for(let i in  db)
            out.push(i);
        return out;
    };
    /*
     * @public
     * @return integer
     */
    this.size=function(){
        return count();
    };
    /*
     * @public
     * @return {boolean}
     */
    this.empty=function(){
        if( 0 === parseInt(count()))
            return true;
        return false;
    };
    /*
     * @public
     * @return {object}
     */
    this.stats=function(){
        count();
        return stats;
    };
    /*
     * @param {object}
     * @public
     * @return {boolean}
     */
    this.importing = function(importDb){
        db = importDb;
        return true;
    };
    /*
     * @private
     */
    let indexClear = function(id){
        if(setup.get('indexEnable') === false)
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
     * @return {boolean}
     */
    let indexTo = function(id, container){
        if(setup.get('indexEnable') === false)
            return false;
        for(let i in container)
            if(indexable.indexOf(i) > -1)
                dbIndex[i][db[id][i]]=id;
        updateLastSet();
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    let indexAll = function(){
        if(setup.get('indexEnable') === false)
            return false;
        for(let id in db)
            indexTo(id, db[id]);
        updateLastSet();
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    let read = function(){
        db = JSON.parse(
            fs.readFileSync(dbFD).toString()
        );
        if (setup.get('hashCheck') === true)
            return checkHash();
        updateLastRead();
        return true;
    };
    /*
     * @private
     * @return {integer}
     */
    let count = function (){
        if(stats.lastCount > stats.lastSet)
            return stats.count;
        let out = 0;
        let index = 0;
        for(let i in db){
            out++;
            index+=i.length;
        }
        stats.count     = out;
        stats.index     = index;
        stats.bytes     = JSON.stringify(db).toString().length;
        stats.lastCount = (+new Date);
        return out;
    };
    /*
     * @private
     * @return {boolean}
     */
    let checkHash = function(){
        readHash();
        (
            hashCalculation() === hash
        );
    };
    /*
     * @private
     * @return {void}
     */
    let readHash = function(){
        hash=fs.readFileSync(dbFD+'.hash').toString();
    };
    /*
     * @private
     * @return {boolean}
     */
    let saveAuto = async function(){
        if(setup.get('autoSave') === true)
            return await save();
        return false;
    };
    /*
     * @private
     * @return {boolean}
     */
    const save = async function(){
        if(writingWait === true)
            return true;
        writingProcess = setTimeout(
            saveDo,
            setup.get('delayedSave')
        );
        writingWait = true;
    };
    /*
     * @private
     * @return {boolean}
     */
    let saveDo = async function(){
        writingWait = false;
        if(writing === true)
            return rewrite = true;
        writing = true;
        fs.writeFileSync(
            dbFD,
            JSON.stringify(db)
        );
        if (setup.get('hashCheck') === true)
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
            dbFD+'.hash',
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
     * @return {boolean}
     */
    let updateLastGet = function (){
        stats.lastSet = (+new Date);
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    let updateLastSet = function (){
        stats.lastSet = (+new Date);
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    let updateLastSave = function (){
        stats.lastSave = (+new Date);
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    let updateLastRead = function (){
        stats.lastRead = (+new Date);
        return true;
    };
    /*
     * @private
     * @var {dictonary}
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
     * @var {timeout}
    */
    let writingProcess;
    /*
     * @private
     * @var {boolean}
     */
    let writingWait = false ;
    /*
     * @private
     * @var {boolean}
     */
    let writing = false;
    /*
     * @private
     * @var {boolean}
     */
    let rewrite = false;
    /*
     * setup  helper
     * @private
     */
    let setup = setIn;
    /*
     * @private
     * @var {boolean}
     */
    let hash = '';
    /*
     * @private
     */
    let db = {};
    /*
     * @private
     * @var {boolean}
     */
    let dbFD = storageFD;
    /*
     * @private
     * @var {dictonary}
     */
    let dbIndex = {};
    /*
     * @private
     * @var {array}
     */
    let indexable = [];
    //costructor
    if(typeof indexes !== 'undefined'){
        indexable = indexes;
        setup.set('indexEnable',  true);
        for(let i of indexable)
            dbIndex[i] = {};
    }

    try{
        read();
    }catch(e){}
};


