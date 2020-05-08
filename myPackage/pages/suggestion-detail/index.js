// pages/suggestion-detail/index.js

var app = getApp();
var pages = getCurrentPages();
var redis = require("../../../common/redis.js");
var request = require("../../../common/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData.basePath,
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "我的建议",
      arrowLeft: true,
      loadingHide: true
    },
    pageHeight:app.globalData.windowHeight+app.globalData.tabBarHeight,
    footer:{
      responseHide:false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
    let suggestionId = options.suggestionId;
    let that = this;
    let sessionId = redis.get("sessionId")
    let url = app.globalData.basePath + '/user/getSuggestionDetail';
    let data = {
      sessionId: sessionId,
      suggestionId:suggestionId
    };
    request.getMethod(url, data).then((res) => {
      if (res.code == 100) {
        that.setData({
          suggestion:res.info.suggestion,
        });
      } else {
        that.showError("服务器故障");
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 返回上一页
   */
  back: function () {
    wx.navigateBack({
      delta: pages[pages.length - 1]
    });
  },
  getUserInfo: function () {
    var _this = this;
    wx.getUserInfo({
      success: (res) => {
        let userInfo = res.userInfo;
        _this.setData({
          'user.nickName': userInfo.nickName,
          'user.userImage': userInfo.avatarUrl
        });
      },
      fail: () => {
        _this.showError("授权失效，请重新授权");
      }
    });
  },
})