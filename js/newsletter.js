/* ============================================================
   newsletter.js — BRB Investimentos
   Validação: mínimo 2 checkboxes marcados, privacidade obrigatória
   ============================================================ */

const form      = document.getElementById('newsletterForm');
const submitBtn = document.getElementById('submitBtn');
const success   = document.getElementById('formSuccess');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhamccNtTehcppCBej2bJHyBRBUaMnDC0PWgjkxQmoqxQTw_PpVyNrn6zVtwfaLycc/exec';

/* ---------- helpers de erro inline ---------- */
function showError(el, msg) {
  el.classList.add('field-error');
  let hint = el.parentElement.querySelector('.error-hint');
  if (!hint) {
    hint = document.createElement('span');
    hint.className = 'error-hint';
    el.parentElement.appendChild(hint);
  }
  hint.textContent = msg;
}

function clearError(el) {
  el.classList.remove('field-error');
  const hint = el.parentElement.querySelector('.error-hint');
  if (hint) hint.remove();
}

/* ---------- limpeza ao digitar ---------- */
if (form) {
  form.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => clearError(inp));
    inp.addEventListener('change', () => clearError(inp));
  });

  /* ---------- submit ---------- */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome        = form.querySelector('input[name="nome"]');
    const email       = form.querySelector('input[name="email"]');
    const telefone    = form.querySelector('input[name="telefone"]');
    const privacidade = form.querySelector('input[name="privacidade"]');
    const analises    = form.querySelector('input[name="analises"]');
    const carteiras   = form.querySelector('input[name="carteiras"]');

    let valid = true;

    /* --- e-mail obrigatório e válido --- */
    // Removemos os "else if" para que o código verifique todos os campos de uma vez.
if (!email.value || !email.checkValidity()) {
    showError(email, 'Informe um e-mail válido.');
    valid = false;
} 

if (!nome.value || !nome.checkValidity()){
    showError(nome, 'Informe seu nome.');
    valid = false;
}

// O telefone agora é verificado de forma independente
if (telefone && (!telefone.value || !telefone.checkValidity())) {
    showError(telefone, 'Informe seu telefone.');
    valid = false;
}
    

    /* --- regra dos checkboxes ---
         Mínimo 2 marcados, privacidade OBRIGATÓRIA entre eles.
         Combinações aceitas:
           • privacidade + analises
           • privacidade + carteiras
           • privacidade + analises + carteiras
    ---------------------------------------------------------------- */
    const marcados = [analises.checked, carteiras.checked, privacidade.checked]
      .filter(Boolean).length;

    if (!privacidade.checked) {
      showError(privacidade, 'Você precisa aceitar a política de privacidade.');
      valid = false;
    } else if (marcados < 2) {
      /* privacidade marcada mas nenhum tema — exige ao menos 1 tema */
      showError(analises, 'Selecione ao menos um tema de interesse.');
      valid = false;
    }

    if (!valid) return;

    /* ---------- envio ---------- */
    let temasEscolhidos = [];
    if (analises.checked)  temasEscolhidos.push('Análises BRB');
    if (carteiras.checked) temasEscolhidos.push('Carteiras Recomendadas');

    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span class="btn-spinner"></span>Enviando...';
    submitBtn.disabled  = true;

    const lead = {
      origem:   'newsletter',
      nome:     nome.value.trim(),
      email:    email.value.trim().toLowerCase(),
      telefone: telefone ? telefone.value.trim() : '',
      pagina:   window.location.href,
      temas:    temasEscolhidos.join(' | ')
    };

    try {
      await fetch(SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(lead),
      });
    } catch (err) {
      console.warn('[BRB Newsletter] Erro ao enviar lead:', err);
    }

    form.style.display = 'none';
    success.classList.add('show');
  });

  /* ---------- máscara de telefone ---------- */
  const telInput = form.querySelector('input[name="telefone"]');
  if (telInput) {
    telInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9()\s\-]/g, '');
    });
  }
}
