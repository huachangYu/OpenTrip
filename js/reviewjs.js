var map = null;
var lat = 0.0, lng = 0.0;
var positionMarker = null;

$("document").ready(function () {
    map = new AMap.Map('yourPositionMap', {
        resizeEnable: true,
        zoom: 16
    });
    var options = {
        'showButton': true, //是否显示定位按钮
        'buttonPosition': 'LB', //定位按钮的位置
        'buttonOffset': new AMap.Pixel(10, 20), //定位按钮距离对应角落的距离
        'showMarker': true, //是否显示定位点
        'markerOptions': {//自定义定位点样式，同Marker的Options
            'offset': new AMap.Pixel(-18, -36),
            'content': '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
        },
        'showCircle': true, //是否显示定位精度圈                    'circleOptions': {//定位精度圈的样式
        'strokeColor': '#0093FF',
        'noSelect': true,
        'strokeOpacity': 0.5,
        'strokeWeight': 1,
        'fillColor': '#02B0FF',
        'fillOpacity': 0.25
    };
    AMap.plugin(["AMap.Geolocation"], function () {
        var geolocation = new AMap.Geolocation(options);
        geolocation.getCurrentPosition(function (status, result) {
            if (status === 'complete') {
                onComplete(result);
            } else {
                onError(result);
            }
        });
    });
});

function markerDragging(e) {
    var lon = positionMarker.Ge.position["lng"];
    var lat = positionMarker.Ge.position["lat"];
    $("#authorLon").val(lon);
    $("#authorLat").val(lat);
}
//解析定位结果
function onComplete(data) {
    var lat = data.position.lat;
    var lon = data.position.lng;
    $("#authorLon").val(lon);
    $("#authorLat").val(lat);
    var position = [lon, lat];
    map.setCenter(position);
    positionMarker = new AMap.Marker({
        icon: "images/position.png",
        position: position,
        title: 'your position',
        draggable: true
    });
    positionMarker.on('dragging', markerDragging);
    map.add(positionMarker);
}
//解析定位错误信息
function onError(data) {
    console.log(data.message);
}

function insertReview(){
    var author_name = 'unnamed';
    if ($('#isUnamed').is(':checked') === false) {
        author_name = "yuhuachang";
    }
    var scoreEnv = $("#SelectScoreEnvironment option:selected").val();
    var scoreSer = $("#SelectScoreServe option:selected").val();
    var scoreFel = $("#SelectScoreFeeling option:selected").val();
    Connector({
         url: 'php/OpenTripServer.php',
        data: {
            type: "REVIEW_INSERT",
            params: {
                title:$("#reviewTitle").val(),
                author_name:author_name,
                author_id:-1,
                lat: $("#authorLat").val(),
                lon: $("#authorLon").val(),
                scoreEnv:parseInt(scoreEnv),
                scoreSer:parseInt(scoreSer),
                scoreFel:parseInt(scoreFel),
                comment:$("#reviewContent").val()
            }
        },
        success: function (json) {
            alert('insert review succeed!');
            location.reload();
        },
        failure: function (json) {
            alert('写入数据库失败');
        }
    });
}