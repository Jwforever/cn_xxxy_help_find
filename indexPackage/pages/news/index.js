// pages/news/index.js

var app = getApp();
var pages = getCurrentPages();
var request = require("../../../common/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "助寻新闻",
      arrowLeft: true,
      loadingHide: true
    },
    news: {
      newsTitle: "",
      createdTime: "",
      author: "",
      clicks: ""
    },
    isLoading: true, // 判断是否尚在加载中
    article: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadNewsDetail(options.news_id);
  },
  /**
   * 加载新闻详情
   */
  loadNewsDetail: function (news_id) {
    var url = app.globalData.basePath + "/news/getNewsDetail.action";
    var data = {
      news_id: news_id
    };
    request.getMethod(url, data).then((result) => {
        if (result.code == 100) {
          //成功
          this.setData({
            'news.clicks': result.info.clicks
          });
          result = result.info.newsDetail;
          this.setData({
            'news.newsTitle': result.news_name,
            'news.author': result.author,
            'news.createdTime': result.created_time,
          });
          var markdown = result.news_content;
          let res = app.towxml(markdown, 'markdown');
          this.setData({
            article: res,
            isLoading: false
          });
        } else {
          this.showError("服务器错误");
        }
      },
      (data) => {
        this.showError(data);
      });
  },
  /**
   * 显示错误
   */
  showError: function (errorMsg) {
    wx.showToast({
      title: errorMsg,
      icon: "none",
      mask: true
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*用户返回*/
  back: function () {
    wx.navigateBack({
      delta: pages[pages.length - 1],
    });
  }
})