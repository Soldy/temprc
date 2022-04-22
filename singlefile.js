/*
 *  @Soldy\temprc\single\2021.01.16\GPL3
 */
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const $clonerc = new (require('clonerc')).base();
const $sleep = require('cheapest-sleep').sleep;

/*
 * @param {string} storage file or directory or binary allocation
 * @param {setuprc} setIn
 * @param {array} indexes
 * @prototype
 */
const singleFileBase=function(settings){
    /*
     * @public
     * @return {boolean}
     */
    this.save = async function(){
        return await _save();
    };
    /*
     * @public
     * @return {object} setup
     */
    this.setup = async function(){
        return await _setup;
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
    this.get = async function(id){
        if(typeof id !== 'string')
            return false;
        if(typeof _db[id] === 'undefined')
            return undefined;
        await _updateLastGet();
        return $clonerc.clone(
            _db[id]
        );
    };
    /*
     * @public
     * @return {string}
     */
    this.hash = async function(){
        _hash = await _hashCalculation();
        return _hash;
    };
    /*
     * @public
     * @return {string}
     */
    this.hashCheck = async function(){
        return await _checkHash();
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
     */
    this.del = async function(id){
        if(typeof id !== 'string')
            return false;
        delete _db[id];
        await _saveAuto();
        await _updateLastSet();
        return true;
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     * @return  {boolean}
     */
    this.set = async function(id, val){
        if (typeof id !== 'string')
            return false;
        if (typeof val === 'undefined')
            return false;
        _db[id] = val;
        await _updateLastSet();
        await _saveAuto();
        return true;
    };
    /*
     * @param {string}- id
     * @public
     * @return {boolean}
     */
    this.check = async function(id){
        if(
            (typeof id !== 'string') ||
            (typeof _db[id] === 'undefined')
        )
            return false;
        return true;
    };
    /*
     * @public
     * @return {object}
     */
    this.full = async function(){
        return $clonerc.clone(
            _db
        );
    };
    /*
     * @public
     * @return {object}
     */
    this.all = async function(){
        let list = [];
        for (let i in _db)
            list.push(
                $clonerc.clone(
                    _db[i]
                )
            );
        return list;
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list = async function(){
        let out = [];
        for(let i in  _db)
            out.push(i);
        return out;
    };
    /*
     * @public
     * @return integer
     */
    this.size = async function(){
        return await _count();
    };
    /*
     * @public
     * @return {boolean}
     */
    this.empty = async function(){
        if( 0 === parseInt( await _count() ) )
            return true;
        return false;
    };
    /*
     * @public
     * @return {object}
     */
    this.stats = async function(){
        await _count();
        return _stats;
    };
    /*
     * @param {object}
     * @public
     * @return {boolean}
     */
    this.importing = async function(importDb){
        _db = importDb;
        return true;
    };

    /*
     * @private
     * @var {integer}
    */
    let _now = (Date.now());
    /*
     * @private
     * @var {dictonary}
     */
    let _stats = {
        count     : 0,
        bytes     : 0,
        index     : 0,
        corrupt   : [],
        start     : parseInt(_now),
        lastSet   : parseInt(_now),
        lastGet   : parseInt(_now),
        lastSave  : parseInt(_now),
        lastCount : parseInt(_now)
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
     * @var {integer}
     */
    let _writingDate = 0 ;
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
     * @var {setupRc}
     */
    let _setup = settings;
    /*
     * @private
     * @var {string}
     */
    let _hash = '';
    /*
     * @private
     * @var {string}
     */
    let _old_hash = '';
    /*
     * @private
     * @var {dictonary}
     */
    let _db = {};
    /*
     * @private
     * @var {string}
     */
    let _config_file = '';
    /*
     * @private
     * @var {string}
     */
    let _db_file = '';
   
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
    /*
     * @private
     * @var {boolean}
     */
    let _inited = false;
    /*
     *  @param {
     *
     */
     const _initWait = async function(){
         while(!_inited)
             await $sleep(0.01);
     }
    /*
     * @param {string}
     * @private
     * @return {string}
     */
    const _dbFileName = function(file_name){
        _db_file = (
            file_name+
            '.trcs'
        );
    };
    /*
     * @param {string}
     * @private
     * @return {string}
     */
    const _configFileName = function(file_name){
        _config_file = (
            file_name+
            '.trcc'
        );
    };
    const _prepareConfig = async function(){
        return  {
            stats : _stats,
            hash  : await _hashCalculation()
        };
    };
    /*
     * @private
     */
    const _saveConfig = async function(){
        return new Promise(async function(resolve, reject){
            fs.writeFile(
                _config_file,
                JSON.stringify(
                    await _prepareConfig(),
                    null,
                    4
                ),
                function (err){
                   if(err){
                       console.error(err);
                       reject();
                   }else
                       resolve();
                }
            );
        });
    };
    /*
     * @private
     */
    const _readConfig = async function(){
        const config = JSON.parse(
            fs.readFileSync(
                _config_file
            ).toString()
        );
        _stats = config.stats;
        _old_hash = config.hash;
    };
    /*
     * @private
     */
    const _corruptionCheck = async function(){
        if( _hashCalculation() !== _old_hash)
            _stats.corrupt.push(
                Date.now()
            );
    };
    /*
     * @private
     * @return {boolean||void}
     */
    const _indexClear = async function(id){
        if(_setup.get('indexEnable') === false)
            return false;
        for(let i of _indexable)
            if(typeof _db[id][i] !== 'undefined')
                if(typeof _dbIndex[i][_db[id][i]] !== 'undefined')
                    delete _dbIndex[i][_db[id][i]];
        await _updateLastSet();
    };
    /*
     * @param {string}- id
     * @param {object}- container
     * @private
     * @return {boolean}
     */
    const _indexTo = async function(id, container){
        if(_setup.get('indexEnable') === false)
            return false;
        for(let i in container)
            if(_indexable.indexOf(i) > -1)
                _dbIndex[i][_db[id][i]]=id;
        await _updateLastSet();
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _indexAll = async function(){
        if(_setup.get('indexEnable') === false)
            return false;
        for(let id in _db)
            await _indexTo(id, _db[id]);
        await _updateLastSet();
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _read = async function(){
        _db = JSON.parse(
            fs.readFileSync(
                _db_file
            ).toString()
        );
        if (_setup.get('hashCheck') === true)
            return await _checkHash();
        await _updateLastRead();
        return true;
    };
    /*
     * @private
     * @return {integer}
     */
    const _count = async function (){
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
    const _checkHash = async function(){
        return (
            (await _hashCalculation()) == _hash
        );
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
        if(_inited === false)
            await _initWait();
        if(
            (_writingWait === false)||
            (_writing === true)
        ){
            if(_writingProcess !== false)
                clearTimeout(_writingProcess);
            _writingWait = true;
            _writingProcess = setTimeout(
                _saveDo,
                _setup.get('delayedSave')
            );
        };
        while(_writingWait){
            await $sleep(
                (_setup.get('delayedSave')/1000)
            );
        }
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
        fs.writeFile(
            _db_file,
            JSON.stringify(_db),
            await _saveDone
        );
    };
    const _saveDone = async function(err){
        if(err){
             console.log(err)
             process.exit(1);
        }
        if (_setup.get('hashCheck') === true)
            await _saveConfig();
        _writing = false;
        _updateLastSave();
        if (_rewrite === false )
            return true;
        _rewrite = false;
        _save();
    }
    /*
     * @private
     */
    const _hashCalculation = async function(){
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
    const _updateLastGet = async function (){
        _stats.lastSet = (Date.now());
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _updateLastSet = async function (){
        _stats.lastSet = (Date.now());
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _updateLastSave = async function (){
        _stats.lastSave = (Date.now());
        return true;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _updateLastRead = async function (){
        _stats.lastRead = (Date.now());
        return true;
    };
    //constructor
    if(typeof _indexes !== 'undefined'){
        _indexable = indexes;
        _setup.set('indexEnable',  true);
        for(let i of _indexable)
            _dbIndex[i] = {};
    }
    _configFileName(
        _setup.get('storage')
    );
    _dbFileName(
        _setup.get('storage')
    );
    /*
     * @private
     *
    */
    const _initDb = async function(){
        try{
            await _read();
        }catch(e){
            await _save();
        }
    }
    /*
     * @private
     *
    */
    const _initConfig = async function(){
        try{
            await _readConfig();
            await _corruptionCheck();
        }catch(e){
            _old_hash = await _hashCalculation();
            _hash = await _hashCalculation();
            await _saveConfig();
        }
    }
    /*
     * @private
     *
    */
    const _constructor = async function(){
        await _initDb();
        await _initConfig();
        _inited = true;

    }
    _constructor();
};


exports.base = singleFileBase;
