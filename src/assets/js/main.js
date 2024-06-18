//  All Javascripit Code

(function ($) {
    "use strict";

    var $constrom_window = $(window);

    // :: Preloader Active Code
    $constrom_window.on('load', function () {
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

    // :: One Page Nav Active Code
    if ($.fn.onePageNav) {
        $('#nav').onePageNav({
            currentClass: 'active',
            scrollSpeed: 1500,
            easing: 'easeOutQuad'
        });
    }




    if ($.fn.owlCarousel) {
        var gameSlider = $('.game-slider');
        gameSlider.owlCarousel({
            items: 7,
            loop: true,
            autoplay: true,
            smartSpeed: 1000,
            margin: 10,
            dots: true,
            responsive: {
                320: {
                    items: 2
                },
                480: {
                    items: 3
                },
                576: {
                    items: 4
                },
                768: {
                    items: 6
                },
                992: {
                    items: 7
                },
                1200: {
                    items: 9
                },
                1350: {
                    items: 9
                }
            }
        });
    }

    // :: Scrollup Active Code

    if ($.fn.scrollUp) {
        $constrom_window.scrollUp({
            scrollSpeed: 1000,
            margin: 50,
            scrollText: '<i class="bi bi-arrow-up"></i>'
        });
    }

    // :: Brand Slides Active Code

    if ($.fn.owlCarousel) {
        var parnetSlider = $('.partner-slider');
        parnetSlider.owlCarousel({
            items: 7,
            loop: true,
            autoplay: false,
            smartSpeed: 2700,
            margin: 15,
            dots: true,
            responsive: {
                320: {
                    items: 1
                },
                480: {
                    items: 1
                },
                576: {
                    items: 2
                },
                768: {
                    items: 2
                },
                1024: {
                    items: 3
                },
                1200: {
                    items: 3
                },
                1350: {
                    items: 3
                }
            }
        });
    }

    $(document).ready(function () {
        $("body").tooltip({ selector: '[data-toggle=tooltip]' });
    });

    // ::  Sticky Header

    //  window.onscroll = function () {
    //      scrollFunction();
    //  };
    $(document).on("click", ".menu-toggle", function () {
        jQuery('.dashboard-nav').toggle(500);
    })
    jQuery('.menu-toggle').on('click', function () {
        jQuery('.dashboard-nav').toggle(500);
    })
    $(document).on("click", ".tooltipOP", function () {
        $(this).parent().prev('.popover-body').toggle(500);
    })
    $(document).on("click", ".BtnProgile", function () {
        $('.myProgile').toggle(500);
    })

    // $(document).on("click", ".bidboxOP", function () {
    //     jQuery('.bgfirstBDbox').toggle(500);
    // })
    // jQuery('.bidboxOP').on('click', function () {
    //     jQuery('.bgfirstBDbox').toggle(500);
    // })
    $(document).on("click", "#menu-btn", function () {
        $('.sidebar__menu__submenu').show(500);
    })
    $(document).ready(function () {
        $(".dashboard-nav-dropdown-toggle").click(function () {
            $(this).closest(".dashboard-nav-dropdown")
                .toggleClass("show")
                .find(".dashboard-nav-dropdown")
                .removeClass("show");
            $(this).parent()
                .siblings()
                .removeClass("show");
        });
    });


    function scrollFunction() {
        if (
            document.body.scrollTop > 50 ||
            document.documentElement.scrollTop > 50
        ) {
            $(".site-header--sticky").addClass("scrolling");
        } else {
            $(".site-header--sticky").removeClass("scrolling");
        }
        if (
            document.body.scrollTop > 700 ||
            document.documentElement.scrollTop > 700
        ) {
            $(".site-header--sticky.scrolling").addClass("reveal-header");
        } else {
            $(".site-header--sticky.scrolling").removeClass("reveal-header");
        }
    }

    // :: Animation on Scroll initializing
    if ($.fn.init) {
        AOS.init();
    }

})(jQuery);