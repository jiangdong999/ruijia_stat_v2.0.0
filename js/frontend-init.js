// define(['frontend'], function (Frontend) {
  var constValue = {
    SWIPER_PAGE_INDEX_ECHARTS : 0,  // Echarts页
    SWIPER_PAGE_INDEX_MAP: 1,       // map页
    REGION_LEVEL_DISTRICT: 0,       // 区
    REGION_LEVEL_STREET: 1,         // 街道
    REGION_LEVEL_COMMITTEE: 2,      // 居委会
    REGION_LEVEL_COMMUNITY: 3,      // 小区
    STATUS_COMMUNITY_LIST_NOT_REFRESH: 1,  //不刷新小区列表
    STATUS_COMMUNITY_LIST_REFRESH: 0, //刷新小区列表
    STATUS_LAYER_NOT_EXIST: 0,      // 弹层不存在
    STATUS_LAYER_EXIST: 1,          // 弹层存在
    WARNINGS_QUEUE_MAX_LENGTH: 50,  // 告警队列最大长度
    WARNINGS_QUEUE_REMOVE_LENGTH: 40,//告警队列需要移除数据长度

    TIME_TEN_SECONDS: 10,           // 告警展示时长
    WARNING_TYPE_POINT: 3,          // 重点人员告警：出入即时报警
    WARNING_TYPE_DEVICE: 6,         // 设备告警：门禁常开告警
    WARNING_TYPE_SOSWARN: 7,        // SOS告警
    WARNING_TYPE_SMOKE: 8,        // 烟感告警
    WARNING_TYPE_BLACKLIST: 11,     // 黑名单告警
    WARNING_TYPE_POINT_VIDEO: 12,     // 视频重点人员告警
    WARNING_TYPE_BLACKLIST_VIDEO: 13,     // 监控黑名单

    WEBSOCKET_DATA_TYPE_RECORD: 1,  // websocket数据类型-人员通行记录
    WEBSOCKET_DATA_TYPE_WARN: 2,    // websocket数据类型-告警记录
    WEBSOCKET_DATA_TYPE_CAR: 3,    // websocket数据类型-车辆记录
  };
  window.CONST = constValue;
  // return constValue;
// });