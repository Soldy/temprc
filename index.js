
'use strict';
const setupBase = (require('setuprc')).setupBase;



exports.temprc=function(storageFD, settings, indexes){
    /*
     * @public
     * @return {boolean}
     */
    this.save = function(){
        return manager.save();
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
        return manager.indexRefresh();
    };
    /*
     * @param {string} id
     * @public
     * @return {mixed}
     */
    this.get=function(id){
        return manager.get();
    };
    /*
     * @public
     * @return {string}
     */
    this.hash=function(){
        return manager.hash();
    };
    /*
     * @public
     * @return {string}
     */
    this.hashCheck=function(){
        return manager.hashCheck();
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
     */
    this.del=function(id){
        return manager.del();
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     * @return  {boolean}
     */
    this.set=function(id, val){
        return manager.set();
    };
    /*
     * @param {string}- id
     * @public
     * @return {boolean}
     */
    this.check=function(id){
        manager.check();
    };
    /*
     * @public
     * @return {object}
     */
    this.full=function(){
        manager.full();
    };
    /*
     * @public
     * @return {object}
     */
    this.all=function(){
        manager.all();
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list=function(){
        manager.list();
    };
    /*
     * @public
     * @return integer
     */
    this.size=function(){
        return manager.size();
    };
    /*
     * @public
     * @return {boolean}
     */
    this.empty=function(){
        manager.empty();
    };
    /*
     * @public
     * @return {object}
     */
    this.stats=function(){
        manager.stats();
    };
    /*
     * @param {object}
     * @public
     * @return {boolean}
     */
    this.importing = function(importDb){
        manager.importing();
    }
    let manager;
    /*
     * setup  helper
     * @private
     */
    let setup = new setupBase({
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
     *@private
     */
    const init = function(){
         if(setup.get('databbaseType') === 'multi'){
             manager = new (require('./multifile')).temprc(
                 storageFD,
                 setup,
                 indexes
             );
             return true;
         }
         manager = new (require('./singlefile')).temprc(
             storageFD,
             setup,
             indexes
         );
    }
    if(typeof settings !== 'undefined')
        setup.setup(settings);

}

