/**
 * Created by Yc on 2016/6/17.
 */

window.onerror = null;

(function(doc,win,$){
    var input = doc.getElementById('msg');
    var show  = doc.getElementById('msg-show');
    input.onkeydown = function (e) {
        if(e.keyCode==9){
            e.preventDefault();
            document.execCommand('insertText', false, "    ");
        }
        // if(e.ctrlKey && )
    };
    input.onmousewheel = function (e) {
        if(e.ctrlKey) {
            e.preventDefault();
            var size = parseInt(input.style.fontSize);
            if (size <= 10 && e.wheelDelta<0) return;
            input.style.fontSize = size + (e.wheelDelta > 0 ? 1 : -1) + 'px';
        }
    }

    function parseHTML(s) {
        var rlt = '';
        for(var i=0;i<s.length;i++){
            var c = s[i];
            switch (c){
                case '&lt;':c='<'; break;
                case '&gt;':c='>'; break;
                case '&nbsp;':c=' '; break;
                case '&quto;':c='"'; break;
                default: break;
            }
            rlt += c;
        }
        return rlt;
    }
    function parse(s){
        return s.replace(/<div>(.+?)<\/div>/gi,function(m,c){
            if(c==='<br>' || c==='<br/>')
                return '\r\n';
            return '\r\n'+parseHTML(c);
        });
    }
    var renderer = new marked.Renderer();
    marked.setOptions({
        gfm: true,
        tables: true,
        breaks: true, //回车换行
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
    });
    var map = {};
    renderer.code=function (code,lang) {
        var before = lang!=null?'<div class="pre-before">'+lang+'</div>':'';
        return '<pre>' + before +
            '<code>'+hljs.highlightAuto(code).value+'</code></pre>';
    }
    renderer.heading = function (text, level) {
        var escapedText = text.toLowerCase();
        if(!!map[text])
            escapedText+='-'+map[text]++;
        else
            map[text]=1;
        return '<h' + level + '><a name="' +
            escapedText +
            '" class="anchor" href="#' +
            escapedText +
            '"><span class="header-link"></span></a>' +
            text + '</h' + level + '>';
    };
    var tag = input.dataset.tag || 'message';
    function changeHandle(){
        var md = input.value;
        if(typeof USERNAME!=='undefined')
            win.localStorage.setItem(tag+'-'+USERNAME,md);
        show.innerHTML = marked(md,{renderer:renderer});
        inputNum.find('number').text(show.innerText.length)
        if(input.clientHeight<input.scrollHeight){
            input.style.height = input.scrollHeight+20+'px';
            show.style.height = input.style.height;
        }
        if(show.clientHeight>=input.clientHeight){
            show.classList.add('scrollY');
            if(typeof input.prevMdLast=='undefined' || input.prevMdLast!==md[md.length-1]) {
                if(show.scrollTime!=null) clearTimeout(show.scrollTime);
                show.scrollTime = setTimeout(function () {
                    show.scrollTop = show.scrollHeight;
                }, 1000)
            }
        }else{
            show.classList.remove('scrollY');
        }
        input.prevMdLast = md[md.length-1];
    }
    if(typeof USERNAME!=='undefined') {
        var prev = win.localStorage.getItem(tag+'-'+USERNAME);
        if (prev)
            input.value = prev;
    }
    var inputNum = $('<div style="position: relative;"><div id="msgNum"><small>解析后字数:</small><number class="text-danger"></number></div></div>');
    $(input).after(inputNum)
    changeHandle();
    input.oninput = changeHandle;
    $('[data-md]').each(function () {
        var md = this.dataset.md;
        //单个回车是换行
        this.innerHTML = marked(md,{renderer:renderer});
    });
    // $('pre').prepend('<div class="pre-before">复制</div>');
    // $('.pre-before').click(function (e) {
    //     doc.execCommand('copy');
    // });
    $('[role=bigger]').click(function (e) {
        $('.container').removeClass('container').addClass('container-fluid');
    });
    $('[role=link-msg]').click(function (e) {
        var x = $(this.hash).next().children().removeClass('blink')
        setTimeout(function () {
            x.addClass('blink').children('textarea').focus();
        },0)
    });
    doc.addEventListener('DOMContentLoaded',function (e) {
        var hash = win.location.hash;
        if(!!hash){
            var x = $(hash).next().removeClass('blink');
            setTimeout(function () {
                x.addClass('blink');
            },0)
        }
    });

    input.placeholder = ['1. 支持 MarkDown 语法','2. 自动保存','3. 支持网络多张图片粘贴'].join('\r\n\r\n');
    input.onpaste = (function(){
        var cache = {}
        return function (e) {
            var items, pastedData, clipboardData;
            // Get pasted data via clipboard API
            clipboardData = e.clipboardData || window.clipboardData;
            items = clipboardData.items;
            for (var index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    e.preventDefault();
                    var reader = new FileReader();
                    reader.onload = function(event){
                        $.post('/api/upload/image', {base64: reader.result}, function (data) {
                            if(data.code==200) {
                                document.execCommand('insertText', false, "![ClipboardImage]("+data.message+")");
                            }else {
                                document.execCommand('insertText', false, data.message);
                            }
                        }, 'json')
                    }
                    reader.readAsDataURL(blob);
                    return
                }
            }
            var text = clipboardData.getData('text/plain');
            if(!text){
                var img = clipboardData.getData('text/html');
                img.replace(/<img.+src="(.+?)"/g,(m,c)=>{
                    e.preventDefault();
                    document.execCommand('insertText', false, "![ClipboardImage]("+c+")");
                })
            }
        };
    }())

})(document,window,jQuery);