(function ($) {
    let toggle = document.getElementById('menu-toggle');
    let menu = document.getElementById('menu');
    let close = document.getElementById('menu-close');

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

$('.main-menu li:first').addClass('active');

let showSection = function showSection (section, isAnimate) {
    let direction = section.replace(/#/, ''),
        reqSection = $('.section').filter(
            '[data-section="' + direction + '"]'
        ),
        reqSectionPos = reqSection.offset().top - 0;

    if (isAnimate) {
        $('body, html').animate(
            {
                scrollTop: reqSectionPos
            },
            800
        );
    } else {
        $('body, html').scrollTop(reqSectionPos);
    }
};

let checkSection = function checkSection () {
    $('.section').each(function () {
        let $this = $(this),
            topEdge = $this.offset().top - 80,
            bottomEdge = topEdge + $this.height(),
            wScroll = $(window).scrollTop();
        if (topEdge < wScroll && bottomEdge > wScroll) {
            let currentId = $this.data('section'),
                reqLink = $('a').filter('[href*=\\#' + currentId + ']');
            reqLink
                .closest('li')
                .addClass('active')
                .siblings()
                .removeClass('active');
        }
    });
};

$('.main-menu').on('click', 'a', function (e) {
    e.preventDefault();
    showSection($(this).attr('href'), true);
});

$(window).scroll(function () {
    checkSection();
});

function submitForm () {
    emailjs.send('service_vc06puj', 'template_x2havzz', {
        from_name: $('#name').val(),
        reply_to: $('#email').val(),
        message_subject: $('#subject').val(),
        message: $('#message').val()
    }).then(function (response) {
        $('#name').val('');
        $('#email').val('');
        $('#subject').val('');
        $('#message').val('');

        alert('Your message has been sent!');
    }, function (error) {
        alert(error);
    });
}
