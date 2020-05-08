// pages/suggest/index.js

var app = getApp();
var pages=getCurrentPages();
var redis = require("../../../common/redis.js");
var request = require("../../../common/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"", //建议
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "发表建议",
      arrowLeft: true,
      loadingHide: true
    },
    pageHeight: app.globalData.windowHeight + app.globalData.tabBarHeight,
    handInDisabled: true,
    nowSize:0,
    files: [],
    urls:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
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
   wx.navigateBack({
     delta:pages[pages.length-1],
     complete: (res) => {},
   });
  },
  /**
   * 
   * 检测是否有输入
   */
  inputCheck: function (event) {
    let handInDisabled = true;
    let value = event.detail.value;
    if (value != "" && value != null) {
      handInDisabled = false;
    }
    this.setData({
      value:value,
      nowSize:value.length,
      handInDisabled: handInDisabled
    });
  },
  /**
   * 图片上传相关
   */
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      var tempFilePaths = files.tempFilePaths;
      if (tempFilePaths.length > 0) {
        //上传成功
        console.log("上传成功")
        resolve({
          urls: tempFilePaths
        });
      } else {
        reject('some error');
      }
    });
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    this.setData({
      urls: this.data.urls.concat(e.detail.urls)
    });
    console.log('upload success', e.detail)
  },
  deleteImage: function (e) {
    let deleteIndex = e.detail.index;
    this.data.urls.splice(deleteIndex, 1);
  },
  //上传建议内容
  submitSuggestion:function(){
    let that =this;
    let value = this.data.value;
    let url = app.globalData.basePath + '/user/uploadBasicSuggestion';
    let sessionId = redis.get("sessionId");
    let data = {
      suggestion:value,
      sessionId: sessionId
    };
    request.getMethod(url, data).then((res) => {
      if (res.code == 100) {
        that.setData({
          bindKey: res.info.bindKey
        });
        //上传图片
        that.uploadImage().then((data) => {
          //跳转到我的建议页面
            wx.showToast({
              title: "反馈成功",
              icon: "",
            });
          wx.redirectTo({
            url: '../my-suggestions/index',
          })
        });
      } else {
        that.showError("服务器故障");
      }
    },);
  },
  //上传建议图片
  uploadImage: function () {
    return new Promise((resolve, reject) => {
      var that = this;
      var images = this.data.urls;
      var bindKey = that.data.bindKey;
      for (var i = 0; i < images.length; i++) {
        wx.uploadFile({
          url: app.globalData.basePath + "/user/bindImageToSuggestion",
          filePath: images[i],
          name: "image",
          formData: {
            "sessionId": redis.get("sessionId"),
            "bindKey": bindKey,
          },
          success: (res) => {
            console.log("图片" + i + "上传成功")
          }
        });
      }
      resolve(null);
    });
  },

})