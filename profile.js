document.addEventListener('DOMContentLoaded', function() {
    // Back button functionality
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Save changes button
    const saveBtn = document.querySelector('.primary-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            alert('Profile changes saved!');
        });
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Account settings items
    const settingsItems = document.querySelectorAll('.settings-list li');
    settingsItems.forEach(item => {
        item.addEventListener('click', () => {
            const setting = item.querySelector('span').textContent;
            alert(`${setting} settings would open here`);
        });
    });
});