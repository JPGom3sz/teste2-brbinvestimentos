(function () {
  'use strict';

  // ── CONFIGURAÇÕES ──────────────────────────────────────────
  const CONFIG = {
    storageKey:    'brb_cookie_consent',
    policyVersion: '1.0',
    SCRIPT_URL:    'https://script.google.com/macros/s/AKfycbyhamccNtTehcppCBej2bJHyBRBUaMnDC0PWgjkxQmoqxQTw_PpVyNrn6zVtwfaLycc/exec',
  };

  // ── ELEMENTOS ─────────────────────────────────────────────
  const banner     = document.getElementById('brb-cookie-banner');
  const btnAccept  = document.getElementById('brb-cookie-accept');
  const btnReject  = document.getElementById('brb-cookie-reject');

  if (!banner) return;

  // ── JÁ CONSENTIU? ─────────────────────────────────────────
  function hasConsent() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (!saved) return false;
      const data = JSON.parse(saved);
      // Se a versão da política mudou, pede consentimento novamente
      return data.version === CONFIG.policyVersion;
    } catch {
      return false;
    }
  }

  // ── ABRIR / FECHAR ────────────────────────────────────────
  function openBanner() {
    banner.style.display = 'block';
    banner.getBoundingClientRect(); // força reflow para a transição funcionar
    banner.classList.add('is-open');
  }

  function closeBanner() {
    banner.classList.remove('is-open');
    banner.addEventListener('transitionend', function hide() {
      banner.style.display = 'none';
      banner.removeEventListener('transitionend', hide);
    });
  }

  // ── BUSCAR IP PÚBLICO ─────────────────────────────────────
  async function getIP() {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip || 'desconhecido';
    } catch {
      return 'desconhecido';
    }
  }

  // ── REGISTRAR NO GOOGLE SHEETS ────────────────────────────
  async function registerConsent(decisao, categorias) {
    const ip = await getIP();

    const payload = {
      origem:         'cookies',
      dataHora:       new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      ip:             ip,
      decisao:        decisao,          // 'aceito' ou 'recusado'
      categorias:     categorias,       // ex: 'necessários, analíticos, marketing'
      versaoPolitica: CONFIG.policyVersion,
      pagina:         window.location.href,
    };

    try {
      await fetch(CONFIG.SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('[BRB Cookies] Erro ao registrar consentimento:', err);
    }
  }

  // ── SALVAR LOCALMENTE ─────────────────────────────────────
  function saveConsent(decisao, categorias) {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify({
      decisao:    decisao,
      categorias: categorias,
      version:    CONFIG.policyVersion,
      timestamp:  Date.now(),
    }));
  }

  // ── CATEGORIAS SELECIONADAS ───────────────────────────────
  function getSelectedCategories() {
    const checks = banner.querySelectorAll('.cookie-cat input[type="checkbox"]');
    const selected = [];
    checks.forEach(function (el) {
      if (el.checked) selected.push(el.value);
    });
    return selected.join(', ');
  }

  // ── ACEITAR ───────────────────────────────────────────────
  btnAccept.addEventListener('click', async function () {
    // Marca todas as categorias como aceitas
    banner.querySelectorAll('.cookie-cat input[type="checkbox"]').forEach(function (el) {
      el.checked = true;
    });

    const categorias = getSelectedCategories();
    saveConsent('aceito', categorias);
    closeBanner();
    await registerConsent('aceito', categorias);
  });

  // ── RECUSAR ───────────────────────────────────────────────
  btnReject.addEventListener('click', async function () {
    // Mantém apenas necessários
    banner.querySelectorAll('.cookie-cat input[type="checkbox"]').forEach(function (el) {
      if (!el.disabled) el.checked = false;
    });

    const categorias = 'necessários';
    saveConsent('recusado', categorias);
    closeBanner();
    await registerConsent('recusado', categorias);
  });

  // ── INICIALIZAR ───────────────────────────────────────────
  if (!hasConsent()) {
    // Pequeno delay para não competir com outros elementos ao carregar
    setTimeout(openBanner, 4000);
  }

})();
