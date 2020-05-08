// define(['jquery', 'frontend', 'frontend/map'], function($, Frontend, Map) {
  var Warn = {
    api: {
      generateWarn: function(data) {
        //处理告警
        if (socket.readyState == 1) {
          //如果已经连接上了
          if (typeof timer == 'undefined') {
            timer = setInterval(function() {
              // console.log("0")
              //去sessionStorage 取数据  tailIndex每次推过来的数据递增  headIndex每次执行的告警弹层递增
              var tailIndex = parseInt(sessionStorage.getItem('tailIndex'));
              var headIndex = parseInt(sessionStorage.getItem('headIndex'));

              //取得的数据是 currentIndex 到 index 之间的数据
              //index in headIndex , tailIndex
              for (var index = headIndex; index <= tailIndex; index++) {

                var curData = sessionStorage.getItem(index);
                if (curData == null) {
                  break;
                }
                curData = JSON.parse(curData);

                var nowTime = new Date();
                // console.log(nowTime)
                // console.log(curData['cTime'])
                if (curData['cTime'] > (nowTime.getTime() - 500)) {
                  // console.log("break , index is "+ index);
                  break;
                }

                // 如果不存在弹层STATUS_LAYER_NOT_EXIST   map页SWIPER_PAGE_INDEX_MAP
                if( $('.layui-layer-shade').length === CONST.STATUS_LAYER_NOT_EXIST &&
                  swiper.activeIndex == CONST.SWIPER_PAGE_INDEX_MAP ) {
                  Warn.api.ShowWarnDetail(curData);
                }else{
                  return false;
                }

                sessionStorage.removeItem(index);
                sessionStorage.setItem('headIndex', parseInt(index) + 1);
              }

            }, 2000);
          } else {
            //关闭连接
            if (socket.readyState != 0 && socket.readyState != 1) {
              clearInterval(timer);
            }
          }
          var headIndex = sessionStorage.getItem('headIndex');
          var tailIndex = sessionStorage.getItem('tailIndex');

          if (tailIndex - headIndex == CONST.WARNINGS_QUEUE_MAX_LENGTH) {
            //重置head point
            var oldHead = parseInt(headIndex);
            var curHead = parseInt(tailIndex) - CONST.WARNINGS_QUEUE_REMOVE_LENGTH;
            //删除oldHead 与curHead之间40条老数据
            while (curHead !== oldHead) {
              sessionStorage.removeItem(oldHead);
              oldHead ++;
            }
          }
          //追加插入数据时间戳
          var curTime = new Date();
          var curData = JSON.parse(event.data);
          curData['cTime'] = curTime.getTime();
          sessionStorage.setItem(tailIndex, JSON.stringify(curData));
          sessionStorage.setItem('tailIndex', parseInt(tailIndex) + 1);
        }
      },
      ShowWarnDetail: function (data) {
        // console.log(data)
        //显示告警层
        switch (parseInt(data.type)) {
          case CONST.WARNING_TYPE_POINT:// 重点人员告警：出入即时报警
            Warn.api.doPointWarn(data);
            break;
          case CONST.WARNING_TYPE_DEVICE://设备告警：门禁常开告警
            Warn.api.doDeviceWarn(data);
            break;
          case CONST.WARNING_TYPE_SMOKE://烟感告警
          Warn.api.doSmokeWarn(data);
          break;
          case CONST.WARNING_TYPE_SOSWARN://sos
            Warn.api.doSosWarn(data);
            break;
          case CONST.WARNING_TYPE_BLACKLIST:// 黑名单告警
            Warn.api.doBlacklistWarn(data);
            break;
          case CONST.WARNING_TYPE_POINT_VIDEO:// 视频重点人员告警
            Warn.api.doPointWarn_video(data);
            break;
          case CONST.WARNING_TYPE_BLACKLIST_VIDEO:// 监控黑名单
            Warn.api.doBlacklistWarn_video(data);
            break;
          default: break;
        }
        //没有什么卵用（先留着吧）
        //坐标问题
        // if (typeof (data.longitude) !== 'undefined') {
        //   var position = {longitude: data.longitude, latitude: data.latitude, type: data.type};
        //   //display lantitude lontitude
        //   Map.api.AddFlashMarker(position);
        //   setTimeout(function () {
        //     // 自动关闭告警层
        //     Map.api.ClearFlashMarker(position);
        //     layer.closeAll();
        //   }, CONST.TIME_TEN_SECONDS * 1000);
        // }
      },
      UpdateWebsockRegion: function() {
        // 更新区域
        if (typeof socket != "undefined") {
          console.log('close websocket');
          socket.close();
          Warn.api.ClearData();
        }
      },
      ClearData: function () {
        //清除告警数据
      },
      doPointWarn: function (data) {
        var userDetail = (typeof(data.open_username) != 'undefined' && data.open_username !== null ? data.open_username: "") + `&nbsp;&nbsp;`  +
            (typeof(data.label) != 'undefined' && data.label !== null ? data.label: "");
        layer.open({
          type: 1,
          title: false,
          closeBtn: 1,
          shadeClose: true,
          shade: 0.5,
          time: 10000,//自动关闭
          zIndex:2000000,
          skin: 'personnelclass', //皮肤
          area: ['15rem', '7rem'],
          content: $('#houseVacancy'),
          success: function() {
              var str = `<ul warnId="${data.id}">
              <li><img src="/img/wenhao.png" alt=""><span>重点人员告警</span></li>
              <li><img src="/img/xingming.png" alt=""><span>` + userDetail + `</span></li>
              <li><img src="/img/shijian.png" alt=""><span>` + data.addtime + `</span></li>
              <li><img src="/img/weizhi.png" alt="" class="weizhi"><span>` + (typeof data.open_useraddress != "undefined" && data.open_useraddress !== null ?
                data.open_useraddress: "") + `</span></li>
            </ul>`;
            $('#houseVacancy').find('.houseVacancyDiv').html(str);
            if (typeof data.image_url != "undefined") {
              $('#houseVacancy').find('.houseVacancyImg').html(`<img src="`+ data.image_url +`" alt="">`);
            }
          }
        });
      },
      doPointWarn_video: function (data) {
        var userDetail = (typeof(data.open_username) != 'undefined' && data.open_username !== null ? data.open_username: "");
        layer.open({
          type: 1,
          title: false,
          closeBtn: 1,
          shadeClose: true,
          shade: 0.5,
          time: 10000,//自动关闭
          zIndex:2000000,
          skin: 'personnelclass', //皮肤
          area: ['15rem', '7rem'],
          content: $('#houseVacancy'),
          success: function() {
              var str = `<ul warnId="${data.id}">
              <li><img src="/img/wenhao.png" alt=""><span>视频重点人员告警</span></li>
              <li><img src="/img/xingming.png" alt=""><span>` + userDetail + `</span></li>
              <li><img src="/img/shijian.png" alt=""><span>` + data.addtime + `</span></li>
              <li><img src="/img/weizhi.png" alt="" class="weizhi"><span>` + (typeof data.open_useraddress != "undefined" && data.open_useraddress !== null ?
                data.open_useraddress: "") + `</span></li>
            </ul>`;
            $('#houseVacancy').find('.houseVacancyDiv').html(str);
            if (typeof data.image_url != "undefined") {
              $('#houseVacancy').find('.houseVacancyImg').html(`<img src="`+ data.image_url +`" alt="">`);
            }
          }
        });
      },
      doSmokeWarn: function (data) {
        layer.open({
          type: 1,
          title: false,
          closeBtn: 1,
          shadeClose: true,
          shade: 0.5,
          time: 10000,//自动关闭
          zIndex:2000000,
          skin: 'equipmentclass', //皮肤
          area: ['15rem', '7rem'],
          content: $('#houseVacancy'),
          success: function() {
            var str =
              `<ul warnId="${data.id}">
              <li><img src="/img/meihongwenhao.png" alt=""><span>烟感告警</span></li>
              <li><img src="/img/xingming.png" alt=""><span>烟感</span></li>
              <li><img src="/img/shijian.png" alt=""><span>` + data.addtime + `</span></li>
              <li><img src="/img/weizhi.png" alt="" class="weizhi"><span>` + (typeof data.open_useraddress != "undefined" && data.open_useraddress !== null ?
                data.open_useraddress: "") + `</span></li>
            </ul>`;
            $('#houseVacancy').find('.houseVacancyDiv').html(str);
            $('#houseVacancy').find('.houseVacancyImg').html(`<img src="/img/yangan.png" alt="" style="margin: 0.5rem auto 0;float: none;">`);
          }
        });
      },
      doDeviceWarn:function(data){
        layer.open({
          type: 1,
          title: false,
          closeBtn: 1,
          shadeClose: true,
          time: 10000,//自动关闭
          zIndex:2000000,
          shade: 0.5,
          skin: 'equipmentclass', //皮肤
          area: ['15rem', '7rem'],
          content: $('#houseVacancy'),
          success: function() {
            var str =
              `<ul warnId="${data.id}">
              <li><img src="/img/meihongwenhao.png" alt=""><span>门常开告警</span></li>
              <li><img src="/img/xingming.png" alt=""><span>门常开</span></li>
              <li><img src="/img/shijian.png" alt=""><span>` + data.addtime + `</span></li>
              <li><img src="/img/weizhi.png" alt="" class="weizhi"><span>` + (typeof data.open_useraddress != "undefined" && data.open_useraddress !== null ?
                data.open_useraddress: "") + `</span></li>
            </ul>`;
            $('#houseVacancy').find('.houseVacancyDiv').html(str);
            $('#houseVacancy').find('.houseVacancyImg').html(`<img src="/img/menjinicon.png" alt="">`);
          }
        });
      },
      doSosWarn: function (data) {
        var userDetail = (typeof(data.open_username) != 'undefined' && data.open_username !== null ? data.open_username: "") + `&nbsp;&nbsp;`  +
            (typeof(data.phone) != 'undefined' && data.phone !== null ? data.phone: "");
        layer.open({
          type: 1,
          title: false,
          closeBtn: 1,
          shadeClose: true,
          shade: 0.5,
          time: 10000,//自动关闭
          zIndex:2000000,
          skin: 'soswarnclass', //皮肤
          area: ['15rem', '7rem'],
          content: $('#houseVacancy'),
          success: function() {
            //外边框
            $(".layui-layer-shade").css("box-shadow"," 0px 0px 5rem red inset");
          
            var str =
              `<ul warnId="${data.id}">
              <li><img src="/img/tanhao.png" alt=""><span>SOS告警</span></li>
              <li><img src="/img/xingming.png" alt=""><span>` + userDetail + `</span></li>
              <li><img src="/img/shijian.png" alt=""><span>` + data.addtime + `</span></li>
              <li><img src="/img/weizhi.png" alt="" class="weizhi"><span>` + (typeof data.open_useraddress != "undefined" && data.open_useraddress !== null ?
                data.open_useraddress: "") + `</span></li>
            </ul>`;
            $('#houseVacancy').find('.houseVacancyDiv').html(str);
            if (typeof data.image_url != "undefined") {
              $('#houseVacancy').find('.houseVacancyImg').html(`<img src="`+ data.image_url +`" alt="">`);
            }
          }
        });
      },
      doBlacklistWarn: function (data) {
        var userDetail = (typeof(data.open_username) != 'undefined' && data.open_username !== null ? data.open_username: "") + `&nbsp;&nbsp;`  +
            (typeof(data.household_type) != 'undefined' && data.household_type !== null ? data.household_type: "") + `&nbsp;&nbsp;`  +
            (typeof(data.likedegree) != 'undefined' && data.likedegree !== null ? parseInt(data.likedegree)+'%': "");

        layer.open({
          type: 1,
          title: false,
          closeBtn: 1,
          shadeClose: true,
          shade: 0.5,
          time: 10000,//自动关闭
          zIndex:2000000,
          skin: 'soswarnclass', //皮肤
          area: ['15rem', '7rem'],
          content: $('#houseVacancy'),
          success: function() {
            //外边框
            $(".layui-layer-shade").css("box-shadow"," 0px 0px 5rem red inset");
            var str =
                `<ul warnId="${data.id}">
              <li><img src="/img/heimingdan.png" alt=""><span>黑名单告警</span></li>
              <li><img src="/img/xingming.png" alt=""><span>` + userDetail + `</span></li>
              <li><img src="/img/shijian.png" alt=""><span>` + data.addtime + `</span></li>
              <li><img src="/img/weizhi.png" alt="" class="weizhi"><span>` + (typeof data.open_useraddress != "undefined" && data.open_useraddress !== null ?
                data.open_useraddress: "") + `</span></li>
            </ul>`;
            $('#houseVacancy').find('.houseVacancyDiv').html(str);
            if (typeof data.groupPicUrl != "undefined") {
              var photo = `<img src="`+ data.groupPicUrl +`" alt=""><img src="`+ data.image_url +`" alt=""><b>相似度` + parseInt(data.likedegree) + `%</b>`;
              $('#houseVacancy').find('.houseVacancyImg').html(photo);
            }
          }
        });
      },
      doBlacklistWarn_video: function (data) {
        var userDetail = (typeof(data.open_username) != 'undefined' && data.open_username !== null ? data.open_username: "") + `&nbsp;&nbsp;`  +
            (typeof(data.household_type) != 'undefined' && data.household_type !== null ? data.household_type: "") + `&nbsp;&nbsp;`  +
            (typeof(data.likedegree) != 'undefined' && data.likedegree !== null ? parseInt(data.likedegree)+'%': "");

        layer.open({
          type: 1,
          title: false,
          closeBtn: 1,
          shadeClose: true,
          shade: 0.5,
          time: 10000,//自动关闭
          zIndex:2000000,
          skin: 'soswarnclass', //皮肤
          area: ['15rem', '7rem'],
          content: $('#houseVacancy'),
          success: function() {
            //外边框
            $(".layui-layer-shade").css("box-shadow"," 0px 0px 5rem red inset");
            var str =
                `<ul warnId="${data.id}">
              <li><img src="/img/heimingdan.png" alt=""><span>监控黑名单</span></li>
              <li><img src="/img/xingming.png" alt=""><span>` + userDetail + `</span></li>
              <li><img src="/img/shijian.png" alt=""><span>` + data.addtime + `</span></li>
              <li><img src="/img/weizhi.png" alt="" class="weizhi"><span>` + (typeof data.open_useraddress != "undefined" && data.open_useraddress !== null ?
                data.open_useraddress: "") + `</span></li>
            </ul>`;
            $('#houseVacancy').find('.houseVacancyDiv').html(str);
            if (typeof data.groupPicUrl != "undefined") {
              var photo = `<img src="`+ data.groupPicUrl +`" alt=""><img src="`+ data.image_url +`" alt=""><b>相似度` + parseInt(data.likedegree) + `%</b>`;
              $('#houseVacancy').find('.houseVacancyImg').html(photo);
            }
          }
        });
      }
    }
  };
  // return Warn;
// });
