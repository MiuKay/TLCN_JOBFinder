$(document).ready(function () {

  'use strict';

  var usernameError = true,
    emailError = true,
    passwordError = true,
    passConfirm = true;

  // Detect browser for css purpose
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    $('.form form label').addClass('fontSwitch');
  }

  // Label effect
  $('input').focus(function () {

    $(this).siblings('label').addClass('active');
  });

  // Form validation
  $('input').blur(function () {

    // User Name
    if ($(this).hasClass('name')) {
      if ($(this).val().length === 0) {
        $(this).siblings('span.error').text('Please type your full name').fadeIn().parent('.form-group').addClass('hasError');
        usernameError = true;
      } else if ($(this).val().length > 1 && $(this).val().length <= 6) {
        $(this).siblings('span.error').text('Please type at least 6 characters').fadeIn().parent('.form-group').addClass('hasError');
        usernameError = true;
      } else {
        $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
        usernameError = false;
      }
    }
    // Email
    if ($(this).hasClass('email')) {
      if ($(this).val().length == '') {
        $(this).siblings('span.error').text('Please type your email address').fadeIn().parent('.form-group').addClass('hasError');
        emailError = true;
      } else {
        $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
        emailError = false;
      }
    }

    // PassWord
    if ($(this).hasClass('pass')) {
      if ($(this).val().length < 6) {
        $(this).siblings('span.error').text('Please type at least 6 charcters').fadeIn().parent('.form-group').addClass('hasError');
        passwordError = true;
      } else {
        $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
        passwordError = false;
      }
    }

    // PassWord confirmation
    if ($('.pass').val() !== $('.passConfirm').val()) {
      $('.passConfirm').siblings('.error').text('Passwords don\'t match').fadeIn().parent('.form-group').addClass('hasError');
      passConfirm = false;
    } else {
      $('.passConfirm').siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
      passConfirm = false;
    }

    // label effect
    if ($(this).val().length > 0) {
      $(this).siblings('label').addClass('active');
    } else {
      $(this).siblings('label').removeClass('active');
    }
  });


  // form switch
  $('a.switch').click(function (e) {
    console.log($(this))
    $(this).addClass('active');
    e.preventDefault();

    if ($('a.switch').hasClass('active')) {
      $(this).parents('.form-peice').addClass('switched').siblings('.form-peice').removeClass('switched');
    } else {
      $(this).parents('.form-peice').removeClass('switched').siblings('.form-peice').addClass('switched');
    }
  });


  // Form submit
  $('form.signup-form').submit(function (event) {
    event.preventDefault();

    if (usernameError == true || emailError == true || passwordError == true || passConfirm == true) {
      $('.name, .email, .pass, .passConfirm').blur();
    } else {
      $('.signup, .login').addClass('switched');

      setTimeout(function () { $('.signup, .login').hide(); }, 700);
      setTimeout(function () { $('.brand').addClass('active'); }, 300);
      setTimeout(function () { $('.heading').addClass('active'); }, 600);
      setTimeout(function () { $('.success-msg p').addClass('active'); }, 900);
      setTimeout(function () { $('.success-msg a').addClass('active'); }, 1050);
      setTimeout(function () { $('.form').hide(); }, 700);
    }
  });

  // Reload page
  $('a.profile').on('click', function () {
    window.location.reload(true);
  });


});

(function ($) {
  "use strict"

  /* 1. Proloder */
  $(window).on('load', function () {
    $('#preloader-active').delay(450).fadeOut('slow');
    $('body').delay(450).css({
      'overflow': 'visible'
    });
  });


  /* 2. slick Nav */
  // mobile_menu
  var menu = $('ul#navigation');
  if (menu.length) {
    menu.slicknav({
      prependTo: ".mobile_menu",
      closedSymbol: '+',
      openedSymbol: '-'
    });
  };


  /* 3. MainSlider-1 */
  function mainSlider() {
    var BasicSlider = $('.slider-active');
    BasicSlider.on('init', function (e, slick) {
      var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
      doAnimations($firstAnimatingElements);
    });
    BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
      var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
      doAnimations($animatingElements);
    });
    BasicSlider.slick({
      autoplay: false,
      autoplaySpeed: 10000,
      dots: false,
      fade: true,
      arrows: false,
      prevArrow: '<button type="button" class="slick-prev"><i class="ti-shift-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="ti-shift-right"></i></button>',
      responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
      ]
    });

    function doAnimations(elements) {
      var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      elements.each(function () {
        var $this = $(this);
        var $animationDelay = $this.data('delay');
        var $animationType = 'animated ' + $this.data('animation');
        $this.css({
          'animation-delay': $animationDelay,
          '-webkit-animation-delay': $animationDelay
        });
        $this.addClass($animationType).one(animationEndEvents, function () {
          $this.removeClass($animationType);
        });
      });
    }
  }
  mainSlider();



  /* 4. Testimonial Active*/
  var testimonial = $('.h1-testimonial-active');
  if (testimonial.length) {
    testimonial.slick({
      dots: true,
      infinite: true,
      speed: 500,
      autoplay: true,
      arrows: false,
      prevArrow: '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            arrow: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          }
        }
      ]
    });
  }

  /* 5. Gallery Active */
  var client_list = $('.completed-active');
  if (client_list.length) {
    client_list.owlCarousel({
      slidesToShow: 2,
      slidesToScroll: 1,
      loop: true,
      autoplay: true,
      speed: 3000,
      smartSpeed: 2000,
      nav: false,
      dots: false,
      margin: 15,

      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 2
        },
        992: {
          items: 2
        },
        1200: {
          items: 3
        }
      }
    });
  }


  /* 6. Nice Selectorp  */
  var nice_Select = $('select');
  if (nice_Select.length) {
    nice_Select.niceSelect();
  }

  /* 7.  Custom Sticky Menu  */
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    if (scroll < 245) {
      $(".header-sticky").removeClass("sticky-bar");
    } else {
      $(".header-sticky").addClass("sticky-bar");
    }
  });

  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    if (scroll < 245) {
      $(".header-sticky").removeClass("sticky");
    } else {
      $(".header-sticky").addClass("sticky");
    }
  });



  /* 8. sildeBar scroll */
  $.scrollUp({
    scrollName: 'scrollUp', // Element ID
    topDistance: '300', // Distance from top before showing element (px)
    topSpeed: 300, // Speed back to top (ms)
    animation: 'fade', // Fade, slide, none
    animationInSpeed: 200, // Animation in speed (ms)
    animationOutSpeed: 200, // Animation out speed (ms)
    scrollText: '<i class="ti-arrow-up"></i>', // Text for element
    activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
  });


  /* 9. data-background */
  $("[data-background]").each(function () {
    $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
  });


  /* 10. WOW active */
  new WOW().init();

  /* 11. Datepicker */

  // 11. ---- Mailchimp js --------//  
  function mailChimp() {
    $('#mc_embed_signup').find('form').ajaxChimp();
  }
  mailChimp();


  // 12 Pop Up Img
  var popUp = $('.single_gallery_part, .img-pop-up');
  if (popUp.length) {
    popUp.magnificPopup({
      type: 'image',
      gallery: {
        enabled: true
      }
    });
  }




})(jQuery);
