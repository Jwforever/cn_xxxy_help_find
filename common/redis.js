var redis = "redis";


/**
 * @Author:HGQIN
 * k 键key
 * v 值value
 * t 秒
 */

//存入
function put(k, v, t) {
  wx.setStorageSync(k, v);
  var seconds = parseInt(t);
  if (seconds > 0) {
    var newTime = Date.parse(new Date());
    newTime = newTime / 1000 + seconds;
    wx.setStorageSync(k + redis, newTime + "");
  } else {
    wx.removeStorageSync(k + redis);
  }
}

//取出
function get(k) {
  var deadTime = Date.parse(wx.getStorageInfoSync(k + redis));
  if (deadTime < Date.parse(new Date()) / 1000) {
    //过期
    wx.removeStorageSync(k);
    wx.removeStorageSync(k + redis);
    return null;
  } else {
    return wx.getStorageSync(k);
  }
}

//删除
function remove(k) {
  wx.removeStorageSync(k);
  wx.removeStorageSync(k + redis);
}

//清空
function removeAll() {
  wx.clearStorageSync();
}

module.exports = {
  put: put,
  get: get,
  remove: remove,
  removeAll: removeAll
}