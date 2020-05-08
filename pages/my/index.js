// pages/user-info/index.js

var app = getApp();

var userStatus = require("../../common/userStatus.js");
var redis = require("../../common/redis.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sessionId: null,
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "我的",
      arrowLeft: false,
      loadingHide: true
    },
    userInfo: {
      userImage: null,
      nickName: null,
      noUser: "../../images/no-user.png"
    },
    height:app.globalData.windowHeight-app.globalData.navHeight,
    /**
     * banner轮番图配置
     */
    swiper:{
      indicatorDots:true,
      autoPlay:true,
      indicatorColor:"#fff",
      indicatorActiveColor:"#ffce58"
    },
    /**
     * 功能菜单列表
     */
    menuList: [{
        url: "../../myPackage/pages/user-info/index",
        value: "我的信息",
        icon: "../../images/info.png",
      },
      {
        url: "../../myPackage/pages/my-address/index",
        value: "我的地址",
        icon: "../../images/address.png",
      },
      {
        url: "../../myPackage/pages/my-express/index?type=1",
        value: "我的助寻",
        icon: "../../images/heart.png",
      },
      {
        url: "../../myPackage/pages/my-express/index?type=2",
        value: "我的寻找",
        icon: "../../images/search.png",
      },
      {
        url:"../../myPackage/pages/my-suggestions/index",
        value:"我的建议",
        icon:"../../images/suggest.png"
      },
      {
        url: "../../myPackage/pages/about/index",
        value: "关于我们",
        icon: "../../images/about.png",
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.checkLogin();
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
    this.checkLogin();
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
   * 点击登录
   */
  login: function(event) {
    var flag = app.globalData.userStatusFlag;
    switch (flag) {
      case 0: //未授权
        wx.navigateTo({
          url: '../authorization/index'
        });
        break;
      case 1: //授权未绑定
        wx.navigateTo({
          url: '../bind-number/index',
        });
        break;
      case 3:
        this.showError("服务器故障");
        break;
    }
  },
  /**
   * 检查是否授权以及登录状态
   */
  checkLogin: function() {
    var flag = app.globalData.userStatusFlag;
    switch (flag) {
      case 0: //用户没有授权
        this.setData({
          sessionId: null
        });
        break;
      case 1: //用户授权但是未绑定
        this.setData({
          sessionId: null
        });
        break;
      case 2: //已经登录
        this.getMyUserInfo();
        this.setData({
          sessionId: redis.get("sessionId")
        });
        break;
      case 3:
        this.showError("服务器故障");
        break;
    }
  },
  /**
   * 获取用户信息
   */
  getMyUserInfo: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        var user = res.userInfo;
        that.setData({
          'userInfo.userImage': user.avatarUrl,
          'userInfo.nickName': user.nickName
        });
      }
    });
  },
  /**
   * checkStatus 状态检查
   */
  checkStatus: function(e) {
    var url = e.currentTarget.dataset.url;
    var flag = app.globalData.userStatusFlag;
    switch (flag) {
      case 0: //未授权
        wx.navigateTo({
          url: '../authorization/index?url=' + url
        });
        break;
      case 1: //授权未绑定
        wx.navigateTo({
          url: '../bind-number/index?url=' + url,
        });
        break;
      case 2: //登录过了
        wx.navigateTo({
          url: url
        });
        break;
      case 3:
        this.showError("服务器故障");
        break;
    }
  },
  /**
   * 错误提示
   */
  showError: function(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      mask: "true"
    });
  }
})