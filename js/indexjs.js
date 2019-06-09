
/*全局变量*/
var map = null;
var markerList = [];
var reviewMarkerList = [];
var mouseTool = null;

/*初始化*/
$("document").ready(function () {
    map = new AMap.Map('amap', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 16, //初始化地图层级
        center: [112.933231, 28.161098] //初始化地图中心点
    });
    mouseTool = new AMap.MouseTool(map);
    showAllArticles();
});

/*弹窗*/
function markerShowReview(e) {
    var _id = e.target.content;
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "REVIEW_SEARCHID",
            params: {
                id: _id
            }
        },
        success: function (json) {
            var data = json["data"];
            var dataobj = JSON.parse(data);
            var _title = dataobj["title"];
            var _author = dataobj["author"];
            var _comment = dataobj["comment"];
            var _time = dataobj["time"];
            var _scoreEnv = dataobj["scoreEnv"];
            var _scoreSer = dataobj["scoreSer"];
            var _scoreFel = dataobj["scoreFel"];
            _comment = _comment.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');  //转换格式
            new DlgReview({
                "div": "reviewBox",
                "id": _id,
                "title": _title,
                "author": _author,
                "time": _time,
                "comment": _comment,
                "scoreEnv": _scoreEnv,
                "scoreSer": _scoreSer,
                "scoreFel": _scoreFel
            });
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
}

function markerShowArcticle(e) {
    var _id = e.target.content;
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "ARTICLE_SEARCHID",
            params: {
                id: _id
            }
        },
        success: function (json) {
            var data = json["data"];
            var dataobj = JSON.parse(data);
            var _title = dataobj["title"];
            var _author = dataobj["author"];
            var _content = dataobj["content"];
            var _time = dataobj["time"];
            _content = _content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');  //转换格式
            new DlgArcticle({
                "div": "ArctileInfoBox",
                "id": _id,
                "title": _title,
                "author": _author,
                "time": _time,
                "content": _content
            });
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
}

/*显示与隐藏游记和评分*/
function resetReviewMarkerList() {
    map.remove(reviewMarkerList);
    reviewMarkerList = [];
}


function resetMarkerList() {
    map.remove(markerList);
    markerList = [];
}

function hideAllReview() {
    resetReviewMarkerList();
}

function hideAllArticles() {
    resetMarkerList();
}

function showAllArticles() {
    resetMarkerList();
    var _username = "-1";
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "ARTICLE_FINDALL",
            params: {
                username: _username
            }
        },
        success: function (json) {
            var data = json["data"];
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var datai = data[i];
                var dataobj = JSON.parse(datai);
                var id = dataobj["id"];
                var lat = dataobj["lat"];
                var lon = dataobj["lon"];
                var til = dataobj["title"];
                var author = dataobj["author"];

                var marker = new AMap.Marker({
                    icon: "images/like.png",
                    position: [lon, lat],
                    title: til
                });
                marker.content = id;
                marker.emit('click', {target: marker});
                AMap.event.addListener(marker, 'click', markerShowArcticle);
                markerList.push(marker);
            }
            map.add(markerList);
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
}

function showAllReview() {
    resetReviewMarkerList();
    var _username = "-1";
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "REVIEW_FINDALL",
            params: {
                username: _username
            }
        },
        success: function (json) {
            var data = json["data"];
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var datai = data[i];
                var dataobj = JSON.parse(datai);
                var id = dataobj["id"];
                var lat = dataobj["lat"];
                var lon = dataobj["lon"];
                var til = dataobj["title"];
                var marker = new AMap.Marker({
                    icon: "images/like2.png",
                    position: [lon, lat],
                    title: til
                });
                marker.content = id;
                marker.emit('click', {target: marker});
                AMap.event.addListener(marker, 'click', markerShowReview);
                reviewMarkerList.push(marker);
            }
            map.add(reviewMarkerList);
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
}


/*查询*/
function showTypeChange() {
    var value = $("#showType option:selected").val();
    if (value === "review") {
        hideAllArticles();
        showAllReview();
    } else if (value === "article") {
        hideAllReview();
        showAllArticles();
    }
}

