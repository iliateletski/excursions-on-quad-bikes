$(document).ready(function(){
  $('.header__carusel').slick({
    arrows: false,
    dots: true,
    autoplay: true,
    fade: true,
  });
});

$(document).ready(function(){
  $('.photo-gallery__carusel').slick({
    arrows: false,
    dots: true,
    slidesToShow: 3,
    // autoplay: true,
    dotsClass: 'carousel-dots',
  });
});

$(function () {
  const elements = $(".our-routes__carusel") 
  const classes = ['.carusel-ltr', '.carusel-rtl']
  for(let i = 0; i < elements.length; i++) {
    if(i % 2 !== 0) {
      $(elements[i]).attr('dir', 'rtl')
      $(elements[i]).addClass('carusel-rtl')
    } else {
      $(elements[i]).addClass('carusel-ltr')
    }
  }
  console.log(elements)

  for(let i = 0; i < classes.length; i++) {
    console.log(classes[i])
    $(classes[i]).slick({
      arrows: false,
      dots: true,
      autoplay: true,
      slidesToShow: 1,
      variableWidth: true,
      rtl: classes[i] === '.carusel-rtl' ? true : false,
      dotsClass: 'carousel-dots'
    });
  }
})

