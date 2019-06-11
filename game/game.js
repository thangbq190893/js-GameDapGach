var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
document.getElementsByTagName("canvas")[0].style.border = " 2px solid #eaeaea"

var thanhchan = {
    width: 80,
    height: 10,
    x: 100,
    y: canvas.height - 10,
    speed: 10,
    isMovingLeft: false,
    isMovingRight: false

};

var dx = 5;
var dy = 6.5;
var radius = 5;
var x = thanhchan.x + (thanhchan.width / 2);
var y = canvas.height - thanhchan.height - radius;
var x_45 = radius / Math.sqrt(2);
var y_45 = radius / Math.sqrt(2);
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
var isGamewin = false;
var UserScore = 0;
var maxScore = viengachList.length;

// Xây dựng hình ảnh ---------------------------------------------------------------------------------------------------
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

// Bắt sự kiện bàn phím ------------------------------------------------------------------------------------------------

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

// Cập nhật trạng thái -------------------------------------------------------------------------------------------------
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
    if ((x) >= (canvas.width - radius) || (x) <= radius) {
        dx = -dx;
    }

    if (y <= radius || y > canvas.height - radius) {
        dy = -dy;
    }
}

// Xử lý bóng va chạm thanh chắn
function suliBongvaChamThanhChan() {

    if (x + x_45 > thanhchan.x && x - x_45 < thanhchan.x + thanhchan.width && y + y_45 > (canvas.height - thanhchan.height)) {
        if (thanhchan.isMovingRight == true && thanhchan.x + thanhchan.width < canvas.width && dx >= 0) {
            dx = dx + 1;
            dy = -dy;
        } else if (thanhchan.isMovingRight == true && thanhchan.x + thanhchan.width < canvas.width && dx < 0) {
            dx = dx + 1;
            dy = -dy;
        } else if (thanhchan.isMovingLeft == true && thanhchan.x > 0 && dx < 0) {
            dx = dx - 1;
            dy = -dy;
        } else if (thanhchan.isMovingLeft == true && thanhchan.x > 0 && dx >= 0) {
            dx = dx - 1;
            dy = -dy;
        } else {
            dy = -dy;
        }

    } else if (x + x_45 == thanhchan.x && y + y_45 > (canvas.height - thanhchan.height)) {
        dx = -dx;
        dy = -dy;
    } else if (x - x_45 == thanhchan.x + thanhchan.width && y + y_45 > (canvas.height - thanhchan.height)) {
        dx = -dx;
        dy = -dy;
    }
}

// Xử lý khi bóng chạm gach
function vachamGach() {
    viengachList.forEach(function (element) {
        if (!element.isBroken) {
            if (x + radius >= element.x && x - radius <= element.x + viengachConfig.widthBrick &&
                y + radius >= element.y && y - radius <= element.y + viengachConfig.heightBrick) {
                dy = -dy;
                element.isBroken = true;
                UserScore += 1;
            }
        }
    })
}


// Kiểm tra trạng thái trò chơi -------------------------------------------------------------------
function checkGameOver() {
    if (y > canvas.height - radius) {
        isGameOver = true;
        isGamewin = false;
    } else if (UserScore == maxScore) {
        isGamewin = true;
        isGameOver = false;
        drawGach();
    }
}

function handleGameover() {
    if (isGamewin == true) {
        alert(" You win");
        hiddenPause();
        hiddenResume();
        hiddenStop();
    } else if (isGameOver == true) {
        alert("game over");
        hiddenPause();
        hiddenResume();
        hiddenStop();
    }
}

/**
 * Hàm main
 * Dùng requestAnimation để tạo hành động mượt
 **/
function draw() {

    if (!isGameOver && !isGamewin) {
        // xóa khung hình cũ
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawThanhChan();
        drawBall();
        drawGach();
        if (isPauseGame == false) {
            suliBongVaCham();
            suliBongvaChamThanhChan();
            vachamGach();

            updateVitriThanhChan();
            updateBongViTriMoi();
            document.getElementById("score").innerText = UserScore;
            checkGameOver();
            // Hàm có sẵn của js tạo hiệu ứng mượt cho hình
            requestAnimationFrame(draw)
        }
    } else {
        handleGameover();
    }
}

draw();

// Hiển thị các phím chức năng
var isPauseGame = true;

// Xử lý hiển thị các button -------------------------------------------------------------------------------------------
function hiddenResume() {
    document.getElementById('resume').style.display = "none";
}

function hiddenStop() {
    document.getElementById('stop').style.display = "none";
}

function hiddenPause() {
    document.getElementById('pause').style.display = "none";
}

function showResume() {
    document.getElementById('resume').style.display = "inline-block";
}

function showStop() {
    document.getElementById('stop').style.display = "inline-block";
}

function showPause() {
    document.getElementById('pause').style.display = "inline-block";
}

// Hiển thị điểm -------------------------------------------------------------------------------------------------------
function showScore() {
    $("#game").before("<p >Điểm: <span id='score'>0</span></p>");
}

showScore();

// tạo các button ------------------------------------------------------------------------------------------------------
function playGame() {
    $("#game").after("<div id='action'></div>");
    if (isPauseGame == true) {
        $("#action").append("<button id='start' onclick='startGame()'>StartGame</button>");
        document.getElementById('start').style.color = 'blue';
        document.getElementById('start').style.display = 'inline-block';
    }
}

function stopGame() {
    $("#start").after("<button id='pause' onclick='pauseGame()'>PauseGame</button>");
    $("#pause").after("<button id='resume' onclick='resumeGame()'>ResumeGame</button>");
    $("#resume").after("<button id='stop' onclick='endGame()'>EndGame</button>");
    hiddenPause();
    hiddenResume();
    hiddenStop();
}

// Xử lý các sự kiện button ------------------------------------------------------------------------------------------------
function startGame() {
    isGamewin = false;
    isGameOver = false;
    endGame();
    isPauseGame = false;

    showPause();
    showStop();
    draw();
}

function resumeGame() {
    isPauseGame = false;
    document.getElementById('resume').style.display = "none";
    draw();
}

function pauseGame() {
    isPauseGame = true;
    document.getElementById('resume').style.display = "inline-block";
}


function endGame() {
    isPauseGame = true;
    x = thanhchan.x + (thanhchan.width / 2);
    y = canvas.height - thanhchan.height - radius;
    viengachList.forEach(function (element) {
        element.isBroken = false;
    })
    hiddenResume();
    hiddenPause();
    hiddenStop();
    draw();
}

playGame();
stopGame();

