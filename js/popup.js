(function () {
  'use strict';

  // ── CONFIGURAÇÕES ──────────────────────────────────────────
  const CONFIG = {
    delay:          5000,              // ms após carregamento para abrir (5s)
    storageKey:     'brb_popup_shown', // chave para quem só fechou
    registeredKey:  'brb_popup_done',  // chave para quem enviou (permanente)
    cooldownDays:   5,                 // dias de espera para quem fechou sem enviar (5 dias)
    exitIntent:     true,              // ativar exit-intent no desktop
  };

  // ── ELEMENTOS ─────────────────────────────────────────────
  const overlay = document.getElementById('brb-popup-overlay');
  const form    = document.getElementById('brb-popup-form');
  const closeBtn= document.getElementById('brb-popup-close');
  const formBody= document.getElementById('popup-form-body');
  const success = document.getElementById('popup-success');

  if (!overlay) return; // sai se o popup não existe na página

  // ── CONTROLE DE EXIBIÇÃO ──────────────────────────────────

  function shouldShow() {
    // 1. Já registrou — nunca mais mostra
    if (localStorage.getItem(CONFIG.registeredKey)) return false;

    // 2. Só fechou — verifica se já passaram os 5 dias
    const last = localStorage.getItem(CONFIG.storageKey);
    if (!last) return true; // Se nunca viu/fechou, mostra.
    
    const diffMs   = Date.now() - parseInt(last, 10);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    return diffDays >= CONFIG.cooldownDays;
  }

  function openPopup() {
    if (!shouldShow()) return;
    overlay.style.display = ''; // remove o display:none inline
    // força reflow para a transição de opacidade funcionar
    overlay.getBoundingClientRect();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    
    // Aguarda a transição terminar antes de esconder de vez
    overlay.addEventListener('transitionend', function hide() {
      if (!overlay.classList.contains('is-open')) {
        overlay.style.display = 'none';
      }
      overlay.removeEventListener('transitionend', hide);
    });

    if (!localStorage.getItem(CONFIG.registeredKey)) {
      localStorage.setItem(CONFIG.storageKey, Date.now().toString());
    }
  }

  // ── GATILHOS ──────────────────────────────────────────────

  // 1. Timer (Abre após 5 segundos)
  setTimeout(openPopup, CONFIG.delay);

  // 2. Exit-intent (mouse deixa a janela pelo topo — desktop)
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

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

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
    // Aceita (11) 99999-9999 ou só dígitos (10-11)
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  // Máscara de telefone
  const phoneInput = document.getElementById('popup-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').substring(0, 11);
      if (v.length > 6) {
        v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
      } else if (v.length > 2) {
        v = '(' + v.slice(0,2) + ') ' + v.slice(2);
      } else if (v.length > 0) {
        v = '(' + v;
      }
      this.value = v;
    });
  }

  // ── SUBMIT ────────────────────────────────────────────────

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameEl    = document.getElementById('popup-name');
    const emailEl   = document.getElementById('popup-email');
    const phoneEl   = document.getElementById('popup-phone');
    const lgpdEl    = document.getElementById('popup-lgpd');

    const nameErr   = document.getElementById('popup-name-error');
    const emailErr  = document.getElementById('popup-email-error');
    const phoneErr  = document.getElementById('popup-phone-error');
    const lgpdErr   = document.getElementById('popup-lgpd-error');

    let valid = true;

    // Limpa erros
    [nameEl, emailEl, phoneEl, lgpdEl].forEach((el, i) => {
      clearError(el, [nameErr, emailErr, phoneErr, lgpdErr][i]);
    });

    if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
      showError(nameEl, nameErr, 'Informe seu nome completo.');
      valid = false;
    }

    if (!validateEmail(emailEl.value.trim())) {
      showError(emailEl, emailErr, 'Informe um e-mail válido.');
      valid = false;
    }

    if (!validatePhone(phoneEl.value)) {
      showError(phoneEl, phoneErr, 'Informe um telefone válido com DDD.');
      valid = false;
    }

    if (!lgpdEl.checked) {
      showError(lgpdEl, lgpdErr, 'Você precisa aceitar a Política de Privacidade.');
      valid = false;
    }

    if (!valid) return;

    // ── ENVIO (HTML puro: apenas salva localmente) ──────────

    const lead = {
      nome:       nameEl.value.trim(),
      email:      emailEl.value.trim(),
      telefone:   phoneEl.value.trim(),
      data:       new Date().toISOString(),
      origem:     window.location.href,
    };

    console.log('[BRB Popup] Lead capturado:', lead);

    // MARCAÇÃO PERMANENTE: Salva que o usuário já se cadastrou (nunca mais vai abrir)
    localStorage.setItem(CONFIG.registeredKey, '1');

    // Mostra sucesso
    formBody.style.display  = 'none';
    success.classList.add('show');

    // Fecha automaticamente após 4s
    setTimeout(closePopup, 4000);
  });

})();