
/*
 *  @Soldy\temprc\multi\2021.01.16\GPL3
 */
'use strict';
const fs = require('node:fs/promises');
const crypto = require('crypto');
const $clonerc = new (require('clonerc')).base();
const $sleep = require('cheapest-sleep').sleep;

/*
 * @param {string} storageFD //storage directory
 * @param {setuprc} settings
 * @param {array} indexes
 * @prototype
 */
const multiFileBase = function(settings){
    /*
     * @public
     * @return {boolean}
     */
    this.save = async function(){
        return await _save();
    };
    /*
     * @param {string} id
     * @public
     * @return {mixed}
     */
    this.get= async function(id){
        if(typeof id !== 'string')
            return false;
        return await _get(id);
    };
    /*
     * @public
     * @return {string}
     */
    this.hash= async function(){
        return await _hashCalculation();

    };
    /*
     * @public
     * @return {string}
     */
    this.hashCheck= async function(){
        return await _checkHash();
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
     */
    this.del = async function(id){
        return await _del(id);
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     * @return  {boolean}
     */
    this.set= async function(id, val){
        if (typeof id !== 'string')
            return false;
        if (typeof val === 'undefined')
            return false;
        await _set(id, val);
        return true;
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
     */
    this.check= async function(id){
        return await _check(id);
    };
    /*
     * @public
     * @return {object}
     */
    this.full=async function(){
        let list = {};
        for (let i of _list)
            list[i] = await _get(i);
        return list;
    };
    /*
     * @public
     * @return {object}
     */
    this.all=async function(){
        let list = [];
        for (let i of _list)
            list.push(
               await  _get(i)
            );
        return list;
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list=async function(){
        return $clonerc.clone(
            _list
        );
    };
    /*
     * @public
     * @return integer
     */
    this.size=async function(){
        return await _count();
    };
    /*
     * @public
     * @return {boolean}
     */
    this.empty=async function(){
        if( 0 === parseInt(await _count()))
            return true;
        return false;
    };
    /*
     * @public
     * @return {object}
     */
    this.stats=async function(){
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
     * @var {array}
    */
    let _list = [];
    /*
     * @private
     * @var {dictonary}
    */
    let _cache = {};
    /*
     * @private
     * @var {dictonary}
    */
    let _writing_element = {};
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
     * @private
     * @var {boolean}
     */
    let _autoSave = true;
    /*
     * @private
     * @var {boolean}
     */
    let _indexEnable = false;
    /*
     * @private
     * @var {boolean}
     */
    let _hashCheck = false;
    /*
     * @private
     * @var {array}
     */
    let _indexList = [];
    /*
     * @private
     * @var {array}
     */
    let _justCache = [];
    const _db = {};
    const _setup = settings; 
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
    const _fileName =  function(id){
        return (
             _setup.get('storage')+
             '/'+
             id+
             '.trcm'
        );

    }
    /*
     * @param {string}
     * @private
     * @return {string}
     */
    const _configFileName = function(dbFD){
        _coonfig_file = (
            _setup.get('storage')+
            '.trcc'
        );
    }
    const _prepareConfig = function(){
        return  {
             stats : _stats,
        }
    }
    /*
     * @private
     */
    const _saveConfig = async function(){
        await fs.writeFile(
            _config_file,
            _prepareConfig()
        );
    };
    /*
     * @private
     */
    const _readConfig =  async function(){
        const config = JSON.parse(
            await fs.readFile(
                _config_file,
                'utf8'
            ).toString()
        );
        _stats = config.stats;
    };
    /*
     * @param {string}
     * @private
     * @return {object}
     */
    const _get = async function(id){
        if(0 > _list.indexOf(id))
            return false;
       const data = await fs.readFile(
           _fileName(id),
           'utf8'
        );
        try { 
            return JSON.parse(
                data
            );
        } catch (err) {
            return data;
        }
    };
    /*
     * @param {string}
     * @private
     * @return {boolean}
     */
    const _check = async function (id) {
        if (typeof id !== 'string')
            return false;
        if ( _list.indexOf(id) > -1 )
            return true;
        try {
            await fs.access(
                 _fileName(id),
                 fs.constants.F_OK
            );
            return true;
        } catch(err) {
            return false;
        }
    }
    /*
     * @param {string}
     * @param {any}
     * @private
     * @return {boolean}
     */
    const _set = async function(id, val){
        if(0 > _list.indexOf(id))
             _list.push(id);
        _writing_element[id] = true;
        try { 
            await fs.writeFile(
                _fileName(id),
                JSON.stringify(val),
                {
                   encoding: "utf8",
                   flag: "w",
                   mode: 0o666
                }
            );
            delete _writing_element[id];
        } catch (err){
            console.error(err);
            process.exit(1);
        }
        while(_writing_element[id]){
            await $sleep(
                (_setup.get('delayedSave')/1000)
            );
        }
        _updateLastSet();
        return true;
    };
    /*
     * @param {string}
     * @private
     * @return {boolean}
     */
    const _del = async function(id){
        if(typeof id !== 'string')
            return false;
        if (typeof _db[id] !== 'undefined')
            delete _db[id];
        const position = parseInt(_list.indexOf(id));
        if(  position > -1 ){
            delete _list[
                position
            ];
            _list.splice(
                position,
                1
            );
        }
        if( _check(id))
            await fs.unlink(
                _fileName(id) 
            );
        _updateLastSet();
        return true;
    };
    /*
     * @private
     * @return {integer}
     */
    const _count = function (){
        return  _list.length;
    };
    /*
     * @private
     * @return {string}
     */
    const _hashCalculation = function(){
        return 0;
    };
    /*
     * @private
     * @return {boolean}
     */
    const _saveAuto = async function(){
        if(autoSave === true)
            return await save();
        return false;
    };
    const _save = async function(){

    }
    /*
     * !!! NO ASYNC IN HERE !!!
     * @private
     * 
     */
    const mkDb = function(){
        _list = [];
        let storage = _setup.get('storage');
        const stat = fs.statiSync(
            storage
        );
        if (typeof stat === 'undefined')
            fs.mkdirSync(stoorage);
        for(let i of fs.readdirSync(storage)){
            const l = i.length;
            if(i.substring(l-5) === '.trcj')
                _list.push(
                    i.substr(0, l-5)
                );
        }
    };

};

exports.base = multiFileBase;
