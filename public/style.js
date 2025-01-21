document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");
    const passwordHint = document.getElementById("password-hint");
    const matchHint = document.getElementById("match-hint");
    const submitButton = document.getElementById("submit");

    // Hide hints initially
    passwordHint.style.display = "none";
    matchHint.style.display = "none";

    function validatePassword() {
        if (passwordInput.value.length >= 8) {
            passwordHint.textContent = "Password is valid";
            passwordHint.style.color = "green";
            passwordHint.style.display = "block";
        } else {
            passwordHint.textContent = "Enter a password longer than 8 characters";
            passwordHint.style.color = "red";
            passwordHint.style.display = "block";
        }
        enableSubmitEvent();
    }

    function validatePasswordMatch() {
        if (passwordInput.value === confirmPasswordInput.value) {
            matchHint.textContent = "Passwords match";
            matchHint.style.color = "green";
            matchHint.style.display = "block";
        } else {
            matchHint.textContent = "Your passwords do not match";
            matchHint.style.color = "red";
            matchHint.style.display = "block";
        }
        enableSubmitEvent();
    }

    function enableSubmitEvent() {
        submitButton.disabled = !canSubmit();
    }

    function canSubmit() {
        return passwordInput.value.length >= 8 && passwordInput.value === confirmPasswordInput.value;
    }

    passwordInput.addEventListener("focus", validatePassword);
    passwordInput.addEventListener("keyup", validatePassword);
    passwordInput.addEventListener("keyup", validatePasswordMatch);
    confirmPasswordInput.addEventListener("focus", validatePasswordMatch);
    confirmPasswordInput.addEventListener("keyup", validatePasswordMatch);

    document.querySelector("form").addEventListener("submit", function(event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });

    function validateForm() {
        const firstName = document.getElementById("firstName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;
        const terms = document.getElementById("terms").checked;

        if (!firstName) {
            alert("Please fill out your first name.");
            return false;
        }
        if (!email) {
            alert("Please fill out your email.");
            return false;
        }
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return false;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return false;
        }
        if (!terms) {
            alert("You must accept the Terms and Conditions.");
            return false;
        }

        return true; // Allow form submission if all validations pass
    }

    enableSubmitEvent();
});
