window.onload = function () {
    // 返回顶部
    var bTop = document.getElementById('backTop');
    var getTop;
    function backToTop() {
        if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
            window.scrollBy(0, -70);
            getTop = setTimeout(backToTop, 10);
        } else {
            clearTimeout(getTop);
        }
    }
    bTop.addEventListener('click', backToTop);

    function windowscroll() {
        //console.log(document.documentElement.scrollTop);
        if (document.documentElement.scrollTop > 250) {
            backTop.style.display = 'block';
        } else {
            backTop.style.display = 'none';
        }
    }
    window.addEventListener('scroll', windowscroll);


    //音乐播放器
    var plyBtn = document.getElementsByClassName('ply');
    var bgm;
    var isPaused;
    function playBgm() {
        //获得当前点击准备要播放的音频
        bgm = this.parentElement.parentElement.parentElement.children[1].children[0].children[0];
        //遍历判断是否有音乐在播放
        for (var i = 0; i < plyBtn.length; i++) {
            isPaused = plyBtn[i].parentElement.parentElement.parentElement.children[1].children[0].children[0];
            //如果已经有音乐在播放
            if (!isPaused.paused) {
                //console.log(isPaused);
                //暂停当前正在播放的音频
                isPaused.pause();
                plyBtn[i].style.backgroundPosition = '0 -203px';
                //如果点击的是其他音频，则播放其他音频
                if (bgm != isPaused) {
                    bgm.play();
                    this.style.backgroundPosition = '0 -164px';
                    //重新装载上一次暂停的音频
                    isPaused.load();
                }
                return;
            }
        }
        bgm.play();
        this.style.backgroundPosition = '0 -164px';
    }

    //绑定点击事件
    for (var i = 0; i < plyBtn.length; i++) {
        //var bgm = i[j].parentElement.parentElement.parentElement.children[1].children[0].children[0];
        plyBtn[i].addEventListener('click', playBgm);
    }

}
