
/*
 *  @Soldy\temprc\multi\2021.01.16\GPL3
 */
'use strict';
const fs = require('fs');
const crypto = require('crypto');

/*
 * @param {string} storageFD //storage directory
 * @param {setuprc} settings
 * @param {array} indexes
 * @prototype
 */
const multiFileBase = function(storageFD, setIn, indexes){
    /*
     * @public
     * @return {boolean}
     */
    this.save = function(){
        return save();
    };
    /*
     * @param {string} id
     * @public
     * @return {mixed}
     */
    this.get=function(id){
        if(typeof id !== 'string')
            return false;
        return _get();
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
        _set(id, val);
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
        let list = {};
        for (let i of indexList)
            list[i] = get(i);
        return list;
    };
    /*
     * @public
     * @return {object}
     */
    this.all=function(){
        let list = [];
        for (let i of indexList)
            list.push(get(i));
        return list;
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list=function(){
        return indexList;
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
        return _stats;
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
     * @var {dictonary}
     */
    let _stats = {
        count:0,
        bytes:0,
        index:0,
        start:(+new Date),
        lastSet:(+new Date),
        lastGet:(+new Date),
        lastSave:(+new Date),
        lastCount:(+new Date)
    };
    let _list = [];
    let _cache = {};
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
     * @private
     * @var {boolean}
     */
    let autoSave = true;
    /*
     * @private
     * @var {boolean}
     */
    let indexEnable = false;
    /*
     * @private
     * @var {boolean}
     */
    let hashCheck = false;
    /*
     * @private
     * @var {array}
     */
    let indexList = [];
    /*
     * @private
     * @var {array}
     */
    let cache = {};
    /*
     * @private
     * @var {array}
     */
    let justCache = [];
    const _fileName =  function(id){
        return (
             dbFD+
             '/'+
             id+
             '.trcj'
        );

    }
    const _get = function(id){
        if(0 > _list.indexOf(id))
            return false;
        return fs.readFileSync(
            _fileName(id)
         );
    };
    const _check = function (id) {
        if(
            (typeof id !== 'string') ||
            (-1 > _list.indexOf(id))
        )
            return false;
        return true;

    }
    const _set = async function(id, val){
        fs.writeFileSync(
            fileName(id),
            JSON.stringify(val)
        );
        updateLastSet();
    };
    const count = function (){

    };
    /*
     * @private
     * @return {boolean}
     */
    const saveAuto = async function(){
        if(autoSave === true)
            return await save();
        return false;
    };
    const save = async function(){

    }
    /*
     * @private
     */
    const mkDb = function(){
        _list = [];
        const stat = fs.statiSync(dbFD);
        if (typeof stat === 'undefined')
            fs.mkdirSync(dbFD);
        for(let i of fs.readdirSync(dbFD)){
            const l = i.length;
            if(i.substring(l-5) === '.trcj')
                _list.push(
                    i.substr(0, l-5)
                );
        }
    };

};

exports.base = multiFileBase;
