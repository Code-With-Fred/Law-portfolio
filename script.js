
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('textCont');

  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const statusMessage = document.getElementById('statusMessage');

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = 'Enter a valid email.';
      return false;
    } else {
      emailError.textContent = '';
      return true;
    }
  };

  const validateMessage = () => {
    if (messageInput.value.trim() === '') {
      messageError.textContent = 'Message cannot be empty.';
      return false;
    } else {
      messageError.textContent = '';
      return true;
    }
  };

  const enableSubmit = () => {
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();
    submitBtn.disabled = !(isEmailValid && isMessageValid);
  };

  emailInput.addEventListener('input', enableSubmit);
  messageInput.addEventListener('input', enableSubmit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = {
      email: emailInput.value,
      message: messageInput.value
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

      statusMessage.style.display = 'block';
      if (response.ok) {
        statusMessage.className = 'success';
        statusMessage.textContent = 'Email sent!';
        form.reset();
      } else {
        statusMessage.className = 'failure';
        statusMessage.textContent = data.message || 'Failed to send email.';
      }
    } catch (err) {
      console.error('Frontend error:', err);
      statusMessage.className = 'failure';
      statusMessage.textContent = 'Client error.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
      enableSubmit();
      setTimeout(() => {
        statusMessage.style.display = 'none';
      }, 5000);
    }
  });

  enableSubmit();
});
