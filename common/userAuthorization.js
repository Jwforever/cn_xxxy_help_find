/**
 * @Author:HGQIN
 * 0 未授权
 * 1 未登录
 * 2 登录完成
 */

var redis = require("redis.js");

function getUserAuthorizationStatus() {
  var flag = 0;
  return new Promise((resolve, reject) => {
    //判断用户是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          //授权
          var sessionId = redis.get("sessionId");
          if (sessionId != null && sessionId != "") {
            flag = 2;
          } else {
            flag = 1;
          }
        } else {
          flag = 0;
        }
        resolve(flag);
      }
    });
  });
}


module.exports = {
  getUserAuthorizationStatus: getUserAuthorizationStatus
}