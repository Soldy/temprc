/*
 *  @Soldy\temprc\2021.01.16\GPL3
 */
'use strict';
const setupBase = (require('setuprc')).base;
const singleFile = (require('./singlefile.js')).base;
const multiFile = (require('./multifile.js')).base;


/*
 * @param {string} storageFD
 * @param {setuprc} settings
 * @param {array} indexes
 * @prototype
 */
const temprcBase = function(storageFD, settings, indexes){
    /*
     * @public
     * @return {boolean}
     */
    this.save = function(stor){
        stor = _storCheck(stor);
        return _manager[stor].save();
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
    this.indexRefresh = function(stor){
        stor = _storCheck(stor);
        return _manager[stor].indexRefresh();
    };
    /*
     * @param {string} id
     * @public
     * @return {mixed}
     */
    this.get=function(id, stor){
        stor = _storCheck(stor);
        return _manager[stor].get(id);
    };
    /*
     * @public
     * @return {string}
     */
    this.hash=function(stor){
        stor = _storCheck(stor);
        return _manager[stor].hash();
    };
    /*
     * @public
     * @return {string}
     */
    this.hashCheck=function(stor){
        stor = _storCheck(stor);
        return _manager[stor].hashCheck();
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
     */
    this.del=function(id, stor){
        stor = _storCheck(stor);
        return _manager[stor].del(id);
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     * @return  {boolean}
     */
    this.set=function(id, val, stor){
        stor = _storCheck(stor);
        return _manager[stor].set(id, val);
    };
    /*
     * @param {string}- id
     * @public
     * @return {boolean}
     */
    this.check=function(id, stor){
        stor = _storCheck(stor);
        return _manager[stor].check(id);
    };
    /*
     * @public
     * @return {object}
     */
    this.full=function(stor){
        stor = _storCheck(stor);
        return _manager[stor].full();
    };
    /*
     * @public
     * @return {object}
     */
    this.all=function(stor){
        stor = _storCheck(stor);
        return _manager[stor].all();
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list=function(stor){
        stor = _storCheck(stor);
        return  _manager[stor].list();
    };
    /*
     * @public
     * @return integer
     */
    this.size=function(stor){
        stor = _storCheck(stor);
        return _manager[stor].size();
    };
    /*
     * @public
     * @return {boolean}
     */
    this.empty=function(stor){
        stor = _storCheck(stor);
        return _manager[stor].empty();
    };
    /*
     * @public
     * @return {object}
     */
    this.stats=function(stor){
        stor = _storCheck(stor);
        return _manager[stor].stats();
    };
    /*
     * @param {object}
     * @public
     * @return {boolean}
     */
    this.importing = function(importDb, stor){
        stor = _storCheck(stor);
        return _manager[stor].importing(importDb);
    };
    let _manager = {};
    /*
     * setup  helper
     * @private
     */
    let _setup = new setupBase({
        'autoSave':{
            'type'    : 'bool',
            'default' : true
        },
        'indexEnable':{
            'type'    : 'bool',
            'default' : true
        },
        'hashCheck':{
            'type'    : 'bool',
            'default' : true
        },
        'delayedSave':{
            'type'    : 'int',
            'default' : 500
        },
        'databaseType':{
            'type'    : 'select',
            'list'    : [
                'single',
                'multi',
            ],
            'default' : 'single'

        }
    });
    /*
     * @param {string}
     *@private
     */
    const _storCheck = function(stor){
        if(typeof stor === 'undefined')
            return 'default';
        return stor;
    };
    /*
     *@private
     */
    const _init = function(){
        if(typeof storageFD === 'string'){
            if(_setup.get('databbaseType') === 'multi'){
                _manager['default'] = new multiFile(
                    storageFD,
                    _setup,
                    indexes
                );
                return true;
            }
                _manager['default'] = new singleFile(
                storageFD,
                _setup,
                indexes
            );
            return true;
        }
    };
    // constructor
    if(typeof settings !== 'undefined')
        _setup.setup(settings);
    _init();
};

exports.base = temprcBase;
