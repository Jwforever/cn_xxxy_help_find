// pages/my-express/index.js

var app = getApp();
var pages = getCurrentPages();
var redis = require("../../../common/redis.js");
var request = require("../../../common/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: '',
      arrowLeft: true,
      loadingHide: true
    },
    allFunctions: ["全部已发布", "进行中", "已完成"],
    activeIndex: 0,
    scrollHeight: app.globalData.tabBarHeight + app.globalData.windowHeight - 40, //40是顶部功能按钮的高度
    bottomMenuHide: true,
    swiperCurrent: 0,
    pageInfo: {
      currentPage: 1,
      capacity: 20,
      totalPage: 0,
      totalIndex: 0,
      goodsList: []
    },
    basePath: app.globalData.basePath,
    endHide: true,
    goodsLoadingHide: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var type = options.type;
    this.setData({
      'navigation.navTitle': (type == 1 ? "我的助寻" : "我的寻找"),
      type: type //用来表示当前类型
    });
    this.getUserInfo();
    this.getMyRelease(type, 0);
  },
  /**
   * 获取用户的名称以及头像
   */
  getUserInfo: function() {
    var _this = this;
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo;
        _this.setData({
          'userInfo.nickName': userInfo.nickName,
          'userInfo.avatarUrl': userInfo.avatarUrl
        });
      }
    });
  },
  /**
   * 获取列表
   */
  getMyRelease: function(type, status) {
    var url = app.globalData.basePath + "/goods/getMyReleaseByTypeAndId";
    var sessionId = redis.get("sessionId");
    var data = {
      type: type,
      currentPage: this.data.pageInfo.currentPage,
      capacity: this.data.pageInfo.capacity,
      sessionId: sessionId,
      status: status
    }
    request.getMethod(url, data).then((result) => {
        if (result.code == 100) {
          //成功
          this.bindResult(result);
        } else {
          this.showError("服务器故障");
        }
      },
      (reason) => {
        this.showError(reason)
      });
  },
  /**
   * 渲染结果
   */
  bindResult: function(result) {
    var pageContainer = result.info.pageContainer;
    this.setData({
      'pageInfo.currentPage': pageContainer.currentPage,
      'pageInfo.totalIndex': pageContainer.totalIndex,
      'pageInfo.totalPage': pageContainer.totalPage,
      'pageInfo.goodsList': this.data.pageInfo.goodsList.concat(pageContainer.dataList)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 点击按钮改变swiper页面
   */
  changeSwiper: function(event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      activeIndex: index,
      swiperCurrent: index,
    });
  },
  /**
   * swiper改变的时候
   */
  swiperChange: function(event) {
    var currentPage = event.detail.current;
    this.setData({
      activeIndex: currentPage,
      'pageInfo.goodsList': [],
      'pageInfo.currentPage': 1
    });
    this.getMyRelease(this.data.type, currentPage);
  },
  /**
   * 展示底部功能
   */
  showBottomMenu: function(event) {
    wx.showActionSheet({
      itemList: ["删除"],
      success: (res) => {
        var tapIndex = res.tapIndex;
        switch (tapIndex) {
          case 0: //删除
            var goodsId = event.currentTarget.dataset.id;

            this.deleteGoods(goodsId);
            break;
        }
      }
    });
  },
  /**
   * 删除
   */
  deleteGoods: function(goodsId) {
    var url = app.globalData.basePath + "/goods/deleteGoodsByIdWhileStatusIsZero";
    var sessionId = redis.get("sessionId");
    var data = {
      goodsId: goodsId,
      sessionId: sessionId
    };
    request.getMethod(url, data).then((result) => {
        if (result.code == 100) {
          //成功
          this.showSuccess("删除成功");
          this.setData({
            'pageInfo.currentPage': 1,
            'pageInfo.goodsList': []
          });
          this.getMyRelease(this.data.type, 0);
        } else {
          this.showError("进行中或者已完成不能被删除");
        }
      },
      (reason) => {
        this.showError(reason);
      });
  },
  /**
   * 开始触摸
   */
  touch_start: function(event) {
    var _this = this;
    var startY = event.touches[0].clientY; //触摸开始位置
    wx.createSelectorQuery().select("#page").boundingClientRect((res) => {
      _this.setData({
        pageHeight: res.height //page高度
      });
    }).exec();
    wx.createSelectorQuery().select("#scrollView").fields({
      scrollOffset: true,
      size: true
    }, (res) => {
      _this.setData({
        scrollTop: res.scollTop, //scrollTop值
        scrollHeight: res.height //scrollView高度
      });
    }).exec();
  },
  /**
   * 触摸移动中
   */
  touch_move: function() {

  },
  /**
   * 触摸结束
   */
  touch_end: function(event) {
    var currentY = event.changedTouches[0].clientY;
    var startY = this.data.startY;
    var scrollTop = this.data.scrollTop;
    var height = this.data.pageHeight - this.data.scrollHeight;
    if (startY > currentY && height > scrollTop - 1 && height < scrollTop + 1 && startY - currentY > 20) {
      //上滑加载更多
      var currentPage = this.data.pageInfo.currentPage;
      var totalPage = this.data.pageInfo.totalPage;
      if (totalPage < currentPage + 1) {
        //最后一页
        this.setData({
          goodsLoadingHide: true,
          endHide: false
        });
      } else {
        this.data.pageInfo.currentPage = currentPage + 1;
        this.getMyRelease();
      }
    }
  },
  /**
   * 进入到详情页面
   */
  getGoodsDetail: function(event) {
    var goodsId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../pages/goods-detail/index?goodsId=' + goodsId
    })
  },
  /**
   * 返回上一页
   */
  back: function() {
    wx.switchTab({
      url: '../../../pages/my/index',
    });
  },
  /**
   * 显示错误
   */
  showError: function(errorMsg) {
    wx.showToast({
      title: errorMsg,
      icon: "none",
      mask: "true"
    });
  },
  /**
   * 提示成功
   */
  showSuccess: function(successMsg) {
    wx.showToast({
      title: successMsg,
      icon: "success",
      duration: 1500,
      mask: "true"
    })
  }
})