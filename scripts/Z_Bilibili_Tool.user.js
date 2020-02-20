// ==UserScript==
// @name         Z_Bilibili_Tool
// @namespace    https://github.com/1635685665/TampermonkeyScripts
// @version      1.0
// @author       ZYL
// @description  哔哩哔哩的辅助工具。自动宽屏播放。调整视频默认2.5倍速播放。自动调整视频窗口位置。关闭弹幕。
// @homepage     https://github.com/1635685665
// @updateURL    https://raw.githack.com/1635685665/TampermonkeyScripts/master/scripts/Z_Bilibili_Tool.user.js
// @downloadURL  https://raw.githack.com/1635685665/TampermonkeyScripts/master/scripts/Z_Bilibili_Tool.user.js
// @supportURL   https://github.com/1635685665/TampermonkeyScripts/issues
// @match        *://www.bilibili.com/bangumi/*
// @match        *://www.bilibili.com/video/*
// @run-at       document-end
// @grant        unsafeWindow
// @note         1、宽屏时延未解决（现在是循环判断解决的）
// @note         2、退出全屏时变回小屏（现在是循环判断解决的）
// @note         3、保存设置还没做
// @note         4、默认高清还没做
// @note         5、跳过充电列表还没做
// @note         6、跳过五秒下一P还没做
// @note         7、音量条还没做
// @note         8、弹幕等开关（现在是直接隐藏了父级元素，想要拦截请求）
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = 'Z_Bilibili_Tool';
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
        var styleTagId = 'Z-Style-biblibili';
        var styleContent = buildStyle();
        addStyle(styleContent, styleTagId);
        //关闭弹幕
        function closeBiuBiu() {
            durationTask(function () {
                $('#app .bilibili-player-video-bas-danmaku').hide();
                $('#app .bilibili-player-video-adv-danmaku').hide();
                $('#app .bilibili-player-video-danmaku').hide();
                config.closeBiuBiu = true;
            }, 100, 1000 * 3);
        }
        //更改倍速
        function modfiySpeed(modfiySpeed) {
            if (0 < config.speed + modfiySpeed && 10 >= config.speed + modfiySpeed) {
                config.speed += modfiySpeed;
                durationTask(function () {
                    $('.speedControlBar .displayText').text(config.speed + '倍速');//显示
                    if ($('#app div.bilibili-player-video video')[0]) {
                        $('#app div.bilibili-player-video video')[0].playbackRate = config.speed;//设置
                    }
                }, 100, 1000 * 3);
            }
        }
        //添加倍速控制条
        function addSpeedControlBar() {
            var bar = $('<div></div>').addClass('z-bar speedControlBar');
            var addBtn = $('<div></div>').addClass('z-btn add').text('+');
            var subBtn = $('<div></div>').addClass('z-btn sub').text('-');
            var displayText = $('<span></span>').addClass('displayText');
            addBtn.click(function () {
                modfiySpeed(0.25);
            });
            subBtn.click(function () {
                modfiySpeed(-0.25);
            });
            bar.append(subBtn).append(displayText).append(addBtn).appendTo('body:first');
        }
        //开启宽屏
        function openWideScreen() {
            durationTask(function () {
                if (!$('.bilibili-player-video-btn.bilibili-player-video-btn-widescreen.closed')[0]) {
                    $('.bilibili-player-video-btn.bilibili-player-video-btn-widescreen').click();
                    config.wideScreen = true;
                    //log('开启宽屏');
                }
            }, 100, 1000 * 3);
        }
        //关闭宽屏
        function closeWideScreen() {
            durationTask(function () {
                if ($('.bilibili-player-video-btn.bilibili-player-video-btn-widescreen.closed')[0]) {
                    $('.bilibili-player-video-btn.bilibili-player-video-btn-widescreen.closed').click();
                    config.wideScreen = false;
                    //log('关闭宽屏');
                }
            }, 100, 1000 * 3);
        }
        var config = {};
        function initConfig() {
            config.currentURL = location.href;
            config.speed = 0;
            config.closeBiuBiu = false;
            config.wideScreen = false;
            config.fullScreen = false;
        }
        function init() {
            initConfig();
            closeBiuBiu();
            modfiySpeed(2.5);//默认2.5倍速
            openWideScreen();
        }
        addSpeedControlBar();
        init();
        $('#app').on('DOMSubtreeModified', function () {
            //监控视频切换
            if (location.href != config.currentURL) {
                //log('视频切换了');
                init();
            }
            //监控视频全屏
            if (!config.fullScreen && $('body.player-fullscreen-fix')[0]) {
                //log('视频进入了全屏');
                config.fullScreen = true;
            } else if (config.fullScreen && !$('body.player-fullscreen-fix')[0]) {
                //log('视频退出了全屏');
                config.fullScreen = false;
                openWideScreen();
            }
        });
        //监控视频开始播放
        //$(document).on('playing', '#app div.bilibili-player-video video', function () {
        $('#app div.bilibili-player-video video').on('playing', function () {
            //log('视频开始播放了');
            //开启宽屏
            //openWideScreen();
            //调整视频窗口位置
        });
        //监控视频结束播放
        $('#app div.bilibili-player-video video').on('ended', function () {
            //log('视频结束播放了');
            //关闭宽屏
            //closeWideScreen();
            //跳过充电
            //跳过五秒下一P
        });
    }
    function durationTask(callBack, intervals, duration) {
        var taskTimer = setInterval(function () {
            callBack();
        }, intervals);
        setTimeout(function () {
            clearInterval(taskTimer);
        }, duration);
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

            + '.z-btn:hover {'
                + 'background-color: #5FB878;'
            + '}'

            + '.z-bar {'
                +'display: block;'
                +'width: auto;'
                +'background-color: #1E9FFF;'
                +'border-radius: 18px;'
                +'color: #ffffff;'
                +'text-align: center;'
                +'line-height: 36px;'
                +'font-size: 18px;'
                +'font-weight: bold;'
                +'position: fixed;'
                +'z-index: 2147483646;'
            + '}'

            + '.z-bar .z-btn {'
                +'display: inline-block;'
                +'position: initial;'
            + '}'

            + '.z-bar .displayText {'
                +'z-index: 2147483647;'
                +'display: inline-block;'
                +'width: 108px;'
            + '}'

            + '.z-bar.speedControlBar {'
                +'bottom: 200px;'
                +'left: 15px;'
            + '}';
        return styleContent;
    }
})();