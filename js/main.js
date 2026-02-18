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
