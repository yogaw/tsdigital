document.addEventListener('DOMContentLoaded', function() {
    // Skip splash screen entirely
    document.getElementById('auth-screen').classList.add('active');
    
    // Auth tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            btn.classList.add('active');
            
            // Hide all forms
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            
            // Show selected form
            const formId = btn.getAttribute('data-tab') + '-form';
            document.getElementById(formId).classList.add('active');
            
            // Reset form state when switching tabs
            if (formId === 'login-form') {
                resetLoginForm();
            } else if (formId === 'signup-form') {
                resetSignupForm();
            }
        });
    });

    // Function to reset login form to initial state
    function resetLoginForm() {
        document.querySelector('.otp-section').classList.add('hidden');
        document.querySelector('.password-section').classList.add('hidden');
        document.getElementById('request-otp-btn').style.display = 'block';
        document.getElementById('phone').value = '';
        document.getElementById('password').value = '';
        document.querySelectorAll('.otp-input').forEach(input => input.value = '');
        document.getElementById('toggle-auth').textContent = 'Password';
    }
    
    // Function to reset signup form to initial state
    function resetSignupForm() {
        document.querySelector('.signup-otp-section').classList.add('hidden');
        document.getElementById('signup-request-otp-btn').style.display = 'block';
        document.getElementById('signup-phone').value = '';
        document.getElementById('name').value = '';
        document.querySelectorAll('.signup-otp-section .otp-input').forEach(input => input.value = '');
    }

    // Initialize forms to ensure proper state on page load
    resetLoginForm();
    resetSignupForm();

    // Toggle between OTP and Password login
    const toggleAuth = document.getElementById('toggle-auth');
    toggleAuth.addEventListener('click', () => {
        const otpSection = document.querySelector('.otp-section');
        const passwordSection = document.querySelector('.password-section');
        const requestOtpBtn = document.getElementById('request-otp-btn');
        
        if (toggleAuth.textContent === 'Password') {
            // Switch to Password
            otpSection.classList.add('hidden');
            passwordSection.classList.remove('hidden');
            requestOtpBtn.style.display = 'none';
            toggleAuth.textContent = 'OTP';
        } else {
            // Switch to OTP
            passwordSection.classList.add('hidden');
            otpSection.classList.add('hidden'); // Always hide OTP section when switching back
            requestOtpBtn.style.display = 'block';
            toggleAuth.textContent = 'Password';
        }
    });

    // Request OTP button
    const requestOtpBtn = document.getElementById('request-otp-btn');
    requestOtpBtn.addEventListener('click', () => {
        const phone = document.getElementById('phone').value;
        if (phone) {
            document.querySelector('.otp-section').classList.remove('hidden');
            requestOtpBtn.style.display = 'none';
            // Focus on first OTP input
            document.querySelector('.otp-input').focus();
            
            // Simulate OTP sent
            alert('OTP sent to ' + phone);
        } else {
            alert('Please enter your phone number');
        }
    });

    // Signup Request OTP button
    const signupRequestOtpBtn = document.getElementById('signup-request-otp-btn');
    signupRequestOtpBtn.addEventListener('click', () => {
        const phone = document.getElementById('signup-phone').value;
        const name = document.getElementById('name').value;
        
        if (phone && name) {
            document.querySelector('.signup-otp-section').classList.remove('hidden');
            signupRequestOtpBtn.style.display = 'none';
            // Focus on first OTP input in signup form
            document.querySelector('.signup-otp-section .otp-input').focus();
            
            // Simulate OTP sent
            alert('OTP sent to ' + phone);
        } else {
            alert('Please enter your phone number and full name');
        }
    });

    // OTP input handling
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value) {
                // Move to next input
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value) {
                // Move to previous input on backspace
                if (index > 0) {
                    otpInputs[index - 1].focus();
                }
            }
        });
    });

    // Verify OTP button
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    verifyOtpBtn.addEventListener('click', () => {
        // Simulate successful login
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        document.querySelector('.bottom-nav').style.display = 'flex';
    });

    // Login with password
    const loginPasswordBtn = document.getElementById('login-password-btn');
    loginPasswordBtn.addEventListener('click', () => {
        const password = document.getElementById('password').value;
        if (password) {
            // Simulate successful login
            document.getElementById('auth-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            document.querySelector('.bottom-nav').style.display = 'flex';
        } else {
            alert('Please enter your password');
        }
    });

    // Bottom navigation
    const navItems = document.querySelectorAll('.bottom-nav .nav-item:not(a)');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.bottom-nav .nav-item').forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Hide all screens
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Show selected screen
            const screenId = item.getAttribute('data-screen');
            document.getElementById(screenId).classList.add('active');
        });
    });

    // Back buttons
    const backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Go back to dashboard
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById('dashboard-screen').classList.add('active');
            
            // Update nav active state
            document.querySelectorAll('.bottom-nav .nav-item').forEach(i => i.classList.remove('active'));
            document.querySelector('[data-screen="dashboard-screen"]').classList.add('active');
        });
    });

    // Profile button in header
    const profileBtn = document.querySelector('#header-profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            // Navigate to profile page
            window.location.href = 'profile.html';
        });
    }

    // Book now button in beauty journey card
    const bookNowBtn = document.querySelector('.recommendation .primary-btn');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', () => {
            alert('Booking flow would start here');
        });
    }

    // Initially hide bottom nav until logged in
    document.querySelector('.bottom-nav').style.display = 'none';
});