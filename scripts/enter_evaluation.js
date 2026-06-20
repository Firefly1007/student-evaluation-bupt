/**
 * 进入评教（从评教入口页跳转到课程列表）
 * 
 * 用法：在评教入口页面（xspj_find.do）通过 javascript_tool 执行。
 * 会找到"进入评价"链接并点击。
 */
(function() {
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        var txt = links[i].textContent.trim();
        if (txt === '进入评价' || txt === '点击进入评价') {
            window.location.href = links[i].href;
            return 'entering evaluation';
        }
    }
    return 'not found - link may not exist';
})()
