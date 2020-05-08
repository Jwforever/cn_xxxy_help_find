// pages/express/index.js
var app = getApp();
var redis = require("../../common/redis.js");
var request = require("../../common/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    bindKey: "", //用于将上传的图片和物品id绑定
    isActive: true, //用来记录当前发布类型
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "发布",
      arrowLeft: false,
      loadingHide: true
    },
    scrollHeight: app.globalData.windowHeight - app.globalData.navHeight,
    inputTextAreaLength: 0,
    hintColor: false, //字数提示
    categoryName: [], //记录商品类别
    categoryId: [], //用来记录商品类别的id值
    categoryIndex: 0,
    files: [],
    /**
     * 提交需要的数据
     */
    type: 1, //表示发布类型
    name: null, //物品名称
    c_id: null, //商品类别
    description: null, //商品的描述
    urls: [], //图片的链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.statusCheck();
  },
  /**
   * 根据状态显示不同信息
   */
  statusCheck: function() {
    var flag = app.globalData.userStatusFlag;
    switch (flag) {
      case 0:
        this.setData({
          prompt: "您还没有授权，暂时不能发布呦！",
          promptButton: "授权"
        });
        break;
      case 1:
        this.setData({
          prompt: "您还没有绑定，暂时不能发布呦！",
          promptButton: "绑定"
        });
        break;
      case 2:
        this.setData({
          isLogin: true
        });
        this.init();
        break;
    }
  },
  /**
   * 初始化
   */
  init: function() {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
      isLogin: true
    });
    //获取类别
    var url = app.globalData.basePath + '/goods/getCategory';
    request.getMethod(url, null).then((result) => {
        if (result.code == 100) {
          let category = result.info.category;
          let categoryName = new Array();
          let categoryId = new Array();
          for (var i = 0; i < category.length; i++) {
            categoryName[i] = category[i].name;
            categoryId[i] = category[i].id;
          }
          this.setData({
            categoryName: categoryName,
            categoryId: categoryId,
            c_id: categoryId[0]
          });
        } else {
          this.showError("服务器故障");
        }
      },
      (reason) => {
        this.showError(reason);
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.statusCheck();
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
   * 发布类型的选择
   */
  selectType: function(event) {
    var type = parseInt(event.currentTarget.dataset.type);
    this.data.type = type;
    switch (type) {
      case 1:
        this.setData({
          isActive: true
        });
        break;
      case 2:
        this.setData({
          isActive: false
        });
        break;
    }
  },
  /**
   * 商品名称
   */
  nameInput: function(event) {
    var value = event.detail.value;
    this.data.name = value;
  },
  /**
   * 切换商品的类别
   */
  categoryChange: function(event) {
    let value = event.detail.value;
    this.setData({
      categoryIndex: value
    });
    //获取当前类别的id值
    var categoryId = this.data.categoryId[value];
    this.data.c_id = categoryId;
  },
  /**
   * textArea中字数的实时监测
   */
  checkTextArea: function(event) {
    var length = event.detail.cursor; //当前输入的长度
    var value = event.detail.value; //获取输入值
    if (length == 100) {
      this.setData({
        hintColor: true
      });
    } else {
      this.setData({
        hintColor: false
      });
    }
    this.setData({
      inputTextAreaLength: length,
      description: value
    });
  },
  /**
   * 图片上传相关
   */
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 6, //可选的图片数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
        });

      }
    });
  },
  previewImage: function(e) {
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
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
        var tempFilePaths = files.tempFilePaths;
        if (tempFilePaths.length > 0) {
          //上传成功
          resolve({
            urls: tempFilePaths
          });
        } else {
          reject('some error');
        }
    });
  },
  /**
   * 上传失败
   */
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  /**
   * 上传成功 
   */
  uploadSuccess(e) {
    this.setData({
      urls: this.data.urls.concat(e.detail.urls)
    });
  },
  /**
   * 删除图片
   */
  deleteImage: function(e) {
    let deleteIndex = e.detail.index;
    this.data.urls.splice(deleteIndex, 1);
  },
  /**
   * toast的封装
   */
  showInfo: function(msg) {
    wx.showToast({
      title: msg,
      icon: "none",
      mask: true
    });
  },
  /**
   * 发表
   */
  express: function(e) {
    var that = this;
    var type = this.data.type;
    var name = this.data.name;
    var c_id = this.data.c_id;
    var description = this.data.description;
    var urls = this.data.urls;
    var sessionId = redis.get("sessionId");
    if (name == null || name == "") {
      this.showInfo("物品名称必须填写呦！");
    } else if (description == null || description == "") {
      this.showInfo("商品描述必须填写呦！");
    } else {
      //可以上传了
      var url = app.globalData.basePath + '/goods/expressLoseGoods';
      var data = {
        type: type,
        name: name,
        description: description,
        categoryId: c_id,
        sessionId: sessionId
      };
      request.getMethod(url, data).then((res) => {
          if (res.code == 100) {
            that.setData({
              bindKey: res.info.bindKey
            });
            //开始上传图片
            that.uploadImage().then((data) => {
              var bindKey = data;
              //跳转到详情页面
              wx.navigateTo({
                url: '../goods-detail/index?bindKey=' + bindKey,
              });
            });
          }else{
            that.showError("服务器故障");
          }
        },
        (reason) => {
          this.showError(reason);
        });
    }
  },
  /**
   * 图片上传
   */
  uploadImage: function() {
    return new Promise((resolve, reject) => {
      var that = this;
      var images = this.data.urls;
      var bindKey = that.data.bindKey;
      for (var i = 0; i < images.length; i++) {
        wx.uploadFile({
          url: app.globalData.basePath + "/goods/bindImageToLoseGoods",
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
      that.setData({
        images: []
      });
      resolve(bindKey);
    });
  },
  /**
   * 授权或者登录
   */
  AuthorizeOrLogin: function() {
    var nowUrl="../express/index";
    var flag = app.globalData.userStatusFlag;
    switch (flag) {
      case 0: //未授权
        wx.navigateTo({
          url: '../authorization/index?url='+nowUrl
        });
        break;
      case 1: //授权未绑定
        wx.navigateTo({
          url: '../bind-number/index?url=' + nowUrl
        });
        break;
      case 3:
        this.showInfo("服务器故障");
        break;
    }
  }
})