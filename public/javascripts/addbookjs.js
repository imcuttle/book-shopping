/**
 * Created by Yc on 2016/6/17.
 */
!function (d,w) {
    var fileImg = d.getElementById('image');
    var alertContainer = d.getElementById('alert');
    var thumb = d.getElementById('thumbnail');
    var spanprog = d.getElementById('progress');

    fileImg.onchange = function (e) {
        var file = this.files[0];
        if(!/image\/\w+/.test(file.type)){
            alertContainer.innerHTML=utils.alertDanger('请选择图片');
            return false;
        }
        var fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = function () {
            thumb.src = fr.result;
        }
    };

}(document,window);

/*
 $.ajax({
 method:'post',
 url:'/action',
 data:{ data : fr.result, action : 'imageUp'},
 xhr: function() {
 var xhr = $.ajaxSettings.xhr();
 xhr.upload.onprogress = function(e) {
 var p = Math.floor(e.loaded / e.total *100) + '%';
 console.log(p);
 spanprog.innerText = p;
 };
 return xhr;
 }
 }).done(d=>{

 }).fail(()=>{
 spanprog.innerText = '上传失败，可能图片过大';
 });
 */