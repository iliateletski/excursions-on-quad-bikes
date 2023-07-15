$(document).ready(function(){
  $('.header__carusel').slick({
    arrows: false,
    dots: true,
    autoplay: true,
    fade: true,
  });
});

$(document).ready(function(){
  $('.our-routes__carusel').slick({
    arrows: false,
    dots: true,
    // autoplay: true,
    slidesToShow: 1,
    variableWidth: true,

  });
});