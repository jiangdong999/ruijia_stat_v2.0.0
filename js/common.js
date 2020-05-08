// define(['jquery', 'frontend', 'echarts', 'layui', 'echart-table', 'layer-table', 'region', 'frontend/records', 'frontend/warn','frontend/map'], function ($, Frontend, Echart, Layui, EchartTable, LayerTable, undefind, Records, Warn,Map) {
  var Common = {
    api: {
      ChangeRegion: function (data) {
        //改变关联区域
        sessionStorage.setItem('zone_code', data.zone_code);               //区域Code
        sessionStorage.setItem('community_id', data.community_id);         //社区ID
        sessionStorage.setItem('level', data.level);                       //区域级别 0-区 1-街道 2-居委会 3-小区
        sessionStorage.setItem('name', data.name);                         //组织机构Name
        sessionStorage.setItem('isRefreshCommunityList', data.refreshStatus);  //是否刷新社区下拉标志位  0, 刷新小区列表
        $('.region').text(data.name);

        var arr = {
          'from': 'client', //请求来源端
          'community_id':data.community_id, 
          'zone_code': data.zone_code,
          'adminid': window.Config.login
        };
        if(window.socket != null){
          window.socket.send(JSON.stringify(arr));
        }

      },
      //改变区域轮廓
      changeRelateRegion: function (data) {
        /// console.log(data) ///type:1 为小区  type：0 不是小区
        // console.log("ssss:" + sessionStorage.getItem('abc')); 
        level = window.region.level;
        if(data.type == '1'){
          // console.log("----------------request   小区----------------")
          var request = {
            zone_code: '0',
            name: data.name,
            community_id: data.community_id,
            level: level,
            zone:data.community_id,
            type:data.type
          };
        }else if(data.type == '0'){
          // console.log("----------------request   不是小区----------------")
          var request = {
            zone_code: data.zone_code,
            name: data.name,
            community_id: data.community_id,
            level: level,
            zone:data.zone,
            type:data.type
          };  
        }
        
        Common.api.ChangeRegion($.extend(request, { refreshStatus: data.hasOwnProperty('refreshStatus') ? data.refreshStatus : CONST.STATUS_COMMUNITY_LIST_REFRESH })); //0, 刷新小区列表

        // require(['frontend/index'], function (Index) {
          Index.api.loadLayer(request);
        // });
        //改变websocket地域
        Warn.api.UpdateWebsockRegion();

      },
      /** 
       * 设置头部时间
      */
      setHeaderTime: function () {
        setTime();
        setInterval(setTime, 1000);
        function setTime() {
          // 头部右侧时间显示
          var date = new Date();
          var timeDate = date.getFullYear() + "年" + twoDigits(date.getMonth() + 1) + "月" + twoDigits(date.getDate()) + "日";
          var timeNow = twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds());
          $(".timeDate").html(timeDate);
          $(".timeNow").html(timeNow);
        }

        function twoDigits(val) {
          return (val < 10) ? "0" + val : val;
        }
      },
      /**
       * 首次加载五个echart//
      */
      onloadEcharts: function (data) {
        console.log("this is onloadEcharts");
        //首次加载五个echart图标
        Frontend.api.Ajax('/Webapi/userHomeSelect', null, function (msg) {
          var setData = msg.data;
          LayerTable.api.setSubmit(setData);
        });
        //点击切换时依次切换五个图标
        var homeRefresh = -1;
        $(".header_right_qiehuan").unbind("click").on("click", function () {

          var cont_val = $(".content_div>.cont").attr("value");
          var cont_id = $(".content_div>.cont>div").attr("id");

          var cont_val2 = $(".content_div2>.cont").attr("value");
          var cont_id2 = $(".content_div2>.cont>div").attr("id");

          var cont_val3 = $(".content_div3>.cont").attr("value");
          var cont_id3 = $(".content_div3>.cont>div").attr("id");

          var cont_val4 = $(".content_div4>.cont").attr("value");
          var cont_id4 = $(".content_div4>.cont>div").attr("id");

          var cont_val5 = $(".content_div5>.cont").attr("value");
          var cont_id5 = $(".content_div5>.cont>div").attr("id");
          var obj = [{
            'id': cont_id,
            'value': cont_val
          },
          {
            'id': cont_id2,
            'value': cont_val2
          },
          {
            'id': cont_id3,
            'value': cont_val3
          },
          {
            'id': cont_id4,
            'value': cont_val4
          },
          {
            'id': cont_id5,
            'value': cont_val5
          }];
          var object = JSON.stringify(obj);
          homeRefresh++;
          var dataObj = {
            'homePage': object,
            'homeRefresh': homeRefresh
          }
          Frontend.api.Ajax('/Webapi/userHomeRandom', dataObj, function (msg) {
            var homePage = msg.data.homePage;
            LayerTable.api.setSubmit(homePage);
          })
        })

        //echarts切换中间位置
        EchartTable.api.echartsTab();
        //echarts常住/流动人口年月切换
        EchartTable.api.permanentTab();
        //echarts常住、流动人口 （...更多）弹层
        layui.use(['layer', 'table', 'laydate', 'form', 'tableFilter'], function () {
          var layer = layui.layer,//弹层
            table = layui.table, //表格
            laydate = layui.laydate,//日期
            form = layui.form;//表单
          tableFilter = layui.tableFilter;//过滤器
          var layuiModule = { layer, table, laydate, form, tableFilter };
          LayerTable.api.permanent_layer(layuiModule);//echarts常住、流动人口 （...更多）弹层
        })
        //echarts常住/流动人口 ==>月
        // EchartTable.api.permanent_month();
        //常住、流动人口 ==>年
        // EchartTable.api.permanent_year();
        //年龄统计
        // EchartTable.api.ageStatistics();
        // //民族分布
        // EchartTable.api.nationality();
        // //外来人口籍贯分布
        // EchartTable.api.externalPopulation();
        //户籍统计
        // EchartTable.api.houseStatistics();
        // //人口占比
        // EchartTable.api.peopleProporion();
        // //政治面貌
        // EchartTable.api.politicsStatus();
        // //特殊人群
        // EchartTable.api.specialCrowd();
        // //婚姻状况
        // EchartTable.api.maritalStatus();
        // //学历统计
        // EchartTable.api.degreeStatistics();
        // //从业状况
        // EchartTable.api.workConditions();
        // //个人户籍状态
        // EchartTable.api.householdStatus();
        // //房屋占比
        // EchartTable.api.housesAccounted();
        // //出租房总趋势
        // EchartTable.api.rentalHousing();
        // //房屋用途
        // EchartTable.api.houseUsage();
        // //房屋性质
        // EchartTable.api.houseNature();
      }
    },
    initmenu: function (data) {
      // console.log(data)
      if (typeof data == 'undefined') {
        return false;
      }
      let menuData = data.data;   //菜单数据
      let menuDeep = data.level;  //菜单深度 <0,1,2,3>

      window.menuDeep = menuDeep;
      firstload();

      //头部导航点击事件
      $('.nav').on('click', function () {
        $('.nav_cont').toggle();
        $(".nav .nav_cont ul:first").css({ 'display': 'block' });
        $(".nav .nav_cont>img").css({ 'display': 'block' });
        // firstload(menuData);
        
      });

      //鼠标离开目标区域隐藏
      $(".nav").hover(function () { }, function () {
        Common.closemenu();
      });

      //鼠标mouseover出下一级
      $(".nav_cont>ul").on('mouseover', 'li', function () {
        var listIndex = $(this).addClass("on").siblings().removeClass('on').attr("txt");
        if ($(this).index() == 0) {
          $(".cont_ul_" + ($(this).parent().index() + parseInt(1))).css({ 'display': 'none' });
          return false;
        }
        var data = "";
        if ($(this).parent().index() == 2) {
          var firLevelIndex = $(".cont_ul_1 li.on").attr('txt');
          var secLevelIndex = $(".cont_ul_2 li.on").attr('txt');
          data = menuData[firLevelIndex][secLevelIndex];
        } else if ($(this).parent().index() == 1) {
          var firLevelIndex = $(".cont_ul_1 li.on").attr('txt');
          data = menuData[firLevelIndex];
        } else if ($(this).parent().index() == 3) {
          var firLevelIndex = $(".cont_ul_1 li.on").attr('txt');
          var secLevelIndex = $(".cont_ul_2 li.on").attr('txt');
          var threeLevelIndex = $(".cont_ul_3 li.on").attr('txt');
          data = menuData[firLevelIndex][secLevelIndex][threeLevelIndex];

        }

        parentData = listIndex.split("-");

        if ($(this).parent().index() == 1 && menuDeep != 3) {

          //弹出第二层
          loadList({
            'data': data,
            'parentCode': parentData[1],
            'parentName': parentData[0],
            'target': 'cont_ul_2',
            'renderLevel': 2
          });
          $(".nav_cont .cont_ul_2").css({ 'display': 'block' }).next().css({ 'display': 'none' });
        } else if ($(this).parent().index() == 2 && menuDeep <= 1) {
          //弹出第三层
          loadList({
            'data': data,
            'parentCode': parentData[1],
            'parentName': parentData[0],
            'target': 'cont_ul_3',
            'renderLevel': 3
          });
          $(".nav_cont .cont_ul_3").css({ 'display': 'block' }).next().css({ 'display': 'none' });
        } else if ($(this).parent().index() == 3 && menuDeep == 0) {

          //弹出第四层
          loadList({
            'data': data,
            'parentCode': parentData[1],
            'parentName': parentData[0],
            'target': 'cont_ul_4',
            'renderLevel': 4
          });
          $(".nav_cont .cont_ul_4").css({ 'display': 'block' })
        }
      });
      //街道、社区、小区的点击事件
      $(".nav_cont ul").unbind("click").on("click", 'li', function () {

        var ulnum = $(this).parent().attr("class").replace("cont_ul_","");
        var userlevel = window.Config.userlevel;
        var postlevel = 0;
        if(userlevel == '2'){
          if(ulnum == '1'){
            postlevel = 2;
          }else{
            postlevel = 3;
          }
        }
        if(userlevel == '3'){
          if(ulnum == '1'){
            postlevel = 1;
          }else if(ulnum == '2'){
            postlevel = 2;
          }else if(ulnum == '3'){
            postlevel = 3;
          }
        }
        if(userlevel == '4'){
          if(ulnum == '1'){
            postlevel = 0;
          }else if(ulnum == '2'){
            postlevel = 1;
          }else if(ulnum == '3'){
            postlevel = 2;
          }else if(ulnum == '4'){
            postlevel = 3;
          }
        }


        
        let code = $(this).attr("txt");
        let info = code.split("-");
        let currentArea = {};

        //判断菜单事件
        if(info[0] == '全部'){
          var parentAll = $(this).parent().find("li:not(:first-child)");
          var len =parentAll.length;
          var zone = "";
          for (var i = 0;i < len;i++) {
            zone += (parentAll[i].attributes.value.value)+","
          }
          zone=zone.substring(0,zone.length-1);

          var iscommunity = $(this).attr("iscommunity");
          if(iscommunity == undefined){
            iscommunity = "0"
          }
          currentArea.zone = zone;
          currentArea.type = iscommunity;
          currentArea.zone_code = info[1];
          currentArea.community_id = '0';
          if ($(this).parent().index() == 1) {//点击全部的时候执行
            currentArea.name = $(this).attr('name');
            $(this).text("全部")
          }else {//li的父亲前一个紧邻的兄弟元素
            info = $(this).parent().prev().find('li.on').attr('txt').split("-");
            currentArea.name = info[0];
            currentArea.zone_code = info[1];
            $(this).text(currentArea.name);
          }
        } else {//点击全部下的元素执行

          var parentAll = $(this).parent().next().find("li:not(:first-child)");
          var len =parentAll.length;
          var zone = "";
          for (var i = 0;i < len;i++) {
            zone += (parentAll[i].attributes.value.value)+","
          }
          zone=zone.substring(0,zone.length-1);

          var iscommunity = $(this).attr("iscommunity");
          if(iscommunity == undefined){
            iscommunity = "0"
          }
          currentArea.zone = zone;
          currentArea.type = iscommunity;
          currentArea.zone_code = info[1];
          currentArea.community_id = '0';

          if ($(this).parent().index() == 4) {//第四模板肯定是小区的时候执行
            zone = $(this).attr("value");
            iscommunity = $(this).attr("iscommunity");
            
            currentArea.type = iscommunity;
            currentArea.zone = zone;
            currentArea.zone_code = '0';
            currentArea.community_id = info[1];
          } else {//其他模板的时候执行
            if (info[1].length == 12) {//判断其他模板不是最后小区的时候执行
              currentArea.zone_code = info[1];
              currentArea.community_id = '0';
            } else {//判断其他模板是最后小区的时候执行
              zone = $(this).attr("value");
              iscommunity = $(this).attr("iscommunity");
              
              currentArea.type = iscommunity;
              currentArea.zone = zone;
              currentArea.zone_code = '0';
              currentArea.community_id = info[1];
              
            }
          }
          currentArea.name = $(this).text();
          $(this).text(currentArea.name);
        }

        currentArea.iscommunity = $(this).attr("iscommunity");
        // console.log(currentArea)
        //点击时赋值给头
        $(".region").attr("zone_code",currentArea.zone_code)
        $(".region").attr("community_id",currentArea.community_id)
        $(".region").attr("level",currentArea.level)
        $(".region").attr("userlevel",currentArea.userlevel)
        $(".region").attr("adminid",currentArea.adminid)
        $(".region").attr("iscommunity",currentArea.iscommunity)

        currentArea.level = postlevel;
        currentArea.userlevel = $(this).attr("userlevel");
        Common.api.changeRelateRegion(currentArea);
        Common.closemenu();
      });

      //初次加载
      function firstload() {
        let code = window.Config.usercode; //组织结构区域code
        let name = window.Config.username; //组织结构区域code
        // console.log(window.Config)
        loadList({
          'data': menuData,
          'parentCode': code,
          'parentName': name,
          'target': 'cont_ul_1',
          'renderLevel': 1
        });

        $(".region").attr("zone_code",window.Config.usercode)
        $(".region").attr("community_id","")
        $(".region").attr("level","")
        $(".region").attr("userlevel",window.Config.userlevel)
        $(".region").attr("adminid",window.Config.login)
      }

      /**
       * 加载list
       * @param array   data        列表数据 数据格式 AAAA-12341234
       * @param integer parentCode  父级别code
       * @param string  parentName  父级别名称
       * @param string  target      目标填充地class
       * @param integer renderLevel 当前列表index 0-海淀区 1-街道 2-居委会 3-小区
       */
      function loadList() {
        params = arguments[0]; //加载参数
        var content = '';
        let userlevel = window.Config.userlevel;
        // let userlevel =3;
        var curData;
        // console.log(window.Config)
        // console.log(window.Config)
        // console.log(params)
        // console.log(userlevel)//4
        // console.log(params.renderLevel)//2,3
        $.each(params.data, function (index, item) {
          // console.log(index)//0
          // console.log(item)//华龙美树-10392
          if ( (userlevel == '4' && params.renderLevel == '4') || (userlevel == '3' && params.renderLevel == '3') || (userlevel == '2' && params.renderLevel == '2') || (userlevel == '1' && params.renderLevel == '1')) {
            curData = item;
            if(curData.constructor === Array){
              $.each(curData, function (index2, item2) {
                var item2sp = item2.split("-");
                content = '<li value="' + item2sp[1] + '" txt="' + curData + '" iscommunity="' + 1 + '" level="' + (params.renderLevel-1) + '" userlevel="'+userlevel+'">' + item2sp[0] + '</li>' + content;
              });
            }else{
              var item2sp = curData.split("-");
              content = '<li value="' + item2sp[1] + '" txt="' + curData + '" iscommunity="' + 1 + '" level="' + (params.renderLevel-1) + '" userlevel="'+userlevel+'">' + item2sp[0] + '</li>' + content;
            }
          } else {
            curData = index.split("-");
            if (curData[1].length == 12) {
              content = '<li value="' + curData[1] + '" txt="' + index + '" iscommunity="' + 0 + '" level="' + (params.renderLevel-1) + '" userlevel="'+userlevel+'">' + curData[0] + '</li>' + content;
            } else {
              content = '<li value="' + curData[1] + '" txt="' + item + '" iscommunity="' + 1 + '" level="' + (params.renderLevel-1) + '" userlevel="'+userlevel+'">' + curData[0] + '</li>' + content;
            }
          }
        });
        content = '<li value="' + params.parentCode + '" txt="全部-' + params.parentCode + '" iscommunity="' + 0 + '" name="' + params.parentName + '"  level="' + (parseInt(params.renderLevel-1)) + '" userlevel="'+userlevel+'">全部</li>' + content;
        $("." + params.target).html(content);
      }
    },
    closemenu: function () {
      $(".nav .nav_cont").css({ 'display': 'none' }).children("ul").css({ 'display': 'none' });
      $(".nav .nav_cont>img").css({ 'display': 'none' });
    },
    init: function () {
      //需要登陆
      if (window.Config.login != null && window.Config.login > 0) {
        // console.log(window.Config);
        let curRegionName = window.Config.username;
        let zone_code = window.Config.usercode;

        Frontend.api.Ajax('/Webapi/getHeaderInfo', null, function (msg) {
          let data = msg.data.seljson;
          if (typeof data == 'undefined') {
            return false;
          }
          Common.initmenu(data);  //初始化menu
          window.region = data;
          Common.api.setHeaderTime();    //初始化时间

          sessionStorage.setItem('level', window.menuDeep);
          sessionStorage.setItem('community_id', '0');
          // sessionStorage.setItem('zone_code', $(".nav .nav_cont .cont_ul_1>li:first").attr("value"));
          sessionStorage.setItem('zone_code', zone_code);
          sessionStorage.setItem('name', curRegionName);
          $('.region').text(curRegionName);

        });


        $(window).on('beforeunload', function () {
          sessionStorage.setItem('isRefreshCommunityList', CONST.STATUS_COMMUNITY_LIST_REFRESH); // 0,刷新小区列表
        });
        // $('#community_name').on('click', function () {
        //   var data = `{"id":"44","user_id":"389","community_id":"11018","type":"3","reason":"\u91cd\u70b9\u4eba\u5458\u51fa\u5165\u544a\u8b66","open_username":"\u674e\u4e3d","addtime":"2019-04-17 14:23:55","open_useraddress":"","label":null,"device_type":null,"device_no":null,"groupPicUrl":"0","level":"0","image_url":null,"likedegree":"","household_type":"","latitude":null,"longitude":null,"classid":2}`;
        //
        //   var test = JSON.parse(data);
        //
        //   Warn.api.doDeviceWarn(test);
        // });
      }
    }
  };
  Common.init();
  // return Common;
// });