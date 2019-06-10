var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
document.getElementsByTagName("canvas")[0].style.border = " 2px solid #eaeaea"

var thanhchan = {
    width: 70,
    height: 10,
    x: 100,
    y: canvas.height - 10,
    speed: 10,
    isMovingLeft: false,
    isMovingRight: false

};

var dx = 2.5;
var dy = 2.2;
var radius = 5;
var x = thanhchan.x + (thanhchan.width / 2);
var y = canvas.height - thanhchan.height - radius;

var viengachConfig = {
    offsetX: 25,
    marginX: 10.2,
    offsetY: 10,
    marginY: 20,
    widthBrick: 40,
    heightBrick: 15,
    totalRow: 4,
    totalCol: 9
};

var viengachList = [];
for (var i = 0; i < viengachConfig.totalRow; i++) {
    for (var j = 0; j < viengachConfig.totalCol; j++) {
        viengachList.push({
            x: viengachConfig.offsetX + j * (viengachConfig.widthBrick + viengachConfig.marginX),
            y: viengachConfig.offsetY + i * (viengachConfig.heightBrick + viengachConfig.marginY),
            isBroken: false
        })
    }
}

var isGameOver = false;
var gamePause = true;

// Xây dựng hình ảnh ----------------------------------------------------------------------------------------------
function drawBall() {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
};

// Xây dựng thanh chắn
function drawThanhChan() {
    context.beginPath();
    context.rect(thanhchan.x, thanhchan.y, thanhchan.width, thanhchan.height)
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

// Xây dựng các viên gạch
function drawGach() {

    viengachList.forEach(function (element) {
        if (element.isBroken == false) {
            context.beginPath();
            context.fillStyle = "blue";
            context.rect(element.x, element.y, viengachConfig.widthBrick, viengachConfig.heightBrick);
            context.fill();
            context.closePath();
        }
    })
}

// Bắt sự kiện bàn phím -------------------------------------------------------------------------------------

// Bắt sự kiện nhấn phím xuống
document.addEventListener('keydown', function (event) {


    if (event.keyCode == 39) {
        thanhchan.isMovingRight = true;
    }

    if (event.keyCode == 37) {
        thanhchan.isMovingLeft = true;
    }
    if (event.keyCode == 38) {
        thanhchan.isMovingUp = true;
    }
});

// Bắt sự kiện nhả phím ra
document.addEventListener('keyup', function (event) {
    if (event.keyCode == 39) {
        thanhchan.isMovingRight = false;

    }

    if (event.keyCode == 37) {
        thanhchan.isMovingLeft = false;

    }
});

// Cập nhật trạng thái ----------------------------------------------------------------------------
// Cập nhật vị trí bóng
function updateBongViTriMoi() {
        x += dx;
        y += dy;
}

// Cập nhật vị trí thanh chắn
function updateVitriThanhChan() {
    // Tạo giới hạn cho thanh chắn
    if (thanhchan.isMovingRight == true) {
        if (thanhchan.x + thanhchan.width > canvas.width - thanhchan.speed) {
            thanhchan.x = canvas.width - thanhchan.width;
        } else {
            thanhchan.x += thanhchan.speed;
        }
    } else if (thanhchan.isMovingLeft == true) {
        if (thanhchan.x < (0 + thanhchan.speed)) {
            thanhchan.x = 0;
        } else {
            thanhchan.x -= thanhchan.speed;
        }
    }
}
// Xử lý va chạm ---------------------------------------------------------------------------------------
// Xử lý bóng va chạm cạnh màn hình
function suliBongVaCham() {
    if ((x) > (canvas.width - radius) || (x) < radius) {
        dx = -dx;
    }

    if (y < radius || y > canvas.height - radius) {
        dy = -dy;
    }
}

// Xử lý bóng va chạm thanh chắn
function suliBongvaChamThanhChan() {
    if (x > thanhchan.x && x <= thanhchan.x + thanhchan.width && y + radius >= (canvas.height - thanhchan.height)) {
        dy = -dy;
    }
}

// Xử lý khi bóng chạm gach
function vachamGach() {
    viengachList.forEach(function (element) {
        if (!element.isBroken) {
            if (element.y <= y + radius && y + radius <= element.y + viengachConfig.heightBrick && element.x < x && x < element.x + viengachConfig.widthBrick) {
                dy=
                element.isBroken = true;
            }
        }
    })
}



// Kiểm tra trạng thái trò chơi -------------------------------------------------------------------
function checkGameOver() {
    if (y > canvas.height - radius) {
        isGameOver = true;
    }
}

function handleGameover() {
    alert("game over");
}

/**
 * main
 * Dùng requestAnimation để tạo hành động mượt
 **/
function draw() {

    if (!isGameOver) {
        // xóa khung hình cũ
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawThanhChan();
        drawBall();
        drawGach();

        suliBongVaCham();
        suliBongvaChamThanhChan();
        vachamGach();

        updateVitriThanhChan();
        updateBongViTriMoi();

        checkGameOver();

        // Hàm có sẵn của js tạo hiệu ứng mượt cho hình
        requestAnimationFrame(draw)
    } else {
        handleGameover();
    }
}

draw();
