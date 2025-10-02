// LAB11 temporary handler: prevent page reload
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-favorite-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Form submitted! JavaScript will handle this in LAB12.');
    console.log('Form data will be processed in LAB12.');
  });
});
