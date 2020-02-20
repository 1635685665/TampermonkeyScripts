// ==UserScript==
// @name         Z_To_Top-Bottom
// @namespace    https://github.com/1635685665/TampermonkeyScripts
// @version      1.0
// @author       ZYL
// @description  一键顶部/底部
// @homepage     https://github.com/1635685665
// @updateURL    https://raw.githack.com/1635685665/TampermonkeyScripts/master/scripts/Z_To_Top-Bottom.user.js
// @downloadURL  https://raw.githack.com/1635685665/TampermonkeyScripts/master/scripts/Z_To_Top-Bottom.user.js
// @supportURL   https://github.com/1635685665/TampermonkeyScripts/issues
// @match        *://*/*
// @run-at       document-body
// @grant        unsafeWindow
// @noframes
// @note         1、某些网站会不出现（如GitHub）
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = 'Z_To_Top-Bottom';
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
        var styleTagId = 'Z-Style-To-Top-Bottom';
        var styleContent = buildStyle();
        addStyle(styleContent, styleTagId);
        //添加按钮
        var btnTop = $('<div></div>').addClass('z-btn z-btn-top').text('▲');
        var btnBottom = $('<div></div>').addClass('z-btn z-btn-bottom').text('▼');
        $(document).on('click', '.z-btn.z-btn-top', function () {
            var len = $(window).scrollTop();
            var setup = len / 15;
            var toTopTimer = setInterval(function () {
                len = len >= setup ? len - setup : 0;
                $(window).scrollTop(len);
                if (0 == len) {
                    clearInterval(toTopTimer);
                }
            }, 1);
        });
        $(document).on('click', '.z-btn.z-btn-bottom', function () {
            var len = $(document).height() - $(window).height();
            var setup = len / 15;
            var toBottomTimer = setInterval(function () {
                var currentHeight = $(window).scrollTop();
                currentHeight = len >= currentHeight + setup ? currentHeight + setup : len;
                $(window).scrollTop(currentHeight);
                if (currentHeight == len) {
                    clearInterval(toBottomTimer);
                }
            }, 1);
        });
        $('body:first').append(btnTop).append(btnBottom);
        //监控body
        $('body:first').on('DOMSubtreeModified', function () {
            if (!$('.z-btn.z-btn-top')[0]) {
                $(this).append(btnTop);
                log('body Listener add btnTop');
            }
            if (!$('.z-btn.z-btn-bottom')[0]) {
                $(this).append(btnBottom);
                log('body Listener add btnBottom');
            }
            display();
        });
        //显示/隐藏按钮
        function display() {
            if (200 < $(window).scrollTop()) {
                btnTop.fadeIn();
            } else {
                btnTop.fadeOut();
            }
            if ($(document).height() - $(window).height() - 200 > $(window).scrollTop()) {
                btnBottom.fadeIn();
            } else {
                btnBottom.fadeOut();
            }
        }
        display();
        $(window).scroll(function () {
            display();
        });
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
                +'right: 15px;'
                +'cursor: pointer;'
                +'user-select: none;'//按钮文字不可选中
            +'}'

            +'.z-btn:hover {'
                +'background-color: #5FB878;'
            +'}'

            +'.z-btn-top {'
                +'top: 200px;'
            +'}'

            +'.z-btn-bottom {'
                +'top: 250px;'
            +'}';
        return styleContent;
    }
})();
