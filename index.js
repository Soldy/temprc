/*
 *  @Soldy\temprc\2021.01.16\GPL3
 */
'use strict';
const $setuprc = (require('setuprc')).base;
const $single = (require('./singlefile.js')).base;
const $multi = (require('./multifile.js')).base;
const $inter = (require('./interface.js')).base;


/*
 * @param {string} storageFD
 * @param {setuprc} settings
 * @param {array} indexes
 * @prototype
 */
const temprcBase = function(settings){
    /*
     * @public
     * @return {boolean}
     */
    this.save = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].save();
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
    this.indexRefresh = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].indexRefresh();
    };
    /*
     * @param {string} id
     * @public
     * @return {mixed}
     */
    this.get=async function(id, stor){
        stor = _storCheck(stor);
        return await _manager[stor].get(id);
    };
    /*
     * @public
     * @return {string}
     */
    this.hash=async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].hash();
    };
    /*
     * @public
     * @return {string}
     */
    this.hashCheck = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].hashCheck();
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
     */
    this.del = async function(id, stor){
        stor = _storCheck(stor);
        return await _manager[stor].del(id);
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     * @return  {boolean}
     */
    this.set=async function(id, val, stor){
        stor = _storCheck(stor);
        return await _manager[stor].set(id, val);
    };
    /*
     * @param {string}- id
     * @public
     * @return {boolean}
     */
    this.check = async function(id, stor){
        stor = _storCheck(stor);
        return await _manager[stor].check(id);
    };
    /*
     * @public
     * @return {object}
     */
    this.full = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].full();
    };
    /*
     * @public
     * @return {object}
     */
    this.all = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].all();
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].list();
    };
    /*
     * @public
     * @return {integer}
     */
    this.size = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].size();
    };
    /*
     * @public
     * @return {boolean}
     */
    this.empty = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].empty();
    };
    /*
     * @public
     * @return {object}
     */
    this.stats = async function(stor){
        stor = _storCheck(stor);
        return await _manager[stor].stats();
    };
    /*
     * @param {object}
     * @public
     * @return {boolean}
     */
    this.importing = async function(importDb, stor){
        stor = _storCheck(stor);
        return await _manager[stor].importing(importDb);
    };
    this.easy = function(
        storage,
        type,
        name
    ){
        let settings = {};
        if(typeof storage === 'string')
            settings['storage'] = storage;
        if(typeof storage === 'string')
            settings['type'] = type;
        if(typeof storage === 'string')
            settings['name'] = name;
        return _create(settings);

    };
    /*
     * @param {object}
     * @public
     * @return boolean
    */
    this.create = async function(settings){
        return await _create(settings);
    };
    /*
     * @param {}
     * @public
     * @return boolean
    */
    this.interface = function(stor){
        stor = _storCheck(stor);
        return new $inter(
            _manager[stor]
        );
    };
    /*
     * @private
     * @var {diconary}
     */
    let _manager = {};
    /*
     *  @private
     *  @const {object}
     */
    const _setup_json = {
        'storage':{
            'type'    : 'string',
            'default' : 'db'
        },
        'name':{
            'type'    : 'string',
            'default' : 'default'
        },
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
        'type':{
            'type'    : 'select',
            'list'    : [
                'single',
                'multi',
            ],
            'default' : 'single'
        }
    };

    /*
     * setup  helper
     * @private
     * @const {setuprc}
     */
    const _setup = new $setuprc(_setup_json);
    /*
     * @param {string}
     * @private
     */
    const _storCheck = function(stor){
        if(typeof stor === 'undefined')
            return 'default';
        return stor;
    };
    /*
     * @param {setuprc}
     * @private
     * @return oolean
     */
    const _create = async function(settings){
        let setup = new $setuprc(
            _setup_json
        );
        setup.setup(settings);
        if(typeof _manager[setup.get('name')] !== 'undefined')
            return false;
        if(setup.get('type') === 'multi'){
            _manager[setup.get('name')] = new $multi(
                setup,
            );
        }else{
            _manager[setup.get('name')] = new $single(
                setup,
            );
        }
        return true;
    };

    /*
     * @private
     */
    //    const _init = function(){
    //    };
    // constructor
    if(typeof settings !== 'undefined')
        _create(settings);
//    _init();
};

exports.base = temprcBase;
