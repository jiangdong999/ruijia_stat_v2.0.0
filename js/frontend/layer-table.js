// define(['jquery', 'frontend', 'layui', 'echart-table', 'common', 'swiper'], function ($, Frontend, undefined, EchartTable, Common, Swiper) {
    var LayerTable = {
        api: {
            //echarts常住、流动人口弹层
            permanent_layer: function (layerData) {
                //页面层-自定义
                $(".cont_all").on('click', '.main .main_ul_1 #population', function () {
                    layerData.layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 1,
                        shadeClose: true,
                        shade: 0.8,
                        skin: 'populationclass', //皮肤
                        area: ['51rem', '13.4rem'],
                        content: $('#population_layer'),
                        zIndex:2000000, //层优先级
                        success: function () {
                            EchartTable.api.permanent_layer_year();
                            EchartTable.api.permanent_layer_month();
                            EchartTable.api.permanent_layer_time();
                        },
                        end: function () { }
                    })
                })
            },
            //今日新增人员
            todayStaff: function (layerData) {
                var isclick = true;//防止点击过快
                $(".todayStaff,.deleteStaff").unbind('click').on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var todayHtml = $(".todayStaff").html();
                        var deleteHtml = $(".deleteStaff").html();
                        $(".today_layer_left li:nth-child(1) span").html(todayHtml)
                        $(".today_layer_left li:nth-child(2) span").html(deleteHtml)

                        var todayBoolean = $(this).hasClass('todayStaff');//今日类名
                        var statusIndex; //1新增2注销
                        var todayInput;//搜索

                        statusIndex = todayBoolean == true ? '1' : '2';
                        //根据class类来判断点击是新增还是注销
                        if (todayBoolean == true) {
                            $(".today_layer_left li:nth-child(1)").addClass("pitch_on");
                            $(".today_layer_left li:nth-child(2)").removeClass("pitch_on2");
                        } else {
                            $(".today_layer_left li:nth-child(2)").addClass("pitch_on2");
                            $(".today_layer_left li:nth-child(1)").removeClass("pitch_on");
                        }
                        
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '15.5rem'],
                            content: $('#today_layer'),
                            zIndex:2000000,
                            success: function () {
                                // console.log(statusIndex)
                                //初始化搜索
                                $("#today_layer_input").val("");
                                Staff();
                                $(".today_layer_left li").unbind('click').on('click', function () {
                                    let idx = $(this).index();

                                    statusIndex = idx == '0' ? '1' : '2';
                                    if (idx == "0") {
                                        $(".today_layer_left li:nth-child(1)").addClass("pitch_on");
                                        $(".today_layer_left li:nth-child(2)").removeClass("pitch_on2");
                                    } else {
                                        $(".today_layer_left li:nth-child(2)").addClass("pitch_on2");
                                        $(".today_layer_left li:nth-child(1)").removeClass("pitch_on");
                                    }
                                    Staff();
                                })
                                $("#today_layer_btn").unbind('click').on("click", function () {
                                    todayInput = $("#today_layer_input").val();
                                    Staff()
                                })
                            },
                            end: function () { }
                        })
                        function Staff() {
                            let dataNew = {
                                'keyword': todayInput,//搜索值
                                'status': statusIndex,//1新增2注销
                                'pageSize': '10'//每页显示的数量
                            }
                            let params = Frontend.api.getPostParams(dataNew);

                            layerData.table.render({
                                elem: '#today_table',
                                // height: 1060,
                                // width: 3480,
                                url: window.publicUrl+'/Webapi/todayUserList', //数据接口
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
                                cols: [
                                    [ //表头
                                        {
                                            field: 'idIndex', title: '编号', width: '3%', align: 'center', templet: function (e) {
                                                let idIndex = e.LAY_INDEX;
                                                return idIndex;
                                            }
                                        },
                                        { field: 'household_type', width: '8%', title: '住户类型' },
                                        { field: 'household_name', width: '5%', title: '姓名' },
                                        { field: 'citizen_id', width: '14%', title: '身份证号/通行证号' },
                                        { field: 'address_town', width: '10%', title: '街道' },
                                        { field: 'address_village', width: '15%', title: '社区' },
                                        { field: 'community_name', width: '9%', title: '小区' },
                                        {
                                            field: 'address', title: '住址', width: '10%', templet: function (e) {
                                                let address = e.building_name + e.unit_name + e.room_name;
                                                return address;
                                            }
                                        },
                                        { field: '', width: '8%', title: '操作', toolbar: '#today_Demo' },
                                    ]
                                ],
                                limit: 10,
                                done: function (res, curr, count) {

                                    LayerTable.api.layuiTitle()//layui表格title提示
                                    // console.log("监听where:", this.where);
                                    // //非常重要！如果使table.reload()后依然使用过滤，就必须将过滤组件也reload()一下
                                }
                            });

                            //监听工具条
                            layerData.table.on('tool(today_table)', function (obj) {
                                var peopleData = obj.data;
                                if (obj.event === 'yirenyidang') {
                                    LayerTable.api.onepeopleOnefiles(layerData, peopleData,statusIndex); // 一人一档
                                }
                            });

                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#today_table',
                                    mode: 'api',
                                    filters: [
                                        { field: 'household_type', name: 'houseType', type: 'checkbox', data: msg.data.household_type },
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name }
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        todayInput = $("#today_layer_input").val();
                                        layerData.table.reload('today_table', {
                                            where: { //设定异步数据接口的额外参数，任意设
                                                keyword: todayInput,
                                            },
                                            page: 1
                                        })
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                        }
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },
            // 一人一档
            onepeopleOnefiles: function (layerData, peopleData,statusIndex) {

                // layerData.layer.closeAll();
                var OnepeopleOnepart = layerData.OnepeopleOnepart;// 一人一档
                var OnehouseOnepart = layerData.OnehouseOnepart;//一屋一档
                var ComeInTime = layerData.ComeInTime;// 重点人员告警：出入即时报警
                var HouseWarn = layerData.HouseWarn;//房屋告警
                var PeopleWarn_teshu = layerData.PeopleWarn_teshu;//特殊人群
                var SOSWarn = layerData.SOSWarn;//sos
                var layerYicheyidang = layerData.layerYicheyidang;//关闭一车一档弹层

                if(peopleData.loudongClick == 'ok'){
                }else{
                    layerData.layer.close(OnepeopleOnepart)
                    layerData.layer.close(OnehouseOnepart)
                }

                layerData.layer.close(HouseWarn)
                layerData.layer.close(PeopleWarn_teshu)
                layerData.layer.close(SOSWarn)
                layerData.layer.close(ComeInTime)
                layerData.layer.close(layerYicheyidang)

                layerData.OnepeopleOnepart = layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    id:'OnepeopleOnepart',
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '20rem'],
                    content: $('.yirenyidang'),
                    zIndex:2000000, //层优先级
                    success: function () {
                        //初始化日期为空
                        $("#yirenyidang_start").val("");
                        $("#yirenyidang_end").val("");
                        //初始化tab切换
                        $("#yirenyidang .yirenyidang_bottom_top ul li").eq(0).addClass("pitch_on").siblings().removeClass("pitch_on2");
                        $("#yirenyidang .yirenyidang_bottom_table>div").eq(0).show().siblings().hide();

                        var yirenyidang_start;
                        var yirenyidang_end;
                        var household_id = peopleData.household_id;
                        var household_code = peopleData.household_code;
                        records();//出行记录
                        function records() {
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'householdId': household_id,//人员id
                                'householdCode': household_code,//	人员编码
                                'startTime': yirenyidang_start,//开始时间
                                'endTime': yirenyidang_end//结束时间
                            }
                            let params = Frontend.api.getPostParams(dataNew);

                            layerData.table.render({
                                elem: '#yirenyidang_table_go',
                                // height: 660,
                                // width: 3900,
                                url: window.publicUrl+'/Webapi/openDoorLogsList', //数据接口
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
                                limit: 5,
                                page: true, //开启分页
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: '' },
                                        { field: 'apply_time', width: '13%', title: '开门时间' },
                                        { field: 'open_type', width: '10%', title: '开门方式' },
                                        { field: 'address_town', width: '12%', title: '街道' },
                                        { field: 'address_village', width: '12%', title: '社区' },
                                        { field: 'community_name', width: '12%', title: '小区' },
                                        { field: 'door_name', width: '12%', title: '抓拍位置' },
                                        { field: '', width: '14%', title: '操作', toolbar: '#yirenyidang_go_Demo' },
                                        // { field: '', width: '18%', title: '操作', toolbar: '#yirenyidang_go_Demo' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#yirenyidang_table_go',
                                    mode: 'api',
                                    filters: [
                                        { field: 'open_type', name: 'openType', type: 'checkbox', data: msg.data.open_type },
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name }
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('yirenyidang_table_go', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                            //监听工具条
                            layerData.table.on('tool(yirenyidang_table_go)', function (obj) {
                                var people_table = obj.data;
                                let empty = null;
                                for (const key in people_table) {//处理字符串null
                                    // console.log(key)
                                    if (people_table.hasOwnProperty(key)) {
                                        if (people_table[key] === null) {
                                            people_table[key] = "";
                                            empty = true;
                                        } else {
                                            empty = false;
                                        }
                                    }
                                }
                                // console.log(people_table)
                                if (obj.event === 'push_photo') {//开门抓拍
                                    LayerTable.api.OnePeopleOnefilePhoto(layerData, people_table);
                                } else if (obj.event === 'video') {//实时视频
                                    LayerTable.api.OnePeopleOnefileVideo(layerData, people_table);
                                } else if (obj.event === 'trailing_photo') {//尾随抓拍  没有先不做
                                    return false;
                                }
                            })

                        }
                        warnInfo();//告警信息
                        function warnInfo() {
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'householdId': household_id,//人员id
                                'householdCode': household_code,//	人员编码
                                'startTime': yirenyidang_start,//开始时间
                                'endTime': yirenyidang_end//结束时间

                            }
                            let params = Frontend.api.getPostParams(dataNew);

                            layerData.table.render({
                                elem: '#yirenyidang_table_warn',
                                // height: 660,
                                // width: 3900,
                                url: window.publicUrl+'/Webapi/userWarnInfo', //数据接口
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
                                limit: 5,
                                page: true, //开启分页
                                cols: [
                                    [ //表头

                                        { field: '', width: '1%', title: '' },
                                        { field: 'addtime', width: '14%', title: '发生时间' },
                                        {
                                            field: 'warn_type', width: '12%', title: '类型', templet: function (data) {
                                                // 类型
                                                // 1群租房预警
                                                // 2出租房屋空置告警
                                                // 3重点人员告警：出入即时报警
                                                // 4重点人员告警：出入规律监控
                                                // 5关爱人员告警
                                                // 6设备告警：门禁常开告警
                                                // 7SOS报警
                                                // 8烟感
                                                // 9陌生人出入告警
                                                // 10陌生人一周x次出入
                                                // 11黑名单
                                                if (data.warn_type == '1') {
                                                    return data.warn_type = '群租房预警';
                                                } else if (data.warn_type == '2') {
                                                    return data.warn_type = '出租房屋空置告警';
                                                } else if (data.warn_type == '3') {
                                                    return data.warn_type = '重点人员告警：出入即时报警';
                                                } else if (data.warn_type == '4') {
                                                    return data.warn_type = '重点人员告警：出入规律监控';
                                                } else if (data.warn_type == '5') {
                                                    return data.warn_type = '关爱人员告警';
                                                } else if (data.warn_type == '6') {
                                                    return data.warn_type = '设备告警：门禁常开告警';
                                                } else if (data.warn_type == '7') {
                                                    return data.warn_type = 'SOS报警';
                                                } else if (data.warn_type == '8') {
                                                    return data.warn_type = '烟感';
                                                } else if (data.warn_type == '9') {
                                                    return data.warn_type = '陌生人出入告警';
                                                } else if (data.warn_type == '10') {
                                                    return data.warn_type = '陌生人一周x次出入';
                                                } else if (data.warn_type == '11') {
                                                    return data.warn_type = '黑名单';
                                                } else if (data.warn_type == '15') {
                                                    return data.warn_type = '可疑人员出入告警';
                                                }
                                            }
                                        },
                                        { field: 'reason', width: '12%', title: '发生原因' },
                                        { field: 'address_town', width: '12%', title: '街道' },
                                        { field: 'address_village', width: '10%', title: '社区' },
                                        { field: 'community_name', width: '10%', title: '小区' },
                                        { field: 'open_useraddress', width: '10%', title: '位置' },
                                        {
                                            field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                                // 处理状态：0：未处理，1：处理中，2：已处理
                                                if (data.is_act == '0') {
                                                    return data.type = '未处理';
                                                } else if (data.type == '1') {
                                                    return data.type = '处理中';
                                                } else if (data.type == '2') {
                                                    return data.type = '已处理';
                                                }
                                            }
                                        },
                                        { field: '', width: '4%', title: '操作', toolbar: '#yirenyidang_warn_Demo' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#yirenyidang_table_warn',
                                    mode: 'api',
                                    filters: [
                                        { field: 'warn_type', name: 'warnType', type: 'checkbox', data: msg.data.warn_type },
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                        { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act }
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('yirenyidang_table_warn', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                            //监听工具条
                            layerData.table.on('tool(yirenyidang_table_warn)', function (obj) {
                                var people_table = obj.data;
                                let empty = null;
                                for (const key in people_table) {//处理字符串null
                                    // console.log(key)
                                    if (people_table.hasOwnProperty(key)) {
                                        if (people_table[key] === null) {
                                            people_table[key] = "";
                                            empty = true;
                                        } else {
                                            empty = false;
                                        }
                                    }
                                }
                                if (obj.event === 'push_look') {//告警信息详情
                                    if (people_table.warn_type == '1' || people_table.warn_type == '2') {//==>1 群租房告警 2出租房屋空置告警
                                        LayerTable.api.housewarnAccommodation(layerData, people_table);
                                    } else if (people_table.warn_type == '6' || people_table.warn_type == '8') {//==>6设备告警：门禁常开告警  8 烟感告警
                                        LayerTable.api.deviceSmoke(layerData, people_table);
                                    } else if (people_table.warn_type == '5') {//==>5 关爱人员告警(特殊人群)
                                        LayerTable.api.peoplewarn_care(layerData, people_table);
                                    } else if (people_table.warn_type == '3') {//3重点人员告警：出入即时报警
                                        LayerTable.api.comeIntime(layerData, people_table)
                                    } else if (people_table.warn_type == '4') {//4重点人员告警：出入规律报警
                                        // LayerTable.api.comeInlaw(layerData,people_table)
                                    } else if (people_table.warn_type == '7') {//7  SOS告警
                                        LayerTable.api.soswarn(layerData, people_table)
                                    } else if (people_table.warn_type == '11') {//11  黑名单告警
                                        LayerTable.api.blackwarn(layerData, people_table)
                                    } else if (people_table.warn_type == '15') {//15 可疑人员出入告警
                                        LayerTable.api.comeIntime(layerData, people_table)
                                    }

                                    

                                }
                            })
                        }
       
                        //日期时间选择器
                        layerData.laydate.render({
                            elem: '#yirenyidang_start',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate() //layui日历控件设置选择日期不能超过当前日期
                        });
                        layerData.laydate.render({
                            elem: '#yirenyidang_end',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate()
                        });

                        
                        //点击搜索
                        $("#yirenyidang_btn").unbind('click').on("click", function () {
                            yirenyidang_start = $("#yirenyidang_start").val();
                            yirenyidang_end = $("#yirenyidang_end").val();
                            var date_start = new Date(yirenyidang_start);
                            var date_end = new Date(yirenyidang_end);
                            var yirenyidang_start_time = date_start.getTime();
                            var yirenyidang_end_time = date_end.getTime();
                            if (yirenyidang_start_time > yirenyidang_end_time) {
                                return layerData.layer.msg('输入日期错误');
                            } else {
                                records();//出行记录
                                warnInfo();//告警信息
                            }

                        })
                        //人员信息
                        peopleData = {
                            'householdId': peopleData.household_id,//一人一档必要的参数
                            'householdCode': peopleData.household_code,//一人一档必要的参数
                            'userPhone': peopleData.phone,//一车一档必要的参数
                            'userName': peopleData.household_name,//一车一档必要的参数
                            'roomCode': peopleData.room_code//一屋一档必要的参数
                        };
                        Frontend.api.Ajax('/Webapi/userInfomation', peopleData, function (msg) {
                            let Data = msg.data;
                            let sex = Data.gender;
                            let sexImg;
                            if(sex == '男性'){
                                sexImg = '../../img/nan.png';
                            }else if(sex == '女性'){
                                sexImg = '../../img/nv.png';
                            }else{
                                sexImg = '';
                            }
                            if (Data == null) {
                                $(".yirenyidang .yirenyidang_title").html("");
                                $(".yirenyidang_top_left").html("");
                                $(".yirenyidang_top_right_title_ul").html("");
                                return false;
                            } else {
                                //一人一档的标题
                                $(".yirenyidang .yirenyidang_title").html(Data.household_name);
                                var houseNum = Data.building_name　+　Data.unit_name + Data.room_name;
                                var apply_time = Data.apply_time.substring(0,10);
                                //---租房有效期-start------
                                var room_history_time_li = '';
                                if(Data.room_status_info == '出租'){
                                    room_history_time_li = ` <li><b class="room_history_time_b">租房有效期：</b><span class="room_history_time_span">${Data.room_history_time_info}</span></li>`
                                }
                                if(Data.room_history_time_info == ''){
                                    room_history_time_li = '';
                                }

                                //---租房有效期-end------
                                let str = `
                                <div class="yirenyidang_top_left">
                                    <img src="${Data.face_url}" alt="" class="headImg">
                                    <img src="${sexImg}" alt="" class="sexImg">
                                </div>
                                <div class="yirenyidang_top_right">
                                    <div class="yirenyidang_top_right_title">
                                        <h1 class="yirenyidang_top_right_title_h1">${Data.household_name}<span class="yirenyidang_top_right_title_span">${Data.household_type}</span></h1>
                                        <ul class="yirenyidang_top_right_title_ul">
                                            <li class="yirenyidang_top_right_title_ul_li">
                                                <div class="yirenyidang_top_oneHouse" roomCode="${Data.room_code}"><img src="../../img/yryddfw.png">${Data.room_new_address_info}</div>
                                                <ol class="yirenyidang_top_oneHouse_list">
                                                   <li></li>
                                                </ol>
                                            </li>
                                            <li class="yirenyidang_top_right_title_ul_li">
                                                <div class="yirenyidang_top_oneCar" userPhone="${Data.phone}" householdId="${Data.household_id}" userName="${Data.household_name}"><img src="../../img/ycyddc.png">${Data.car_new_code_info}</div>
                                                <ol class="yirenyidang_top_oneCar_list">
                                                    <li></li>
                                                </ol>
                                            </li>
                                        </ul>
                                        <ul class="yirenyidang_top_right_title_ul2">
                                            <li class="jingshenbing"></li>
                                            <li class="gugua"></li>
                                        </ul>
                                    </div>
                                    <div class="yirenyidang_top_right_div">
                                        <div class="yirenyidang_top_right_div_l">
                                            <ul>
                                                <li><b>联系电话：</b><span>${Data.phone}</span></li>
                                                <li><b>年&emsp;&emsp;龄：</b><span>${Data.age}</span></li>
                                                <li><b>民&emsp;&emsp;族：</b><span>${Data.ethnicity}</span></li>
                                                <li><b>国&emsp;&emsp;籍：</b><span>${Data.nationality}</span></li>
                                                <li><b>身份证号：</b><span>${Data.citizen_id}</span></li>
                                                <li><b>户&emsp;&emsp;籍：</b><span title="${Data.residential_address}">${Data.residential_address}</span></li>
                                            </ul>
                                        </div>
                                        <div class="yirenyidang_top_right_div_r">
                                            <div class="yirenyidang_top_right_div_r_1">
                                                <ul>
                                                    <li><b>街&emsp;&emsp;道：</b><span title="${Data.address_town}">${Data.address_town}</span></li>
                                                    <li><b>学&emsp;&emsp;历：</b><span>${Data.education_level}</span></li>
                                                    <li><b>社&emsp;&emsp;区：</b><span title="${Data.address_village}">${Data.address_village}</span></li>
                                                    <li><b>婚姻状况：</b><span>${Data.marital_status}</span></li>
                                                    <li><b>小&emsp;&emsp;区：</b><span title="${Data.community_name}">${Data.community_name}</span></li>
                                                    <li><b>政治面貌：</b><span>${Data.political_status}</span></li>
                                                    <li><b>房屋坐落：</b><span title="${houseNum}">${Data.room_new_address_info}</span></li>
                                                    <li><b>从业状况：</b><span>${Data.profession_code_status}</span></li>
                                                    <li><b>所属楼层：</b><span>${Data.room_floor_info}</span></li>
                                                    <li><b>登记日期：</b><span>${apply_time}</span></li>
                                                    <li><b>房屋状态：</b><span>${Data.room_status_info}</span></li>
                                                    ${room_history_time_li}                                          
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `;
                                $(".yirenyidang  .yirenyidang_top").html(str);
                                if(Data.household_type == ""){
                                    $(".yirenyidang_top .yirenyidang_top_right_title_span").hide()
                                }else{
                                    $(".yirenyidang_top .yirenyidang_top_right_title_span").show()
                                }
                                
                                if(statusIndex == 2){//2注销、1新增人员不显示一屋一档
                                    $("#yirenyidang .yirenyidang_top .yirenyidang_top_right .yirenyidang_top_right_title .yirenyidang_top_right_title_ul").css("display","none")
                                }

                                //标签
                                var labelStr = "";
                                $.each(Data.label, function (index, label) {
                                    if (label.types == '1') {//types 1重点颜色 2特殊颜色
                                        labelStr += `<li class="jingshenbing">${label.labelName}</li>`
                                    } else if (label.types == '2') {
                                        labelStr += `<li class="gugua">${label.labelName}</li>`
                                    }
                                })
                                $(".yirenyidang_top_right_title_ul2").html(labelStr);


                                if (Data.room_code == '' || Data.room_code == '0') {//判断一屋一档
                                    $(".yirenyidang_top_oneHouse").parent().hide();
                                }else{
                                    var RoomInfoList = Data.roomInfo;
                                    if(RoomInfoList.length > '1'){
                                        var str1 = '';
                                        $.each(RoomInfoList,function(idx,val){
                                            str1 +=`<li class="yirenyidang_top_oneHouse_p" room_code="${val.room_code}">${val.room_address}</li>`
                                        })
                                        $(".yirenyidang_top_oneHouse_list").html(str1)
                                        
                                        $(".yirenyidang_top .yirenyidang_top_oneHouse").hover(function(){
                                            $(".yirenyidang_top_oneHouse_list").show();
                                        },function(){
                                            $(".yirenyidang_top_oneHouse_list").hide();
                                        })
                                       
                                        $(".yirenyidang_top").on("mouseover",".yirenyidang_top_oneHouse_list",function(){
                                            $(".yirenyidang_top_oneHouse_list").show();
                                        })
                                        $(".yirenyidang_top").on("mouseout",".yirenyidang_top_oneHouse_list",function(){
                                            $(".yirenyidang_top_oneHouse_list").hide();
                                        })

                                        //进入一屋一档（多个房间）
                                        $(".yirenyidang").unbind("click").on("click",".yirenyidang_top_oneHouse_p",function(){
                                            var roomCode = $(this).attr("room_code");
                                            var peopleData = {
                                                'roomCode': roomCode,
                                            };
                                            LayerTable.api.onehouseOnefiles(layerData, peopleData); //一屋一档
                                        })
                                        
                                    }else if(RoomInfoList.length == '1'){
                                        //点击一屋一档进入一屋一档详情 (注：点击一屋一档和一车一档两者只能加一个unbind("click"))
                                        $(".yirenyidang").unbind("click").on("click", ".yirenyidang_top_oneHouse", function () {
                                            var roomCode = $(this).attr("roomCode");
                                            var peopleData = {
                                                'roomCode': roomCode,
                                            };
                                            LayerTable.api.onehouseOnefiles(layerData, peopleData); //一屋一档
                                        })
                                    }
                                }
                                if (Data.carInfo == '0') {//0没车；1有车
                                    $(".yirenyidang_top_oneCar").parent().hide();
                                }else{
                                    var CarInfoList = Data.carInfoList;

                                    if(CarInfoList.length > '1'){
                                        var str1 = '';
                                        $.each(CarInfoList,function(idx,val){
                                            str1 +=`<li class="yirenyidang_top_oneCar_list_p" userPhone="${Data.phone}" userName="${Data.household_name}" householdId="${Data.household_id}" carNo="${val.car_no}">${val.car_adress}</li>`
                                        })
                                        $(".yirenyidang_top_oneCar_list").html(str1)
                                        
                                        $(".yirenyidang_top .yirenyidang_top_oneCar").hover(function(){
                                            $(".yirenyidang_top_oneCar_list").show();
                                        },function(){
                                            $(".yirenyidang_top_oneCar_list").hide();
                                        })
                                       
                                        $(".yirenyidang_top").on("mouseover",".yirenyidang_top_oneCar_list",function(){
                                            $(".yirenyidang_top_oneCar_list").show();
                                        })
                                        $(".yirenyidang_top").on("mouseout",".yirenyidang_top_oneCar_list",function(){
                                            $(".yirenyidang_top_oneCar_list").hide();
                                        })

                                        //进入一车一档（多辆车）
                                        $(".yirenyidang").on("click",".yirenyidang_top_oneCar_list_p",function(){
                                            var userPhone = $(this).attr("userphone");
                                            var userName = $(this).attr("username");
                                            var householdId = $(this).attr("householdid");
                                            var carNo = $(this).attr("carno");
                                            var peopleData = {
                                                'userPhone': userPhone,
                                                'userName': userName,
                                                'householdId':householdId,
                                                'carNo':carNo
                                            };
                                            LayerTable.api.onecarOnefiles(layerData, peopleData); //一车一档
                                        })
                                    }else if(CarInfoList.length == '1'){
                                        //一车一档进入一车一档详情
                                        $(".yirenyidang").on("click", ".yirenyidang_top_oneCar", function () {
                                            var userPhone = $(this).attr("userPhone");
                                            var userName = $(this).attr("userName");
                                            var householdId = $(this).attr("householdId");
                                            var peopleData = {
                                                'userPhone': userPhone,
                                                'userName': userName,
                                                'householdId':householdId
                                            };
                                            LayerTable.api.onecarOnefiles(layerData, peopleData); //一车一档
                                        })
                                    }
                                }
                                $.each(Data.label, function (index, label) {
                                    if (label.types == '1') {//1重点2特殊
                                        $(".yirenyidang .jingshenbing").show()
                                    } else if (label.types == '2') {
                                        $(".yirenyidang .gugua").show()
                                    }
                                })
                            }
                        })
                        
                    
            
                        //出入记录 、出行分析 、告警信息 切换
                        $(".yirenyidang_bottom_top_l li").unbind("click").on("click", function () {
                            let idx = $(this).index();
                            $(".yirenyidang_bottom_table>div").eq(idx).show().siblings().hide();
                            if (idx == '0') {
                                $(".yirenyidang_bottom_top_r").show();
                                $(this).addClass("pitch_on");
                                $(this).siblings().removeClass("pitch_on2");
                            } else if (idx == '1') {
                                $(".yirenyidang_bottom_top_r").hide();
                                $(this).addClass("pitch_on2");
                                $(this).siblings().removeClass("pitch_on2");
                                $(".yirenyidang_bottom_top_l li:nth-child(1)").removeClass("pitch_on");
                            } else {
                                $(".yirenyidang_bottom_top_r").show();
                                $(this).addClass("pitch_on2")
                                $(this).siblings().removeClass("pitch_on2");
                                $(".yirenyidang_bottom_top_l li:nth-child(1)").removeClass("pitch_on");
                            }
                        })

                        // //点击一屋一档进入一屋一档详情 (注：点击一屋一档和一车一档两者只能加一个unbind("click"))
                        // $(".yirenyidang_top").unbind("click").on("click", ".yirenyidang_top_oneHouse", function () {
                        //     var roomCode = $(this).attr("roomCode");
                        //     var peopleData = {
                        //         'roomCode': roomCode,
                        //     };
                        //     console.log("单个房间")
                        //     LayerTable.api.onehouseOnefiles(layerData, peopleData); //一屋一档
                        // })
                        // //一车一档进入一车一档详情
                        // $(".yirenyidang_top").on("click", ".yirenyidang_top_oneCar", function () {
                        //     var userPhone = $(this).attr("userPhone");
                        //     var userName = $(this).attr("userName");
                        //     var householdId = $(this).attr("householdId");
                        //     var peopleData = {
                        //         'userPhone': userPhone,
                        //         'userName': userName,
                        //         'householdId':householdId
                        //     };
                        //     LayerTable.api.onecarOnefiles(layerData, peopleData); //一车一档
                        // })

                        //一人一档 ==> 出行分析（散点图 和 近30天出入记录分析）
                        EchartTable.api.travelAnalysis(peopleData);
                    }
                })
            },
            //一人一档详情视频
            OnePeopleOnefileVideo: function (layerData, people_table) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'onePeoplePushclassNew', //皮肤
                    area: ['17.9rem', '17.7rem'],
                    zIndex:2000000, //层优先级
                    content: $('#onePeoplePush_photo'),
                    success: function () {
                        var address = people_table.community_name + people_table.door_name;
                        var str = `<div class="onePeoplePush_photo_title">门禁抓拍视频</div>
                        <div class="onePeoplePush_photo_top">
                            <h1><b>姓&emsp;&emsp;名：${people_table.operator_name}</b><span>时&emsp;&emsp;间：${people_table.apply_time}</span></h1>
                            <p><b>地&emsp;&emsp;址：${address}</b><span>开门方式：${people_table.open_type}</span></p>
                        </div>
                        <div class="onePeoplePush_photo_bottom"><video id="videoEle" autoplay="autoplay" src="${people_table.video_url_name}" height="1000px" width="auto"controls="controls">您的浏览器不支持 video 标签。</video></div>`;
                        $(".onePeoplePush_photo").html(str);
                    },
                    end: function () {//关闭弹层时video暂停
                        document.getElementById('videoEle').pause();
                    }
                })
            },
            //一人一档详情抓拍
            OnePeopleOnefilePhoto: function (layerData, people_table) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'onePeoplePushclassNew', //皮肤
                    area: ['17.9rem', '17.7rem'],
                    zIndex:2000000, //层优先级
                    content: $('#onePeoplePush_photo'),
                    success: function () {
                        var address = people_table.community_name + people_table.door_name;
                        var str = `<div class="onePeoplePush_photo_title">抓拍照片</div>
                        <div class="onePeoplePush_photo_top">
                            <h1><b>姓&emsp;&emsp;名：${people_table.operator_name}</b><span>时&emsp;&emsp;间：${people_table.apply_time}</span></h1>
                            <p><b>地&emsp;&emsp;址：${address}</b><span>开门方式：${people_table.open_type}</span></p>
                        </div>
                        <div class="onePeoplePush_photo_bottom"><img src="${people_table.images_url_name}" alt=""></div>`;
                        $(".onePeoplePush_photo").html(str);
                    }
                })
            },
            //一屋一档
            onehouseOnefiles: function (layerData, peopleData) {
                // console.log(buildingState)
                var OnepeopleOnepart = layerData.OnepeopleOnepart;
                var OnehouseOnepart = layerData.OnehouseOnepart;
                var loudongClickOk = peopleData.loudongClick;

                if(loudongClickOk == 'ok'){
                    layerData.layer.close(OnepeopleOnepart)// 一人一档
                    layerData.layer.close(OnehouseOnepart)//一屋一档
                }else{
                    layerData.layer.close(OnepeopleOnepart)// 一人一档
                    yiwuyidang_new()
                }

                //---------------原先代码------------------------
                // var OnepeopleOnepart = layerData.OnepeopleOnepart;
                // var OnehouseOnepart = layerData.OnehouseOnepart;
                // layerData.layer.close(OnepeopleOnepart)// 一人一档
                // layerData.layer.close(OnehouseOnepart)//一屋一档
                layerData.OnehouseOnepart = layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    id:'OnehouseOnepart',
                    skin: 'yiwuyidangclass', //皮肤
                    area: ['36rem', '19rem'],
                    zIndex:2000000, //层优先级
                    content: $('.yiwuyidang'),
                    success: function () {
                        if(loudongClickOk == 'ok'){
                            yiwuyidang_new()
                        }
                    },
                    end:function(){
                       $(".yiwuyidang_bottom_div_ul_title ul").html("")//清空tab切换标签
                       $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").html("")//清空房屋人员信息
                       $(".yiwuyidang_top_right ul li span").html("")//清空房屋信息
                       $(".yiwuyidang_title").html("")//房屋标题
                       $(".yiwuyidang_top_right_img").remove();
                    }
                })

                function yiwuyidang_new(){
                    $(".yiwuyidang_bottom_div_ul_title ul").html("")//清空tab切换标签
                    $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").html("")//清空房屋人员信息
                    $(".yiwuyidang_top_right ul li span").html("")//清空房屋信息
                    $(".yiwuyidang_title").html("")//房屋标题
                    $(".yiwuyidang_top_right_img").remove();
                    //房屋信息
                    Frontend.api.Ajax('/Webapi/renRoomInfo', peopleData, function (msg) {
                        let empty = null;
                        let roomInfo = msg.data.roomInfo;//房屋信息

                        var homeUserinfo = msg.data.homeUser;//家庭成员
                        var newUserinfo = msg.data.newUser;//承租人
                        var oldUserinfo = msg.data.oldUser;//历史承租人


                        var UserAll;//公共                 
                        newRoomInfo()//房屋信息
                        function newRoomInfo(){
                            for (const key in roomInfo) {
                                if (roomInfo.hasOwnProperty(key)) {
                                    if (roomInfo[key] === null) {
                                        roomInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
                            var building_name = roomInfo.building_name;//40栋
                            var unit_name = roomInfo.unit_name;//2单元
                            var room_name = roomInfo.room_name;//0502
                            var userCount = roomInfo.userCount;//人总数量
                            var Address = building_name + unit_name + room_name;//拼接40栋2单元0502
                            var room_use_status = roomInfo.room_use_status;//空置、自住、租住、未登记

                            let Roominfo = ` 
                                <div class="yiwuyidang_top_right">
                                    <ul>
                                        <li><b>街&emsp;&emsp;道：</b><span>${roomInfo.address_town}</span></li>
                                        <li><b>社&emsp;&emsp;区：</b><span>${roomInfo.address_village}</span></li>
                                        <li><b>小&emsp;&emsp;区：</b><span>${roomInfo.community_name}</span></li>
                                        <li><b>房屋坐落：</b><span>${Address}</span></li>
                                    </ul>
                                    <ul>
                                        <li><b>房屋性质：</b><span>${roomInfo.room_property}</span></li>
                                        <li><b>房屋用途：</b><span>${roomInfo.room_use}</span></li>
                                        <li><b>户&emsp;&emsp;型：</b><span>${roomInfo.house_type}</span></li>
                                        <li><b>建筑面积：</b><span>${roomInfo.room_area}</span></li>
                                    </ul>
                                    <ul>
                                        <li><b>电话呼叫：</b><span>未开通</span></li>
                                        <li><b>被&nbsp;叫&nbsp;方：</b><span></span></li>
                                        <li><b>电话号码：</b><span></span></li>
                                    </ul>
                                    <ul>
                                        <li><b>人口数量：</b><span>${roomInfo.userCount}</span></li>
                                        <li><b>车辆数量：</b><span>${roomInfo.carCount}</span></li>
                                    </ul>
                                </div>`;
                            $(".yiwuyidang_top").html(Roominfo);

                            

                            $(".yiwuyidang_title").html(`${Address}`);
                            $(".yiwuyidang_bottom_div_ul_title ul").html('<li></li><li></li><li></li>');

                            if (room_use_status == "空置") {
                                $(".yiwuyidang_top .yiwuyidang_top_right").append(`<img src="../../img/kz.png" alt="" class="yiwuyidang_top_right_img">`)
                                $(".yiwuyidang_bottom_div_ul_title ul").html("")
                                var str = `<img src="../../img/kong111.png" alt="" class="yiwuyidang_top_right_ico">`;
                                $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").html(str)
                                return false;
                            }else if (room_use_status == "出租空置") {
                                $(".yiwuyidang_top .yiwuyidang_top_right").append(`<img src="../../img/kongz2.png" alt="" class="yiwuyidang_top_right_img">`)
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/jinri.png') no-repeat",
                                    'background-size':'100% 100%'
                                }) 
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                }) 
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/zhuxiao.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.oldUser;//房屋人员信息 ->历史承租人
                                label_ALL_chuzu_kongzhi();//判断所有标签内容显示情况    
                                label_ALL()//判断所有标签内容显示情况（出租空置 自住空置 租住 三者公共部分）

                            }else if (room_use_status == "自住空置") {
                                $(".yiwuyidang_top .yiwuyidang_top_right").append(`<img src="../../img/kongz1.png" alt="" class="yiwuyidang_top_right_img">`)
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/yxz.png') no-repeat",
                                    'background-size':'100% 100%'
                                }) 
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                }) 
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                label_ALL_zizhu_kongzhi();//判断所有标签内容显示情况
                                label_ALL()//判断所有标签内容显示情况（出租空置 自住空置 租住 三者公共部分）
                            }else if (room_use_status == "自住") {
                                $(".yiwuyidang_top .yiwuyidang_top_right").append(`<img src="../../img/zizhu.png" alt="" class="yiwuyidang_top_right_img">`)
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").text('家庭成员')
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").show().siblings().hide();
                                
                                if(homeUserinfo.length == '0'){
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").hide();
                                    $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").html("")
                                }
                                UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                UserAllInfo()//房屋人员信息

                            }else if (room_use_status == "租住") {
                                //如果为群租房  就改成群租房图标
                                if(roomInfo.roomGroupRentInfo == '1'){
                                    $(".yiwuyidang_top .yiwuyidang_top_right").append(`<img src="../../img/ysqu.png" alt="" class="yiwuyidang_top_right_img">`)
                                }else{
                                    $(".yiwuyidang_top .yiwuyidang_top_right").append(`<img src="../../img/zuzhu.png" alt="" class="yiwuyidang_top_right_img">`)
                                }
                                
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/jinri.png') no-repeat",
                                    'background-size':'100% 100%'
                                }) 
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/zhuxiao.png') no-repeat",
                                    'background-size':'100% 100%'
                                }) 
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.newUser;//房屋人员信息 ->承租人
                                label_ALL_zuzhu();//判断所有标签内容显示情况
                                label_ALL()//判断所有标签内容显示情况（出租空置 自住空置 租住 三者公共部分）
                            }else if (room_use_status == "未登记"){
                                $(".yiwuyidang_top .yiwuyidang_top_right").append(`<img src="../../img/weidengji.png" alt="" class="yiwuyidang_top_right_img">`)
                                $(".yiwuyidang_bottom_div_ul_title ul").html("")
                                var str = `<img src="../../img/kong111.png" alt="" class="yiwuyidang_top_right_ico">`;
                                $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").html(str)
                                return false;
                            }
                            
                            
                        }
                        
                        //判断所有标签内容显示情况（出租空置）
                        function label_ALL_chuzu_kongzhi(){
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").text('家庭成员')
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").text('承租人')
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").text('历史承租人')
                            $(".yiwuyidang_bottom_div_ul_title ul li").css({
                                "display":"block",
                                "float":"left",
                                'cursor':'pointer'
                            })

                            if(homeUserinfo.length == '0' && newUserinfo.length != '0' && oldUserinfo.length != '0'){//判断租住中是否有家庭成员  长度为0则没有家庭成员
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/jinri.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/zhuxiao.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.oldUser;//房屋人员信息 ->历史承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(newUserinfo.length == '0' && homeUserinfo.length != '0' && oldUserinfo.length != '0'){//判断租住中是否有承租人  长度为0则没有承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/jinri.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/zhuxiao.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.oldUser;//房屋人员信息 ->历史承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(oldUserinfo.length == '0' && homeUserinfo.length != '0' && newUserinfo.length != '0'){//判断租住中是否有历史承租人  长度为0则没有历史承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/jinri.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/zhuxiao.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.newUser;//房屋人员信息 ->承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(oldUserinfo.length != '0' && homeUserinfo.length != '0' && newUserinfo.length != '0'){//三者都存在
                            
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                        }
                        //判断所有标签内容显示情况 （自住空置）
                        function label_ALL_zizhu_kongzhi(){
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").text('家庭成员')
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").text('承租人')
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").text('历史承租人')
                            $(".yiwuyidang_bottom_div_ul_title ul li").css({
                                "display":"block",
                                "float":"left",
                                'cursor':'pointer'
                            })

                            if(homeUserinfo.length == '0' && newUserinfo.length != '0' && oldUserinfo.length != '0'){//判断租住中是否有家庭成员  长度为0则没有家庭成员
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.newUser;//房屋人员信息 ->承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(newUserinfo.length == '0' && homeUserinfo.length != '0' && oldUserinfo.length != '0'){//判断租住中是否有承租人  长度为0则没有承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(oldUserinfo.length == '0' && homeUserinfo.length != '0' && newUserinfo.length != '0'){//判断租住中是否有历史承租人  长度为0则没有历史承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(oldUserinfo.length != '0' && homeUserinfo.length != '0' && newUserinfo.length != '0'){//三者都存在
                            
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                        }
                        //判断所有标签内容显示情况 （租住）
                        function label_ALL_zuzhu(){
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").text('家庭成员')
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").text('承租人')
                            $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").text('历史承租人')
                            $(".yiwuyidang_bottom_div_ul_title ul li").css({
                                "display":"block",
                                "float":"left",
                                'cursor':'pointer'
                            })

                            if(homeUserinfo.length == '0' && newUserinfo.length != '0' && oldUserinfo.length != '0'){//判断租住中是否有家庭成员  长度为0则没有家庭成员
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.newUser;//房屋人员信息 ->承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(newUserinfo.length == '0' && homeUserinfo.length != '0' && oldUserinfo.length != '0'){//判断租住中是否有承租人  长度为0则没有承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(oldUserinfo.length == '0' && homeUserinfo.length != '0' && newUserinfo.length != '0'){//判断租住中是否有历史承租人  长度为0则没有历史承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").hide().siblings().show();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/jinri.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/zhuxiao.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.newUser;//房屋人员信息 ->承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(oldUserinfo.length != '0' && homeUserinfo.length != '0' && newUserinfo.length != '0'){//三者都存在
                            
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/jinri.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/zhuxiao.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/bukedianji.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.newUser;//房屋人员信息 ->承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                        }
                        //判断所有标签内容显示情况（出租空置 自住空置 租住 三者公共部分）
                        function label_ALL(){
                            
                            if(homeUserinfo.length == '0' && newUserinfo.length == '0' && oldUserinfo.length != '0'){//判断租住中是否有家庭成员和承租人  长度为0则没有家庭成员和承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").show().siblings().hide();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.oldUser;//房屋人员信息 ->历史承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(homeUserinfo.length == '0' && oldUserinfo.length == '0' && newUserinfo.length != '0'){//判断租住中是否有家庭成员和历史承租人  长度为0则没有家庭成员和历史承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").show().siblings().hide();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.newUser;//房屋人员信息 ->承租人
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(newUserinfo.length == '0' && oldUserinfo.length == '0' && homeUserinfo.length != '0'){//判断租住中是否有承租人和历史承租人  长度为0则没有承租人和历史承租人
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").show().siblings().hide();
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                    'background':"url('../../img/xuanzhong.png') no-repeat",
                                    'background-size':'100% 100%'
                                })
                                UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                UserAllInfo()//房屋人员信息
                                return false;
                            }
                            if(newUserinfo.length == '0' && oldUserinfo.length == '0' && homeUserinfo.length == '0'){//判断租住中是否有承租人和历史承租人和家庭成员  长度为0则没有承租人和历史承租人和家庭成员
                                $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").hide();
                                $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").html("")
                                return false;
                            }
                        }

                        $(".yiwuyidang_bottom_div_ul_title ul li").unbind("click").on("click",function(){
                            var titleHTML = $(this).text();//家庭成员 承租人  历史承租人
                            switch(titleHTML){
                                case '家庭成员':
                                    UserAll = msg.data.homeUser;//房屋人员信息 ->家庭成员
                                    UserAllInfo()//房屋人员信息
                                    break;
                                case '承租人':
                                    UserAll = msg.data.newUser;//房屋人员信息 ->承租人
                                    UserAllInfo()//房屋人员信息
                                    break;
                                case '历史承租人':
                                    UserAll = msg.data.oldUser;//房屋人员信息 ->历史承租人
                                    UserAllInfo()//房屋人员信息
                                    break;
                            }
                            
                            var idx = $(this).index();
                            
                            var homeUserinfo = msg.data.homeUser;
                            if(homeUserinfo.length == '0'){//租住特例
                                if(idx == '1'){
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                        'background':"url('../../img/xuanzhong.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                        'background':"url('../../img/bukedianji.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                }else{
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                        'background':"url('../../img/jinri.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                        'background':"url('../../img/zhuxiao.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                }
                            }else{
                                if(idx == '0'){
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                        'background':"url('../../img/xuanzhong.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                        'background':"url('../../img/bukedianji.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                        'background':"url('../../img/bukedianji.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    
                                }else if(idx == '1'){
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                        'background':"url('../../img/jinri.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                        'background':"url('../../img/zhuxiao.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                        'background':"url('../../img/bukedianji.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                }else{
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(1)").css({
                                        'background':"url('../../img/jinri.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(2)").css({
                                        'background':"url('../../img/bukedianji.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                    $(".yiwuyidang_bottom_div_ul_title ul li:nth-child(3)").css({
                                        'background':"url('../../img/zhuxiao.png') no-repeat",
                                        'background-size':'100% 100%'
                                    })
                                }
                            }

                        })
                        
                        function UserAllInfo(){
                            $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").html("")
                            for (const key in UserAll) {
                                if (UserAll.hasOwnProperty(key)) {
                                    if (UserAll[key] === null) {
                                        UserAll[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
                            let NewUserinfo = '';
                            $.each(UserAll, function (index, item) {
                                    var sexImg;
                                    if(item.gender == '男性'){
                                         sexImg= '../../img/nan.png';
                                    }else if(item.gender == '女性'){
                                        sexImg= '../../img/nv.png';
                                    }else{
                                        sexImg = '';
                                    }

                                    
                                    var carIco = '';
                                    var houseIco = '';
                                    var userAgeIco = '';
                                    var newStatusIco = '';

                                    if(item.carNum > '0'){
                                        carIco = `<b class="carIco"><img src="../../img/cheq.png">x${item.carNum}</b>`;
                                    }
                                    if(item.roomNum > '1'){
                                        houseIco = `<b class="houseIco"><img src="../../img/fangwu.png">x${item.roomNum}</b>`;
                                    }
                                    if(item.userAge >= 80 ){
                                        userAgeIco = `<b class="userAgeIco"><img src="../../img/gaoling.png"></b>`;
                                    }

                                    if(item.newStatus == '1'){//1是新人
                                        newStatusIco = `<b class="newStatusIco"><img src="../../img/xin.png"></b>`;
                                    }

                                NewUserinfo += `
                                    <li class="yiwuyidang_bottom_div_Onepeople" loudongClickOk="${loudongClickOk}" household_code=${item.household_code} household_name=${item.household_name}  room_code=${item.room_code} household_id=${item.household_id} phone=${item.phone}>
                                        <dl>
                                            <dt><img src="${item.face_url}" alt="" class="headImg"><img src="${sexImg}" alt="" class="sexImg"></dt>
                                            <dd>
                                                <h1><span title="${item.household_name}">${item.household_name}</span><b>${item.household_type}</b></h1>
                                                <h2>
                                                    <b class="zhongIco"><img src="../../img/zhong_new.png"></b>
                                                    <b class="teIco"><img src="../../img/te_new.png"></b>
                                                    ${newStatusIco}
                                                    ${userAgeIco}
                                                    ${houseIco}
                                                    ${carIco}
                                                </h2>
                                                <h3>户籍地：${item.register}</h3>
                                                <h3>常用开门：${item.openCommonly}</h3>
                                                <h3>近期开门：${item.openFuture}</h3>
                                            </dd>
                                        </dl>
                                    </li>`;
                                $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").html(NewUserinfo);

                            })
                            $.each(UserAll, function (index, item) {
                                $.each(item.label, function (index2, label2) {
                                    if (label2.types == '1') {//1重点 2关爱
                                        $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").find("li").eq(index).find('.zhongIco').css("display","block")
                                    } else if (label2.types == '2') {
                                        $(".yiwuyidang_bottom_div .yiwuyidang_bottom_div_ul").find('li').eq(index).find('.teIco').css("display","block")
                                    }
                                })
                            })


                            
                        }
                    })
                }
            },
            //一车一档
            onecarOnefiles: function (layerData, peopleData) {
                var OnepeopleOnepart = layerData.OnepeopleOnepart;
                var OnehouseOnepart = layerData.OnehouseOnepart;
                layerData.layer.close(OnepeopleOnepart)// 一人一档
                layerData.layer.close(OnehouseOnepart)//一屋一档

                layerData.layerYicheyidang = layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '20rem'],
                    zIndex:2000000, //层优先级
                    content: $('#yicheyidang'),
                    success: function () {
                        //初始化日期
                        $("#yicheyidang_start").val("");
                        $("#yicheyidang_end").val("");

                        //一车一档 ==> 车辆信息
                        Frontend.api.Ajax('/Webapi/renCarInfo', peopleData, function (msg) {
                            let Data = msg.data;
                            if (Data != "") {
                                var carData = {
                                    'carNo': Data.car_no,
                                }
                                //一车一档的标题
                                $(".yicheyidang .yicheyidang_title").html(Data.car_no);
                                let str = `<div class="yicheyidang_top_left">
                                    <img src="${Data.car_photo}" alt="">
                                    </div>
                                    <div class="yicheyidang_top_right">
                                        <div class="yicheyidang_top_right_title">
                                            <h1 class="yicheyidang_top_right_title_h1">${Data.car_no}</h1>
                                            <ul class="yicheyidang_top_right_title_ul">
                                                <li householdcode="${Data.household_code}" householdid="${Data.household_id}">一人一档</li>
                                            </ul>
                                        </div>
                                        <div class="yicheyidang_top_right_div">
                                            <div class="yicheyidang_top_right_div_l">
                                                <ul>
                                                    <li><b>车辆颜色：</b><span>${Data.color}</span></li>
                                                    <li><b>车辆使用人：</b><span>${Data.owner}</span></li>
                                                    <li><b>联系电话：</b><span>${Data.phone}</span></li>
                                                    <li><b>停车类型：</b><span>${Data.car_status}</span></li>
                                                    <li><b>居住地址：</b><span>${Data.address}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>`;
                                $(".yicheyidang  .yicheyidang_top").html(str);

                                if (Data.household_code == "" && Data.household_id == "") {
                                    $(".yicheyidang_top_right_title_ul").html("")
                                }
                            }

                            oneCarRecords(carData); //一车一档 ==> 通行记录
                            //点击搜索
                            $("#yicheyidang_btn").unbind('click').on("click", function () {
                                var yicheyidang_start, yicheyidang_end;
                                yicheyidang_start = $("#yicheyidang_start").val();
                                yicheyidang_end = $("#yicheyidang_end").val();
                                var carData = {
                                    'carNo': Data.car_no,
                                    'yicheyidang_start': yicheyidang_start,//开始时间
                                    'yicheyidang_end': yicheyidang_end//结束时间
                                }
                                oneCarRecords(carData);//一车一档 ==> 通行记录
                            })

                        })
                        //一车一档 ==> 通行记录

                        function oneCarRecords(carData) {
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'carNo': carData.carNo,
                                'startTime': carData.yicheyidang_start,//开始时间
                                'endTime': carData.yicheyidang_end//结束时间
                            }
                            let params = Frontend.api.getPostParams(dataNew);
                            layerData.table.render({
                                elem: '#yicheyidang_table',
                                // height: 660,
                                // width: 3900,
                                url: window.publicUrl+'/Webapi/renCarLogsInfo', //数据接口
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
                                limit: 5,
                                page: true, //开启分页
                                cols: [
                                    [ //表头
                                        { field: 'timeinfo', width: '15%', title: '出入时间' },
                                        { field: 'car_type', width: '8%', title: '出入类型' },
                                       // { field: '', width: '12%', title: '停车类型' },
                                        { field: 'address_town', width: '12%', title: '街道' },
                                        { field: 'address_village', width: '12%', title: '社区' },
                                        { field: 'community_name', width: '12%', title: '小区' },
                                        { field: 'portal_name', width: '12%', title: '抓拍位置' },
                                        { field: '', width: '8%', title: '操作', toolbar: '#yicheyidang_table_Demo' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#yicheyidang_table',
                                    mode: 'api',
                                    filters: [
                                        { field: 'car_type', name: 'accessType', type: 'checkbox', data: msg.data.car_type },
                                        //{ field: '', name: '', type: 'checkbox', },//停车类型
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name }
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('yicheyidang_table', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                            //监听工具条
                            layerData.table.on('tool(yicheyidang_table)', function (obj) {
                                var people_table = obj.data;
                                let empty = null;
                                for (const key in people_table) {//处理字符串null
                                    // console.log(key)
                                    if (people_table.hasOwnProperty(key)) {
                                        if (people_table[key] === null) {
                                            people_table[key] = "";
                                            empty = true;
                                        } else {
                                            empty = false;
                                        }
                                    }
                                }
                                if (obj.event === 'portal_name') {//抓拍照片
                                    layerData.layer.open({
                                        type: 1,
                                        title: false,
                                        closeBtn: 1,
                                        shadeClose: true,
                                        shade: 0.8,
                                        skin: 'onePeoplePushclass', //皮肤
                                        area: ['25rem', '18rem'],
                                        zIndex:2000000, //层优先级
                                        content: $('#oneCarPush_photo'),
                                        success: function () {
                                            var address = people_table.address_town + people_table.address_village + people_table.community_name + people_table.portal_name;
                                            var str = `<div class="oneCarPush_photo_title">车辆抓拍照片</div>
                                            <div class="oneCarPush_photo_top">
                                                <h1>车牌号：${people_table.car_no}</h1>
                                                <p><b>时&emsp;间：${people_table.timeinfo}</b><span><img src="../../img/weizhi.png">${address}</span></p>
                                            </div>
                                            <div class="oneCarPush_photo_bottom"><img src="${people_table.car_no_photo}" alt=""></div>`;
                                            $(".oneCarPush_photo").html(str);
                                        }
                                    })
                                }
                            })

                        }
                        //日期时间选择器
                        layerData.laydate.render({
                            elem: '#yicheyidang_start',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate()
                        });
                        layerData.laydate.render({
                            elem: '#yicheyidang_end',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate()
                        });
                        $(".yicheyidang_top").unbind("click").on("click", ".yicheyidang_top_right_title_ul li", function () {
                            var householdcode = $(this).attr("householdcode");
                            var householdid = $(this).attr("householdid");
                            var peopleData = {
                                household_code: householdcode,
                                household_id: householdid
                            }
                            LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档
                        })
                    }
                })
            },
            //echarts设置按钮（人口统计图标）
            echartsSet: function (layerData) {
                var isclick = true;//防止点击过快
                $(".header_right_shezhi").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var layerSet = layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'setChatInfoclass', //皮肤
                            area: ['30rem', '20rem'],
                            zIndex:2000000, //层优先级
                            content: $('#setChatInfoLayer'),
                            success: function () {
                                //选中复选框
                                var inputAll = $("#setChatInfoLayer input");
                                inputAll.removeAttr("checked");
                                var arr = ["图一", "图二", "图三", "图四", "主图"];
                                for (i = 1; i < 6; i++) {
                                    var content_div_all = i == "1" ? 'content_div' : "content_div" + i;
                                    var content_div_value = $('.' + content_div_all + '>.cont').attr("value");
                                    $("#setChatInfoLayer input[value='" + content_div_value + "']").each(function () {
                                        $(this).attr("checked", "checked");
                                        $(this).prop("checked", true);
                                        $(this).attr("title", arr[i - 1]);
                                        layerData.form.render();
                                    });
                                }

                                layerData.form.on('checkbox(checkboxDemo)', function (data) {
                                    var items = $(".setChatInfo :checkbox:checked").length;
                                    if (items > 5) {
                                        layerData.layer.msg('<span style="font-size: 0.3rem;">只能选择五个</span>')
                                        $(this)[0].checked = false;
                                        layerData.form.render();
                                        return false;
                                    } else {
                                        if ($(this).is(':checked')) {
                                            var arr = ['图四', '图三', '图二', '图一', '主图'];
                                            var arrlist = [];
                                            var arrNew = [];
                                            var arrChecked = $(".setChatInfo :checkbox:checked");
                                            $.each(arrChecked, function (index, value) {
                                                arrlist.push(value.title)
                                            })
                                            for (key in arr) {
                                                var stra = arr[key];
                                                var count = 0;
                                                for (var j = 0; j < arrlist.length; j++) {
                                                    var strb = arrlist[j];
                                                    if (stra == strb) {
                                                        count++;
                                                    }
                                                }
                                                if (count === 0) { //表示数组1的这个值没有重复的，放到arr3列表中  
                                                    arrNew.push(stra);
                                                }
                                            }
                                            var val;
                                            $.each(arrNew, function (index, value) {
                                                val = value;
                                            })
                                            $(this).each(function (index, item) {
                                                $(item).prop('checked', 'true');
                                                $(item).attr("title", val)
                                            });

                                        } else {
                                            $(this)[0].removeAttribute("title");//刪除title属性
                                            $(this)[0].removeAttribute("checked");//删除选中状态的属性
                                        }

                                        layerData.form.render();
                                        return false;
                                    }
                                });
                                //提交
                                layerData.form.on('submit(submitDemo)', function (data) {
                                    var items = $(".setChatInfo :checkbox:checked").length;
                                    if (items == 5) {
                                        $(this)[0].checked = false;
                                        layerData.form.render();

                                        var inputList = data.form;
                                        var lable_zhu, name_zhu, lable_1, name_1, lable_2, name_2, lable_3, name_3, lable_4, name_4;

                                        $.each(inputList, function (idx, val) {
                                            if (val.title == "主图") {
                                                lable_zhu = val.value;
                                                name_zhu = val.name;
                                            } else if (val.title == "图一") {
                                                lable_1 = val.value;
                                                name_1 = val.name;
                                            } else if (val.title == "图二") {
                                                lable_2 = val.value;
                                                name_2 = val.name;
                                            } else if (val.title == "图三") {
                                                lable_3 = val.value;
                                                name_3 = val.name;
                                            } else if (val.title == "图四") {
                                                lable_4 = val.value;
                                                name_4 = val.name;
                                            }
                                        })
                                        var obj = {};
                                        obj[name_1] = lable_1
                                        obj[name_2] = lable_2
                                        obj[name_3] = lable_3
                                        obj[name_4] = lable_4
                                        obj[name_zhu] = lable_zhu

                                        data.field = obj;

                                        let field = JSON.stringify(data.field);
                                        let dataField = {
                                            'homePage': field
                                        }
                                        Frontend.api.Ajax('/Webapi/userHomeSave', dataField, function (msg) {
                                            var setData = msg.data;
                                            //提交
                                            LayerTable.api.setSubmit(setData);
                                        })
                                        layerData.layer.close(layerSet)//关闭设置弹层
                                        return false;
                                    } else {
                                        layerData.layer.msg('<span style="font-size: 0.3rem;">必须选中五个</span>')
                                        return false;
                                    }
                                });
                                //重新选择
                                $("#reset").on("click", function () {
                                    $('.setChatInfo input').attr("title", "");
                                    $('.setChatInfo input').removeAttr('checked');

                                    var arr = ["图一", "图二", "图三", "图四", "主图"];
                                    for (i = 1; i < 6; i++) {
                                        var content_div_all = i == "1" ? 'content_div' : "content_div" + i;
                                        var content_div_value = $('.' + content_div_all + '>.cont').attr("value");
                                        $("#setChatInfoLayer input[value='" + content_div_value + "']").each(function () {
                                            $(this).attr("checked", "checked");
                                            $(this).prop("checked", true);
                                            $(this).attr("title", arr[i - 1]);
                                            layerData.form.render();
                                        });
                                    }
                                    layerData.form.render();
                                })
                                //取消
                                $(".buttonInfo #cancel").on("click", function () {
                                    $('.setChatInfo input').attr("title", "");
                                    $('.setChatInfo input').removeAttr('checked');
                                    layerData.layer.close(layerSet)//关闭设置弹层
                                })

                            },
                            end: function () {
                                $('.setChatInfo input').attr("title", "");
                                $('.setChatInfo input').removeAttr('checked');
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },
            //设置提交
            setSubmit: function (setData) {
                $(".cont").siblings('.main').remove();
                var str = `<div></div>`;
                $(".content_div .cont").html(str);
                $(".content_div2 .cont").html(str);
                $(".content_div3 .cont").html(str);
                $(".content_div4 .cont").html(str);
                $(".content_div5 .cont").html(str);
                var sexHtml = `<p class="chartTitle">性别统计
                            <em>
                                <span><b></b>未登记</span>
                                <span><b></b>女</span>
                                <span><b></b>男</span>
                            </em>

                        </p>
                        <div class="barBox">
                            <div class="progressBar">
                                <div class="men"></div>
                                <div class="women"></div>
                                <div class="other"></div>
                            </div>
                            <div class="background"></div>
                        </div>
                        <table class="table-no-bordered sexRatio">
                            <thead>
                                <tr>
                                    <th>性别</th>
                                    <th>人数</th>
                                    <th>占比</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>男</td>
                                    <td>4328</td>
                                    <td>45%</td>
                                </tr>
                                <tr>
                                    <td>女</td>
                                    <td>4328</td>
                                    <td>45%</td>
                                </tr>
                                <tr>
                                    <td>未登记</td>
                                    <td>4328</td>
                                    <td>10%</td>
                                </tr>
                            </tbody>
                        </table>`;
                var permanentHtml = `<div id="permanent"></div><div id="permanent_month"></div>`;
                var permanentMain = `<div class="main">
                                        <ul class="main_ul_1" id="main_ul_1">
                                            <li class="on">年</li>
                                            <li>月</li>
                                            <b id="population">...</b>
                                        </ul>
                                        </div>`;

                $.each(setData, function (idx, val) {
                    // console.log(idx)
                    // console.log(val)
                    // console.log(val.id)
                    // console.log(setData[0].id)
                    //idx 为索引值 ==> 可以以此来判断要放的位置
                    let valIndex = val.value; //获取唯一标识
                    // console.log(val.value)
                    //给每一个图标添加唯一标识

                    // let str = idx == '0' ? ".content_div" : ".content_div" + (idx+1);

                    if (idx == '0') {
                        $(".content_div .cont").attr('value', valIndex);
                        $(".content_div .cont>div").attr('id', setData[0].id);
                    } else if (idx == '1') {
                        $(".content_div2 .cont").attr('value', valIndex);
                        $(".content_div2 .cont>div").attr('id', setData[1].id);
                    } else if (idx == '2') {
                        $(".content_div3 .cont").attr('value', valIndex);
                        $(".content_div3 .cont>div").attr('id', setData[2].id);
                    } else if (idx == '3') {
                        $(".content_div4 .cont").attr('value', valIndex);
                        $(".content_div4 .cont>div").attr('id', setData[3].id);
                    } else if (idx == '4') {
                        $(".content_div5 .cont").attr('value', valIndex);
                        $(".content_div5 .cont>div").attr('id', setData[4].id);
                    }

                    if (val.value == '13') {
                        // console.log('性别统计')
                        // console.log(idx)

                        if (idx == '0') {
                            $(".content_div .cont>div").html(sexHtml);
                        } else if (idx == '1') {
                            $(".content_div2 .cont>div").html(sexHtml);
                        } else if (idx == '2') {
                            $(".content_div3 .cont>div").html(sexHtml);
                        } else if (idx == '3') {
                            $(".content_div4 .cont>div").html(sexHtml);
                        } else if (idx == '4') {
                            $(".content_div5 .cont>div").html(sexHtml);
                        }

                    } else if (val.value == '9') {
                        // console.log('常住、流动人口');

                        if (idx == '0') {
                            $(".content_div").append(permanentMain);
                            $(".content_div .cont").html(permanentHtml);
                        } else if (idx == '1') {
                            $(".content_div2").append(permanentMain);
                            $(".content_div2 .cont").html(permanentHtml);
                        } else if (idx == '2') {
                            $(".content_div3").append(permanentMain);
                            $(".content_div3 .cont").html(permanentHtml);
                        } else if (idx == '3') {
                            $(".content_div4").append(permanentMain);
                            $(".content_div4 .cont").html(permanentHtml);
                        } else if (idx == '4') {
                            $(".content_div5").append(permanentMain);
                            $(".content_div5 .cont").html(permanentHtml);
                        }
                    };

                    eval("EchartTable.api." + val.id + "()");
                })
            },
            //人员告警列表
            peoplewarnInfo: function (layerData) {
                //人员告警(全部)
                var isclick = true;//防止点击过快
                $("#peoplewarnInfo").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        LayerTable.api.peoplewarnInfoCommon(layerData)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                });

                //特殊人群告警
                $(".warnList .warnListSpecial dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '5';//特殊人群（关爱）
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListSpecial .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '5';//特殊人群（关爱）
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListSpecial .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '5';//特殊人群（关爱）
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

                //重点人员告警
                $(".warnList .warnListEmphasis dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '3,12';//重点人员告警
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListEmphasis .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '3,12';//重点人员告警
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListEmphasis .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '3,12';//重点人员告警
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

                //SOS告警
                $(".warnList .warnListSos dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '7';//SOS告警
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListSos .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '7';//SOS告警
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListSos .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '7';//SOS告警
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

                //黑名单告警
                $(".warnList .warnListBlack dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '11,13';//黑名单告警
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListBlack .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '11,13';//黑名单告警
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListBlack .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '11,13';//黑名单告警
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

                //可疑人员出入
                $(".warnList .warnListMarkedMan dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '15';//可疑人员出入
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListMarkedMan .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '15';//可疑人员出入
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListMarkedMan .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '15';//可疑人员出入
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.peoplewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

            },
            //人员告警列表（公共部分）
            peoplewarnInfoCommon: function (layerData, warnType, isAct) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'peopleNumclass', //皮肤
                    area: ['36rem', '16.8rem'],
                    zIndex:2000000, //层优先级
                    content: $('#people_layer'),
                    success: function () {
                        //初始化日期
                        $("#people_table_start").val("");
                        $("#people_table_end").val("");
                        $("#people_layer_right_input").val("");


                        var people_table_start, people_table_end, keyword;
                        peoplewarnInfoList();
                        //点击搜索
                        $("#people_layer_btn").unbind("click").on("click", function () {
                            people_table_start = $("#people_table_start").val();
                            people_table_end = $("#people_table_end").val();
                            keyword = $("#people_layer_right_input").val();

                            var date_start = new Date(people_table_start);
                            var date_end = new Date(people_table_end);
                            var people_table_start_time = date_start.getTime();
                            var people_table_end_time = date_end.getTime();

                            if (people_table_start_time > people_table_end_time) {
                                return layerData.layer.msg('输入日期错误');
                            } else {
                                peoplewarnInfoList();//人员告警列表
                            }
                        })
                        function peoplewarnInfoList() {
                            let dataNew = {
                                'pageSize': '10',//每页显示的数量
                                'warnTypesInfo': '1',//1人员告警列表；2房屋告警列表；3设备告警列表
                                'startTime': people_table_start,//开始时间
                                'endTime': people_table_end,//结束时间
                                'keyword': keyword,//姓名搜索

                                'warnType': warnType,//指定类型查询
                                'isAct': isAct//指定状态查询
                            }
                            let params = Frontend.api.getPostParams(dataNew);
                            layerData.table.render({
                                elem: '#people_table',
                                // height: 1050,
                                // width: 3500,
                                url: window.publicUrl+'/Webapi/warnListInfo', //数据接口
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
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: ''},
                                        { field: 'addtime', width: '13%', title: '告警时间',  },
                                        {
                                            field: 'warn_type_user', width: '10%', title: '告警类型', templet: function (data) {
                                                // 类型
                                                // 1群租房预警
                                                // 2出租房屋空置告警
                                                // 3重点人员告警：出入即时报警
                                                // 4重点人员告警：出入规律监控
                                                // 5关爱人员告警
                                                // 6设备告警：门禁常开告警
                                                // 7SOS报警
                                                // 8烟感
                                                // 9陌生人出入告警
                                                // 10陌生人一周x次出入
                                                // 11黑名单
                                                // 12监控重点出入告警
                                                // 13监控黑名单
                                                if (data.warn_type == '1') {
                                                    return data.warn_type_user = '群租房预警';
                                                } else if (data.warn_type == '2') {
                                                    return data.warn_type_user = '出租房屋空置告警';
                                                } else if (data.warn_type == '3') {
                                                    return data.warn_type_user = '重点人员告警：出入即时报警';
                                                } else if (data.warn_type == '4') {
                                                    return data.warn_type_user = '重点人员告警：出入规律监控';
                                                } else if (data.warn_type == '5') {
                                                    return data.warn_type_user = '关爱人员告警';
                                                } else if (data.warn_type == '6') {
                                                    return data.warn_type_user = '设备告警：门禁常开告警';
                                                } else if (data.warn_type == '7') {
                                                    return data.warn_type_user = 'SOS报警';
                                                } else if (data.warn_type == '8') {
                                                    return data.warn_type_user = '烟感';
                                                } else if (data.warn_type == '9') {
                                                    return data.warn_type_user = '陌生人出入告警';
                                                } else if (data.warn_type == '10') {
                                                    return data.warn_type_user = '陌生人一周x次出入';
                                                } else if (data.warn_type == '11') {
                                                    return data.warn_type_user = '黑名单';
                                                } else if (data.warn_type == '12') {
                                                    return data.warn_type_user = '监控重点出入告警';
                                                } else if (data.warn_type == '13') {
                                                    return data.warn_type_user = '监控黑名单';
                                                } else if (data.warn_type == '15') {
                                                    return data.warn_type_user = '可疑人员出入告警';
                                                }
                                            }
                                        },
                                        { field: 'reason', width: '8%', title: '告警原因' },
                                        { field: 'open_username', width: '7%', title: '告警人员', event: 'open_username', style: 'color: #00ffff !important;cursor:pointer' },
                                        { field: 'address_town', width: '11%', title: '街道' },
                                        { field: 'address_village', width: '12%', title: '社区' },
                                        { field: 'community_name', width: '8%', title: '小区' },
                                        { field: 'open_useraddress', width: '8%', title: '告警地点' },
                                        {
                                            field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                                // 处理状态：0：未处理，1：处理中，2：已处理
                                                if (data.is_act == '0') {
                                                    return data.is_act = '未处理';
                                                } else if (data.is_act == '1') {
                                                    return data.is_act = '处理中';
                                                } else if (data.is_act == '2') {
                                                    return data.is_act = '已处理';
                                                }
                                            }
                                        },
                                        { field: '', width: '4%', title: '操作', toolbar: '#people_table_Demo' },
                                    ]
                                ],
                                limit: 10,
                                done: function (res, curr, count) {
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                    // console.log("监听where:", this.where);
                                    // //非常重要！如果使table.reload()后依然使用过滤，就必须将过滤组件也reload()一下
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#people_table',
                                    mode: 'api',
                                    filters: [
                                        { field: 'warn_type_user', name: 'warnType', type: 'checkbox', data: msg.data.warn_type_user },
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                        { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act }
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        keyword = $("#people_layer_right_input").val();
                                        layerData.table.reload('people_table', {
                                            where: { //设定异步数据接口的额外参数，任意设
                                                keyword: keyword,
                                            },
                                            page: 1
                                        })

                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                            // 日期时间选择器
                            layerData.laydate.render({
                                elem: '#people_table_start',
                                type: 'datetime',
                                max: LayerTable.api.getNowFormatDate()
                            });
                            layerData.laydate.render({
                                elem: '#people_table_end',
                                type: 'datetime',
                                max: LayerTable.api.getNowFormatDate()
                            });
                            //监听工具条
                            layerData.table.on('tool(people_table)', function (obj) {
                                var people_table = obj.data;
                                let empty = null;
                                for (const key in people_table) {//处理字符串null
                                    // console.log(key)
                                    if (people_table.hasOwnProperty(key)) {
                                        if (people_table[key] === null) {
                                            people_table[key] = "";
                                            empty = true;
                                        } else {
                                            empty = false;
                                        }
                                    }
                                }
                                if (obj.event === 'people_table_lock') {
                                    if (people_table.warn_type == '5') {//==>5 关爱人员告警(特殊人群)
                                        LayerTable.api.peoplewarn_care(layerData, people_table);
                                    } else if (people_table.warn_type == '3') {//3重点人员告警：出入即时报警
                                        LayerTable.api.comeIntime(layerData, people_table)
                                    } else if (people_table.warn_type == '4') {//4重点人员告警：出入规律报警
                                        // LayerTable.api.comeInlaw(layerData,people_table)
                                    } else if (people_table.warn_type == '7') {//7  SOS告警
                                        LayerTable.api.soswarn(layerData, people_table)
                                    } else if (people_table.warn_type == '11') {//11  黑名单告警
                                        LayerTable.api.blackwarn(layerData, people_table)
                                    } else if (people_table.warn_type == '12') {//12 监控重点出入告警
                                        LayerTable.api.comeIntime(layerData, people_table)
                                    } else if (people_table.warn_type == '13') {//13 监控黑名单
                                        LayerTable.api.blackwarn(layerData, people_table)
                                    } else if (people_table.warn_type == '15') {//15 可疑人员出入告警
                                        LayerTable.api.comeIntime(layerData, people_table)
                                    }
                                }

                                if (obj.event === 'open_username') {//告警人员
                                    if (people_table.warn_type == "3" || people_table.warn_type == "4" || people_table.warn_type == "5" || people_table.warn_type == "7" || people_table.warn_type == "15") {
                                        //3重点人员告警：出入即时报警
                                        // 4重点人员告警：出入规律监控
                                        // 5关爱人员告警
                                        // 7SOS报警
                                        //15 可疑人员告警
                                        LayerTable.api.onepeopleOnefiles(layerData, people_table); // 一人一档
                                    }

                                }

                            });
                        }
                    },
                    end: function () { }
                })
            },
            //人员告警详情 ==>5 关爱人员告警(特殊人群)
            peoplewarn_care: function (layerData, people_table) {
                layerData.PeopleWarn_teshu = layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '20rem'],
                    zIndex:2000000, //层优先级
                    content: $('#guanairenyuan'),
                    success: function () {
                        var househodeData = {
                            'householdId': people_table.household_id,
                            'warnId':people_table.id
                        }  
                        Frontend.api.Ajax('/Webapi/userWarnInfomation', househodeData, function (msg) {

                            let Data = msg.data;
                            var householdInfo = Data.householdInfo;//人员信息
                            var warnInfo = Data.warnInfo;//告警信息

                            let empty = null;
                            for (const key in householdInfo) {
                                if (householdInfo.hasOwnProperty(key)) {
                                    if (householdInfo[key] === null) {
                                        householdInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
                            for (const key in warnInfo) {
                                if (warnInfo.hasOwnProperty(key)) {
                                    if (warnInfo[key] === null) {
                                        warnInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
    
                            if (Data == null) {
                                $('.guanairenyuan_right_title_ul').html('');
                                $(".guanairenyuan_top_left").html('');
                                return false;
                            } else {
                                Household_Info()//人员信息
                                Warn_Info()//告警信息
                            }  

                            //----------------人员信息--------------------------
                            function Household_Info(){
                                $(".guanairenyuan_top_right_name").html(householdInfo.household_name);
                                $(".guanairenyuan_top_left").html(`<img src="${householdInfo.imageOne}" alt="">`);
                                $(".guanairenyuan_top_right_title_ul").html(`<li class="guanairenyuan_top_oneHouse" roomCode="${householdInfo.room_code}">一屋一档</li><li class="guanairenyuan_top_oneCar" userPhone="${householdInfo.phone}" userName="${householdInfo.household_name}">一车一档</li>`)

                                if (householdInfo.carInfo == '0') {//0没车；1有车
                                    $(".guanairenyuan_top_oneCar").hide();
                                }
                                if (householdInfo.room_code == '' || householdInfo.room_code == '0') {//判断一屋一档
                                    $(".guanairenyuan_top_oneHouse").hide();
                                }
                                $.each(householdInfo.label, function (idx, lab) {
                                    if(lab.length == '0'){
                                        $(".guanairenyuan_top_right_title_ul2 .jingshenbing").hide();
                                        $(".guanairenyuan_top_right_title_ul2 .gugua").hide();
                                    }else{
                                        if (lab.types == '1') {//1重点2特殊
                                            $(".guanairenyuan_top_right_title_ul2 .jingshenbing").show();
                                            $(".guanairenyuan_top_right_title_ul2 .jingshenbing").html(lab.labelName);
    
                                        } else if (lab.types == '2') {
                                            $(".guanairenyuan_top_right_title_ul2 .gugua").show();
                                            $(".guanairenyuan_top_right_title_ul2 .gugua").html(lab.labelName);
                                        }
                                    }
                                })
                            }
                            //----------------告警信息--------------------------
                            function Warn_Info(){
                                if (warnInfo.is_act == '0') {
                                    warnInfo.is_act = '未处理';
                                } else if (warnInfo.is_act == '1') {
                                    warnInfo.is_act = '处理中';
                                } else if (warnInfo.is_act == '2') {
                                    warnInfo.is_act = '已处理';
                                }
                                $(".guanairenyuan_title").html('关爱人员告警');//类型标题
                                let peoplewarnDate = `
                                    <div class="guanairenyuan_top_right_div_l">
                                        <ul>
                                            <li><b>发生原因：</b><span>${warnInfo.reason}</span></li>
                                            <li><b>发生时间：</b><span>${warnInfo.addtime}</span></li>
                                            <li><b>位&emsp;&emsp;置：</b><span>${warnInfo.open_useraddress}</span></li>
                                            <li><b>状&emsp;&emsp;态：</b><span>${warnInfo.is_act}</span></li>
                                        </ul>
                                    </div>
                                    <div class="guanairenyuan_top_right_div_r">
                                        <h1 id="guanairenyuan_top_right_div_r_h1">处理信息<span><img src="../../img/gengduo.png" alt=""></span></h1>
                                        <div class="guanairenyuan_top_right_div_r_div" style="display:none">
                                            <div class="guanairenyuan_top_right_div_r_1">
                                                <ul>
                                                    <li><b>完成时间：</b><span>${warnInfo.act_time}</span></li>
                                                    <li><b>处理人员：</b><span>${warnInfo.act_finish_username}</span></li>
                                                    <li><b>处理结果：</b><span>${warnInfo.reason_feedback}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    `;
        
                                $(".guanairenyuan_top_right_div").html(peoplewarnDate)
        
                                //更多信息点击事件
                                $(".guanairenyuan").unbind('click').on("click", '#guanairenyuan_top_right_div_r_h1', function () {
                                    $(".guanairenyuan_top_right_div_r_div").slideToggle(0, function () {
                                        if ($(this).is(':hidden')) {
                                            $('#guanairenyuan_top_right_div_r_h1>span').find('img').css("transform", "rotate(180deg)");
                                        } else {
                                            $('#guanairenyuan_top_right_div_r_h1>span').find('img').css("transform", "rotate(0deg)");
                                        }
                                    });
                                })
                            }
                        
                        })
                        peoplewarn_careList();//关爱人员告警列表
                        function peoplewarn_careList() {
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'householdId': people_table.household_id,//人员id
                                'warnTypesInfo': '1'
                            }
                            let params = Frontend.api.getPostParams(dataNew);

                            layerData.table.render({
                                elem: '#guanairenyuan_table_go',
                                // height: 660,
                                // width: 3900,
                                url: window.publicUrl+'/Webapi/warnListInfo', //数据接口
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
                                limit: 5,
                                page: true, //开启分页
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: '' },
                                        { field: 'addtime', width: '13%', title: '发生时间' },
                                        { field: 'address_town', width: '10%', title: '街道' },
                                        { field: 'address_village', width: '12%', title: '社区' },
                                        { field: 'community_name', width: '10%', title: '小区' },
                                        { field: 'open_useraddress', width: '10%', title: '位置' },
                                        {
                                            field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                                // 处理状态：0：未处理，1：处理中，2：已处理
                                                if (data.is_act == '0') {
                                                    return data.is_act = '未处理';
                                                } else if (data.is_act == '1') {
                                                    return data.is_act = '处理中';
                                                } else if (data.is_act == '2') {
                                                    return data.is_act = '已处理';
                                                }
                                            }
                                        },
                                        { field: 'act_username', width: '6%', title: '处理人员' },
                                        { field: 'reason_feedback', width: '10%', title: '处理结果' },
                                        { field: 'act_time', width: '13%', title: '完成时间' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#guanairenyuan_table_go',
                                    mode: 'api',
                                    filters: [
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                        { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act },
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('guanairenyuan_table_go', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                        }
                    }
                })
                //点击一屋一档进入一屋一档详情 (注：点击一屋一档和一车一档两者只能加一个unbind("click"))
                $(".guanairenyuan_top_right").unbind("click").on("click", ".guanairenyuan_top_oneHouse", function () {
                    var roomCode = $(this).attr("roomCode");
                    var peopleData = {
                        'roomCode': roomCode,
                    };
                    LayerTable.api.onehouseOnefiles(layerData, peopleData); //一屋一档
                })
                //点击一车一档进入一车一档详情
                $(".guanairenyuan_top_right").on("click", ".guanairenyuan_top_oneCar", function () {
                    var userPhone = $(this).attr("userPhone");
                    var userName = $(this).attr("userName");
                    var peopleData = {
                        'userPhone': userPhone,
                        'userName': userName,
                    };
                    LayerTable.api.onecarOnefiles(layerData, peopleData); //一车一档
                })

            },
            //人员告警详情 ==>7 SOS告警
            soswarn: function (layerData, people_table) {
                layerData.SOSWarn = layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '20rem'],
                    zIndex:2000000, //层优先级
                    content: $('#sos'),
                    success: function () {

                        var househodeData = {
                            'householdId': people_table.household_id,
                            'warnId':people_table.id
                        }  
                        Frontend.api.Ajax('/Webapi/userWarnInfomation', househodeData, function (msg) {
                            let Data = msg.data;
                            var householdInfo = Data.householdInfo;//人员信息
                            var warnInfo = Data.warnInfo;//告警信息

                            let empty = null;
                            for (const key in householdInfo) {
                                if (householdInfo.hasOwnProperty(key)) {
                                    if (householdInfo[key] === null) {
                                        householdInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
                            for (const key in warnInfo) {
                                if (warnInfo.hasOwnProperty(key)) {
                                    if (warnInfo[key] === null) {
                                        warnInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
    
                            if (Data == null) {
                                $('.sos_top_right_title_ul').html('');
                                $(".sos_top_left").html('');
                                return false;
                            } else {
                                Household_Info()//人员信息
                                Warn_Info()//告警信息
                            }  

                            //----------------人员信息--------------------------
                            function Household_Info(){

                                $(".sos_top_right_name").html(householdInfo.household_name);
                                $(".sos_top_left").html(`<img src="${householdInfo.imageOne}" alt="">`);
                                $(".sos_top_right_title_ul").html(`<li class="sos_top_oneHouse" roomCode="${householdInfo.room_code}">一屋一档</li><li class="sos_top_oneCar" userPhone="${householdInfo.phone}" userName="${householdInfo.household_name}">一车一档</li>`)

                                if (householdInfo.carInfo == '0') {//0没车；1有车
                                    $(".sos_top_oneCar").hide();
                                }
                                if (householdInfo.room_code == '' || householdInfo.room_code == '0') {//判断一屋一档
                                    $(".sos_top_oneHouse").hide();
                                }
                                $.each(householdInfo.label, function (idx, lab) {
                                    if(lab.length == '0'){
                                        $(".sos_top_right_title_ul2 .jingshenbing").hide();
                                        $(".sos_top_right_title_ul2 .gugua").hide();
                                    }else{
                                        if (lab.types == '1') {//1重点2特殊
                                            $(".sos_top_right_title_ul2 .jingshenbing").show();
                                            $(".sos_top_right_title_ul2 .jingshenbing").html(lab.labelName);
    
                                        } else if (lab.types == '2') {
                                            $(".sos_top_right_title_ul2 .gugua").show();
                                            $(".sos_top_right_title_ul2 .gugua").html(lab.labelName);
                                        }
                                    }
                                    
                                })
                            }

                            //----------------告警信息--------------------------
                            function Warn_Info(){
                                if (warnInfo.is_act == '0') {
                                    warnInfo.is_act = '未处理';
                                } else if (warnInfo.is_act == '1') {
                                    warnInfo.is_act = '处理中';
                                } else if (warnInfo.is_act == '2') {
                                    warnInfo.is_act = '已处理';
                                }
                                $(".sos_title").html('SOS报警');//类型标题
                                let peoplewarnDate = `
                                    <div class="sos_top_right_div_l">
                                        <ul>
                                            <li><b>发生原因：</b><span>${warnInfo.reason}</span></li>
                                            <li><b>发生时间：</b><span>${warnInfo.addtime}</span></li>
                                            <li><b>地&emsp;&emsp;址：</b><span>${warnInfo.open_useraddress}</span></li>
                                            <li><b>状&emsp;&emsp;态：</b><span>${warnInfo.is_act}</span></li>
                                        </ul>
                                    </div>
                                    <div class="sos_top_right_div_r">
                                        <h1 id="sos_top_right_div_r_h1">处理信息<span><img src="../../img/gengduo.png" alt=""></span></h1>
                                        <div class="sos_top_right_div_r_div" style="display:none">
                                            <div class="sos_top_right_div_r_1">
                                                <ul>
                                                    <li><b>完成时间：</b><span>${warnInfo.act_time}</span></li>
                                                    <li><b>处理人员：</b><span>${warnInfo.act_finish_username}</span></li>
                                                    <li><b>处理结果：</b><span>${warnInfo.reason_feedback}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    `;
        
                                $(".sos_top_right_div").html(peoplewarnDate)
        
                                //更多信息点击事件
                                $(".sos").unbind('click').on("click", '#sos_top_right_div_r_h1', function () {
                                    $(".sos_top_right_div_r_div").slideToggle(0, function () {
                                        if ($(this).is(':hidden')) {
                                            $('#sos_top_right_div_r_h1>span').find('img').css("transform", "rotate(180deg)");
                                        } else {
                                            $('#sos_top_right_div_r_h1>span').find('img').css("transform", "rotate(0deg)");
                                        }
                                    });
                                })
                            }


                        })      

                        peoplewarn_sos();//关爱人员告警列表
                        function peoplewarn_sos() {
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'householdId': people_table.household_id,//人员id
                                'warnTypesInfo': '1'
                            }
                            let params = Frontend.api.getPostParams(dataNew);

                            layerData.table.render({
                                elem: '#sos_table_go',
                                // height: 660,
                                // width: 3900,
                                url: window.publicUrl+'/Webapi/warnListInfo', //数据接口
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
                                limit: 5,
                                page: true, //开启分页
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: '' },
                                        { field: 'addtime', width: '13%', title: '告警时间' },
                                        {
                                            field: 'warn_type', width: '13%', title: '告警类型', templet: function (data) {
                                                // 类型
                                                // 1群租房预警
                                                // 2出租房屋空置告警
                                                // 3重点人员告警：出入即时报警
                                                // 4重点人员告警：出入规律监控
                                                // 5关爱人员告警
                                                // 6设备告警：门禁常开告警
                                                // 7SOS报警
                                                // 8烟感
                                                // 9陌生人出入告警
                                                // 10陌生人一周x次出入
                                                // 11黑名单
                                                if (data.warn_type == '1') {
                                                    return data.warn_type = '群租房预警';
                                                } else if (data.warn_type == '2') {
                                                    return data.warn_type = '出租房屋空置告警';
                                                } else if (data.warn_type == '3') {
                                                    return data.warn_type = '重点人员告警：出入即时报警';
                                                } else if (data.warn_type == '4') {
                                                    return data.warn_type = '重点人员告警：出入规律监控';
                                                } else if (data.warn_type == '5') {
                                                    return data.warn_type = '关爱人员告警';
                                                } else if (data.warn_type == '6') {
                                                    return data.warn_type = '设备告警：门禁常开告警';
                                                } else if (data.warn_type == '7') {
                                                    return data.warn_type = 'SOS报警';
                                                } else if (data.warn_type == '8') {
                                                    return data.warn_type = '烟感';
                                                } else if (data.warn_type == '9') {
                                                    return data.warn_type = '陌生人出入告警';
                                                } else if (data.warn_type == '10') {
                                                    return data.warn_type = '陌生人一周x次出入';
                                                } else if (data.warn_type == '11') {
                                                    return data.warn_type = '黑名单';
                                                }
                                            }
                                        },
                                        { field: 'reason', width: '8%', title: '告警原因' },
                                        { field: 'open_username', width: '6%', title: '告警人员' },
                                        { field: 'address_town', width: '10%', title: '街道' },
                                        { field: 'address_village', width: '12%', title: '社区' },
                                        { field: 'community_name', width: '10%', title: '小区' },
                                        { field: 'open_useraddress', width: '15%', title: '告警地点' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#sos_table_go',
                                    mode: 'api',
                                    filters: [
                                        { field: 'warn_type', name: 'warnType', type: 'checkbox', data: msg.data.warn_type },
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('sos_table_go', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                        }
                    }
                })

                //点击一车一档进入一车一档详情 (注：点击一屋一档和一车一档两者只能加一个unbind("click"))
                $(".sos_top_right").unbind("click").on("click", ".sos_top_oneCar", function () {
                    var userPhone = $(this).attr("userPhone");
                    var userName = $(this).attr("userName");
                    var peopleData = {
                        'userPhone': userPhone,
                        'userName': userName,
                    };
                    LayerTable.api.onecarOnefiles(layerData, peopleData); //一车一档
                })
                //点击一屋一档进入一屋一档详情
                $(".sos_top_right").on("click", ".sos_top_oneHouse", function () {
                    var roomCode = $(this).attr("roomCode");
                    var peopleData = {
                        'roomCode': roomCode,
                    };
                    LayerTable.api.onehouseOnefiles(layerData, peopleData); //一屋一档
                })
            },
            //人员告警详情 ==>11 黑名单告警
            blackwarn: function (layerData, people_table) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '11rem'],
                    zIndex:2000000, //层优先级
                    content: $('#black'),
                    success: function () {
                        var househodeData = {
                            'householdId': people_table.household_id,
                            'warnId':people_table.id
                        }  
                        $('.black_top_right_title_ul').show();
                        $('.black_top_right_title_ul').html('');
                        $(".black_top_left").html('');
                        Frontend.api.Ajax('/Webapi/userWarnInfomation', househodeData, function (msg) {

                            let Data = msg.data;
                            var householdInfo = Data.householdInfo;//人员信息
                            var warnInfo = Data.warnInfo;//告警信息

                            let empty = null;
                            for (const key in householdInfo) {
                                if (householdInfo.hasOwnProperty(key)) {
                                    if (householdInfo[key] === null) {
                                        householdInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
                            for (const key in warnInfo) {
                                if (warnInfo.hasOwnProperty(key)) {
                                    if (warnInfo[key] === null) {
                                        warnInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }

                            if (Data == null) {
                                $('.black_top_right_title_ul').html('');
                                $(".black_top_left").html('');
                                return false;
                            } else {
                                Household_Info()//人员信息
                                Warn_Info()//告警信息
                            }

                            //----------------人员信息--------------------------
                            function Household_Info(){
                                $(".black_top_right_name").html(householdInfo.household_name);
                                $(".black_top_left").html(`<img src="${householdInfo.imageOne}" alt=""><img src="${householdInfo.imageTwo}" alt=""><b>相似度${parseInt(householdInfo.likedegree)}%</b>`);
                                $(".black_top_right_title_ul").append(`<li class="black_top_oneHouse" roomCode="${householdInfo.room_code}">一屋一档</li><li class="black_top_oneCar" userPhone="${householdInfo.phone}" userName="${householdInfo.household_name}">一车一档</li>`)
                                if (householdInfo.carInfo == '0') {//0没车；1有车
                                    $(".black_top_oneCar").hide();
                                }
                                if (householdInfo.room_code == '' || householdInfo.room_code == '0') {//判断一屋一档
                                    $(".black_top_oneHouse").hide();
                                }

                                if (householdInfo.level == '') {
                                    $(".black_top_right_title_ul3 .tongjifan").hide();
                                } else {
                                    $(".black_top_right_title_ul3 .tongjifan").html(`${householdInfo.level}`);
                                }

                                $.each(householdInfo.label, function (idx, lab) {
                                    if(lab.length == '0'){
                                        $(".black_top_right_title_ul2 .jingshenbing").hide();
                                        $(".black_top_right_title_ul2 .gugua").hide();
                                    }else{                                                                                    
                                        if (lab.types == '1') {//1重点2特殊
                                            $(".black_top_right_title_ul2 .jingshenbing").show();
                                            $(".black_top_right_title_ul2 .jingshenbing").html(lab.labelName);
                                        } else if (lab.types == '2') {
                                            $(".black_top_right_title_ul2 .gugua").show();
                                            $(".black_top_right_title_ul2 .gugua").html(lab.labelName);
                                        }
                                    }
                                })
                                
                            }
                            //----------------告警信息--------------------------
                            function Warn_Info(){
                                if (warnInfo.is_act == '0') {
                                    warnInfo.is_act = '未处理';
                                } else if (warnInfo.is_act == '1') {
                                    warnInfo.is_act = '处理中';
                                } else if (warnInfo.is_act == '2') {
                                    warnInfo.is_act = '已处理';
                                }
                                if(warnInfo.warn_type == '11'){
                                    $(".black_title").html('黑名单告警');//类型标题
                                }else if(warnInfo.warn_type == '13'){
                                    $(".black_title").html('监控黑名单告警');//类型标题
                                }
                                if (warnInfo.room_code = '0') {//room_code为0时 没有一屋一挡
                                    $(".black_top_oneHouse").hide();
                                }

                                if(warnInfo.warn_type == '13' && warnInfo.video_action != ''){//判断是否显示视频按钮
                                    $(".black_top_right_title_ul").append(`<li class="movieInfo" video_action="${warnInfo.video_action}">视频查看</li>`)
                                } else {
                                    $('.black_top_right_title_ul').hide();
                                }

                                let peoplewarnDate = `
                                    <div class="black_top_right_div_l">
                                        <ul>
                                            <li><b>发生原因：</b><span>${warnInfo.reason}</span></li>
                                            <li><b>发生时间：</b><span>${warnInfo.addtime}</span></li>
                                            <li><b>位&emsp;&emsp;置：</b><span>${warnInfo.open_useraddress}</span></li>
                                            <li><b>状&emsp;&emsp;态：</b><span>${warnInfo.is_act}</span></li>
                                        </ul>
                                    </div>
                                    <div class="black_top_right_div_r">
                                        <h1 id="black_top_right_div_r_h1">处理信息<span><img src="../../img/gengduo.png" alt=""></span></h1>
                                        <div class="black_top_right_div_r_div" style="display:none">
                                            <div class="black_top_right_div_r_1">
                                                <ul>
                                                    <li><b>处理人员：</b><span>${warnInfo.act_finish_username}</span></li>
                                                    <li><b>处理时间：</b><span>${warnInfo.act_time}</span></li>
                                                    <li><b>处理结果：</b><span>${warnInfo.reason_feedback}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div> `;
                                $(".black_top_right_div").html(peoplewarnDate)

                                //更多信息点击事件
                                $(".black").unbind('click').on("click", '#black_top_right_div_r_h1', function () {
                                    $(".black_top_right_div_r_div").slideToggle(0, function () {
                                        if ($(this).is(':hidden')) {
                                            $('#black_top_right_div_r_h1>span').find('img').css("transform", "rotate(180deg)");
                                        } else {
                                            $('#black_top_right_div_r_h1>span').find('img').css("transform", "rotate(0deg)");
                                        }
                                    });
                                })

                                    
                            }


                        })


                    }
                })

                //点击一车一档进入一车一档详情(注：点击一屋一档和一车一档两者只能加一个unbind("click"))
                $(".black_top_right").unbind("click").on("click", ".black_top_oneCar", function () {
                    var userPhone = $(this).attr("userPhone");
                    var userName = $(this).attr("userName");
                    var peopleData = {
                        'userPhone': userPhone,
                        'userName': userName,
                    };
                    LayerTable.api.onecarOnefiles(layerData, peopleData); //一车一档
                })
                //点击一屋一档进入一屋一档详情
                $(".black_top_right").on("click", ".black_top_oneHouse", function () {
                    var roomCode = $(this).attr("roomCode");
                    var peopleData = {
                        'roomCode': roomCode,
                    };
                    LayerTable.api.onehouseOnefiles(layerData, peopleData); //一屋一档
                })

                //点击视频进入查看视频
                $(".black_top_right").on("click", ".movieInfo", function () {
                    var video_info = $(this).attr("video_action");
                    layerData.layer.open({
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
                            var str = `<iframe src="${video_info}" allowfullscreen style="width:80%;height:80%;margin-left:10%;margin-top:10%"></iframe>`;
                            $(".onePeoplePush_photo").html(str);
                            $(".onePeoplePush_photo").css({
                                'width': '100%',
                                'height': '100%'
                            })
                        },
                        end:function(){
                            $(".onePeoplePush_photo").html("");
                            $(".onePeoplePush_photo").css({
                                'width': '17.9rem',
                                'height': '17.7rem'
                            })
                        }
                    })
                }) 
            },
            //人员告警详情 ==>3 重点人员告警：出入即时报警
            comeIntime: function (layerData, people_table) {
                layerData.ComeInTime = layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '20rem'],
                    zIndex:2000000, //层优先级
                    content: $('#churujishi'),
                    success: function () {
                        var househodeData = {
                            'householdId': people_table.household_id,
                            'warnId':people_table.id
                        }

                        $('.churujishi_top_right_title_ul').show();
                        $(".churujishi_top_right_title_ul").html('')
                        $(".churujishi_top_left").html("")
                        Frontend.api.Ajax('/Webapi/userWarnInfomation', househodeData, function (msg) {
                            let Data = msg.data;
                            var householdInfo = Data.householdInfo;//人员信息
                            var warnInfo = Data.warnInfo;//告警信息

                            let empty = null;
                            for (const key in householdInfo) {
                                if (householdInfo.hasOwnProperty(key)) {
                                    if (householdInfo[key] === null) {
                                        householdInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
                            for (const key in warnInfo) {
                                if (warnInfo.hasOwnProperty(key)) {
                                    if (warnInfo[key] === null) {
                                        warnInfo[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }

                            
                    
                            if (Data == null) {
                                $(".churujishi_top_right_title_ul").html("")
                                $(".churujishi_top_left").html("")
                                return false;
                            } else {
                                Household_Info()//人员信息
                                Warn_Info()//告警信息

                                //----------------人员信息--------------------------
                                function Household_Info(){
                        
                                    $(".churujishi_top_left").html(`<img src="${householdInfo.imageOne}" alt=""><img src="${householdInfo.imageTwo}" alt="">`);
                                    $(".churujishi_top_right_name").html(householdInfo.household_name);
                                    $(".churujishi_top_right_title_ul").append(`<li class="churujishi_top_oneHouse" roomCode="${householdInfo.room_code}">一屋一档</li><li class="churujishi_top_oneCar" userPhone="${householdInfo.phone}" userName="${householdInfo.household_name}">一车一档</li>`)
                                    if (householdInfo.carInfo == '0') {//0没车；1有车
                                        $(".churujishi_top_oneCar").hide();
                                    }
                                    if (householdInfo.room_code == '' || householdInfo.room_code == '0') {//判断一屋一档
                                        $(".churujishi_top_oneHouse").hide();
                                    }
                                    //人员标签
                                    $.each(householdInfo.label, function (idx, lab) {
                                        if(lab.length == '0'){
                                            $(".churujishi_top_right_title_ul2 .jingshenbing").hide();
                                            $(".churujishi_top_right_title_ul2 .gugua").hide();
                                        }else{
                                            if (lab.types == '1') {//1重点2特殊
                                                $(".churujishi_top_right_title_ul2 .jingshenbing").show();
                                                $(".churujishi_top_right_title_ul2 .jingshenbing").html(lab.labelName);
                                            } else if (lab.types == '2') {
                                                $(".churujishi_top_right_title_ul2 .gugua").show();
                                                $(".churujishi_top_right_title_ul2 .gugua").html(lab.labelName);
                                            }
                                        }
                                        
                                    })
                                }
                                //----------------告警信息--------------------------
                                function Warn_Info(){
                                    if (warnInfo.is_act == '0') {
                                        warnInfo.is_act = '未处理';
                                    } else if (warnInfo.is_act == '1') {
                                        warnInfo.is_act = '处理中';
                                    } else if (warnInfo.is_act == '2') {
                                        warnInfo.is_act = '已处理';
                                    }
                                    if(warnInfo.warn_type == '3'){
                                        $(".churujishi_title").html('重点人员告警：出入即时报警');//类型标题
                                    }else if(warnInfo.warn_type == '12'){
                                        $(".churujishi_title").html('监控重点出入告警');//类型标题
                                    }else if(warnInfo.warn_type == '15'){
                                        $(".churujishi_title").html('可疑人员出入告警');//类型标题
                                    }

                                    //判断是否显示视频按钮
                                    if(warnInfo.warn_type == '12' && warnInfo.video_action != ''){
                                        $('.churujishi_top_right_title_ul').show();
                                        $(".churujishi_top_right_title_ul").html('')
                                        $(".churujishi_top_right_title_ul").append(`<li class="movieInfo" video_action="${warnInfo.video_action}">视频查看</li>`)
                                    }

                                    let peoplewarnDate = `
                                        <div class="churujishi_top_right_div_l">
                                            <ul>
                                                <li><b>发生原因：</b><span style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title="${warnInfo.reason}">${warnInfo.reason}</span></li>
                                                <li><b>发生时间：</b><span>${warnInfo.addtime}</span></li>
                                                <li><b>位&emsp;&emsp;置：</b><span>${warnInfo.open_useraddress}</span></li>
                                                <li><b>状&emsp;&emsp;态：</b><span>${warnInfo.is_act}</span></li>
                                            </ul>
                                        </div>
                                        <div class="churujishi_top_right_div_r">
                                            <h1 id="churujishi_top_right_div_r_h1">处理信息<span><img src="../../img/gengduo.png" alt=""></span></h1>
                                            <div class="churujishi_top_right_div_r_div" style="display:none">
                                                <div class="churujishi_top_right_div_r_1">
                                                    <ul>
                                                        <li><b>处理人员：</b><span>${warnInfo.act_finish_username}</span></li>
                                                        <li><b>处理时间：</b><span>${warnInfo.act_time}</span></li>
                                                        <li><b>处理结果：</b><span>${warnInfo.reason_feedback}</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div> `;
                                    $(".churujishi_top_right_div").html(peoplewarnDate)
                                    //更多信息点击事件
                                    $(".churujishi").unbind('click').on("click", '#churujishi_top_right_div_r_h1', function () {
                                        $(".churujishi_top_right_div_r_div").slideToggle(0, function () {
                                            if ($(this).is(':hidden')) {
                                                $('#churujishi_top_right_div_r_h1>span').find('img').css("transform", "rotate(180deg)");
                                            } else {
                                                $('#churujishi_top_right_div_r_h1>span').find('img').css("transform", "rotate(0deg)");
                                            }
                                        });
                                    })

                                    if(warnInfo.warn_type == '15'){
                                        $(".churujishi .churujishi_top .churujishi_top_left").css("width","4.4rem")
                                        $(".churujishi_top_right .churujishi_top_right_div_l ul li:nth-child(3)").hide();
                                    }else{
                                        $(".churujishi .churujishi_top .churujishi_top_left").css("width","9rem")
                                        $(".churujishi_top_right .churujishi_top_right_div_l ul li:nth-child(3)").show();
                                    }
                                }
                               
                            }
                        })

                        peoplewarn_churujishi();//重点人员告警：出入即时报警
                        function peoplewarn_churujishi() {
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'householdId': people_table.household_id,//人员id
                                'warnTypesInfo': '1'
                            }
                            let params = Frontend.api.getPostParams(dataNew);

                            layerData.table.render({
                                elem: '#churujishi_table_go',
                                // height: 660,
                                // width: 3900,
                                url: window.publicUrl+'/Webapi/warnListInfo', //数据接口
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
                                limit: 5,
                                page: true, //开启分页
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: '' },
                                        { field: 'addtime', width: '13%', title: '出入时间' },
                                        { field: 'address_town', width: '10%', title: '街道' },
                                        { field: 'address_village', width: '12%', title: '社区' },
                                        { field: 'community_name', width: '10%', title: '小区' },
                                        { field: 'open_useraddress', width: '10%', title: '位置' },
                                        {
                                            field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                                // 处理状态：0：未处理，1：处理中，2：已处理
                                                if (data.is_act == '0') {
                                                    return data.is_act = '未处理';
                                                } else if (data.is_act == '1') {
                                                    return data.is_act = '处理中';
                                                } else if (data.is_act == '2') {
                                                    return data.is_act = '已处理';
                                                }
                                            }
                                        },
                                        { field: 'act_username', width: '6%', title: '处理人员' },
                                        { field: 'reason_feedback', width: '10%', title: '处理结果' },
                                        { field: 'act_time', width: '13%', title: '完成时间' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#churujishi_table_go',
                                    mode: 'api',
                                    filters: [
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                        { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act },
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('churujishi_table_go', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                        }
                    }
                })
                //点击一车一档进入一车一档详情 (注：点击一屋一档和一车一档两者只能加一个unbind("click"))
                $(".churujishi_top_right").unbind("click").on("click", ".churujishi_top_oneCar", function () {
                    var userPhone = $(this).attr("userPhone");
                    var userName = $(this).attr("userName");
                    var peopleData = {
                        'userPhone': userPhone,
                        'userName': userName,
                    };
                    LayerTable.api.onecarOnefiles(layerData, peopleData); //一车一档
                })
                //点击一屋一档进入一屋一档详情
                $(".churujishi_top_right").on("click", ".churujishi_top_oneHouse", function () {
                    var roomCode = $(this).attr("roomCode");
                    var peopleData = {
                        'roomCode': roomCode,
                    };
                    LayerTable.api.onehouseOnefiles(layerData, peopleData); //一屋一档
                })

                 //点击视频进入查看视频
                 $(".churujishi_top_right").on("click", ".movieInfo", function () {
                    var video_info = $(this).attr("video_action");
                    layerData.layer.open({
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
                            var str = `<iframe src="${video_info}" allowfullscreen style="width:80%;height:80%;margin-left:10%;margin-top:10%"></iframe>`;
                            $(".onePeoplePush_photo").html(str);
                            $(".onePeoplePush_photo").css({
                                'width': '100%',
                                'height': '100%'
                            })
                        },
                        end:function(){
                            $(".onePeoplePush_photo").html("");
                            $(".onePeoplePush_photo").css({
                                'width': '17.9rem',
                                'height': '17.7rem'
                            })
                        }

                    })
                }) 
                
            },
            //人员告警详情 ==>4 重点人员告警：出入规律报警  （未完成 先不做 ==》现在没有出入规律）
            comeInlaw: function (layerData, people_table) {
                var churuguilv_start;
                var churuguilv_end;
                var household_id = peopleData.household_id;
                var household_code = peopleData.household_code;

                records();//出行记录
                function records() {
                    let dataNew = {
                        'pageSize': '5',//每页显示的数量
                        'householdId': household_id,//人员id
                        'householdCode': household_code,//	人员编码
                        'startTime': churuguilv_start,//开始时间
                        'endTime': churuguilv_end//结束时间
                    }
                    let params = Frontend.api.getPostParams(dataNew);

                    layerData.table.render({
                        elem: '#churuguilv_table_go',
                        // height: 660,
                        // width: 3900,
                        url: window.publicUrl+'/Webapi/openDoorLogsList', //数据接口
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
                        limit: 5,
                        page: true, //开启分页
                        cols: [
                            [ //表头
                                { field: 'apply_time', width: '15%', title: '开门时间' },
                                { field: 'open_type', width: '12%', title: '开门方式' },
                                { field: 'address_town', width: '12%', title: '街道' },
                                { field: 'address_village', width: '12%', title: '社区' },
                                { field: 'community_name', width: '12%', title: '小区' },
                                { field: 'door_name', width: '12%', title: '抓拍位置' },
                                { field: '', width: '20%', title: '操作', toolbar: '#churuguilv_go_Demo' },
                            ]
                        ],
                        done:function(res){
                            LayerTable.api.layuiTitle()//layui表格title提示
                        }
                    });
                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                        var apitableFilterIns = layerData.tableFilter.render({
                            elem: '#churuguilv_table_go',
                            mode: 'api',
                            filters: [
                                { field: 'open_type', name: 'openType', type: 'checkbox', data: msg.data.open_type },
                                { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name }
                            ],
                            done: function (filters) {
                                // console.log(filters)
                                layerData.table.reload('churuguilv_table_go', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                apitableFilterIns.reload()
                                return false;
                            }
                        });
                    });
                }
                warnInfo();//告警信息
                function warnInfo() {
                    let dataNew = {
                        'pageSize': '5',//每页显示的数量
                        'householdId': household_id,//人员id
                        'householdCode': household_code,//	人员编码
                        'startTime': churuguilv_start,//开始时间
                        'endTime': churuguilv_end//结束时间

                    }
                    let params = Frontend.api.getPostParams(dataNew);

                    layerData.table.render({
                        elem: '#churuguilv_table_warn',
                        // height: 660,
                        // width: 3900,
                        url: window.publicUrl+'/Webapi/userWarnInfo', //数据接口
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
                        limit: 5,
                        page: true, //开启分页
                        cols: [
                            [ //表头
                                { field: 'addtime', width: '15%', title: '出发时间' },
                                {
                                    field: 'warn_type', width: '12%', title: '类型', templet: function (data) {
                                        // 类型
                                        // 1群租房预警
                                        // 2出租房屋空置告警
                                        // 3重点人员告警：出入即时报警
                                        // 4重点人员告警：出入规律监控
                                        // 5关爱人员告警
                                        // 6设备告警：门禁常开告警
                                        // 7SOS报警
                                        // 8烟感
                                        // 9陌生人出入告警
                                        // 10陌生人一周x次出入
                                        // 11黑名单
                                        if (data.warn_type == '1') {
                                            return data.warn_type = '群租房预警';
                                        } else if (data.warn_type == '2') {
                                            return data.warn_type = '出租房屋空置告警';
                                        } else if (data.warn_type == '3') {
                                            return data.warn_type = '重点人员告警：出入即时报警';
                                        } else if (data.warn_type == '4') {
                                            return data.warn_type = '重点人员告警：出入规律监控';
                                        } else if (data.warn_type == '5') {
                                            return data.warn_type = '关爱人员告警';
                                        } else if (data.warn_type == '6') {
                                            return data.warn_type = '设备告警：门禁常开告警';
                                        } else if (data.warn_type == '7') {
                                            return data.warn_type = 'SOS报警';
                                        } else if (data.warn_type == '8') {
                                            return data.warn_type = '烟感';
                                        } else if (data.warn_type == '9') {
                                            return data.warn_type = '陌生人出入告警';
                                        } else if (data.warn_type == '10') {
                                            return data.warn_type = '陌生人一周x次出入';
                                        } else if (data.warn_type == '11') {
                                            return data.warn_type = '黑名单';
                                        }
                                    }
                                },
                                { field: 'reason', width: '12%', title: '发生原因' },
                                { field: 'address_town', width: '12%', title: '街道' },
                                { field: 'address_village', width: '10%', title: '社区' },
                                { field: 'community_name', width: '10%', title: '小区' },
                                { field: 'open_useraddress', width: '10%', title: '位置' },
                                {
                                    field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                        // 处理状态：0：未处理，1：处理中，2：已处理
                                        if (data.is_act == '0') {
                                            return data.type = '未处理';
                                        } else if (data.type == '1') {
                                            return data.type = '处理中';
                                        } else if (data.type == '2') {
                                            return data.type = '已处理';
                                        }
                                    }
                                },
                                { field: '', width: '5%', title: '操作', toolbar: '#churuguilv_warn_Demo' },
                            ]
                        ],
                        done:function(res){
                            LayerTable.api.layuiTitle()//layui表格title提示
                        }
                    });
                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                        var apitableFilterIns = layerData.tableFilter.render({
                            elem: '#churuguilv_table_warn',
                            mode: 'api',
                            filters: [
                                { field: 'warn_type', name: 'warnType', type: 'checkbox', data: msg.data.warn_type },
                                { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act }
                            ],
                            done: function (filters) {
                                // console.log(filters)
                                layerData.table.reload('churuguilv_table_warn', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                apitableFilterIns.reload()
                                return false;
                            }
                        });
                    });
                }

                //点击搜索
                $("#churuguilv_btn").unbind('click').on("click", function () {
                    churuguilv_start = $("#churuguilv_start").val();
                    churuguilv_end = $("#churuguilv_end").val();
                    records();//出行记录
                    warnInfo();//告警信息
                })

                //人员信息
                var peopleData = {
                    'householdId': peopleData.household_id,
                    'householdCode': peopleData.household_code,
                    'userPhone': peopleData.phone,
                    'userName': peopleData.household_name,
                    'roomCode': peopleData.room_code
                };
                Frontend.api.Ajax('/Webapi/userInfomation', peopleData, function (msg) {
                    // console.log(msg.data)
                    let Data = msg.data;
                    let profession_status;
                    if (Data.profession_code == '') {
                        profession_status = '待业'
                    } else {
                        profession_status = '上班'
                    }
                    var zhongdian, teshu;
                    $.each(Data.label, function (index, label) {
                        if (label.types == '1') {//1重点2特殊
                            zhongdian = label.labelName;
                        } else if (label.types == '2') {
                            teshu = label.labelName;
                        }
                    })

                    //一人一档的标题
                    $(".churuguilv .churuguilv_title").html(Data.household_name);

                    let str = `
                    <div class="churuguilv_top_left">
                        <img src="${Data.face_url}" alt="">
                    </div>
                    <div class="churuguilv_top_right">
                        <div class="churuguilv_top_right_title">
                            <ul class="churuguilv_top_right_title_ul">
                                <li class="churuguilv_top_oneHouse">一屋一档</li>
                                <li class="churuguilv_top_oneCar">一车一档</li>
                            </ul>
                            <ul class="churuguilv_top_right_title_ul2">
                                <li class="jingshenbing">${zhongdian}</li>
                                <li class="gugua">${teshu}</li>
                            </ul>
                        </div>
                        <div class="churuguilv_top_right_div">
                            <div class="churuguilv_top_right_div_l">
                                <ul>
                                    <li><b>联系电话：</b><span>${Data.phone}</span></li>
                                    <li><b>年&emsp;&emsp;龄：</b><span>${Data.age}</span></li>
                                    <li><b>民&emsp;&emsp;族：</b><span>${Data.ethnicity}</span></li>
                                    <li><b>国&emsp;&emsp;籍：</b><span>${Data.nationality}</span></li>
                                    <li><b>身份证号：</b><span>${Data.citizen_id}</span></li>
                                    <li><b>户&emsp;&emsp;籍：</b><span>${Data.residential_address}</span></li>
                                </ul>
                            </div>
                            <div class="churuguilv_top_right_div_r">
                                <h1 id="churuguilv_top_right_div_r_h1">更多信息<span><img src="../../img/gengduo.png" alt="" style="transform: rotate(180deg);"></span></h1>
                                <div class="churuguilv_top_right_div_r_div" style="display: none;">
                                    <div class="churuguilv_top_right_div_r_1">
                                        <h2>基本状况</h2>
                                        <ul>
                                            <li><b>学&emsp;&emsp;历：</b><span>${Data.education_level}</span></li>
                                            <li><b>职&emsp;&emsp;业：</b><span>${Data.profession_code}</span></li>
                                            <li><b>婚姻状况：</b><span>${Data.marital_status}</span></li>
                                            <li><b>单位名称：</b><span>${Data.company_name}</span></li>
                                            <li><b>政治面貌：</b><span>${Data.political_status}</span></li>
                                            <li><b>单位性质：</b><span></span></li>
                                            <li><b>从业状况：</b><span>${profession_status}</span></li>
                                            <li><b>登记时间：</b><span>${Data.apply_time}</span></li>
                                        </ul>
                                    </div>
                                    <div class="churuguilv_top_right_div_r_2">
                                        <h2>住址详情</h2>
                                        <ul>
                                            <li><b>街&emsp;&emsp;道：</b><span>${Data.address_town}</span></li>
                                            <li><b>社&emsp;&emsp;区：</b><span>${Data.address_village}</span></li>
                                            <li><b>小&emsp;&emsp;区：</b><span>${Data.community_name}</span></li>
                                            <li><b>房间号码：</b><span>${Data.room_name}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    $(".churuguilv  .churuguilv_top").html(str);
                    if (Data.carInfo == '0') {//0没车；1有车
                        $(".churuguilv_top_oneCar").hide();
                    }
                    $.each(Data.label, function (index, label) {
                        if (label.types == '1') {//1重点2特殊
                            $(".churuguilv .jingshenbing").show()
                        } else if (label.types == '2') {
                            $(".churuguilv .gugua").show()
                        }
                    })

                })

                //更多信息点击事件
                $(".churuguilv").unbind('click').on("click", '#churuguilv_top_right_div_r_h1', function () {
                    $(".churuguilv_top_right_div_r_div").slideToggle(0, function () {
                        if ($(this).is(':hidden')) {
                            $('#churuguilv_top_right_div_r_h1>span').find('img').css("transform", "rotate(180deg)");
                        } else {
                            $('#churuguilv_top_right_div_r_h1>span').find('img').css("transform", "rotate(0deg)");
                        }
                    });
                })
                //出入记录 、出行分析 、告警信息 切换
                $(".churuguilv_bottom_top_l li").unbind("click").on("click", function () {
                    let idx = $(this).index();
                    $(".churuguilv_bottom_table>div").eq(idx).show().siblings().hide();
                    if (idx == '0') {
                        $(this).addClass("pitch_on");
                        $(this).siblings().removeClass("pitch_on2");
                    } else if (idx == '1') {
                        $(".churuguilv_bottom_top_r").hide();
                        $(this).addClass("pitch_on2");
                        $(this).siblings().removeClass("pitch_on2");
                        $(".churuguilv_bottom_top_l li:nth-child(1)").removeClass("pitch_on");
                    } else {
                        $(".churuguilv_bottom_top_r").show();
                        $(this).addClass("pitch_on2")
                        $(this).siblings().removeClass("pitch_on2");
                        $(".churuguilv_bottom_top_l li:nth-child(1)").removeClass("pitch_on");
                    }
                })
            },
            //房屋告警列表
            housewarnInfo: function (layerData) {
                var isclick = true;//防止点击过快
                //房屋告警(全部)
                $("#housewarnInfo").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        LayerTable.api.housewarnInfoCommon(layerData)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                });
                //群租房告警
                $(".warnList .warnListAccommodation dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '1';//群租房
                        LayerTable.api.housewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListAccommodation .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '1';//群租房
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.housewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListAccommodation .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '1';//群租房
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.housewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

                //出租房空置
                $(".warnList .warnListVacant dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '2';//出租房空置
                        LayerTable.api.housewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListVacant .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '2';//出租房空置
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.housewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListVacant .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '2';//出租房空置
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.housewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

            },
            //房屋告警列表（公共部分）
            housewarnInfoCommon: function (layerData, warnType, isAct) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'peopleNumclass', //皮肤
                    area: ['36rem', '16.8rem'],
                    zIndex:2000000, //层优先级
                    content: $('#house_layer'),
                    success: function () {
                        //初始化日期
                        $("#house_table_start").val("");
                        $("#house_table_end").val("");
                        $("#house_layer_right_input").val("");

                        if(warnType == '1'){
                            var obj = {
                                'warnType':warnType,
                                'isAct':isAct,
                                'warnTypesInfo': 2//1人员告警列表；2房屋告警列表；3设备告警列表

                            }
                            Frontend.api.Ajax('/Webapi/warnInfoRentGroupCount', obj, function (msg) {                            
                                $(".house_layer_title").append(`<span>（ 涉及${msg.data.count}个房间）</span>`)
                            })
                        }

                        var house_table_start, house_table_end, keyword;
                        housewarnInfoList();
                        //点击搜索
                        $("#house_layer_btn").unbind("click").on("click", function () {
                            house_table_start = $("#house_table_start").val();
                            house_table_end = $("#house_table_end").val();
                            keyword = $("#house_layer_right_input").val();

                            var date_start = new Date(house_table_start);
                            var date_end = new Date(house_table_end);
                            var house_table_start_time = date_start.getTime();
                            var house_table_end_time = date_end.getTime();
                            if (house_table_start_time > house_table_end_time) {
                                return layerData.layer.msg('输入日期错误');
                            } else {
                                housewarnInfoList();//人员告警列表
                            }
                        })
                        function housewarnInfoList() {
                            let dataNew = {
                                'pageSize': '10',//每页显示的数量
                                'warnTypesInfo': '2',//1人员告警列表；2房屋告警列表；3设备告警列表
                                'startTime': house_table_start,//开始时间
                                'endTime': house_table_end,//结束时间
                                'keyword': keyword,//姓名搜索

                                'warnType': warnType,//指定类型查询
                                'isAct': isAct//指定状态查询
                            }
                            let params = Frontend.api.getPostParams(dataNew);
                            layerData.table.render({
                                elem: '#house_table',
                                // height: 1050,
                                // width: 3500,
                                url: window.publicUrl+'/Webapi/warnListInfo', //数据接口
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
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: '' },
                                        { field: 'addtime', width: '13%', title: '告警时间',  },
                                        {
                                            field: 'warn_type_room', width: '12%', title: '告警类型', templet: function (data) {
                                                // 类型
                                                // 1群租房预警
                                                // 2出租房屋空置告警
                                                // 3重点人员告警：出入即时报警
                                                // 4重点人员告警：出入规律监控
                                                // 5关爱人员告警
                                                // 6设备告警：门禁常开告警
                                                // 7SOS报警
                                                // 8烟感
                                                // 9陌生人出入告警
                                                // 10陌生人一周x次出入
                                                // 11黑名单
                                                if (data.warn_type == '1') {
                                                    return data.warn_type_room = '群租房预警';
                                                } else if (data.warn_type == '2') {
                                                    return data.warn_type_room = '出租房屋空置告警';
                                                } else if (data.warn_type == '3') {
                                                    return data.warn_type_room = '重点人员告警：出入即时报警';
                                                } else if (data.warn_type == '4') {
                                                    return data.warn_type_room = '重点人员告警：出入规律监控';
                                                } else if (data.warn_type == '5') {
                                                    return data.warn_type_room = '关爱人员告警';
                                                } else if (data.warn_type == '6') {
                                                    return data.warn_type_room = '设备告警：门禁常开告警';
                                                } else if (data.warn_type == '7') {
                                                    return data.warn_type_room = 'SOS报警';
                                                } else if (data.warn_type == '8') {
                                                    return data.warn_type_room = '烟感';
                                                } else if (data.warn_type == '9') {
                                                    return data.warn_type_room = '陌生人出入告警';
                                                } else if (data.warn_type == '10') {
                                                    return data.warn_type_room = '陌生人一周x次出入';
                                                } else if (data.warn_type == '11') {
                                                    return data.warn_type_room = '黑名单';
                                                }
                                            }
                                        },

                                        { field: 'address_town', width: '10%', title: '街道' },
                                        { field: 'address_village', width: '15%', title: '社区' },
                                        { field: 'community_name', width: '8%', title: '小区' },
                                        { field: 'open_useraddress', width: '20%', title: '告警房屋' },
                                        {
                                            field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                                // 处理状态：0：未处理，1：处理中，2：已处理
                                                if (data.is_act == '0') {
                                                    return data.is_act = '未处理';
                                                } else if (data.is_act == '1') {
                                                    return data.is_act = '处理中';
                                                } else if (data.is_act == '2') {
                                                    return data.is_act = '已处理';
                                                }
                                            }
                                        },
                                        { field: '', width: '4%', title: '操作', toolbar: '#house_table_Demo' },
                                    ]
                                ],
                                limit: 10,
                                done: function (res, curr, count) {
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                    // console.log("监听where:", this.where);
                                    // //非常重要！如果使table.reload()后依然使用过滤，就必须将过滤组件也reload()一下
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#house_table',
                                    mode: 'api',
                                    filters: [
                                        { field: 'warn_type_room', name: 'warnType', type: 'checkbox', data: msg.data.warn_type_room },
                                   
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                        { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act }
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        keyword = $("#house_layer_right_input").val();
                                        layerData.table.reload('house_table', {
                                            where: { //设定异步数据接口的额外参数，任意设
                                                keyword: keyword,
                                            },
                                            page: 1
                                        })
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                        }
                        // 日期时间选择器
                        layerData.laydate.render({
                            elem: '#house_table_start',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate()
                        });
                        layerData.laydate.render({
                            elem: '#house_table_end',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate()
                        });
                        //监听工具条
                        layerData.table.on('tool(house_table)', function (obj) {
                            var house_table = obj.data;
                            let empty = null;
                            for (const key in house_table) {//处理字符串null
                                // console.log(key)
                                if (house_table.hasOwnProperty(key)) {
                                    if (house_table[key] === null) {
                                        house_table[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
                            if (obj.event === 'house_table_lock') {
                                if (house_table.warn_type == '1' || house_table.warn_type == '2') {//==>1 群租房告警 2出租房屋空置告警
                                    LayerTable.api.housewarnAccommodation(layerData, house_table);
                                }
                            }

                        });
                    },
                    end: function () { 
                        $(".house_layer_title span").remove();
                    }
                })
            },
            //房屋告警详情 ==>1 群租房告警 2出租房屋空置告警
            housewarnAccommodation: function (layerData, house_table) {
                layerData.HouseWarn = layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '20rem'],
                    zIndex:2000000, //层优先级
                    content: $('#qunzufang'),
                    success: function () {
                        if ((house_table.room_code != '' && house_table.room_code != '0') || (house_table.room_id != '' && house_table.room_id != '0')) {
                            var newData = {
                                'roomCode': house_table.room_code
                            }
                            Frontend.api.Ajax('/Webapi/roomOnlyInfo', newData, function (msg) {
                                var Data = msg.data.roomInfo;
                                var Count = msg.data.monthCount;
                                var house_address = Data.building_name + Data.unit_name + Data.room_name;
                                $(".qunzufang_top_left").html(`<img src="../../img/qunzu11.png" alt="">`);//房屋头像
                                $(".qunzufang_top_right_name").html(house_address);
                                $(".qunzufang_top_biaoqian p").html(`${Count}次`);
                            })
                        } else {
                            $(".qunzufang_top_left").html(`<img src="" alt="">`);//房屋头像
                            $(".qunzufang_top_right_name").html("");
                            $(".qunzufang_top_biaoqian p").html(`次`)
                        }

                        if (house_table.is_act == '0') {
                            house_table.is_act = '未处理';
                        } else if (house_table.is_act == '1') {
                            house_table.is_act = '处理中';
                        } else if (house_table.is_act == '2') {
                            house_table.is_act = '已处理';
                        }

                        if (house_table.warn_type == "1") {
                            $(".qunzufang_title").html('疑似群租房告警');//类型标题
                        } else if (house_table.warn_type == "2") {
                            $(".qunzufang_title").html('出租房屋空置告警');//类型标题
                        }

                        $(".qunzufang_top_right_title_ul").html(`<li class="qunzufang_top_oneHouse" roomCode="${house_table.room_code}">一屋一档</li>`)

                        if (house_table.room_code == '' || house_table.room_code == '0') {//判断一屋一档
                            $(".qunzufang_top_oneHouse").hide();
                        }

                        let peoplewarnDate = `
                            <div class="qunzufang_top_right_div_l">
                                <ul>
                                    <li><b>发生原因：</b><span>${house_table.reason}</span></li>
                                    <li><b>发生时间：</b><span>${house_table.addtime}</span></li>
                                    <li><b>位&emsp;&emsp;置：</b><span>${house_table.open_useraddress}</span></li>
                                    <li><b>状&emsp;&emsp;态：</b><span>${house_table.is_act}</span></li>
                                </ul>
                            </div>
                            <div class="qunzufang_top_right_div_r">
                                <h1 id="qunzufang_top_right_div_r_h1">处理信息<span><img src="../../img/gengduo.png" alt=""></span></h1>
                                <div class="qunzufang_top_right_div_r_div" style="display:none">
                                    <div class="qunzufang_top_right_div_r_1">
                                        <ul>
                                            <li><b>完成时间：</b><span>${house_table.act_time}</span></li>
                                            <li><b>处理人员：</b><span>${house_table.act_finish_username}</span></li>
                                            <li><b>处理结果：</b><span>${house_table.reason_feedback}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            `;

                        $(".qunzufang_top_right_div").html(peoplewarnDate)

                        //更多信息点击事件
                        $(".qunzufang").unbind('click').on("click", '#qunzufang_top_right_div_r_h1', function () {
                            $(".qunzufang_top_right_div_r_div").slideToggle(0, function () {
                                if ($(this).is(':hidden')) {
                                    $('#qunzufang_top_right_div_r_h1>span').find('img').css("transform", "rotate(180deg)");
                                } else {
                                    $('#qunzufang_top_right_div_r_h1>span').find('img').css("transform", "rotate(0deg)");
                                }
                            });
                        })

                        housewarn_qunzufang();//群租房告警列表
                        function housewarn_qunzufang() {
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'roomId': house_table.room_id,//房屋id
                                'warnTypesInfo': '2'
                            }
                            let params = Frontend.api.getPostParams(dataNew);

                            layerData.table.render({
                                elem: '#qunzufang_table_go',
                                // height: 660,
                                // width: 3900,
                                url: window.publicUrl+'/Webapi/warnListInfo', //数据接口
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
                                limit: 5,
                                page: true, //开启分页
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: '' },
                                        { field: 'addtime', width: '13%', title: '发生时间' },
                                        { field: 'address_town', width: '10%', title: '街道' },
                                        { field: 'address_village', width: '12%', title: '社区' },
                                        { field: 'community_name', width: '10%', title: '小区' },
                                        { field: 'open_useraddress', width: '10%', title: '位置' },
                                        {
                                            field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                                // 处理状态：0：未处理，1：处理中，2：已处理
                                                if (data.is_act == '0') {
                                                    return data.is_act = '未处理';
                                                } else if (data.is_act == '1') {
                                                    return data.is_act = '处理中';
                                                } else if (data.is_act == '2') {
                                                    return data.is_act = '已处理';
                                                }
                                            }
                                        },
                                        { field: 'act_username', width: '6%', title: '处理人员' },
                                        { field: 'reason_feedback', width: '10%', title: '处理结果' },
                                        { field: 'act_time', width: '13%', title: '完成时间' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#qunzufang_table_go',
                                    mode: 'api',
                                    filters: [
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                        { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act },
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('qunzufang_table_go', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                        }
                    }
                })
                //点击一屋一档进入一屋一档详情
                $(".qunzufang_top_right").unbind("click").on("click", ".qunzufang_top_oneHouse", function () {
                    var roomCode = $(this).attr("roomCode");
                    var peopleData = {
                        'roomCode': roomCode,
                    };
                    LayerTable.api.onehouseOnefiles(layerData, peopleData); //一屋一档
                })
            },
            //设备告警列表
            devicewarnInfo: function (layerData) {
                var isclick = true;//防止点击过快
                //设备告警(全部)
                $("#devicewarnInfo").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        LayerTable.api.devicewarnInfoCommon(layerData)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                });

                //门禁
                $(".warnList .warnListDoor dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '6';//门禁
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListDoor .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '6';//门禁
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListDoor .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '6';//门禁
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

                //烟感
                $(".warnList .warnListSmoke dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '8';//烟感
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListSmoke .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '8';//烟感
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListSmoke .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '8';//烟感
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                //车辆出入
                $(".warnList .warnListCar dl>dt").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        warnType = '14,16';//车辆出入
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListCar .warnList_untreated").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '14,16';//车辆出入
                        isAct = '0';//0：未处理；1处理中；2已处理
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType, isAct)
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".warnList .warnListCar .warnList_processed").unbind("click").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var warnType;
                        var isAct;
                        warnType = '14,16';//车辆出入
                        isAct = '2';//0：未处理；1处理中；2已处理
                        LayerTable.api.devicewarnInfoCommon(layerData, warnType, isAct)
                        
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

            },
            //设备告警列表（公共部分）
            devicewarnInfoCommon: function (layerData, warnType, isAct) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'peopleNumclass', //皮肤
                    area: ['36rem', '16.8rem'],
                    zIndex:2000000, //层优先级
                    content: $('#device_layer'),
                    success: function () {

                        if(warnType == '14,16'){
                            $(".device_layer_title").html('车辆出入告警')
                        }else{
                            $(".device_layer_title").html('设备告警列表')
                        }

                        //初始化日期
                        $("#device_table_start").val("");
                        $("#device_table_end").val("");
                        $("#device_layer_right_input").val("");

                        var device_table_start, device_table_end, keyword;
                        devicewarnInfoList();
                        //点击搜索
                        $("#device_layer_btn").unbind("click").on("click", function () {
                            device_table_start = $("#device_table_start").val();
                            device_table_end = $("#device_table_end").val();
                            keyword = $("#device_layer_right_input").val();

                            var date_start = new Date(device_table_start);
                            var date_end = new Date(device_table_end);
                            var device_table_start_time = date_start.getTime();
                            var device_table_end_time = date_end.getTime();
                            if (device_table_start_time > device_table_end_time) {
                                return layerData.layer.msg('输入日期错误');
                            } else {
                                devicewarnInfoList();//设备告警列表
                            }
                        })
                        function devicewarnInfoList() {
                            let dataNew = {
                                'pageSize': '10',//每页显示的数量
                                'warnTypesInfo': '3',//1人员告警列表；2房屋告警列表；3设备告警列表
                                'startTime': device_table_start,//开始时间
                                'endTime': device_table_end,//结束时间
                                'keyword': keyword,//姓名搜索

                                'warnType': warnType,//指定类型查询
                                'isAct': isAct//指定状态查询
                            }
                            let params = Frontend.api.getPostParams(dataNew);
                            layerData.table.render({
                                elem: '#device_table',
                                // height: 1050,
                                // width: 3500,
                                url: window.publicUrl+'/Webapi/warnListInfo', //数据接口
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
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: '' },
                                        { field: 'addtime', width: '13%', title: '告警时间',  },
                                        {
                                            field: 'warn_type_device', width: '14%', title: '告警类型', templet: function (data) {
                                                // 类型
                                                // 1群租房预警
                                                // 2出租房屋空置告警
                                                // 3重点人员告警：出入即时报警
                                                // 4重点人员告警：出入规律监控
                                                // 5关爱人员告警
                                                // 6设备告警：门禁常开告警
                                                // 7SOS报警
                                                // 8烟感
                                                // 9陌生人出入告警
                                                // 10陌生人一周x次出入
                                                // 11黑名单
                                                if (data.warn_type == '1') {
                                                    return data.warn_type_device = '群租房预警';
                                                } else if (data.warn_type == '2') {
                                                    return data.warn_type_device = '出租房屋空置告警';
                                                } else if (data.warn_type == '3') {
                                                    return data.warn_type_device = '重点人员告警：出入即时报警';
                                                } else if (data.warn_type == '4') {
                                                    return data.warn_type_device = '重点人员告警：出入规律监控';
                                                } else if (data.warn_type == '5') {
                                                    return data.warn_type_device = '关爱人员告警';
                                                } else if (data.warn_type == '6') {
                                                    return data.warn_type_device = '设备告警：门禁常开告警';
                                                } else if (data.warn_type == '7') {
                                                    return data.warn_type_device = 'SOS报警';
                                                } else if (data.warn_type == '8') {
                                                    return data.warn_type_device = '烟感';
                                                } else if (data.warn_type == '9') {
                                                    return data.warn_type_device = '陌生人出入告警';
                                                } else if (data.warn_type == '10') {
                                                    return data.warn_type_device = '陌生人一周x次出入';
                                                } else if (data.warn_type == '11') {
                                                    return data.warn_type_device = '黑名单';
                                                } else if (data.warn_type == '14') {
                                                    return data.warn_type_device = '重点车辆出入告警';
                                                } else if (data.warn_type == '16') {
                                                    return data.warn_type_device = '可疑车辆告警';
                                                }
                                            }
                                        },

                                        {
                                            field: 'device_no', width: '6%', title: '设备编码', event: 'device_no', templet: function (data) {

                                                if (data.warn_type == "6") {//6设备
                                                    return '<span style="color: #00ffff !important;cursor:pointer;">' + data.device_no + '</span>'
                                                } else if (data.warn_type == "8") {//8烟感
                                                    return '<span>' + data.device_no + '</span>'
                                                } else if (data.warn_type == "14" || data.warn_type == "16") {//14车辆
                                                    return '<span>' + data.device_no + '</span>'
                                                }

                                                
                                            }
                                        },
                                        { field: 'address_town', width: '10%', title: '街道' },
                                        { field: 'address_village', width: '12%', title: '社区' },
                                        { field: 'community_name', width: '8%', title: '小区' },
                                        { field: 'open_useraddress', width: '10%', title: '安装位置' },
                                        { field: 'reason', width: '6%', title: '告警原因' },
                                        {
                                            field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                                // 处理状态：0：未处理，1：处理中，2：已处理
                                                if (data.is_act == '0') {
                                                    return data.is_act = '未处理';
                                                } else if (data.is_act == '1') {
                                                    return data.is_act = '处理中';
                                                } else if (data.is_act == '2') {
                                                    return data.is_act = '已处理';
                                                }
                                            }
                                        },
                                        { field: '', width: '4%', title: '操作', toolbar: '#device_table_Demo' },
                                    ]
                                ],
                                limit: 10,
                                done: function (res, curr, count) {
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                    // console.log("监听where:", this.where);
                                    // //非常重要！如果使table.reload()后依然使用过滤，就必须将过滤组件也reload()一下
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#device_table',
                                    mode: 'api',
                                    filters: [
                                        { field: 'warn_type_device', name: 'warnType', type: 'checkbox', data: msg.data.warn_type_device },
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                        { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act }
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        keyword = $("#device_layer_right_input").val();
                                        layerData.table.reload('device_table', {
                                            where: { //设定异步数据接口的额外参数，任意设
                                                keyword: keyword,
                                            },
                                            page: 1
                                        })

                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                        }
                        // 日期时间选择器
                        layerData.laydate.render({
                            elem: '#device_table_start',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate()
                        });
                        layerData.laydate.render({
                            elem: '#device_table_end',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate()
                        });

                        //监听工具条
                        layerData.table.on('tool(device_table)', function (obj) {
                            var device_table = obj.data;
                            let empty = null;
                            for (const key in device_table) {//处理字符串null
                                // console.log(key)
                                if (device_table.hasOwnProperty(key)) {
                                    if (device_table[key] === null) {
                                        device_table[key] = "";
                                        empty = true;
                                    } else {
                                        empty = false;
                                    }
                                }
                            }
                            // console.log(device_table)
                            if (obj.event === 'device_table_lock') {
                                if (device_table.warn_type == '6' || device_table.warn_type == '8') {//==>6设备告警：门禁常开告警  8 烟感告警
                                    LayerTable.api.deviceSmoke(layerData, device_table);
                                }else if(device_table.warn_type == '14' || device_table.warn_type == '16'){//14车辆 16疑似车辆
                                    device_table.carNo = device_table.device_no
                                    LayerTable.api.onecarOnefiles(layerData,device_table)
                                }
                            }
                            if (obj.event === 'device_no') {//设备编码
                                if (device_table.warn_type == '6') {//==>6设备告警：门禁常开告警  8 烟感告警
                                    LayerTable.api.mapDoorSmoke(layerData, device_table); // 设备详情
                                }
                            }
                            
                        });

                        if(warnType == '14,16'){
                            $("#device_layer .device_layer_right input").attr('placeholder','输入车牌号')
                            $(".device_layer_table .layui-table-header table thead th[data-field='device_no'] span").html('车牌号');
                        }else{
                            $("#device_layer .device_layer_right input").attr('placeholder','输入设备编码')
                            $(".device_layer_table .layui-table-header table thead th[data-field='device_no'] span").html('设备编码');
                        }
                    },
                    end: function () { }
                })
            },
            //设备告警 ==>6设备告警：门禁常开告警  8 烟感告警
            deviceSmoke: function (layerData, device_table) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '20rem'],
                    zIndex:2000000, //层优先级
                    content: $('#yangan'),
                    success: function () {
                        var types;
                        if (device_table.warn_type == "6") {
                            types = "1";
                        } else if (device_table.warn_type == "8") {
                            types = "2";
                        }
                        var newData = {//	1门禁2烟感
                            'doorId': device_table.door_id,
                            'doorCode': device_table.door_code,
                            'deviceNo': device_table.device_no,
                            'types': types
                        }
                        Frontend.api.Ajax('/Webapi/deviceOnlyInfo', newData, function (msg) {
                            var Data = msg.data.deviceInfo;
                            var Count = msg.data.monthCount;
                            $(".yangan_top_right_name").html(Data.device_address);
                            $(".yangan_top_biaoqian p").html(`${Count}次`)
                        })
                        if (device_table.is_act == '0') {
                            device_table.is_act = '未处理';
                        } else if (device_table.is_act == '1') {
                            device_table.is_act = '处理中';
                        } else if (device_table.is_act == '2') {
                            device_table.is_act = '已处理';
                        }
                        if (device_table.warn_type == "6") {
                            $(".yangan_title").html('设备告警：门禁常开告警');//类型标题
                            $(".yangan_top_left").html(`<img src="../../img/kaimen.png" alt="">`);//设备头像
                        } else if (device_table.warn_type == "8") {
                            $(".yangan_title").html('烟感告警');//类型标题
                            $(".yangan_top_left").html(`<img src="../../img/yangan.png" alt="">`);//设备头像
                        }

                        let peoplewarnDate = `
                            <div class="yangan_top_right_div_l">
                                <ul>
                                    <li><b>发生原因：</b><span>${device_table.reason}</span></li>
                                    <li><b>发生时间：</b><span>${device_table.addtime}</span></li>
                                    <li><b>位&emsp;&emsp;置：</b><span>${device_table.open_useraddress}</span></li>
                                    <li><b>状&emsp;&emsp;态：</b><span>${device_table.is_act}</span></li>
                                </ul>
                            </div>
                            <div class="yangan_top_right_div_r">
                                <h1 id="yangan_top_right_div_r_h1">处理信息<span><img src="../../img/gengduo.png" alt=""></span></h1>
                                <div class="yangan_top_right_div_r_div" style="display:none">
                                    <div class="yangan_top_right_div_r_1">
                                        <ul>
                                            <li><b>完成时间：</b><span>${device_table.act_time}</span></li>
                                            <li><b>处理人员：</b><span>${device_table.act_finish_username}</span></li>
                                            <li><b>处理结果：</b><span>${device_table.reason_feedback}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            `;

                        $(".yangan_top_right_div").html(peoplewarnDate)

                        //更多信息点击事件
                        $(".yangan").unbind('click').on("click", '#yangan_top_right_div_r_h1', function () {
                            $(".yangan_top_right_div_r_div").slideToggle(0, function () {
                                if ($(this).is(':hidden')) {
                                    $('#yangan_top_right_div_r_h1>span').find('img').css("transform", "rotate(180deg)");
                                } else {
                                    $('#yangan_top_right_div_r_h1>span').find('img').css("transform", "rotate(0deg)");
                                }
                            });
                        })

                        housewarn_yangan();
                        function housewarn_yangan() {
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'doorId': device_table.door_id,//设备id
                                'doorCode': device_table.door_code,
                                'deviceNo': device_table.device_no,
                                'warnTypesInfo': '3'
                            }
                            let params = Frontend.api.getPostParams(dataNew);

                            layerData.table.render({
                                elem: '#yangan_table_go',
                                // height: 660,
                                // width: 3900,
                                url: window.publicUrl+'/Webapi/warnListInfo', //数据接口
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
                                limit: 5,
                                page: true, //开启分页
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%', title: '' },
                                        { field: 'addtime', width: '13%', title: '发生时间' },
                                        { field: 'address_town', width: '10%', title: '街道' },
                                        { field: 'address_village', width: '10%', title: '社区' },
                                        { field: 'community_name', width: '8%', title: '小区' },
                                        { field: 'open_useraddress', width: '14%', title: '位置' },
                                        {
                                            field: 'is_act', width: '6%', title: '状态', templet: function (data) {
                                                // 处理状态：0：未处理，1：处理中，2：已处理
                                                if (data.is_act == '0') {
                                                    return data.is_act = '未处理';
                                                } else if (data.is_act == '1') {
                                                    return data.is_act = '处理中';
                                                } else if (data.is_act == '2') {
                                                    return data.is_act = '已处理';
                                                }
                                            }
                                        },
                                        { field: 'act_username', width: '6%', title: '处理人员' },
                                        { field: 'reason_feedback', width: '10%', title: '处理结果' },
                                        { field: 'act_time', width: '13%', title: '完成时间' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });
                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#yangan_table_go',
                                    mode: 'api',
                                    filters: [
                                        { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                        { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                        { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                        { field: 'is_act', name: 'isAct', type: 'checkbox', data: msg.data.is_act },
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('yangan_table_go', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                        }
                    }
                })
            },
            //首页  重点人口
            emphasisPeople: function (layerData) {
                var isclick = true;//防止点击过快
                $(".emphasisPeople").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#obtain_layer'),
                            success: function () {
                                var obtain_layer_right_input;//搜索input值
                                //初始化搜索
                                $(".obtain_layer_right input").val("");
                                emphasisPeopleList();
                                function emphasisPeopleList() {
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'types': '1',//1重点人 2地区人口  3重点场所  4黑名单
                                        'keyword': obtain_layer_right_input
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#obtain_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/keynoteListInfo', //数据接口
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
                                                { field: 'label_name_types', width: '11%', title: '重点关注类型' },
                                                { field: 'household_name', width: '5%', title: '姓名' },
                                                { field: 'cardid', width: '14%', title: '身份证号' },
                                                { field: 'address_town', width: '12%', title: '街道' },
                                                { field: 'address_village', width: '12%', title: '社区' },
                                                { field: 'community_name', width: '12%', title: '小区' },
                                                { field: 'addressinfo', width: '10%', title: '住址' },
                                                { field: '', width: '8%', title: '操作', toolbar: '#obtain_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                        var apitableFilterIns = layerData.tableFilter.render({
                                            elem: '#obtain_table',
                                            mode: 'api',
                                            filters: [
                                                { field: 'label_name_types', name: 'labelId', type: 'checkbox', data: msg.data.label_name_types },
                                                { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                                { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                                { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                            ],
                                            done: function (filters) {
                                                // console.log(filters)
                                                obtain_layer_right_input = $(".obtain_layer_right input").val();
                                                layerData.table.reload('obtain_table', {
                                                    where: { //设定异步数据接口的额外参数，任意设
                                                        keyword: obtain_layer_right_input,
                                                    },
                                                    page: 1
                                                })
                                                apitableFilterIns.reload()
                                                return false;
                                            }
                                        });
                                    });
                                }
                                //重点人员列表上统计
                                var emphasisPeople = {
                                    types: '1',//1重点人 2地区人口  3重点场所  4黑名单
                                    pageSize: '5'
                                }
                                Frontend.api.Ajax('/Webapi/keynoteCountInfo', emphasisPeople, function (msg) {
                                    var Data = msg.data;
                                    let str = '';
                                    $.each(Data, function (index, value) {
                                        str += `<li>
                                                <h1>${value.title}</h1>
                                                <p>${value.num}人</p>
                                            </li>`;
                                    })
                                    $(".obtain_layer_left").html(str);
                                })
                                //监听工具条
                                layerData.table.on('tool(obtain_table)', function (obj) {
                                    var peopleData = obj.data;
                                    let empty = null;
                                    for (const key in peopleData) {//处理字符串null
                                        // console.log(key)
                                        if (peopleData.hasOwnProperty(key)) {
                                            if (peopleData[key] === null) {
                                                peopleData[key] = "";
                                                empty = true;
                                            } else {
                                                empty = false;
                                            }
                                        }
                                    }
                                    if (obj.event === 'obtain_table_lock') {

                                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                                    }
                                })
                                $("#obtain_layer_right_btn").unbind("click").on("click", function () {
                                    obtain_layer_right_input = $(".obtain_layer_right input").val();
                                    emphasisPeopleList();
                                })
                            },
                            end: function () { }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },
            //首页  关注地区人口
            focusAreas: function (layerData) {
                var isclick = true;//防止点击过快
                $(".focusAreas").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#focusAreas_layer'),
                            success: function () {
                                var focusAreas_layer_right_input;//搜索input值
                                //初始化搜索
                                $(".focusAreas_layer_right input").val("");
                                focusAreasList();
                                function focusAreasList() {
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'types': '2',//1重点人 2地区人口  3重点场所  4黑名单
                                        'keyword': focusAreas_layer_right_input//搜索框
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#focusAreas_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/keynoteListInfo', //数据接口
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
                                                { field: 'areaInfo', width: '11%', title: '关注地区类型' },
                                                { field: 'residential_address', width: '6%', title: '地区' },
                                                { field: 'household_name', width: '5%', title: '姓名' },
                                                { field: 'citizen_id', width: '14%', title: '身份证/通行证号' },
                                                { field: 'address_town', width: '10%', title: '街道' },
                                                { field: 'address_village', width: '10%', title: '社区' },
                                                { field: 'community_name', width: '8%', title: '小区' },
                                                {
                                                    field: 'addressinfo', width: '10%', title: '住址', templet: function (e) {
                                                        let addressinfo = e.building_name + e.unit_name + e.room_name;
                                                        return addressinfo;
                                                    }
                                                },
                                                { field: '', width: '8%', title: '操作', toolbar: '#focusAreas_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                           
                                        }
                                    });
                                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                        var apitableFilterIns = layerData.tableFilter.render({
                                            elem: '#focusAreas_table',
                                            mode: 'api',
                                            filters: [
                                                { field: 'areaInfo', name: 'areaInfo', type: 'checkbox', data: msg.data.areaInfo },
                                                { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                                { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                                { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                            ],
                                            done: function (filters) {
                                                focusAreas_layer_right_input = $(".focusAreas_layer_right input").val();
                                                layerData.table.reload('focusAreas_table', {
                                                    where: { //设定异步数据接口的额外参数，任意设
                                                        keyword: focusAreas_layer_right_input,
                                                    },
                                                    page: 1
                                                })
                                                apitableFilterIns.reload()
                                                return false;
                                            }
                                        });
                                    });
                                }
                                //地区人口列表上统计
                                var focusAreas = {
                                    types: '2',//1重点人 2地区人口  3重点场所  4黑名单
                                    pageSize: '5'
                                }
                                Frontend.api.Ajax('/Webapi/keynoteCountInfo', focusAreas, function (msg) {
                                    var Data = msg.data;
                                    let str = '';
                                    $.each(Data, function (index, value) {
                                        str += `<li>
                                                <h1>${value.title}</h1>
                                                <p>${value.num}人</p>
                                            </li>`;
                                    })
                                    $(".focusAreas_layer_left").html(str);
                                })
                                //监听工具条
                                layerData.table.on('tool(focusAreas_table)', function (obj) {
                                    var peopleData = obj.data;
                                    let empty = null;
                                    for (const key in peopleData) {//处理字符串null
                                        // console.log(key)
                                        if (peopleData.hasOwnProperty(key)) {
                                            if (peopleData[key] === null) {
                                                peopleData[key] = "";
                                                empty = true;
                                            } else {
                                                empty = false;
                                            }
                                        }
                                    }
                                    if (obj.event === 'focusAreas_table_lock') {

                                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                                    }
                                })
                                $("#focusAreas_layer_right_btn").unbind("click").on("click", function () {
                                    focusAreas_layer_right_input = $(".focusAreas_layer_right input").val();
                                    focusAreasList();
                                })
                            },
                            end: function () { }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },
            //首页  疫情预警
            epidemic:function(layerData){
                var isclick = true;//防止点击过快
                $(".epidemic").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#yiqing_layer'),
                            success: function () {
                              Frontend.api.Ajax('/Webapi/yiqingCountInfo', null, function (msg) {
                                $("#epidemic_1 p").html(msg.data[0].num)
                                $("#epidemic_2 p").html(msg.data[1].num)
                                $("#epidemic_3 p").html(msg.data[2].num)
                                $("#epidemic_4 p").html(msg.data[3].num)
                                $("#epidemic_5 p").html(msg.data[4].num)
                                $("#epidemic_6 p").html(msg.data[5].num)

                                $("#epidemic_1").attr("value",msg.data[0].num)
                                $("#epidemic_2").attr("value",msg.data[1].num)
                                $("#epidemic_3").attr("value",msg.data[2].num)
                                $("#epidemic_4").attr("value",msg.data[3].num)
                                $("#epidemic_5").attr("value",msg.data[4].num)
                                $("#epidemic_6").attr("value",msg.data[5].num)
                              })
                            }
                        })

                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                        
                    }
                })
            },
            //首页  疫情预警==>各类统计表格
            epidemicTable:function(layerData){
                var isclick = true;//防止点击过快
                //隔离人员出入告警
                $("#epidemic_1").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#dayresidents_layer'),
                            success: function () {
                                $(".dayresidents_layer_title").html(`隔离人员出入告警`)
                                $(".dayresidents_layer_top_tab").css("display","none")
                                select()//模拟下拉列表
                                function select(){
                                    //默认tab样式
                                    $(".dayresidents_layer_top_tab ul li:eq(0)").addClass("active").siblings().removeClass("active");

                                    Frontend.api.Ajax('/Webapi/yiqingUserTimeInfo', null, function (ret) {
                                        var data = ret.data;
                                        var str = '';
                                        $.each(data,function(idx,val){
                                            str += `<li value="${val.value}">${val.name}</li>`;
                                        })
                                        $(".inputVal_div .inputVal").attr("value",data[0].value)
                                        $(".inputVal_div .inputVal span").html(data[0].name)
                                        $(".dayresidents_layer_top_div .inputVal_div .input_ul").html(str)

                                        todayres();
                                    })


                                    $("#inputValue").unbind("click").on("click",function(event){
                                        event.stopImmediatePropagation();//取消事件冒泡
                                        $(".input_ul").toggle();
                                    })
                                    $(document).bind("click",function(){
                                        $(".input_ul").hide();
                                    })
                                    $(".input_ul").unbind("click").on("click"," li",function(){
                                        var thisval = $(this).attr("value");
                                        var thishtml = $(this).html();
                                        $("#inputValue").attr("value",thisval);
                                        $("#inputValue>span").html(thishtml);
                                        $(".input_ul").hide();
                                    })
                                }

                                //日期来回切换
                                $(".inputVal_div .input_ul").on("click","li",function(){
                                    todayres();
                                })

                                function todayres() {
                                    var inputValnum = $("#inputValue").attr('value');
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'timeInfo': inputValnum,//今日昨日
                                        'listType':'1'//1隔离人员出入告警列表； 2隔离人员统计列表 3今日居民出入统计列表； 4今日访客出入统计列表； 5湖北人员统计列表； 6返京人员统计列表；
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#dayresidents_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/yiqingListInfo', //数据接口
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
                                                { field: 'open_time', width: '6%', title: '出入时间' },
                                                { field: 'community_name', width: '8%', title: '出入小区' },
                                                { field: 'door_name', width: '8%', title: '出入位置' },
                                                { field: 'household_name', width: '4%', title: '姓名' },
                                                { field: 'citizen_id', width: '12%', title: '身份证号' },
                                                { field: 'phone', width: '8%', title: '手机号' },
                                                { field: 'address', width: '10%', title: '详细住址' },
                                                { field: '', width: '6%', title: '操作', toolbar: '#dayresidents_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    //监听工具条
                                    layerData.table.on('tool(dayresidents_table)', function (obj) {
                                        var peopleData = obj.data;
                                        let empty = null;
                                        for (const key in peopleData) {//处理字符串null
                                            // console.log(key)
                                            if (peopleData.hasOwnProperty(key)) {
                                                if (peopleData[key] === null) {
                                                    peopleData[key] = "";
                                                    empty = true;
                                                } else {
                                                    empty = false;
                                                }
                                            }
                                        }
                                        if (obj.event === 'dayresidents_table_lock') {

                                            LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                                        }
                                    })
                                }
                                
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                //隔离人员统计
                $("#epidemic_2").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#hubei_layer'),
                            success: function () {
                                $(".hubei_layer_title").html(`隔离人员统计`)
                                $(".hubei_btn").on("click",function(){
                                    todayres()
                                })
                                todayres()
                                function todayres() {
                                    var val = $("#hubei_input").val();
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'listType':'2',//1隔离人员出入告警列表； 2隔离人员统计列表 3今日居民出入统计列表； 4今日访客出入统计列表； 5湖北人员统计列表； 6返京人员统计列表；
                                        'keyword':val
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#hubei_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/yiqingListInfo', //数据接口
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
                                                { field: 'household_name', width: '5%', title: '姓名' },
                                                { field: 'citizen_id', width: '14%', title: '身份证号' },
                                                { field: 'phone', width: '9%', title: '手机号' },
                                                { field: 'address_province', width: '4%', title: '户籍' },
                                                { field: 'community_name', width: '8%', title: '小区' },
                                                { field: 'address', width: '8%', title: '详细住址' },
                                                { field: 'open_time', width: '10%', title: '开始隔离日期' },
                                                { field: 'geliday', width: '8%', title: '已隔离天数' },
                                                { field: 'geliopen', width: '8%', title: '隔离期间出入次数' },
                                                { field: 'last_time', width: '10%', title: '最后一次出入时间' },
                                                { field: '', width: '6%', title: '操作', toolbar: '#hubei_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    //监听工具条
                                    layerData.table.on('tool(hubei_table)', function (obj) {
                                        var peopleData = obj.data;
                                        let empty = null;
                                        for (const key in peopleData) {//处理字符串null
                                            // console.log(key)
                                            if (peopleData.hasOwnProperty(key)) {
                                                if (peopleData[key] === null) {
                                                    peopleData[key] = "";
                                                    empty = true;
                                                } else {
                                                    empty = false;
                                                }
                                            }
                                        }
                                        if (obj.event === 'hubei_table_lock') {
                                            LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档
                                        }
                                    })
                                }
                                
                            },
                            end:function(){
                                $("#hubei_input").val('');
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                //今日居民出入统计
                $("#epidemic_3").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#dayresidents_layer'),
                            success: function () {
                                $(".dayresidents_layer_title").html(`今日居民出入列表`)
                                select()//模拟下拉列表
                                function select(){
                                    //默认tab样式
                                    $(".dayresidents_layer_top_tab ul li:eq(0)").addClass("active").siblings().removeClass("active");

                                    Frontend.api.Ajax('/Webapi/yiqingUserTimeInfo', null, function (ret) {
                                        var data = ret.data;
                                        var str = '';
                                        $.each(data,function(idx,val){
                                            str += `<li value="${val.value}">${val.name}</li>`;
                                        })
                                        $(".inputVal_div .inputVal").attr("value",data[0].value)
                                        $(".inputVal_div .inputVal span").html(data[0].name)
                                        $(".dayresidents_layer_top_div .inputVal_div .input_ul").html(str)

                                        todayres();
                                    })


                                    $("#inputValue").unbind("click").on("click",function(event){
                                        event.stopImmediatePropagation();//取消事件冒泡
                                        $(".input_ul").toggle();
                                    })
                                    $(document).bind("click",function(){
                                        $(".input_ul").hide();
                                    })
                                    $(".input_ul").unbind("click").on("click"," li",function(){
                                        var thisval = $(this).attr("value");
                                        var thishtml = $(this).html();
                                        $("#inputValue").attr("value",thisval);
                                        $("#inputValue>span").html(thishtml);
                                        $(".input_ul").hide();
                                    })
                                }

                                //全部和湖北来回切换  
                                $(".dayresidents_layer_top_tab ul li").unbind("click").on("click",function(){
                                    $(this).addClass("active").siblings().removeClass("active");
                                    todayres();
                                })
                                //日期来回切换
                                $(".inputVal_div .input_ul").on("click","li",function(){
                                    todayres();
                                })

                                function todayres() {
                                    var inputValnum = $("#inputValue").attr('value');
                                    var type = $(".dayresidents_layer_top_tab ul .active").attr('value');
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'type': type,//quanbu/hubei
                                        'timeInfo': inputValnum,//今日昨日
                                        'listType':'3'//1隔离人员出入告警列表； 2隔离人员统计列表 3今日居民出入统计列表； 4今日访客出入统计列表； 5湖北人员统计列表； 6返京人员统计列表；
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#dayresidents_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/yiqingListInfo', //数据接口
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
                                                { field: 'household_type', width: '6%', title: '住户类型' },
                                                { field: 'household_name', width: '4%', title: '住户' },
                                                { field: 'gender', width: '3%', title: '性别' },
                                                { field: 'age', width: '3%', title: '年龄' },
                                                { field: 'citizen_id', width: '12%', title: '身份证号' },
                                                { field: 'phone', width: '8%', title: '手机号' },
                                                { field: 'address_province', width: '3%', title: '户籍' },
                                                { field: 'community_name', width: '8%', title: '小区' },
                                                { field: 'address', width: '10%', title: '详细住址' },
                                                { field: 'openNum', width: '9%', title: '当日出入次数' },
                                                { field: 'open_time', width: '13%', title: '最后一次出入时间' },
                                                { field: '', width: '6%', title: '操作', toolbar: '#dayresidents_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    //监听工具条
                                    layerData.table.on('tool(dayresidents_table)', function (obj) {
                                        var peopleData = obj.data;
                                        let empty = null;
                                        for (const key in peopleData) {//处理字符串null
                                            // console.log(key)
                                            if (peopleData.hasOwnProperty(key)) {
                                                if (peopleData[key] === null) {
                                                    peopleData[key] = "";
                                                    empty = true;
                                                } else {
                                                    empty = false;
                                                }
                                            }
                                        }
                                        if (obj.event === 'dayresidents_table_lock') {

                                            LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                                        }
                                    })
                                }
                                
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                //今日访客出入统计
                $("#epidemic_4").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#dayresidents_layer'),
                            success: function () {
                                $(".dayresidents_layer_title").html(`今日访客出入统计`)
                                select()//模拟下拉列表
                                function select(){
                                    //默认tab样式
                                    $(".dayresidents_layer_top_tab ul li:eq(0)").addClass("active").siblings().removeClass("active");

                                    Frontend.api.Ajax('/Webapi/yiqingUserTimeInfo', null, function (ret) {
                                        var data = ret.data;
                                        var str = '';
                                        $.each(data,function(idx,val){
                                            str += `<li value="${val.value}">${val.name}</li>`;
                                        })
                                        $(".inputVal_div .inputVal").attr("value",data[0].value)
                                        $(".inputVal_div .inputVal span").html(data[0].name)
                                        $(".dayresidents_layer_top_div .inputVal_div .input_ul").html(str)

                                        todayres();
                                    })


                                    $("#inputValue").unbind("click").on("click",function(event){
                                        event.stopImmediatePropagation();//取消事件冒泡
                                        $(".input_ul").toggle();
                                    })
                                    $(document).bind("click",function(){
                                        $(".input_ul").hide();
                                    })
                                    $(".input_ul").unbind("click").on("click"," li",function(){
                                        var thisval = $(this).attr("value");
                                        var thishtml = $(this).html();
                                        $("#inputValue").attr("value",thisval);
                                        $("#inputValue>span").html(thishtml);
                                        $(".input_ul").hide();
                                    })
                                }

                                //全部和湖北来回切换  
                                $(".dayresidents_layer_top_tab ul li").unbind("click").on("click",function(){
                                    $(this).addClass("active").siblings().removeClass("active");
                                    todayres();
                                })
                                //日期来回切换
                                $(".inputVal_div .input_ul").on("click","li",function(){
                                    todayres();
                                })

                                function todayres() {
                                    var inputValnum = $("#inputValue").attr('value');
                                    var type = $(".dayresidents_layer_top_tab ul .active").attr('value');
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'type': type,//quanbu/hubei
                                        'timeInfo': inputValnum,//今日昨日
                                        'listType':'4'//1隔离人员出入告警列表； 2隔离人员统计列表 3今日居民出入统计列表； 4今日访客出入统计列表； 5湖北人员统计列表； 6返京人员统计列表；
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#dayresidents_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/yiqingListInfo', //数据接口
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
                                                { field: 'household_type', width: '6%', title: '住户类型' },
                                                { field: 'household_name', width: '6%', title: '被访住户' },
                                                { field: 'gender', width: '3%', title: '性别' },
                                                { field: 'age', width: '3%', title: '年龄' },
                                                { field: 'citizen_id', width: '12%', title: '身份证号' },
                                                { field: 'phone', width: '8%', title: '手机号' },
                                                { field: 'address_province', width: '5%', title: '户籍' },
                                                { field: 'community_name', width: '10%', title: '小区' },
                                                { field: 'address', width: '12%', title: '详细住址' },
                                                { field: 'open_time', width: '13%', title: '最后一次出入时间' },
                                                { field: '', width: '6%', title: '操作', toolbar: '#dayresidents_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    //监听工具条
                                    layerData.table.on('tool(dayresidents_table)', function (obj) {
                                        var peopleData = obj.data;
                                        let empty = null;
                                        for (const key in peopleData) {//处理字符串null
                                            // console.log(key)
                                            if (peopleData.hasOwnProperty(key)) {
                                                if (peopleData[key] === null) {
                                                    peopleData[key] = "";
                                                    empty = true;
                                                } else {
                                                    empty = false;
                                                }
                                            }
                                        }
                                        if (obj.event === 'dayresidents_table_lock') {

                                            LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                                        }
                                    })
                                }
                                
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                //湖北人员统计
                $("#epidemic_5").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#hubei_layer'),
                            success: function () {
                                $(".hubei_layer_title").html(`湖北人员统计`)
                                $(".hubei_btn").on("click",function(){
                                    todayres()
                                })
                                todayres()
                                function todayres() {
                                    var val = $("#hubei_input").val();
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'listType':'5',//1隔离人员出入告警列表； 2隔离人员统计列表 3今日居民出入统计列表； 4今日访客出入统计列表； 5湖北人员统计列表； 6返京人员统计列表；
                                        'keyword':val
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#hubei_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/yiqingListInfo', //数据接口
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
                                                { field: 'household_name', width: '5%', title: '姓名' },
                                                { field: 'citizen_id', width: '14%', title: '身份证号' },
                                                { field: 'phone', width: '9%', title: '手机号' },
                                                { field: 'address_province', width: '4%', title: '户籍' },
                                                { field: 'community_name', width: '8%', title: '小区' },
                                                { field: 'address', width: '13%', title: '详细住址' },
                                                { field: 'open_time', width: '13%', title: '最后一次出入时间' },
                                                { field: '', width: '6%', title: '操作', toolbar: '#hubei_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    //监听工具条
                                    layerData.table.on('tool(hubei_table)', function (obj) {
                                        var peopleData = obj.data;
                                        let empty = null;
                                        for (const key in peopleData) {//处理字符串null
                                            // console.log(key)
                                            if (peopleData.hasOwnProperty(key)) {
                                                if (peopleData[key] === null) {
                                                    peopleData[key] = "";
                                                    empty = true;
                                                } else {
                                                    empty = false;
                                                }
                                            }
                                        }
                                        if (obj.event === 'hubei_table_lock') {
                                            LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档
                                        }
                                    })
                                }
                                
                            },
                            end:function(){
                                $("#hubei_input").val('');
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                //返程人员统计
                $("#epidemic_6").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#back_layer'),
                            success: function () {
                                $(".back_layer_title").html(`返程人员列表`)
                                $("#back_start").val('');
                                $("#back_end").val('');
                                $(".back_btn").on("click",function(){
                                    todayres()
                                })
                                todayres()
                                function todayres() {
                                    var val = $("#back_input").val();
                                    var back_start = $("#back_start").val();
                                    var back_end = $("#back_end").val();
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'listType':'6',//1隔离人员出入告警列表； 2隔离人员统计列表 3今日居民出入统计列表； 4今日访客出入统计列表； 5湖北人员统计列表； 6返京人员统计列表；
                                        'keyword':val,
                                        'starttime':back_start,
                                        'startend':back_end
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#back_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/yiqingListInfo', //数据接口
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
                                                { field: 'household_name', width: '5%', title: '姓名' },
                                                { field: 'citizen_id', width: '14%', title: '身份证号' },
                                                { field: 'phone', width: '10%', title: '手机号' },
                                                { field: 'address_province', width: '4%', title: '户籍' },
                                                { field: 'community_name', width: '6%', title: '小区' },
                                                { field: 'address', width: '10%', title: '详细住址' },
                                                { field: 'opennewtime', width: '13%', title: '结束时间后出入次数' },
                                                { field: '', width: '6%', title: '操作', toolbar: '#back_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    //监听工具条
                                    layerData.table.on('tool(back_table)', function (obj) {
                                        var peopleData = obj.data;
                                        let empty = null;
                                        for (const key in peopleData) {//处理字符串null
                                            // console.log(key)
                                            if (peopleData.hasOwnProperty(key)) {
                                                if (peopleData[key] === null) {
                                                    peopleData[key] = "";
                                                    empty = true;
                                                } else {
                                                    empty = false;
                                                }
                                            }
                                        }
                                        if (obj.event === 'back_table_lock') {
                                            LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档
                                        }
                                    })
                                    //日期时间选择器
                                    layerData.laydate.render({
                                        elem: '#back_start',
                                        type: 'date',
                                        max: LayerTable.api.getNowFormatDate() //layui日历控件设置选择日期不能超过当前日期
                                    });
                                    layerData.laydate.render({
                                        elem: '#back_end',
                                        type: 'date',
                                        max: LayerTable.api.getNowFormatDate() //layui日历控件设置选择日期不能超过当前日期
                                    });
                                }
                                
                            },
                            end:function(){
                                $("#back_input").val('');
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },
            
            //首页  黑名单
            blackPeople: function (layerData) {
                var isclick = true;//防止点击过快
                $(".blackPeople").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#black_layer'),
                            success: function () {
                                var black_layer_right_input;//搜索input值
                                //初始化搜索
                                $(".black_layer_right input").val("");
                                blackList();
                                function blackList() {
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'types': '4',//1重点人 2地区人口  3重点场所  4黑名单
                                        'keyword': black_layer_right_input//搜索框
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#black_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/keynoteListInfo', //数据接口
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
                                                { field: 'level', width: '10%', title: '黑名单类型' },
                                                { field: 'name', width: '10%', title: '姓名' },
                                                { field: 'phone', width: '10%', title: '手机号' },
                                                { field: 'cardid', width: '15%', title: '身份证号' },
                                                { field: 'last_address', width: '15%', title: '地址' },
                                                { field: 'last_addtime', width: '15%', title: '时间' },
                                                { field: '', width: '10%', title: '操作', toolbar: '#black_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                        var apitableFilterIns = layerData.tableFilter.render({
                                            elem: '#black_table',
                                            mode: 'api',
                                            filters: [
                                                { field: 'level', name: 'houmepage_level', type: 'checkbox', data: msg.data.houmepage_level },
                                            ],
                                            done: function (filters) {
                                                // console.log(filters)
                                                black_layer_right_input = $(".black_layer_right input").val();
                                                layerData.table.reload('black_table', {
                                                    where: { //设定异步数据接口的额外参数，任意设
                                                        keyword: black_layer_right_input,
                                                    },
                                                    page: 1
                                                })
                                                apitableFilterIns.reload()
                                                return false;
                                            }
                                        });
                                    });
                                }
                                //地区人口列表上统计
                                var focusAreas = {
                                    types: '4',//1重点人 2地区人口  3重点场所  4黑名单
                                    pageSize: '5'
                                }
                                Frontend.api.Ajax('/Webapi/keynoteCountInfo', focusAreas, function (msg) {
                                    var Data = msg.data;
                                    let str = '';
                                    $.each(Data, function (index, value) {
                                        str += `<li>
                                                <h1>${value.title}</h1>
                                                <p>${value.num}人</p>
                                            </li>`;
                                    })
                                    $(".black_layer_left").html(str);
                                })
                                //监听工具条
                                layerData.table.on('tool(black_table)', function (obj) {
                                    var peopleData = obj.data;
                                    let empty = null;
                                    for (const key in peopleData) {//处理字符串null
                                        // console.log(key)
                                        if (peopleData.hasOwnProperty(key)) {
                                            if (peopleData[key] === null) {
                                                peopleData[key] = "";
                                                empty = true;
                                            } else {
                                                empty = false;
                                            }
                                        }
                                    }
                                    if (obj.event === 'black_table_lock') {

                                        layerData.layer.open({
                                            type: 1,
                                            title: false,
                                            closeBtn: 1,
                                            shadeClose: true,
                                            shade: 0.8,
                                            skin: 'onePeoplePushclassNew', //皮肤
                                            area: ['17.9rem', '17.7rem'],
                                            zIndex:2000000, //层优先级
                                            content: $('#onePeoplePush_photo'),
                                            success: function () {
                                                var str = `<div class="onePeoplePush_photo_title">抓拍照片</div>
                                                <div class="onePeoplePush_photo_top">

                                                    <h1><b>姓&emsp;&emsp;名：${peopleData.name}</b><span>时&emsp;&emsp;间：${peopleData.last_addtime}</span></h1>
                                                    <p><b>地&emsp;&emsp;址：${peopleData.last_address}</b></p>
                                                </div>
                                                <div class="onePeoplePush_photo_bottom"><img src="${peopleData.pic}" alt=""></div>`;
                                                $(".onePeoplePush_photo").html(str);
                                            }
                                        })

                                    }
                                })
                                $("#black_layer_right_btn").on("click", function () {
                                    black_layer_right_input = $(".black_layer_right input").val();
                                    blackList();
                                })
                            },
                            end: function () { }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }

                })
            },
            //首页  陌生人
            stranger:function(layerData){
                var isclick = true;//防止点击过快
                $(".stranger").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '18rem'],
                            zIndex:2000000, //层优先级
                            content: $('#stranger_layer'),
                            success: function () {
                                $("#stranger_start").val("");
                                $("#stranger_end").val("");
                                $(".stranger_layer_bottom_ul").html('')
                                var Stranger_start = '';//开始时间
                                var Stranger_end = '';//结束时间
                                var page = '1';
                                //日期时间选择器
                                layerData.laydate.render({
                                    elem: '#stranger_start',
                                    type: 'datetime',
                                    max: LayerTable.api.getNowFormatDate() //layui日历控件设置选择日期不能超过当前日期
                                });
                                layerData.laydate.render({
                                    elem: '#stranger_end',
                                    type: 'datetime',
                                    max: LayerTable.api.getNowFormatDate()
                                });
                                //点击搜索
                                $("#stranger_btn").on("click",function(){
                                    Stranger_start = $("#stranger_start").val();
                                    Stranger_end = $("#stranger_end").val();

                                    strangerList(Stranger_start,Stranger_end,'1')
                                })
                                strangerList(Stranger_start,Stranger_end,page)
                                function strangerList(Stranger_start,Stranger_end,page) { 
                                    if(page == '1'){
                                        $(".stranger_layer_bottom_ul").html('')
                                    }
                                    var obj = {
                                        page:page,
                                        pageSize:'8',
                                        startTime:Stranger_start,
                                        endTime:Stranger_end
                                    }
                                    Frontend.api.Ajax('/Webapi/strangerListInfo', obj, function (msg) {
                                        
                                        var Data = msg.data;
                                        var str = '';
                                        $.each(Data,function(index,value){
                                            str += `<li>
                                                <dl>
                                                    <dt><img src="${value.images}" alt=""></dt>
                                                    <dd>
                                                        <p>${value.address}</p>
                                                        <p>${value.create_time}</p>
                                                    </dd>
                                                </dl>
                                            </li>`;
                                        })

                                        $(".stranger_layer_bottom_ul").append(str)
                                    })
                                    
                                    addScrollEvent(obj)
                                }

                                function addScrollEvent(obj){
                                    // console.log(params)
                                    $(".stranger_layer_bottom_ul").unbind('scroll').on('scroll', function () {
                                        var h = $(this).height();//div可视区域的高度
                                        var sh = $(this)[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
                                        var st = $(this)[0].scrollTop;//滚动条的当前位置到div顶部的距离
                                        //上面的代码是判断滚动条滑到底部的代码
                                        // console.log('h---'+h)
                                        // console.log('st---'+st)//滚动的值
                                        // console.log('h + st---'+(h + st))
                                        // console.log('sh---'+sh)
                                        if (h + st >= sh) {
                                            // //防止来回滚动
                                            // $(this).unbind('scroll');
                                            // scrollTop = sh - h;
                                            // console.log(obj);
                                            
                                            Stranger_start = obj.startTime;
                                            Stranger_end = obj.endTime;
                                           
                                            page = ++ obj.page;
                                            strangerList(Stranger_start,Stranger_end,page)
                                         
                                        }else if(st == 0){
                                            // scrollTop = sh - h;
                                            // console.log(st);
                                            // console.log(scrollTop);
                                            Stranger_start = obj.startTime;
                                            Stranger_end = obj.endTime;
                                            page = '1';
                                            strangerList(Stranger_start,Stranger_end,page)

                                        }
                                    })
                                }

                            },
                            end: function () { }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }

                })
            },

            //首页设备=》门禁
            device_door:function(layerData){
                var isclick = true;//防止点击过快
                $(".device_door").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '13.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#home_device_layer'),
                            success: function () {
                                home_deviceList();
                                function home_deviceList() {
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'types': '1',//1门禁
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#home_device_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/deviceHomeListInfo', //数据接口
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
                                                { field: 'building_name', width: '8%', title: '楼号' },
                                                { field: 'door_device_id', width: '12%', title: '设备号' },
                                                { field: 'community_name', width: '16%', title: '小区' },
                                                { field: 'door_name', width: '16%', title: '地址' },
                                                { field: 'apply_time', width: '18%', title: '安装时间' },
                                                { field: '', width: '10%', title: '操作', toolbar: '#home_device_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                }
                                //监听工具条
                                layerData.table.on('tool(home_device_table)', function (obj) {
                                    var peopleData = obj.data;
                                    let empty = null;
                                    for (const key in peopleData) {//处理字符串null
                                        // console.log(key)
                                        if (peopleData.hasOwnProperty(key)) {
                                            if (peopleData[key] === null) {
                                                peopleData[key] = "";
                                                empty = true;
                                            } else {
                                                empty = false;
                                            }
                                        }
                                    }
                                    if (obj.event === 'home_device_table_lock') {
                                        LayerTable.api.DOOR_INFO_DEVICE(layerData, peopleData); // 门禁弹层详情 ==>信息和通行记录 
                                    }
                                })
                            },
                            end: function () { }
                        })
                        // 定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }

                })
            },

            //首页设备 == >门禁弹层详情 ==>信息和通行记录
            DOOR_INFO_DEVICE:function(layerData,peopleData){
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'yirenyidangclass', //皮肤
                    area: ['41rem', '20rem'],
                    zIndex:2000000, //层优先级
                    content: $('#DOOR_INFO'),
                    success: function () {
                         //初始化日期为空
                        $("#DOOR_INFO_start").val("");
                        $("#DOOR_INFO_end").val("");
                        $(".DOOR_INFO_layer_right_input").val("");
                        var DOOR_INFO_start;//开始时间
                        var DOOR_INFO_end;//结束时间
                        var INPUT_VAL;//搜索值

                        DOOR_INFO()//门禁信息
                        function DOOR_INFO() {
                            var Datainfo = {
                                doorCode:peopleData.door_code
                            }
                            Frontend.api.Ajax('/Webapi/devlceDoorInfo', Datainfo, function (msg) {

                                var newData,online;
                                newData = msg.data[0];

                                let empty = null;
                                for (const key in newData) {//处理字符串null
                                    // console.log(key)
                                    if (newData.hasOwnProperty(key)) {
                                        if (newData[key] === null) {
                                            newData[key] = "";
                                            empty = true;
                                        } else {
                                            empty = false;
                                        }
                                    }
                                }

                                $(".DOOR_INFO_title").html(newData.door_address)
                                
                                var str =`<ul>
                                        <li><b>设备编码：</b><span>${newData.door_device_id}</span></li>
                                        <li><b>运行状态：</b><span>${newData.online}</span></li>
                                        <li><b>经&nbsp;纬&nbsp;度：</b><span>${newData.latitude}&nbsp;&nbsp;${newData.longitude}</span></li>
                                        <li><b>设备型号：</b><span></span></li>
                                    </ul>
                                    <ul>
                                        <li><b>安装位置：</b><span>${newData.door_address}</span></li>
                                    </ul>`
                                $(".DOOR_INFO_top_right .DOOR_INFO_top_right_div").html(str)
                
                            })
                        }
                        DOOR_INFO_TABLE()//门禁表格信息
                        function DOOR_INFO_TABLE(){
                            let dataNew = {
                                'pageSize': '5',//每页显示的数量
                                'doorCode':peopleData.door_code,
                                'communityCode':peopleData.community_code,
                                'keyword': INPUT_VAL,
                                'startTime':DOOR_INFO_start,
                                'endTime': DOOR_INFO_end
                            }
                            let params = Frontend.api.getPostParams(dataNew);
                            layerData.table.render({
                                elem: '#DOOR_INFO_table_go',
                                // height: 1050,
                                // width: 3500,
                                url: window.publicUrl+'/Webapi/devlceDoorLogInfo', //数据接口
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
                                limit: 5,
                                cols: [
                                    [ //表头
                                        { field: '', width: '1%',title: ''},
                                        { field: 'apply_time',  width: '15%', title: '出入时间' },
                                        { field: 'open_type', width: '10%', title: '开门方式' },
                                        { field: 'household_type', width: '10%', title: '住户类型' },
                                        { field: 'operator_name', width: '15%', title: '开门/被访者' },
                                        { field: 'label', width: '15%', title: '人员标签' },
                                        // { field: '', width: '20%', title: '操作', toolbar: '#DOOR_INFO_go_Demo' },
                                        { field: '', width: '14%', title: '操作', toolbar: '#DOOR_INFO_go_Demo' },
                                    ]
                                ],
                                done:function(res){
                                    LayerTable.api.layuiTitle()//layui表格title提示
                                }
                            });

                            Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                var apitableFilterIns = layerData.tableFilter.render({
                                    elem: '#DOOR_INFO_table_go',
                                    mode: 'api',
                                    filters: [
                                        { field: 'open_type', name: 'openType', type: 'checkbox', data: msg.data.open_type },
                                        { field: 'household_type', name: 'householdType', type: 'checkbox', data: msg.data.household_type}
                                    ],
                                    done: function (filters) {
                                        // console.log(filters)
                                        layerData.table.reload('DOOR_INFO_table_go', { 'page': 1 })//选择过滤的时候从第一页开始显示
                                        apitableFilterIns.reload()
                                        return false;
                                    }
                                });
                            });
                            //监听工具条
                            layerData.table.on('tool(DOOR_INFO_table_go)', function (obj) {
                                var people_table = obj.data;
                                let empty = null;
                                for (const key in people_table) {//处理字符串null
                                // console.log(key)
                                    if (people_table.hasOwnProperty(key)) {
                                        if (people_table[key] === null) {
                                        people_table[key] = "";
                                        empty = true;
                                        } else {
                                        empty = false;
                                        }
                                    }
                                }
                                // console.log(people_table)
                                if (obj.event === 'push_photo') {//开门抓拍
                                    LayerTable.api.OnePeopleOnefilePhoto(layerData, people_table);
                                } else if (obj.event === 'video') {//实时视频
                                    LayerTable.api.OnePeopleOnefileVideo(layerData, people_table);
                                } else if (obj.event === 'trailing_photo') {//尾随抓拍  没有先不做
                                    return false;
                                }
                            })
                            
                        }
                        
                        //日期时间选择器
                        layerData.laydate.render({
                            elem: '#DOOR_INFO_start',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate() //layui日历控件设置选择日期不能超过当前日期
                        });
                        layerData.laydate.render({
                            elem: '#DOOR_INFO_end',
                            type: 'datetime',
                            max: LayerTable.api.getNowFormatDate()
                        });

                        
                        //点击搜索
                        $("#DOOR_INFO_layer_right_btn").unbind('click').on("click", function () {
                            DOOR_INFO_start = $("#DOOR_INFO_start").val();
                            DOOR_INFO_end = $("#DOOR_INFO_end").val();
                            INPUT_VAL = $(".DOOR_INFO_layer_right_input").val();
                            var date_start = new Date(DOOR_INFO_start);
                            var date_end = new Date(DOOR_INFO_end);
                            var DOOR_INFO_start_time = date_start.getTime();
                            var DOOR_INFO_end_time = date_end.getTime();
                            if (DOOR_INFO_start_time > DOOR_INFO_end_time) {
                                return layerData.layer.msg('输入日期错误');
                            } else {
                                DOOR_INFO_TABLE();//出行记录
                            }

                        })

                    }
                })
            },


            //首页设备=》监控
            device_monitor:function(layerData){
                var isclick = true;//防止点击过快
                $(".device_monitor").on('click', function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '18rem'],
                            zIndex:2000000, //层优先级
                            content: $('#home_monitor_layer'),
                            success: function () {
                                $(".home_monitor_layer_title").append('<span class="home_monitor_video" style="position: absolute;right: 4rem;color:#00ffff;cursor: pointer;font-size:0.55rem" >查看全部监控</span>')
                                home_monitorList();
                                function home_monitorList() {
                                    let dataNew = {
                                        'pageSize': '16',//每页显示的数量
                                        'types': '3',//3监控
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#home_monitor_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/deviceHomeListInfo', //数据接口
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
                                        limit: 16,
                                        cols: [
                                            [ //表头
                                                {
                                                    field: 'idIndex', title: '编号', width: '5%', align: 'center', templet: function (e) {
                                                        let idIndex = e.LAY_INDEX;
                                                        return idIndex;
                                                    }
                                                },
                                                { field: 'device_no', width: '10%', title: '设备号' },
                                                { field: 'address', width: '35%', title: '地址' },
                                                { field: '', width: '12%', title: '操作', toolbar: '#home_monitor_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                            //点击全部查看监控
                                            $(".home_monitor_video").unbind("click").on("click",function(){
                                                layerData.layer.open({
                                                    type: 1,
                                                    title: false,
                                                    closeBtn: 1,
                                                    shadeClose: true,
                                                    shade: 0.8,
                                                    skin: 'onePeoplePushclass', //皮肤
                                                    area: ['30rem', '18rem'],
                                                    zIndex:2000000, //层优先级
                                                    content: $('#monitorALL'),
                                                    success: function () {
                                                        var DataArr = res.data;
                                                        $.each(DataArr,function(index,item){
                                                            str = `
                                                            <dl style="width: 25%;height: 33.33%;float: left;padding: 0 1%;">
                                                                <dt style="height:85%;width:100%;margin: 0 auto;"><iframe src="${item.video_url}" allowfullscreen style="width:100%;height:100%;"></iframe></dt>
                                                                <dd style="color:#fff;font-size:0.4rem;line-height:0.5rem">${item.address}</dd>
                                                            </dl>`

                                                            $(".monitorALL").append(str);
                                                        })
                                                    },
                                                    end:function(){
                                                        $(".monitorALL").html("")
                                                    }
                                                })


                                            })
                                        }
                                    });
                                }
                                //监听工具条
                                layerData.table.on('tool(home_monitor_table)', function (obj) {
                                    var peopleData = obj.data;
                                    let empty = null;
                                    for (const key in peopleData) {//处理字符串null
                                        // console.log(key)
                                        if (peopleData.hasOwnProperty(key)) {
                                            if (peopleData[key] === null) {
                                                peopleData[key] = "";
                                                empty = true;
                                            } else {
                                                empty = false;
                                            }
                                        }
                                    }
                                    if (obj.event === 'home_monitor_table_lock') {
                                        layerData.layer.open({
                                            type: 1,
                                            title: false,
                                            closeBtn: 1,
                                            shadeClose: true,
                                            shade: 0.8,
                                            skin: 'onePeoplePushclass', //皮肤
                                            area: ['25rem', '18rem'],
                                            zIndex:2000000, //层优先级
                                            content: $('#monitorTime'),
                                            success: function () {
                                                $(".monitorTime_title").html(peopleData.address)
                                                var str = `<iframe src="${peopleData.video_url}" allowfullscreen style="width:100%;height:100%;"></iframe>`;
                                                $(".monitorTime_bottom").html(str);

                                                //点击搜索按钮  以时间段来搜索监控
                                                var monitorStart, monitorEnd;
                                                $("#monitorTime_btn").unbind('click').on("click",function(){
                                                    monitorStart = $("#monitorTime_start").val();
                                                    monitorEnd = $("#monitorTime_end").val();
                                                    
                                                    monitorStart = monitorStart.replace(/-/g,'');
                                                    monitorStart = monitorStart.replace(/:/g,'');
                                                    monitorStart = monitorStart.replace(/ /g,'');
                                                    monitorEnd = monitorEnd.replace(/-/g,'');
                                                    monitorEnd = monitorEnd.replace(/:/g,'');
                                                    monitorEnd = monitorEnd.replace(/ /g,'');

                                                    var strNew = `<iframe src="${peopleData.video_action1+monitorStart+peopleData.video_action2+monitorEnd+peopleData.video_action3}" allowfullscreen style="width:100%;height:100%;"></iframe>`;
                                                    $(".monitorTime_bottom").html(strNew);
                
                                                })

                                            },
                                            end:function(){
                                                $(".monitorTime_bottom").html("");
                                                $("#monitorTime_start").val("");
                                                $("#monitorTime_end").val("");
                                            }
                                        })
                                        
                                    }
                                })
                                // 日期时间选择器
                                layerData.laydate.render({
                                    elem: '#monitorTime_start',
                                    type: 'datetime',
                                    max: LayerTable.api.getNowFormatDate()
                                });
                                layerData.laydate.render({
                                    elem: '#monitorTime_end',
                                    type: 'datetime',
                                    max: LayerTable.api.getNowFormatDate()
                                });

                               
                                        
                            },
                            end: function () { }
                        })
          
                        // 定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }

                })
            },


            //以图搜图
            OneImg:function(layerData){
                var isclick = true;//防止点击过快
                $("#imgbtn").unbind('click').on('click', function () {
                    if (isclick) {
                        isclick = false;

                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#OneImg_layer'),
                            success: function () {
                              
                                var str = '<span class="inputVal_span" id="uploadimg" style="cursor: pointer;margin-left: 0.2rem;"><i class="layui-icon"></i>上传图片</span>';
                                $("#inputText").after(str)
                               
                                //设定文件大小限制
                                layerData.upload.render({
                                    elem: '#uploadimg',
                                    url: '/Map/searchFileeUpload',
                                    done: function(res){
                                        if(res.code == '200'){
                                            layer.msg('上传成功')
                                          
                                        }else{
                                            layer.msg('上传失败')
                                        }
                                    },
                                    choose: function(obj){
                                        obj.preview(function(index, file, result){
                                            // console.log(index); //得到文件索引
                                            // console.log(file); //得到文件对象
                                            // console.log(result); //得到文件base64编码，比如图片
                                            var FileName = file.name;
                                            $("#inputText").val(FileName)
                                            $("#inputHidden").val(result)
                                        });
                                    },
                                });

                                var OneImg_layer_inputText,inputVal,inputText;
                                OneImg_layer_inputText = '';
                                
                                //下拉框相似度
                                $("#inputVal").unbind("click").on("click",function(event){
                                    event.stopImmediatePropagation();//取消事件冒泡
                                    $(".input_ul").toggle();
                                })
                                $(document).bind("click",function(){
                                    $(".input_ul").hide();
                                })
                                $(".input_ul li").unbind("click").on("click",function(){
                                    var thisval = $(this).attr("value");
                                    var thishtml = $(this).html();
                                    $("#inputVal").attr("value",thisval);
                                    $("#inputVal>span").html(thishtml);
                                    $(".input_ul").hide();
                                })
                                $("#OneImg_layer_btn").unbind("click").on("click", function () {
                                    inputText = $("#inputText").val();
                                    inputVal = $("#inputVal").attr('value');
                                    if(inputText != ''){
                                        var inputTextVal = inputText.slice(0,4)
                                        if(inputTextVal == 'http'){
                                            OneImg_layer_inputText = inputText;
                                            $("#inputHidden").val("");
                                        }else if(inputTextVal != '' && inputTextVal != 'http'){
                                            OneImg_layer_inputText = $("#inputHidden").val();
                                        }
                                        //获取上传图片的base64值
                                        OneImgList();
                                    }else{
                                        layer.msg('图片地址不能为空')
                                    }
                                })
                                    

                            
                                function OneImgList() {
                                    let dataNew = {
                                        // 'pageSize': '10',//每页显示的数量
                                        // 'types': '5',//1街道；2小区；3社区；4楼栋5房屋；6人口；7设备；8单位
                                        'degree':inputVal,
                                        'image': OneImg_layer_inputText//搜索框
                                        
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                          
                                    layerData.table.render({
                                        elem: '#OneImg_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/faceSearch', //数据接口
                                        method:'post',
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
                                                { field: 'household_name', width: '8%', title: '姓名' },
                                                { field: 'household_type', width: '8%', title: '住户类型' },
                                                { field: 'phone', width: '12%', title: '手机号' },
                                                { field: 'address_town', width: '12%', title: '街道' },
                                                { field: 'address_village', width: '16%', title: '社区' },
                                                { field: 'community_name', width: '10%', title: '小区' },
                                                {
                                                    field: 'addressinfo', width: '10%', title: '房屋住址', templet: function (e) {
                                                        let addressinfo = e.building_name + e.unit_name + e.room_name;
                                                        return addressinfo;
                                                    }
                                                },
                                                { field: '', width: '8%', title: '操作', toolbar: '#OneImg_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                }

                                //监听工具条
                                layerData.table.on('tool(OneImg_table)', function (obj) {
                                    var peopleData = obj.data;
                                    if (obj.event === 'OneImg_table_lock') {
                                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档
                                    }
                                })
                                
                            },
                            end: function () {
                                //初始化搜索
                                $("#uploadimg").remove();
                                $("#inputText").val("");
                                $("#inputHidden").val("");
                                $(".input_ul").hide();
                                $(".OneImg_layer_table").find('.layui-form').remove();
                                $("#inputVal").attr('value','80');
                                $("#inputVal>span").html('80以上');
                            }
                        })

                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },

            //房屋列表
            houseList: function (layerData) {
                var isclick = true;//防止点击过快
                $("#houseList").on('click', function () {
                    if (isclick) {
                        isclick = false;

                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#houseList_layer'),
                            success: function () {
                                var houseList_layer_right_input;//搜索input值
                                //初始化搜索
                                $(".houseList_layer_right input").val("");
                                houseListList();
                                function houseListList() {
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'types': '5',//1街道；2小区；3社区；4楼栋5房屋；6人口；7设备；8单位
                                        'keyword': houseList_layer_right_input//搜索框
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#houseList_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/countListInfo', //数据接口
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
                                                { field: 'room_use_status', width: '8%', title: '房屋类型' },
                                                { field: 'address_town', width: '12%', title: '街道' },
                                                { field: 'address_village', width: '16%', title: '社区' },
                                                { field: 'community_name', width: '10%', title: '小区' },
                                                {
                                                    field: 'addressinfo', width: '10%', title: '房屋住址', templet: function (e) {
                                                        let addressinfo = e.building_name + e.unit_name + e.room_name;
                                                        return addressinfo;
                                                    }
                                                },
                                                { field: '', width: '8%', title: '操作', toolbar: '#houseList_table_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                        var apitableFilterIns = tableFilter.render({
                                            elem: '#houseList_table',
                                            mode: 'api',
                                            filters: [
                                                { field: 'room_use_status', name: 'roomInfo', type: 'checkbox', data: msg.data.room_use_status },
                                                { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                                { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                                { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name },
                                            ],
                                            done: function (filters) {
                                                // console.log(filters)
                                                houseList_layer_right_input = $(".houseList_layer_right input").val();
                                                layerData.table.reload('houseList_table', {
                                                    where: { //设定异步数据接口的额外参数，任意设
                                                        keyword: houseList_layer_right_input,
                                                    },
                                                    page: 1
                                                })

                                                apitableFilterIns.reload()
                                                return false;
                                            }
                                        });
                                    });

                                }

                                //监听工具条
                                layerData.table.on('tool(houseList_table)', function (obj) {
                                    var peopleData = obj.data;
                                    var roomCode = {
                                        'roomCode': peopleData.room_code,
                                    };
                                    if (obj.event === 'houseList_table_lock') {
                                        LayerTable.api.onehouseOnefiles(layerData, roomCode); // 一屋一档
                                    }
                                })
                                $("#houseList_layer_right_btn").unbind("click").on("click", function () {
                                    houseList_layer_right_input = $(".houseList_layer_right input").val();
                                    houseListList();
                                })
                            },
                            end: function () { }
                        })

                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },
            //人口列表
            peopleList: function (layerData) {
                var isclick = true;//防止点击过快
                $("#peopleList").on('click', function () {
                    if (isclick) {
                        isclick = false;

                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            area: ['36rem', '16.5rem'],
                            zIndex:2000000, //层优先级
                            content: $('#peopleList_layer'),
                            success: function () {
                                var peopleList_layer_right_input;//搜索input值
                                //初始化搜索
                                $(".peopleList_layer_right input").val("");
                                peopleListList();
                                function peopleListList() {
                                    let dataNew = {
                                        'pageSize': '10',//每页显示的数量
                                        'types': '6',//1街道；2小区；3社区；4楼栋5房屋；6人口；7设备；8单位
                                        'keyword': peopleList_layer_right_input//搜索框
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);
                                    layerData.table.render({
                                        elem: '#peopleList_table',
                                        // height: 1050,
                                        // width: 3500,
                                        url: window.publicUrl+'/Webapi/countListInfo', //数据接口
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
                                                { field: 'household_type', width: '7%', title: '住户类型' },
                                                { field: 'household_name', width: '5%', title: '姓名' },
                                                { field: 'citizen_id', width: '15%', title: '身份证号/通行证号' },
                                                { field: 'address_town', width: '12%', title: '街道' },
                                                { field: 'address_village', width: '14%', title: '社区' },
                                                { field: 'community_name', width: '10%', title: '小区' },
                                                {
                                                    field: 'address', title: '住址', width: '10%', templet: function (e) {
                                                        let address = e.building_name + e.unit_name + e.room_name;
                                                        return address;
                                                    }
                                                },
                                                { field: '', width: '8%', title: '操作', toolbar: '#today_Demo' },
                                            ]
                                        ],
                                        done:function(res){
                                            LayerTable.api.layuiTitle()//layui表格title提示
                                        }
                                    });
                                    

                                    Frontend.api.Ajax('/Webapi/selectInfo', null, function (msg) {
                                        var apitableFilterIns = layerData.tableFilter.render({
                                            elem: '#peopleList_table',
                                            mode: 'api',
                                            filters: [
                                                { field: 'household_type', name: 'householdType', type: 'checkbox', data: msg.data.household_type },
                                                { field: 'address_town', name: 'addressTown', type: 'checkbox', data: msg.data.address_town },
                                                { field: 'address_village', name: 'addressVillage', type: 'checkbox', data: msg.data.address_village },
                                                { field: 'community_name', name: 'communityName', type: 'checkbox', data: msg.data.community_name }
                                            ],
                                            done: function (filters) {
                                                // console.log(filters)
                                                peopleList_layer_right_input = $(".peopleList_layer_right input").val();
                                                layerData.table.reload('peopleList_layer', {
                                                    where: { //设定异步数据接口的额外参数，任意设
                                                        keyword: peopleList_layer_right_input,
                                                    },
                                                    page: 1
                                                })
                                                apitableFilterIns.reload()
                                                return false;
                                            }
                                        });
                                    });
                                }

                                //监听工具条
                                layerData.table.on('tool(peopleList_table)', function (obj) {
                                    var peopleData = obj.data;
                                    if (obj.event === 'yirenyidang') {
                                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档
                                    }
                                });
                                $("#peopleList_layer_right_btn").unbind("click").on("click", function () {
                                    peopleList_layer_right_input = $(".peopleList_layer_right input").val();
                                    peopleListList();
                                })
                            },
                            end: function () { }
                        })

                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },


            //echart政治面貌 监听工具条
            politicsTool: function (layerData) {
                //监听工具条
                layerData.table.on('tool(politics_table)', function (obj) {
                    var peopleData = obj.data;
                    let empty = null;
                    for (const key in peopleData) {//处理字符串null
                        // console.log(key)
                        if (peopleData.hasOwnProperty(key)) {
                            if (peopleData[key] === null) {
                                peopleData[key] = "";
                                empty = true;
                            } else {
                                empty = false;
                            }
                        }
                    }
                    if (obj.event === 'politics_table_lock') {

                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                    }
                })
            },
            //echart户籍统计 监听工具条
            houseStatisticsTool: function (layerData) {
                //监听工具条
                layerData.table.on('tool(houseStatistics_table)', function (obj) {
                    var peopleData = obj.data;
                    let empty = null;
                    for (const key in peopleData) {//处理字符串null
                        // console.log(key)
                        if (peopleData.hasOwnProperty(key)) {
                            if (peopleData[key] === null) {
                                peopleData[key] = "";
                                empty = true;
                            } else {
                                empty = false;
                            }
                        }
                    }
                    if (obj.event === 'houseStatistics_table_lock') {

                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                    }
                })
            },
            //echart民族分布 监听工具条
            nationTool: function (layerData) {
                //监听工具条
                layerData.table.on('tool(nation_table)', function (obj) {
                    var peopleData = obj.data;
                    let empty = null;
                    for (const key in peopleData) {//处理字符串null
                        // console.log(key)
                        if (peopleData.hasOwnProperty(key)) {
                            if (peopleData[key] === null) {
                                peopleData[key] = "";
                                empty = true;
                            } else {
                                empty = false;
                            }
                        }
                    }
                    if (obj.event === 'nation_table_lock') {

                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                    }
                })
            },
            //echart房屋占比 监听工具条
            houseProportionTool: function (layerData) {
                //监听工具条
                layerData.table.on('tool(houseProportion_table)', function (obj) {
                    var peopleData = obj.data;
                    var roomCode = {
                        'roomCode': peopleData.room_code,
                    };
                    if (obj.event === 'houseProportion_table_lock') {
                        LayerTable.api.onehouseOnefiles(layerData, roomCode); // 一屋一档
                    }
                })
            },
            //echart特殊人群 监听工具条
            specialTool: function (layerData) {
                //监听工具条
                layerData.table.on('tool(special_table)', function (obj) {
                    var peopleData = obj.data;
                    let empty = null;
                    for (const key in peopleData) {//处理字符串null
                        // console.log(key)
                        if (peopleData.hasOwnProperty(key)) {
                            if (peopleData[key] === null) {
                                peopleData[key] = "";
                                empty = true;
                            } else {
                                empty = false;
                            }
                        }
                    }
                    if (obj.event === 'special_table_lock') {//点击一人一档
                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档
                    }

                })

            },
            //echart从业状况 监听工具条
            takeTool: function (layerData) {
                //监听工具条
                layerData.table.on('tool(take_table)', function (obj) {
                    var peopleData = obj.data;
                    let empty = null;
                    for (const key in peopleData) {//处理字符串null
                        // console.log(key)
                        if (peopleData.hasOwnProperty(key)) {
                            if (peopleData[key] === null) {
                                peopleData[key] = "";
                                empty = true;
                            } else {
                                empty = false;
                            }
                        }
                    }
                    if (obj.event === 'take_table_lock') {

                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                    }
                })
            },
            //echart外来人口籍贯 监听工具条
            externalTool: function (layerData) {
                //监听工具条
                layerData.table.on('tool(external_table)', function (obj) {
                    var peopleData = obj.data;
                    let empty = null;
                    for (const key in peopleData) {//处理字符串null
                        // console.log(key)
                        if (peopleData.hasOwnProperty(key)) {
                            if (peopleData[key] === null) {
                                peopleData[key] = "";
                                empty = true;
                            } else {
                                empty = false;
                            }
                        }
                    }
                    if (obj.event === 'external_table_lock') {

                        LayerTable.api.onepeopleOnefiles(layerData, peopleData); // 一人一档

                    }
                })
            },
            //map 出租房空置告警 
            houseVacancy: function (layerData) {
                $(".timeDate").on("click", function () {
                    //houseVacancyclass出租房空置、群租房 告警皮肤   
                    // soswarnclass  sos告警、黑名单  
                    // equipmentclass设备烟感门禁告警  
                    // specialclass特殊人群告警
                    //personnelclass 重点人员告警
                    layerData.layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 1,
                        shadeClose: true,
                        shade: 0.6,
                        skin: 'personnelclass',
                        area: ['15rem', '7rem'],
                        zIndex:2000000, //层优先级
                        content: $('#houseVacancy'),
                        success: function () {
                            var houseVacancyImg = `<img src="../../img/da1.gif" alt="" style="position:absolute;top:-1rem;right:-10rem;width:10rem;height: auto;"></img>`;
                            $("#houseVacancy").parent().after(houseVacancyImg);
                            $(".layui-layer-shade").css("box-shadow", " 0px 0px 5rem red inset")
                        }
                    })
                })
            },
            //map 楼栋
            Building: function (layerData, newData) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'loucengclass', //皮肤
                    area: ['20.8rem', '15.6rem'],
                    zIndex:2000000, //层优先级
                    content: $('#louceng_layer'),
                    success: function () {
                        //初始化楼栋
                        $(".louceng_layer_title").html("");
                        $(".louceng_layer_tottom").html("");
                        $(".louceng_layer_top_right").html("");
                        
                        // var newData = {
                        //     buildingCode : '6540030040-xinjiang-2aacd3bc'
                        // }
                        Frontend.api.Ajax('/Webapi/showUnityInfo', newData, function (msg) {
                            var building_name = newData.buildingName;
                            var numinfo = newData.numinfo;
                            // console.log(msg.data)
                            var Data = msg.data;
                            var DataLabel = msg.dataLabel;
                            var Count = msg.count;//td最多的一个房间数量
                            var str = '';
                            str += `<div class="swiper-container gallery-top"><div class="swiper-wrapper">`
                            $.each(Data, function (idx, val) {
                                // console.log(val)                               
                                if (val != '') {
                                    str += `<div class="swiper-slide">
                                    <div class="louceng_layer_title">${building_name}(${numinfo}人)</div>
                                    <div class="louceng_layer_top">
                                        <div class="louceng_layer_top_img"><img src="../../img/wuding.png" alt=""></div>
                                        <div class="louceng_layer_top_left">楼层</div>
                                        <div class="louceng_layer_top_right">
                                            <ul class="louceng_layer_top_right_label"><li class="labelALL">全部</li>`;
                                    $.each(DataLabel[idx], function (index, value) {
                                        var Company = value.title == "疑似群租" ? "间":"人";
                                        var Label;
                                        switch (value.title){
                                            case '重点':
                                                Label = 'label_zhongdian'
                                            break;
                                            case '特殊':
                                                Label = 'label_teshu'
                                            break;
                                            case '疑似群租':
                                                Label = 'label_qunzu'
                                            break;
                                        }
                                        str += ` <li class="${Label}">${value.title}${value.num}${Company}</li>
                                                    `;
                                    });

                                    str += `
                                            <li class="label_zizhu"><b style="background:#2ec46e"></b>自住</li>
                                            <li class="label_chuzhu"><b style="background:#da9b03"></b>出租</li>
                                            <li class="label_kongzhi"><b style="background:#53a4f0"></b>空置</li>
                                            <li class="label_No"><b style="background:#ccc"></b>未登记</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="louceng_layer_tottom">
                                        <div class="louceng_layer_tottom_div_1">
                                        <table>
                                            <tbody>`;
                                    $.each(val, function (index, item) {
                                        var Label_RIGHT;
                                        var arr = [];
                                        $.each(item,function(idx,val){
                                            var TYPE_RIGHT = val.type;
                                            
                                            switch(TYPE_RIGHT.nature){
                                                case '1':
                                                    Label_RIGHT = 'label_kongzhi';
                                                    arr.push(Label_RIGHT)
                                                break;
                                                case '2':
                                                    Label_RIGHT = 'label_zizhu'
                                                    arr.push(Label_RIGHT)
                                                break;
                                                case '3':
                                                    Label_RIGHT = 'label_chuzhu'
                                                    arr.push(Label_RIGHT)
                                                break;
                                                case '4':
                                                    Label_RIGHT = 'label_No'
                                                    arr.push(Label_RIGHT)
                                                break;
                                            }
                                            var TYPE_RIGHT_lable5 = TYPE_RIGHT.type5 != '0' ?  'label_zhongdian' : '';//重点
                                            var TYPE_RIGHT_lable6 = TYPE_RIGHT.type6 != '0' ?  'label_teshu' : '';//特殊
                                            var TYPE_RIGHT_lable7 = TYPE_RIGHT.type7 != '0' ?  'label_qunzu' : '';//群租
                                            arr.push(TYPE_RIGHT_lable5);
                                            arr.push(TYPE_RIGHT_lable6);
                                            arr.push(TYPE_RIGHT_lable7);
                                        })
                                     
                                        var newarr = [...new Set(arr)];//数组去重
                                        var strclass = '';
                                        for(let i= 0;i<newarr.length;i++){
                                            strclass += newarr[i] + ' '
                                        }
                                        str += `<tr class="${strclass}">
                                                        <td>${index}</td>
                                                    </tr>`;
                                    });
                                    str += `</tbody>
                                                </table>
                                            </div>
                                            <div class="louceng_layer_tottom_div_2">
                                                <table class="louceng_layer_tottom_table">
                                                    <tbody>`;
                                    $.each(val, function (index, item) {
                                        str += `<tr>`;
                                        $.each(item, function (index, value) {
                                            // console.log(value)
                                            // "nature": "2",//1空置 2自住 3出租 4借住
                                            // "type5": "1",//1是重点
                                            // "type6": "0",//1是关爱
                                            // "type7": "0"/1是/群租
                                            var Label;
                                            TYPE = value.type;
                                            // var Nature;
                                            var Backcolor;
                                            if (TYPE.nature == '1') {
                                                // Nature = '空置';
                                                Backcolor = "#53a4f0";
                                                Label = 'label_kongzhi'//给b标签添加class
                                            } else if (TYPE.nature == '2') {
                                                // Nature = '自住';
                                                Backcolor = "#2ec46e";
                                                Label = 'label_zizhu'//给b标签添加class
                                            } else if (TYPE.nature == '3') {
                                                // Nature = '出租';
                                                Backcolor = "#da9b03";
                                                Label = 'label_chuzhu'//给b标签添加class
                                            } else if (TYPE.nature == '4') {
                                                // Nature = '未登记';
                                                Backcolor = "#ccc";
                                                Label = 'label_No'//给b标签添加class
                                            };
                    
                                            var TYPE_lable5 = TYPE.type5 != '0' ?  'label_zhongdian' : '';//重点
                                            var TYPE_lable6 = TYPE.type6 != '0' ?  'label_teshu' : '';//特殊
                                            var TYPE_lable7 = TYPE.type7 != '0' ?  'label_qunzu' : '';//群租
                                            
                                            str += ` 
                                                <td>`;
                                               
                                                if (TYPE.type5 != '0' || TYPE.type6 != '0' || TYPE.type7 != '0') {
                                                    lineHeight = 'inherit';
                                                    textAlign = 'left';
                                                    fontSize = '.46rem';
                                                }else{
                                                    lineHeight = '1.2rem';
                                                    textAlign = 'center';
                                                    fontSize = '.5rem';
                                                }
                                                str += `<b class="${Label} ${TYPE_lable5} ${TYPE_lable6} ${TYPE_lable7}" roomCode="${value.room_code}" style="background:${Backcolor};line-height:${lineHeight};text-align:${textAlign};font-size:${fontSize}">${value.room_name}
                                                    <ul>`
                                            //icon
                                            if (TYPE.type5 != '0') {
                                                str += '<li class="emphasis"></li>';
                                            }
                                            if (TYPE.type6 != '0') {
                                                str += '<li class="special"></li>';
                                            }
                                            if (TYPE.type7 != '0') {
                                                str += '<li class="group"></li>';
                                            }
                                            str += ` </ul>
                                                    </b></td>
                                                            `
                                        })
                                        str += `</tr>`;
                                    })
                                    str += ` 
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>`;
                                }
                            })
                            str +=`</div></div>`

                            $('.louceng_layer').append(str);

                            //楼层gallery-thumbs切换点击

                            var strNum = '';
                            strNum += `<div class="swiper-container gallery-thumbs"><div class="swiper-wrapper">`
                            $.each(Data, function (idx, val) {
                                var newidx = idx.split("_");
                                if (val != '') {
                                    strNum += `<div class="swiper-slide">${newidx[0]}<span class="swiper_slide_span">(${newidx[1]}人)</span></div>`
                                }
                            })
                            str +=`</strNum></div>`
                            $('.louceng_layer').append(strNum);
                            $('.louceng_layer').append(`<div class="swiper-button-next swiper-button-white" style="margin-top: 6.5rem"></div>
                            <div class="swiper-button-prev swiper-button-white" style="margin-top: 6.5rem"></div>`)
                            

                            if(msg.floorType == '1'){//1有楼层2没有楼层
                                $(".louceng_layer_tottom_table").css({
                                    "width":Count * 2.78 + 'rem'
                                });
                            }else{
                                if(Count >6){
                                    $(".louceng_layer_tottom_table").css({
                                        "width":10 * 2.78 + 'rem'
                                    });
                                }else{
                                    $(".louceng_layer_tottom_table").css({
                                        "width":6 * 2.78 + 'rem'
                                    });
                                }
                               
                                $(".louceng_layer .louceng_layer_tottom .louceng_layer_tottom_div_1 td").css({
                                    'background': 'none',
                                    'font-size': '0px'
                                })
                            }
                           
                            /*1.当楼层房屋数量大于6并且小于等于10时 根据数量的变化改变楼栋弹层的宽度
                              2.当楼层房屋数量大于10时 楼栋弹层的宽度以10为基准 多出显示滚动条
                              3.当楼层房屋数量小于等于6时 楼栋弹层的宽度以6为基准*/
                            var newCount;
                            if(Count <=10 && Count>6){
                                newCount = Count-6;
                                CountNUM(newCount)
                            }else if(Count>10){
                                CountNUM(4)
                            }else{
                                CountNUM(0)
                            }
                            function CountNUM(newCount){
                                $(".loucengclass").css({
                                    'width': 20.8 + newCount * 2.78 + 'rem',
                                    'left':'50%',
                                    'margin-left': -(20.8 + newCount * 2.78)/2 + 'rem'
                                })
                                $(".louceng_layer").css({
                                    'width': 20.8 + newCount * 2.78 + 'rem'
                                })
                                $(".louceng_layer .louceng_layer_top .swiper-slide-active").css({
                                    'width': 18.8 + newCount * 2.78 + 'rem'
                                })
                                $(".louceng_layer .louceng_layer_top").css({
                                    'width': 18.8 + newCount * 2.78 + 'rem'
                                })
                                $(".louceng_layer .louceng_layer_top .louceng_layer_top_img").css({
                                    'width': 18.8 + newCount * 2.78 + 'rem'
                                })
                                $(".louceng_layer .louceng_layer_top .louceng_layer_top_right").css({
                                    'width': 16.8 + newCount * 2.78 + 'rem'
                                })
                                $(".louceng_layer .louceng_layer_tottom").css({
                                    'width': 17.8 + newCount * 2.78 + 'rem'
                                })
                                $(".louceng_layer .louceng_layer_tottom .louceng_layer_tottom_div_2").css({
                                    'width': 16.78 + newCount * 2.78 + 'rem'
                                })
                                
                            }
                            
                            $('.louceng_layer_tottom_table').parent("div").each(function () {
                                $(this).data({
                                    sl: this.scrollLeft,
                                    st: this.scrollTop
                                });
                            }).scroll(function () {
                                var sl = this.scrollLeft,
                                    st = this.scrollTop;
                                $(".louceng_layer_tottom_div_1").scrollTop(st);
                            });

                            //楼栋底部按钮小于4时隐藏左右按钮箭头
                            var len = $(".louceng_layer .gallery-thumbs .swiper-slide").length;
                            if(len < 5){
                                $(".swiper-button-next").hide()
                                $(".swiper-button-prev").hide()
                            }else{
                                $(".swiper-button-next").show()
                                $(".swiper-button-prev").show()
                            }
                            //楼栋底部按钮等于1时隐藏单元按钮
                            if(len == 1){
                                $(".louceng_layer .gallery-thumbs").hide()
                            }else{
                                $(".louceng_layer .gallery-thumbs").show()
                            }

                            var unitsNum;//显示单元的数量
                            if(Count>=10){
                                unitsNum = 7;
                            }else if(Count == 9){
                                unitsNum = 6;
                            }else if(Count == 7 || Count == 8){
                                unitsNum = 5;
                            }else{
                                unitsNum = 4;
                            }
                            //楼层滚动
                            var galleryThumbs = new Swiper('.louceng_layer .gallery-thumbs', {
                                slidesPerView: unitsNum,//显示单元按钮的数量
                                spaceBetween: '1%',
                                watchSlidesProgress: true,//计算每个slide的progress(进度、进程)，
                                watchSlidesVisibility: true,//防止不可点击
                            });
                            var galleryTop = new Swiper('.louceng_layer .gallery-top', {
                                navigation: {
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                },
                                simulateTouch: false,//禁止鼠标拖动
                                thumbs: {
                                    swiper: galleryThumbs,
                                },
                                
                                on:{
                                    init: function(){
                                        //Swiper初始化了
                                        //楼栋滚动条默认滚动到底部
                                        LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                                        LayerTable.api.BuildingFilter()//点击楼栋标签进行筛选

                                        //楼栋单元按钮 选中时显示人数
                                        $(".louceng_layer .gallery-thumbs .swiper-slide .swiper_slide_span").hide();
                                        $(".louceng_layer .gallery-thumbs .swiper-slide-thumb-active .swiper_slide_span").show();

                                        //所有td的width小于总width时隐藏横滚动条    
                                        var buildingtbodytr = $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 .louceng_layer_tottom_table tbody tr");
                                        var buildingtbodytrlen = buildingtbodytr.length;
                                        var tdnum = [];
                                        for(var i=0;i<buildingtbodytrlen; i++){
                                            tdnum.push($(`.louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 .louceng_layer_tottom_table tr:eq(${i}) td`).length);
                                        }
                                        var newArr = [...new Set(tdnum)];//数组去重
                                        var mathNum = Math.max(...newArr);//取出最大值

                                        var buildingtd = $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 .louceng_layer_tottom_table tr:eq(0) td");
                                        var buildingALL = $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2");
                                        //var buildingtdLen = buildingtd.length;
                                        var buildingALLWidth = buildingALL.width();
                                        var buildingtdWidth =  buildingtd.width();
                                        if(mathNum * buildingtdWidth <= buildingALLWidth){
                                            $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2").css("overflow-x","hidden")
                                        }else{
                                            $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2").css("overflow","auto")
                                        }
                                        
                                    }, 
                                    slideChangeTransitionEnd: function(){
                                        // alert(this.activeIndex);//切换结束时，告诉我现在是第几个slide
                                        LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                                        LayerTable.api.BuildingFilter()//点击楼栋标签进行筛选
                                        

                                        //楼栋单元按钮 选中时显示人数
                                        $(".louceng_layer .gallery-thumbs .swiper-slide .swiper_slide_span").hide();
                                        $(".louceng_layer .gallery-thumbs .swiper-slide-thumb-active .swiper_slide_span").show();

                                        //所有td的width小于总width时隐藏横滚动条     
                                        var buildingtbodytr = $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 .louceng_layer_tottom_table tbody tr");
                                        var buildingtbodytrlen = buildingtbodytr.length;
                                        var tdnum = [];
                                        for(var i=0;i<buildingtbodytrlen; i++){
                                            tdnum.push($(`.louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 .louceng_layer_tottom_table tr:eq(${i}) td`).length);
                                        }
                                        var newArr = [...new Set(tdnum)];//数组去重
                                        var mathNum = Math.max(...newArr);//取出最大值
                                        

                                        var buildingtd = $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 .louceng_layer_tottom_table tr:eq(0) td");
                                        var buildingALL = $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2");
                                        //var buildingtdLen = buildingtd.length;
                                        var buildingALLWidth = buildingALL.width();
                                        var buildingtdWidth =  buildingtd.width();
                              
                                        if(mathNum * buildingtdWidth <= buildingALLWidth){
                                            $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2").css("overflow-x","hidden")
                                        }else{
                                            $(".louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2").css("overflow","auto")
                                        }
                                    },
                                },
                            });
                        })
                        
                    },
                    end: function () {
                        $(".swiper-button-next").remove();
                        $(".swiper-button-prev").remove();
                        $('.louceng_layer').html("");
                    }
                })
            },

            //楼栋默认底部滚动条
            BuildingScroll:function(){
                var floorHeight = $('.louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2').prop("scrollHeight");
                $('.louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2').scrollTop(floorHeight);
                $('.louceng_layer .gallery-top .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_1').scrollTop(floorHeight);
            },

            //点击楼栋标签进行筛选
            BuildingFilter:function(){
              
                var labelALL = $(".louceng_layer .swiper-slide-active .louceng_layer_top .labelALL");//全部
                var label_zhongdian = $(".louceng_layer .swiper-slide-active .louceng_layer_top .louceng_layer_top_right_label .label_zhongdian");//标签重点人
                var label_teshu = $(".louceng_layer .swiper-slide-active .louceng_layer_top .louceng_layer_top_right_label .label_teshu");//标签特殊人
                var label_qunzu = $(".louceng_layer .swiper-slide-active .louceng_layer_top .louceng_layer_top_right_label .label_qunzu");//标签群租
                var label_zizhu = $(".louceng_layer .swiper-slide-active .louceng_layer_top .louceng_layer_top_right_label .label_zizhu");//标签自住
                var label_chuzhu = $(".louceng_layer .swiper-slide-active .louceng_layer_top .louceng_layer_top_right_label .label_chuzhu");//标签出租
                var label_kongzhi = $(".louceng_layer .swiper-slide-active .louceng_layer_top .louceng_layer_top_right_label .label_kongzhi");//标签空置
                var label_No = $(".louceng_layer .swiper-slide-active .louceng_layer_top .louceng_layer_top_right_label .label_No");//标签未登记
                var BuildingLable = $(".louceng_layer .swiper-slide-active .louceng_layer_top .louceng_layer_top_right_label li");//所有的li
                
               
                var TABLE_TD = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td");//所有的td
                var TABLE_B = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td b");//所有的td的b
                var TABLE_zhongdian = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td .label_zhongdian");//所有的重点人
                var TABLE_teshu = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td .label_teshu");//所有的特殊人
                var TABLE_qunzu = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td .label_qunzu");//所有的群租
                var TABLE_zizhu = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td .label_zizhu");//所有的自住
                var TABLE_chuzhu = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td .label_chuzhu");//所有的出租
                var TABLE_kongzhi = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td .label_kongzhi");//所有的空置
                var TABLE_No = $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_2 td .label_No");//所有的未登记
              

                var TABLE_RIGHT= $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_1");//所有右侧的楼层
                var TABLE_RIGHT_TR= $(".louceng_layer .swiper-slide-active .louceng_layer_tottom .louceng_layer_tottom_div_1 tr");//所有右侧的楼层
                

                //--------------初始化楼栋 start--------------
                $(".labelALL").css({
                    'border-bottom':' 0.02rem solid #fff'
                }).siblings().css({
                    'border-bottom':'none'
                })
                TABLE_B.show();
                TABLE_RIGHT_TR.show()//右侧所有的楼层
                TABLE_B.parent().parent().show()//左侧所有的房屋
                LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                //--------------初始化楼栋 end--------------

                //点击标签添加下划线
                BuildingLable.on("click",function(){
                    $(this).css({
                       'border-bottom':' 0.02rem solid #fff'
                    }).siblings().css({
                        'border-bottom':'none'
                    })
                })
                //点击全部显示所有房间
                labelALL.on("click",function(){
                    TABLE_B.show();

                    TABLE_RIGHT_TR.show()//右侧所有的楼层
                    TABLE_B.parent().parent().show()//左侧所有的房屋

                    LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                })
                //点击重点人显示所有重点人房间
                label_zhongdian.on("click",function(){
                    TABLE_teshu.hide();
                    TABLE_qunzu.hide();
                    TABLE_zizhu.hide();
                    TABLE_chuzhu.hide();
                    TABLE_kongzhi.hide();
                    TABLE_No.hide();
                    TABLE_zhongdian.show();

                    TABLE_RIGHT_TR.hide()
                    TABLE_RIGHT.find(".label_zhongdian").show()//右侧所有的楼层

                    TABLE_TD.parent().hide();
                    TABLE_TD.find(".label_zhongdian").parent().parent().show();//左侧所有的房屋

                    LayerTable.api.BuildingScroll()//楼栋默认底部滚动条

                })
                //点击特殊人显示所有特殊人房间
                label_teshu.on("click",function(){
                    TABLE_zhongdian.hide();
                    TABLE_qunzu.hide();
                    TABLE_zizhu.hide();
                    TABLE_chuzhu.hide();
                    TABLE_kongzhi.hide();
                    TABLE_No.hide();
                    TABLE_teshu.show();

                    TABLE_RIGHT_TR.hide()
                    TABLE_RIGHT.find(".label_teshu").show()//右侧所有的楼层

                    TABLE_TD.parent().hide();
                    TABLE_TD.find(".label_teshu").parent().parent().show();//左侧所有的房屋

                    LayerTable.api.BuildingScroll()//楼栋默认底部滚动条

                })
                //点击群租显示所有群租房间
                label_qunzu.on("click",function(){
                    TABLE_zhongdian.hide();
                    TABLE_teshu.hide();
                    TABLE_zizhu.hide();
                    TABLE_chuzhu.hide();
                    TABLE_kongzhi.hide();
                    TABLE_No.hide();
                    TABLE_qunzu.show();

                    TABLE_RIGHT_TR.hide()
                    TABLE_RIGHT.find(".label_qunzu").show()//右侧所有的楼层

                    TABLE_TD.parent().hide();
                    TABLE_TD.find(".label_qunzu").parent().parent().show();//左侧所有的房屋

                    LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                })

                //点击自住显示所有自住房间
                label_zizhu.on("click",function(){
                    TABLE_zhongdian.hide();
                    TABLE_teshu.hide();
                    TABLE_chuzhu.hide();
                    TABLE_kongzhi.hide();
                    TABLE_qunzu.hide();
                    TABLE_No.hide();
                    TABLE_zizhu.show();

                    TABLE_RIGHT_TR.hide()
                    TABLE_RIGHT.find(".label_zizhu").show()//右侧所有的楼层

                    TABLE_TD.parent().hide();
                    TABLE_TD.find(".label_zizhu").parent().parent().show();//左侧所有的房屋

                    LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                })
                //点击出租显示所有出租房间
                label_chuzhu.on("click",function(){
                    TABLE_zhongdian.hide();
                    TABLE_teshu.hide();
                    TABLE_kongzhi.hide();
                    TABLE_qunzu.hide();
                    TABLE_zizhu.hide();
                    TABLE_No.hide();
                    TABLE_chuzhu.show();

                    TABLE_RIGHT_TR.hide()
                    TABLE_RIGHT.find(".label_chuzhu").show()//右侧所有的楼层

                    TABLE_TD.parent().hide();
                    TABLE_TD.find(".label_chuzhu").parent().parent().show();//左侧所有的房屋

                    LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                })
                //点击空置显示所有空置房间
                label_kongzhi.on("click",function(){
                    TABLE_zhongdian.hide();
                    TABLE_teshu.hide();
                    TABLE_qunzu.hide();
                    TABLE_zizhu.hide();
                    TABLE_chuzhu.hide();
                    TABLE_No.hide();
                    TABLE_kongzhi.show();

                    TABLE_RIGHT_TR.hide()
                    TABLE_RIGHT.find(".label_kongzhi").show()//右侧所有的楼层

                    TABLE_TD.parent().hide();
                    TABLE_TD.find(".label_kongzhi").parent().parent().show();//左侧所有的房屋

                    LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                })

                //点击未登记显示所有的未登记房间
                label_No.on("click",function(){
                    TABLE_zhongdian.hide();
                    TABLE_teshu.hide();
                    TABLE_qunzu.hide();
                    TABLE_zizhu.hide();
                    TABLE_chuzhu.hide();
                    TABLE_kongzhi.hide();
                    TABLE_No.show();


                    TABLE_RIGHT_TR.hide()
                    TABLE_RIGHT.find(".label_No").show()//右侧所有的楼层

                    TABLE_TD.parent().hide();
                    TABLE_TD.find(".label_No").parent().parent().show();//左侧所有的房屋

                    LayerTable.api.BuildingScroll()//楼栋默认底部滚动条
                })
                

            },
            //点击楼栋进房屋
            BuildingHouse: function (layerData) {
                $(".louceng_layer").unbind("click").on("click", ".gallery-top .louceng_layer_tottom_table tbody tr td b", function () {
                    var roomCode = $(this).attr("roomCode");
                    var peopleData = {
                        'roomCode': roomCode,
                        'loudongClick':'ok'
                    }
                    LayerTable.api.onehouseOnefiles(layerData, peopleData)
                })
            },
            //一屋一档里点击一人一档
            HouseOnepeopleOnefiles: function (layerData) {
                $(".yiwuyidang_bottom_div").unbind("click").on("click", '.yiwuyidang_bottom_div_Onepeople', function () {
                    var loudongClickok = $(this).attr('loudongclickok');
                    
                    var household_code = $(this).attr('household_code');
                    var household_id = $(this).attr('household_id');
                    var phone = $(this).attr('phone');
                    var household_name = $(this).attr('household_name');
                    var room_code = $(this).attr('room_code');
                    var peopleData = {
                        'household_code': household_code,//一人一档必要的参数
                        'household_id': household_id,//一人一档必要的参数
                        'phone': phone,//一车一档必要的参数
                        'household_name': household_name,//一车一档必要的参数
                        'room_code': room_code,//一屋一档必要的参数
                        'loudongClick':loudongClickok//判断是否在楼栋点击进一屋一档
                    }

                    LayerTable.api.onepeopleOnefiles(layerData, peopleData);//一人一档

                })
            },
            
            //map 门禁详情
            MapdoorInfo: function (layerData, data) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'doorSmoke', //皮肤
                    area: ['15rem', '12.6rem'],
                    zIndex:2000000, //层优先级
                    content: $('#mapdoorinfo'),
                    success: function () {
                        //初始化门禁
                        $(".mapdoorinfo_title").html('');
                        $(".gallery-thumbs .swiper-wrapper").html('');
                        $(".mapdoorinfo_div").html('');
                        
                        Frontend.api.Ajax('/Webapi/devlceListInfo', data, function (msg) {
                            var Data = msg.data.doorListInfo;
                            var doorNum = msg.doorNum;
                            if (Data == "") {
                                return false;
                            } else {
                                var strNum = '';
                                var str = '';

                                strNum += `<div class="swiper-wrapper">`;
                                $.each(Data, function (idx, val) {
                                    if (val != '') {
                                        strNum += `<div class="swiper-slide">${idx}</div>`
                                    }
                                    $(".mapdoorinfo_title").html(`${doorNum}个门禁机`);
                                })
                                strNum += `<div>`;

                                $('.mapdoorinfo .gallery-thumbs').html(strNum);

                                str += `<div class="swiper-wrapper">`;
                                $.each(Data, function (idx, val) {
                                    $.each(val, function (index, value) {
                                        str += `<div class="swiper-slide">
                                                <div class="mapdoorinfo_div">
                                                    <img src="../../img/menjinicon.png">
                                                    <ul>
                                                        <li><b>门禁名称：</b><span>${value.door_name}</span></li>
                                                        <li><b>设备编码：</b><span>${value.door_device_id}</span></li>
                                                        <li><b>设备类型：</b><span>门禁</span></li>
                                                        <li><b>安装位置：</b><span>${value.door_address}</span></li>
                                                        <li><b>经&nbsp;纬&nbsp;度：</b><span>${value.latitude}&nbsp;&nbsp;${value.longitude}</span></li>
                                                        <li><b>设备型号：</b><span>${value.door_device_id}</span></li>
                                                        <li><b>安装日期：</b><span>${value.entry_time}</span></li>
                                                        <li><b>启动日期：</b><span>${value.apply_time}</span></li>
                                                        <li><b>运行状态：</b><span>${value.online}</span></li>
                                                    </ul>
                                            </div>
                                        </div>`;
                                    })
                                })
                                str +=`</div>`
                                $('.mapdoorinfo .gallery-top').html(str);
                                
                                $('.mapdoorinfo').append(`<div class="swiper-button-next swiper-button-white" style="margin-top:-4.3rem"></div>
                                <div class="swiper-button-prev swiper-button-white" style="margin-top:-4.3rem"></div>`)
                                //楼层滚动
                                var galleryThumbs = new Swiper('.mapdoorinfo .gallery-thumbs', {
                                    slidesPerView: 4,//显示的数量
                                    watchSlidesVisibility: true,
                                    watchSlidesProgress: true,//防止不可点击
                                });
                                var galleryTop = new Swiper('.mapdoorinfo .gallery-top', {
                                    navigation: {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    },
                                    simulateTouch: false,//禁止鼠标拖动
                                    thumbs: {
                                        swiper: galleryThumbs
                                    }
                                });
                            }

                        })
                    },end: function () {
                        $(".swiper-button-next").remove();
                        $(".swiper-button-prev").remove();
                        $('.mapdoorinfo .gallery-top').html("");
                        $('.mapdoorinfo .gallery-thumbs').html("");
                    }
                })
            },
            //map  初始化人员通行记录  视频  抓拍
            ClickTodayPeople: function (layerData) {
                var isclick = true;//防止点击过快
                $(".person-list").on("click", "li .vator,li .name", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var householdCode = $(this).attr("householdCode");
                        var householdId = $(this).attr("householdId");
                        if ((householdId == 'null' && householdCode == 'null') || (householdCode == 'undefined' && householdId == 'undefined') || (householdCode == '' && householdId == '') || (householdCode != '' && householdId == 'undefined')) {
                            return false;
                        } else {
                            var peopleData = {
                                "household_code": householdCode,
                                "household_id": householdId,
                            }
                            LayerTable.api.onepeopleOnefiles(layerData, peopleData)
                        }
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".person-list").on("click", "li .detailInfo p .video", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var video = $(this).attr("video");
                        var name = $(this).attr("name");
                        var time = $(this).attr("time");
                        var address = $(this).attr("address");
                        var open_type = $(this).attr("open_type");
                        var people_table = {
                            "video_url_name": video,
                            "door_name": name,
                            "apply_time": time,
                            "address": address,
                            'open_type':open_type
                        }
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'onePeoplePushclassNew', //皮肤
                            area: ['17.9rem', '17.7rem'],
                            zIndex:2000000, //层优先级
                            content: $('#onePeoplePush_photo'),
                            success: function () {

                                var str = `<div class="onePeoplePush_photo_title">门禁抓拍视频</div>
                            <div class="onePeoplePush_photo_top">
                                <h1><b>姓&emsp;&emsp;名：${people_table.door_name}</b><span>时&emsp;&emsp;间：${people_table.apply_time}</span></h1>
                                <p><b>地&emsp;&emsp;址：${people_table.address}</b><span>开门方式：${people_table.open_type}</span></p>
                            </div>
                            <div class="onePeoplePush_photo_bottom"><video id="videoEle" autoplay="autoplay" src="${people_table.video_url_name}" controls="controls">您的浏览器不支持 video 标签。</video></div>`;
                                $(".onePeoplePush_photo").html(str);
                            },
                            end: function () {
                                document.getElementById('videoEle').pause();
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
                $(".person-list").on("click", "li .detailInfo p .picImg", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var img = $(this).attr("img");
                        var name = $(this).attr("name");
                        var time = $(this).attr("time");
                        var address = $(this).attr("address");
                        var people_table = {
                            "images_url_name": img,
                            "door_name": name,
                            "apply_time": time,
                            "address": address,
                        }
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'onePeoplePushclassNew', //皮肤
                            area: ['17.9rem', '17.7rem'],
                            zIndex:2000000, //层优先级
                            content: $('#onePeoplePush_photo'),
                            success: function () {
                                var str = `<div class="onePeoplePush_photo_title">抓拍照片</div>
                            <div class="onePeoplePush_photo_top">
                                <h1><b>姓&emsp;&emsp;名：${people_table.door_name}</b><span>时&emsp;&emsp;间：${people_table.apply_time}</span></h1>
                                <p><b>地&emsp;&emsp;址：${address}</b><span>开门方式：${people_table.open_type}</span></p>
                            </div>
                            <div class="onePeoplePush_photo_bottom"><img src="${people_table.images_url_name}" alt=""></div>`;
                                $(".onePeoplePush_photo").html(str);
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },
            //map 人员通行记录 弹层
            peopleThrough_layer: function (layerData) {
                var isclick = true;//防止点击过快
                $("#mapTitlePeopleImg").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            zIndex:2000000, //层优先级
                            area: ['36rem', '16.8rem'],
                            content: $('#peopleThrough_layer'),
                            success: function () {
                                //初始化日期/搜索
                                $("#peopleThrough_table_start").val("");
                                $("#peopleThrough_table_end").val("");
                                $("#peopleThrough_layer_right_input").val("");

                                var peopleThrough_table_start;
                                var peopleThrough_table_end;
                                var keyword;

                                //点击搜索
                                $("#peopleThrough_layer_btn").unbind("click").on("click", function () {
                                    peopleThrough_table_start = $("#peopleThrough_table_start").val();
                                    peopleThrough_table_end = $("#peopleThrough_table_end").val();
                                    keyword = $("#peopleThrough_layer_right_input").val();

                                    var date_start = new Date(peopleThrough_table_start);
                                    var date_end = new Date(peopleThrough_table_end);
                                    var peopleThrough_table_start_time = date_start.getTime();
                                    var peopleThrough_table_end_time = date_end.getTime();
                                    if (peopleThrough_table_start_time > peopleThrough_table_end_time) {
                                        return layerData.layer.msg('输入日期错误');
                                    } else {
                                        peopleThroughRecords();//人员告警列表
                                    }

                                })
                                peopleThroughRecords();//人员告警列表
                                function peopleThroughRecords() {
                                    var dataNew = {
                                        'page':1,
                                        'pageSize': '15',//每页显示的数量
                                        'startTime': peopleThrough_table_start,//开始时间
                                        'endTime': peopleThrough_table_end,//结束时间
                                        "keyword": keyword,//	名字搜索
                                    }
                                    var params = Frontend.api.getPostParams(dataNew);

                                    $.ajax({
                                        dataType: 'json',
                                        url: window.publicUrl+'/Webapi/openDoorDetail',
                                        type: 'POST',
                                        data: params,
                                        success: function (res) {
                                            if (res.hasOwnProperty('code') && res.code == 200) {
                                                //绘制表格
                                                layerData.table.render({
                                                    elem: "#peopleThrough_table",
                                                    data: res.data,
                                                    cols: [
                                                        [ //表头
                                                            { field: '',  width: '1%', title: '' },
                                                            { field: 'apply_time', width: '14%', title: '开门时间' },
                                                            { field: 'open_type', width: '7%', title: '开门方式' },
                                                            { field: 'household_type', width: '7%', title: '住户类型' },
                                                            { field: 'operator_name', width: '8%', title: '访客/被访者', event: 'operator_name', style: 'color: #00ffff !important;cursor:pointer' },
                                                            { field: 'address_town', width: '8%', title: '街道' },
                                                            { field: 'address_village', width: '10%', title: '社区' },
                                                            { field: 'community_name', width: '7%', title: '小区' },
                                                            { field: 'door_name', width: '8%', title: '抓拍位置' },
                                                            { field: '', width: '14%', title: '操作', toolbar: '#peopleThrough_table_Demo' },
                                                            // { field: '', width: '22%', title: '操作', toolbar: '#peopleThrough_table_Demo' },
                                                        ]
                                                    ],
                                                    limit:15,
                                                    done:function(res){
                                                        LayerTable.api.layuiTitle()//layui表格title提示
                                                        addScrollEvent()//添加下拉滚动
                                                    }
                                                });
                                            }
                                        }
                                    })
                                
                                    function addScrollEvent(){
                                        // console.log(params)
                                        $(".peopleThrough_layer_table .layui-table-main").unbind('scroll').on('scroll', function () {
                                            var h = $(this).height();//div可视区域的高度
                                            var sh = $(this)[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
                                            var st = $(this)[0].scrollTop;//滚动条的当前位置到div顶部的距离
                                            //上面的代码是判断滚动条滑到底部的代码
                                            // console.log(layerData.table.cache)
                                            // console.log(layerData.table.cache['peopleThrough_table'])
                                            // console.log(h + st)
                                            // console.log(sh)
                                            if (h + st >= sh && layerData.table.cache['peopleThrough_table'].length > 0) {
                                                var pageNumber = $("#pageNumber_people").val();
                                                pageNumber++;
                                                // //防止来回滚动
                                                $(this).unbind('scroll');
                                                
                                                scrollTop = sh - h;
                                                //请求多页数据
                                                params.page = pageNumber;
                                                // params.pageSize = pageNumber * 15;
                                                $.post({
                                                    url: window.publicUrl+'/Webapi/openDoorDetail',
                                                    data: params,
                                                    success: function (data) {
                                                        var resobj = JSON.parse(data);
                                                        // console.log("哈哈哈哈哈")
                                                        if (resobj.data.length > 0) {
                                                            //合并多页数据
                                                            var oldData = layerData.table.cache['peopleThrough_table'];
                                                            var newdata = resobj.data;
                                                            $.each(newdata, function (index, item) {
                                                                oldData.push(item)
                                                                $("#pageNumber_people").val(pageNumber);
                                                            });
                                                            
                                                            // console.log(oldData)
                                                            // console.log(newdata)
                                                            // console.log(oldData.length)
                                                            // params.pageSize = oldData.length;
                                                            layerData.table.reload('peopleThrough_table', {
                                                                data: oldData,
                                                                limit: oldData.length,
                                                                // where: params,
                                                                done: function () {
                                                                    $(".peopleThrough_layer_table .layui-table-main").scrollTop(scrollTop);
                                                                    LayerTable.api.layuiTitle()//layui表格title提示
                                                                }
                                                            });
                                                            addScrollEvent()//添加下拉滚动
                                                        }
                                                    },
                                                })
                                                
                                            }else if(st == 0 && layerData.table.cache['peopleThrough_table'].length > 0){
                                                scrollTop = sh - h;
                                                params.page = '1'
                                                $.post({
                                                    url: window.publicUrl+'/Webapi/openDoorDetail',
                                                    data: params,
                                                    success: function (res) {
                                                        var res = JSON.parse(res);
                                                        if (res.data.length > 0) {
                                                            //绘制表格
                                                            var newdata = res.data;
                                                            layerData.table.reload('peopleThrough_table', {
                                                                data: newdata,
                                                                limit: 15,
                                                                done: function () {
                                                                    LayerTable.api.layuiTitle()//layui表格title提示
                                                                }
                                                            });
                                                            $("#pageNumber_people").val(1);
                                                            addScrollEvent()//添加下拉滚动
                                                        }
                                                        
                                                    }
                                                })
            
                                            }
                                        })
                                    }

                                    // 日期时间选择器
                                    layerData.laydate.render({
                                        elem: '#peopleThrough_table_start',
                                        type: 'datetime',
                                        max: LayerTable.api.getNowFormatDate()
                                    });
                                    layerData.laydate.render({
                                        elem: '#peopleThrough_table_end',
                                        type: 'datetime',
                                        max: LayerTable.api.getNowFormatDate()
                                    });
                                    //监听工具条
                                    layerData.table.on('tool(peopleThrough_table)', function (obj) {
                                        var people_table = obj.data;
                                        let empty = null;
                                        for (const key in people_table) {//处理字符串null
                                            // console.log(key)
                                            if (people_table.hasOwnProperty(key)) {
                                                if (people_table[key] === null) {
                                                    people_table[key] = "";
                                                    empty = true;
                                                } else {
                                                    empty = false;
                                                }
                                            }
                                        }
                                        if (obj.event === 'push_photo') {//开门抓拍
                                            LayerTable.api.OnePeopleOnefilePhoto(layerData, people_table);
                                        } else if (obj.event === 'video') {//实时视频
                                            LayerTable.api.OnePeopleOnefileVideo(layerData, people_table);
                                        } else if (obj.event === 'trailing_photo') {//尾随抓拍  没有先不做
                                            return false;
                                        } else if (obj.event === 'operator_name') {
                                            if ((people_table.household_id == 'null' && people_table.household_code == 'null') || (people_table.household_code == 'undefined' && people_table.household_id == 'undefined') || (people_table.household_code == '' && people_table.household_id == '')) {
                                                return false;
                                            } else {
                                                var peopleData = {
                                                    "household_code": people_table.household_code,
                                                    "household_id": people_table.household_id,
                                                }
                                                LayerTable.api.onepeopleOnefiles(layerData, peopleData)// 一人一档
                                            }
                                        }
                                    })
                                }
                            },end:function (){
                                $("#pageNumber_people").val(1);
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })

            },
            
            //map  初始化车辆通行记录   车牌号/头像  到一车一档
            ClickTodayCar: function (layerData) {
                var isclick = true;//防止点击过快
                $(".car-list").on("click", "li .vator,li .name", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        var car_no = $(this).attr("car_no");
                        if (car_no != 'null' && car_no != 'undefined' && car_no != '') {
                            var peopleData = {
                                "carNo": car_no,
                            }
                            LayerTable.api.onecarOnefiles(layerData, peopleData)
                        }
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },

            //map 车辆通行记录 弹层
            carThrough_layer: function (layerData) {
                var isclick = true;//防止点击过快
                $("#mapTitleCarImg").on("click", function () {
                    if (isclick) {
                        isclick = false;
                        //下面添加需要执行的事件
                        layerData.layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            shade: 0.8,
                            skin: 'peopleNumclass', //皮肤
                            zIndex:2000000, //层优先级
                            area: ['36rem', '16.8rem'],
                            content: $('#carThrough_layer'),
                            success: function () {
                                //初始化日期/搜索
                                $("#carThrough_table_start").val("");
                                $("#carThrough_table_end").val("");
                                $("#carThrough_layer_right_input").val("");

                                var carThrough_table_start;
                                var carThrough_table_end;
                                var keyword;
                                //点击搜索
                                $("#carThrough_layer_btn").unbind("click").on("click", function () {
                                    carThrough_table_start = $("#carThrough_table_start").val();
                                    carThrough_table_end = $("#carThrough_table_end").val();
                                    keyword = $("#carThrough_layer_right_input").val();

                                    var date_start = new Date(carThrough_table_start);
                                    var date_end = new Date(carThrough_table_end);
                                    var carThrough_table_start_time = date_start.getTime();
                                    var carThrough_table_end_time = date_end.getTime();
                                    if (carThrough_table_start_time > carThrough_table_end_time) {
                                        return layerData.layer.msg('输入日期错误');
                                    } else {
                                        carThroughRecords();//车辆告警列表
                                    }
                                })
                                carThroughRecords();//出行记录
                                function carThroughRecords() {
                                    let dataNew = {
                                        'page':1,
                                        'pageSize': '15',//每页显示的数量
                                        'startTime': carThrough_table_start,//开始时间
                                        'endTime': carThrough_table_end,//结束时间
                                        "keyword": keyword//	名字搜索
                                    }
                                    let params = Frontend.api.getPostParams(dataNew);

                                    $.ajax({
                                        dataType: 'json',
                                        url: window.publicUrl+'/Webapi/openCaraDetail',
                                        type:'POST',
                                        data: params,
                                        success:function(res){
                                            if(res.hasOwnProperty('code') && res.code == 200){
                                                //绘制表格
                                                layerData.table.render({
                                                    elem: "#carThrough_table",
                                                    data: res.data,
                                                    cols: [
                                                        [ //表头
                                                            { field: '', width: '1%', title: '' },
                                                            { field: 'timeinfo',  width: '13%', title: '出入时间' },
                                                            { field: 'carTypeinfo', width: '7%', title: '出入类型' },
                                                            { field: 'car_no', width: '8%', title: '车牌号', event: 'car_no', style: 'color: #00ffff !important;cursor:pointer' },
                                                            { field: 'owner', width: '8%', title: '车辆使用人' },
                                                            { field: 'address_town', width: '12%', title: '街道' },
                                                            { field: 'address_village', width: '12%', title: '社区' },
                                                            { field: 'community_name', width: '11%', title: '小区' },
                                                            { field: 'portal_name', width: '10%', title: '抓拍位置' },
                                                            { field: '', width: '8%', title: '操作', toolbar: '#carThrough_table_Demo' },
                                                        ]
                                                    ], 
                                                    limit:15,
                                                    done:function(res){
                                                        LayerTable.api.layuiTitle()//layui表格title提示
                                                        
                                                        addScrollEvent()//添加下拉滚动
                                                    }
                                                });
                                            }
                                        }
                                    })
                                    
                                    function addScrollEvent(){//车辆滚动下拉加载
                                        $(".carThrough_layer_table .layui-table-main").unbind('scroll').on('scroll', function () {
                                            var h = $(this).height();//div可视区域的高度
                                            var sh = $(this)[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
                                            var st = $(this)[0].scrollTop;//滚动条的当前位置到div顶部的距离
                                            //上面的代码是判断滚动条滑到底部的代码
                                            // console.log(layerData.table.cache)
                                            // console.log(layerData.table.cache['carThrough_table'])
                                            if (h + st >= sh && layerData.table.cache['carThrough_table'].length > 0) {
                                                var pageNumber = $("#pageNumber_car").val();
                                                pageNumber++;
                                                //防止来回滚动
                                                $(this).unbind('scroll');
                                              
                                                scrollTop = sh - h;
                                                //请求多页数据
                                                params.page = pageNumber;
                                                
                                                $.post({
                                                    url: window.publicUrl+'/Webapi/openCaraDetail',
                                                    data: params,
                                                    success: function (res) {
                                                        var res = JSON.parse(res);
                                                        if (res.data.length > 0) {
                                                            //合并多页数据
                                                            var oldData = layerData.table.cache['carThrough_table'];
                                                            var newdata = res.data;
                                                            $.each(newdata, function (index, item) {
                                                                oldData.push(item)
                                                                $("#pageNumber_car").val(pageNumber);
                                                            });
            
                                                            layerData.table.reload('carThrough_table', {
                                                                data: oldData,
                                                                limit: oldData.length,
                                                                done: function () {
                                                                    $(".carThrough_layer_table .layui-table-main").scrollTop(scrollTop);
                                                                    LayerTable.api.layuiTitle()//layui表格title提示
                                                                }
                                                            });
                                                            addScrollEvent()//添加下拉滚动
                                                        }
                                                       
                                                    },
                                                })
                                            }else if(st == 0 && layerData.table.cache['carThrough_table'].length > 0){
                                                scrollTop = sh - h;
                                                params.page = '1'
                                                $.post({
                                                    url: window.publicUrl+'/Webapi/openCaraDetail',
                                                    data: params,
                                                    success: function (res) {
                                                        var res = JSON.parse(res);
                                                        if (res.data.length > 0) {
                                                        //绘制表格
                                                            var newdata = res.data;

                                                            layerData.table.reload('carThrough_table', {
                                                                data: newdata,
                                                                limit: 15,
                                                                done: function () {
                                                                    LayerTable.api.layuiTitle()//layui表格title提示
                                                                }
                                                            });
                                                            $("#pageNumber_car").val(1);
                                                            addScrollEvent()//添加下拉滚动
                                                        }          
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    // 日期时间选择器
                                    layerData.laydate.render({
                                        elem: '#carThrough_table_start',
                                        type: 'datetime',
                                        max: LayerTable.api.getNowFormatDate()
                                    });
                                    layerData.laydate.render({
                                        elem: '#carThrough_table_end',
                                        type: 'datetime',
                                        max: LayerTable.api.getNowFormatDate()
                                    });
                                    //监听工具条
                                    layerData.table.on('tool(carThrough_table)', function (obj) {
                                        var people_table = obj.data;
                                        let empty = null;
                                        for (const key in people_table) {//处理字符串null
                                            // console.log(key)
                                            if (people_table.hasOwnProperty(key)) {
                                                if (people_table[key] === null) {
                                                    people_table[key] = "";
                                                    empty = true;
                                                } else {
                                                    empty = false;
                                                }
                                            }
                                        }
                                        // console.log(car_table)
                                        if (obj.event === 'push_photo') {//开门抓拍
                                            layerData.layer.open({
                                                type: 1,
                                                title: false,
                                                closeBtn: 1,
                                                shadeClose: true,
                                                shade: 0.8,
                                                skin: 'onePeoplePushclass', //皮肤
                                                zIndex:2000000, //层优先级
                                                area: ['25rem', '18rem'],
                                                content: $('#oneCarPush_photo'),
                                                success: function () {
                                                    var address = people_table.address_town + people_table.address_village + people_table.community_name + people_table.portal_name;
                                                    var str = `<div class="oneCarPush_photo_title">车辆抓拍照片</div>
                                                <div class="oneCarPush_photo_top">
                                                    <h1>车牌号：${people_table.car_no}</h1>
                                                    <p><b>时&emsp;间：${people_table.timeinfo}</b><span><img src="../../img/weizhi.png">${address}</span></p>
                                                </div>
                                                <div class="oneCarPush_photo_bottom"><img src="${people_table.car_no_photo}" alt=""></div>`;
                                                    $(".oneCarPush_photo").html(str);
                                                }
                                            })
                                        } else if (obj.event === 'car_no') {//一车一档
                                            if (people_table.car_no != 'null' && people_table.car_no != 'undefined' && people_table.car_no != '') {
                                                var peopleData = {
                                                    "carNo": people_table.car_no,
                                                }
                                                LayerTable.api.onecarOnefiles(layerData, peopleData)
                                            }
                                        }
                                    })
                                }
                            },
                            end: function () {
                                $("#pageNumber_car").val(1);
                            }
                        })
                        //定时器
                        setTimeout(function () {
                            isclick = true;
                        }, 800);
                    }
                })
            },
            //map 告警详情
            warnInfo: function (layerData) {
                $(".houseVacancy").unbind("click").on("click", function () {
                    var warnId = $(this).find('.houseVacancyDiv ul').attr("warnId");
                    //1人员告警；2房屋告警；3设备告警
                    var people_table = {
                        'warnId': warnId,
                    }
                    Frontend.api.Ajax('/Map/warnOnlyInfo', people_table, function (msg) {
                        let empty = null;
                        let data = msg.data;
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
                        if (data.type == "3" || data.type == "12") {//重点人员：出入即时报警 或者 视频重点人员告警
                            let people_table = {
                                'household_id': data.household_id,
                                'is_act': data.is_act,
                                'reason': data.reason,
                                'addtime': data.addtime,
                                'act_finish_username': data.act_finish_username,
                                'open_useraddress': data.open_useraddress,
                                'reason_feedback': data.reason_feedback,
                                'image_url': data.image_url,
                                'groupPicUrl':data.groupPicUrl,
                                'warn_type':data.warn_type,
                                'video_action':data.video_action,
                            }
                            LayerTable.api.comeIntime(layerData, people_table)
                        } else if (data.type == "7") {//sos告警
                            let people_table = {
                                'household_id': data.household_id,
                                'is_act': data.is_act,
                                'reason': data.reason,
                                'addtime': data.addtime,
                                'act_time': data.act_time,
                                'act_finish_username': data.act_finish_username,
                                'open_useraddress': data.open_useraddress,
                                'reason_feedback': data.reason_feedback,
                                'image_url': data.image_url,
                            }
                            LayerTable.api.soswarn(layerData, people_table)
                        } else if (data.type == "6") {//门长开告警
                            let device_table = {
                                'door_id': data.door_id,
                                'warn_type': data.type,
                                'is_act': data.is_act,
                                'addtime': data.addtime,
                                'act_time': data.act_time,
                                'act_finish_username': data.act_finish_username,
                                'open_useraddress': data.open_useraddress,
                                'reason_feedback': data.reason_feedback,
                                'reason': data.reason,
                            }
                            LayerTable.api.deviceSmoke(layerData, device_table)
                        } else if (data.type == "8") {//烟感告警
                            let device_table = {
                                'door_id': data.door_id,
                                'warn_type': data.type,
                                'is_act': data.is_act,
                                'addtime': data.addtime,
                                'act_time': data.act_time,
                                'act_finish_username': data.act_finish_username,
                                'open_useraddress': data.open_useraddress,
                                'reason_feedback': data.reason_feedback,
                                'reason': data.reason,
                            }
                            LayerTable.api.deviceSmoke(layerData, device_table)
                        } else if (data.type == "11" || data.type == "13") {//黑名单 或 监控黑名单
                            let people_table = {
                                'household_id': data.household_id,
                                'level': data.level,
                                'is_act': data.is_act,
                                'open_username': data.open_username,
                                'groupPicUrl': data.groupPicUrl,
                                'image_url': data.image_url,
                                'reason': data.reason,
                                'addtime': data.addtime,
                                'reason_feedback': data.reason_feedback,
                                'room_code': data.room_code,
                                'open_useraddress': data.open_useraddress,
                                'act_finish_username': data.act_finish_username,
                                'act_time': data.act_time,
                                'likedegree': data.likedegree,
                                'warn_type': data.warn_type,
                                'video_action':data.video_action,
                            }
                            LayerTable.api.blackwarn(layerData, people_table)
                        }

                    })

                })
            },
            // map 门禁烟感详情
            mapDoorSmoke: function (layerData, device_table) {
                layerData.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    shade: 0.8,
                    skin: 'doorSmoke', //皮肤
                    area: ['15rem', '11rem'],
                    zIndex:2000000, //层优先级
                    content: $('#doorsmokeinfo'),
                    success: function () {
                        var types, device_photo;
                        if (device_table.warn_type == "6") {
                            types = "1";
                            device_photo = "../../img/menjinicon.png";
                        } else if (device_table.warn_type == "8") {
                            types = "2";
                            device_photo = "../../img/yangan.png";
                        }
                        var people_table = {//1门禁2烟感
                            'doorId': device_table.door_id,
                            'types': types
                        }
                        Frontend.api.Ajax('/Webapi/deviceOnlyInfo', people_table, function (msg) {
                            let empty = null;
                            let data = msg.data.deviceInfo;
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
                            var online;
                            online = data.online == "1" ? "在线" : "不在线";
                            var str = `<div class="doorsmokeinfo_title">${data.floor_name}</div>
                                    <div class="doorsmokeinfo_div">
                                        <img src="${device_photo}">
                                        <ul>
                                            <li><b>设备编码：</b><span>${data.device_code}</span></li>
                                            <li><b>设备类型：</b><span>${data.device_info}</span></li>
                                            <li><b>安装位置：</b><span>${data.device_address}</span></li>
                                            <li><b>经&nbsp;纬&nbsp;度：</b><span>${data.latitude}&nbsp;&nbsp;${data.longitude}</span></li>
                                            <li><b>设备型号：</b><span></span></li>
                                            <li><b>安装日期：</b><span>${data.entry_time}</span></li>
                                            <li><b>启动日期：</b><span></span></li>
                                            <li><b>运行状态：</b><span>${online}</span></li>
                                        </ul>
                                    </div>
                                </div>`;
                            $(".doorsmokeinfo").html(str)
                        })
                    }
                })
            },

            //添加layui表格title提示
            layuiTitle:function () {
                // $('th').each(function(index,element){
                //     $(element).attr('title',$(element).text());
                // });
                $('td').each(function(index,element){
                    $(element).attr('title',$(element).text());
                });
                $(".layui-table-col-special").each(function(index,element){
                    $(element).attr('title','');
                });

            },

            //layui日历控件设置选择日期不能超过当前日期
            getNowFormatDate:function () {
                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month
                        + seperator1 + strDate + " " + date.getHours() + seperator2
                        + date.getMinutes() + seperator2 + date.getSeconds();
                return currentdate;
            },

            //esc关闭弹层
            keyUP:function(layerData){
    
                $('body',document).on('keyup', function (e) {
                    if (e.which === 27) {
                        var zINDEX = $(".layui-layer-shade:last").attr("id");
                        zINDEX = zINDEX.replace("layui-layer-shade","");
                        layerData.layer.close(zINDEX); 
                    }
                });
                
            }
        },
        init: function () {
            layui.extend({
                // tableFilter: '{/}/js/frontend/tableFilter' // {/}的意思即代表采用自有路径，即不跟随 base 路径
                tableFilter: './js/frontend/tableFilter' // {/}的意思即代表采用自有路径，即不跟随 base 路径
            })

            
            if(window.Config.admin != '424'){
                $(".imgbtn").hide()
            }else{
                $(".containerDIV header .swiper-slide_Img .header-left").css({
                    "background":'none'
                })
                
            }
            if(window.Config.admin == '507'){
                $(".containerDIV header .swiper-slide_Img .header-left").css({
                    "background":'none'
                })
                $(".title").html('智慧安防小区')
                $('title').text('智慧安防小区')
            }

    
            
            layui.use(['layer', 'table', 'laydate', 'form', 'tableFilter', 'upload'], function () {
                var OnepeopleOnepart = '';// 一人一档
                var OnehouseOnepart = '';//一屋一档
                var HouseWarn = '';//房屋告警
                var PeopleWarn_teshu = '';//特殊人群告警
                var SOSWarn = '';//sos告警
                var ComeInTime = '';//重点人员出入规律
                var layerYicheyidang = '';//一车一档

                var layer = layui.layer,//弹层
                    table = layui.table, //表格
                    laydate = layui.laydate,//日期
                    form = layui.form,//表单
                    tableFilter = layui.tableFilter,//过滤器
                    upload = layui.upload;//图片上传
                var layuiModule = { layer, table, laydate, form, tableFilter, upload, OnehouseOnepart, OnepeopleOnepart, HouseWarn, PeopleWarn_teshu, SOSWarn, ComeInTime, layerYicheyidang };

                LayerTable.api.todayStaff(layuiModule);//今日新增人员
                LayerTable.api.echartsSet(layuiModule); //echarts设置按钮（人口统计图标）
                LayerTable.api.peoplewarnInfo(layuiModule)//人员告警列表
                LayerTable.api.housewarnInfo(layuiModule)//房屋告警列表
                LayerTable.api.devicewarnInfo(layuiModule)//设备告警列表

                LayerTable.api.emphasisPeople(layuiModule)//首页 重点人口
                LayerTable.api.focusAreas(layuiModule)//首页 关注地区人口
                LayerTable.api.epidemic(layuiModule)//首页 疫情预警
                LayerTable.api.epidemicTable(layuiModule)//首页 疫情预警==>各项子类统计
                LayerTable.api.blackPeople(layuiModule)//首页 黑名单
                LayerTable.api.stranger(layuiModule)//首页 陌生人   
                LayerTable.api.device_door(layuiModule)//首页 设备 =》门禁
                LayerTable.api.device_monitor(layuiModule)//首页 设备 =》监控
                LayerTable.api.OneImg(layuiModule)//以图搜图

                LayerTable.api.politicsTool(layuiModule)//首页 政治面貌 监听工具条
                LayerTable.api.houseStatisticsTool(layuiModule)//首页 户籍统计 监听工具条
                LayerTable.api.nationTool(layuiModule)//首页 民族分布 监听工具条
                LayerTable.api.houseProportionTool(layuiModule)//首页 房屋占比 监听工具条
                LayerTable.api.specialTool(layuiModule)//首页 特殊人群 监听工具条
                LayerTable.api.takeTool(layuiModule)//首页 从业状况 监听工具条
                LayerTable.api.externalTool(layuiModule)//首页 外来人口籍贯 监听工具条

                LayerTable.api.houseList(layuiModule)//首页房屋列表
                LayerTable.api.peopleList(layuiModule)//首页人口列表

                LayerTable.api.ClickTodayPeople(layuiModule)//map 人员通行记录
                LayerTable.api.ClickTodayCar(layuiModule)//map 车辆通行记录
                // LayerTable.api.houseVacancy(layuiModule)//map 出租房空置告警 
                // LayerTable.api.Building(layuiModule)//map 楼栋
                LayerTable.api.BuildingHouse(layuiModule)//点击楼栋进房屋
                LayerTable.api.HouseOnepeopleOnefiles(layuiModule)//一屋一档进一人一档
                // LayerTable.api.MapdoorInfo(layuiModule)//map 门禁详情
                LayerTable.api.peopleThrough_layer(layuiModule)//map 人员通行记录 弹层
                LayerTable.api.carThrough_layer(layuiModule)//map 车辆行记录 弹层
                LayerTable.api.warnInfo(layuiModule)//map 告警详情 弹层

                LayerTable.api.keyUP(layuiModule)//esc退出 弹层

            })
        }
    };
    LayerTable.init();
    // return LayerTable;
// });
