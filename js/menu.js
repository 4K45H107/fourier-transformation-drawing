// Menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuButtons = document.querySelectorAll('.menu-btn');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sketchName = button.getAttribute('data-sketch');
            if (sketchName && window.router) {
                window.location.hash = sketchName;
            }
        });
    });
    
    // Back button functionality
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.hash = '';
        });
    }
});
