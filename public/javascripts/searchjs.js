/**
 * Created by Yc on 2016/6/18.
 */
(function () {
    $('.nav-tabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    }).on('shown.bs.tab',function (e) {
        this.previousSibling.checked = true;
    });
})();