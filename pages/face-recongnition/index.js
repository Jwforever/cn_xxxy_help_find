// pages/face-recongnition/index.js

var app = getApp();
var pages=getCurrentPages();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "人脸识别",
      arrowLeft: true,
      loadingHide: true
    },
    height: app.globalData.tabBarHeight + app.globalData.windowHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAuthorize();
  },
  /**
   * 判断用户是否授权
   */
  isAuthorize: function() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if ((res.authSetting)['scope.camera']) {
            resolve();
          } else {
            //用户没有授权
            reject("取消授权");
          }
        }
      });
    });
  },
  /**
   * 获取授权
   */
  getAuthorize: function() {
    var that = this;
    this.isAuthorize().then((resolve, reject) => {
        that.setData({
          isButtonHide: true
        });
      },
      (reason) => {
        //弹窗询问用户是否给与摄像头权限
        wx.authorize({
          scope: 'scope.camera',
          success: () => {
            that.setData({
              isButtonHide: true
            });
          },
          fail: () => {
            //用户没有授权
            that.setData({
              isButtonHide: false
            });
          }
        });
      });
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
   * 引导用户开启摄像头权限
   */
  openSetting: function() {
    var that = this;
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.camera']) {
          that.setData({
            isButtonHide: true
          })
        }
      }
    });
  },
  /**
   * 返回上一页
   */
  back:function(){
    wx.navigateBack({
      delta: pages[pages.length - 1]
    });
  }
})