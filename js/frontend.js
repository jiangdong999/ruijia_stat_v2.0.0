// define([], function () {
    window.publicUrl = 'https://znaf2.corelines.cn';
    var Frontend = {
        api: {
            getPostParams: function (data) {
                //获取全局参数
                return $.extend({
                    userid: window.Config.login,
                    key: window.Config.key,
                    from: '1',
                    zone_code: sessionStorage.getItem('zone_code'),
                    community_id: sessionStorage.getItem('community_id'),
                    adminid: window.Config.admin

                    // userid:'375',
                    // key:'ad93f626-7c4a-4920-8ac4-0802ac41604a',
                    // from:'1',
                    // zone_code:'0',
                    // community_id:'0',
                    // level:'0',
                    // // adminid:'0'，
                    // adminid:'381'

                    // userid: "424",
                    // key: "479d7b0b-b5e6-4158-9e94-7487a59b5bdf",
                    // from: "1",
                    // zone_code: sessionStorage.getItem('zone_code'),
                    // community_id: sessionStorage.getItem('community_id'),
                    // adminid: "424",


                    
                }, data);
            },
            Ajax: function (url, data, callback) {
                //Ajax封装
                let config = Frontend.api.getPostParams(data);
                let p = new Promise((resolve, reject)=>{//rejected 已失败
                    //console.log(config)
                    $.ajax({
                        url: window.publicUrl+url,
                        type: config == null ? 'GET' : 'POST',
                        dataType: "json",
                        data: config == null ? '' : JSON.stringify(config),
                        async: true,
                        contentType: "application/json",
                        success: function (resp) {
                            if (resp.code == 200) {
                                let empty = null;
                                let data = resp.data;
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
                                callback(resp);
                                resolve(resp.message);
                            } else if (resp.code == 202) {
                                window.location.href = '/index/login';
                                return false;
                            } else if (resp.code == 208) {
                                layer.msg(resp.message);
                                setTimeout(function () {
                                    window.location.href = '/index/login';
                                }, 3000)
                                return false;
                            } else {
                                reject();
                                return false;
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status == "401") {
                                window.parent.location = '/enterprise/enterprise_login.html';
                                self.location = '/enterprise/enterprise_login.html';
                            } else {
                                alert(XMLHttpRequest.responseText);
                            }
                            reject();
                        },

                    });

                });

                p.then(response=>{
                    // console.log(response)
                }).catch(()=>{
                    console.log('返回数据失败，接口报错')
                })
                return p;

            },
        },
        login: function () {
            
            //手机验证码60秒
            $("#yanzheng").on("click", function () {
                
              var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
              if (!myreg.test($("#container_cont_phone").val())) {
                $("#container_cont_phone").val('')
                return false;
              } else {
                var mobile = $("#container_cont_phone").val();
                $.ajax({
                  url: window.publicUrl+"/index/mobileSend",
                  type:'get',
                  data:{
                    'mobile': mobile
                  },
                  success: function (su) {
                    if (su) {
                      //不让倒计时
                      layer.msg(su);
                      return false;
                    } else {
                      thisBtn = $(this);
                      sendemail()
                    }
                  }
                });
              }
            })
            var countdown = 60;
            function sendemail() {
              var obj = $("#yanzheng");
              settime(obj);
            }
      
            function settime(obj) { //发送验证码倒计时
              if (countdown == 0) {
                obj.attr('disabled', false);
                //obj.removeattr("disabled"); 
                obj.val("免费获取验证码");
                countdown = 60;
                return;
              } else {
                obj.attr('disabled', true);
                obj.val("重新发送(" + countdown + ")");
                countdown--;
              }
              setTimeout(function () {
                settime(obj)
              }, 1000)
            }

            sessionStorage.clear();
            var lastlogin = sessionStorage.getItem("lastlogin");
            if (lastlogin) {
              lastlogin = JSON.parse(lastlogin);
              $("#profile-name").val(lastlogin.username);
            }
        },
        init: function () {
            Frontend.login();

              var login = localStorage.getItem("login");
              var username = localStorage.getItem("username");
              var usercode = localStorage.getItem("usercode");
              var userlevel = localStorage.getItem("userlevel");
              var wsUri = localStorage.getItem("wsUri");
              var key = localStorage.getItem("key");
              var admin = localStorage.getItem("admin");
              var referer = localStorage.getItem("referer");


              var isRefreshCommunityList = localStorage.getItem("isRefreshCommunityList");

              var username = localStorage.getItem("name");
              var community_ids_cache = localStorage.getItem("community_id");
              var zone_code = localStorage.getItem("zone_code");




              sessionStorage.setItem("isRefreshCommunityList",isRefreshCommunityList);

              sessionStorage.setItem("name", username);
              sessionStorage.setItem("community_id", community_ids_cache);
              sessionStorage.setItem("zone_code",zone_code);

            
            window.Config = {
                'login': login,
                'username': username,
                'usercode': usercode,
                'userlevel': userlevel,
                'wsUri': wsUri,
                'key': key,
                'admin': admin,
                'referer': referer
            }
            // window.Config = {
            //   login: "424",
            //   username: "jiangdongcs",
            //   usercode: "000000000000",
            //   userlevel: 4,
            //   wsUri: "ws://ws.znaf2.corelines.cn:80/424/1588845063/6d11b3439c61c93a2db38b0b76437e6c/3/",
            //   key: "479d7b0b-b5e6-4158-9e94-7487a59b5bdf",
            //   admin: "424",
            //   referer: null
            // }

            

            
            var wW = document.body.clientWidth;// 浏览器所有内容宽度
            var wH = document.body.clientHeight;// 浏览器所有内容高度

            var x = 5760 / 100;
            document.documentElement.style.fontSize = document.documentElement.clientWidth / x + 'px';
            document.body.style.height = "auto"

            // if(window.Config.admin != '424'){
            //     if(wW < 1920){
            //         document.documentElement.style.fontSize = 100/3 + 'px';
            //         document.documentElement.style.width = 1920 + 'px';
            //         document.documentElement.style.height = 720 + 'px';
            //     }
            // }

            // if(wW < 1920){
            //     document.documentElement.style.fontSize = 100/3 + 'px';
            //     document.documentElement.style.width = 1920 + 'px';
            //     document.documentElement.style.height = 720 + 'px';
            // }

        }
    };

    //将Frontend渲染至全局,以便于在子框架中调用
    window.Frontend = Frontend;

    Frontend.init();
    // return Frontend;
// });
