// pages/user--info/index.js

var app=getApp();

var pages=getCurrentPages();
var redis=require("../../../common/redis.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      s_name: "",
      s_sex: "",
      s_class: "",
      s_number: "",
      s_faculty: "",
    },
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "我的信息",
      arrowLeft: true,
      loadingHide:true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      var sessionId = redis.get("sessionId");
      //已经登录
      wx.request({
        url: app.globalData.basePath + '/user/getStudentInfo.action',
        data: {
          sessionId: sessionId
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "post",
        dataType: "json",
        success: function (result) {
          result = result.data;
          //成功
          if (result.code == 100) {
            var s_info = result.info.student;
            that.setData({
              "info.s_number": s_info.s_number,
              "info.s_name": s_info.s_name,
              "info.s_sex": s_info.s_sex,
              "info.s_faculty": s_info.s_faculty,
              "info.s_class": s_info.s_class
            });
          } else {
            wx.showToast({
              title: '服务器错误！',
              icon: "none",
              mask: true
            });
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
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
  back:function(){
    wx.switchTab({
      url: '../../../pages/my/index',
    });
  }
})