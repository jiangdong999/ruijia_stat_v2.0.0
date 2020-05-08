// define(['jquery', 'frontend', 'common','layer-table'], function($, Frontend, Common, LayerTable) {
  var Map = {
    api: {
      CreateMap: function() {
        if (typeof window.map === 'undefined'){
          window.map = new AMap.Map('mapCenter', {
            resizeEnable:true,//是否监控地图容器尺寸变化，默认值为false
            showLabel: false,
            mapStyle: 'amap://styles/701fed2f6e3e299e1ad5e8afbc9a415a',//设置地图的显示样式
            expandZoomRange:true,//是否支持可以扩展最大缩放级别,和zooms属性配合使用
            zooms:[3,20],
            zoom:19,
            pitch:30, // 地图俯仰角度，有效范围 0 度- 83 度
            viewMode:'3D' // 地图模式
          });
        
        }
      },
      // 地图渲染-区域
      DrawArea: function(ret) {
        // console.log(ret)
        // console.log(ret.data)
       
        if (window.hasOwnProperty("map")) {
          window.map.clearMap();//清除地图
        }else {
            Map.api.CreateMap();//创建地图
        }
        
        // console.log(ret.data)

        $.each(ret.data,function(index,item){
          // console.log(index)
          // console.log(item)
          if(item.border_coordinate == ""){
            return false;
          }else{
              var community_id = item.community_id;
              var outline = item.border_coordinate; //轮廓坐标
              var type = item.type;
              //获取中心坐标点加文字使用
              var outlineInfo = Map.api.GenerateBorder(outline)[0];
              var outlinePosition;
              if(outlineInfo != undefined){
                outlinePosition = [outlineInfo.lng,outlineInfo.lat];
              }
              
              var iscommunity = $(".region").attr("iscommunity");
              if(iscommunity == '1' && type == '1'){//1代表小区  菜单选择时为小区或地图点击时为小区时 启用
                // console.log("是小区级")
                // console.log('菜单选择时为小区或地图点击时为小区时')
                
                var Polyline = new AMap.Polyline({
                  path: Map.api.GenerateBorder(outline),
                  // fillColor: '#212fd8',      // 多边形填充颜色
                  // fillOpacity: 0.6,         // 填充透明度
                  strokeWeight: 2,        //线宽
                  strokeColor: '#54F9FF', // 线条颜色
                  zone_code: '0', 
                  community_code:item.community_code,
                  community_id:item.community_id,
                  type: item.type,
                  name: item.name
                });
                
                Polyline.setMap(map);
                // console.log(community_id)
                // map.setFitView();
                map.setFitView(null,true, [0,0,0,0],19);

                $(".region").attr("community_id",item.community_id)
                $(".region").attr("zone_code",'0')
                Map.api.BuildingCoording(community_id,"")//楼栋坐标
                // console.log("是小区级别")
              }else if(type == '0' || iscommunity == '0'){// 菜单选择时不是小区或地图点击时不是小区时启用
                // console.log("不是小区级别") 
                // console.log('菜单选择时不是小区或地图点击时不是小区时启用')
              
                var Polygon = new AMap.Polygon({
                  path: Map.api.GenerateBorder(outline),
                  fillColor: '#212fd8',      // 多边形填充颜色
                  fillOpacity: 0.4,         // 填充透明度
                  strokeWeight: 2,        //线宽
                  strokeColor: '#54F9FF', // 线条颜色
                  zone_code: item.zone_code, 
                  community_code:item.community_code,
                  community_id:item.community_id,
                  type: item.type,
                  name: item.name
                });
                Polygon.setMap(map);
                // console.log(community_id)
                map.setFitView();

                //添加轮廓标记
                if(outlineInfo != undefined){
                  // 创建纯文本标记
                  var text = new AMap.Text({
                    text:item.name,
                    anchor:'center', // 设置文本标记锚点
                    draggable:false,
                    cursor:'pointer',
                    angle:0,//文字切斜多少度
                    style:{
                    'background-color': 'rgba(240, 248, 255, 0)',
                    'border-width': 0,
                    'font-size': '0.6rem',
                    'color': '#fff',
                    },
                    position:outlinePosition
                  });
                  text.setMap(map);
                }

                Polygon.on('click', function (event) {
                  
                  var community_code = event.target.D.community_code;
                  var community_id = event.target.D.community_id;
                  var zone_code = event.target.D.zone_code;
                  var type = event.target.D.type;
                  var name = event.target.D.name;
                  // console.log(event.target.D)
                  // console.log(window.region)
                  
                  var level = window.region.level;//深度0,1,2,3
                  sessionStorage.setItem("community_id",community_id)//小区id
                  sessionStorage.setItem("level",level)
                  // console.log(level)
                  $(".region").text(name)
                  $(".region").attr("zone_code",zone_code)
                  $(".region").attr("iscommunity",type)
                  $(".region").attr("level",level)

                  if(typeof community_id == "undefined"){
                    community_id = "0"
                  }

                  if(type == '1'){//type为1  代表小区
                    $(".region").attr("zone_code",'0');
                    $(".region").attr("community_id",community_id);
                    zone_code = '0';
                    type = '1';
                  }

                  Map.api.RegionalOutline(zone_code,type,name,community_id)//区域轮廓
                });
              }
          }
        })
      
      },

      //区域轮廓
      RegionalOutline: function(zone_code,type,name,community_id){
          var Region = window.region.data;
          if (typeof Region == 'undefined') {
            return false;
          }
          if(window.region.level == 2){//居委会
            if(type == '0'){//不是小区
              $.each(Region,function(index,item){
                if(index.indexOf(zone_code)!=-1){//匹配
                  // console.log("成功")
                  // item = {
                  //   "康营家园二社区居委会-110105037002":["康营家园-10471"],
                  //   "康营家园二社区居委会1111-110105037002":["康营家园-10471"]
                  // }
                  // console.log(item)
                  var str = "";
                  $.each(item,function(idx,itm){
                    str += itm.split("-")[1]+",";
                  })
                  zoneAll = str.substring(0,str.length-1);
                  level = window.region.level;
                  var obj = {
                    "zone":zoneAll,
                    "type":type,
                    "zone_code": zone_code,
                    "name": name,
                    "community_id": community_id,
                    'level':level
                  }
                  // require(['common'], function (Common) {
                    Common.api.changeRelateRegion(obj);
                  // });
                }
              })
            }else{
              //是小区
              // console.log('是小区')
              var obj = {
                "zone":community_id,
                "type":'1',
                "zone_code": '0',
                "name": name,
                "community_id": community_id
              }
              // require(['common'], function (Common) {
                Common.api.changeRelateRegion(obj);
              // });
            }
          }else if(window.region.level == 1){// 街道、居委会、小区 
            if(type == '0'){//不是小区
              $.each(Region,function(index,item){
                if(index.indexOf(zone_code)!=-1){
                  // console.log("成功")
                  // item = {
                  //   "康营家园二社区居委会-110105037002":["康营家园-10471"],
                  //   "康营家园二社区居委会1111-110105037002":["康营家园-10471"]
                  // }
                  var str = "";
                  $.each(item,function(idx,itm){
                    // console.log(idx)
                    str += idx.split("-")[1]+",";
                  })
                  zoneAll = str.substring(0,str.length-1);
                  var obj = {
                    "zone":zoneAll,
                    "type":type,
                    "zone_code": zone_code,
                    "name": name,
                    "community_id": community_id
                  }
                  // require(['common'], function (Common) {
                    Common.api.changeRelateRegion(obj);
                  // });

              　}else if(zone_code != "000000000000"){
                  // console.log("失败")
                  $.each(item,function(index2,item2){
                    if(index2.indexOf(zone_code)!=-1){
                      // console.log("成功22")
                      var str = "";
                      $.each(item2,function(idx,itm){
                        // console.log(itm)
                        str += itm.split("-")[1]+",";
                      })
                      zoneAll = str.substring(0,str.length-1);
                      var obj = {
                        "zone":zoneAll,
                        "type":type,
                        "zone_code": zone_code,
                        "name": name,
                        "community_id": community_id
                      }
                      // require(['common'], function (Common) {
                        Common.api.changeRelateRegion(obj);
                      // });
                    }else{
                      // console.log("失败22")
                    }
                  })
                }else{
                  // console.log("首次加载")
                  zone_code = $(".region").attr("zone_code");
                  community_id = $(".region").attr("community_id");
                  level = $(".region").attr("level");
                  userlevel = $(".region").attr("userlevel");
                  adminid = $(".region").attr("adminid");
                  iscommunity = $(".region").attr("iscommunity");

                  //首次拿取zone type
                  var lis = $(".cont_ul_1 li:not(:first-child)");
                  var len = $(".cont_ul_1 li:not(:first-child)").length;
                  var zone = "";
                  for (var i = 0;i < len;i++) {
                    zone += (lis[i].attributes.value.value)+","
                  }
                  zone=zone.substring(0,zone.length-1);
                  iscommunity = $(".region").attr("iscommunity");
                  if(iscommunity == undefined){
                    iscommunity = "0"
                  }
                  
                  obj = {
                    "zone_code":zone_code,
                    "community_id":community_id,
                    "level":level,
                    "userlevel":userlevel,
                    "adminid":adminid,
                    "iscommunity":iscommunity,
                    "type":iscommunity,
                    "zone":zone
                  }
                  // require(['common'], function (Common) {
                    Common.api.changeRelateRegion(obj);
                  // });
                }
              })
            }else{
              //是小区
              // console.log('是小区')
              var obj = {
                "zone":community_id,
                "type":'1',
                "zone_code": '0',
                "name": name,
                "community_id": community_id
              }
              // require(['common'], function (Common) {
                Common.api.changeRelateRegion(obj);
              // });
            }
          }else if(window.region.level == 0){//区、街道、居委会、小区
            if(type == '0'){//不是小区
              $.each(Region,function(index,item){
                // console.log("lalal 区、街道、居委会、小区")
                if(index.indexOf(zone_code)!=-1){
                  // console.log("成功")
                  // item = {
                  //   "康营家园二社区居委会-110105037002":["康营家园-10471"],
                  //   "康营家园二社区居委会1111-110105037002":["康营家园-10471"]
                  // }
                  var str = "";
                  $.each(item,function(idx,itm){
                    str += idx.split("-")[1]+",";
                  })
                  zoneAll = str.substring(0,str.length-1);
                  var obj = {
                    "zone":zoneAll,
                    "type":type,
                    "zone_code": zone_code,
                    "name": name,
                    "community_id": community_id
                  }
                  // require(['common'], function (Common) {
                    Common.api.changeRelateRegion(obj);
                  // });
  
              　}else if(zone_code != "000000000000"){
                  // console.log("失败")
                  $.each(item,function(index2,item2){
                    if(index2.indexOf(zone_code)!=-1){
                      // console.log("成功22")
                      var str = "";
                      $.each(item2,function(idx,itm){
                        str += idx.split("-")[1]+",";
                      })
                      zoneAll = str.substring(0,str.length-1);
                      var obj = {
                        "zone":zoneAll,
                        "type":type,
                        "zone_code": zone_code,
                        "name": name,
                        "community_id": community_id
                      }
                      // require(['common'], function (Common) {
                        Common.api.changeRelateRegion(obj);
                      // });
                    }else{
                      // console.log("失败22")
                      $.each(item2,function(index3,item3){
                        if(index3.indexOf(zone_code)!=-1){
                          $.each(item3,function(idx,itm){
                            str += itm.split("-")[1]+",";
                          })
                          zoneAll = str.substring(0,str.length-1);
                          var obj = {
                            "zone":zoneAll,
                            "type":type,
                            "zone_code": zone_code,
                            "name": name,
                            "community_id": community_id
                          }
                          // require(['common'], function (Common) {
                            Common.api.changeRelateRegion(obj);
                          // });
                        }
                      })
                    }
                  })
                }else{
                  // console.log("首次加载")
                  zone_code = $(".region").attr("zone_code");
                  community_id = $(".region").attr("community_id");
                  level = $(".region").attr("level");
                  userlevel = $(".region").attr("userlevel");
                  adminid = $(".region").attr("adminid");
                  iscommunity = $(".region").attr("iscommunity");
  
                  //首次拿取zone type
                  var lis = $(".cont_ul_1 li:not(:first-child)");
                  var len = $(".cont_ul_1 li:not(:first-child)").length;
                  var zone = "";
                  for (var i = 0;i < len;i++) {
                    zone += (lis[i].attributes.value.value)+","
                  }
                  zone=zone.substring(0,zone.length-1);
                  iscommunity = $(".region").attr("iscommunity");
                  if(iscommunity == undefined){
                    iscommunity = "0"
                  }
                  
                  obj = {
                    "zone_code":zone_code,
                    "community_id":community_id,
                    "level":level,
                    "userlevel":userlevel,
                    "adminid":adminid,
                    "iscommunity":iscommunity,
                    "type":iscommunity,
                    "zone":zone
                  }
                  // require(['common'], function (Common) {
                    Common.api.changeRelateRegion(obj);
                  // });
                }  
              })
            }else{//是小区
                // console.log('是小区')
                var obj = {
                  "zone":community_id,
                  "type":'1',
                  "zone_code": '0',
                  "name": name,
                  "community_id": community_id
                }
                // require(['common'], function (Common) {
                  Common.api.changeRelateRegion(obj);
                // });
            }
            
          }else if(window.region.level == 3){//小区
            // console.log(Region)
              var str = "";
              $.each(Region,function(idx,itm){
                str += itm.split("-")[1]+",";
              })
              zoneAll = str.substring(0,str.length-1);
              level = window.region.level;
              var obj = {
                "zone":zoneAll,
                "type":type,
                "zone_code": zone_code,
                "name": name,
                "community_id": community_id,
                'level':level
              }
              // require(['common'], function (Common) {
                Common.api.changeRelateRegion(obj);
              // });
          }
      },


      //楼栋坐标
      BuildingCoording: function(community_id,community_code){
        // console.log(community_id)
        // console.log(community_code)
        var objdata = {
          "communityId":community_id,
          "communityCode":community_code
        }
        Frontend.api.Ajax('/Webapi/mapCommunityInfo', objdata, function (ret) {
          var inner = ret.data;
          var markers = [];
          $.each(inner, function (k, item) {

            if (typeof item.latitude == "undefined" || typeof item.longitude == "undefined") {
              return;
            }
            var marker = new AMap.Marker({
              position: new AMap.LngLat(item.longitude, item.latitude),
              // offset: new AMap.Pixel(21, 35),
              icon: window.location.protocol + '/img/house_locate.png',
              anchor:'middle-right'

            });

            marker.setExtData({
              'building_code': item.building_code,
              'building_name':item.building_name,
              'community_id':item.community_id,
              'numinfo':item.numinfo,
              'zone_code':"0"
            });

            // marker.setTitle(item.building_name);
            marker.setLabel({
              offset: new AMap.Pixel(50, 10),  //设置文本标注偏移量
              content: "<div class='info'>" + item.building_name + "</div>", //设置文本标注内容
              direction: 'right' //设置文本标注方位
            });
            markers.push(marker);
            map.setFitView();
            marker.on('click', function (event) {
              // console.log(event)
              // console.log(this.getExtData())
              //楼栋详情操作 building_code ,building_id
              //this.getExtData()  获取楼栋参数
              var building_Data = this.getExtData();
              var newData = {
                  'buildingCode' : building_Data.building_code,
                  'buildingName':building_Data.building_name,
                  'community_id':building_Data.community_id,
                  'numinfo':building_Data.numinfo,
                  'zone_code':"0"
                  
              };
              layui.use(['layer', 'table', 'laydate', 'form', 'tableFilter'], function() {
                var layer = layui.layer,//弹层
                table = layui.table, //表格
                laydate = layui.laydate,//日期
                form = layui.form;//表单
                tableFilter = layui.tableFilter;//过滤器
                var layuiModule = {layer,table,laydate,form,tableFilter};
                LayerTable.api.Building(layuiModule,newData)
              })
            });
          });
          map.add(markers);
        })
      },



      // 地图渲染-社区
      DrawCommunity: function(ret) {
        // 地图渲染-社区
        var outer = ret.data.own;
        var inner = ret.data.subset;
        if (outer == '') {
          return false;
        }

        if (window.hasOwnProperty("map")) {
          window.map.clearMap();
        }else{
          Map.api.CreateMap();
        }
        console.log("start map communtiy");
        sessionStorage.setItem('abc', 1);
        map.setZoomAndCenter(outer.poit.degree, [outer.poit.city.xcity, outer.poit.city.ycity]);
        map.setStatus({
          dragEnable: false,
          doubleClickZoom: false,
          zoomEnable: false,
        });
        var Polyline = new AMap.Polyline({
          path: Map.api.GenerateBorder(outer[0].border_coordinate),
          fillColor: '#fff',      // 多边形填充颜色
          fillOpacity: 0,         // 填充透明度
          strokeWeight: 5,
          borderWeight: 1,        // 线条宽度，默认为 1
          strokeColor: '#54F9FF', // 线条颜色
        });
        map.add(Polyline);
        if (inner === null) {
          return false;
        }
        var markers = [];
        $.each(inner, function (k, item) {
          if (typeof item.longitude === "undefined" || typeof item.longitude === "undefined") {
            return;
          }
          var marker = new AMap.Marker({
            position: new AMap.LngLat(item.longitude, item.latitude),
            // offset: new AMap.Pixel(21, 35),
            icon: window.location.protocol + '/img/house_locate.png',
            anchor:'middle-right'
          });

          marker.setExtData({
            'building_code': item.building_code,
            'building_id': item.id,
            'building_name':item.building_name,
          });

          // marker.setTitle(item.building_name);
          marker.setLabel({
            offset: new AMap.Pixel(50, 10),  //设置文本标注偏移量
            content: "<div class='info'>" + item.building_name + "</div>", //设置文本标注内容
            direction: 'right' //设置文本标注方位
          });
          markers.push(marker);
          map.setFitView();
          marker.on('click', function (event) {
            //楼栋详情操作 building_code ,building_id
            //this.getExtData()  获取楼栋参数
            var building_Data = this.getExtData();
            var newData = {
                'buildingCode' : building_Data.building_code,
                'building_id' : building_Data.building_id,
                'building_name':building_Data.building_name,
            };
            layui.use(['layer', 'table', 'laydate', 'form', 'tableFilter'], function() {
              var layer = layui.layer,//弹层
              table = layui.table, //表格
              laydate = layui.laydate,//日期
              form = layui.form;//表单
              tableFilter = layui.tableFilter;//过滤器
              var layuiModule = {layer,table,laydate,form,tableFilter};
              LayerTable.api.Building(layuiModule,newData)
            })
          });
        });
        map.add(markers);
        map.setFitView();
        map.on('complete', Map.api.LoadMapComplete());
      },
      LoadMapComplete: function() {
        console.log("map load complete community");
        sessionStorage.setItem('abc', 0);
      },
      GenerateBorder: function(border) {
        // 地图边界数据解析
        var path = [];
        if (border) {
          $.each(border.split('|'), function (index, item) {
            let pos = item.split(',');
            path.push(new AMap.LngLat(pos[0], pos[1]));
            
          });
        }
        return path;
      },
      LoadCurrentLayer: function (objdata) {
        // console.log(objdata)
        // console.log("----------------LoadCurrentLayer------------")
        //加载地图
        if (swiper.activeIndex == CONST.SWIPER_PAGE_INDEX_MAP) { // SWIPER_PAGE_INDEX_MAP map页
          Frontend.api.Ajax('/Webapi/mapInfoUtline', objdata, function (ret) {
            // 渲染地图   // REGION_LEVEL_COMMUNITY 小区 3
            if(ret.code == 200){
                Map.api.DrawArea(ret)//创建地图
            }else{
              return false;
            }
          }).then(function (ret) {
            // console.log(ret)
            // 社区下拉选择
            var CommunityId = sessionStorage.getItem('community_id');
            if (CommunityId != "undefined" && CommunityId !="0" && CommunityId.length < 7) {//0, //刷新小区列表
              Frontend.api.Ajax('/Webapi/selCommlist', ret, function (ret) {
                $(".mapRight_switch_ul").css('display', 'block');
                Map.api.LoadCommunityList(ret);
              }).then(function (ret) {
                Frontend.api.Ajax('/Webapi/deviceInfo', ret, function (data) {
                  $(".mapBottom").css('display', 'block');
                  
                  Map.api.LoadDeviceFilter(data);
                });
              })
            }else{
              $(".mapRight_switch_ul").css('display', 'none');
              $(".mapBottom").css('display', 'none');
            }
          })
        }

      },
      LoadCommunityList: function (ret) {
        // console.log(ret)
        // 加载社区下拉列表
        if (ret.hasOwnProperty("data") && typeof (ret.data) != 'undefined') {
          // 加载当前区域text
          $("#mapRight_switch_all").find('.mapRight_switch_text').text(ret.data.current_text).next()
              .find(".mapRight_cont_ul>li").remove();

          // 加载列表内容
          var list = ret.data.list;
          $.each(list, function (k, item) {
            if (!item.hasOwnProperty("level")) {
              item.level = '3';
            }
            var html = "<li community_id='" + item.community_id +
                       "' level='" + item.level +
                       "' zone_code='" + (item.hasOwnProperty("zone_code") ? item.zone_code: '0')  +
                       "' real_name='" + (item.hasOwnProperty("real_name") ? item.real_name: item.community_name) +
                       "'>" + item.community_name + "</li>";
            $("#mapRight_switch_all").find(".mapRight_cont_ul").append(html);
          });
          // 相关事件
          $("#mapRight_switch_all").unbind("click").on("click", function() {
            //地图页-切换小区
            $(".mapRight_cont_ul").toggle();
          });
          $(".mapRight_cont").hover(function() {}, function() {
            $(".mapRight_cont_ul").css("display","none");
          });
          $("#mapRight_switch_all").hover(function() {}, function() {
            $(".mapRight_cont_ul").css("display","none");
          });
          $("#mapRight_switch_all").find(".mapRight_cont_ul>li").unbind("click").on("click", function(e) {
            //地图页-切换小区
            $('.mapRight_switch_text').text($(this).text());

            var zone_code = $(this).attr("zone_code");
            var community_id = $(this).attr("community_id");
            var level = $(this).attr("level");
            var real_name = $(this).attr("real_name");

            if(zone_code.length >= 12){

              var lis = $(".mapRight_cont_ul>li:not(:eq(0))");
              var len = $(".mapRight_cont_ul>li:not(:eq(0))").length;
  
              var zone = "";
              for (var i = 0;i < len;i++) {
                zone += (lis[i].attributes[0].value)+","
              }
              zone=zone.substring(0,zone.length-1);
              data = {
                "zone_code":zone_code,
                "community_id":community_id,
                "name":real_name,
                "type":0,
                "zone":zone,
                "level":level
              }
              $(".region").attr("iscommunity","0");
              // require(['common'], function (Common) {
                Common.api.changeRelateRegion(data);
              // });
              return false;
            }else{
              data = {
                "zone_code":zone_code,
                "community_id":community_id,
                "name":real_name,
                "type":1,
                "zone":community_id,
                "level":level
              }
              $(".region").attr("iscommunity","1");
              $(".region").attr("zone",community_id);
              $(".region").attr("zone_code",zone_code);

              // require(['common'], function (Common) {
                Common.api.changeRelateRegion(data);
              // });
              return false;
            }
            
          });
        }
      },
      LoadDeviceFilter: function (ret) {
        // 加载设备筛选
        if (!ret.hasOwnProperty('data')) {
          return false;
        }
        var deviceDoor = ret.data.doorList;
        var deviceMonitor = ret.data.monitorList;
        
        var empty = null;
        for(var i = 0;i<= deviceDoor.length;i++){
          for (var key in deviceDoor[i]) {
            if (deviceDoor[i].hasOwnProperty(key)) {
                if (deviceDoor[i][key] === null) {
                   deviceDoor[i][key] = 0;
                    empty = true;
                } else {
                    empty = false;
                }
            }
          }
        }
        for(var i = 0;i<= deviceMonitor.length;i++){
          for (const key in deviceMonitor[i]) {
            if (deviceMonitor[i].hasOwnProperty(key)) {
                if (deviceMonitor[i][key] === null) {
                    deviceMonitor[i][key] = 0;
                    empty = true;
                } else {
                    empty = false;
                }
            }
          }
        }

        deviceMarkers = [];
        monitorMarkers = [];
        //门禁设备

        var infoWindow = new AMap.InfoWindow({
          isCustom: true,  //使用自定义窗体
          offset: new AMap.Pixel(0, -Map.api.deviceDoorOffset()*3),
          // content: createInfoWindow(),
        });
        // function createInfoWindow(){
        //   $.each(deviceDoor, function (k, item) {
        //     var contentInfo = `<ul>`
        //     $.each(item.deviceInfo,function(idx,val){
        //       contentInfo += `<li class="device_door_Info" door_code="${val.door_code}" community_code="${val.community_code}">${val.door_name}</li>`
        //     })
        //     contentInfo += `</ul>`;
        //     return contentInfo;
        //     // marker.content = contentInfo;
          
        //   })
        // }
        $.each(deviceDoor, function (k, item) {
          // console.log(item)
          if (typeof item.longitude === "undefined" || typeof item.latitude === "undefined") {
            return;
          }
          var marker = new AMap.Marker({
            position: new AMap.LngLat(item.longitude, item.latitude),
            offset: new AMap.Pixel(-10, -Map.api.deviceDoorOffset()*3),
            icon: window.location.protocol + '/img/access.png',
            anchor: 'middle-right'
          });
          
          var contentInfo = `<ul class="device_door_Info_ul">`
          $.each(item.deviceInfo,function(idx,val){
            contentInfo += `<li class="device_door_Info" door_code="${val.door_code}" community_code="${val.community_code}">${val.door_name}</li>`
          })
          contentInfo += `</ul>`;
          marker.content = contentInfo;

          deviceMarkers.push(marker);

          // map.setFitView();
          map.setFitView(null,true, [0,0,0,0],19);
          marker.on('mouseover', infoOpen);

          marker.on('mouseout', infoClose);
        });
        //点击门禁机设备
        $(".mapCenter").unbind("click").on("click",'.device_door_Info',function(){
          var door_code = $(this).attr('door_code');
          var community_code = $(this).attr('community_code');
          var data = {
            'door_code':door_code,
            'community_code':community_code,
          }
          Map.api.LoadDeviceDetail(data);
        })

        function infoOpen(e) {
          infoWindow.setContent(e.target.content);
          infoWindow.open(map, e.target.getPosition());
        }
        function infoClose(e){
          infoWindow.close(map, e.target.getPosition());
        }
        //监控设备
        $.each(deviceMonitor, function (k, item) {
          if (typeof item.longitude === "undefined" || typeof item.latitude === "undefined") {
            return;
          }          
          var marker = new AMap.Marker({
            position: new AMap.LngLat(item.longitude, item.latitude),
            offset: new AMap.Pixel(-10, -Map.api.deviceDoorOffset()*3),
            icon: window.location.protocol + '/img/monitor.png',
            anchor: 'middle-right'
          });
          marker.setExtData({
            'monitorId':item.id,
            'types':'3',
            'video_url':item.video_url
          });
          monitorMarkers.push(marker);
          // map.setFitView();
          map.setFitView(null,true, [0,0,0,0],19);
          marker.on('click', function (event) {
            var Extdata = this.getExtData();
            layui.use(['layer'], function() {
              var layer = layui.layer;//弹层
              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                shade: 0.8,
                skin: 'onePeoplePushclass', //皮肤
                area: ['25rem', '18rem'],
                zIndex:2000000, //层优先级
                content: $('#onePeoplePush_photo'),
                success: function () {
                var str = `<iframe src="${Extdata.video_url}" allowfullscreen style="width:80%;height:80%;margin-left:10%;margin-top:10%"></iframe>`;
                  $(".onePeoplePush_photo").html(str);
                }
              })
            })

          });
        });
        map.add(deviceMarkers);
        map.add(monitorMarkers);
        
        //关联设备filter
        layui.use(['form','layer'],function() {
          var form = layui.form;
          //全选
          form.on('checkbox(checkboxMapbtm_all)',function(data){
            $("input[name='check[]']").each(function () {
              this.checked = data.elem.checked;
              if(this.checked === true){
                map.add(deviceMarkers);
                map.add(monitorMarkers);
              }else{
                map.remove(deviceMarkers);
                map.remove(monitorMarkers);
              }
            });
            form.render('checkbox'); //重新渲染
            // if($(this).is(':checked')){
            //   var childs = $('#mapBottom_filter_ul>li').find('input');
            //   childs.each(function (index, item) {
            //     $(item).prop('checked', 'true');
            //   });
            //   map.add(deviceMarkers);
            // }else{
            //   var childs = $('#mapBottom_filter_ul>li').find('input');
            //   childs.each(function (index, item) {
            //     $(item).removeAttr('checked')
            //   });
            //   map.remove(deviceMarkers);
            // }
            // form.render('checkbox'); //重新渲染
          });
          //单选
        
          form.on('checkbox(checkboxMapbtm)', function(data) {
            var i = 0;
            var j = 0;
            //单选判断门禁
            if(data.value == 1 && this.checked === true){
              map.add(deviceMarkers);
            }else if(data.value == 1 && this.checked === false){
              map.remove(deviceMarkers);
            }
            //单选判断监控
            if(data.value == 2 && this.checked === true){
              map.add(monitorMarkers);
            }else if(data.value == 2 && this.checked === false){
              map.remove(monitorMarkers);
            }

            $("input[name='check[]']").each(function () {
              if(this.checked === true){
                i++;
              }
              j++;
            });
            form.render('checkbox');
            if( i == j ){
                $(".checkboxAll").prop("checked",true);
                form.render('checkbox');
            }else {
                $(".checkboxAll").removeAttr("checked");
                form.render('checkbox');
            }
          });
          
          
        
          //切到地图页时重载多选框
          var childs = $('#mapBottom_filter_ul>li').find('input');
          childs.each(function (index, item) {
            $(item).prop('checked', 'true');
          });
          form.render('checkbox'); //重新渲染
        });
        
      },
      
      LoadDeviceDetail: function (data) {
        // 加载设备详情
        // var newData = {
        //   'buildingCode' : data.building_code,
        //   'deviceCode' : data.door_code,
        //   'doorId': data.door_id,
        //   'types': '1',
        //   'doorNum': data.doorNum,
        // };
        var peopleData = {
          'community_code' : data.community_code,
          'door_code' : data.door_code,
        }
        layui.use(['layer', 'table', 'laydate', 'form', 'tableFilter'], function() {
          var layer = layui.layer,//弹层
              table = layui.table, //表格
              laydate = layui.laydate,//日期
              form = layui.form;//表单
              tableFilter = layui.tableFilter;//过滤器
              // LayerTable.api.MapdoorInfo({layer,table,laydate,form,tableFilter}, newData)
              LayerTable.api.DOOR_INFO_DEVICE({layer,table,laydate,form,tableFilter}, peopleData); // 门禁弹层详情 ==>信息和通行记录 
        });
      },
      //没有什么卵用（先留着吧）
      // ClearFlashMarker: function () {
      //   // 清除闪动点
      //   if (typeof window.marker != 'undefined') {
      //     map.remove(window.marker);
      //     window.marker = null;
      //   }
      // },
      // AddFlashMarker: function (data) {
      //   // 添加闪动点
      //   if (swiper.activeIndex == CONST.SWIPER_PAGE_INDEX_MAP) {
      //     marker = new AMap.Marker({
      //       position: new AMap.LngLat(data.longitude, data.latitude),
      //       icon: window.location.protocol + '/img/zuobiao.png',
      //       anchor: 'middle-right',
      //     });
      //     map.add(marker);
      //     map.setFitView();
      //   }
      // },
      deviceDoorOffset:function() {
        //deviceDoorOffset()为一个方法，根据屏幕大小去加载图标的位置
          var windowWidth = $(window).width();
          if (windowWidth <= 1920) {
              return 18
          }
          if(windowWidth > 1920 && windowWidth <= 2560){
              return 22
          }
          if (windowWidth > 2560 && windowWidth <= 3840) {
              return 28
          }
          if (windowWidth > 3840 && windowWidth <= 5760) {
              return 34
          }
      }
    }
  };
  // return Map;
// });




