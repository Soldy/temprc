/*
 *  @Soldy\temprc\single\2021.01.16\GPL3
 */
'use strict';
const fs = require('fs');
const crypto = require('crypto');

/*
 * @param {string} storage file or directory or binary allocation
 * @param {setuprc} setIn
 * @param {array} indexes
 * @prototype
 */
const singleFileBase=function(storageFD, setIn, indexes){
    /*
     * @public
     * @return {boolean}
     */
    this.save = function(){
        return _save();
    };
    /*
     * @public
     * @return {object} setup
     */
    this.setup = function(){
        return _setup;
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
        if(typeof _db[id] === 'undefined')
            return undefined;
        _updateLastGet();
        return _db[id];
    };
    /*
     * @public
     * @return {string}
     */
    this.hash=function(){
        return _hashCalculation();
    };
    /*
     * @public
     * @return {string}
     */
    this.hashCheck=function(){
        return _checkHash();
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
     */
    this.del=function(id){
        if(typeof id !== 'string')
            return false;
        delete _db[id];
        _saveAuto();
        _updateLastSet();
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
        _db[id] = val;
        _saveAuto();
        _updateLastSet();
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
            (typeof _db[id] !== 'undefined')
        )
            return true;
        return false;
    };
    /*
     * @public
     * @return {object}
     */
    this.full=function(){
        return _db;
    };
    /*
     * @public
     * @return {object}
     */
    this.all=function(){
        let list = [];
        for (let i in _db)
            list.push(_db[i]);
        return list;
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list=function(){
        let out = [];
        for(let i in  _db)
            out.push(i);
        return out;
    };
    /*
     * @public
     * @return integer
     */
    this.size=function(){
        return _count();
    };
    /*
     * @public
     * @return {boolean}
     */
    this.empty=function(){
        if( 0 === parseInt(_count()))
            return true;
        return false;
    };
    /*
     * @public
     * @return {object}
     */
    this.stats=function(){
        _count();
        return _stats;
    };
    /*
     * @param {object}
     * @public
     * @return {boolean}
     */
    this.importing = function(importDb){
        _db = importDb;
        return true;
    };
    /*
     * @private
     */
    const indexClear = function(id){
        if(_setup.get('indexEnable') === false)
            return false;
        for(let i of _indexable)
            if(typeof _db[id][i] !== 'undefined')
                if(typeof _dbIndex[i][_db[id][i]] !== 'undefined')
                    delete _dbIndex[i][_db[id][i]];
        _updateLastSet();
    };
    /*
     * @param {string}- id
     * @param {object}- container
     * @private
     * @return {boolean}
     */
    const _indexTo = function(id, container){
        if(_setup.get('indexEnable') === false)
            return false;
        for(let i in container)
            if(_indexable.indexOf(i) > -1)
                _dbIndex[i][_db[id][i]]=id;
        _updateLastSet();
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _indexAll = function(){
        if(_setup.get('indexEnable') === false)
            return false;
        for(let id in _db)
            _indexTo(id, _db[id]);
        _updateLastSet();
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _read = function(){
        _db = JSON.parse(
            fs.readFileSync(_dbFD).toString()
        );
        if (_setup.get('hashCheck') === true)
            return _checkHash();
        _updateLastRead();
        return true;
    };
    /*
     * @private
     * @return {integer}
     */
    const _count = function (){
        if(_stats.lastCount > _stats.lastSet)
            return _stats.count;
        let out = 0;
        let index = 0;
        for(let i in _db){
            out++;
            index+=i.length;
        }
        _stats.count     = out;
        _stats.index     = index;
        _stats.bytes     = JSON.stringify(_db).toString().length;
        _stats.lastCount = (Date.now());
        return out;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _checkHash = function(){
        _readHash();
        return (
            _hashCalculation() === _hash
        );
    };
    /*
     * @private
     * @return {void}
     */
    const _readHash = function(){
        _hash=fs.readFileSync(_dbFD+'.hash').toString();
    };
    /*
     * @private
     * @return {boolean}
     */
    const _saveAuto = async function(){
        if(_setup.get('autoSave') === true)
            return await _save();
        return false;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _save = async function(){
        if(_writingWait === true)
            return false;
        if(_writingProcess !== false)
            return clearTimeout(_writingProcess);
        _writingProcess = setTimeout(
            _saveDo,
            _setup.get('delayedSave')
        );
        _writingWait = true;
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _saveDo = async function(){
        _writingWait = false;
        if(_writing === true)
            return _rewrite = true;
        _writingProcess = false;
        _writing = true;
        fs.writeFileSync(
            _dbFD,
            JSON.stringify(_db)
        );
        if (_setup.get('hashCheck') === true)
            _saveHash();
        _writing = false;
        _updateLastSave();
        if (_rewrite === false )
            return true;
        _rewrite = false;
        return _save();
    };
    /*
     * @private
     */
    const _saveHash =  function(){
        fs.writeFileSync(
            _dbFD+'.hash',
            _hashCalculation()
        );
    };
    /*
     * @private
     */
    const _hashCalculation = function(){
        return crypto.createHash('sha512')
            .update(
                JSON.stringify(_db),
                'utf8'
            )
            .digest('hex');
    };
    /*
     * @private
     * @return {boolean}
     */
    const _updateLastGet = function (){
        _stats.lastSet = (Date.now());
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _updateLastSet = function (){
        _stats.lastSet = (Date.now());
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _updateLastSave = function (){
        _stats.lastSave = (Date.now());
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _updateLastRead = function (){
        _stats.lastRead = (Date.now());
        return true;
    };
    /*
     * @private
     * @var {dictonary}
     */
    let _stats = {
        count:0,
        bytes:0,
        index:0,
        start:(Date.now()),
        lastSet:(Date.now()),
        lastGet:(Date.now()),
        lastSave:(Date.now()),
        lastCount:(Date.now())
    };
    /*
     * @private
     * @var {timeout}
    */
    let _writingProcess = false;
    /*
     * @private
     * @var {boolean}
     */
    let _writingWait = false ;
    /*
     * @private
     * @var {boolean}
     */
    let _writing = false;
    /*
     * @private
     * @var {boolean}
     */
    let _rewrite = false;
    /*
     * setup  helper
     * @private
     */
    let _setup = setIn;
    /*
     * @private
     * @var {boolean}
     */
    let _hash = '';
    /*
     * @private
     */
    let _db = {};
    /*
     * @private
     * @var {boolean}
     */
    let _dbFD = storageFD;
    /*
     * @private
     * @var {dictonary}
     */
    let _dbIndex = {};
    /*
     * @private
     * @var {array}
     */
    let _indexable = [];
    //constructor
    if(typeof _indexes !== 'undefined'){
        _indexable = indexes;
        _setup.set('indexEnable',  true);
        for(let i of _indexable)
            _dbIndex[i] = {};
    }

    try{
        _read();
    }catch(e){
        _save();
    }
};


exports.base = singleFileBase;
