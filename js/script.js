document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  const phone = '5598982344038';

  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const text = encodeURIComponent(`Olá, me chamo ${name}.\n\n${message}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  });
});
