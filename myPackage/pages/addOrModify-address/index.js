// pages/add-address/index.js

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
      navTitle: "",
      arrowLeft: true,
      loadingHide: true
    },
    sexs: [{
        type: 1,
        value: "先生"
      },
      {
        type: 2,
        value: "女士"
      }
    ],
    input: {
      address: "",
      name: "",
      phone: "",
      sexType: 1,
      /**0,1,2表示，默认为男*/
      switchType: false /*true 或者false，默认为关闭状态*/
    },
    addressId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (Object.keys(options).length > 0) {
      var addressId = options.addressId;
      //修改地址
      this.setData({
        'navigation.navTitle': "编辑地址",
        showDeleteButton: false,
        addressId: addressId
      });
      //获取当前地址的详情
      var sessionId = redis.get("sessionId");
      let that = this;
      wx.request({
        url: app.globalData.basePath + '/address/getUserSingleAddress',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "get",
        dataType: "json",
        data: {
          sessionId: sessionId,
          addressId: addressId
        },
        success: function(res) {
          if (res.data.code == 100) {
            //获取成功(直接赋值给input就行，看上面的data)
            that.setData({
              addressId: res.data.info.address.id,
              input: {
                address: res.data.info.address.address,
                name: res.data.info.address.name,
                phone: res.data.info.address.phone,
                sexType: res.data.info.address.sex,
                switchType: res.data.info.address.first
              }

            });
          } else {
            that.showError(res.data.msg);
          }
        },
        fail: function(res) {
          that.showError("服务器错误");
        }
      });
    } else {
      //添加新地址
      this.setData({
        'navigation.navTitle': "添加新地址",
        showDeleteButton: true
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
   * 监听输入框
   */
  inputAddress: function(event) {
    let address = event.detail.value;
    this.setData({
      'input.address': address
    });
  },
  inputName: function(event) {
    let name = event.detail.value;
    this.setData({
      'input.name': name
    });
  },
  inputPhone: function(event) {
    let phone = event.detail.value;
    this.setData({
      'input.phone': phone
    });
  },
  radioChange: function(event) {
    var sexType = event.detail.value;
    this.setData({
      'input.sexType': sexType
    });
  },
  switchChange: function(event) {
    var switchType = event.detail.value;
    this.setData({
      'input.switchType': switchType
    });
  },
  /**
   * 返回上一页
   */
  back: function() {
    wx.navigateBack({
      delta: pages[pages.length - 1],
    });
  },
  /**
   * 保存地址
   */
  saveAddress: function() {
    var input = this.data.input;
    var count = 0; //计数器
    var errorTitle = null;
    for (var item in input) {
      if (input[item] == "" || input[item] == null) {
        switch (count) {
          case 0:
            errorTitle = "请输入地址";
            break;
          case 1:
            errorTitle = "请输入联系人姓名";
            break;
          case 2:
            errorTitle = "请输入手机号";
            break;
        }
        break;
      }
      count++;
    }

    if (errorTitle != null) {
      that.showError(errorTitle);
    } else {

      //验证通过，提交数据(直接后去input就行，刚好是一个json串)
      var addressId = this.data.addressId;
      let sessionId = redis.get("sessionId");
      var that = this;
      if (addressId != null && addressId != "") {
        //修改地址
        wx.request({
          url: app.globalData.basePath + '/address/updateUserSingleAddress',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "post",
          dataType: "json",
          data: {
            sessionId: sessionId,
            id: addressId,
            name: input.name,
            phone: input.phone,
            address: input.address,
            first: input.switchType,
            sex: input.sexType
          },
          success: function(res) {
            if (res.data.code == 100) {
              //获取成功(直接赋值给input就行，看上面的data)
              wx.switchTab({
                url: '../../../pages/my/index',
                success: function() {
                  wx.showToast({
                    title: '成功',
                    mask: true
                  });
                }
              });
            } else {
              that.showError("服务器错误");
            }
          },
          fail: function(res) {
            that.showError("服务器错误");
          }
        });
      } else {
        //添加新地址
        wx.request({
          url: app.globalData.basePath + '/address/addUserAddress',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "post",
          dataType: "json",
          data: {
            sessionId: sessionId,
            name: input.name,
            phone: input.phone,
            address: input.address,
            first: input.switchType,
            sex: input.sexType
          },
          success: function(res) {
            if (res.data.code == 100) {
              //获取成功(直接赋值给input就行，看上面的data)
              wx.switchTab({
                url: '../../../pages/my/index',
                success: function() {
                  wx.showToast({
                    title: '成功',
                    mask: true
                  });
                }
              });
            } else {
              that.showError("服务器错误");
            }
          },
          fail: function(res) {
            that.showError("服务器错误");
          }
        });
      }
    }
  },
  /**
   * 删除地址
   */
  deleteAddress: function(event) {
    var that = this;
    var addressId = event.currentTarget.dataset.addressid
    var sessionId = redis.get("sessionId");
    //根据addressId删除
    wx.request({
      url: app.globalData.basePath + '/address/delUserSingleAddress',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "post",
      dataType: "json",
      data: {
        sessionId: sessionId,
        addressId: addressId,
      },
      success: function(res) {
        if (res.data.code == 100) {
          //获取成功(直接赋值给input就行，看上面的data)

          wx.switchTab({
            url: '../../../pages/my/index',
            success: function() {
              wx.showToast({
                title: '成功',
                mask: true
              });
            }
          });
        } else {
          that.showError("服务器错误");
        }
      },
      fail: function(res) {
        that.showError("服务器错误");
      }
    });
  },
  /**
   * 显示错误
   */
  showError: function(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      mask: true
    });
  }
})