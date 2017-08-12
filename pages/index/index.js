Page({
  data: {
    items: [],
    hidden: false
  },

  onLoad: function (options) {
    var that = this;
    requestData(that, mCurrentPage + 1);
  },

  onItemClick: function (event) {
    console.log(111);
  },

  onPostClick: function (event) {
    console.log('onPostClick');
  }

});

var mTitles = [];
var mSrcs = [];
var mTimes = [];
var mCurrentPage = -1;

function requestData(that, targetPage) {
  console.log(Constant);
  wx.request({
    url: Constant.GET_URL.replace('(/\(\d+))$', targetPage),
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res === null ||
        res.data === null ||
        res.data.results === null ||
        res.data.results.length <= 0) {
        console.error(Constant.ERROR_DATA_IS_NULL);
        return;
      }

      for (let i = 0; i < res.data.results.length; i++) {
        bindData(res.data.results[i]);
      }

      var itemList = [];
      for (var i = 0; i < mTitles.length; i++) {
        itemList.push({
          title: mTitles[i],
          src: mSrcs[i],
          time: mTimes[i]
        });
      }

      that.setData({
        items: itemList,
        hidden: true
      })

      mCurrentPage = targetPage;

    },
    fail: function () {},
  })
}

function bindData(itemData) {
  var re = new RegExp('[a-zA-z]+://[^\"]*');
  var title = itemData.content.split('img alt=')[1].match(re)[0];
  if (-1 != (title.search("//ww"))) {
    var src = title.replace("//ww", "//ws");
  } else {
    var src = title;
  }

  mTitles.push(itemData.title);
  mTimes.push(itemData.publishedAt.split('T')[0]);
  mSrcs.push(src);
}

var Constant = require('./constants');