/*
 *  @Soldy\temprc\single\2021.03.11\GPL3
 */
'use strict';

/*
 * @param {object} manager 
 * @prototype
 */
const interfaceBase=function(manager_in){
    /*
     * @public
     * @return {boolean}
     */
    this.save = function(){
        return _manager.save();
    }
    /*
     * @public
     * @return {setuprc}
     */
    this.setup = function(){
        return _manager.setup();
    }
    /*
     * @param {string} id
     * @public
     * @return {mixed}
     */
    this.get=function(id){
        return _manager.get(id);
    }
    /*
     * @public
     * @return {string}
     */
    this.hash=function(){
        return _manager.hash();
    };
    /*
     * @public
     * @return {string}
     */
    this.hashCheck=function(){
        return _manager.hashCheck();
    };
    /*
     * @param {string} id
     * @public
     * @return {boolean}
     */
    this.del=function(id){
        return _manager.del(id);
    };
    /*
     * @param {string} id
     * @param {varius} val
     * @public
     * @return  {boolean}
     */
    this.set=function(id, val){
        return _manager.set(id,val);
    };
    /*
     * @param {string}- id
     * @public
     * @return {boolean}
     */
    this.check=function(id){
        return _manager.check(id);
    };
    /*
     * @public
     * @return {object}
     */
    this.full=function(){
        return _manager.full();
    };
    /*
     * @public
     * @return {object}
     */
    this.all=function(){
        return _manager.all();
    };
    /*
     *
     * @public
     * @return {array}
     */
    this.list=function(){
        return _manager.list();
    };
    /*
     * @public
     * @return integer
     */
    this.size=function(){
        return _manager.size();
    };
    /*
     * @public
     * @return {boolean}
     */
    this.empty=function(){
        return _manager.empty();
    };
    /*
     * @public
     * @return {object}
     */
    this.stats=function(){
        return _manager.stats();
    };
    /*
     * @param {object}
     * @public
     * @return {boolean}
     */
    this.importing = function(import_db){
        return _manager.importing(import_db);
    };
    const _manage = manager_in;

}

exports.base = interfaceBase;
