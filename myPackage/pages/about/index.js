// pages/about/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "关于我们",
      arrowLeft: true,
      loadingHide: true
    },
    height: app.globalData.tabBarHeight + app.globalData.windowHeight,
    nodes: [{
      name: "div",
      attrs: {
        class: "description",
        style: ""
      },
      children: [{
        type: "text",
        text: "我们是来自于新乡学院的大学生，同时也是一群充满理想和抱负的少年。我们开发助寻致力于帮助发现、共创美好。",
      }]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 返回
   */
  back: function () {
    wx.switchTab({
      url: '../../../pages/my/index',
    });
  }
})