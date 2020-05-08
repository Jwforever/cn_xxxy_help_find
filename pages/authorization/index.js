// pages/authorization/index.js
var app = getApp();
var pages = getCurrentPages();
var userStatus = require("../../common/userStatus.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOneButtonDialog: false,
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "授权",
      arrowLeft: true,
      loadingHide: true
    },
    height: app.globalData.windowHeight+app.globalData.tabBarHeight,
    oneButton: [{
      text: "确定"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var url=options.url;
    if(url!="undefine"&&url!=null&&url!=""){
      this.setData({
        url:url //用来记录登录成功后跳转的页面
      });
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //返回事件
  back: function(event) {
    //返回上一页
    wx.navigateBack({
      delta: pages[pages.length - 1]
    });
  },
  tapDialogButton(e) {
    this.setData({
      showOneButtonDialog: false
    })
  },
  //授权事件
  bindGetUserInfo: function(e) {
    var that=this;
    if (e.detail.userInfo) {
      //用户允许授权
      app.globalData.userStatusFlag = 1; //修改userStatusFlag
      wx.login({
        success: function(res) {
          wx.request({
            url: app.globalData.basePath + '/user/login.action',
            data: {
              code: res.code
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: "post",
            dataType: "json",
            success: function(result) {
              result = result.data;
              if (result.code == 200) {
                wx.setStorageSync("loginSessionId", result.info.loginSessionId);
                //没绑定学号情况,跳转到绑定学号页面
                let url = that.data.url;
                if (url != null && url != "" && url != "undefine") {
                  wx.redirectTo({
                    url: '../bind-number/index?url='+url+"&fromAuthorization=true", //绑定学号页面
                  });
                }else{
                  wx.redirectTo({
                    url: '../bind-number/index?fromAuthorization=true', //绑定学号页面
                  });
                }
              } else {
                //绑定学号了（重新获取用户状态，返回上一页)
                userStatus.getUserStatus().then((data) => {
                  return new Promise((resolve, reject) => {
                    app.globalData.userStatusFlag = data;
                    resolve();
                  });
                }).then((data) => {
                  let url=that.data.url;
                  if(url!=null&&url!=""&&url!="undefine"){
                    wx.reLaunch({
                      url: url,
                    });
                  }else{
                    wx.navigateBack({
                      delta: pages[pages.length - 1]
                    });
                  }
                });
              }
            }
          })
        }
      });
    } else {
      //用户不允许授权
      this.setData({
        showOneButtonDialog: true,
      });
    }
  }
})