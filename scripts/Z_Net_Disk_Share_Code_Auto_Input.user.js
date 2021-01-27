// ==UserScript==
// @name         Z_Net_Disk_Share_Code_Auto_Input
// @namespace    https://github.com/1635685665/TampermonkeyScripts
// @version      1.0.1
// @author       ZYL
// @description  自动填写网盘分享码
// @homepage     https://github.com/1635685665
// @updateURL    https://ghproxy.com/https://raw.githubusercontent.com/1635685665/TampermonkeyScripts/master/scripts/Z_Net_Disk_Share_Code_Auto_Input.user.js
// @downloadURL  https://ghproxy.com/https://raw.githubusercontent.com/1635685665/TampermonkeyScripts/master/scripts/Z_Net_Disk_Share_Code_Auto_Input.user.js
// @supportURL   https://github.com/1635685665/TampermonkeyScripts/issues
// @match        *://yun.baidu.com/s*
// @match        *://pan.baidu.com/s*
// @connect      cdn.bootcss.com
// @connect      search.pandown.cn
// @connect      ypsuperkey.meek.com.cn
// @connect      tools.bugscaner.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @note         1、自动填写网验证码还没做（没思路呢）
// @note         2、现在只支持百度网盘（主要是没有可以请求的接口 云盘万能钥匙的接口支持蓝奏云）
// @note         3、百度网盘界面更新id改变导致元素找不到还没解决 自动分析元素关键字并带click事件？ 主动升级？
// @note         4、感觉百度网盘跳转成功后停止循环结束执行现在的写法不好
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = 'Z_Net_Disk_Share_Code_Auto_Input';
    function log(msg) { console.log('🐵 ' + scriptName + ' : ' + msg); }
    window.addEventListener('load', function () {
        if (!unsafeWindow.jQuery) {
            log('不存在jQuery');
            var xhr = new XMLHttpRequest();
            xhr.open('get', 'https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js');
            xhr.send();
            xhr.onreadystatechange = function () {
                if (4 == xhr.readyState) {
                    if (200 == xhr.status) {
                        eval(xhr.responseText);
                        log('jQuery加载完成');
                        handleFunction(jQuery);
                    } else {
                        log('jQuery加载失败');
                    }
                }
            }
        } else {
            log('存在jQuery');
            handleFunction(unsafeWindow.jQuery);
        }
    });
    function handleFunction($) {
        var currentURL = location.href;
        if (-1 != currentURL.indexOf('pan.baidu.com') || -1 != currentURL.indexOf('yun.baidu.com')) {// 百度网盘 *://pan.baidu.com/s* *://pan.baidu.com/s*
            var surl = getURLParam(currentURL, 'surl');
            function inputCode(code) {
                if (code) {
                    $('.QKKaIE.LxgeIt').val(code);
                    $('.g-button.g-button-blue-large').click();
                }
            }
            var apis = [
                //云盘panddownload的接口
                {
                    method: 'get',
                    url: 'https://search.pandown.cn/api/query?surl=1' + surl,
                    onload: function (res) {
                        log(res)
                        var data = JSON.parse(res.responseText);
                        log(data);
                        if (!data.code) {
                            inputCode(data.data[0].password);
                        }
                    }
                }
                //云盘万能钥匙的接口
                ,
                {
                    method: 'post',
                    url: 'https://ypsuperkey.meek.com.cn/api/v1/items/BDY-' + surl + '?client_version=2019.2',
                    onload: function (res) {
                        log(res)
                        var data = JSON.parse(res.responseText);
                        log(data);
                        inputCode(data.access_code);
                    }
                }
                //在线工具-百度云盘万能钥匙的接口
                ,
                {
                    method: 'post',
                    url: 'http://tools.bugscaner.com/api/baiduyunpassword/',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: 'baiduyunurl=https://pan.baidu.com/s/1' + surl,
                    onload: function (res) {
                        log(res)
                        var data = JSON.parse(res.responseText);
                        log(data);
                        if (data.secess) {
                            inputCode(data.info.split(':')[1]);
                        }
                    }

                }
            ];
            //遍历请求
            for (var i = 0; i < apis.length; i++) {
                var api = apis[i];
                api.onerror = function (res) {
                    log(this.url + ' Request error > ' + res);
                    $('.verify-form > div[id]').text('Request error');
                }
                GM_xmlhttpRequest(api);
                //结束执行
                if ($('.g-button.g-button-blue-large')[0]) {
                    return;
                }
            }
            $('.verify-form > div[id]').text('没有查询到密码');
        } else if (-1 != currentURL.indexOf('other')) {//other

        }
    }
    function getURLParamsMap(url) {
        var params = {};
        var KVPairArray = url.substring(url.indexOf('?') + 1).split('&');
        for (const item of KVPairArray) {
            var index = item.indexOf('=');
            var key = '';
            var value = '';
            if (-1 != index) {
                key = item.substring(0, index);
                value = item.substring(index + 1);
            } else {
                key = item;
            }
            if (!params[key]) {
                params[key] = value;
            } else {
                if ('string' == typeof (params[key])) {
                    var array = [];
                    array.push(params[key]);
                    array.push(value);
                    params[key] = array;
                } else {
                    params[key].push(value);
                }
            }
        }
        return params;
    }
    function getURLParam(url, key) {
        var params = getURLParamsMap(url);
        return params[key];
    }
})();