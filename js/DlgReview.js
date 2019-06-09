DlgReview = function (opts) {
    var me = this;
    me._dlg = $("#" + opts.div).html(
            "   <label id=\"ReviewTitle\" class=\"DlgTitle\">标题</label><br>"
            + " <label id=\"ReviewAuthor\" class=\"DlgWriter\">作者</label><br>"
            + " <label id=\"ReviewTime\" class=\"DlgTime\">时间</label><br>"
            + "<div id=\"ScoreEnv\" class=\"\DlgScore\"></div>"
            + "<div id=\"ScoreSer\" class=\"\DlgScore\"></div>"
            + "<div id=\"ScoreFel\" class=\"\DlgScore\"></div>"
            + "<div id=\"Comment\"  class=\"DlgContent\"></div>"
            ).dialog({
        height: 350,
        width: 350,
        modal: true,
        title: "景点评论"
    });
    me._id = opts.id;
    me._onInit(opts);
};

DlgReview.prototype._onInit = function (opts) {
    var me = this;
    $("#ReviewTitle").html(opts.title);
    $("#ReviewAuthor").html(opts.author);
    var time = opts.time.toString();
    $("#ReviewTime").html(time.substring(0, 16));
    $("#ScoreEnv").html("环境评分:" + opts.scoreEnv);
    $("#ScoreSer").html("服务评分:" + opts.scoreSer);
    $("#ScoreFel").html("心情评分:" + opts.scoreFel);
    $("#Comment").html("描述:" + opts.comment);
};