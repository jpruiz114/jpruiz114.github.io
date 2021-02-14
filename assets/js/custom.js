(function ($) {
    let toggle = document.getElementById('menu-toggle');
    let menu = document.getElementById('menu');
    let close = document.getElementById('menu-close');
    let form = document.getElementById('contact');

    toggle.addEventListener('click', function (e) {
        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
        } else {
            menu.classList.add('open');
        }
    });

    close.addEventListener('click', function (e) {
        menu.classList.remove('open');
    });

    form.addEventListener('submit', function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        console.log('form submit');

        return false;
    });

    // Close menu after click on smaller screens
    $(window).on('resize', function () {
        if ($(window).width() < 846) {
            $('.main-menu a').on('click', function () {
                menu.classList.remove('open');
            });
        }
    });

    $('.owl-carousel').owlCarousel({
        items: 4,
        lazyLoad: true,
        loop: true,
        dots: true,
        margin: 30,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });

    $('.hover').mouseleave(function () {
        $(this).removeClass('hover');
    });

    $('.isotope-wrapper').each(function () {
        let $isotope = $('.isotope-box', this);
        let $filterCheckboxes = $('input[type="radio"]', this);

        let filter = function () {
            let type = $filterCheckboxes.filter(':checked').data('type') || '*';

            if (type !== '*') {
                type = '[data-type="' + type + '"]';
            }

            $isotope.isotope({ filter: type });
        };

        $isotope.isotope({
            itemSelector: '.isotope-item',
            layoutMode: 'masonry'
        });

        $(this).on('change', filter);

        filter();
    });

    lightbox.option({
        resizeDuration: 200,
        wrapAround: true
    });
})(jQuery);
