//index.js
var currentPage = 1; //当前页
var capacity = 8; //新闻容量
var totalPage; //记录总页数
var totalIndex; //总记录数
var newsUrl = "/news/getCurrentPageNews.action";

var request = require("../../common/request.js");

//获取应用实例
const app = getApp();

Page({
  data: {
    //根路径
    url: app.globalData.basePath,
    //loading相关配置
    show: false,
    animated: true,
    loadingShow: "none",
    navigation: {
      navHeight: app.globalData.navHeight,
      navTitle: "助寻",
      arrowLeft: false,
      loadingHide: true
    },
    functions: [{
        icon: "fa-paper-plane-o",
        functionName: "帮寻",
        backgroundImage: "linear-gradient(#fc6076,#ff9a44)",
        textColor: "#fff"
      },
      {
        icon: "fa-search",
        functionName: "寻找",
        backgroundImage: "linear-gradient(#9be15d,#00e3ae)",
        textColor: "#fff"
      },
      {
        icon: "fa-hourglass-o",
        functionName: "交易中",
        backgroundImage: "linear-gradient(#84fab0,#8fd3f4)",
        textColor: "#fff"
      },
      {
        icon: "fa-star-o",
        functionName: "已完成",
        backgroundImage: "linear-gradient(#a1c4fd,#c2e9fb)",
        textColor: "#fff"
      },
      {
        icon: "fa-bullhorn",
        functionName: "表扬",
        backgroundImage: "linear-gradient(#a18cd1,#fbc2eb)",
        textColor: "#fff"
      },
    ],
    scrollHeight: app.globalData.windowHeight - app.globalData.navHeight,
    //配置轮番图
    autoplay: true,
    indicatorDots: true,
    //轮番图数据
    bannerLinks: ["http://www.xxu.edu.cn/js/kjyq.jpg"],
    scrollTop: 0,
    startScroll: 0, //滚动前的位置
    contentHeight: 0, //pageContent的高度
    startTouch: 0, //开始触摸位置
    newsData: [], //新闻数据
    newsLoading: false, //动态加载更多的loading
    newsFooter: true //新闻没有更多了
  },
  onLoad: function (options) {
    //加载banner图
    this.getBanner();
    //加载新闻动态
    this.getNews();
  },
  /**
   * 获取banner图片
   */
  getBanner: function () {
    var that = this;
    var url = app.globalData.basePath + "/news/getBanner.action";
    request.getMethod(url, null).then((result) => {
      if (result.code == 100) {
        var bannerLinks = new Array();
        var bannerInfo = result.info.url;
        for (var i = 0; i < bannerInfo.length; i++) {
          bannerLinks[i] = app.globalData.basePath + bannerInfo[i].pic_path + bannerInfo[i].pic_name;
        }
        that.setData({
          bannerLinks: bannerLinks
        });
      } else {
        that.showError("服务器故障!");
      }
    }, (reason) => {
      that.showError(reason);
    });
  },
  /**
   * 获取新闻
   */
  getNews: function (type) {
    var that = this;
    var url = app.globalData.basePath + newsUrl;
    var data = {
      currentPage: currentPage,
      capacity: capacity
    };
    request.getMethod(url, data).then((result) => {
      if (result.code == 100) {
        result = result.info.PageNews;
        totalPage = result.totalPage;
        if (type == 1) {
          that.setData({
            newsData: (result.dataList).concat(this.data.newsData)
          });
        } else {
          that.setData({
            newsData: (this.data.newsData).concat(result.dataList)
          });
        }
      } else {
        that.showError("服务器故障");
      }
    }, (reason) => {
      that.showError(reason);
    });
  },
  //触摸
  touch_start: function (e) {
    var that = this;
    this.data.startTouch = e.touches[0].clientY;
    //获取content的高度
    wx.createSelectorQuery().select("#page-content").boundingClientRect(function (res) {
      that.setData({
        contentHeight: res.height
      });
    }).exec();

    //获取当前startScroll值以及scroll-view 的高度
    wx.createSelectorQuery().select("#page-body").fields({
      size: true,
      scrollOffset: true
    }, function (res) {
      that.setData({
        startScroll: res.scrollTop,
        scrollHeight: res.height
      });
    }).exec();
  },
  //触摸移动
  touch_move: function (e) {
    var currentY = e.changedTouches[0].clientY;
    var startTouch = this.data.startTouch;
    var startScroll = this.data.startScroll;

    if (startScroll == 0 && startTouch < currentY && startTouch > currentY - 20) {
      //下拉刷新
      this.setData({
        'navigation.loadingHide': false
      });
      //加载banner图和新闻
      this.getBanner();
      this.getNews(1);
    }
  },
  //触摸结束
  touch_end: function (e) {
    var currentY = e.changedTouches[0].clientY;
    var startScroll = this.data.startScroll;
    var startTouch = this.data.startTouch;
    var height = this.data.contentHeight - this.data.scrollHeight;
    if (startTouch > currentY && height > startScroll - 1 && height < startScroll + 1 && startTouch - currentY > 20) {
      //上拉加载
      currentPage++;
      if (currentPage <= totalPage) {
        //加载新闻动态
        this.getNews(2);
      } else {
        this.setData({
          newsLoading: true,
          newsFooter: false
        });
      }
    }
  },
  //进入新闻详情页
  readNewsDetail: function (e) {
    var news_id = e.currentTarget.dataset.news_id;
    wx.navigateTo({
      url: '../../indexPackage/pages/news/index?news_id=' + news_id,
    });
  },
  /*
  跳转到新页面
  1.跳转到帮寻页面
  2.跳转到寻找页面
  3.跳转到完成页面
  4.跳转到通知页面
  */
  toNewPage: function (e) {
    var flag = parseInt(e.currentTarget.dataset.flag);
    var newPage = "../../indexPackage/pages/goods-list/index?type=" + flag;
    switch (flag) {
      case 1:
      case 2:
        newPage = newPage + "&status=0";
        break;
      case 3:
        newPage = newPage + "&status=1";
        break;
      case 4:
        newPage = newPage + "&status=2";
        break;
    }
    wx.navigateTo({
      url: newPage,
    });
  },
  /**
   * 错误提示
   */
  showError: function (errorMsg) {
    wx.showToast({
      title: errorMsg,
      icon: "none",
      mask: "true"
    })
  },
  /**
   * 转发
   */
  onShareAppMessage: function (res) {
    if (res.from == 'button') {}
    return{
      title:"助寻（帮助寻找，共建美好）",
      path:"/pages/index/index",
      //ImageUrl:"",  /**图片的比例为5：4，支持:png 以及  jpg */
      success:(res)=>{
        console.log("转发成功"+res);
      }
    }
  }
})