        //获取屏幕宽高
        var windowWidth = window.screen.width;
        var windowHeight = window.screen.height;

        //创建雪花
        function createSnow() {
            var x = 0;
            var y = 0;

            //定义一个初始化随机数,使雪花在屏幕中
            var x_random = (Math.random() * windowWidth);
            var y_random = (Math.random() * windowHeight);
            var div = document.createElement('div');
            div.className = 'snow';
            div.innerHTML = "*";
            div.style.fontSize = Math.round(10 + (Math.random() * 40)) + 'px';
            div.style.transform = 'translate(' + (x_random + x) + 'px,' + (y_random + y) + 'px)';
            document.body.appendChild(div);



            // //雪花飘落
            setInterval(function () {
                div.style.transform = 'translate(' + (x_random + x) + 'px,' + (y_random + y) + 'px)' + " " + 'rotate(' + x + 'deg)';
                x += 0.2;
                y += 0.2;


                //如果雪花跑到屏幕外面了,让雪花重新返回屏幕顶部
                if (x_random + x >= windowWidth) {
                    x_random = Math.random();
                    x = 0;

                }

                if (y_random + y >= windowHeight) {
                    y_random = Math.random();
                    y = 0;
                }
            }, 10)

        }
        for (var i = 0; i < 100; i++) {
            createSnow()
        }