function showSearchResult() {
    var value = $("#showType option:selected").val();
    if (value === "review") {
        showSearchReviewResult();
    } else if (value === "article") {
        showSearchArticleResult();
    }
}

function clearSearchResult() {
    $("#searchResultDiv").html("");
    $("#txtSearch").val("");
    showAllArticles();
}

function showSearchArticleResult() {
    resetMarkerList();
    $("#searchResultDiv").html("");
    if ($("#txtSearch").val() === "") {
        alert('输入不能为空');
        return;
    }
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "ARTICLE_SEARCH",
            params: {
                keywords: "%" + $("#txtSearch").val() + "%"
            }
        },
        success: function (json) {
            var data = json["data"];
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var datai = data[i];
                var dataobj = JSON.parse(datai);
                var id = dataobj["id"];
                var lat = dataobj["lat"];
                var lon = dataobj["lon"];
                var til = dataobj["title"];
                var author = dataobj["author"];
                //地图上打点
                var marker = new AMap.Marker({
                    icon: "images/like.png",
                    position: [lon, lat],
                    title: til
                });
                marker.content = id;
                marker.emit('click', {target: marker});
                AMap.event.addListener(marker, 'click', markerShowArcticle);
                markerList.push(marker);
                //导航栏上显示
                var childDiv = $("<div></div>");
                childDiv.attr("id", uuid());
                childDiv.attr("class", "searcResultDiv");
                childDiv.html("标题：" + til);
                childDiv.appendTo($("#searchResultDiv"));
            }
            map.add(markerList);
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
}


function showSearchReviewResult() {
    resetMarkerList();
    $("#searchResultDiv").html("");
    if ($("#txtSearch").val() === "") {
        alert('输入不能为空');
        return;
    }
    Connector({
        url: 'php/OpenTripServer.php',
        data: {
            type: "REVIEW_SEARCH",
            params: {
                keywords: "%" + $("#txtSearch").val() + "%"
            }
        },
        success: function (json) {
            var data = json["data"];
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var datai = data[i];
                var dataobj = JSON.parse(datai);
                var id = dataobj["id"];
                var lat = dataobj["lat"];
                var lon = dataobj["lon"];
                var til = dataobj["title"];
                //地图上打点
                var marker = new AMap.Marker({
                    icon: "images/like2.png",
                    position: [lon, lat],
                    title: til
                });
                marker.content = id;
                marker.emit('click', {target: marker});
                AMap.event.addListener(marker, 'click', markerShowArcticle);
                markerList.push(marker);
                //导航栏上显示
                var childDiv = $("<div></div>");
                childDiv.attr("id", uuid());
                childDiv.attr("class", "searcResultDiv");
                childDiv.html("标题：" + til);
                childDiv.appendTo($("#searchResultDiv"));
            }
            map.add(markerList);
        },
        failure: function (json) {
            alert('查询数据库失败');
        }
    });
}

/*分区统计*/
var overlays = [];
function partitionStatistics() {
    var commentsInPolygon = [];
    var drawPolygon = mouseTool.polygon();
    AMap.event.addListener(mouseTool, 'draw', function (e) {
        overlays.push(e.obj);
        var len = reviewMarkerList.length;
        for (var i = 0; i < len; i++) {
            if (AMap.GeometryUtil.isPointInRing(reviewMarkerList[i].getPosition(), e.obj.getPath())) {
                commentsInPolygon.push(parseInt(reviewMarkerList[i].content));
            }
        }
        Connector({
            url: 'php/OpenTripServer.php',
            data: {
                type: "REVIEW_CACULATEAVG",
                params: {
                    ids: commentsInPolygon.toString()
                }
            },
            success: function (json) {
                var dataobj = json["data"];
                var scoreEnv = dataobj["env"];
                var scoreSer = dataobj["ser"];
                var scoreFel = dataobj["fel"];
                new DlgAvgChart({
                    div: "statisticsBox",
                    name: ['环境', '服务', '心情'],
                    data: [scoreEnv, scoreSer, scoreFel]
                });
            },
            failure: function (json) {
                alert('查询数据库失败');
            }
        });
    });
}

function exitPartitionStatistics() {
    map.remove(overlays);
    overlays = [];
    mouseTool.close(true);
}
