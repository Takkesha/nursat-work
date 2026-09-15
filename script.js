document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Mobile nav ---------- */
    const burgerBtn = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');

    burgerBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        burgerBtn.classList.toggle('open', isOpen);
        burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            burgerBtn.classList.remove('open');
            burgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    /* ---------- Configurator ---------- */
    const colorOptions = document.getElementById('colorOptions');
    const selectedColorLabel = document.getElementById('selectedColorLabel');
    const storageOptions = document.getElementById('storageOptions');
    const configPrice = document.getElementById('configPrice');
    const colorOverlay = document.getElementById('colorOverlay');

    let state = {
        color: colorOptions.querySelector('.selected').dataset.color,
        storage: storageOptions.querySelector('.selected').dataset.storage,
        price: Number(storageOptions.querySelector('.selected').dataset.price)
    };

    function updatePriceDisplay() {
        configPrice.textContent = '$' + state.price;
    }

    colorOptions.addEventListener('click', (e) => {
        const btn = e.target.closest('.color-swatch');
        if (!btn) return;
        colorOptions.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
        state.color = btn.dataset.color;
        selectedColorLabel.textContent = state.color;

        // Меняем цвет наложения на превью телефона — берём тот же цвет,
        // что задан у свотча через inline style.background
        colorOverlay.style.background = getComputedStyle(btn).backgroundColor;
    });

    storageOptions.addEventListener('click', (e) => {
        const btn = e.target.closest('.storage-option');
        if (!btn) return;
        storageOptions.querySelectorAll('.storage-option').forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
        state.storage = btn.dataset.storage;
        state.price = Number(btn.dataset.price);
        updatePriceDisplay();
    });

    /* ---------- Hero CTA: smooth scroll to configurator ---------- */
    document.getElementById('heroPreorderLink').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('buy').scrollIntoView({ behavior: 'smooth' });
    });

    /* ---------- Modal (custom pre-order form) ---------- */
    const orderModal = document.getElementById('orderModal');
    const openOrderModal = document.getElementById('openOrderModal');
    const closeOrderModal = document.getElementById('closeOrderModal');
    const modalConfigSummary = document.getElementById('modalConfigSummary');
    const orderForm = document.getElementById('orderForm');
    const modalSuccess = document.getElementById('modalSuccess');
    const modalSuccessDetail = document.getElementById('modalSuccessDetail');

    function openModal() {
        modalConfigSummary.textContent = `${state.color} · ${state.storage} · $${state.price}`;
        orderModal.classList.add('open');
        orderForm.style.display = 'flex';
        modalSuccess.classList.remove('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        orderModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    openOrderModal.addEventListener('click', openModal);
    closeOrderModal.addEventListener('click', closeModal);
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && orderModal.classList.contains('open')) closeModal();
    });

    /* ---------- Form validation ---------- */
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');

    function setError(input, errorEl, message) {
        errorEl.textContent = message;
        input.classList.toggle('invalid', Boolean(message));
    }

    function validateName() {
        const value = nameInput.value.trim();
        if (value.length < 2) {
            setError(nameInput, nameError, 'Введите имя (мин. 2 символа)');
            return false;
        }
        setError(nameInput, nameError, '');
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(value)) {
            setError(emailInput, emailError, 'Введите корректный email');
            return false;
        }
        setError(emailInput, emailError, '');
        return true;
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
            setError(phoneInput, phoneError, 'Введите корректный номер телефона');
            return false;
        }
        setError(phoneInput, phoneError, '');
        return true;
    }

    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();

        if (!isNameValid || !isEmailValid || !isPhoneValid) return;

        // Здесь в реальном проекте был бы fetch() на сервер / Formspree / EmailJS
        const order = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            color: state.color,
            storage: state.storage,
            price: state.price
        };
        console.log('New order:', order);

        orderForm.style.display = 'none';
        modalSuccess.classList.add('open');
        modalSuccessDetail.textContent = `${order.color} · ${order.storage} · $${order.price} отправится на ${order.email}`;

        orderForm.reset();
        setError(nameInput, nameError, '');
        setError(emailInput, emailError, '');
        setError(phoneInput, phoneError, '');
    });

    updatePriceDisplay();
});
