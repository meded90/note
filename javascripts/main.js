

$.QueryString = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));
$(function ($) {
    var $content = $('#content');
    var $title = $('title');
    if ($.QueryString.val){
        debugger
        $content.html($.QueryString.val)
    }


    var insert = function (el, cursorPos, val) {
        var text = $(el).html(),
            textBefore = text.substring(0, cursorPos),
            textAfter = text.substring(cursorPos, text.length);
        $(el).html(textBefore + val + textAfter);
        setPosition(el, cursorPos + val.length )
    }
    var setPosition = function (el, caretPos) {
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el.childNodes[0], caretPos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();

    }
    $content.on('keyup', function (e) {
        var content = $content.html()
        var childNode = $content[0].childNodes[0];
        if (childNode && childNode.textContent)
            $title.text( childNode.textContent)
        if (history)
            history.pushState({}, "page 2", "?val="+encodeURIComponent(content));

    })
    $content.on('keydown', function (e) {
        if ((e.keyCode == 187 && !e.shiftKey)|| (e.keyCode == 13 && e.ctrlKey)) {
            var selection = window.getSelection();
            var parent = $(selection.anchorNode.parentNode);
            var pos = selection.anchorOffset;
            var text = parent.text();
            if (pos < 2) return;

            var indexStart = 0;
            var indexSpase = text.lastIndexOf(' ', pos - 1);
            if (indexSpase == -1) indexSpase = 0;

            var indexEqually = text.lastIndexOf('=', pos - 2);
            if (indexEqually == -1) indexEqually = 0;

            if (indexSpase < indexEqually)
                indexStart = indexEqually + 1;
            else
                indexStart = indexSpase;
            var val = ''
            try {
                var x = text.substring(indexStart, pos);
                val = val.replace(',','.');
                val = eval(x)
                console.log(val);

            } catch (e) {
                console.log(e);
                $('.errors').html(e.message).fadeIn()
                setTimeout(function () {
                    $('.errors').html(e.message).fadeOut()
                },2000)
            }
            if (val){
                insert(parent[0], pos, '=' + val)
                return false
            }
        }
        return true
    })
})
    