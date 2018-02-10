/**
 * Created by junhui on 2017/3/27.
 */
(function () {
    'use strict';
    let querystring = require('querystring');//http请求所带的数据进行解析的node模块
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
        try {
            let getUrl = url+'/'+type.type;
            console.log('fetch...',param);
            if(type.method == 'POST'){
                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;application/x-www-form-urlencoded;multipart/form-data',
                };
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
                        //请求结果,执行回调函数
                        callback(json);
                    }).catch(function(ex) {
                        //请求出错
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
                };
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
                        //请求结果
                        if(json.code == 0 || errorCode.indexOf(json.code)>-1){
                            callback(json);
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
                };
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
                        //请求结果
                        if(json.code == 0 || errorCode.indexOf(json.code)>-1){
                            callback(json);
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