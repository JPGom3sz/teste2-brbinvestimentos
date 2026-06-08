(function () {
  'use strict';

  // ── CONFIGURAÇÕES ──────────────────────────────────────────
  const CONFIG = {
    delay:          5000,
    storageKey:     'brb_popup_shown',
    registeredKey:  'brb_popup_done',
    cooldownDays:   5,
    exitIntent:     true,

    
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyO4MrqX8ubabCDvEmixU5HE-fb5zC1WBTb6lt9bfJUQh4WZQoM25MNH07haJF-fFy_/exec',
  };

  // ── ELEMENTOS ─────────────────────────────────────────────
  const overlay = document.getElementById('brb-popup-overlay');
  const form    = document.getElementById('brb-popup-form');
  const closeBtn= document.getElementById('brb-popup-close');
  const formBody= document.getElementById('popup-form-body');
  const success = document.getElementById('popup-success');

  if (!overlay) return;

  // ── CONTROLE DE EXIBIÇÃO ──────────────────────────────────

  function shouldShow() {
    if (localStorage.getItem(CONFIG.registeredKey)) return false;
    const last = localStorage.getItem(CONFIG.storageKey);
    if (!last) return true;
    const diffDays = (Date.now() - parseInt(last, 10)) / (1000 * 60 * 60 * 24);
    return diffDays >= CONFIG.cooldownDays;
  }

  function openPopup() {
    if (!shouldShow()) return;
    overlay.style.display = '';
    overlay.getBoundingClientRect();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    overlay.addEventListener('transitionend', function hide() {
      if (!overlay.classList.contains('is-open')) overlay.style.display = 'none';
      overlay.removeEventListener('transitionend', hide);
    });
    if (!localStorage.getItem(CONFIG.registeredKey)) {
      localStorage.setItem(CONFIG.storageKey, Date.now().toString());
    }
  }

  // ── GATILHOS ──────────────────────────────────────────────

  setTimeout(openPopup, CONFIG.delay);

  if (CONFIG.exitIntent) {
    document.addEventListener('mouseleave', function handler(e) {
      if (e.clientY <= 0) {
        openPopup();
        document.removeEventListener('mouseleave', handler);
      }
    });
  }

  // ── FECHAR ────────────────────────────────────────────────

  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });

  // ── VALIDAÇÃO ─────────────────────────────────────────────

  function showError(inputEl, msgEl, message) {
    inputEl.classList.add('input-error');
    msgEl.textContent = message;
    msgEl.classList.add('show');
  }

  function clearError(inputEl, msgEl) {
    inputEl.classList.remove('input-error');
    msgEl.classList.remove('show');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return phone.replace(/\D/g, '').length >= 10;
  }

  // Máscara de telefone
  const phoneInput = document.getElementById('popup-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').substring(0, 11);
      if (v.length > 6)      v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
      else if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
      else if (v.length > 0) v = '(' + v;
      this.value = v;
    });
  }

  // ── SUBMIT ────────────────────────────────────────────────

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameEl  = document.getElementById('popup-name');
    const emailEl = document.getElementById('popup-email');
    const phoneEl = document.getElementById('popup-phone');
    const lgpdEl  = document.getElementById('popup-lgpd');

    const nameErr  = document.getElementById('popup-name-error');
    const emailErr = document.getElementById('popup-email-error');
    const phoneErr = document.getElementById('popup-phone-error');
    const lgpdErr  = document.getElementById('popup-lgpd-error');

    let valid = true;

    [nameEl, emailEl, phoneEl, lgpdEl].forEach((el, i) => {
      clearError(el, [nameErr, emailErr, phoneErr, lgpdErr][i]);
    });

    if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
      showError(nameEl, nameErr, 'Informe seu nome completo.'); valid = false;
    }
    if (!validateEmail(emailEl.value.trim())) {
      showError(emailEl, emailErr, 'Informe um e-mail válido.'); valid = false;
    }
    if (!validatePhone(phoneEl.value)) {
      showError(phoneEl, phoneErr, 'Informe um telefone válido com DDD.'); valid = false;
    }
    if (!lgpdEl.checked) {
      showError(lgpdEl, lgpdErr, 'Você precisa aceitar a Política de Privacidade.'); valid = false;
    }

    if (!valid) return;

    // Desabilita botão durante envio
    const btn = form.querySelector('.popup-btn-submit');
    const btnOriginalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .7s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Enviando...';

    const lead = {
      origem:   'popup',
      nome:     nameEl.value.trim(),
      email:    emailEl.value.trim().toLowerCase(),
      telefone: phoneEl.value.trim(),
      pagina:   window.location.href,
    };

    try {
      await fetch(CONFIG.SCRIPT_URL, {
        method: 'POST',
        mode:   'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(lead),
      });
    } catch (err) {
      console.warn('[BRB Popup] Erro ao enviar lead:', err);
    }

    // Marca como registrado mesmo se der erro de rede (no-cors não retorna status)
    localStorage.setItem(CONFIG.registeredKey, '1');

    formBody.style.display = 'none';
    success.classList.add('show');

    setTimeout(closePopup, 4000);
  });

})();
