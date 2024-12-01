// Helper functions to store and retrieve employee data
function saveEmployeeData(data) {
    localStorage.setItem('employeeData', JSON.stringify(data));
}

function getEmployeeData() {
    const storedData = localStorage.getItem('employeeData');
    return storedData ? JSON.parse(storedData) : null;
}

// Registration functionality
document.getElementById('registration-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateInputs()) return;

    const employeeData = {
        employeeId: 'EMP' + Math.floor(1000 + Math.random() * 9000),
        firstName: document.getElementById('first-name').value.trim(),
        lastName: document.getElementById('last-name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim(),
        contactNumber: document.getElementById('contact-number').value.trim(),
    };

    saveEmployeeData(employeeData);
    
    alert(`Registration successful! Your Employee ID is: ${employeeData.employeeId}`);
    window.location.href = 'employee-login.html';
});

// Login functionality
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const employeeId = document.getElementById('emp-id').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const employeeData = getEmployeeData();

    if (employeeData && employeeData.employeeId == employeeId && employeeData.password === password) {
        alert('Login successful!');
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid Employee ID or Password');
    }
});

// Input validation
function validateInputs() {
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(span => span.textContent = '');

    const email = document.getElementById('email').value.trim();
    const contactNumber = document.getElementById('contact-number').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid email format';
        isValid = false;
    }

    if (!/^[6-9]\d{9}$/.test(contactNumber)) {
        document.getElementById('contact-error').textContent = 'Invalid contact number';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
        isValid = false;
    }

    return isValid;
}

// Profile functionality
if (window.location.pathname.endsWith('profile.html')) {
    const employeeData = getEmployeeData();
    if (!employeeData) {
        alert('No profile found');
        window.location.href = 'employee-registration.html';
    } else {
        const profileDetails = document.getElementById('profile-details');
        const profileImg = document.getElementById('profile-img');
        const uploadImageInput = document.getElementById('upload-image');

        // Set the default or saved profile image
        profileImg.src = employeeData.profileImage || 'default-profile.png'; // default image if none saved

        // Listen for image file input
        uploadImageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    profileImg.src = reader.result;  // Display uploaded image
                    employeeData.profileImage = reader.result;  // Save base64 string in employee data
                };
                reader.readAsDataURL(file); // Convert the image file to base64 string
            }
        });

        // Show employee info
        const profileInfo = document.getElementById('profile-info');
        profileInfo.innerHTML = `
            <p><strong>Employee ID:</strong> ${employeeData.employeeId}</p>
            <p><strong>Name:</strong> ${employeeData.firstName} ${employeeData.lastName}</p>
            <p><strong>Email:</strong> <input type="text" id="edit-email" value="${employeeData.email}"></p>
            <p><strong>Phone:</strong> <input type="text" id="edit-phone" value="${employeeData.contactNumber}"></p>
        `;

        // Save profile updates
        document.getElementById('save-profile').addEventListener('click', () => {
            employeeData.email = document.getElementById('edit-email').value;
            employeeData.contactNumber = document.getElementById('edit-phone').value;
            saveEmployeeData(employeeData);
            alert('Profile updated successfully!');
        });

        // Delete profile
        document.getElementById('delete-profile').addEventListener('click', () => {
            localStorage.removeItem('employeeData');
            alert('Profile deleted successfully!');
            window.location.href = 'employee-registration.html';
        });
    }
}
