(function ($) {
    let toggle = document.getElementById('menu-toggle');
    let menu = document.getElementById('menu');
    let close = document.getElementById('menu-close');

    function setMenuOpen (isOpen) {
        menu.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }

    toggle.addEventListener('click', function () {
        setMenuOpen(!menu.classList.contains('open'));
    });

    close.addEventListener('click', function () {
        setMenuOpen(false);
    });

    $('.main-menu a').on('click', function () {
        if ($(window).width() < 846) {
            setMenuOpen(false);
        }
    });
})(jQuery);
