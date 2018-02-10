/**
 * Created by junhui on 2017/3/27.
 */
(function () {
    'use strict';
    let querystring = require('querystring');//http请求所带的数据进行解析的模块
    let store = require('store');//数据存储模块
    const errorCode = [403,404,500,505];//自己和后台协商定义服务器的返回值
    let errorToken = false;//错误提示
    function numToDX(n) {
        var minus;
        if(n<0){
            minus = true;
            n = -n;
        }else {
            minus = false;
        }
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "数据非法";
        var unit = "千百拾亿千百拾万千百拾元角分", str = minus?"负":"";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p+1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i=0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    }
    function toThousands(value) {
        //数字添加千分符
        if(value==0 || !value){
            return '';
        }
        value = String(Number(value).toFixed(2));
        let negative = value>0?'':'-';
        let parInt = Math.abs(parseInt(value));
        let parFloat = '';
        if(value.indexOf('.')>-1){
            parFloat = value.slice(value.indexOf('.')+1);
        }
        parInt = (parInt || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        return negative+parInt+'.'+parFloat;
    }
    function request(param,callback,type,e){

        /********param传入的参数，callback为回调函数，type为请求类型，e为其他项自己定义...*****/
        //GetLocalStorage自己封装的localStorage获取
        // let token = GetLocalStorage('token')||'';
        // let oaUserToken = GetLocalStorage('oaUserToken')||null;
        try {
            let getUrl = url+'/'+type.type;
            console.log('fetch...',param);
            if(type.method == 'POST'){
                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;application/x-www-form-urlencoded;multipart/form-data',
                    // 'access-token':token,
                };
                // if(oaUserToken){
                //     headers['oa-user-token'] = oaUserToken;
                // }
                try {
                    fetch(getUrl,{
                        method: type.method,
                        headers,
                        body: JSON.stringify(param)
                    })
                        .then(function(response) {
                            //请求状态
                            return response.json();
                        }).then(function(json) {
                        console.log('response json', json);
                        //请求结果
                        if(json.code == 0 || errorCode.indexOf(json.code)>-1 ){
                            callback(json);
                            if(errorToken){
                                //token错误标记
                                errorToken = false;
                            }
                            if(json.url&&json.url.length>0){
                                // urlAlert(json.url);
                                // 自定义处理
                            }
                        }else if(json.code == 505){
                            if(!errorToken){
                                // message.error("登陆已失效，需要重新登录！");
                                // hashHistory.push('/login');
                                // token登陆失效，自己设置转向登陆页面
                                errorToken = true;
                            }
                        }else if(json.code == 403){
                            // message403(json)
                            // 403错误处理
                        }else {
                            // message.error(json.message)其他错误
                        }
                    }).catch(function(ex) {
                        console.log('parsing failed', ex);
                    })
                }catch (e){
                    console.log(e);
                }
            }
            else if(type.method == 'GET'){
                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'access-token':token,
                };
                // if(oaUserToken){
                //     headers['oa-user-token'] = oaUserToken;
                // }

                try {
                    fetch(getUrl+'?'+querystring.stringify(param),{
                        method: type.method,
                        headers,
                    })
                        .then(function(response) {
                            // console.log(response);
                            //请求状态
                            return response.json();
                        }).then(function(json) {
                        console.log('response json', json);
                        // json.url?alert(json.url):'';
                        //请求结果
                        if(json.code == 0 || errorCode.indexOf(json.code)>-1){
                            callback(json);
                            if(errorToken){
                                errorToken = false;
                            }
                            if(json.url&&json.url.length>0){
                                // urlAlert(json.url);
                            }
                        }else if(json.code == 505){
                            if(!errorToken){
                                // message.error("登陆已失效，需要重新登录！");
                                // hashHistory.push('/login');
                                errorToken = true;
                            }
                        }else if(json.code == 403){
                            // message403(json)
                        }else {
                            // message.error(json.message)
                        }
                    }).catch(function(ex) {
                        console.log('parsing failed', ex);
                    })
                }catch (e){
                    console.log(e);
                }
            }
            else if(type.method == 'FormData'){
                let headers = {
                    'Accept': 'application/json',
                    "Content-Type": "application/x-www-form-urlencoded; multipart/form-data",
                    // 'access-token':token,
                };
                // if(oaUserToken){
                //     headers['oa-user-token'] = oaUserToken;
                // }

                try {
                    fetch(getUrl,{
                        method: type.Method,
                        headers,
                        body: querystring.stringify(param)
                    })
                        .then(function(response) {
                            // console.log(response);
                            //请求状态
                            return response.json();
                        }).then(function(json) {
                        console.log('response json', json);
                        // json.url?alert(json.url):'';
                        //请求结果
                        if(json.code == 0 || errorCode.indexOf(json.code)>-1){
                            callback(json);
                            if(errorToken){
                                errorToken = false;
                            }
                            if(json.url&&json.url.length>0){
                                // urlAlert(json.url);
                            }
                        }else if(json.code == 505){
                            if(!errorToken){
                                // message.error("登陆已失效，需要重新登录！");
                                // hashHistory.push('/login');
                                // errorToken = true;
                            }
                        }else if(json.code == 403){
                            // message403(json)
                        }else {
                            message.error(json.message)
                        }
                    }).catch(function(ex) {
                        console.log('parsing failed', ex);
                    })
                }catch (e){
                    console.log(e);
                }
            }
        }catch(e) {
            console.log("something error", e);
        }
    }
    module.exports = {request,toThousands,numToDX};
})();