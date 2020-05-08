// pages/my-address/index.js

var app = getApp();

var pages = getCurrentPages();
var redis = require("../../../common/redis.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "我的地址",
      arrowLeft: true,
      loadingHide: true
    },
    scrollHeight: app.globalData.windowHeight - app.globalData.navHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var sessionId = redis.get("sessionId");
    wx.request({
      url: app.globalData.basePath + "/address/getUserAddress",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "get",
      dataType: "json",
      data: {
        sessionId: sessionId
      },
      success: function(res) {
        res = res.data;
        if (res.code == 100) {
          that.setData({
            address: res.info.Address
          });
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            mask: true
          });
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '服务器错误',
          icon: 'none',
          mask: true
        });
      }

    })
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
  /**
   * 返回
   */
  back: function() {
    wx.switchTab({
      url: '../../../pages/my/index',
    });
  },
  /**
   * 添加新地址
   */
  addNewAddress: function() {
    wx.navigateTo({
      url: '../addOrModify-address/index',
    });
  },
  /**
   * 编辑地址
   */
  editAddress: function(e) {
    var addressId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../addOrModify-address/index?addressId=' + addressId
    });
  }
})