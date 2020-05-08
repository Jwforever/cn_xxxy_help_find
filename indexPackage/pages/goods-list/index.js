// pages/goods-list/index.js

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
      navTitle: "寻找列表",
      arrowLeft: true,
      loadingHide: true
    },
    scrollHeight: app.globalData.tabBarHeight + app.globalData.windowHeight,
    goodsLoading: false,
    goodsFooter: true,
    pageHeight: null, //记录滚动页面的高度
    startY: null, //开始触摸位置
    pageInfo: {
      type: null, //类型
      currentPage: 1, //当前页
      capacity: 10, //容量  
      totalPage: null, //总页数
      totalIndex: null, //总记录数
      goodsList: []
    },
    basePath: app.globalData.basePath,
    isLoadingHide: true, //是否显示正在加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      search: this.search.bind(this)
    })
    this.init(parseInt(options.type), parseInt(options.status)).then((data) => {
      this.getPageInfo();
    });
  },
  /**
   * 初始化
   */
  init: function(type, status) {
    var that = this;
    return new Promise((resolve, reject) => {
      var navTitle = null;
      switch (type) {
        case 1:
          navTitle = "帮寻";
          break;
        case 2:
          navTitle = "寻找";
          break;
        case 3:
          navTitle = "交易中";
          break;
        case 4:
          navTitle = "已完成";
          break;
      }
      that.setData({
        'navigation.navTitle': navTitle,
        'pageInfo.type': type,
        'pageInfo.status': status
      });
      resolve();
    });
  },
  /**
   * 获取本页内容
   */
  getPageInfo: function() {
    var that = this;
    var url = app.globalData.basePath + '/goods/getCurrentPageGoodsInfo';
    var type=that.data.pageInfo.type;
    if (type != 1 && type != 2) {
      var data = {
        currentPage: this.data.pageInfo.currentPage,
        capacity: this.data.pageInfo.capacity,
        status: this.data.pageInfo.status
      };
    } else {
      var data = {
        currentPage: this.data.pageInfo.currentPage,
        capacity: this.data.pageInfo.capacity,
        type: type,
        status: this.data.pageInfo.status
      };
    }
    request.getMethod(url, data).then((result) => {
        if (result.code == 100) {
          that.bindData(result);
        } else {
          that.showError("服务器故障");
        }
      },
      (reason) => {
        this.showError(reason);
      });
  },
  /**
   * 赋值数据
   */
  bindData: function(res) {
    let currentPageData = res.info.CurrentPageData;
    this.setData({
      'pageInfo.totalIndex': currentPageData.totalIndex,
      'pageInfo.totalPage': currentPageData.totalPage,
      'pageInfo.goodsList': this.data.pageInfo.goodsList.concat(currentPageData.dataList),
      'pageInfo.currentPage': currentPageData.currentPage,
      isLoadingHide: true
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
   * 点击返回
   */
  back: function() {
    wx.navigateBack({
      delta: pages[pages.length - 1],
    });
  },
  /**
   * 用户开始触摸
   */
  touch_start: function(e) {
    var that = this;
    that.data.startY = e.touches[0].clientY;
    //获取滚动内容的高度
    wx.createSelectorQuery().select("#page").boundingClientRect((res) => {
      that.setData({
        pageHeight: res.height
      });
    }).exec();
    //获取scroll-view相关
    wx.createSelectorQuery().select("#scrollView").fields({
      scrollOffset: true,
      size: true,
    }, (res) => {
      that.setData({
        scrollHeight: res.height,
        scrollTop: res.scrollTop
      });
    }).exec();
  },
  /**
   * 用户触摸中
   */
  touch_move: function(e) {

  },
  /**
   * 用户触摸结束
   */
  touch_end: function(e) {
    var currentY = e.changedTouches[0].clientY;
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
          goodsLoading: true,
          goodsFooter: false
        });
      } else {
        this.data.pageInfo.currentPage = currentPage + 1;
        this.getPageInfo();
      }
    }
  },
  /**
   * 跳转到物品详情页
   */
  getGoodsDetail: function(event) {
    var goodsId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../pages/goods-detail/index?goodsId=' + goodsId
    });
  },
  /**
   * 输入过程中获取新的结果
   */
  search: function(value) {
    var url = app.globalData.basePath + "/goods/getNameListByNameFuzzyQuery";
    var data = {
      capacity: 10,
      type: this.data.pageInfo.type,
      name: value
    };
    return new Promise((resolve, reject) => {
      request.getMethod(url, data).then((result) => {
          if (result.code == 100) {
            var nameList = result.info.nameList;
            var res = new Array();
            for (var i = 0; i < nameList.length; i++) {
              res[i] = {
                "text": nameList[i],
                "value": i
              };
            }
            resolve(res);
          } else {
            this.showError("服务器故障");
          }
        },
        (reason) => {
          this.showError(reason);
        });
    });
  },
  /**
   * 在选择搜索结果的时候触发事件
   */
  selectResult: function(event) {
    var name = event.detail.item.text;
    this.getSearchContent(name);
  },
  /**
   * 点击确定
   */
  inputConfirm: function(event) {
    this.getSearchContent(event.detail.value);
  },
  /**
   * 获取搜索内容
   */
  getSearchContent: function(name) {
    this.setData({ //初始化
      isLoadingHide: false,
      'pageInfo.goodsList': []
    });
    var url = app.globalData.basePath + "/goods/getCurrentPageGoodsInfoByNameFuzzyQuery";
    var data = {
      currentPage: 1,
      capacity: this.data.pageInfo.capacity,
      type: this.data.pageInfo.type,
      name: name
    };
    request.getMethod(url, data).then((result) => {
        if (result.code == 100) {
          this.bindData(result);
        }
      },
      (reason) => {
        this.showError(reason);
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
  }
})