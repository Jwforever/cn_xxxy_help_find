// pages/my-suggestions/index.js

var app=getApp();
var redis = require("../../../common/redis.js");
var request = require("../../../common/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "我的建议",
      arrowLeft: true,
      loadingHide: true
    },
    pageHeight:app.globalData.windowHeight+app.globalData.tabBarHeight,
    functions:[
      {
        functionName:"我的建议",
        size:0,
        isActive:true
      },
      {
        functionName:"我的回复",
        size:0,
        isActive:false
      }
    ],
    functionActiveIndex:0,
    list:[],        //用于显示当前功能的建议数据
    suggestionList:[],  //用于保存全部建议
    replySuggestionList:[] //用于保存已回复建议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.getMyAllSuggestions()
  },
  /**
   * 得到全部建议
   */
  getMyAllSuggestions(){
    var that = this;
    let sessionId = redis.get("sessionId");
    let url = app.globalData.basePath + '/user/getMyAllSuggestionList';
    let data = {
      sessionId: sessionId
    }
    request.getMethod(url, data).then((res) => {
      if (res.code == 100) {
        that.setData({
          suggestionList: res.info.suggestionList,
          replySuggestionList:res.info.replySuggestionList,
          'functions[0].size':res.info.suggestionList.length,
          'functions[1].size': res.info.replySuggestionList.length,
          list:res.info.suggestionList
        });
      } else {
        that.showError("服务器故障");
      }
    });
  },
  /**
   * 获取用户头像以及用户名称
   */
  getUserInfo:function(){
    var _this=this;
    wx.getUserInfo({
      success:(res)=>{
        let userInfo=res.userInfo;
        _this.setData({
          'user.nickName':userInfo.nickName,
          'user.userImage':userInfo.avatarUrl
        });
      },
      fail:()=>{
        _this.showError("授权失效，请重新授权");
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
   * 返回
   */
  back:function(){
    wx.switchTab({
      url: '../../../pages/my/index',
    });
  },
  /**
   * 改变功能
   */
  changeContent:function(event){
    let index=event.target.dataset.index;
    let nowIndex=this.data.functionActiveIndex;
    let nowActive='functions['+nowIndex+'].isActive';
    let nextActive='functions['+index+'].isActive';
    if(this.data.functionActiveIndex!=index){
      if(index==0){
        this.setData({
          list:this.data.suggestionList
        })
      }else{
        this.setData({
          list: this.data.replySuggestionList
        })
      }
      this.setData({
        [nowActive]:false,
        functionActiveIndex:index,
        [nextActive]:true
      });
    }else{
      //不进行任何操作
    }
  },
  /**
   * 编辑新
   */
  edit:function(){
    wx.navigateTo({
      url: '../suggest/index',
    });
  },
  /**
   * 显示错误
   */
  showError:function(errorMsg){
    wx.showToast({
      title: errorMsg,
      icon:'none',
      mask:true
    });
  },
  /**
   * 进入建议详情页
   */
  getDetail:function(e){
    wx.navigateTo({
      url: '../suggestion-detail/index?suggestionId='+e.currentTarget.dataset.id,
    })
  }
})