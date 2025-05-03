document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('textCont');
  
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Email validation
  const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
          emailError.textContent = 'Please enter a valid email address.';
          return false;
      } else {
          emailError.textContent = '';
          return true;
      }
  };

  // Message validation
  const validateMessage = () => {
      if (messageInput.value.trim() === '') {
          messageError.textContent = 'Message cannot be empty.';
          return false;
      } else {
          messageError.textContent = '';
          return true;
      }
  };

  // Enable/disable submit button based on validation
  const enableSubmit = () => {
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();
      submitBtn.disabled = !(isEmailValid && isMessageValid);
  };

  // Listen to input events on email and message fields
  emailInput.addEventListener('input', enableSubmit);
  messageInput.addEventListener('input', enableSubmit);

  // Form submission event handler
  form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent default form submission

      const formData = {
          email: emailInput.value,
          message: messageInput.value,
      };

      try {
          const response = await fetch('http://localhost:3000/send-email', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });

          const data = await response.json();

          if (response.ok) {
              alert('Email sent successfully!');
          } else {
              alert(data.message || 'Failed to send email');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('Error sending email.');
      }
  });

  // Initialize submit button state
  enableSubmit();
});
