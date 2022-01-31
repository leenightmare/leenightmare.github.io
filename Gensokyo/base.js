window.onload = function () {
    //**********************************轮播图功能实现*************************************************//

    // 获得中间轮播图模块
    var focus = document.getElementById('J_focus');

    var sliderBannerWrapper = document.getElementById('sliderBannerWrapper_left');

    // 获得所有轮播图
    var slider_list = document.getElementById('J_focus').querySelector('.slider_list').querySelectorAll('img');


    // 获得左边按钮
    var slider_prevous = document.getElementById('sliderBannerWrapper_left').querySelector('.slider_prevous');


    // 获得右边按钮
    var slider_next = document.getElementById('sliderBannerWrapper_left').querySelector('.slider_next');


    // 获得小圆点
    var slider_indicators = document.getElementById('J_focus').querySelector('.slider_indicators').querySelectorAll('i');

    var focus_now = null;

    // 给所有轮播图添加属性的方法
    function addAttribute(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].setAttribute('data-index', i);
        }
    }
    addAttribute(slider_list);


    function showNow(arr, now, ind) {
        //获取当前显示的图的方法
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].style.display == 'block') {
                now = arr[i].getAttribute('data-index');
                if (arguments.length >= 3) {
                    ind[i].style.backgroundColor = '#fff';
                }
                return now;
            }
        }
    }
    focus_now = showNow(slider_list, focus_now, slider_indicators);


    // 所有圆点添加属性
    for (var o = 0; o < slider_indicators.length; o++) {
        slider_indicators[o].setAttribute('data-index', o);
    }


    //鼠标经过圆点事件
    function onind(arr, now, ind) {
        for (var k = 0; k < ind.length; k++) {
            ind[k].style.backgroundColor = '';
        }

        for (var i = 0; i < arr.length; i++) {
            arr[i].style.display = 'none';
        }
        event.srcElement.style.backgroundColor = '#fff';
        arr[event.srcElement.getAttribute('data-index')].style.display = 'block';
        now = event.srcElement.getAttribute('data-index');
        return now;
    }

    for (var i = 0; i < slider_indicators.length; i++) {
        slider_indicators[i].addEventListener('mouseover', function () {
            focus_now = onind(slider_list, focus_now, slider_indicators);
            return focus_now;
        });
    }


    // 点击按钮事件

    // 左边按钮
    function prevous(arr, now, ind) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].style.display = 'none';
            if (arguments.length >= 3) {
                ind[i].style.backgroundColor = '';
            }
        }
        now--;
        if (now < 0) {
            now = arr.length - 1;
        }
        arr[now].style.display = 'block'
        if (arguments.length >= 3) {
            ind[now].style.backgroundColor = '#fff';
        }
        return now;
    }

    // 右边按钮
    function next(arr, now, ind) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].style.display = 'none';
            if (arguments.length >= 3) {
                ind[i].style.backgroundColor = '';
            }
        }
        now++;
        if (now > arr.length - 1) {
            now = 0;
        }
        arr[now].style.display = 'block'
        if (arguments.length >= 3) {
            ind[now].style.backgroundColor = '#fff';
        }
        return now;
    }

    slider_prevous.addEventListener('click', function () {
        focus_now = prevous(slider_list, focus_now, slider_indicators);
        return focus_now;
    });
    slider_next.addEventListener('click', function () {
        focus_now = next(slider_list, focus_now, slider_indicators);
        return focus_now;
    });

    //自动播放
    var id = setInterval(function () {
        focus_now = next(slider_list, focus_now, slider_indicators);
    }, 2000);

    // var id = setInterval(next, 2000, slider_list, focus_now, slider_indicators);
    //鼠标进入停止播放
    sliderBannerWrapper.onmouseover = function () {
        clearInterval(id);
    }

    // 鼠标离开继续播放
    sliderBannerWrapper.onmouseout = function () {
        id = setInterval(function () {
            focus_now = next(slider_list, focus_now, slider_indicators);
        }, 2000);
    }
    //*********************************轮播图结束************************************//

}