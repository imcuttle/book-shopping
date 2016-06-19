/**
 * Created by Yc on 2016/6/19.
 */

var _timer = {};

module.exports = {
    set : function (key,mill) {
        this.remove(key);
        _timer[key] ={mill:mill};
        _timer[key].code = setTimeout(function () {
            delete _timer[key];
        },mill);
    },
    isExist : function(key){
        return !!_timer[key];
    },
    remove : function(key){
        if(this.isExist(key)){
            clearTimeout(_timer[key].code);
            delete _timer[key];
            return true;
        }
        return false;
    }
}
