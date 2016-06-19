/**
 * Created by Yc on 2016/6/17.
 */

window.onerror = null;

(function(doc,win,$){
    var input = doc.getElementById('msg');
    var show  = doc.getElementById('msg-show');
    input.placeholder = ['1. 支持 MarkDown 语法','2. 自动保存','3. 支持网络多张图片粘贴'].join('\r\n\r\n');
    input.onpaste = function (e) {
        var clipboardData, pastedData;

        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        var text = clipboardData.getData('text/plain');
        if(!text){
            var img = clipboardData.getData('text/html');
            img.replace(/<img.+src="(.+?)"/g,(m,c)=>{
                e.preventDefault();
                document.execCommand('insertText', false, "![ClipboardImage]("+c+")");
            })
        }
    };

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
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });
    var map = {};
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
        if(input.clientHeight<input.scrollHeight){
            input.style.height = input.scrollHeight+20+'px';
        }
    }
    if(typeof USERNAME!=='undefined') {
        var prev = win.localStorage.getItem(tag+'-'+USERNAME);
        if (prev)
            input.value = prev;
    }
    changeHandle();
    input.oninput = changeHandle;

    $('[data-md]').each(function () {
        var md = this.dataset.md;
        //单个回车是换行
        this.innerHTML = marked(md,{renderer:renderer});
    })
    $('[role=bigger]').click(function (e) {
        $('.container').removeClass('container').addClass('container-fluid');
    })
    $('[role=link-msg]').click(function (e) {
        var x = $(this.hash).next().children().removeClass('blink')
        setTimeout(function () {
            x.addClass('blink').children('textarea').focus();
        },0)
    })

})(document,window,jQuery);