// define(['jquery', 'frontend', 'swiper', 'layui', 'common', 'frontend/map', 'frontend/records', 'exports'], function ($, Frontend, Swiper, Layui, Common, Map, Record, exports) {
  var Index = {
    index: function () {
      window.wsact = 0;
      Index.api.swiper();
      Index.api.loadLayer();
    },
    
    api: {
      loadLayer: function (data) {
        if (typeof data == "undefined") {
          var zone_code = $(".region").attr("zone_code");
          var community_id = $(".region").attr("community_id");
          var level = $(".region").attr("level");
          var userlevel = $(".region").attr("userlevel");
          var adminid = $(".region").attr("adminid");
          var iscommunity = $(".region").attr("iscommunity");
          data = {
            'from': 'client', //请求来源端
            "zone_code": zone_code,
            "community_id": community_id,
            "level": level,
            "userlevel": userlevel,
            "adminid": adminid,
            "iscommunity": iscommunity
          }
        }
        if (window.swiper.activeIndex == CONST.SWIPER_PAGE_INDEX_ECHARTS) {// Echarts页
          Index.api.loadEchartsLayer();
          if (window.socket != null) {
            window.socket.send(JSON.stringify(data));
            window.socket.close();
          }
        } else {// map页
          
          if(typeof AMap != "undefined"){
            Index.api.loadMapLayer(data);//地图
            Index.api.mapIndex();//告警数量
            Index.api.onloadCarperson();//地图页人员车辆切换
            Index.api.echartIdSave();//保存首页echart的顺序 和 选项

          }else{
            layer.msg('网络不佳,请您重新加载页面...');
          }

        }
      },
      loadEchartsLayer: function () {
        //图标页面
        Index.api.onloadIndex();//首页=>今日新增、重点人口、街道（数量）
        Common.api.onloadEcharts();//首页=>echarts
      },
      loadMapLayer: function (data) {

        var zone_code = sessionStorage.getItem("zone_code");
        var type = $(".region").attr("iscommunity");
        var name = sessionStorage.getItem("name");
        var community_id = sessionStorage.getItem("community_id");
        if (typeof type == "undefined") {
          type = "0"
        }
        // console.log(window.region)
        // console.log(data)
        if (window.region.level == 0) {//区、街道、居委会、小区
          Levels0()
        } else if (window.region.level == 1) {//街道、居委会、小区
          Levels1()
        } else if (window.region.level == 2) {//居委会、小区
          Levels2()
        } else if (window.region.level == 3) {//小区
          Levels3()
        }
        function Levels0() {
          //地图页面
          if (data.zone_code.length >= 12 && data.zone_code != "000000000000") {

            var Region = window.region.data;
            // console.log(Region) 

            if (typeof Region == 'undefined') {
              return false;
            }
            $.each(Region, function (index, item) {

              if (index.indexOf(zone_code) != -1 && zone_code != '0') {//查找字符串中是否存在这个字符   存在时执行
                // console.log("成功")
                // item = {
                //   "康营家园二社区居委会-110105037002":["康营家园-10471"],
                //   "康营家园二社区居委会1111-110105037002":["康营家园-10471"]
                // }
                var str = "";
                $.each(item, function (idx, itm) {
                  // console.log(idx)

                  str += idx.split("-")[1] + ",";
                })
                zoneAll = str.substring(0, str.length - 1);
                // console.log(zoneAll)

                data = {
                  "zone": zoneAll,
                  "type": type,
                  "zone_code": zone_code,
                  "name": name,
                  "community_id": community_id
                }

              } else {
                // console.log("失败")
                $.each(item, function (index2, item2) {

                  if (index2.indexOf(zone_code) != -1) {//是区域时执行
                    // console.log("成功22")
                    var str = "";
                    $.each(item2, function (idx, itm) {
                      // console.log(idx.split("-"))
                      str += idx.split("-")[1] + ",";
                    })
                    zoneAll = str.substring(0, str.length - 1);
                    data = {
                      "zone": zoneAll,
                      "type": type,
                      "zone_code": zone_code,
                      "name": name,
                      "community_id": community_id
                    }
                    if (zoneAll.length < 12) {//是居委会小区时执行
                      data = {
                        "zone": zoneAll,
                        "type": 1,
                        "zone_code": zone_code,
                        "name": name,
                        "community_id": community_id
                      }
                    }
                  } else {
                    $.each(item2, function (index3, item3) {
                      if (index3.indexOf(zone_code) != -1) {
                        var str = "";
                        $.each(item3, function (idx, itm) {
                          // console.log(itm.split("-"))
                          str += itm.split("-")[1] + ",";
                        })
                        zoneAll = str.substring(0, str.length - 1);
                        data = {
                          "zone": zoneAll,
                          "type": type,
                          "zone_code": zone_code,
                          "name": name,
                          "community_id": community_id
                        }
                        if (zoneAll.length < 12) {//是居委会小区时执行
                          data = {
                            "zone": zoneAll,
                            "type": 1,
                            "zone_code": zone_code,
                            "name": name,
                            "community_id": community_id
                          }
                        }
                      }

                    })
                  }
                })
              }
            })
          } else if (data.zone_code == "0") {//是小区时执行
            data = {
              "zone": community_id,
              "type": 1,
              "zone_code": "0",
              "name": name,
              "community_id": community_id
            }
          } else {
            // console.log("首次加载")

            //首次拿取zone type
            var lis = $(".cont_ul_1 li:not(:first-child)");
            var len = $(".cont_ul_1 li:not(:first-child)").length;
            var zone = "";
            for (var i = 0; i < len; i++) {
              zone += (lis[i].attributes.value.value) + ","
            }
            zone = zone.substring(0, zone.length - 1);
            data = {
              "zone_code": zone_code,
              "community_id": community_id,
              "name": name,
              "type": type,
              "zone": zone
            }
          }
        }
        function Levels1() {
          //地图页面
          if (data.zone_code.length >= 12 && data.zone_code != "000000000000") {
            var Region = window.region.data;
            if (typeof Region == 'undefined') {
              return false;
            }
            $.each(Region, function (index, item) {

              if (index.indexOf(zone_code) != -1 && zone_code != '0') {//查找字符串中是否存在这个字符   存在时执行
                // console.log("成功")
                // item = {
                //   "康营家园二社区居委会-110105037002":["康营家园-10471"],
                //   "康营家园二社区居委会1111-110105037002":["康营家园-10471"]
                // }
                var str = "";
                $.each(item, function (idx, itm) {
                  // console.log(idx)

                  str += idx.split("-")[1] + ",";
                })
                zoneAll = str.substring(0, str.length - 1);
                // console.log(zoneAll)

                data = {
                  "zone": zoneAll,
                  "type": type,
                  "zone_code": zone_code,
                  "name": name,
                  "community_id": community_id
                }

              } else {
                // console.log("失败")
                $.each(item, function (index2, item2) {
                  if (index2.indexOf(zone_code) != -1) {//是区域时执行
                    // console.log("成功22")
                    var str = "";
                    $.each(item2, function (idx, itm) {
                      str += itm.split("-")[1] + ",";
                    })
                    zoneAll = str.substring(0, str.length - 1);
                    data = {
                      "zone": zoneAll,
                      "type": type,
                      "zone_code": zone_code,
                      "name": name,
                      "community_id": community_id
                    }
                    if (zoneAll.length < 12) {//是居委会小区时执行
                      data = {
                        "zone": zoneAll,
                        "type": 1,
                        "zone_code": zone_code,
                        "name": name,
                        "community_id": community_id
                      }
                    }
                  }
                })
              }
            })
          } else if (data.zone_code == "0") {//是小区时执行
            data = {
              "zone": community_id,
              "type": 1,
              "zone_code": "0",
              "name": name,
              "community_id": community_id
            }
          } else {
            // console.log("首次加载")

            //首次拿取zone type
            var lis = $(".cont_ul_1 li:not(:first-child)");
            var len = $(".cont_ul_1 li:not(:first-child)").length;
            var zone = "";
            for (var i = 0; i < len; i++) {
              zone += (lis[i].attributes.value.value) + ","
            }
            zone = zone.substring(0, zone.length - 1);
            data = {
              "zone_code": zone_code,
              "community_id": community_id,
              "name": name,
              "type": type,
              "zone": zone
            }
          }
        }
        function Levels2() {
          //地图页面
          if (data.zone_code.length >= 12 && data.zone_code != "000000000000") {

            var Region = window.region.data;
            if (typeof Region == 'undefined') {
              return false;
            }
            $.each(Region, function (index, item) {
              if (index.indexOf(zone_code) != -1 && zone_code != '0') {//查找字符串中是否存在这个字符   存在时执行
                // console.log("成功")
                // item = {
                //   "康营家园二社区居委会-110105037002":["康营家园-10471"],
                //   "康营家园二社区居委会1111-110105037002":["康营家园-10471"]
                // }
                var str = "";
                $.each(item, function (idx, itm) {
                  str += itm.split("-")[1] + ",";
                })
                zoneAll = str.substring(0, str.length - 1);
                // console.log(zoneAll)

                data = {
                  "zone": zoneAll,
                  "type": 1,
                  "zone_code": zone_code,
                  "name": name,
                  "community_id": community_id
                }
              }
            })
          } else if (data.zone_code == "0") {//是小区时执行
            data = {
              "zone": community_id,
              "type": 1,
              "zone_code": "0",
              "name": name,
              "community_id": community_id
            }
          } else {
            // console.log("首次加载")

            //首次拿取zone type
            var lis = $(".cont_ul_1 li:not(:first-child)");
            var len = $(".cont_ul_1 li:not(:first-child)").length;
            var zone = "";
            for (var i = 0; i < len; i++) {
              zone += (lis[i].attributes.value.value) + ","
            }
            zone = zone.substring(0, zone.length - 1);
            data = {
              "zone_code": zone_code,
              "community_id": community_id,
              "name": name,
              "type": type,
              "zone": zone
            }
          }
        }
        function Levels3(){
          if (data.zone_code == "0") {//是小区时执行
            data = {
              "zone": community_id,
              "type": 1,
              "zone_code": "0",
              "name": name,
              "community_id": community_id
            }
          } else {
            // console.log("首次加载")

            //首次拿取zone type
            var lis = $(".cont_ul_1 li:not(:first-child)");
            var len = $(".cont_ul_1 li:not(:first-child)").length;
            var zone = "";
            for (var i = 0; i < len; i++) {
              zone += (lis[i].attributes.value.value) + ","
            }
            zone = zone.substring(0, zone.length - 1);
            data = {
              "zone_code": zone_code,
              "community_id": community_id,
              "name": name,
              "type": type,
              "zone": zone
            }
            $(".region").attr('iscommunity','0')//初次加载时 iscommunity为0 表示不是小区
          }
        }
        
        Map.api.LoadCurrentLayer(data);
        Records.api.StartWebsocket(data);
        Records.api.InitRecordList();
      },
      onloadIndex: function () {
        //今日新增
        Frontend.api.Ajax('/Webapi/todayUser', null, function (msg) {
          var adduserNum = msg.data.adduser;
          var deleteuserNum = msg.data.deleteuser;
          $(".peopleChange ul li:nth-of-type(1) dl dt").html(adduserNum);
          $(".peopleChange ul li:nth-of-type(2) dl dt").html(deleteuserNum);
        });
        //总数展示(街道 社区 小区...)
        Frontend.api.Ajax('/Webapi/countInfo', null, function (msg) {
          $(".iconBox>li:nth-child(1) dl dd").html(msg.data.街道.num)
          $(".iconBox>li:nth-child(2) dl dd").html(msg.data.社区.num)
          $(".iconBox>li:nth-child(3) dl dd").html(msg.data.小区.num)
          $(".iconBox>li:nth-child(4) dl dd").html(msg.data.楼栋.num)
          $(".iconBox>li:nth-child(5) dl dd").html(msg.data.房屋.num)
          $(".iconBox>li:nth-child(6) dl dd").html(msg.data.人口.num)
          $(".iconBox>li:nth-child(7)>dl>dd").html(msg.data.设备.num)
          $(".iconBox>li:nth-child(8) dl dd").html(msg.data.单位.num)

          $(".current_div ul li:nth-child(1) dl .current_num").html(msg.data.设备.info[0].num)//门禁
          $(".current_div ul li:nth-child(2) dl .current_num").html(msg.data.设备.info[1].num)//烟感
          $(".current_div ul li:nth-child(3) dl .current_num").html(msg.data.设备.info[2].num)//监控
          $(".current_div ul li:nth-child(4) dl .current_num").html(msg.data.设备.info[3].num)//车禁
          $(".current_div ul li:nth-child(5) dl .current_num").html(msg.data.设备.info[4].num)//WIFI嗅探
          $(".current_div ul li:nth-child(6) dl .current_num").html(msg.data.设备.info[5].num)//红外预警
          $(".current_div ul li:nth-child(7) dl .current_num").html(msg.data.设备.info[6].num)//充电桩
          $(".current_div ul li:nth-child(8) dl .current_num").html(msg.data.设备.info[7].num)//停车棚
          $(".current_div ul li:nth-child(9) dl .current_num").html(msg.data.设备.info[8].num)//消防器

        })
        //重点总数展示
        Frontend.api.Ajax('/Webapi/keynoteInfo', null, function (msg) {
          $(".peopleNum ul li:nth-child(1) dl dt").html(msg.data.重点人口数量)
          $(".peopleNum ul li:nth-child(2) dl dt").html(msg.data.重点地区人口数量)
          $(".peopleNum ul li:nth-child(3) dl dt").html('查看')
          $(".peopleNum ul li:nth-child(4) dl dt").html(msg.data.黑名单人员数量)
          $(".peopleNum ul li:nth-child(5) dl dt").html(msg.data.陌生人抓拍)
        })


        //设备当前图标
        $(".iconBox .current").hover(function () {
          $(this).find('span').css({
            "color": '#24ffff',
          });
          $(".current_div").css({
            "display": "block"
          })
        }, function () {
          $(this).find('span').css({
            "color": '#fff',
          });
          $(".current_div").css({
            "display": "none"
          })
        });


      },
      mapIndex: function () {
        //人员类型切换

        $("#peopleArrowLeft").hide();
        $("#peopleArrowRight").show();
        $(".warnListSos").hide();
        $("#peopleArrowRight").on("click",function(){
          $(".warnListSpecial").hide();
          $(".warnListSos").show();
          $("#peopleArrowLeft").show();
          $("#peopleArrowRight").hide();
        })
        $("#peopleArrowLeft").on("click",function(){
          $(".warnListSpecial").show();
          $(".warnListSos").hide();
          $("#peopleArrowLeft").hide();
          $("#peopleArrowRight").show();
        })

        //人员、房屋、设备 告警展示
        var peoplewarnType = {//	1人员告警2房屋告警3设备告警
          warnTypesInfo: '1'
        }
        Frontend.api.Ajax('/Webapi/warnInfo', peoplewarnType, function (msg) {
          $(".peopleWarn .warnList li:nth-child(1) dl .warnList_untreated span").html(msg.data[0].num[0].num);
          $(".peopleWarn .warnList li:nth-child(1) dl .warnList_processed span").html(msg.data[0].num[2].num);
          $(".peopleWarn .warnList li:nth-child(2) dl .warnList_untreated span").html(msg.data[1].num[0].num);
          $(".peopleWarn .warnList li:nth-child(2) dl .warnList_processed span").html(msg.data[1].num[2].num);

          $(".peopleWarn .warnList li:nth-child(3) dl .warnList_untreated span").html(msg.data[4].num[0].num);
          $(".peopleWarn .warnList li:nth-child(3) dl .warnList_processed span").html(msg.data[4].num[2].num);

          $(".peopleWarn .warnList li:nth-child(4) dl .warnList_untreated span").html(msg.data[2].num[0].num);
          $(".peopleWarn .warnList li:nth-child(4) dl .warnList_processed span").html(msg.data[2].num[2].num);
          $(".peopleWarn .warnList li:nth-child(5) dl .warnList_untreated span").html(msg.data[3].num[0].num);
          $(".peopleWarn .warnList li:nth-child(5) dl .warnList_processed span").html(msg.data[3].num[2].num);
        })
        var housewarnType = {//	1人员告警2房屋告警3设备告警
          warnTypesInfo: '2'
        }
        Frontend.api.Ajax('/Webapi/warnInfo', housewarnType, function (msg) {
          $(".houseWarn .warnList li:nth-child(1) dl .warnList_untreated span").html(msg.data[0].num[0].num);
          $(".houseWarn .warnList li:nth-child(1) dl .warnList_processed span").html(msg.data[0].num[2].num);
          $(".houseWarn .warnList li:nth-child(2) dl .warnList_untreated span").html(msg.data[1].num[0].num);
          $(".houseWarn .warnList li:nth-child(2) dl .warnList_processed span").html(msg.data[1].num[2].num);
        })
        var devicewarnType = {//	1人员告警2房屋告警3设备告警
          warnTypesInfo: '3'
        }
        Frontend.api.Ajax('/Webapi/warnInfo', devicewarnType, function (msg) {
          $(".diviceWarn .warnList li:nth-child(1) dl .warnList_untreated span").html(msg.data[0].num[0].num);
          $(".diviceWarn .warnList li:nth-child(1) dl .warnList_processed span").html(msg.data[0].num[2].num);
          $(".diviceWarn .warnList li:nth-child(2) dl .warnList_untreated span").html(msg.data[1].num[0].num);
          $(".diviceWarn .warnList li:nth-child(2) dl .warnList_processed span").html(msg.data[1].num[2].num);

          $(".diviceWarn .warnList li:nth-child(3) dl .warnList_untreated span").html(msg.data[2].num[0].num);
          $(".diviceWarn .warnList li:nth-child(3) dl .warnList_processed span").html(msg.data[2].num[2].num);
        })

      },

      onloadCarperson: function () {
        // 人员车辆切换
        // var parentPadding = $(".mapRight").paddingTop();
        $('.mapRight .bottom').css({
          // top: $(".tab").height() / 100 + 157 / 100 + 'rem',
          top: 15 + 'rem',
        });
        function toggleTab(trigger) {
          trigger.unbind("click").on("click", function () {
            var cases = $(this).parent().parent().hasClass('top') ? true : false;
            switch (cases) {
              case true:
                // debugger;
                $(this).parent().parent().removeClass('top').addClass('bottom');
                $(this).parent().parent().find('.listUl').addClass('hide');
                $(this).parent().parent().animate({
                  // top: $(".tab").height() / 100 + 157 / 100 + 'rem',
                  top: 15 + 'rem',
                  easing: "linear",
                });
                $(this).parent().parent().siblings().removeClass('bottom').addClass('top');
                $(this).parent().parent().siblings().find('.listUl').removeClass('hide');
                $(this).parent().parent().siblings().animate({
                  top: 1 + 'rem',
                  easing: "linear",
                });
                $(".person-list li").css("margin-top", "0rem");
                $(".car-list li").css("margin-top", "0rem");
                break;
              case false:
                // console.log('bottom');
                // debugger;
                // console.log($(this).parent().parent().siblings());
                $(this).parent().parent().removeClass('bottom').addClass('top');
                $(this).parent().parent().find('.listUl').removeClass('hide');
                $(this).parent().parent().animate({
                  top: 1 + 'rem',
                  easing: "linear",
                });
                $(this).parent().parent().siblings().removeClass('top').addClass('bottom');
                $(this).parent().parent().siblings().find('.listUl').addClass('hide');
                $(this).parent().parent().siblings().animate({
                  // top: $(".tab").height() / 100 + 157 / 100 + 'rem',
                  top: 15 + 'rem',
                  easing: "linear",
                })
                $(".person-list li").css("margin-top", "0rem");
                $(".car-list li").css("margin-top", "0rem");
                break;
            }
          })

        }
        toggleTab($('.mapRight .tab .toggleButton'));
      },
      swiper: function () {
        var mySwiper = new Swiper('.swiperContent', {
          pagination: {
            el: '.swiper-pagination',
            clickable: true,//点击原点切换
          },
          // effect : 'flip',
          simulateTouch: false,//禁止鼠标拖动
          on: {
            slideChangeTransitionEnd: function () {
              if (this.activeIndex == '0') {
                $(".header_right_shezhi").css("display", 'block');
                $(".header_right_qiehuan").css("display", 'block');
              } else {
                $(".header_right_shezhi").css("display", 'none');
                $(".header_right_qiehuan").css("display", 'none');
              }
              
              Index.api.loadLayer();
              
            },
          },
        });
        window.swiper = mySwiper;
      },

      echartIdSave:function(){
        var cont_id = $(".content_div .cont>div").attr('id');
        var cont_val = $(".content_div .cont").attr('value');

        var cont_id2 = $(".content_div2 .cont>div").attr('id');
        var cont_val2 = $(".content_div2 .cont").attr('value');

        var cont_id3 = $(".content_div3 .cont>div").attr('id');
        var cont_val3 = $(".content_div3 .cont").attr('value');

        var cont_id4 = $(".content_div4 .cont>div").attr('id');
        var cont_val4 = $(".content_div4 .cont").attr('value');

        var cont_id5 = $(".content_div5 .cont>div").attr('id');
        var cont_val5 = $(".content_div5 .cont").attr('value');

        var obj = {};
        obj[cont_id] = cont_val
        obj[cont_id2] = cont_val2
        obj[cont_id3] = cont_val3
        obj[cont_id4] = cont_val4
        obj[cont_id5] = cont_val5

        let field = JSON.stringify(obj);
        let dataField = {
            'homePage': field
        }
        Frontend.api.Ajax('/Webapi/userHomeSave', dataField, function (msg) {
          var setData = msg.data;
          //提交
          LayerTable.api.setSubmit(setData);
        })
      }
    }
  };
  Index.index()
  // return Index;
// });
