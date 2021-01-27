// ==UserScript==
// @name         Z_Pandownload_Link
// @namespace    https://github.com/1635685665/TampermonkeyScripts
// @version      1.0.1
// @author       ZYL
// @description  添加百度网盘分享文件快速跳转到Pandownload解析下载的按钮
// @homepage     https://github.com/1635685665
// @updateURL    https://ghproxy.com/https://raw.githubusercontent.com/1635685665/TampermonkeyScripts/master/scripts/Z_Pandownload_Link.user.js
// @downloadURL  https://ghproxy.com/https://raw.githubusercontent.com/1635685665/TampermonkeyScripts/master/scripts/Z_Pandownload_Link.user.js
// @supportURL   https://github.com/1635685665/TampermonkeyScripts/issues
// @match        *://yun.baidu.com/s*
// @match        *://pan.baidu.com/s*
// @run-at       document-body
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = 'Z_Pandownload_Link';
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
        function addStyle(styleContent, styleTagId) {
            var styleTag = '<style type="text/css" id="' + styleTagId + '">' + styleContent + '</style>';
            //添加样式表
            $('head:first').append(styleTag);
            //监控样式表
            $('head:first').on('DOMSubtreeModified', function () {
                if (!$('#' + styleTagId)[0]) {
                    $('head:first').append(styleTag);
                    log('head tag Listener add style tag ' + styleTagId);
                }
            });
        }
        var styleTagId = 'Z-Style-PandownloadLink';
        var styleContent = buildStyle();
        addStyle(styleContent, styleTagId);
        //添加按钮
        const currentURL = location.href;
        var pandownloadLinkURL = currentURL.replace('baidu.com', 'baiduwp.com');
        var linkBtn = $('<a></a>').attr('href', pandownloadLinkURL).attr('target', '_blank').addClass('z-btn z-pandownload-link-btn');
        var libkImg = $('<img>').attr('src', 'https://pandownload.com/img/baiduwp/logo.png').addClass('z-pandownload-link-img');
        linkBtn.append(libkImg);
        $('body:first').append(linkBtn);
    }
    function buildStyle() {
        var styleContent =
            '.z-btn {'
                +'display: block;'
                +'width: 36px;'
                +'height: 36px;'
                +'border-radius: 18px;'
                +'background-color: #1E9FFF;'
                +'color: #ffffff;'
                +'text-align: center;'
                +'line-height: 36px;'
                +'font-size: 18px;'
                +'font-weight: bold;'
                +'position: fixed;'
                +'z-index: 2147483647;'
                +'cursor: pointer;'
                +'user-select: none;'//按钮文字不可选中
            +'}'

            +'.z-pandownload-link-btn {'
                +'left: 10px;'
                +'top: 300px;'
            +'}'

            +'.z-pandownload-link-img {'
                +'margin: 0;'
                +'paddng: 0;'
                +'width: 100%;'
                +'height: auto;'
            +'}';
        return styleContent;
    }
})();