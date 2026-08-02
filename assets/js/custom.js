(function () {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const close = document.getElementById('menu-close');
    const menuLinks = Array.from(document.querySelectorAll('.main-menu a'));
    const navigationLinks = Array.from(document.querySelectorAll('.menu a[href^="#"]'));
    const sections = Array.from(document.querySelectorAll('.section'));
    let activeSectionId;
    let scrollUpdatePending = false;

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

    function setActiveSection () {
        const scrollPosition = window.scrollY + 80;
        let activeSection = sections[0];

        sections.forEach(function (section) {
            if (section.offsetTop <= scrollPosition) {
                activeSection = section;
            }
        });

        const activeId = activeSection.dataset.section;
        scrollUpdatePending = false;
        if (activeId === activeSectionId) {
            return;
        }

        activeSectionId = activeId;
        menuLinks.forEach(function (link) {
            link.closest('li').classList.toggle('active', link.hash === `#${activeId}`);
        });
    }

    navigationLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            const section = document.querySelector(`[data-section="${link.hash.slice(1)}"]`);
            if (!section) {
                return;
            }

            event.preventDefault();
            if (window.innerWidth < 846) {
                setMenuOpen(false);
            }
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    window.addEventListener('scroll', function () {
        if (!scrollUpdatePending) {
            scrollUpdatePending = true;
            window.requestAnimationFrame(setActiveSection);
        }
    }, { passive: true });

    setActiveSection();
})();

(function () {
    const form = document.getElementById('contact');
    const status = document.getElementById('form-status');
    const submitButton = document.getElementById('form-submit');
    let isSubmitting = false;

    if (!form || !status || !submitButton) {
        return;
    }

    if (window.emailjs) {
        window.emailjs.init({
            publicKey: 'uhZt1g2VIGuAWTP7m',
            limitRate: {
                id: 'contact-form',
                throttle: 10000
            }
        });
    }

    function setStatus (message, type) {
        status.textContent = message;
        status.dataset.status = type;
    }

    function resetRecaptcha () {
        if (window.grecaptcha) {
            window.grecaptcha.reset();
        }
    }

    window.onRecaptchaExpired = function () {
        setStatus('The reCAPTCHA verification expired. Please complete it again.', 'error');
    };

    window.onRecaptchaError = function () {
        setStatus('The reCAPTCHA verification could not load. Please try again.', 'error');
    };

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!form.checkValidity()) {
            const invalidField = form.querySelector(':invalid');
            const emailField = form.elements.namedItem('email');
            const message = emailField.validity.typeMismatch
                ? 'Please enter a valid email address.'
                : 'Please complete all required fields.';
            setStatus(message, 'error');
            invalidField.focus();
            return;
        }

        if (!window.grecaptcha) {
            setStatus('The reCAPTCHA verification is unavailable. Please try again.', 'error');
            return;
        }

        const recaptchaResponse = window.grecaptcha.getResponse();
        if (!recaptchaResponse) {
            setStatus('Please complete the reCAPTCHA verification.', 'error');
            return;
        }

        if (!window.emailjs) {
            setStatus('The contact service is unavailable. Please try again later.', 'error');
            return;
        }

        isSubmitting = true;
        form.setAttribute('aria-busy', 'true');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        setStatus('Sending your message...', 'pending');
        const delayedStatusId = window.setTimeout(function () {
            setStatus('Your message is still sending. Please keep this page open.', 'pending');
        }, 30000);

        try {
            await window.emailjs.send('service_vc06puj', 'template_x2havzz', {
                from_name: form.elements.name.value,
                reply_to: form.elements.email.value,
                message_subject: form.elements.subject.value,
                message: form.elements.message.value,
                'g-recaptcha-response': recaptchaResponse
            });
            form.reset();
            resetRecaptcha();
            setStatus('Your message has been sent. Thank you!', 'success');
        } catch {
            resetRecaptcha();
            setStatus('Your message could not be sent. Please try again.', 'error');
        } finally {
            window.clearTimeout(delayedStatusId);
            isSubmitting = false;
            form.removeAttribute('aria-busy');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
})();
