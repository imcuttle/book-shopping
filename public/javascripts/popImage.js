/**
 * Created by Yc on 2016/6/18.
 */
!function () {
    var pops = $('[data-popImage]');
    pops.each(function(){
        // var img = new Image();
        // img.src = this.dataset.popimage;
        // img.className = "img-rounded img-thumbnail img-responsive";// img-thumbnail img-responsive
        var pos = this.dataset.pos?this.dataset.pos:'bottom';
        $(this).popover({
            html:true, // lazy load
            content: '<img class="img-rounded img-thumbnail img-responsive" src="'+this.dataset.popimage+'"/>',
            html:true,
            trigger:'hover',
            placement: pos,
            title:'封面',
        })
    })

}();