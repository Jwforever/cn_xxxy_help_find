// pages/bind-number/index.js

var userStatus = require("../../common/userStatus.js");
var app = getApp();
var pages = getCurrentPages();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    s_number: "",
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "绑定学号",
      arrowLeft: true,
      loadingHide:true
    },
    buttonStatus: true //按钮状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var url = options.url;
    var fromAuthorization = options.fromAuthorization;
    if (url != null && url != "" && url != "undefine") {
      this.setData({
        url: url
      });
    }
    if (fromAuthorization != null && fromAuthorization != "undefine" && fromAuthorization != "") {
      this.setData({
        fromAuthorization: fromAuthorization
      });
    }
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
   * 返回
   */
  back: function() {
   wx.navigateBack({
     delta:pages[pages.length-1]
   });
  },
  /**
   * 获取学号
   */
  getNumber: function(e) {
    var flag = true; //按钮初始状态
    var s_number = e.detail.value;
    if (s_number.length > 0) {
      flag = false;
    } else {
      flag = true;
    }
    this.setData({
      s_number: e.detail.value,
      buttonStatus: flag
    });
  },
  /**
   * 提交
   */
  handIn: function(e) {
    var that = this;
    var loginSessionId = wx.getStorageSync("loginSessionId");
    wx.request({
      url: app.globalData.basePath + '/user/studentBind.action',
      data: {
        s_number: that.data.s_number,
        loginSessionId: loginSessionId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "post",
      dataType: "json",
      success: function(result) {
        result = result.data;
        if (result.code == 200) {
          //绑定失败
          wx.showToast({
            title: result.msg,
            icon: "none",
            mask: true
          });
        } else {
          wx.removeStorageSync("loginSessionId");
          //绑定成功(重新获取用户状态，然后跳转)
          userStatus.getUserStatus().then((data) => {
            app.globalData.userStatusFlag = data;
            that.showSuccess();
          }).then((data) => {
              var url = that.data.url;
              if (url != null && url != "" && url != "undefine") {
                wx.reLaunch({
                  url: url,
                });
              } else {
                var fromAuthorization=that.data.fromAuthorization;
                //返回
                if (fromAuthorization != null && fromAuthorization != "undefine" && fromAuthorization != "") {
                  wx.navigateBack({
                    delata: pages[pages.length - 2]
                  });
                } else {
                  wx.navigateBack({
                    delata: pages[pages.length - 1]
                  });
                }

              }
            },
            (reason) => {
              console.log("显示绑定成功失败!");
            });
        }
      }
    });
  },
  /**
   * 展示成功
   */
  showSuccess: function() {
    return new Promise((resolve, reject) => {
      wx.showToast({
        title: '绑定成功',
        icon: "success",
        duration: 1000, //显示1s
        mask: true,
        success: function() {
          resolve();
        },
        fail: function() {
          reject();
        }
      });
    });
  }
})