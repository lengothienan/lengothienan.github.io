$(document).ready(function(){
    setCss();

    // detect window resize
    var width = window.innerWidth;
    var height = window.innerHeight;
    $(window).on('resize', () => {

        if ($(this).width() != width || $(this).height() != height) {
            width = $(window).width();
            setCss();
        }
    });
})

function setCss() {
    var h1 = document.getElementById("main-panel").clientHeight;
    document.getElementById("trongdong-panel").style.height = h1 + "px";
    var h2 = document.getElementById("trongdong-img").clientWidth;
    console.log(h2);
    document.getElementById("trongdong-img").style.height = h2 + "px";
    var h3 = document.getElementById("trongdong-img").clientHeight;
    document.getElementById("trongdong-img").style.marginTop = ((h3 - h1) / 2) * - 1 + "px";
    // document.getElementById("red-skin-img").style.height = h1 + "px";
    document.getElementById("red-footer-img").style.marginTop = (h1 - 40) + "px";

    var w1 = ($(".img-tintuc > img").width() * 2) / 3;
    $(".img-tintuc > img").height(w1);
}


// var w2 = ($(".carousel-item").width() * 2)/3;
// $(".carousel-item > img").height(w2);