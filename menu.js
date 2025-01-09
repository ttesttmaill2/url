// الحصول على العناصر المطلوبة
const menuIcon = document.querySelector('.mobile-menu-icon');
const mobileMenu = document.querySelector('.mobile-menu');

// إضافة حدث عند النقر على زر الثلاثة شرائط
menuIcon.addEventListener('click', () => {
    // التبديل بين إظهار وإخفاء القائمة
    mobileMenu.classList.toggle('show');
});

// عند النقر على رابط داخل القائمة، نقوم بإخفائها بعد التصفح
const mobileLinks = document.querySelectorAll('.mobile-menu a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
    });
});
