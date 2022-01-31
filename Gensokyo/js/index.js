window.onload = function () {
    // 控制播放按钮
    var player = document.getElementById("player");
    var bgm = document.getElementById("bgm");
    var isPlay = false;
    var tx = 0;
    var playId;
    
    // 音乐图标旋转函数
    function autoRotate() {
        if (tx == 360) {
            tx = 0;
            console.log(tx);
        }
        player.style.transform = 'rotate(' + (tx += 1) + 'deg)';
    }

    function playMusic() { 
        if (!isPlay) {
            bgm.play();
            isPlay = true;
            //音乐播放后，开始旋转
            playId = setInterval(function () {
                autoRotate();
            }, 10);
        } else {
            bgm.pause();
            isPlay = false;
            //音乐暂停后，结束旋转
            clearInterval(playId);
        }
    }
    //document.addEventListener('click', playMusic);
    player.addEventListener('click',playMusic);
    // player.onclick = function () {
    //     if (!isPlay) {
    //         bgm.play();
    //         isPlay = true;
    //         //音乐播放后，开始旋转
    //         playId = setInterval(function () {
    //             autoRotate();
    //         }, 10);
    //     } else {
    //         bgm.pause();
    //         isPlay = false;
    //         //音乐暂停后，结束旋转
    //         clearInterval(playId);
    //     }
    // }


}