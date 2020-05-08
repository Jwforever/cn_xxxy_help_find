// pages/goods-detail/index.js

var app = getApp();
var pages = getCurrentPages();

var request = require("../../common/request.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "物品详情",
      arrowLeft: true,
      loadingHide: true
    },
    scrollHeight: app.globalData.windowHeight - app.globalData.navHeight,
    swiper: {
      indicatorDots: true, //是否显示指示点
      autoPlay: true, //自动播放
      indicatorColor: "rgba(255,255,255,0.5)", //指示点的背景色
      indicatorActiveColor: "#fff" //选中指示点的颜色
    },
    basePath: app.globalData.basePath //根路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init(options.goodsId, options.bindKey);
  },
  /**
   * 初始化
   */
  init: function(goodsId, bindKey) {
    if (goodsId == undefined) {
      goodsId = 0; //随便赋初值，如果为undefined会报400 badRequest
    }
    var url = app.globalData.basePath + '/goods/getGoodsById';
    var data = {
      bindKey: bindKey,
      goodsId: goodsId
    };
    request.getMethod(url, data).then((result) => {
        if (result.code == 100) {
          this.setData({
            images: result.info.goods.images,   //物品的图片
            goodsInfo: result.info.goods.goodsInfo
          });
        } else {
          this.showError("物品不存在！");
        }
      },
      (reason) => {
        this.showError(reason);
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
  onShareAppMessage: function(res) {
    var goodsInfo=this.data.goodsInfo;
    if(res.from=="button"){}
    return{
      title:goodsInfo.name,
      path:"/pages/goods-detail/index?id="+goodsInfo.id,
      imageUrl:app.globalData.basePath+this.data.images[0],
      success:(res)=>{
        console.log("转发成功！"+res)
      }
    }
  },
  /**
   * 返回上一页
   */
  back: function() {
    wx.navigateBack({
      delta: pages[pages.length - 1]
    });
  },
  /**
   * 显示错误
   */
  showError: function(errorMsg) {
    wx.showToast({
      title: errorMsg,
      icon: "none",
      mask: true
    });
  },
  /**
   * 图片预览
   */
  previewImage:function(event){
    var _this=this;
    var imageUrl=event.currentTarget.dataset.url;
    //将图片都加上basePath链接
    var urls=new Array();
    for(let index in (_this.data.images)){
      urls[index]=app.globalData.basePath+_this.data.images[index];
    }
    wx.previewImage({
      urls:urls,
      current:imageUrl,
      success:()=>{
        console.log("图片加载成功");
      },
      fail:()=>{
        _this.showError("系统错误");
      }
    });
  }
})