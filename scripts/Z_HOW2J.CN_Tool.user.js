// ==UserScript==
// @name         Z_HOW2J.CN_Tool
// @namespace    https://github.com/1635685665/TampermonkeyScripts
// @version      1.0
// @author       ZYL
// @description  HOW2J.CN的辅助工具。调整视频默认2.5倍速播放。自动调整视频窗口位置。自动展开折叠代码。显示隐藏的内容。
// @homepage     https://github.com/1635685665
// @updateURL    https://raw.githack.com/1635685665/TampermonkeyScripts/master/scripts/Z_HOW2J.CN_Tool.user.js
// @downloadURL  https://raw.githack.com/1635685665/TampermonkeyScripts/master/scripts/Z_HOW2J.CN_Tool.user.js
// @supportURL   https://github.com/1635685665/TampermonkeyScripts/issues
// @match        *://how2j.cn/k/*
// @run-at       document-end
// @grant        unsafeWindow
// @note         1、调整视频窗口适配移动端
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = 'Z_HOW2J.CN_Tool';
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
        $('#videoImage').click(function () {
            //隐藏区块
            $('#ifshowVideoDiv').hide();
            $('#notlogin').remove();
            $('#notactive').hide();
            $('#videoDiv').show();
            //添加按钮
            var speedBtnGroup = $('#videoDiv .btn-group.videoNotProjectSpeedControlButtons');
            addSpeedBtnAndClick(speedBtnGroup, mySpeed);
            //调整视频窗口大小
            modifyVideoSizeAndToTop('#videoDiv');
        });
        $('.videoImage').click(function () {
            var stepAnswerDiv = $(this).parents('div.stepAnswer');
            stepAnswerDiv.find('.ifshowVideoDiv').hide();
            var speedBtnGroup = stepAnswerDiv.find('.btn-group.videoNotProjectSpeedControlButtons');
            addSpeedBtnAndClick(speedBtnGroup, mySpeed);
            modifyVideoSizeAndToTop(stepAnswerDiv.find('.videoDiv4step')[0]);
        });
        //显示答案
        durationTask(function () {
            $('div.stepAnswer').show();
        }, 100, 1000 * 3);
        //展开折叠代码
        $('.showStepCodeLink').click();
        //添加倍速按钮
        var mySpeed = 2.5;//添加2.5倍速
        function addSpeedBtnAndClick(speedBtnGroup, speed) {
            var speedBtn = speedBtnGroup.find('label:last').clone(true);
            speedBtn.attr('speed', speed);
            speedBtn.text(speed);
            speedBtn.prepend('<input type="radio">');
            speedBtnGroup.append(speedBtn);
            speedBtnGroup.find('label:last').click();//默认最高速
        }
        //调整视频窗口
        function modifyVideoSizeAndToTop(videoTagParentEle) {
            $(videoTagParentEle).find('video').on('loadedmetadata', function () {
                var videoHeight = this.videoHeight;
                var videoWidth = this.videoWidth;
                var newHeight = $(window).height() - 64;
                var newWidth = newHeight * videoWidth / videoHeight;
                //适配竖屏
                if (newHeight > newWidth) {
                    newWidth = videoWidth;
                    newHeight = videoHeight;
                }
                //this.height = newHeight + 'px';
                //this.width = newWidth + 'px';
                $(this).height(newHeight);
                $(this).width(newWidth);
            });
            $(window).scrollTop($(videoTagParentEle).position().top - 8);//视频窗口滚动到中间
        }
    }
    function durationTask(callBack, intervals, duration) {
        var taskTimer = setInterval(function () {
            callBack();
        }, intervals);
        setTimeout(function () {
            clearInterval(taskTimer);
        }, duration);
    }
})();