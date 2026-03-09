// ============================================================
// BRB Investimentos — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. HEADER — esconder ao rolar para baixo, mostrar ao rolar para cima
  // ============================================================
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', throttle(() => {
    const current = window.pageYOffset;
    if (current <= 10) {
      header.classList.remove('header-hidden');
    } else if (current > lastScroll) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastScroll = current;
  }, 80));


  // ============================================================
  // 2. MENU MOBILE
  // ============================================================
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks     = document.querySelector('.nav-links');
  const menuOverlay  = document.querySelector('.menu-overlay');

  const openMenu = () => {
    navLinks.classList.add('active');
    mobileToggle.classList.add('active');
    menuOverlay.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navLinks.classList.remove('active');
    mobileToggle.classList.remove('active');
    menuOverlay.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', () =>
    navLinks.classList.contains('active') ? closeMenu() : openMenu()
  );

  menuOverlay?.addEventListener('click', closeMenu);

  // Fechar ao clicar em links comuns (não dropdown-toggle)
  document.querySelectorAll('.nav-links a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Dropdown no mobile: toggle por clique
  document.querySelectorAll('.nav-links .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth > 968) return;
      e.preventDefault();
      toggle.closest('.dropdown').classList.toggle('is-open');
    });
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  // ============================================================
  // 3. ROLAGEM SUAVE para âncoras internas
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ============================================================
  // 4. LOGO — recarregar a página
  // ============================================================
  document.querySelector('.logo a')?.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
  });


  // ============================================================
  // 5. BOTÃO — Acesse seus Investimentos
  // ============================================================
  document.querySelector('.account-link')?.addEventListener('click', () => {
    window.open('https://brb.genialinvestimentos.com.br/auth/login', '_blank', 'noopener,noreferrer');
  });


  // ============================================================
  // 6. BOTÃO — Abrir conta grátis (hero CTA)
  // ============================================================
  document.querySelector('.btn-primary')?.addEventListener('click', () => {
    window.open('https://brb.genialinvestimentos.com.br/auth/login', '_blank', 'noopener,noreferrer');
  });


  // ============================================================
  // 7. WHATSAPP — botão flutuante
  // ============================================================
  document.querySelector('.whatsapp-btn')?.addEventListener('click', () => {
    const phone   = '5561999999999';
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre investimentos BRB.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  });


  // ============================================================
  // 8. PORTFÓLIO — troca de conteúdo com fade
  // ============================================================
  const portfolioData = {
    1: {
      titulo:   'Renda Variável',
      descricao: 'A renda variável oferece acesso a ativos com maior potencial de valorização no longo prazo. No portfólio do BRB, essa classe é utilizada de forma estratégica, considerando cenários econômicos, fundamentos das empresas e diversificação, com foco em crescimento consistente e controle de riscos.'
    },
    2: {
      titulo:   'Fundos',
      descricao: 'Os fundos de investimento permitem diversificação imediata com gestão profissional. O BRB oferece acesso a uma ampla grade de fundos, desde multimercados e de renda fixa até fundos de ações e internacionais, atendendo a diferentes perfis de risco e objetivos de retorno.'
    },
    3: {
      titulo:   'Criptoativos',
      descricao: 'Os criptoativos representam uma nova fronteira de diversificação. Com estrutura regulatória e segurança, o BRB disponibiliza exposição ao mercado cripto de forma prática, permitindo ao investidor acessar esse universo sem abrir mão da solidez de uma instituição financeira consolidada.'
    },
    4: {
      titulo:   'Renda Fixa',
      descricao: 'A renda fixa é a base de estabilidade do portfólio, oferecendo previsibilidade e segurança. O BRB trabalha com títulos que buscam preservar o capital, gerar rentabilidade consistente e atuar como elemento de equilíbrio frente às oscilações do mercado.'
    }
  };

  const contentBox   = document.getElementById('content-portifolio');
  const portfolioLis = document.querySelectorAll('.portfolio-list li');

  const renderPortfolio = (id) => {
    const data = portfolioData[id];
    if (!data || !contentBox) return;

    contentBox.classList.add('is-fading');
    setTimeout(() => {
      contentBox.innerHTML = `<h2>${data.titulo}</h2><p>${data.descricao}</p>`;
      contentBox.classList.remove('is-fading');
    }, 280);

    portfolioLis.forEach(li => li.classList.remove('is-active'));
    document.querySelector(`.portfolio-list li[data-id="${id}"]`)?.classList.add('is-active');
  };

  portfolioLis.forEach(li => {
    li.addEventListener('click', () => renderPortfolio(li.dataset.id));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renderPortfolio(li.dataset.id); }
    });
  });


  // ============================================================
  // 9. STAT CARDS — entrada escalonada ao entrar na viewport
  // ============================================================
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 130);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.stat-card').forEach(card => cardObserver.observe(card));


  // ============================================================
  // 10. CONTADOR ANIMADO — stat-numbers
  // ============================================================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = 'true';
      counterObserver.unobserve(entry.target);

      const el       = entry.target;
      const target   = parseInt(el.dataset.target, 10);
      const prefix   = el.dataset.prefix || '';
      const suffix   = el.dataset.suffix || '';
      const duration = 1800;
      const start    = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(2, -10 * progress); // easeOutExpo
        el.textContent = prefix + Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + suffix;
      };

      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));


  console.log('✅ BRB Investimentos — scripts carregados.');
});


// ============================================================
// UTILITÁRIOS
// ============================================================

/** Throttle: no máximo 1 chamada a cada `limit`ms */
function throttle(fn, limit = 100) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

/** Debounce: aguarda `wait`ms de silêncio */
function debounce(fn, wait = 150) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
