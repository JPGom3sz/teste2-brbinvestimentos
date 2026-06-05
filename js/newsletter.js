 /* ... (Mantenha os scripts de máscara de telefone, reading progress e scroll reveal que já estavam aí) ... */

  /* Form submit com loading + success INTEGRADO COM A API */
  const form      = document.getElementById('newsletterForm');
  const submitBtn = document.getElementById('submitBtn');
  const success   = document.getElementById('formSuccess');

  // Mesma URL gerada no seu Apps Script
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyO4MrqX8ubabCDvEmixU5HE-fb5zC1WBTb6lt9bfJUQh4WZQoM25MNH07haJF-fFy_/exec';

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      const nome        = form.querySelector('input[name="nome"]');
      const email       = form.querySelector('input[name="email"]');
      const telefone    = form.querySelector('input[name="telefone"]');
      const privacidade = form.querySelector('input[name="privacidade"]');
      
      // Capturando os checkboxes de temas
      const analises  = form.querySelector('input[name="analises"]').checked;
      const carteiras = form.querySelector('input[name="carteiras"]').checked;

      if (!email.value || !email.checkValidity()) {
        email.focus();
        email.style.borderColor = '#ef4444';
        setTimeout(() => email.style.borderColor = '', 2000);
        return;
      }
      if (!privacidade.checked) {
        privacidade.closest('label').style.color = '#ef4444';
        setTimeout(() => privacidade.closest('label').style.color = '', 2000);
        return;
      }

      // Prepara os temas escolhidos para salvar na planilha (opcional)
      let temasEscolhidos = [];
      if(analises) temasEscolhidos.push("Análises BRB");
      if(carteiras) temasEscolhidos.push("Carteiras Recomendadas");

      submitBtn.classList.add('loading');
      submitBtn.innerHTML = 'Enviando...';
      submitBtn.disabled = true; // Evita duplo clique

      // Monta o objeto com a origem específica da newsletter
      const lead = {
        origem:   'newsletter', // <-- Identificador de onde veio!
        nome:     nome.value.trim(),
        email:    email.value.trim().toLowerCase(),
        telefone: telefone ? telefone.value.trim() : '',
        pagina:   window.location.href,
        temas:    temasEscolhidos.join(" | ") // Ex: "Análises BRB | Carteiras Recomendadas"
      };

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode:   'no-cors', 
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(lead),
        });
      } catch (err) {
        console.warn('[BRB Newsletter] Erro ao enviar lead:', err);
      }

      // Exibe a mensagem de sucesso
      form.style.display = 'none';
      success.classList.add('show');
    });

    form.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', () => { inp.style.borderColor = ''; });
    });
  }
