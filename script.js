// Toggle del menú móvil
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
    }

    // Lógica del formulario
    const form = document.getElementById('appointment-form');
    if (form) {
        const submitBtn = document.getElementById('submit-btn');
        const SCRIPT_URL = "https://script.google.com/macros/s/TU_SCRIPT_ID/exec"; 

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Enviando...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

            const formData = new FormData(form);
            const urlEncodedData = new URLSearchParams(formData).toString();

            fetch(SCRIPT_URL, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData 
            })
            .then(response => {
                showToast("¡Cita agendada! Tus datos se han guardado.");
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                showToast("Revisa la consola. Asegúrate de haber puesto tu URL de Apps Script real.", true);
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            });
        });
    }

    // Restringir la fecha del formulario para que sea de hoy en adelante
    const dateInput = document.getElementById('fecha');
    if(dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Pre-seleccionar servicio si viene en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const servicioParam = urlParams.get('servicio');
    if (servicioParam) {
        const selectElement = document.getElementById('servicio');
        if (selectElement) {
            selectElement.value = servicioParam;
        }
    }
});

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    
    if (isError) {
        toast.classList.add('error');
        toast.querySelector('i').className = 'fa-solid fa-circle-exclamation mr-2';
    } else {
        toast.classList.remove('error');
        toast.querySelector('i').className = 'fa-solid fa-circle-check mr-2';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
