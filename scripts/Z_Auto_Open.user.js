// ==UserScript==
// @name         Z_Auto_Open
// @namespace    https://github.com/1635685665/TampermonkeyScripts
// @version      1.0.1
// @author       ZYL
// @description  自动展开阅读全部
// @homepage     https://github.com/1635685665
// @updateURL    https://ghproxy.com/https://raw.githubusercontent.com/1635685665/TampermonkeyScripts/master/scripts/Z_Auto_Open.user.js
// @downloadURL  https://ghproxy.com/https://raw.githubusercontent.com/1635685665/TampermonkeyScripts/master/scripts/Z_Auto_Open.user.js
// @supportURL   https://github.com/1635685665/TampermonkeyScripts/issues
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://www.csdn.net/*
// @match        *://wenku.baidu.com/view/*
// @match        *://www.360doc.com/content/*
// @match        *://www.imooc.com/wenda/detail/*
// @match        *://www.iteye.com/blog/*
// @match        *://www.imooc.com/article/*
// @run-at       document-end
// @grant        unsafeWindow
// @note         1、适配页面少
// @note         2、适配移动端
// @note         3、其他页面 代码自己判断尝试展开还没写
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = 'Z_Auto_Open';
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
        const currentURL = location.href;
        if (-1 != currentURL.indexOf('blog.csdn.net')) {//CSDN *://blog.csdn.net/*/article/details/*
            $('a.btn-readmore').click();
            //关闭可能弹出的登陆窗
            var passportbox = $('#passportbox span');
            if (passportbox[0]) {
                passportbox.click();
            }
        } else if (-1 != currentURL.indexOf('bbs.csdn.net')) {//CSDN *://bbs.csdn.net/topics/*
            $('label.show_topic.js_show_topic').click();
            //关闭可能弹出的登陆窗
            var passportbox = $('#passportbox span');
            if (passportbox[0]) {
                passportbox.click();
            }
        } else if (-1 != currentURL.indexOf('www.csdn.net')) {//CSDN *://www.csdn.net/*
            $('a.readmore_btn').click();
        } else if (-1 != currentURL.indexOf('wenku.baidu.com')) {//百度文库 *://wenku.baidu.com/view/*
            $('.fc2e').click();
        } else if (-1 != currentURL.indexOf('www.360doc.com')) {//360doc *://www.360doc.com/content/*
            $('body').removeClass('articleMaxH');
        } else if (-1 != currentURL.indexOf('www.imooc.com/wenda/detail')) {//猿问 *://www.imooc.com/wenda/detail/*
            $('div.hide-articel-box').click();
            $('.js-show-reply-btn.hide-answer-morebtn').click();
        } else if (-1 != currentURL.indexOf('www.iteye.com/blog')) {//ITeye *://www.iteye.com/blog/*
            $('#btn-readmore').click();
        } else if (-1 != currentURL.indexOf('www.imooc.com/article')) {//手记 *://www.imooc.com/article/*
            $('.showMore span').click();
        } else {//其他页面 代码自己判断尝试展开

        }
    }
})();