/**
 * 
 * @returns {undefined}
 * Connector({
 *  url: "",
 *  data:{
 *      type: "",
 *      params:{
 *        username:"",
 *        password:""  
 *      }
 *  },
 *  success:function(json){
 *  },
 *  failure:function(json){
 *  }
 * })
 */

Connector = function(opts){
    var me = this;
    me._opts = $.extend({
        url: "php/OpenTripServer.php"
    }, opts);

    $.ajax({
        url: me._opts.url,
        method: "POST",
        data: {
            request:me._opts.data
        },
        success: function (data) {
            var json = JSON.parse(data);
            if (json.success) {
                if (me._opts.success) {
                    me._opts.success(json);
                } else {
                    alert(json.message);
                }
            } else {
                if (me._opts.failure) {
                    me._opts.failure(json);
                } else {
                    alert(json.message);
                }
            }
        },
        error: function (data) {
            alert("网络异常");
        }
    });
};

