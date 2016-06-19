/**
 * Created by Yc on 2016/6/17.
 */

var utils = (function () {

    return {
        alertDanger : function (text) {
            return '<div class="alert alert-danger alert-dismissible" role="alert">'+
            '<button class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>' +
                '</button>' + text+'</div>';
        }
    }
}());