/**
 * 导航到下一门未评价课程
 * 
 * 用法：在课程列表页面（xspj_list.do）通过 javascript_tool 执行。
 * 会找到第一门 zpf=0 的课程并跳转。
 */
(function() {
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].textContent.trim() === '评价' && links[i].href.indexOf('zpf=0') >= 0) {
            window.location.href = links[i].href;
            return 'navigating';
        }
    }
    return 'done';
})()
