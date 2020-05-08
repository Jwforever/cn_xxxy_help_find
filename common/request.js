/**
 * @Author HGQIN
 *  promise进一步简化封装wx.request
 */

function getMethod(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: data,
      method: "get",
      dataType: "json",
      success: (result) => {
        resolve(result.data);
      },
      fail: () => {
        reject("服务器错误");
      }
    });
  });
}

function postMethod(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: {
        "content-type": "application/json"
      },
      data: JSON.stringify(data),
      method: "post",
      dataType: "json",
      success: (result) => {
        resolve(result.data);
      },
      fail: () => {
        reject("服务器错误");
      }
    });
  });
}

module.exports={
 getMethod:getMethod,
 postMethod:postMethod
}