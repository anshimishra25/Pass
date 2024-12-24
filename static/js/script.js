document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const progressBar = document.querySelector('.progress-bar');
    const strengthText = document.getElementById('strengthText');
    const feedbackList = document.querySelector('#feedback ul');
    const toggleButton = document.getElementById('togglePassword');

    // Function to update the progress bar color
    function updateProgressBarColor(percentage) {
        let color;
        if (percentage >= 80) {
            color = '#28a745'; // green
        } else if (percentage >= 60) {
            color = '#ffc107'; // yellow
        } else {
            color = '#dc3545'; // red
        }
        progressBar.style.backgroundColor = color;
    }

    // Toggle password visibility
    toggleButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });

    // Check password strength on input
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            progressBar.style.width = '0%';
            strengthText.textContent = 'Not Checked';
            feedbackList.innerHTML = '';
            return;
        }

        // Send password to backend for checking
        fetch('/check_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        })
        .then(response => response.json())
        .then(data => {
            // Update progress bar
            progressBar.style.width = data.percentage + '%';
            updateProgressBarColor(data.percentage);

            // Update strength text
            strengthText.textContent = data.strength;

            // Update feedback list
            feedbackList.innerHTML = '';
            data.feedback.forEach(feedback => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `<i class="fas fa-${feedback.includes('Should') ? 'times text-danger' : 'check text-success'}"></i> ${feedback}`;
                feedbackList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
