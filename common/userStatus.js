/**
 * @Author HGQIN
 * 判断用户的登录状态(返回值的几种状态)
 * 0 未登录
 * 1 登录未绑定
 * 2 登录
 */
var userAuthorization = require("userAuthorization.js");
var redis=require("redis.js");

function getUserStaus() {
  return userAuthorization.getUserAuthorizationStatus().then((data) => {
    var flag = data;
    if (flag == 1) {
      return new Promise((resolve, reject) => {
        //没有登录，请求登录
        wx.login({
          success: function (res) {
            wx.request({
              url:'http://localhost:8080/user/login.action',
              method: "post",
              data: {
                code: res.code
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              dataType: "json",
              success: (result) => {
                result = result.data;
                if (result.code == 100) {
                  //登录成功状态
                  redis.put("sessionId",result.info.sessionId,6*60*60);
                  flag=2;
                } else {
                  //授权未绑定
                  flag = 1;
                }
                console.log(flag);
                resolve(flag);
              },
              fail: () => {
                reject(3);
              }
            });
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(flag);
      });
    }
  });
}


module.exports = {
  getUserStatus: getUserStaus
};