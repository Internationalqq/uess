/* Анимация появления секций и элементов при скролле */
(function() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-in-view');
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    revealEls.forEach(function(el) {
        observer.observe(el);
        /* Hero в viewport при загрузке — сразу запускаем анимацию */
        if (el.classList.contains('hero')) {
            requestAnimationFrame(function() { el.classList.add('reveal-in-view'); });
        }
    });
})();

/* Плавная прокрутка по якорям */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Закрываем мобильное меню при клике на ссылку
            var mobileNav = document.querySelector('.mobile-nav');
            var menuToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
});

/* Мобильное меню */
document.addEventListener('DOMContentLoaded', function() {
    var menuToggle = document.querySelector('.mobile-menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
});
