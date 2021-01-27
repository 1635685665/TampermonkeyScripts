// ==UserScript==
// @name         Z_Scrollbar_Style
// @namespace    https://github.com/1635685665/TampermonkeyScripts
// @version      1.0.1
// @author       ZYL
// @description  更改WebKit内核浏览器滚动条样式
// @homepage     https://github.com/1635685665
// @updateURL    https://ghproxy.com/https://raw.githubusercontent.com/1635685665/TampermonkeyScripts/master/scripts/Z_Scrollbar_Style.user.js
// @downloadURL  https://ghproxy.com/https://raw.githubusercontent.com/1635685665/TampermonkeyScripts/master/scripts/Z_Scrollbar_Style.user.js
// @supportURL   https://github.com/1635685665/TampermonkeyScripts/issues
// @match        *://*/*
// @run-at       document-body
// @grant        none
// @note         1、某些网站会出现两个顶端按钮
// @note         2、某些网站的加载时机
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = 'Z_Scrollbar_Style';
    function log(msg) { console.log('🐵 ' + scriptName + ' : ' + msg); }
    var styleContent = buildStyle();
    var styleTagId = 'Z-Style-Scrollbar';
    var styleTag = '<style type="text/css" id="' + styleTagId + '">' + styleContent + '</style>';
    var styleTagDOM = parseDom(styleTag)[0];
    document.getElementsByTagName('head')[0].appendChild(styleTagDOM);
    //监听样式是否被移除
    document.getElementsByTagName('head')[0].addEventListener('DOMSubtreeModified', function () {
        if (!document.getElementById(styleTagId)) {
            this.appendChild(styleTagDOM);
            log('head tag Listener add style tag ' + styleTagId);
        }
    });
    //字符串转DOM对象
    function parseDom(DOMHtml) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = DOMHtml;
        return tempDiv.childNodes;
    }
    function buildStyle() {
        var styleContent =
        '::-webkit-scrollbar {'//滚动条整体部分
            +'width: 8px !important;'//纵向生效
            +'height: 8px !important;'//横向生效
            +'background-color: transparent !important;'
        +'}'

        +'::-webkit-scrollbar-button {'//滚动条两端的按钮
            +'background-color: rgba(0, 0, 0, .3) !important;'
            +'width: 8px !important;'//纵向生效
            +'height: 8px !important;'//横向生效
            +'border-radius: 4px !important;'
        +'}'

        +'::-webkit-scrollbar-button:hover {'
        +' background-color: rgba(0, 0, 0, .5) !important;'
        +'}'

        +'::-webkit-scrollbar-track {'//外层轨道
            +'background-color: transparent !important;'
            +'border-radius: 4px !important;'
        +'}'

        +'::-webkit-scrollbar-track-piece {'//内层轨道
            +'background-color: rgba(0, 0, 0, .2) !important;'
            +'border-radius: 0 !important;'
        +'}'

        +'::-webkit-scrollbar-thumb {'//滑块
            +'border-radius: 4px !important;'
            +'background-color: rgba(0, 0, 0, .3) !important;'
        +'}'

        +'::-webkit-scrollbar-thumb:hover {'
            +'background-color: rgba(0, 0, 0, .5) !important;'
        +'}'

        +'::-webkit-scrollbar-corner {'//边角，两个滚动条交汇处
            +'background-color: transparent !important;'
        +'}';
        return styleContent;
    }
})();