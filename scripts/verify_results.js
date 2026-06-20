/**
 * 验证评教完成情况
 * 
 * 用法：在课程列表页面（xspj_list.do）通过 javascript_tool 执行。
 * 返回已评价数量、未评价数量、各门课程分数。
 */
(function() {
    var links = document.querySelectorAll('a');
    var unevaluated = 0;
    var scores = [];
    var courseDetails = [];

    for (var i = 0; i < links.length; i++) {
        if (links[i].textContent.trim() === '评价') {
            var row = links[i].closest('tr');
            var cells = row ? row.querySelectorAll('td') : [];
            var courseName = cells.length > 1 ? cells[1].textContent.trim() : '';
            var teacher = cells.length > 2 ? cells[2].textContent.trim() : '';

            if (links[i].href.indexOf('zpf=0') >= 0) {
                unevaluated++;
                courseDetails.push({ course: courseName, teacher: teacher, score: 0, status: '未评价' });
            } else {
                var match = links[i].href.match(/zpf=(\d+)/);
                var score = match ? parseInt(match[1]) : 0;
                scores.push(score);
                courseDetails.push({ course: courseName, teacher: teacher, score: score, status: '已评价' });
            }
        }
    }

    var minScore = scores.length > 0 ? Math.min.apply(null, scores) : 0;
    var maxScore = scores.length > 0 ? Math.max.apply(null, scores) : 0;

    return JSON.stringify({
        total: unevaluated + scores.length,
        evaluated: scores.length,
        unevaluated: unevaluated,
        minScore: minScore,
        maxScore: maxScore,
        scores: scores,
        details: courseDetails
    });
})()
