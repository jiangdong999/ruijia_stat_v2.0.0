// define(['jquery', 'frontend', 'frontend/warn','layer-table','common'], function($, Frontend, Warn,LayerTable,Common) {
  var Records = {
    index: function () {
      Records.api.InitRecordList()
      Records.api.StartWebsocket()
    },
    api: {
      InitRecordList: function () {
        
        // 初始化通行记录列表
        sessionStorage.setItem('headIndex', '1');
        sessionStorage.setItem('tailIndex', '1');

        //map页人员记录首次加载五条数据
        try {
          var dataobj = {
            'default' : "1"
          }
          Frontend.api.Ajax('/Webapi/openDoorDetail', dataobj, function (ret) {
            // 初始化人员通行记录
            // console.log(ret)
            $(".person-list").html("");//初始化通行记录
            $.each(ret.data, function (index, item) {
              Records.api.generateRecord(item);
            });
          })
        }catch(err) {
          return false;
        }

        openDoorCountDetai()
        function openDoorCountDetai(){
          try {
            Frontend.api.Ajax('/Webapi/openDoorCountDetail', null, function (ret) {
              // 初始化出行次数
              var Data = ret.data;
              $(".personTotal li:nth-child(1) dl dd").html(Data.enter)
              $(".personTotal li:nth-child(2) dl dd").html(Data.out)
            })
          }catch(err) {
            return false;
          }
        }
        setInterval(function(){ openDoorCountDetai(); }, 60000);


        //map页车辆记录首次加载五条数据
        try {
          var dataobj = {
            'default' : "1"
          }
          Frontend.api.Ajax('/Webapi/openCaraDetail', dataobj, function (ret) {
            // 初始化人员通行记录
            // console.log(ret)
            $(".car-list").html("");//初始化通行记录
            $.each(ret.data, function (index, item) {
              Records.api.CarRecord(item);
            });
          })
        }catch(err) {
          return false;
        }


        openCaraDetail();
        function openCaraDetail(){
          try {
              Frontend.api.Ajax('/Webapi/openCaraCountDetail', null, function (ret) {
              // 初始化出行次数
              var Data = ret.data;
              $(".carTotal li:nth-child(1) dl dd").html(Data.enter)
              $(".carTotal li:nth-child(2) dl dd").html(Data.out)
            })
          }catch(err) {
            return false;
          }
        }
        setInterval(function(){ openCaraDetail();}, 60000);
      },
      //启动websocoket
      StartWebsocket: function(data) {
        let url = window.Config.wsUri;

        if(JSON.stringify(data) == "{}"){
          //首次切换地图页加载
          // console.log("正确")
          //正式
          url = "wss://ws.znaf2.corelines.cn/community_id//zone_code/" + window.Config.usercode + "/adminid/" + window.Config.login;
        }else{
          // console.log("正确333")
          
        //  url = "wss://ws.znaf2.corelines.cn/community_id/" + data.community_id + "/zone_code/" + data.zone_code + "/adminid/" + window.Config.login;
        }


        try {
          var socket;
          socket = new WebSocket(url); //连接服务器
          window.socket = socket;
          socket.onopen = function(event) {
            console.log("已经与服务器建立了连接\r\n当前连接状态：" +
                this.readyState);
          };
          socket.onmessage = function(event) {
            let curData = JSON.parse(event.data);
            if (curData.classid == CONST.WEBSOCKET_DATA_TYPE_RECORD) {
              //人员通行记录
              Records.api.generateRecord(curData);
            } else if(curData.classid == CONST.WEBSOCKET_DATA_TYPE_CAR) {
              //车辆通行记录
              Records.api.CarRecord(curData);
            }else{
              //告警
              Warn.api.generateWarn(curData);
            }
          };
          socket.onclose = function(event) {
          };
          socket.onerror = function(event) {
            socket.close();
          };
          
        } catch (ex) {
          console.log(ex.message);
        }
        // 关闭浏览器 关闭socket连接
        window.onbeforeunload = function () {
            if (socket.readyState == 1) {
                socket.close()
            }
        };
      },
      generateRecord: function(data) {
        let empty = null;
        var data = data;
        for (const key in data) {
          // console.log(key)
          if (data.hasOwnProperty(key)) {
            if (data[key] === null) {
                data[key] = "";
                empty = true;
            } else {
                empty = false;
            }
          }
        }
        //处理通行记录
        if (typeof data !== 'undefined') {
            var shipinHTML = '';
            if(data.video_url_name != ''){
                shipinHTML = '<span class="video" video="' + data.video_url_name + '" name="' + data.operator_name + '" time="' + data.apply_time + '" address="' + data.door_name + '" open_type="' + data.open_type + '">实时视频</span>';
            }
            var liHtml = '<li>\n' +
            '<img class="vator" householdCode="' + data.household_code + '" householdId="' + data.household_id + '"  src="' + data.images_url_name + '" alt="">\n' +
            '  <div class="detailInfo">\n' +
            '    <p><span class="name" householdCode="' + data.household_code + '" householdId="' + data.household_id + '" >' + data.operator_name + '</span>'+shipinHTML+'<span class="picImg" img="' + data.images_url_name + '" name="' + data.operator_name + '" time="' + data.apply_time + '" address="' + data.door_name + '">尾随抓拍</span><span class="role">' + data.household_type + '</span></p>\n' +
            '    <p><img src="/img/zuobiao.png"><span class="address">' + data.door_name + '</span><span class="time">' + data.apply_time + '</span></p>\n' +
            '  </div>\n' +
            '</li>';
        }
        if ($(".person-list li").length >= 7) {
          $(".person-list").prepend(liHtml);
          $(".person-list").find('li:last').slideDown()
          $(".person-list").find('li').slideDown()
          $(".person-list").find('li:first').css('margin-top','-4rem');

          $('.mapRightDIV .top .person-list').find('li').animate({
            marginTop:'0rem',
            easing: "swing",
            speed:'3000'
          })
          $(".person-list li:last").remove();

        } else {
          $(".person-list").append(liHtml);
          $(".person-list").find('li:first').slideDown()
        }
        if(data.household_type == ""){
          $(".person-list .role").css("border","0rem solid #2189ff")
        }
      },
      CarRecord:function(data){
        let empty = null;
        var data = data;
        for (const key in data) {
          // console.log(key)
          if (data.hasOwnProperty(key)) {
            if (data[key] === null) {
                data[key] = "";
                empty = true;
            } else {
                empty = false;
            }
          }
        }
        if (typeof data !== 'undefined') {
          var liHtml = '<li>\n' +
            '<img class="vator" car_no="' + data.car_no + '" src="' + data.car_no_photo + '" alt="">\n' +
            '  <div class="detailInfo">\n' +
            '    <p><span class="name" car_no="' + data.car_no + '">' + data.car_no + '</span><span class="role">' + data.cardType + '</span><span class="role">' + data.carTypeinfo + '</span></p>\n' +
            '    <p><img src="/img/zuobiao.png"><span class="address">' + data.community_name + data.portal_name + '</span><span class="time">' + data.timeinfo + '</span></p>\n' +
            '  </div>\n' +
            '</li>';
        }
        if ($(".car-list li").length >= 7) {
          $(".car-list").prepend(liHtml);
          $(".car-list").find('li:last').slideDown()
          $(".car-list").find('li').slideDown()
          $(".car-list").find('li:first').css('margin-top','-4rem');

          $('.mapRightDIV .top .car-list').find('li').animate({
            marginTop:'0rem',
            easing: "swing",
            speed:'3000'
          })
          $(".car-list li:last").remove();

        } else {
          $(".car-list").append(liHtml);
          $(".car-list").find('li:first').slideDown()
        }
      }
    }
  };
  Records.index()
  // return Records;
// });
