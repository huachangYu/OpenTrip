DlgArcticle = function (opts) {
    var me = this;
    me._dlg = $("#" + opts.div).html(
            "   <label id=\"ArticleTitle\" class=\"DlgTitle\">标题</label><br>"
            + " <label id=\"ArticleAuthor\" class=\"DlgWriter\">作者</label><br>"
            + " <label id=\"ArticleTime\" class=\"DlgTime\">时间</label><br>"
            + "<div id=\"ArticleContent\" class=\"DlgContent\"></div>"
            + "<div id=\"ArticleButtom\">已有<a id=\"ALikeNum\"></a>人点赞</div>"
            ).dialog({
        height: 350,
        width: 350,
        modal: true,
        title: "游记/日记",
        buttons: [{
                text: "点赞",
                click: function () {
                    me._onLike();
                }
            }, {
                text: "评论",
                click: function () {
                    me._onComment();
                }
            }]
    });
    me._id = opts.id;
    me._liked = false;
    me._setView(opts);
    me._setLikeAndComment();
};

DlgArcticle.prototype._setView = function (opts) {
    var me = this;
    $("#ArticleTitle").html(opts.title);
    $("#ArticleAuthor").html(opts.author);
    var time=opts.time.toString();
    $("#ArticleTime").html(time.substring(0,16));
    $("#ArticleContent").html(opts.content);
};

DlgArcticle.prototype._onLike = function () {
    var me = this;
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "ARTICLE_LIKE",
            params: {
                id: me._id
            }
        },
        success: function (json) {
            if (me._liked) {
                alert('你已点赞，无需重复点赞');
            } else {
                me._liked = true;
                me._setLikeAndComment();
                alert("点赞成功");
            }
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
};

DlgArcticle.prototype._onComment = function () {
    var me = this;
    var commentDiv = $("<div></div>");
    commentDiv.attr("id", "ArticleComment");
    commentDiv.html("<input id=\"txtComment\" type=\"text\"/><button id=\"btnSubmitComment\" onclick=\"submitComment("+me._id+")\">提交</button>")
    commentDiv.appendTo(me._dlg);
};

DlgArcticle.prototype._setLikeAndComment = function () {
    var me = this;
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "ARTICLE_LIKEANDCOMMENT",
            params: {
                id: me._id
            }
        },
        success: function (json) {
            var data = json["data"];
            var dataobj = JSON.parse(data);
            var like = dataobj["like"];
            var comments = dataobj["comments"];
            $("#ALikeNum").html(like);
            for (var i = 0; i < comments.length; i++) {
                var commentDiv = $("<div></div>");
                commentDiv.attr("id", "ArticleComment");
                commentDiv.html("评论"+i+": "+comments[i]);
                commentDiv.appendTo($("#ArticleButtom"));
            }
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
};

function submitComment(id) {
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "ARTICLE_COMMENT_SUBMIT",
            params: {
                user_id: -1,
                article_id: id,
                comment: $("#txtComment").val()
            }
        },
        success: function (json) {
            alert("评论成功");
            
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
}
