// define(['jquery', 'frontend', 'layui', 'echarts', 'echart-map', 'scroll'], function ($, Frontend, Layui, echarts, undefined, Scroll) {
  var EchartTable = {
    api: {

      //echarts中间切换位置
      echartsTab: function () {
        $(".jian_click").unbind('click').on("click", function () {
          var contValue = $(this).siblings('.cont').attr('value');//当前的value
          var cont_5Value = $(".content_div5>.cont").attr('value');//中间位置的value
          $(this).siblings('.cont').attr('value', cont_5Value);
          $('.content_div5>.cont').attr('value', contValue);

          // console.log(cont_5Value)
          // console.log(contValue)
          //9 为常住流动人口的唯一标识
          //13 为男女比例的唯一标识
          if (contValue == '9' && cont_5Value != '13') {
            console.log('当前位置echart1_1,1_2与echart切换');

            var cont_5_id = $('.content_div5>.cont>div').attr("id"); //获取中间位置echart的id
            var cont_5_newdiv = $('<div id="' + cont_5_id + '"></div>'); //创建一个新的div
            $(this).siblings('.cont').html(cont_5_newdiv);
            $(this).siblings('.main').remove();
            var str = `
                            <div class="main">
                                <ul class="main_ul_1" id="main_ul_1">
                                    <li class="on">年</li>
                                    <li>月</li>
                                    <b id="population">...</b>
                                </ul>
                            </div>
                        `
            $('.content_div5>.cont').html("");
            $('.content_div5').append(str)
            var cont_1_newdiv = `
                            <div id="permanent"></div>
                            <div id="permanent_month"></div>
                            `
            $(".content_div5>.cont").append(cont_1_newdiv);
            $('.cont_all').each(function (index, value) {
              if ($(this).children().is('.main')) {
                $(".cont_all").on("click", '.main #main_ul_1 li', function () {
                  var idx = $(this).index();
                  $(this).addClass('on').siblings().removeClass('on');
                  $(this).parents('.cont_all').children('.cont').children('div').eq(idx).css("display", 'block').siblings().css("display", 'none');
                })
                $(".cont_all").on("click", '.main .main_ul_1 li:nth-child(2)', function () {
                  EchartTable.api.permanent_month();
                })
              }
            })
          } else if (contValue != '9' && contValue != '13' && cont_5Value == '9') {
            console.log('当前echart与中间位置echart1_1,1_2切换')
            var cont_this_id = $(this).siblings('.cont').children().attr('id');
            $('.content_div5>.cont').siblings('.main').remove();
            var cont_this_newdiv = $('<div id="' + cont_this_id + '"></div>'); //创建一个新的div
            $('.content_div5>.cont').html(cont_this_newdiv);
            var str = `
                            <div class="main">
                                <ul class="main_ul_1" id="main_ul_1">
                                    <li class="on">年</li>
                                    <li>月</li>
                                    <b id="population">...</b>
                                </ul>
                            </div>`
            $(this).siblings('.cont').html("");
            $(this).parent().append(str);
            var cont_1_newdiv = `
                            <div id="permanent"></div>
                            <div id="permanent_month"></div>
                            `
            $(this).siblings('.cont').append(cont_1_newdiv);

          } else if (contValue != '9' && contValue != '13' && cont_5Value != '9' && cont_5Value != '13') {
            console.log('纯属是echart结构');

            var cont_id = $(this).siblings('.cont').children('div').attr("id"); //获取当前点击位置echart的id
            var cont_5_id = $('.content_div5>.cont>div').attr("id"); //获取中间位置echart的id

            var cont_5_newdiv = $('<div id="' + cont_5_id + '"></div>'); //创建一个新的div
            var cont_this_newdiv = $('<div id="' + cont_id + '"></div>'); //创建一个新的div
            $(this).siblings('.cont').html(cont_5_newdiv);
            $('.content_div5>.cont').html(cont_this_newdiv);
          } else if (contValue == '13' && cont_5Value != '9') {
            console.log('男女比例在当前位置 男女比例与echart切换（echart在中间位置）')
            var cont_this_div = $(this).parent().find('.cont').html();
            var cont_5_div_id = $(".content_div5").find('.cont>div').attr("id");
            $(".content_div5").find('.cont>div').html(cont_this_div);
            var cont_5_newdiv = $('<div id="' + cont_5_div_id + '"></div>'); //创建一个新的div
            $(this).parent().find('.cont').html(cont_5_newdiv);
            $(".content_div5").find('.cont').html(cont_this_div);
            $(".swiper-slide .sexRatio thead tr th, .swiper-slide .sexRatio tbody tr td").css("height", '1.5rem');
          } else if (contValue != '9' && contValue != '13' && cont_5Value == '13') {
            console.log('echart在当前位置 echart与男女比例切换（男女在中间位置）')
            var cont_this_id = $(this).parent().find('.cont>div').attr("id");
            var cont_5_div = $(".content_div5").find('.cont').html();
            var cont_this_newdiv = $('<div id="' + cont_this_id + '"></div>'); //创建一个新的div
            $(".content_div5").find('.cont').html(cont_this_newdiv);
            $(this).parent().find('.cont').html(cont_5_div);
            $(".swiper-slide .sexRatio thead tr th, .swiper-slide .sexRatio tbody tr td").css("height", '0rem');
          } else if (contValue == '13' && cont_5Value == '9') {
            console.log('男女比例在当前位置  并且与  中间位置有多级echart结构切换');
            var cont_this_div = $(this).parent().find('.cont').html();
            $('.content_div5').children('.main').remove();
            $('.content_div5').children(".cont").html(cont_this_div);
            var str = `
                            <div class="main">
                                <ul class="main_ul_1" id="main_ul_1">
                                    <li class="on">年</li>
                                    <li>月</li>
                                    <b id="population">...</b>
                                </ul>
                            </div>
                        `
            $(this).parent().find('.cont').html("");
            $(this).parent().append(str)

            var cont_1_newdiv = `
                            <div id="permanent"></div>
                            <div id="permanent_month"></div>
                            `
            $(this).parent().find('.cont').append(cont_1_newdiv);
            $(".swiper-slide .sexRatio thead tr th, .swiper-slide .sexRatio tbody tr td").css("height", '1.5rem');
          } else if (contValue == '9' && cont_5Value == '13') {
            console.log('当前位置有多级echart结构  并且与 男女比例切换（男女在中间位置）')
            var cont_this_div = $('.content_div5').find(".cont").html();
            $(this).parent().children('.main').remove();
            $(this).parent().find('.cont').html(cont_this_div)
            var str = `
                            <div class="main">
                                <ul class="main_ul_1" id="main_ul_1">
                                    <li class="on">年</li>
                                    <li>月</li>
                                    <b id="population">...</b>
                                </ul>
                            </div>
                        `
            $('.content_div5').find('.cont').html("");
            $('.content_div5').append(str);
            var cont_1_newdiv = `
                            <div id="permanent"></div>
                            <div id="permanent_month"></div>
                            `
            $('.content_div5').find('.cont').append(cont_1_newdiv);
            $(".swiper-slide .sexRatio thead tr th, .swiper-slide .sexRatio tbody tr td").css("height", '0rem');

            $('.cont_all').each(function (index, value) {
              if ($(this).children().is('.main')) {
                $(".cont_all").on("click", '.main .main_ul_1 li', function () {
                  var idx = $(this).index();
                  $(this).addClass('on').siblings().removeClass('on');
                  $(this).parents('.cont_all').children('.cont').children('div').eq(idx).css("display", 'block').siblings().css("display", 'none');
                })
                $(".cont_all").on("click", '.main .main_ul_1 li:nth-child(2)', function () {
                  EchartTable.api.permanent_month();
                })
              }
            })
          }
          var cont_5_id = $('.content_div5>.cont>div').attr("id"); //获取中间位置echart的id
          var this_id = $(this).parent().find('.cont>div').attr("id"); //当前的id
          console.log(cont_5_id)
          console.log(this_id)
          eval("EchartTable.api." + cont_5_id + "()");
          eval("EchartTable.api." + this_id + "()");

        })
      },
      //echarts常住/流动人口年月切换
      permanentTab: function () {
        $(".main").parent().find(".cont>div:nth-child(1)").css("display", 'block').siblings().css("display", 'none');
        $(".cont_all").unbind('click').on("click", '.main #main_ul_1 li', function () {
          var idx = $(this).index();
          $(this).addClass('on').siblings().removeClass('on');
          $(".main").parent().find('.cont>div').eq(idx).css("display", 'block').siblings().css("display", 'none');
        })
        $(".cont_all").on("click", '.main #main_ul_1 li:nth-child(2)', function () {
          EchartTable.api.permanent_month();
        })

      },
      //常住、流动人口==> 年
      permanent: function () {
        var data = {
          types: 'year'
        }
        Frontend.api.Ajax('/Webapi/mobileResidence', data, function (msg) {
          permanent.setOption({
            xAxis: { data: msg.data.time },
            series: [
              { data: msg.data.changzu },
              { data: msg.data.liudong }
            ]
          })
        })

        var permanent = echarts.init(document.getElementById('permanent'));
        option = {
          title: {
            text: "常住/流动人口增长趋势",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%' //距下边距
          },
          // animationDuration: 5000, //动画缓动效果为5秒
          // animationDelay: 5000, //动画延迟效果为5秒
          // animationDelayUpdate: 5000,
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
                fontSize: EchartTable.getDpr(),
              }
            }
          },
          legend: {
            icon: 'rect', //圆形
            itemHeight: EchartTable.getDpr(), //改变圆圈大小
            itemWidth: EchartTable.getDpr() * 1.5, //改变圆圈大小
            data: ['常住', '流动'],
            type: 'scroll',
            // orient: 'vertical',//竖向排列
            right: '25%',
            top: '3%',
            textStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#d2d8fc',
              fontFamily: 'CNLight',
            },
            length: EchartTable.getDpr() * 1.5,
            length2: EchartTable.getDpr() * 1.5,
            lineStyle: {
              width: EchartTable.getDpr() * 0.1,
            }
          },
          xAxis: {
            type: 'category', //类目轴
            // boundaryGap: false, //坐标轴两端空白
            name: '年份',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // data: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
            axisTick: { //去掉刻度点
              show: false,
            },
            axisLine: {
              onZero: true
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value', //数值轴
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            splitLine: { //去掉网线　　　
              show: false
            },
            axisTick: { //去掉刻度点
              show: false
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            name: '常住',
            symbol: "none", //去掉网线上的刻度圆点
            data: "",
            itemStyle: {
              normal: {
                color: 'rgba(86,255,190, 1)', //线的颜色
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(86,255,190, 1)'
                }, {
                  offset: 1,
                  color: 'rgba(86,255,190, 0)'
                }])
              }
            },
            type: 'line',
            smooth: true,//线的圆润
            labelLine: {
              normal: {
                show: true
              },
            }

          }, {
            name: '流动',
            symbol: "none", //去掉网线上的刻度圆点
            data: "",
            type: 'line',
            smooth: true, //线的圆润
            itemStyle: {
              normal: {
                color: 'rgba(255,180,73, 1)', //线的颜色
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255,180,73, 1)'
                }, {
                  offset: 1,
                  color: 'rgba(255,180,73, 0)'
                }])
              }
            },
          }],
        };
        permanent.setOption(option);

      },
      //常住、流动人口==> 月
      permanent_month: function () {
        var data = {
          types: 'month'
        }
        Frontend.api.Ajax('/Webapi/mobileResidence', data, function (msg) {

          permanent_month.setOption({
            xAxis: { data: msg.data.time },
            series: [
              { data: msg.data.changzu },
              { data: msg.data.liudong }
            ]
          })
        })

        var permanent_month = echarts.init(document.getElementById('permanent_month'));
        option = {
          title: {
            text: "常住/流动人口增长趋势",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%' //距下边距
          },
          // animationDuration: 5000, //动画缓动效果为5秒
          // animationDelay: 5000, //动画延迟效果为5秒
          // animationDelayUpdate: 5000,
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
                fontSize: EchartTable.getDpr(),
              }
            }
          },
          legend: {
            icon: 'rect', //圆形
            itemHeight: EchartTable.getDpr(), //改变圆圈大小
            itemWidth: EchartTable.getDpr() * 1.5, //改变圆圈大小
            data: ['常住', '流动'],
            type: 'scroll',
            // orient: 'vertical',//竖向排列
            right: '25%',
            top: '3%',
            textStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#d2d8fc',
              fontFamily: 'CNLight',
            },
            length: EchartTable.getDpr() * 1.5,
            length2: EchartTable.getDpr() * 1.5,
            lineStyle: {
              width: EchartTable.getDpr() * 0.1,
            }
          },
          xAxis: {
            type: 'category', //类目轴
            // boundaryGap: false, //坐标轴两端空白
            name: '月份',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // data: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
            axisTick: { //去掉刻度点
              show: false,
            },
            axisLine: {
              onZero: true
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value', //数值轴
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            splitLine: { //去掉网线　　　
              show: false
            },
            axisTick: { //去掉刻度点
              show: false
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            name: '常住',
            symbol: "none", //去掉网线上的刻度圆点
            // data: [820, 932, 901, 934, 1290, 1330, 1320],
            itemStyle: {
              normal: {
                color: 'rgba(86,255,190, 1)', //线的颜色
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(86,255,190, 1)'
                }, {
                  offset: 1,
                  color: 'rgba(86,255,190, 0)'
                }])
              }
            },
            type: 'line',
            smooth: true,//线的圆润
            labelLine: {
              normal: {
                show: true
              },
            }

          }, {
            name: '流动',
            symbol: "none", //去掉网线上的刻度圆点
            // data: [320, 352, 501, 634, 890, 1030, 1000],
            type: 'line',
            smooth: true, //线的圆润

            itemStyle: {
              normal: {
                color: 'rgba(255,180,73, 1)', //线的颜色
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255,180,73, 1)'
                }, {
                  offset: 1,
                  color: 'rgba(255,180,73, 0)'
                }])
              }
            },
          }],


        };
        permanent_month.setOption(option);
      },
      //常住、流动人口==>弹出层 年
      permanent_layer_year: function () {
        var data = {
          types: 'year'
        }
        Frontend.api.Ajax('/Webapi/mobileResidence', data, function (msg) {
          myChart1_3.setOption({
            xAxis: { data: msg.data.time },
            series: [
              { data: msg.data.changzu },
              { data: msg.data.liudong }
            ]
          })
        })
        var myChart1_3 = echarts.init(document.getElementById('cont_1_3_echart'));
        option = {
          // backgroundColor: '#00265f',
          title: {
            text: "年对比变化",
            show: true,
            left: "5%",
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '35%', //距上边距
            bottom: '10%' //距下边距
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            },
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#6a7985',
                fontSize: EchartTable.getDpr(),
              }
            }
          },
          legend: {
            icon: 'circle', //圆形
            data: ['常住', '流动'],
            type: 'scroll',
            itemHeight: EchartTable.getDpr(), //改变圆圈大小
            itemWidth: EchartTable.getDpr() * 1.5, //改变圆圈大小
            // align: 'right',
            // right: 100,
            // top: 200,
            textStyle: {
              color: "#d2d8fc",
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            length: EchartTable.getDpr() * 1.5,
            length2: EchartTable.getDpr() * 1.5,
            lineStyle: {
              width: EchartTable.getDpr() * 0.1,
            }
          },
          xAxis: [{
            name: '年份',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            type: 'category',
            data: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
            axisLine: {
              // show: true,
              lineStyle: {
                color: "#0dafff",
                // width: 3,
                type: "solid"
              }
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
          }],
          yAxis: [{
            type: 'value',
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            axisTick: {
              show: false, //是否显示坐标轴刻度
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#00c7ff",
                // width: 3,
                type: "solid"
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            splitLine: {
              show: false, //去掉网线
              lineStyle: {
                color: "#063374",
              }
            }
          }],
          series: [{
            name: '常住',
            type: 'bar',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            barWidth: "20%", //柱子宽度
            // barGap: 1, //柱子之间间距
            itemStyle: {
              normal: {
                barBorderRadius: 20, // 统一设置四个角的圆角大小
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0,218,156,1)'
                }, {
                  offset: 1,
                  color: 'rgba(0,218,156,0)'
                }]),
                opacity: 1,
              }
            },
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: 'rgba(0,218,156,1)',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
          }, {
            name: '流动',
            type: 'bar',
            data: [350, 370, 460, 561, 675, 487, 360],
            barWidth: "20%",
            // barGap: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 20, // 统一设置四个角的圆角大小
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255,108,19,1)'
                }, {
                  offset: 1,
                  color: 'rgba(255,108,19,0)'
                }]),
                opacity: 1,
              }
            },
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: 'rgba(255,108,19,1)',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart1_3.setOption(option)
      },
      //常住、流动人口==>弹出层 月
      permanent_layer_month: function () {
        var data = {
          types: 'month'
        }
        Frontend.api.Ajax('/Webapi/mobileResidence', data, function (msg) {

          myChart1_4.setOption({
            xAxis: { data: msg.data.time },
            series: [
              { data: msg.data.changzu },
              { data: msg.data.liudong }
            ]
          })
        })
        var myChart1_4 = echarts.init(document.getElementById('cont_1_4_echart'));
        option = {
          title: {
            text: "月对比变化",
            show: true,
            left: "5%",
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '35%', //距上边距
            bottom: '10%' //距下边距
          },
          // animationDuration: 5000, //动画缓动效果为5秒
          // animationDelay: 5000, //动画延迟效果为5秒
          // animationDelayUpdate: 5000,
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
                fontSize: EchartTable.getDpr(),
              }
            }
          },
          legend: {
            icon: 'rect', //圆形
            itemHeight: EchartTable.getDpr(), //改变圆圈大小
            itemWidth: EchartTable.getDpr() * 1.5, //改变圆圈大小
            data: ['常住', '流动'],
            type: 'scroll',
            // orient: 'vertical',//竖向排列
            // right: 100,
            // top: 200,
            textStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#d2d8fc',
              fontFamily: 'CNLight',
            },
            length: EchartTable.getDpr() * 1.5,
            length2: EchartTable.getDpr() * 1.5,
            lineStyle: {
              width: EchartTable.getDpr() * 0.1,
            }
          },
          xAxis: {
            type: 'category', //类目轴
            // boundaryGap: false, //坐标轴两端空白
            name: '月份',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            data: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
            axisTick: { //去掉刻度点
              show: false,
            },
            axisLine: {
              onZero: true
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value', //数值轴
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
              color: '#6ea5d7'
            },
            splitLine: { //去掉网线　　　
              show: false
            },
            axisTick: { //去掉刻度点
              show: false
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            name: '常住',
            symbol: "none", //去掉网线上的刻度圆点
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            itemStyle: {
              normal: {
                color: 'rgba(86,255,190,1)', //线的颜色
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(86,255,190,1)'
                }, {
                  offset: 1,
                  color: 'rgba(86,255,190,0)'
                }])
              }
            },
            type: 'line',
            smooth: true,//线的圆润
            labelLine: {
              normal: {
                show: true
              },
            }

          }, {
            name: '流动',
            symbol: "none", //去掉网线上的刻度圆点
            data: [320, 352, 501, 634, 890, 1030, 1000],
            type: 'line',
            smooth: true, //线的圆润

            itemStyle: {
              normal: {
                color: 'rgba(255,180,73,1)', //线的颜色
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255,180,73,1)'
                }, {
                  offset: 1,
                  color: 'rgba(255,180,73,0)'
                }])
              }
            },
          }],


        };
        myChart1_4.setOption(option);
      },
      //常住、流动人口==>弹出层 时间
      permanent_layer_time: function () {
        //初始化日期
        $("#population_layer_input_start").val("");
        $("#population_layer_input_end").val("");

        var population_layer_input_start, population_layer_input_end, populationStartHint, populationEndHint;
        layui.use(['laydate'], function () {
          laydate = layui.laydate,//日期
            // 日期时间选择器
            populationStartHint = laydate.render({
              elem: '#population_layer_input_start',
              min: -60,
              max: -1,
              btns:['clear','confirm']//去掉现在
              // ready: function () {
              //   populationStartHint.hint('日期可选值设定在 <br> 至今100天之前的日期');
              // }
            });
          populationEndHint = laydate.render({
            elem: '#population_layer_input_end',
            min: -60,
            max: -1,
            btns:['clear','confirm']//去掉现在
            // ready: function () {
            //   populationEndHint.hint('日期可选值设定在 <br> 至今100天之前的日期');
            // }
          });
        })
        $("#population_layer_input_btn").on("click", function () {
          population_layer_input_start = $("#population_layer_input_start").val();
          population_layer_input_end = $("#population_layer_input_end").val();
          mobileResidence()
        })
        mobileResidence()
        function mobileResidence() {
          var data = {
            'types': 'day',
            'startTime': population_layer_input_start,
            'endTime': population_layer_input_end
          }
          Frontend.api.Ajax('/Webapi/mobileResidence', data, function (msg) {
            myChart1_5.setOption({
              xAxis: { data: msg.data.time },
              series: [
                { data: msg.data.changzu },
                { data: msg.data.liudong }
              ]
            })
          })
          var myChart1_5 = echarts.init(document.getElementById('cont_1_5_echart'));
          option = {
            title: {
              text: "时间对比变化",
              show: true,
              left: "5%",
              textStyle: {
                fontWeight: '200',
                color: '#f5f4f4',
                fontFamily: 'CNLight',
                fontSize: EchartTable.getDpr() * 1.6,
                textShadowColor: 'rgba(12, 69, 255, 0.9)',
                textBorderWidth: EchartTable.getDpr() * 0.2,
                textShadowBlur: EchartTable.getDpr() * 0.05,
                textShadowOffsetX: EchartTable.getDpr() * 0.2,
                textShadowOffsetY: EchartTable.getDpr() * 0.2,
              },
            },
            grid: {
              top: '35%', //距上边距
              bottom: '10%', //距下边距
            },
            // animationDuration: 5000, //动画缓动效果为5秒
            // animationDelay: 5000, //动画延迟效果为5秒
            // animationDelayUpdate: 5000,
            tooltip: {
              trigger: 'axis',
              textStyle: {
                fontFamily: 'CNLight',
                fontSize: EchartTable.getDpr() * 1.1,
              },
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985',
                  fontSize: EchartTable.getDpr(),
                }
              }
            },
            legend: {
              icon: 'rect', //圆形
              itemHeight: EchartTable.getDpr(), //改变圆圈大小
              itemWidth: EchartTable.getDpr() * 1.5, //改变圆圈大小
              data: ['常住', '流动'],
              type: 'scroll',
              // orient: 'vertical',//竖向排列
              // right: 100,
              // top: 200,
              textStyle: {
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
                color: '#d2d8fc',
              },
              length: EchartTable.getDpr() * 1.5,
              length2: EchartTable.getDpr() * 1.5,
              lineStyle: {
                width: EchartTable.getDpr() * 0.1,
              }
            },
            xAxis: {
              type: 'category', //类目轴
              name: '时间',
              nameGap: EchartTable.getDpr(),
              nameTextStyle: {
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
                color: '#6ea5d7'
              },
              // data: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
              data: [],
              axisTick: { //去掉刻度点
                show: false,
              },
              axisLine: {
                onZero: true
              },
              // x轴的字体样式
              axisLabel: {
                show: true,
                showMinLabel:true,//是否显示最小刻度值
                showMaxLabel:true,//是否显示最大刻度值
                textStyle: {
                  color: '#d2d8fc',
                  fontSize: EchartTable.getDpr(),
                  fontFamily: 'CNLight',
                }
              },
              // x轴的颜色和宽度
              axisLine: {
                lineStyle: {
                  color: '#0dafff',
                  // width: 3, //这里是坐标轴的宽度,可以去掉
                }
              }
            },
            yAxis: {
              type: 'value', //数值轴
              name: '人口总数',
              nameGap: EchartTable.getDpr(),
              nameTextStyle: {
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
                color: '#6ea5d7'
              },
              splitLine: { //去掉网线　　　
                show: false
              },
              axisTick: { //去掉刻度点
                show: false
              },
              // x轴的字体样式
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#d2d8fc',
                  fontSize: EchartTable.getDpr(),
                  fontFamily: 'CNLight',
                },
                formatter: function (value, index) {
                  var value;
                  if (value >= 1000) {
                    value = value / 1000 + 'k';
                  } else if (value < 1000) {
                    value = value;
                  }
                  return value
                }
              },
              // x轴的颜色和宽度
              axisLine: {
                lineStyle: {
                  color: '#0dafff',
                  // width: 3, //这里是坐标轴的宽度,可以去掉
                }
              }
            },
            series: [{
              name: '常住',
              symbol: "none", //去掉网线上的刻度圆点
              // data: [820, 932, 901, 934, 1290, 1330, 1320],
              data: [],
              itemStyle: {
                normal: {
                  color: 'rgba(89,141,255, 1)', //线的颜色
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(89,141,255, 1)'
                  }, {
                    offset: 1,
                    color: 'rgba(89,141,255, 0)'
                  }])
                }
              },
              type: 'line',
              smooth: true,//线的圆润
              labelLine: {
                normal: {
                  show: true
                },
              }

            }, {
              name: '流动',
              symbol: "none", //去掉网线上的刻度圆点
              data: [320, 352, 501, 634, 890, 1030, 1000],
              type: 'line',
              smooth: true, //线的圆润

              itemStyle: {
                normal: {
                  color: 'rgba(255,19,91,1)', //线的颜色
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(255,19,91,1)'
                  }, {
                    offset: 1,
                    color: 'rgba(255,19,91,0)'
                  }])
                }
              },
            }],
          };
          myChart1_5.setOption(option);
        }
      },
      //年龄统计
      ageStatistics: function () {
        Frontend.api.Ajax('/Webapi/ageInfo', null, function (msg) {
          var useName = [];
          for (var i = 0; i < msg.data.length; i++) {
            useName[i] = msg.data[i].name;
          }
          ageStatistics.setOption({
            legend: {
              data: useName
            },
            series: {
              data: msg.data
            }
          })
        })
        var ageStatistics = echarts.init(document.getElementById('ageStatistics'));
        option = {
          // backgroundColor: '#031845',
          title: {
            text: "年龄统计",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}人 ({d}%)",
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            }
          },
          legend: {
            orient: 'horizontal',
            icon: 'rect',
            bottom: '0%',
            x: 'center',
            // data: ['儿童', '少年', '青年', '中年', '老年', '未登记'],
            textStyle: {
              color: '#6ea5d7',
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            itemWidth: EchartTable.getDpr() * 1.5,
            itemHeight: EchartTable.getDpr() * 1,
            itemGap: EchartTable.getDpr()
          },
          series: [{
            name: '人员类型',
            type: 'pie',
            radius: ['20%', '45%'],
            center: ['50%', '55%'],
            // avoidLabelOverlap:false,
            // minShowLabelAngle: 30,
            // stillShowZeroSum: true,
            // hoverAnimation: true,
            color: ['#fdff51', '#51ffa7', '#8eff51', '#ff9351', '#ff5151', '#51bbff'],
            labelLine: {
              normal: {
                show: true,
                length: EchartTable.getDpr() * 3,
                length2: EchartTable.getDpr() * 8,
                lineStyle: {
                  width: EchartTable.getDpr() * 0.1,
                }
              }
            },
            label: {
              normal: {
                formatter: '{c|{c}人}{d|{d}%}\n',
                fontSize: EchartTable.getDpr(),
                padding: [0, -EchartTable.getDpr() * 8],
                rich: {
                  d: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    fontFamily: 'CNLight',
                  },
                  c: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    padding: [0, EchartTable.getDpr(), 0, 0],
                    fontFamily: 'CNLight',
                  }
                }
              }
            },
            // data: [{
            //         value: 100,
            //         name: '儿童'
            //     },
            //     {
            //         value: 100,
            //         name: '少年'
            //     },
            //     {
            //         value: 100,
            //         name: '青年'
            //     },
            //     {
            //         value: 100,
            //         name: '中年'
            //     },
            //     {
            //         value: 100,
            //         name: '老年'
            //     },
            //     {
            //         value: 100,
            //         name: '未登记'
            //     }
            // ]
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        ageStatistics.setOption(option);
      },
      //民族分布
      nationality: function () {
        Frontend.api.Ajax('/Webapi/nationInfo', null, function (msg) {
          //标签
          var Data = msg.data;
          let str = '';
          $.each(Data, function (index, value) {
            str += `<li>
                            <h1>${value.title}</h1>
                            <p>${value.num}人</p>
                        </li>`;
          })
          $(".nation_layer_left").html(str);

          //echart数据
          var num = [];
          for (var i = 0; i < msg.data.length; i++) {
            num[i] = [JSON.parse(msg.data[i].num), msg.data[i].title, msg.data[i].value]
          }
          var useNumber = [];
          var useTitle = [];
          for (var n = 0; n < num.length; n++) {
            useNumber[n] = { 'value': num[n][0], 'title': num[n][1], 'ethnicity': num[n][2] };
            useTitle[n] = num[n][1]
          }
          nationality.setOption({
            xAxis: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })


        })
        var nationality = echarts.init(document.getElementById('nationality'));
        option = {
          title: {
            text: "民族分布",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%' //距下边距
          },
          xAxis: {
            type: 'category',
            name: '民族',
            triggerEvent: true,//开启点击事件
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            splitLine: { //去掉网线　　　
              show: false
            },
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            // data: [120, 200, 150, 80, 70, 110],
            name: '',
            type: 'bar',
            barWidth: "20%", //柱状的宽度
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: ['#0e3ef8', '#0ee5f5', '#0ef291', '#ea0d4c', '#dcee11', '#ed5711'],
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            itemStyle: {
              // color: '#ffb449', //柱条的颜色。
              barBorderRadius: 20, // 统一设置四个角的圆角大小

              //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = [{
                  top: 'rgba(14,62,248,1)', //蓝
                  bottom: 'rgba(14,62,248,0)'
                },
                {
                  top: 'rgba(14,229,245,1)', //亮蓝
                  bottom: 'rgba(14,229,245,0)'
                }, {
                  top: 'rgba(14,242,145,1)', //淡绿
                  bottom: 'rgba(14,242,145,0)'
                },
                {
                  top: 'rgba(234,13,76,1)', //粉红
                  bottom: 'rgba(234,13,76,0)'
                }, {
                  top: 'rgba(220,238,17,1)', //黄
                  bottom: 'rgba(220,238,17,0)'
                },
                {
                  top: 'rgba(237,87,17,1)', //橘黄
                  bottom: 'rgba(237,87,17,0)'
                }
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorList[index].top,
                }, {
                  offset: 1,
                  color: colorList[index].bottom,
                }])
                // globalCoord: false

              },

              // shadowColor: 'rgba(0, 0, 0, 0.5)', //柱条的阴影。
              // shadowBlur: 10, //柱条阴影的宽度。
            }
          }]
        };
        nationality.setOption(option);

        //echart 民族分布列表
        var isclick = true;//防止点击过快
        nationality.on("click", function (params) {

          if (isclick) {
            isclick = false;
            var houseStatis;
            if (params.componentType == "series") {
              houseStatis = params.data.ethnicity;
            } else if (params.componentType == "xAxis") {
              if (params.value == "汉族") {
                houseStatis = '01'
              } else if (params.value == "藏族") {
                houseStatis = '04'
              } else if (params.value == "羌族") {
                houseStatis = '33'
              } else if (params.value == "维吾尔族") {
                houseStatis = '05'
              } else if (params.value == "未登记") {
                houseStatis = '-2'
              } else if (params.value == "其他民族") {
                houseStatis = '02,03,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56'
              }
            }
            //下面添加需要执行的事件

            layui.use(['layer', 'table', 'tableFilter'], function () {

              var layer = layui.layer;//弹层
              var table = layui.table; //表格
              var tableFilter = layui.tableFilter;//过滤器
              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                shade: 0.8,
                skin: 'peopleNumclass', //皮肤
                area: ['36rem', '16.5rem'],
                zIndex: 2000000,
                content: $('#nation_layer'),
                success: function () {
                  var nation_layer_right_input;
                  //初始化搜索
                  $(".nation_layer_right input").val("");
                  nationList(houseStatis, nation_layer_right_input);
                  function nationList(houseStatis, nation_layer_right_input) {
                    let dataNew = {
                      'pageSize': '10',//每页显示的数量
                      'ethnicity': houseStatis,//政治面貌类型
                      'keyword': nation_layer_right_input//搜索框
                    }
                    let params = Frontend.api.getPostParams(dataNew);
                    table.render({
                      elem: '#nation_table',
                      // height: 1050,
                      // width: 3500,
                      url: window.publicUrl+'/Webapi/nationListInfo', //数据接口
                      where: params,
                      method:'post',
                      response: {
                        statusName: 'code', //规定数据状态的字段名称，默认：code
                        statusCode: 200, //规定成功的状态码，默认：0
                        msgName: 'msg', //规定状态信息的字段名称，默认：msg
                        countName: 'count', //规定数据总数的字段名称，默认：count
                        dataName: 'data' //规定数据列表的字段名称，默认：data
                      },
                      parseData: function (res) { //res 即为原始返回的数据
                        return {
                          "code": res.code, //解析接口状态
                          "msg": res.message, //解析提示文本
                          "count": res.count, //解析数据长度
                          "data": res.data //解析数据列表
                        };
                      },
                      page: true, //开启分页
                      limit: 10,
                      cols: [
                        [ //表头
                          {
                            field: 'idIndex', title: '编号', width: '5%', align: 'center', templet: function (e) {
                              let idIndex = e.LAY_INDEX;
                              return idIndex;
                            }
                          },
                          { field: 'ethnicity', width: '6%', title: '民族' },
                          { field: 'household_name', width: '5%', title: '姓名' },
                          { field: 'citizen_id', width: '14%', title: '身份证号' },
                          { field: 'address_town', width: '12%', title: '街道' },
                          { field: 'address_village', width: '15%', title: '社区' },
                          { field: 'community_name', width: '10%', title: '小区' },
                          {
                            field: 'addressinfo', width: '12%', title: '住址', templet: function (e) {
                              let addressinfo = e.building_name + e.unit_name + e.room_name;
                              return addressinfo;
                            }
                          },
                          { field: '', width: '8%', title: '操作', toolbar: '#nation_table_Demo' },
                        ]
                      ],
                      done: function (res) {
                        EchartTable.api.layuiTitle()//layui表格title提示
                      }
                    });

                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                      var apitableFilterIns = tableFilter.render({
                        elem: '#nation_table',
                        mode: 'api',
                        filters: [
                          { field: 'ethnicity', name: 'ethnicity', type: 'checkbox', data: msg.data.nation },
                          { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                          { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                          { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                        ],
                        done: function (filters) {
                          // console.log(filters)
                          nation_layer_right_input = $(".nation_layer_right input").val();
                          table.reload('nation_table', {
                            where: { //设定异步数据接口的额外参数，任意设
                              keyword: nation_layer_right_input,
                            },
                            page: 1
                          })

                          apitableFilterIns.reload()
                          return false;
                        }
                      });


                    });

                  }

                  $("#nation_layer_right_btn").unbind("click").on("click", function () {
                    nation_layer_right_input = $(".nation_layer_right input").val();
                    houseStatis = "";
                    nationList(houseStatis, nation_layer_right_input);
                  })


                }
              })
            })

            //定时器
            setTimeout(function () {
              isclick = true;
            }, 800);
          }
        })
      },
      //外来人口籍贯分布
      externalPopulation: function () {

        Frontend.api.Ajax('/Webapi/populationNative', null, function (msg) {
          //console.log(msg.data)
          var BJData = msg.data;//echart数据
          var DataList = msg.dataList;//列表标签
          // console.log(DataList)
          //标签
          var a = DataList;
          // var a = [{name: "北京", num: "1", value: "北京"},
          //     {name: "新疆", num: "352", value: "新疆"},
          //     {name: "河北", num: "1", value: "河北"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          //     {name: "黑龙江", num: "3", value: "黑龙江"},
          // ];

          //根据数据的长度计算出添加几个li标签；
          var number = a.length;
          var line = Math.ceil(number / 8);//向上取整
          var ul_li = '';
          if (line >= 2) {//大于等于两个li时按钮显示或隐藏
            $(".external_layer_button").show();
          } else {
            $(".external_layer_button").hide();
          }
          for (let i = 0; i < line; i++) {
            ul_li += '<li></li>';
          }
          $(".external_layer_left").html(ul_li);
          //js将一位数组分割成每八个为一组
          var b = [];
          var result = [];
          var k = 0;
          for (let i = 0; i < a.length; ++i) {
            if (i % 8 == 0) {
              b = [];
              for (let j = 0; j < 8; ++j) {
                var aa = a[i + j];
                if (typeof (aa) != 'undefined') {
                  b[j] = a[i + j];
                }
              }
              result[k] = b;
              k++;
            }
          }
          // console.log(result);
          //将每一组的数据添加到每一个li中
          for (let i = 0; i <= result.length; i++) {
            let str = '';
            $.each(result[i], function (index, value) {
              str += ` <p>
                          <span>${value.value}</span>
                          <b>${value.num}人</b>
                      </p>`;
            })
            $(".external_layer_left li:nth-child(" + (i + 1) + ")").html(str);
          }


          //弹层滚动标签
          $("#external_layer_top").Scroll({
            line: 1,
            speed: 500,
            up: "external_layer_button_top",
            down: "external_layer_button_btm"
          });



          var externalPopulation = echarts.init(document.getElementById('externalPopulation'));

          var isclick = true;//防止点击过快
          externalPopulation.on("click", function (params) {
            if (isclick) {
              isclick = false;
              //下面添加需要执行的事件
              if (params.componentType == 'series' && params.componentSubType == 'map') {
                var nativeInfo = params.name;
                layui.use(['layer', 'table', 'tableFilter'], function () {
                  var layer = layui.layer;//弹层
                  var table = layui.table; //表格
                  var tableFilter = layui.tableFilter;//过滤器
                  layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'peopleNumclass', //皮肤
                    area: ['36rem', '16.5rem'],
                    zIndex: 2000000,
                    content: $('#external_layer'),
                    success: function () {
                      var external_layer_right_input;
                      //初始化搜索
                      $(".external_layer_right input").val("");
                      externalList(nativeInfo, external_layer_right_input);
                      function externalList(nativeInfo, external_layer_right_input) {
                        let dataNew = {
                          'pageSize': '10',//每页显示的数量
                          'nativeInfo': nativeInfo,//政治面貌类型
                          'keyword': external_layer_right_input//搜索框
                        }
                        let params = Frontend.api.getPostParams(dataNew);
                        table.render({
                          elem: '#external_table',
                          // height: 1050,
                          // width: 3500,
                          url: window.publicUrl+'/Webapi/populationNativeList', //数据接口
                          where: params,
                          method:'post',
                          response: {
                            statusName: 'code', //规定数据状态的字段名称，默认：code
                            statusCode: 200, //规定成功的状态码，默认：0
                            msgName: 'msg', //规定状态信息的字段名称，默认：msg
                            countName: 'count', //规定数据总数的字段名称，默认：count
                            dataName: 'data' //规定数据列表的字段名称，默认：data
                          },
                          parseData: function (res) { //res 即为原始返回的数据
                            return {
                              "code": res.code, //解析接口状态
                              "msg": res.message, //解析提示文本
                              "count": res.count, //解析数据长度
                              "data": res.data //解析数据列表
                            };
                          },
                          page: true, //开启分页
                          limit: 10,
                          cols: [
                            [ //表头
                              {
                                field: 'idIndex', title: '编号', width: '3%', align: 'center', templet: function (e) {
                                  let idIndex = e.LAY_INDEX;
                                  return idIndex;
                                }
                              },
                              { field: 'residentialAddress', width: '8%', title: '籍贯' },
                              { field: 'household_name', width: '5%', title: '姓名' },
                              { field: 'citizen_id', width: '15%', title: '身份证号' },
                              { field: 'address_town', width: '12%', title: '街道' },
                              { field: 'address_village', width: '12%', title: '社区' },
                              { field: 'community_name', width: '12%', title: '小区' },
                              {
                                field: 'addressinfo', width: '12%', title: '住址', templet: function (e) {
                                  let addressinfo = e.building_name + e.unit_name + e.room_name;
                                  return addressinfo;
                                }
                              },
                              { field: '', width: '8%', title: '操作', toolbar: '#external_table_Demo' },
                            ]
                          ],
                          done: function (res) {
                            EchartTable.api.layuiTitle()//layui表格title提示
                          }
                        });
                        Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                          var apitableFilterIns = tableFilter.render({
                            elem: '#external_table',
                            mode: 'api',
                            filters: [
                              { field: 'residentialAddress', name: 'nativeInfo', type: 'checkbox', data: msg.data.residentialAddress },
                              { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                              { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                              { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                            ],
                            done: function (filters) {
                              // console.log(filters)
                              external_layer_right_input = $(".focusAreas_layer_right input").val();
                              table.reload('external_table', {
                                where: { //设定异步数据接口的额外参数，任意设
                                  keyword: external_layer_right_input,
                                },
                                page: 1
                              })
                              apitableFilterIns.reload()
                              return false;
                            }
                          });
                        });
                      }
                      $("#external_layer_right_btn").unbind("click").on("click", function () {
                        external_layer_right_input = $(".external_layer_right input").val();
                        nativeInfo = "";
                        externalList(nativeInfo, external_layer_right_input);
                      })
                    }
                  })
                })
              }
              //定时器
              setTimeout(function () {
                isclick = true;
              }, 800);
            }
          })
          var geoCoordMap = {
            '新疆': [86.61, 40.79],
            '西藏': [89.13, 30.66],
            '黑龙江': [128.34, 47.05],
            '吉林': [126.32, 43.38],
            '辽宁': [123.42, 41.29],
            '内蒙古': [112.17, 42.81],
            '北京': [116.40, 40.40],
            '宁夏': [106.27, 36.76],
            '山西': [111.95, 37.65],
            '河北': [115.21, 38.44],
            '天津': [117.04, 39.52],
            '青海': [97.07, 35.62],
            '甘肃': [103.82, 36.05],
            '山东': [118.01, 36.37],
            '陕西': [108.94, 34.46],
            '河南': [113.46, 34.25],
            '安徽': [117.28, 31.86],
            '江苏': [120.26, 32.54],
            '上海': [121.46, 31.28],
            '四川': [103.36, 30.65],
            '湖北': [112.29, 30.98],
            '浙江': [120.15, 29.28],
            '重庆': [107.51, 29.63],
            '湖南': [112.08, 27.79],
            '江西': [115.89, 27.97],
            '贵州': [106.91, 26.67],
            '福建': [118.31, 26.07],
            '云南': [101.71, 24.84],
            '台湾': [121.01, 23.54],
            '广西': [108.67, 23.68],
            '广东': [113.98, 22.82],
            '海南': [110.03, 19.33],
            '澳门': [113.54, 22.19],
            '香港': [114.17, 22.32],
          };

          // var BJData = [
          // [{ name: '北京', value: 140 }, { name: '北京' }],
          // [{ name: '上海', value: 20 }, { name: '北京' }],
          // [{ name: '广州', value: 10 }, { name: '北京' }],
          // [{ name: '大连', value: 40 }, { name: '北京' }],
          // [{ name: '青岛', value: 20 }, { name: '北京' }],
          // [{ name: '南昌', value: 10 }, { name: '北京' }],
          // [{ name: '合肥', value: 160 }, { name: '北京' }],


          // [{ name: '天津', value: 30 }, { name: '北京' }],
          // [{ name: '石家庄', value: 20 }, { name: '北京' }],
          // [{ name: '保定', value: 20 }, { name: '北京' }],
          // [{ name: '呼和浩特', value: 20 }, { name: '北京' }],
          // [{ name: '宿州', value: 10 }, { name: '北京' }],
          // [{ name: '曲阜', value: 10 }, { name: '北京' }],
          // [{ name: '杭州', value: 20 }, { name: '北京' }],
          // [{ name: '武汉', value: 20 }, { name: '北京' }],
          // [{ name: '深圳', value: 10 }, { name: '北京' }],
          // [{ name: '珠海', value: 10 }, { name: '北京' }],
          // [{ name: '福州', value: 20 }, { name: '北京' }],
          // [{ name: '西安', value: 60 }, { name: '北京' }],
          // [{ name: '贵阳', value: 10 }, { name: '北京' }],
          // [{ name: '长春', value: 10 }, { name: '北京' }],
          // [{ name: '哈尔滨', value: 10 }, { name: '北京' }],
          // [{ name: '黔南', value: 20 }, { name: '北京' }],
          // [{ name: '重庆', value: 20 }, { name: '北京' }],
          // [{ name: '赣州', value: 10 }, { name: '北京' }]
          // ];

          // var convertData = function (data) {

          //   var res = [];
          //   for (var i = 0; i < data.length; i++) {
          //     var dataItem = data[i];
          //     var fromCoord = geoCoordMap[dataItem[0].name];//开始地区坐标
          //     var toCoord = geoCoordMap[dataItem[1].name];//结束地区坐标
          //     if (fromCoord && toCoord) {
          //       res.push({
          //         fromName: dataItem[0].name,
          //         num: dataItem[0].num,
          //         toName: dataItem[1].name,
          //         coords: [fromCoord, toCoord],
          //       });
          //     }
          //   }
          //   return res;
          // };
          var series = [];
          [['北京', BJData]].forEach(function (item, i) {
            series.push({
              type: 'map',
              map: 'china',
              zoom: 1.2,
              zlevel: 2,
              label: {//地区名字
                show: false
              },
              emphasis: {//滑过区域显示地区名字
                label: {
                  show: false,
                },
              },
              itemStyle: {
                normal: {
                  areaColor: '#3280ae',
                  // borderWidth: '1',//设置外层边框
                  borderColor: '#043c5d',
                  shadowColor: '#043c5d',
                  // shadowBlur: 1,
                  opacity: 1,
                },
                emphasis: {
                  areaColor: '#3280ae',//高亮状态下的样式
                  opacity: 0.6
                },
              },
              tooltip: {
                fontFamily: 'CNLight',
                formatter: " ",
                borderWidth: 0,
                backgroundColor: 'rgba(50,50,50,0)'
              },
              roam: false,//是否开启鼠标缩放和平移漫游。
            }, {
              type: 'effectScatter',//地区原点
              coordinateSystem: 'geo',
              zlevel: 100,
              // silent: false,//图形是否不响应和触发鼠标事件
              tooltip: {
                trigger: 'item',
                textStyle: {
                  fontFamily: 'CNLight',
                  fontSize: EchartTable.getDpr() * 1.1,
                },
                formatter: function (params) {
                  var Data = params.data;
                  var res = Data.name + '：' + Data.value[2] + '人';
                  return res;
                },
              },
              rippleEffect: {
                brushType: 'stroke',
                scale: 4, //波纹圆环最大限制，值越大波纹越大
                period: 4, //动画时间，值越小速度越快
              },
              label: {
                normal: {
                  show: true,//显示地区名
                  position: 'right',
                  formatter: '{b}',
                  fontSize: EchartTable.getDpr() * 0.7, //字体的大小
                  color: '#fff',
                  fontFamily: 'CNLight',
                },
              },
              symbolSize: function (val) {
                return EchartTable.getDpr() * 0.4; //原点大小
              },
              itemStyle: {
                normal: {
                  color: function (params) { //原点的颜色
                    var colorList = ['#ffee33', '#36d7ff', '#ffaf3d', '#f22472 ', '#1cf9ea', '#00d800', '#9069ff', '#f9601c', '#98ff33', '#3fef92', '#ff48fd', '#00d800', '#ff3312', '#36ff97', '#48ff73', '#62ffa1', '#e648ff', '#ff54c5', '#ff834c', '#48afff', '#ffee33', '#f9601c', '#ff4889', '#62ffa1', '#ff54c5', '#1059ff', '#62ffa1', '#62d8ff', '#f22472', '#ff834c', '#31ffd1', '#ffd133', '#ff3312'];
                    return colorList[params.dataIndex]
                  },
                  fontFamily: 'CNLight',
                },

              },
              data: item[1].map(function (dataItem) {
                // console.log(dataItem)
                return {
                  name: dataItem[0].name,
                  value: geoCoordMap[dataItem[0].name].concat([dataItem[0].num])
                };
              }),

            });
          });
          option = {
            //backgroundColor: 'rgba(128, 128, 128, 0)',//echart整体加颜色
            title: {
              text: "外来人口籍贯分布",
              show: true,
              // left: 20,
              textStyle: {
                fontWeight: '200',
                color: '#f5f4f4',
                fontFamily: 'CNLight',
                fontSize: EchartTable.getDpr() * 1.6,
                textShadowColor: 'rgba(12, 69, 255, 0.9)',
                textBorderWidth: EchartTable.getDpr() * 0.2,
                textShadowBlur: EchartTable.getDpr() * 0.05,
                textShadowOffsetX: EchartTable.getDpr() * 0.2,
                textShadowOffsetY: EchartTable.getDpr() * 0.2,
              },
            },
            grid: {
              top: '25%' //距上边距
            },
            tooltip: {
              trigger: 'item',//全局
              fontFamily: 'CNLight',
            },
            geo: {
              map: 'china',
              label: {
                emphasis: {
                  show: false, //滑过区域显示地区名字
                  color: '#fff',
                  fontFamily: 'CNLight',
                },
              },
              zoom: 1.2,
              roam: false,//是否开启鼠标缩放和平移漫游。
              itemStyle: {
                normal: {
                  areaColor: '#01022a',
                  // borderWidth: 3,//设置外层边框
                  borderWidth: EchartTable.getDpr() * 0.16,//设置外层边框
                  borderColor: '#18f2f9',
                  shadowColor: '#01022a',
                  fontFamily: 'CNLight',
                  // shadowBlur: 5,
                  // shadowOffsetX:-10,
                  // shadowOffsetY:10,
                  shadowBlur: EchartTable.getDpr() * 0.5,
                  shadowOffsetX: -EchartTable.getDpr() * 0.8,
                  shadowOffsetY: EchartTable.getDpr() * 0.8
                },
                emphasis: {
                  areaColor: '#006eaf',//高亮状态下的样式
                },
              }
            },
            series: series
          };

          externalPopulation.setOption(option);

        })

      },
      //户籍统计
      houseStatistics: function () {
        Frontend.api.Ajax('/Webapi/nationalityInfo', null, function (msg) {
          //标签
          var Data = msg.data;
          let str = '';
          $.each(Data, function (index, value) {
            str += `<li>
                          <h1>${value.name}</h1>
                          <p>${value.num}人</p>
                      </li>`;
          })
          $(".houseStatistics_layer_left").html(str);
          //echart数据
          var num = [];
          for (var i = 0; i < msg.data.length; i++) {
            num[i] = [JSON.parse(msg.data[i].num), msg.data[i].name, msg.data[i].value]
          }
          var useNumber = [];
          var useTitle = [];
          for (var n = 0; n < num.length; n++) {
            useNumber[n] = { 'value': num[n][0], 'title': num[n][1], 'areaStatus': num[n][2] };
            useTitle[n] = num[n][1];
          }
          houseStatistics.setOption({
            xAxis: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })
        })

        var houseStatistics = echarts.init(document.getElementById('houseStatistics'));
        option = {
          title: {
            text: "户籍统计",
            show: true,
            // left: 20,
            // top: 0,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%' //距下边距
          },
          xAxis: {
            type: 'category',
            name: '户籍',
            nameGap: EchartTable.getDpr(),
            triggerEvent: true,//开启点击事件
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            // x轴的字体样式
            axisLabel: {
              show: true,
              interval: 0,//横轴信息全部显示
              // rotate:-10,//-30度角倾斜显示
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            splitLine: { //去掉网线　　　
              show: false
            },
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            // data: [120, 200, 150, 80, 70, 110],
            name: '',
            type: 'bar',
            barWidth: '20%', //柱状的宽度
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: ['#0e3ef8', '#0ee5f5', '#0ef291', '#ea0d4c', '#dcee11', '#ed5711'],
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            itemStyle: {
              // color: '#ffb449', //柱条的颜色。
              barBorderRadius: 20, // 统一设置四个角的圆角大小

              //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = [{
                  top: 'rgba(14,62,248,1)', //蓝
                  bottom: 'rgba(14,62,248,0)'
                },
                {
                  top: 'rgba(14,229,245,1)', //亮蓝
                  bottom: 'rgba(14,229,245,0)'
                }, {
                  top: 'rgba(14,242,145,1)', //淡绿
                  bottom: 'rgba(14,242,145,0)'
                },
                {
                  top: 'rgba(234,13,76,1)', //粉红
                  bottom: 'rgba(234,13,76,0)'
                }, {
                  top: 'rgba(220,238,17,1)', //黄
                  bottom: 'rgba(220,238,17,0)'
                },
                {
                  top: 'rgba(237,87,17,1)', //橘黄
                  bottom: 'rgba(237,87,17,0)'
                }
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorList[index].top,
                }, {
                  offset: 1,
                  color: colorList[index].bottom,
                }])
                // globalCoord: false

              },

              // shadowColor: 'rgba(0, 0, 0, 0.5)', //柱条的阴影。
              // shadowBlur: 10, //柱条阴影的宽度。
            }
          }]
        };
        houseStatistics.setOption(option);

        //echart 户籍统计列表
        var isclick = true;//防止点击过快
        houseStatistics.on("click", function (params) {
          if (isclick) {
            isclick = false;
            var houseStatis;
            if (params.componentType == "series") {
              houseStatis = params.data.areaStatus;
            } else if (params.componentType == "xAxis") {
              if (params.value == "本市") {
                houseStatis = '22'
              } else if (params.value == "本区") {
                houseStatis = '24'
              } else if (params.value == "身份证未登记") {
                houseStatis = '9'
              } else if (params.value == "外埠") {
                houseStatis = '23'
              }
            }
            //下面添加需要执行的事件
            layui.use(['layer', 'table', 'tableFilter'], function () {
              var layer = layui.layer;//弹层
              var table = layui.table; //表格
              var tableFilter = layui.tableFilter;//过滤器
              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                shade: 0.8,
                skin: 'peopleNumclass', //皮肤
                area: ['36rem', '16.5rem'],
                zIndex: 2000000,
                content: $('#houseStatistics_layer'),
                success: function () {
                  //初始化搜索
                  $(".houseStatistics_layer_right input").val("");

                  var houseStatistics_layer_right_input;
                  houseStatisticsList(houseStatis, houseStatistics_layer_right_input);
                  function houseStatisticsList(houseStatis, houseStatistics_layer_right_input) {
                    let dataNew = {
                      'pageSize': '10',//每页显示的数量
                      'areaStatus': houseStatis,//政治面貌类型
                      'keyword': houseStatistics_layer_right_input,//搜索框
                    }
                    let params = Frontend.api.getPostParams(dataNew);
                    table.render({
                      elem: '#houseStatistics_table',
                      // height: 1050,
                      // width: 3500,
                      url: window.publicUrl+'/Webapi/nationalityListInfo', //数据接口
                      where: params,
                      method:'post',
                      response: {
                        statusName: 'code', //规定数据状态的字段名称，默认：code
                        statusCode: 200, //规定成功的状态码，默认：0
                        msgName: 'msg', //规定状态信息的字段名称，默认：msg
                        countName: 'count', //规定数据总数的字段名称，默认：count
                        dataName: 'data' //规定数据列表的字段名称，默认：data
                      },
                      parseData: function (res) { //res 即为原始返回的数据
                        return {
                          "code": res.code, //解析接口状态
                          "msg": res.message, //解析提示文本
                          "count": res.count, //解析数据长度
                          "data": res.data //解析数据列表
                        };
                      },
                      page: true, //开启分页
                      limit: 10,
                      cols: [
                        [ //表头
                          {
                            field: 'idIndex', title: '编号', width: '5%', align: 'center', templet: function (e) {
                              let idIndex = e.LAY_INDEX;
                              return idIndex;
                            }
                          },
                          { field: 'areaInfoStatus', width: '6%', title: '户籍' },
                          { field: 'household_name', width: '5%', title: '姓名' },
                          { field: 'citizen_id', width: '14%', title: '身份证号' },
                          { field: 'address_town', width: '12%', title: '街道' },
                          { field: 'address_village', width: '15%', title: '社区' },
                          { field: 'community_name', width: '10%', title: '小区' },
                          {
                            field: 'addressinfo', width: '12%', title: '住址', templet: function (e) {
                              let addressinfo = e.building_name + e.unit_name + e.room_name;
                              return addressinfo;
                            }
                          },
                          { field: '', width: '8%', title: '操作', toolbar: '#houseStatistics_table_Demo' },
                        ]
                      ],
                      done: function (res) {
                        EchartTable.api.layuiTitle()//layui表格title提示
                      }
                    });
                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                      var apitableFilterIns = tableFilter.render({
                        elem: '#houseStatistics_table',
                        mode: 'api',
                        filters: [
                          { field: 'areaInfoStatus', name: 'areaStatus', type: 'checkbox', data: msg.data.areaInfoStatus },
                          { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                          { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                          { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                        ],

                        done: function (filters) {
                          houseStatistics_layer_right_input = $(".houseStatistics_layer_right input").val();
                          table.reload('houseStatistics_table', {
                            where: { //设定异步数据接口的额外参数，任意设
                              keyword: houseStatistics_layer_right_input,
                            },
                            page: 1
                          })

                          apitableFilterIns.reload()
                          return false;
                        }
                      });
                    });
                  }
                  $("#houseStatistics_layer_right_btn").unbind("click").on("click", function () {
                    houseStatistics_layer_right_input = $(".houseStatistics_layer_right input").val();
                    houseStatis = "";
                    houseStatisticsList(houseStatis, houseStatistics_layer_right_input);
                  })
                }
              })
            })
            //定时器
            setTimeout(function () {
              isclick = true;
            }, 800);
          }
        })

      },
      //人口占比
      peopleProporion: function () {
        Frontend.api.Ajax('/Webapi/liveInfo', null, function (msg) {
          var useName = [];
          for (var i = 0; i < msg.data.length; i++) {
            useName[i] = msg.data[i].name;
          }
          peopleProporion.setOption({
            legend: {
              data: useName
            },
            series: {
              data: msg.data
            }
          })
        })
        var peopleProporion = echarts.init(document.getElementById('peopleProporion'));
        option = {
          // backgroundColor: '#031845',
          title: {
            text: "人口占比",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.5,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}人 ({d}%)",
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            }
          },

          legend: {
            orient: 'horizontal',
            icon: 'rect',
            bottom: 0,
            x: 'center',
            // data: ['常住人口', '流动人口', '身份证未登记'],
            textStyle: {
              color: '#6ea5d7',
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            itemWidth: EchartTable.getDpr() * 1.5,
            itemHeight: EchartTable.getDpr() * 1,
            itemGap: EchartTable.getDpr()
          },
          series: [{
            name: '人员类型',
            type: 'pie',
            radius: ['20%', '45%'],
            center: ['50%', '55%'],
            // avoidLabelOverlap: false,
            // hoverAnimation: true,
            color: ['#51ffa7', '#fdff51', '#ff5151'],
            labelLine: {
              normal: {
                show: true,
                length: EchartTable.getDpr() * 3,
                length2: EchartTable.getDpr() * 8,
                lineStyle: {
                  width: EchartTable.getDpr() * 0.1,
                }
              }
            },
            label: {
              normal: {
                formatter: '{c|{c}人}{d|{d}%}\n',
                fontSize: EchartTable.getDpr(),
                padding: [0, -EchartTable.getDpr() * 8],
                rich: {
                  d: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    fontFamily: 'CNLight',
                  },
                  c: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    padding: [0, EchartTable.getDpr(), 0, 0],
                    fontFamily: 'CNLight',
                  }
                }
              }
            },
            // data: [{
            //         value: 100,
            //         name: '儿童'
            //     },
            //     {
            //         value: 100,
            //         name: '少年'
            //     },
            //     {
            //         value: 100,
            //         name: '青年'
            //     },
            //     {
            //         value: 100,
            //         name: '中年'
            //     },
            //     {
            //         value: 100,
            //         name: '老年'
            //     },
            //     {
            //         value: 100,
            //         name: '未登记'
            //     }
            // ]
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        peopleProporion.setOption(option);
      },
      //政治面貌
      politicsStatus: function () {
        Frontend.api.Ajax('/Webapi/politicsInfo', null, function (msg) {
          //标签
          var Data = msg.data;
          let str = '';
          $.each(Data, function (index, value) {
            str += `<li>
                          <h1>${value.title}</h1>
                          <p>${value.num}人</p>
                      </li>`;
          })
          $(".politics_layer_left").html(str);

          //echart数据
          var num = [];
          for (var i = 0; i < msg.data.length; i++) {
            num[i] = [JSON.parse(msg.data[i].num), msg.data[i].title, msg.data[i].value]
          }
          var useNumber = [];
          var useTitle = [];
          for (var n = 0; n < num.length; n++) {
            useNumber[n] = { 'value': num[n][0], 'title': num[n][1], 'politicsStatis': num[n][2] };
            useTitle[n] = num[n][1];
          }
          politicsStatus.setOption({
            xAxis: { data: useTitle },
            series: { data: useNumber }
          })
        })

        var politicsStatus = echarts.init(document.getElementById('politicsStatus'));
        option = {
          title: {
            text: "政治面貌",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%',//距上边距
            bottom: '10%' //距上边距
          },
          xAxis: {
            type: 'category',
            name: '面貌',
            nameGap: EchartTable.getDpr(),
            triggerEvent: true,//开启点击事件
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            // x轴的字体样式
            axisLabel: {
              show: true,
              interval: 0,//横轴信息全部显示
              rotate: -10,//-30度角倾斜显示
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            splitLine: { //去掉网线　　　
              show: false
            },
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            // data: [120, 200, 150, 80, 70, 110],
            name: '',
            type: 'bar',
            barWidth: "20%", //柱状的宽度
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: ['#0e3ef8', '#0ee5f5', '#0ef291', '#ea0d4c', '#dcee11', '#ed5711'],
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            itemStyle: {
              // color: '#ffb449', //柱条的颜色。
              barBorderRadius: 20, // 统一设置四个角的圆角大小

              //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = [{
                  top: 'rgba(14,62,248,1)', //蓝
                  bottom: 'rgba(14,62,248,0)'
                },
                {
                  top: 'rgba(14,229,245,1)', //亮蓝
                  bottom: 'rgba(14,229,245,0)'
                }, {
                  top: 'rgba(14,242,145,1)', //淡绿
                  bottom: 'rgba(14,242,145,0)'
                },
                {
                  top: 'rgba(234,13,76,1)', //粉红
                  bottom: 'rgba(234,13,76,0)'
                }, {
                  top: 'rgba(220,238,17,1)', //黄
                  bottom: 'rgba(220,238,17,0)'
                },
                {
                  top: 'rgba(237,87,17,1)', //橘黄
                  bottom: 'rgba(237,87,17,0)'
                }
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorList[index].top,
                }, {
                  offset: 1,
                  color: colorList[index].bottom,
                }])
                // globalCoord: false

              },

              // shadowColor: 'rgba(0, 0, 0, 0.5)', //柱条的阴影。
              // shadowBlur: 10, //柱条阴影的宽度。
            }
          }]
        };
        politicsStatus.clear()
        politicsStatus.setOption(option);

        //echart 政治面貌列表
        var isclick = true;//防止点击过快
        politicsStatus.on("click", function (params) {
          if (isclick) {
            isclick = false;
            var politicsStatis;

            //下面添加需要执行的事件
            if (params.componentType == "series") {
              politicsStatis = params.data.politicsStatis;
            } else if (params.componentType == "xAxis") {
              if (params.value == "中共党员") {
                politicsStatis = '1'
              } else if (params.value == "社区直属党员") {
                politicsStatis = '2'
              } else if (params.value == "党员双报到") {
                politicsStatis = '3'
              } else if (params.value == "共青团员") {
                politicsStatis = '4'
              } else if (params.value == "群众") {
                politicsStatis = '5'
              } else if (params.value == "其他党派") {
                politicsStatis = '6'
              } else if (params.value == "未登记") {
                politicsStatis = '7'
              }
            }
            layui.use(['layer', 'table', 'tableFilter'], function () {
              var layer = layui.layer;//弹层
              var table = layui.table; //表格
              var tableFilter = layui.tableFilter;//过滤器
              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                shade: 0.8,
                skin: 'peopleNumclass', //皮肤
                area: ['36rem', '16.5rem'],
                zIndex: 2000000,
                content: $('#politics_layer'),
                success: function () {
                  var politics_layer_right_input;
                  //初始化搜索
                  $(".politics_layer_right input").val("");
                  politicsList(politicsStatis, politics_layer_right_input);
                  function politicsList(politicsStatis, politics_layer_right_input) {
                    let dataNew = {
                      'pageSize': '10',//每页显示的数量
                      'politicsStatis': politicsStatis,//政治面貌类型
                      'keyword': politics_layer_right_input//搜索框
                    }
                    let params = Frontend.api.getPostParams(dataNew);
                    table.render({
                      elem: '#politics_table',
                      // height: 1050,
                      // width: 3500,
                      url: window.publicUrl+'/Webapi/politicsListInfo', //数据接口
                      where: params,
                      method:'post',
                      response: {
                        statusName: 'code', //规定数据状态的字段名称，默认：code
                        statusCode: 200, //规定成功的状态码，默认：0
                        msgName: 'msg', //规定状态信息的字段名称，默认：msg
                        countName: 'count', //规定数据总数的字段名称，默认：count
                        dataName: 'data' //规定数据列表的字段名称，默认：data
                      },
                      parseData: function (res) { //res 即为原始返回的数据
                        return {
                          "code": res.code, //解析接口状态
                          "msg": res.message, //解析提示文本
                          "count": res.count, //解析数据长度
                          "data": res.data //解析数据列表
                        };
                      },
                      page: true, //开启分页
                      limit: 10,
                      cols: [
                        [ //表头
                          {
                            field: 'idIndex', title: '编号', width: '5%', align: 'center', templet: function (e) {
                              let idIndex = e.LAY_INDEX;
                              return idIndex;
                            }
                          },
                          { field: 'politicsInfoStatus', width: '8%', title: '政治面貌' },
                          { field: 'household_name', width: '5%', title: '姓名' },
                          { field: 'citizen_id', width: '14%', title: '身份证号' },
                          { field: 'address_town', width: '12%', title: '街道' },
                          { field: 'address_village', width: '15%', title: '社区' },
                          { field: 'community_name', width: '10%', title: '小区' },
                          {
                            field: 'addressinfo', width: '12%', title: '住址', templet: function (e) {
                              let addressinfo = e.building_name + e.unit_name + e.room_name;
                              return addressinfo;
                            }
                          },
                          { field: '', width: '7%', title: '操作', toolbar: '#politics_table_Demo' },
                        ]
                      ],
                      done: function (res) {
                        EchartTable.api.layuiTitle()//layui表格title提示
                      }
                    });
                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                      var apitableFilterIns = tableFilter.render({
                        elem: '#politics_table',
                        mode: 'api',
                        filters: [
                          { field: 'politicsInfoStatus', name: 'politicsStatis', type: 'checkbox', data: msg.data.politicsInfoStatus },
                          { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                          { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                          { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                        ],
                        done: function (filters) {
                          // console.log(filters)
                          politics_layer_right_input = $(".politics_layer_right input").val();
                          table.reload('politics_table', {
                            where: { //设定异步数据接口的额外参数，任意设
                              keyword: politics_layer_right_input,
                            },
                            page: 1
                          })

                          apitableFilterIns.reload()
                          return false;
                        }
                      });
                    });
                  }
                  $("#politics_layer_right_btn").unbind("click").on("click", function () {
                    politics_layer_right_input = $(".politics_layer_right input").val();
                    politicsStatis = "";
                    politicsList(politicsStatis, politics_layer_right_input);
                  })
                }
              })
            })
            //定时器
            setTimeout(function () {
              isclick = true;
            }, 800);
          }
        })

      },
      //特殊人群
      specialCrowd: function () {
        Frontend.api.Ajax('/Webapi/specialInfo', null, function (msg) {
          //标签
          var Data = msg.data;
          let str = '';
          $.each(Data, function (index, value) {
            str += `<li>
                          <h1>${value.name}</h1>
                          <p>${value.num}人</p>
                      </li>`;
          })
          $(".special_layer_left").html(str);
          //echart数据
          var num = [];
          for (var i = 0; i < msg.data.length; i++) {
            num[i] = [JSON.parse(msg.data[i].num), msg.data[i].name, msg.data[i].value]
          }
          var useNumber = [];
          var useTitle = [];
          for (var n = 0; n < num.length; n++) {
            useNumber[n] = { 'value': num[n][0], 'name': num[n][1], 'labelInfo': num[n][2] };
            useTitle[n] = num[n][1];
          }
          specialCrowd.setOption({
            legend: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })
        })
        var specialCrowd = echarts.init(document.getElementById('specialCrowd'));
        option = {
          // backgroundColor: '#031845',
          title: {
            text: "特殊人群",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%' //距上边距
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}人 ({d}%)",
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            }
          },
          legend: {
            orient: 'horizontal',
            icon: 'rect',
            bottom: 0,
            x: 'center',
            // data: ['儿童', '少年', '青年', '中年', '老年', '未登记'],
            textStyle: {
              color: '#6ea5d7',
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            itemWidth: EchartTable.getDpr() * 1.5,
            itemHeight: EchartTable.getDpr() * 1,
            itemGap: EchartTable.getDpr()
          },

          series: [{
            name: '特殊人群',
            type: 'pie',
            radius: ['20%', '45%'],
            center: ['50%', '55%'],
            // minAngle:10,
            // minShowLabelAngle:30,
            // hoverAnimation: true,
            color: ['#ff5151', '#26aaff', '#ff9351', '#8eff51', '#51ffa7', '#fdff51'],
            labelLine: {
              normal: {
                show: true,
                length: EchartTable.getDpr() * 2,
                length2: EchartTable.getDpr() * 6,
                lineStyle: {
                  width: EchartTable.getDpr() * 0.1,
                }
              }
            },
            label: {
              normal: {
                formatter: '{c|{c}人}{d|{d}%}\n',
                fontSize: EchartTable.getDpr(),
                padding: [0, -EchartTable.getDpr() * 6],
                rich: {
                  d: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    fontFamily: 'CNLight',
                  },
                  c: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    padding: [0, EchartTable.getDpr(), 0, 0],
                    fontFamily: 'CNLight',
                  }
                }
              }
            },
            // data: [{
            //         value: 100,
            //         name: '儿童'
            //     },
            //     {
            //         value: 100,
            //         name: '少年'
            //     },
            //     {
            //         value: 100,
            //         name: '青年'
            //     },
            //     {
            //         value: 100,
            //         name: '中年'
            //     },
            //     {
            //         value: 100,
            //         name: '老年'
            //     },
            //     {
            //         value: 100,
            //         name: '未登记'
            //     }
            // ]
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        specialCrowd.setOption(option);
        //列表
        var isclick = true;//防止点击过快
        specialCrowd.on("click", function (params) {
          if (isclick) {
            isclick = false;
            //下面添加需要执行的事件
            var labelInfo = params.data.labelInfo;
            layui.use(['layer', 'table', 'tableFilter'], function () {
              var layer = layui.layer;//弹层
              var table = layui.table; //表格
              var tableFilter = layui.tableFilter;//过滤器
              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                shade: 0.8,
                skin: 'peopleNumclass', //皮肤
                area: ['36rem', '16.5rem'],
                zIndex: 2000000,
                content: $('#special_layer'),
                success: function () {
                  var special_layer_right_input;
                  //初始化搜索
                  $(".special_layer_right input").val("");
                  special(labelInfo, special_layer_right_input);
                  function special(labelInfo, special_layer_right_input) {
                    let dataNew = {
                      'pageSize': '10',//每页显示的数量
                      'labelInfo': labelInfo,//政治面貌类型
                      'keyword': special_layer_right_input//搜索框
                    }
                    let params = Frontend.api.getPostParams(dataNew);
                    table.render({
                      elem: '#special_table',
                      // height: 1050,
                      // width: 3500,
                      url: window.publicUrl+'/Webapi/specialListInfo', //数据接口
                      where: params,
                      method:'post',
                      response: {
                        statusName: 'code', //规定数据状态的字段名称，默认：code
                        statusCode: 200, //规定成功的状态码，默认：0
                        msgName: 'msg', //规定状态信息的字段名称，默认：msg
                        countName: 'count', //规定数据总数的字段名称，默认：count
                        dataName: 'data' //规定数据列表的字段名称，默认：data
                      },
                      parseData: function (res) { //res 即为原始返回的数据
                        return {
                          "code": res.code, //解析接口状态
                          "msg": res.message, //解析提示文本
                          "count": res.count, //解析数据长度
                          "data": res.data //解析数据列表
                        };
                      },
                      page: true, //开启分页
                      limit: 10,
                      cols: [
                        [ //表头
                          {
                            field: 'idIndex', title: '编号', width: '3%', align: 'center', templet: function (e) {
                              let idIndex = e.LAY_INDEX;
                              return idIndex;
                            }
                          },
                          { field: 'labelNameInfo', width: '8%', title: '特殊人群' },
                          { field: 'name', width: '5%', title: '姓名' },
                          { field: 'citizen_id', width: '14%', title: '身份证号' },
                          { field: 'address_town', width: '12%', title: '街道' },
                          { field: 'address_village', width: '12%', title: '社区' },
                          { field: 'community_name', width: '10%', title: '小区' },
                          { field: 'addressinfo', width: '15%', title: '住址' },
                          { field: '', width: '8%', title: '操作', toolbar: '#special_table_Demo' },
                        ]
                      ],
                      done: function (res) {
                        EchartTable.api.layuiTitle()//layui表格title提示
                      }
                    });
                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                      var apitableFilterIns = tableFilter.render({
                        elem: '#special_table',
                        mode: 'api',
                        filters: [
                          { field: 'labelNameInfo', name: 'labelInfo', type: 'checkbox', data: msg.data.label_name_types },
                          { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                          { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                          { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                        ],
                        done: function (filters) {
                          // console.log(filters)
                          special_layer_right_input = $(".special_layer_right input").val();
                          table.reload('special_table', {
                            where: { //设定异步数据接口的额外参数，任意设
                              keyword: special_layer_right_input,
                            },
                            page: 1
                          })
                          apitableFilterIns.reload()
                          return false;
                        }
                      });
                    });
                  }
                  $("#special_layer_right_btn").unbind("click").on("click", function () {
                    special_layer_right_input = $(".special_layer_right input").val();
                    labelInfo = "";
                    special(labelInfo, special_layer_right_input);
                  })
                }
              })
            })
            //定时器
            setTimeout(function () {
              isclick = true;
            }, 800);
          }
        })

      },
      //婚姻状况
      maritalStatus: function () {
        Frontend.api.Ajax('/Webapi/marriageInfo', null, function (msg) {
          var useNumber = [];
          var useTitle = [];
          for (var i = 0; i < msg.data.length; i++) {
            useNumber[i] = msg.data[i].num;
            useTitle[i] = msg.data[i].title;
          }
          maritalStatus.setOption({
            xAxis: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })
        })

        var maritalStatus = echarts.init(document.getElementById('maritalStatus'));
        option = {
          title: {
            text: "婚姻状况",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: Controller.getDpr() * 1.1,
            },
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#6a7985',
                fontSize: Controller.getDpr(),
              }
            }
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%', //距下边距
            right: "15%",
          },
          xAxis: {
            type: 'category',
            name: '婚姻状况',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            splitLine: { //去掉网线　　　
              show: false
            },
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            // data: [120, 200, 150, 80, 70, 110],
            name: '',
            type: 'bar',
            barWidth: "20%", //柱状的宽度
            fontFamily: 'CNLight',
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: ['#0e3ef8', '#0ee5f5', '#0ef291', '#ea0d4c', '#dcee11', '#ed5711'],
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            itemStyle: {
              // color: '#ffb449', //柱条的颜色。
              barBorderRadius: 20, // 统一设置四个角的圆角大小

              //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = [{
                  top: 'rgba(14,62,248,1)', //蓝
                  bottom: 'rgba(14,62,248,0)'
                },
                {
                  top: 'rgba(14,229,245,1)', //亮蓝
                  bottom: 'rgba(14,229,245,0)'
                }, {
                  top: 'rgba(14,242,145,1)', //淡绿
                  bottom: 'rgba(14,242,145,0)'
                },
                {
                  top: 'rgba(234,13,76,1)', //粉红
                  bottom: 'rgba(234,13,76,0)'
                }, {
                  top: 'rgba(220,238,17,1)', //黄
                  bottom: 'rgba(220,238,17,0)'
                },
                {
                  top: 'rgba(237,87,17,1)', //橘黄
                  bottom: 'rgba(237,87,17,0)'
                }
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorList[index].top,
                }, {
                  offset: 1,
                  color: colorList[index].bottom,
                }])
                // globalCoord: false

              },

              // shadowColor: 'rgba(0, 0, 0, 0.5)', //柱条的阴影。
              // shadowBlur: 10, //柱条阴影的宽度。
            }
          }]
        };
        maritalStatus.setOption(option);
      },
      //学历统计
      degreeStatistics: function () {
        Frontend.api.Ajax('/Webapi/educationInfo', null, function (msg) {
          var useName = [];
          for (var i = 0; i < msg.data.length; i++) {
            useName[i] = msg.data[i].name;
          }
          degreeStatistics.setOption({
            legend: {
              data: useName
            },
            series: {
              data: msg.data
            }
          })
        })
        var degreeStatistics = echarts.init(document.getElementById('degreeStatistics'));
        option = {
          // backgroundColor: '#031845',
          title: {
            text: "学历统计",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%' //距上边距
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}人 ({d}%)",
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            }
          },
          legend: {
            orient: 'horizontal',
            icon: 'rect',
            bottom: 0,
            x: 'center',
            // data: ['儿童', '少年', '青年', '中年', '老年', '未登记'],
            textStyle: {
              color: '#6ea5d7',
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            itemWidth: EchartTable.getDpr() * 1.5,
            itemHeight: EchartTable.getDpr() * 1,
            itemGap: EchartTable.getDpr()
          },
          series: [{
            name: '人员类型',
            type: 'pie',
            radius: ['20%', '45%'],
            center: ['50%', '55%'],
            // avoidLabelOverlap:false,
            // hoverAnimation: true,
            color: ['#9251ff', '#ff5151', '#ffb751', '#51bbff', '#8eff51', '#fdff51', '#51ffa7'],
            labelLine: {
              normal: {
                show: true,
                length: EchartTable.getDpr() * 2,
                length2: EchartTable.getDpr() * 8,
                lineStyle: {
                  width: EchartTable.getDpr() * 0.1,
                }
              }
            },
            label: {
              normal: {
                formatter: '{c|{c}人}{d|{d}%}\n',
                fontSize: EchartTable.getDpr(),
                padding: [0, -EchartTable.getDpr() * 8],
                textStyle: {
                  color: "#fff"
                },
                rich: {
                  d: {
                    fontSize: EchartTable.getDpr(),
                    fontFamily: 'CNLight',
                    color: '#fff'
                  },
                  c: {
                    fontSize: EchartTable.getDpr(),
                    fontFamily: 'CNLight',
                    color: '#fff',
                    padding: [0, EchartTable.getDpr(), 0, 0],
                  }
                }
              }
            },
            // data: [{
            //         value: 100,
            //         name: '儿童'
            //     },
            //     {
            //         value: 100,
            //         name: '少年' 
            //     },
            //     {
            //         value: 100,
            //         name: '青年'
            //     },
            //     {
            //         value: 100,
            //         name: '中年'
            //     },
            //     {
            //         value: 100,
            //         name: '老年'
            //     },
            //     {
            //         value: 100,
            //         name: '未登记'
            //     }
            // ]
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        degreeStatistics.setOption(option);
      },
      //从业状况
      workConditions: function () {
        Frontend.api.Ajax('/Webapi/practitionersInfo', null, function (msg) {
          //标签
          var Data = msg.data;
          let str = '';
          $.each(Data, function (index, value) {
            str += `<li>
                          <h1>${value.title}</h1>
                          <p>${value.num}人</p>
                      </li>`;
          })
          $(".take_layer_left").html(str);
          //echart数据
          var num = [];
          for (var i = 0; i < msg.data.length; i++) {
            num[i] = [JSON.parse(msg.data[i].num), msg.data[i].title, msg.data[i].value]
          }
          var useNumber = [];
          var useTitle = [];
          for (var n = 0; n < num.length; n++) {
            useNumber[n] = { 'value': num[n][0], 'title': num[n][1], 'professionStatus': num[n][2] };
            useTitle[n] = num[n][1];
          }
          workConditions.setOption({
            xAxis: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })
        })

        var workConditions = echarts.init(document.getElementById('workConditions'));
        option = {
          title: {
            text: "从业状况",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%', //距下边距
            right: '15%' //距下边距
          },
          xAxis: {
            type: 'category',
            name: '从业状况',
            nameGap: EchartTable.getDpr(),
            triggerEvent: true,//开启点击事件
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            splitLine: { //去掉网线　　　
              show: false
            },
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            // data: [120, 200, 150, 80, 70, 110],
            name: '',
            type: 'bar',
            barWidth: "20%", //柱状的宽度
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: ['#0e3ef8', '#0ee5f5', '#0ef291', '#ea0d4c', '#dcee11', '#ed5711'],
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            itemStyle: {
              // color: '#ffb449', //柱条的颜色。
              barBorderRadius: 20, // 统一设置四个角的圆角大小

              //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = [{
                  top: 'rgba(14,62,248,1)', //蓝
                  bottom: 'rgba(14,62,248,0)'
                },
                {
                  top: 'rgba(14,229,245,1)', //亮蓝
                  bottom: 'rgba(14,229,245,0)'
                }, {
                  top: 'rgba(14,242,145,1)', //淡绿
                  bottom: 'rgba(14,242,145,0)'
                },
                {
                  top: 'rgba(234,13,76,1)', //粉红
                  bottom: 'rgba(234,13,76,0)'
                }, {
                  top: 'rgba(220,238,17,1)', //黄
                  bottom: 'rgba(220,238,17,0)'
                },
                {
                  top: 'rgba(237,87,17,1)', //橘黄
                  bottom: 'rgba(237,87,17,0)'
                }
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorList[index].top,
                }, {
                  offset: 1,
                  color: colorList[index].bottom,
                }])
                // globalCoord: false

              },

              // shadowColor: 'rgba(0, 0, 0, 0.5)', //柱条的阴影。
              // shadowBlur: 10, //柱条阴影的宽度。
            }
          }]
        };
        workConditions.setOption(option);
        //echart 从业状况列表
        var isclick = true;//防止点击过快
        workConditions.on("click", function (params) {
          if (isclick) {
            isclick = false;
            //下面添加需要执行的事件
            var houseStatis;
            if (params.componentType == "series") {
              houseStatis = params.data.professionStatus;
            } else if (params.componentType == "xAxis") {
              if (params.value == "在职") {
                houseStatis = '11,13,17,21,24,37,51,54,27'
              } else if (params.value == "待业") {
                houseStatis = '70'
              } else if (params.value == "退休") {
                houseStatis = '80'
              } else if (params.value == "学生") {
                houseStatis = '31'
              } else if (params.value == "其他") {
                houseStatis = '90'
              } else if (params.value == "未登记") {
                houseStatis = '-2'
              }
            }

            layui.use(['layer', 'table', 'tableFilter'], function () {
              var layer = layui.layer;//弹层
              var table = layui.table; //表格
              var tableFilter = layui.tableFilter;//过滤器
              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                shade: 0.8,
                skin: 'peopleNumclass', //皮肤
                area: ['36rem', '16.5rem'],
                zIndex: 2000000,
                content: $('#take_layer'),
                success: function () {
                  var take_layer_right_input = "";
                  //初始化搜索
                  takeList(houseStatis, take_layer_right_input);
                  function takeList(houseStatis, take_layer_right_input) {
                    let dataNew = {
                      'pageSize': '10',//每页显示的数量
                      'professionStatus': houseStatis,//政治面貌类型
                      'keyword': take_layer_right_input//搜索框
                    }
                    let params = Frontend.api.getPostParams(dataNew);
                    table.render({
                      elem: '#take_table',
                      // height: 1050,
                      // width: 3500,
                      url: window.publicUrl+'/Webapi/practitionersListInfo', //数据接口
                      where: params,
                      method:'post',
                      response: {
                        statusName: 'code', //规定数据状态的字段名称，默认：code
                        statusCode: 200, //规定成功的状态码，默认：0
                        msgName: 'msg', //规定状态信息的字段名称，默认：msg
                        countName: 'count', //规定数据总数的字段名称，默认：count
                        dataName: 'data' //规定数据列表的字段名称，默认：data
                      },
                      parseData: function (res) { //res 即为原始返回的数据
                        return {
                          "code": res.code, //解析接口状态
                          "msg": res.message, //解析提示文本
                          "count": res.count, //解析数据长度
                          "data": res.data //解析数据列表
                        };
                      },
                      page: true, //开启分页
                      limit: 10,
                      cols: [
                        [ //表头
                          {
                            field: 'idIndex', title: '编号', width: '3%', align: 'center', templet: function (e) {
                              let idIndex = e.LAY_INDEX;
                              return idIndex;
                            }
                          },
                          { field: 'profession_code_status', width: '8%', title: '从业状况' },
                          { field: 'household_name', width: '5%', title: '姓名' },
                          { field: 'citizen_id', width: '14%', title: '身份证号' },
                          { field: 'address_town', width: '12%', title: '街道' },
                          { field: 'address_village', width: '15%', title: '社区' },
                          { field: 'community_name', width: '10%', title: '小区' },
                          {
                            field: 'addressinfo', width: '12%', title: '住址', templet: function (e) {
                              let addressinfo = e.building_name + e.unit_name + e.room_name;
                              return addressinfo;
                            }
                          },
                          { field: '', width: '8%', title: '操作', toolbar: '#take_table_Demo' },
                        ]
                      ],
                      done: function (res) {
                        EchartTable.api.layuiTitle()//layui表格title提示
                      }
                    });

                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                      var apitableFilterIns = tableFilter.render({
                        elem: '#take_table',
                        mode: 'api',
                        filters: [
                          { field: 'profession_code_status', name: 'professionStatus', type: 'checkbox', data: msg.data.profession_code_status },
                          { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                          { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                          { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                        ],
                        done: function (filters) {
                          take_layer_right_input = $(".take_layer_right input").val();
                          table.reload('take_table', {
                            where: { //设定异步数据接口的额外参数，任意设
                              keyword: take_layer_right_input,
                            },
                            page: 1
                          })

                          apitableFilterIns.reload()
                          return false;
                        }
                      });
                    });
                  }
                  $("#take_layer_right_btn").unbind("click").on("click", function () {
                    take_layer_right_input = $(".take_layer_right input").val();//获取搜索值
                    houseStatis = "";//类型清空
                    takeList(houseStatis, take_layer_right_input);
                  })
                },end:function(){
                  $(".take_layer_right input").val("")
                }
              })
            })
            //定时器
            setTimeout(function () {
              isclick = true;
            }, 800);
          }
        })
      },
      //个人户籍状态
      householdStatus: function () {
        Frontend.api.Ajax('/Webapi/userNationalityInfo', null, function (msg) {
          var useNumber = [];
          var useTitle = [];
          for (var i = 0; i < msg.data.length; i++) {
            useNumber[i] = msg.data[i].value;
            useTitle[i] = msg.data[i].name;
          }
          householdStatus.setOption({
            xAxis: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })
        })

        var householdStatus = echarts.init(document.getElementById('householdStatus'));
        option = {
          title: {
            text: "个人户籍状态",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%', //距下边距
            right: '15%'
          },
          xAxis: {
            type: 'category',
            name: '户籍状态',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7'
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            // x轴的字体样式
            axisLabel: {
              show: true,
              interval: 0,//横轴信息全部显示
              // rotate:-10,//-30度角倾斜显示
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '人口总数',
            nameGap: EchartTable.getDpr(),
            splitLine: { //去掉网线　　　
              show: false
            },
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            // data: [120, 200, 150, 80, 70, 110],
            name: '',
            type: 'bar',
            barWidth: '20%', //柱状的宽度
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: ['#0e3ef8', '#0ee5f5', '#0ef291', '#ea0d4c', '#dcee11', '#ed5711'],
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            itemStyle: {
              // color: '#ffb449', //柱条的颜色。
              barBorderRadius: 20, // 统一设置四个角的圆角大小

              //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = [{
                  top: 'rgba(14,62,248,1)', //蓝
                  bottom: 'rgba(14,62,248,0)'
                },
                {
                  top: 'rgba(14,229,245,1)', //亮蓝
                  bottom: 'rgba(14,229,245,0)'
                }, {
                  top: 'rgba(14,242,145,1)', //淡绿
                  bottom: 'rgba(14,242,145,0)'
                },
                {
                  top: 'rgba(234,13,76,1)', //粉红
                  bottom: 'rgba(234,13,76,0)'
                }, {
                  top: 'rgba(220,238,17,1)', //黄
                  bottom: 'rgba(220,238,17,0)'
                },
                {
                  top: 'rgba(237,87,17,1)', //橘黄
                  bottom: 'rgba(237,87,17,0)'
                }
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorList[index].top,
                }, {
                  offset: 1,
                  color: colorList[index].bottom,
                }])
                // globalCoord: false

              },

              // shadowColor: 'rgba(0, 0, 0, 0.5)', //柱条的阴影。
              // shadowBlur: 10, //柱条阴影的宽度。
            }
          }]
        };
        householdStatus.setOption(option);
      },
      //房屋占比
      housesAccounted: function () {
        $(".houseProportion_layer_left").html('');
        Frontend.api.Ajax('/Webapi/roomInfos', null, function (msg) {
          //标签
          var Data = msg.data;
          let str = '';
          $.each(Data.inner, function (index, value) {
            str += `<li>
                           <h1>${value.name}</h1>
                           <p>${value.num}间</p>
                       </li>`;
          })
          $.each(Data.outer, function (index, value) {
            str += `<li>
                           <h1>${value.name}</h1>
                           <p>${value.num}间</p>
                       </li>`;
          })
          $(".houseProportion_layer_left").append(str);
          //echart数据
          var num = [];
          var numinner = [];
          for (var i = 0; i < msg.data.outer.length; i++) {
            num[i] = [JSON.parse(msg.data.outer[i].num), msg.data.outer[i].name, msg.data.outer[i].value]
          }
          
          var useNumber = [];
          var useTitle = [];
          for (var n = 0; n < num.length; n++) {
            useNumber[n] = { 'value': num[n][0], 'name': num[n][1], 'roomInfo': num[n][2] };
            useTitle[n] = num[n][1];
          }

          for (var i = 0; i < msg.data.inner.length; i++) {
            numinner[i] = [JSON.parse(msg.data.inner[i].num), msg.data.inner[i].name, msg.data.inner[i].value]
          }
          
          var useNumberinner = [];
          for (var n = 0; n < numinner.length; n++) {
            useNumberinner[n] = { 'value': numinner[n][0], 'name': numinner[n][1], 'roomInfo': numinner[n][2] };
            
          }
          housesAccounted.setOption({
            legend: {
              data: useTitle
            },
            series:[{
              data: useNumber,
            },{
              data: useNumberinner,
            }] 
          })
        })
        var housesAccounted = echarts.init(document.getElementById('housesAccounted'));
        option = {
          // backgroundColor: '#031845',
          title: {
            text: "房屋占比",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%' //距上边距
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            }
          },
          legend: {
            orient: 'horizontal',
            icon: 'rect',
            bottom: 0,
            x: 'center',
            // data: ['儿童', '少年', '青年', '中年', '老年', '未登记'],
            textStyle: {
              color: '#6ea5d7',
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            itemWidth: EchartTable.getDpr() * 1.5,
            itemHeight: EchartTable.getDpr() * 1,
            itemGap: EchartTable.getDpr()
          },
          series: [{
            name: '房屋类型',
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['45%', '65%'],
            // hoverAnimation: true,
            color: ['#51ffa7', '#fdff51', '#ff5151','#9e9e9e'],
            labelLine: {
              normal: {
                show: true,
                length: EchartTable.getDpr() * 4,
                length2: EchartTable.getDpr() * 8,
                lineStyle: {
                  width: EchartTable.getDpr() * 0.1,
                }
              }
            },
            label: {
              normal: {
                formatter: '{c|{c}间}{d|{d}%}\n',
                fontSize: EchartTable.getDpr(),
                padding: [0, -EchartTable.getDpr() * 8],
                rich: {
                  d: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    fontFamily: 'CNLight',
                  },
                  c: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    padding: [0, EchartTable.getDpr(), 0, 0],
                    fontFamily: 'CNLight',
                  }
                }
              }
            },
            // data: [{
            //         value: 100,
            //         name: '儿童'
            //     },
            //     {
            //         value: 100,
            //         name: '少年'
            //     },
            //     {
            //         value: 100,
            //         name: '青年'
            //     },
            //     {
            //         value: 100,
            //         name: '中年'
            //     },
            //     {
            //         value: 100,
            //         name: '老年'
            //     },
            //     {
            //         value: 100,
            //         name: '未登记'
            //     }
            // ]
          },{
            name: '房屋类型',
            type: 'pie',
            radius: [0, '30%'],
            color: ["#2ec7c9", "#b6a2de", "#5ab1ef"],
            center: ['50%', '55%'],
            label: {
                normal: {
                    position: 'inner',
                    fontSize: EchartTable.getDpr(),
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:  [
              // {
              //     value: 679,
              //     name: '群租'
              // },
              // {
              //     value: 6991,
              //     name: '非群租'
              // }
            ]
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        housesAccounted.setOption(option);
        //echart 列表
        var isclick = true;//防止点击过快
        housesAccounted.on("click", function (params) {
          if (isclick) {
            isclick = false;
            //下面添加需要执行的事件
            var houseStatis = params.data.roomInfo;
            layui.use(['layer', 'table', 'tableFilter'], function () {
              var layer = layui.layer;//弹层
              var table = layui.table; //表格
              var tableFilter = layui.tableFilter;//过滤器
              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                shade: 0.8,
                skin: 'peopleNumclass', //皮肤
                area: ['36rem', '16.5rem'],
                zIndex: 2000000,
                content: $('#houseProportion_layer'),
                success: function () {
                  var houseProportion_layer_right_input;
                  //初始化搜索
                  $(".houseProportion_layer_right input").val("");
                  houseProportionList(houseStatis, houseProportion_layer_right_input);
                  function houseProportionList(houseStatis, houseProportion_layer_right_input) {
                    let dataNew = {
                      'pageSize': '10',//每页显示的数量
                      'roomInfo': houseStatis,//类型
                      'keyword': houseProportion_layer_right_input//搜索框
                    }
                    let params = Frontend.api.getPostParams(dataNew);
                    table.render({
                      elem: '#houseProportion_table',
                      // height: 1050,
                      // width: 3500,
                      url: window.publicUrl+'/Webapi/roomListInfo', //数据接口
                      where: params,
                      method:'post',
                      response: {
                        statusName: 'code', //规定数据状态的字段名称，默认：code
                        statusCode: 200, //规定成功的状态码，默认：0
                        msgName: 'msg', //规定状态信息的字段名称，默认：msg
                        countName: 'count', //规定数据总数的字段名称，默认：count
                        dataName: 'data' //规定数据列表的字段名称，默认：data
                      },
                      parseData: function (res) { //res 即为原始返回的数据
                        return {
                          "code": res.code, //解析接口状态
                          "msg": res.message, //解析提示文本
                          "count": res.count, //解析数据长度
                          "data": res.data //解析数据列表
                        };
                      },
                      page: true, //开启分页
                      limit: 10,
                      cols: [
                        [ //表头
                          {
                            field: 'idIndex', title: '编号', width: '5%', align: 'center', templet: function (e) {
                              let idIndex = e.LAY_INDEX;
                              return idIndex;
                            }
                          },
                          { field: 'room_use_status', width: '8%', title: '房屋类型' },
                          { field: 'address_town', width: '10%', title: '街道' },
                          { field: 'address_village', width: '14%', title: '社区' },
                          { field: 'community_name', width: '10%', title: '小区' },
                          {
                            field: 'addressinfo', width: '12%', title: '房屋住址', templet: function (e) {
                              let addressinfo = e.building_name + e.unit_name + e.room_name;
                              return addressinfo;
                            }
                          },
                          { field: '', width: '8%', title: '操作', toolbar: '#houseProportion_table_Demo' },
                        ]
                      ],
                      done: function (res) {
                        EchartTable.api.layuiTitle()//layui表格title提示
                      }
                    });
                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                      var apitableFilterIns = tableFilter.render({
                        elem: '#houseProportion_table',
                        mode: 'api',
                        filters: [
                          { field: 'room_use_status', name: 'roomInfo', type: 'checkbox', data: msg.data.room_use_status },
                          { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                          { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                          { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                        ],
                        done: function (filters) {
                          // console.log(filters)
                          houseProportion_layer_right_input = $(".houseProportion_layer_right input").val();
                          table.reload('houseProportion_table', {
                            where: { //设定异步数据接口的额外参数，任意设
                              keyword: houseProportion_layer_right_input,
                            },
                            page: 1
                          })

                          apitableFilterIns.reload()
                          return false;
                        }
                      });
                    });
                  }
                  $("#houseProportion_layer_right_btn").unbind("click").on("click", function () {
                    houseProportion_layer_right_input = $(".houseProportion_layer_right input").val();
                    houseStatis = "";
                    houseProportionList(houseStatis, houseProportion_layer_right_input);
                  })
                }
              })
            })
            //定时器
            setTimeout(function () {
              isclick = true;
            }, 800);
          }
        })

      },
      //出租房总趋势
      rentalHousing: function () {
        Frontend.api.Ajax('/Webapi/roomLeaseInfo', null, function (msg) {
          rentalHousing.setOption({
            xAxis: { data: msg.data.time },
            series: [
              { data: msg.data.cuzu }
            ]
          })


        })

        var rentalHousing = echarts.init(document.getElementById('rentalHousing'));
        option = {
          // backgroundColor: '#00265f',
          title: {
            text: "出租房总趋势",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%' //距下边距
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            },
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#6a7985',
                fontSize: EchartTable.getDpr(),
              }
            }
          },
          legend: {
            // data: ['常住', '流动'],
            // align: 'right',
            right: '25%',
            top: '3%',
            textStyle: {
              color: "#d2d8fc",
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            // itemWidth: 40,
            // itemHeight: 20,
            // itemGap: 35
          },
          xAxis: [{
            name: '日期',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            type: 'category',
            // data: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
            axisLine: {
              // show: true,
              lineStyle: {
                color: "#0dafff",
                // width: 3,
                type: "solid"
              }
            },
            // axisTick: {
            //   show: false,
            // },
            axisLabel: {
              show: true,
              interval: 0,//横轴信息全部显示
              // rotate:-10,//-30度角倾斜显示
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
          }],
          yAxis: [{
            type: 'value',
            name: '房屋总数',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // axisTick: {
            //   show: false, //是否显示坐标轴刻度
            // },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#00c7ff",
                // width: 3,
                type: "solid"
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            splitLine: {
              show: false, //去掉网线
              lineStyle: {
                color: "#063374",
              }
            }
          }],
          series: [{
            type: 'bar',
            // data: [820, 932, 901, 934, 1290, 1330, 1320],
            barWidth: "20%", //柱子宽度
            // barGap: "20%", //柱子之间间距
            itemStyle: {
              normal: {
                barBorderRadius: 30, // 统一设置四个角的圆角大小
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0,140,255,1)'
                }, {
                  offset: 1,
                  color: 'rgba(0,140,255,0)'
                }]),
                opacity: 1,
              }
            },
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: 'rgba(0,140,255,1)',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
          }]
        };
        rentalHousing.setOption(option)
      },
      //群租房近5周趋势
      rentGroupInfo: function () {
        Frontend.api.Ajax('/Webapi/rentGroupInfo', null, function (msg) {
          rentGroupInfo.setOption({
            xAxis: { data: msg.data.time },
            series: [
              { data: msg.data.rentGroup }
            ]
          })


        })

        var rentGroupInfo = echarts.init(document.getElementById('rentGroupInfo'));
        option = {
          // backgroundColor: '#00265f',
          title: {
            text: "群租房近5周趋势",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%' //距下边距
          },
          legend: {
            // data: ['常住', '流动'],
            // align: 'right',
            right: '25%',
            top: '3%',
            textStyle: {
              color: "#d2d8fc",
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            // itemWidth: 40,
            // itemHeight: 20,
            // itemGap: 35
          },
          xAxis: [{
            name: '日期',
            triggerEvent: true,//开启点击事件
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            type: 'category',
            // data: ['02-20', '02-21', '02-22', '02-23', '02-24', '02-25', '02-26'],
            axisLine: {
              // show: true,
              lineStyle: {
                color: "#0dafff",
                // width: 3,
                type: "solid"
              }
            },
            // axisTick: {
            //   show: false,
            // },
            axisLabel: {
              show: true,
              interval: 0,//横轴信息全部显示
              // rotate:-10,//-30度角倾斜显示
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
          }],
          yAxis: [{
            type: 'value',
            name: '房屋总数',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(), //人口总数的字体大小
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // axisTick: {
            //   show: false, //是否显示坐标轴刻度
            // },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#00c7ff",
                // width: 3,
                type: "solid"
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            splitLine: {
              show: false, //去掉网线
              lineStyle: {
                color: "#063374",
              }
            }
          }],
          series: [{
            type: 'bar',
            // data: [820, 932, 901, 934, 1290, 1330, 1320],
            barWidth: "20%", //柱子宽度
            // barGap: "20%", //柱子之间间距
            itemStyle: {
              normal: {
                barBorderRadius: 30, // 统一设置四个角的圆角大小
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0,140,255,1)'
                }, {
                  offset: 1,
                  color: 'rgba(0,140,255,0)'
                }]),
                opacity: 1,
              }
            },
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: 'rgba(0,140,255,1)',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
          }]
        };
        rentGroupInfo.setOption(option)
        //echart 列表
        var isclick = true;//防止点击过快
        rentGroupInfo.on("click", function (params) {
          
          if (isclick) {
            isclick = false;
            //下面添加需要执行的事件
            var houseStatis;
            if (params.componentType == "series") {
              houseStatis = params.name;
            } else if (params.componentType == "xAxis") {
              houseStatis = params.value;
            }
            layui.use(['layer', 'table', 'tableFilter'], function () {
              var layer = layui.layer;//弹层
              var table = layui.table; //表格
              var tableFilter = layui.tableFilter;//过滤器
              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                shade: 0.8,
                skin: 'peopleNumclass', //皮肤
                area: ['36rem', '16.5rem'],
                zIndex: 2000000,
                content: $('#houseProportion_layer'),
                success: function () {
                  $(".houseProportion_layer_left").hide();
                  $(".houseProportion_layer_title").html("群租房统计")
                  var houseProportion_layer_right_input;
                  //初始化搜索
                  $(".houseProportion_layer_right input").val("");
                  houseProportionList(houseStatis, houseProportion_layer_right_input);
                  function houseProportionList(houseStatis, houseProportion_layer_right_input) {
                    let dataNew = {
                      'pageSize': '10',//每页显示的数量
                      'timeInfo': houseStatis,//类型
                      'keyword': houseProportion_layer_right_input//搜索框
                    }
                    let params = Frontend.api.getPostParams(dataNew);
                    table.render({
                      elem: '#houseProportion_table',
                      // height: 1050,
                      // width: 3500,
                      url: window.publicUrl+'/Webapi/rentGroupInfoList', //数据接口
                      where: params,
                      method:'post',
                      response: {
                        statusName: 'code', //规定数据状态的字段名称，默认：code
                        statusCode: 200, //规定成功的状态码，默认：0
                        msgName: 'msg', //规定状态信息的字段名称，默认：msg
                        countName: 'count', //规定数据总数的字段名称，默认：count
                        dataName: 'data' //规定数据列表的字段名称，默认：data
                      },
                      parseData: function (res) { //res 即为原始返回的数据
                        return {
                          "code": res.code, //解析接口状态
                          "msg": res.message, //解析提示文本
                          "count": res.count, //解析数据长度
                          "data": res.data //解析数据列表
                        };
                      },
                      page: true, //开启分页
                      limit: 10,
                      cols: [
                        [ //表头
                          {
                            field: 'idIndex', title: '编号', width: '5%', align: 'center', templet: function (e) {
                              let idIndex = e.LAY_INDEX;
                              return idIndex;
                            }
                          },
                          // { field: 'room_use_status', width: '8%', title: '房屋类型' },
                          { field: 'address_town', width: '18%', title: '街道' },
                          { field: 'address_village', width: '14%', title: '社区' },
                          { field: 'community_name', width: '10%', title: '小区' },
                          {
                            field: 'addressinfo', width: '12%', title: '房屋住址', templet: function (e) {
                              let addressinfo = e.building_name + e.unit_name + e.room_name;
                              return addressinfo;
                            }
                          },
                          { field: '', width: '8%', title: '操作', toolbar: '#houseProportion_table_Demo' },
                        ]
                      ],
                      done: function (res) {
                        Controller.api.layuiTitle()//layui表格title提示
                      }
                    });
                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                      var apitableFilterIns = tableFilter.render({
                        elem: '#houseProportion_table',
                        mode: 'api',
                        filters: [
                          // { field: 'room_use_status', name: 'roomInfo', type: 'checkbox', data: msg.data.room_use_status },
                          { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                          { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                          { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                        ],
                        done: function (filters) {
                          // console.log(filters)
                          houseProportion_layer_right_input = $(".houseProportion_layer_right input").val();
                          table.reload('houseProportion_table', {
                            where: { //设定异步数据接口的额外参数，任意设
                              keyword: houseProportion_layer_right_input,
                            },
                            page: 1
                          })

                          apitableFilterIns.reload()
                          return false;
                        }
                      });
                    });
                  }
                  $("#houseProportion_layer_right_btn").unbind("click").on("click", function () {
                    houseProportion_layer_right_input = $(".houseProportion_layer_right input").val();
                    houseProportionList(houseStatis, houseProportion_layer_right_input);
                  })
                },
                end: function () {
                  $('.houseProportion_layer_left').show();
                  $(".houseProportion_layer_title").html("房屋占比统计")
                }
              })
            })
            //定时器
            setTimeout(function () {
              isclick = true;
            }, 800);
          }
        })
      },
      //房屋用途
      houseUsage: function () {
        Frontend.api.Ajax('/Webapi/roomPurposeInfo', null, function (msg) {
          var useNumber = [];
          var useTitle = [];
          for (var i = 0; i < msg.data.length; i++) {
            useNumber[i] = msg.data[i].num;
            useTitle[i] = msg.data[i].title;
          }
          houseUsage.setOption({
            xAxis: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })
        })

        var houseUsage = echarts.init(document.getElementById('houseUsage'));
        option = {
          title: {
            text: "房屋用途",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%', //距上边距
            bottom: '10%', //距下边距
            right: "15%"
          },
          xAxis: {
            type: 'category',
            name: '房屋用途',
            nameGap: EchartTable.getDpr(),
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            // x轴的字体样式
            axisLabel: {
              show: true,
              interval: 0,//横轴信息全部显示
              // rotate:-10,//-30度角倾斜显示
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '房屋总数',
            nameGap: EchartTable.getDpr(),
            splitLine: { //去掉网线　　　
              show: false
            },
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#6ea5d7',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              },
              formatter: function (value, index) {
                var value;
                if (value >= 1000) {
                  value = value / 1000 + 'k';
                } else if (value < 1000) {
                  value = value;
                }
                return value
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          series: [{
            // data: [120, 200, 150, 80, 70, 110],
            name: '',
            type: 'bar',
            barWidth: "20%", //柱状的宽度
            label: {
              normal: {
                show: true, //开启柱体指示值
                position: 'top', //位置
                color: ['#0e3ef8', '#0ee5f5', '#0ef291', '#ea0d4c', '#dcee11', '#ed5711'],
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            itemStyle: {
              // color: '#ffb449', //柱条的颜色。
              barBorderRadius: 20, // 统一设置四个角的圆角大小

              //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = [{
                  top: 'rgba(14,62,248,1)', //蓝
                  bottom: 'rgba(14,62,248,0)'
                },
                {
                  top: 'rgba(14,229,245,1)', //亮蓝
                  bottom: 'rgba(14,229,245,0)'
                }, {
                  top: 'rgba(14,242,145,1)', //淡绿
                  bottom: 'rgba(14,242,145,0)'
                },
                {
                  top: 'rgba(234,13,76,1)', //粉红
                  bottom: 'rgba(234,13,76,0)'
                }, {
                  top: 'rgba(220,238,17,1)', //黄
                  bottom: 'rgba(220,238,17,0)'
                },
                {
                  top: 'rgba(237,87,17,1)', //橘黄
                  bottom: 'rgba(237,87,17,0)'
                }
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: colorList[index].top,
                }, {
                  offset: 1,
                  color: colorList[index].bottom,
                }])
                // globalCoord: false

              },

              // shadowColor: 'rgba(0, 0, 0, 0.5)', //柱条的阴影。
              // shadowBlur: 10, //柱条阴影的宽度。
            }
          }]
        };
        houseUsage.setOption(option);
      },
      //房屋性质
      houseNature: function () {
        Frontend.api.Ajax('/Webapi/roomNatureInfo', null, function (msg) {
          var num = [];
          for (var i = 0; i < msg.data.length; i++) {
            num[i] = [JSON.parse(msg.data[i].num), msg.data[i].groupname, msg.data[i].title]
          }
          var useNumber = [];
          var useTitle = [];
          for (var n = 0; n < num.length; n++) {
            useNumber[n] = { 'value': num[n][0], 'name': num[n][1] };
            useTitle[n] = num[n][1];
          }

          houseNature.setOption({
            legend: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })
        })
        var houseNature = echarts.init(document.getElementById('houseNature'));
        option = {
          // backgroundColor: '#031845',
          title: {
            text: "房屋性质",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%' //距上边距
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}间 ({d}%)",
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            }
          },
          legend: {
            orient: 'horizontal',
            icon: 'rect',
            bottom: 0,
            x: 'center',
            // data: ['儿童', '少年', '青年', '中年', '老年', '未登记'],
            textStyle: {
              color: '#6ea5d7',
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            itemWidth: EchartTable.getDpr() * 1.5,
            itemHeight: EchartTable.getDpr() * 1,
            itemGap: EchartTable.getDpr()
          },
          series: [{
            name: '房屋类型',
            type: 'pie',
            radius: ['20%', '45%'],
            center: ['50%', '55%'],
            // hoverAnimation: true,
            color: ['#fdff51', '#51ffa7', '#8eff51', '#ff9351', '#ff5151'],
            labelLine: {
              normal: {
                show: true,
                length: EchartTable.getDpr() * 1.3,
                length2: EchartTable.getDpr() * 8,
                lineStyle: {
                  width: EchartTable.getDpr() * 0.1,
                }
              }
            },
            label: {
              normal: {
                formatter: '{c|{c}间}{d|{d}%}\n',
                fontSize: EchartTable.getDpr(),
                padding: [0, -EchartTable.getDpr() * 8],
                rich: {
                  d: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    fontFamily: 'CNLight',
                  },
                  c: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    padding: [0, EchartTable.getDpr(), 0, 0],
                    fontFamily: 'CNLight',
                  },

                }
              }
            },
            // data: [{
            //         value: 100,
            //         name: '儿童'
            //     },
            //     {
            //         value: 100,
            //         name: '少年'
            //     },
            //     {
            //         value: 100,
            //         name: '青年'
            //     },
            //     {
            //         value: 100,
            //         name: '中年'
            //     },
            //     {
            //         value: 100,
            //         name: '老年'
            //     },
            //     {
            //         value: 100,
            //         name: '未登记'
            //     }
            // ]
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        houseNature.setOption(option);
      },
      //开门占比
      OpenDoorOf: function () {
        Frontend.api.Ajax('/Webapi/openLogsInfo', null, function (msg) {
          var num = [];
          for (var i = 0; i < msg.data.length; i++) {
            num[i] = [JSON.parse(msg.data[i].num), msg.data[i].open_type]
          }
          var useNumber = [];
          var useTitle = [];
          for (var n = 0; n < num.length; n++) {
            useNumber[n] = { 'value': num[n][0], 'name': num[n][1] };
            useTitle[n] = num[n][1];
          }

          OpenDoorOf.setOption({
            legend: {
              data: useTitle
            },
            series: {
              data: useNumber
            }
          })
        })
        var OpenDoorOf = echarts.init(document.getElementById('OpenDoorOf'));
        option = {
          // backgroundColor: '#031845',
          title: {
            text: "开门占比",
            show: true,
            // left: 20,
            textStyle: {
              fontWeight: '200',
              color: '#f5f4f4',
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.6,
              textShadowColor: 'rgba(12, 69, 255, 0.9)',
              textBorderWidth: EchartTable.getDpr() * 0.2,
              textShadowBlur: EchartTable.getDpr() * 0.05,
              textShadowOffsetX: EchartTable.getDpr() * 0.2,
              textShadowOffsetY: EchartTable.getDpr() * 0.2,
            },
          },
          grid: {
            top: '25%' //距上边距
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}次 ({d}%)",
            textStyle: {
              fontFamily: 'CNLight',
              fontSize: EchartTable.getDpr() * 1.1,
            }
          },
          legend: {
            orient: 'horizontal',
            icon: 'rect',
            bottom: 0,
            x: 'center',
            // data: ['儿童', '少年', '青年', '中年', '老年', '未登记'],
            textStyle: {
              color: '#6ea5d7',
              fontSize: EchartTable.getDpr(),
              fontFamily: 'CNLight',
            },
            itemWidth: EchartTable.getDpr() * 1.5,
            itemHeight: EchartTable.getDpr() * 1,
            itemGap: EchartTable.getDpr()
          },
          series: [{
            name: '类型',
            type: 'pie',
            radius: ['20%', '45%'],
            center: ['50%', '55%'],
            // hoverAnimation: true,
            color: ['#fdff51', '#51ffa7', '#8eff51', '#ff9351', '#ff5151'],
            labelLine: {
              normal: {
                show: true,
                length: EchartTable.getDpr() * 1.3,
                length2: EchartTable.getDpr() * 8,
                lineStyle: {
                  width: EchartTable.getDpr() * 0.1,
                }
              }
            },
            label: {
              normal: {
                formatter: '{c|{c}次}{d|{d}%}\n',
                fontSize: EchartTable.getDpr(),
                padding: [0, -EchartTable.getDpr() * 8],
                rich: {
                  d: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    fontFamily: 'CNLight',
                  },
                  c: {
                    fontSize: EchartTable.getDpr(),
                    color: '#fff',
                    padding: [0, EchartTable.getDpr(), 0, 0],
                    fontFamily: 'CNLight',
                  },

                }
              }
            },
            // data: [{
            //         value: 100,
            //         name: '儿童'
            //     },
            //     {
            //         value: 100,
            //         name: '少年'
            //     },
            //     {
            //         value: 100,
            //         name: '青年'
            //     },
            //     {
            //         value: 100,
            //         name: '中年'
            //     },
            //     {
            //         value: 100,
            //         name: '老年'
            //     },
            //     {
            //         value: 100,
            //         name: '未登记'
            //     }
            // ]
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        OpenDoorOf.setOption(option);
      },
      //男女比例
      sexStatistics: function () {
        Frontend.api.Ajax('/Webapi/sexInfo/', null, function (msg) {
          $(".men").width(msg.data[0].ratio);
          $(".women").width(msg.data[1].ratio);
          $(".other").width(msg.data[2].ratio);
          $(".sexRatio tbody tr:nth-child(1) td:nth-child(2)").html(msg.data[0].num)
          $(".sexRatio tbody tr:nth-child(1) td:nth-child(3)").html(msg.data[0].ratio)
          $(".sexRatio tbody tr:nth-child(2) td:nth-child(2)").html(msg.data[1].num)
          $(".sexRatio tbody tr:nth-child(2) td:nth-child(3)").html(msg.data[1].ratio)
          $(".sexRatio tbody tr:nth-child(3) td:nth-child(2)").html(msg.data[2].num)
          $(".sexRatio tbody tr:nth-child(3) td:nth-child(3)").html(msg.data[2].ratio)
          var cont5_sex = $('.content_div5 .cont').attr("value");
          if (cont5_sex == '13') {
            $(".swiper-slide .sexRatio thead tr th, .swiper-slide .sexRatio tbody tr td").css("height", '1.5rem');
          }
        })
      },
      //一人一档 ==> 出行分析（散点图）
      travelAnalysis: function (peopleData) {
        $(".yirenyidang_bottom_left_num").html('');
        $(".yirenyidang_bottom_left_time").html('');
        Frontend.api.Ajax('/Webapi/tripAnalysisInfo', peopleData, function (msg) {
          
          var dataChuxing = msg.data.chuxing;
          var dataSandian = msg.data.sandian;
          
          $(".yirenyidang_bottom_left_num").html(dataChuxing.count);
          $(".yirenyidang_bottom_left_time").html(dataChuxing.time);

          travelAnalysis.setOption({
            series: {
              data: dataSandian
            }
          })
        })
        var travelAnalysis = echarts.init(document.getElementById('travelAnalysis'));

        var lastMonth = [];
        for(var i = 0;i<30;i++){
          lastMonth.unshift(new Date(
            new Date().setDate(
              new Date().getDate()-i
            )
          ).toLocaleDateString())
        }
        var newlastMonth = [];
        for(var i=0;i<lastMonth.length;i++){
          newlastMonth.push(lastMonth[i].substring(5));
        }
        var firstArr = newlastMonth[0].replace("/","月");
        newlastMonth.shift();
        var ARRAY_time = [];
        for(var i=0;i<newlastMonth.length;i++){
          var array = newlastMonth[i].split('/')[1];
          ARRAY_time.push(array)
        }
        ARRAY_time.unshift(firstArr)
        ARRAY_time.splice(-1,1);
          option = {
          grid: {
            top: '20%', //距上边距
            bottom: '18%' //距下边距
          },
  
          xAxis: {
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            data:ARRAY_time,
            // data: ['11月19', '20', '21', '22', '23'],
            //data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
            name: '日期',
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#d2d8fc',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              // rotate:60,
              interval: 1,//强制显示文字
              showMinLabel:true,//是否显示最小刻度值
              showMaxLabel:true,//是否显示最大刻度值
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            }
          },
          yAxis: {
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            interval: 2,
            min: 0,
            max: 24,
            //data: ['0', '2', '4', '6', '8', '10','12', '14', '16', '18', '20', '22', '24'],
            name: '小时',
            nameTextStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#d2d8fc',
              fontFamily: 'CNLight',
            },
            // x轴的字体样式
            axisLabel: {
              show: true,
              textStyle: {
                color: '#d2d8fc',
                fontSize: EchartTable.getDpr(),
                fontFamily: 'CNLight',
              }
            },
            // x轴的颜色和宽度
            axisLine: {
              lineStyle: {
                color: '#0dafff',
                // width: 3, //这里是坐标轴的宽度,可以去掉
              }
            },
            scale: true
          },
          series: {
            name: '1',
            // data:  [['28604','77','17096869','Australia','1990'],['31163','77.4','27662440','Canada','1990'],['1516','68','1154605773','China','1990']],
            type: 'scatter',
            symbolSize: function (data) {
              return Math.sqrt(data[2]) * 8;//计算起泡圈的大小
            },
            label: {
              fontSize: EchartTable.getDpr(),
              color: '#fff',
              emphasis: {
                show: true,
                formatter: function (param) {
                  return param.data[2] + '次';
                },
                position: 'top'
              }
            },
            itemStyle: {
              fontSize: EchartTable.getDpr(),
              color: '#fff',
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                }, {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }])
              }
            }
          },
        };
        travelAnalysis.setOption(option);
      },

      //添加layui表格title提示
      layuiTitle: function () {
        $('th').each(function (index, element) {
          $(element).attr('title', $(element).text());
        });
        $('td').each(function (index, element) {
          $(element).attr('title', $(element).text());
        });
      }

    },
    init: function () {
    },
    getDpr: function () {
      //其中getDpr()为一个方法，根据屏幕大小去加载不同字体大小
      //图表根据屏幕大小去判断字体大小
      var windowWidth = $(window).width();

      if (windowWidth <= 1366) {
        return 8
      }
      if (windowWidth > 1366 && windowWidth <= 1680) {
        return 10
      }
      if (windowWidth > 1680 && windowWidth <= 1920) {
        return 12
      }
      if (windowWidth > 1920 && windowWidth <= 2560) {
        return 15
      }
      if (windowWidth > 2560 && windowWidth <= 3840) {
        return 24
      }
      if (windowWidth > 3840 && windowWidth <= 5760) {
        return 34
      }

    }
  };
  EchartTable.init();
  // return EchartTable;
// });