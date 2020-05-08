//app.js
var userStatus = require("common/userStatus.js");

App({
  // 引入`towxml3.0`解析方法
  towxml: require('/towxml/index'),
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    //获取设备信息
    var that = this;
    let menuButtonObject = wx.getMenuButtonBoundingClientRect(); //获取顶部胶囊信息
    wx.getSystemInfo({
      success: function(res) {
        var statusBarHeight = res.statusBarHeight;  //状态栏的高度
        var height = menuButtonObject.top - statusBarHeight; //胶囊距离上下的高度
        var menuButtonHeight = menuButtonObject.height; //胶囊高度
        that.globalData.navHeight = menuButtonHeight + height * 2 + statusBarHeight; //顶部导航栏高度
        that.globalData.windowHeight = res.windowHeight; //可用高度
        var screenHeight = res.screenHeight; //获取屏幕的高度
        that.globalData.tabBarHeight=screenHeight-res.windowHeight-that.globalData.navHeight; //底部tabBar高度
      }
    });
  },
  onShow: function() {
    userStatus.getUserStatus().then((data) => {
        this.globalData.userStatusFlag = data;
      },
      (data) => {
        this.globalData.userStatusFlag = data;
      });
  },
  globalData: {
    navHeight: null, //状态栏的高度
    windowHeight: null, //可用窗口高度
    tabBarHeight:null, //底部tabBar高度
    basePath: "http://localhost:8080", //访问链接的前缀
    userStatusFlag: null //用户状态(0：未登录 1：登录未绑定 2：已登录 3:服务器故障)
  }
})