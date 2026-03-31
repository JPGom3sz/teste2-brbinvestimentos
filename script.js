// ============================================================
// BRB Investimentos — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // HEADER — esconder ao rolar para baixo, mostrar ao subir
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
  // MENU MOBILE
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

  // Fechar ao clicar em links finais de navegação.
  // Exclui: dropdown-toggle (abre dropdown) e has-submenu > a (abre submenu)
  document.querySelectorAll('.nav-links a:not(.dropdown-toggle):not(.has-submenu > a)').forEach(link => {
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

  // Submenu mobile: toggle por clique nos itens has-submenu
  document.querySelectorAll('.nav-links .has-submenu > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 968) return;
      e.preventDefault();
      e.stopPropagation();
      link.closest('.has-submenu').classList.toggle('is-open');
    });
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  // ============================================================
  // ROLAGEM SUAVE para âncoras internas
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
  // LOGO — redireciona para index
  // ============================================================
  document.querySelector('.logo a')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'index.html';
  });


  // ============================================================
  // BOTÃO — Acesse seus Investimentos
  // ============================================================
  document.querySelector('.account-link')?.addEventListener('click', () => {
    window.open('https://brb.genialinvestimentos.com.br/auth/login', '_blank', 'noopener,noreferrer');
  });


  // ============================================================
  // BOTÃO — Abrir conta (hero CTA)
  // ============================================================
  document.querySelector('.btn-primary[data-cta="open-account"]')?.addEventListener('click', () => {
    window.open('index.html#app-download', '_blank', 'noopener,noreferrer');
  });


  // ============================================================
  // PORTFÓLIO — troca de conteúdo com fade
  // ============================================================
  // ============================================================
  // PORTFÓLIO — troca de conteúdo com fade
  // ============================================================
  const portfolioData = {
    default: {
      titulo:    'Conheça nossos produtos',
      descricao: 'O portfólio da BRB Investimentos é estruturado para atender diferentes perfis e objetivos financeiros, combinando segurança, diversificação e potencial de crescimento. A estratégia busca equilíbrio entre ativos de renda fixa e renda variável, permitindo ao investidor acessar oportunidades em diferentes mercados, sempre com gestão responsável e alinhada às melhores práticas do mercado financeiro.',
    },
    1: {
      titulo:    'Renda Fixa',
      descricao: 'Os produtos de renda fixa da BRB Investimentos oferecem segurança e previsibilidade de retorno, ideais para investidores que buscam preservação de capital e rendimento consistente. Inclui CDBs, LCIs, LCAs, Tesouro Direto e debêntures, com diferentes prazos e rentabilidades para atender ao seu perfil.',
    },
    2: {
      titulo:    'Renda Variável',
      descricao: 'Os produtos de renda variável da BRB Investimentos incluem ações de empresas listadas, fundos de investimento em ações (FIAs), fundos multimercado e ETFs. Esses instrumentos permitem ao investidor participar do desempenho de diferentes setores da economia, com potencial de valorização no longo prazo e recebimento de proventos, como dividendos.',
    },
    3: {
      titulo:    'Fundos',
      descricao: 'Os fundos de investimento oferecem diversificação imediata com gestão profissional, permitindo ao investidor acessar uma variedade de estratégias de forma prática. A BRB Investimentos disponibiliza uma ampla gama de fundos, incluindo multimercados, renda fixa, ações e internacionais, atendendo a diferentes perfis de risco e objetivos de retorno.',
    },
    4: {
      titulo:    'Previdência',
      descricao: 'Os planos de previdência da BRB Investimentos são voltados para o planejamento financeiro de longo prazo, auxiliando na construção de uma aposentadoria mais segura. Com opções como PGBL e VGBL, esses produtos oferecem benefícios fiscais e flexibilidade de contribuições, adaptando-se a diferentes perfis de investidores.',
    },
    5: {
      titulo:    'Criptoativos',
      descricao: 'Em breve...',}
  };
  

  const contentBox   = document.getElementById('content-portifolio');
  const portfolioLis = document.querySelectorAll('.portfolio-list li');

  const renderPortfolio = (id = 'default') => {
    const data = portfolioData[id];
    if (!data || !contentBox) return;

    contentBox.classList.add('is-fading');
    setTimeout(() => {
      contentBox.innerHTML = `<h2>${data.titulo}</h2><p>${data.descricao}</p>`;
      contentBox.classList.remove('is-fading');
    }, 280);

    portfolioLis.forEach(li => li.classList.remove('is-active'));
    if (id !== 'default') {
      document.querySelector(`.portfolio-list li[data-id="${id}"]`)?.classList.add('is-active');
    }
  };

  renderPortfolio();

  portfolioLis.forEach(li => {
    li.addEventListener('click', () => renderPortfolio(li.dataset.id));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        renderPortfolio(li.dataset.id);
      }
    });
  });


  // ============================================================
  // STAT CARDS — entrada escalonada ao entrar na viewport
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
  // CONTADOR ANIMADO — stat-numbers
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


  // ============================================================
  // HERO CAROUSEL
  // ============================================================
  const track   = document.getElementById('carouselTrack');
  const slides  = track ? track.querySelectorAll('.carousel-slide') : [];
  const dots    = document.querySelectorAll('.cdot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let current = 0;
  let autoplayTimer;

  const goTo = (index) => {
    if (!track || slides.length === 0) return;
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  };

  const startAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), 5000);
  };

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); startAutoplay(); });
  });

  // Swipe no mobile
  const wrapper = document.querySelector('.carousel-track-wrapper');
  if (wrapper) {
    let startX = 0;
    wrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAutoplay(); }
    }, { passive: true });
  }

  if (slides.length > 0) startAutoplay();

  console.log('BRB Investimentos — scripts carregados.');
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
