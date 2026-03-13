// ============================================================
// BRB Investimentos — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  //  HEADER — esconder ao rolar para baixo, mostrar ao rolar para cima
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
  //  MENU MOBILE
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
  //  ROLAGEM SUAVE para âncoras internas
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
  //  LOGO — recarregar a página
  // ============================================================
  document.querySelector('.logo a')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'index.html';
});


  // ============================================================
  //  BOTÃO — Acesse seus Investimentos
  // ============================================================
  document.querySelector('.account-link')?.addEventListener('click', () => {
    window.open('https://brb.genialinvestimentos.com.br/auth/login', '_blank', 'noopener,noreferrer');
  });


  // ============================================================
  //  BOTÃO — Abrir conta grátis (hero CTA)
  // ============================================================
  document.querySelector('.btn-primary')?.addEventListener('click', () => {
    window.open('https://brb.genialinvestimentos.com.br/auth/login', '_blank', 'noopener,noreferrer');
  });


  // ============================================================
  //  WHATSAPP — botão flutuante
  // ============================================================
  document.querySelector('.whatsapp-btn')?.addEventListener('click', () => {
    const phone   = '5561999999999';
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre investimentos BRB.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  });


  // ============================================================
  //  PORTFÓLIO — troca de conteúdo com fade
  // ============================================================
  const portfolioData = {
    default: {
      titulo: 'Nosso Portfólio Diversificado',
      descricao: 'O portfólio de investimentos do BRB é estruturado para atender diferentes perfis e objetivos financeiros, combinando segurança, diversificação e potencial de crescimento. A estratégia busca equilíbrio entre ativos de renda fixa e renda variável, permitindo ao investidor acessar oportunidades em diferentes mercados, sempre com gestão responsável e alinhada às melhores práticas do mercado financeiro.',
      botaoTexto: 'Explorar produtos →',
      botaoLink: '#'
    },
    1: {
      titulo: 'Renda Variável',
      descricao: 'A renda variável oferece acesso a ativos com maior potencial de valorização no longo prazo. No portfólio do BRB, essa classe é utilizada de forma estratégica, considerando cenários econômicos, fundamentos das empresas e diversificação, com foco em crescimento consistente e controle de riscos.',
      botaoTexto: 'Ver produtos de Renda Variável →',
      botaoLink: '#'
    },
    2: {
      titulo: 'Fundos',
      descricao: 'Os fundos de investimento permitem diversificação imediata com gestão profissional. O BRB oferece acesso a uma ampla grade de fundos, desde multimercados e de renda fixa até fundos de ações e internacionais, atendendo a diferentes perfis de risco e objetivos de retorno.',
      botaoTexto: 'Ver produtos de Fundos →',
      botaoLink: '#'
    },
    3: {
      titulo: 'Criptoativos',
      descricao: 'Os criptoativos representam uma nova fronteira de diversificação. Com estrutura regulatória e segurança, o BRB disponibiliza exposição ao mercado cripto de forma prática, permitindo ao investidor acessar esse universo sem abrir mão da solidez de uma instituição financeira consolidada.',
      botaoTexto: 'Ver produtos de Criptoativos →',
      botaoLink: '#'
    },
    4: {
      titulo: 'Renda Fixa',
      descricao: 'A renda fixa é a base de estabilidade do portfólio, oferecendo previsibilidade e segurança. O BRB trabalha com títulos que buscam preservar o capital, gerar rentabilidade consistente e atuar como elemento de equilíbrio frente às oscilações do mercado.',
      botaoTexto: 'Ver produtos de Renda Fixa →',
      botaoLink: '#'
    }
  };

  const contentBox   = document.getElementById('content-portifolio');
  const portfolioLis = document.querySelectorAll('.portfolio-list li');

  const renderPortfolio = (id = 'default') => {
    const data = portfolioData[id];
    if (!data || !contentBox) return;

    contentBox.classList.add('is-fading');
    setTimeout(() => {
      contentBox.innerHTML = `
        <h2>${data.titulo}</h2>
        <p>${data.descricao}</p>
        <div class="portfolio-actions">
          <a href="${data.botaoLink}" class="portfolio-btn">${data.botaoTexto}</a>
        </div>
      `;
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
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renderPortfolio(li.dataset.id); }
    });
  });


  // ============================================================
  //  STAT CARDS — entrada escalonada ao entrar na viewport
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
  //  CONTADOR ANIMADO — stat-numbers
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
  //  HERO CAROUSEL
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

  // ============================================================
  //  CARROSSEL DE ASSESSORES — navegação manual com setas
  // ============================================================
  const assessoresTrack = document.getElementById('assessoresTrack');
  const assessorCards = assessoresTrack ? assessoresTrack.querySelectorAll('.assessor-card') : [];
  const assessorPrevBtn = document.querySelector('.assessores-carousel-btn--prev');
  const assessorNextBtn = document.querySelector('.assessores-carousel-btn--next');
  let assessorPage = 0;
  const cardsPerPage = 5;
  const totalPages = Math.ceil(assessorCards.length / cardsPerPage);

  const updateAssessoresCarousel = (pageIndex) => {
    if (!assessoresTrack || assessorCards.length === 0) return;
    
    // Limitar a página
    assessorPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
    
    // Deslocar por página: cada página = 5 cards
    const carouselWidth = assessoresTrack.parentElement.offsetWidth;
    const offsetPixels = assessorPage * carouselWidth;
    assessoresTrack.style.transform = `translateX(-${offsetPixels}px)`;
    
    // Atualizar estado dos botões
    if (assessorPrevBtn) {
      assessorPrevBtn.style.opacity = assessorPage === 0 ? '0.5' : '1';
      assessorPrevBtn.style.cursor = assessorPage === 0 ? 'not-allowed' : 'pointer';
      assessorPrevBtn.style.pointerEvents = assessorPage === 0 ? 'none' : 'auto';
    }
    
    if (assessorNextBtn) {
      const isLastPage = assessorPage >= totalPages - 1;
      assessorNextBtn.style.opacity = isLastPage ? '0.5' : '1';
      assessorNextBtn.style.cursor = isLastPage ? 'not-allowed' : 'pointer';
      assessorNextBtn.style.pointerEvents = isLastPage ? 'none' : 'auto';
    }
  };

  if (assessorPrevBtn) {
    assessorPrevBtn.addEventListener('click', () => {
      if (assessorPage > 0) {
        updateAssessoresCarousel(assessorPage - 1);
      }
    });
  }

  if (assessorNextBtn) {
    assessorNextBtn.addEventListener('click', () => {
      if (assessorPage < totalPages - 1) {
        updateAssessoresCarousel(assessorPage + 1);
      }
    });
  }

  // Inicializar carrossel de assessores
  if (assessorCards.length > 0) {
    updateAssessoresCarousel(0);
  }

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

/** Debounce: aguarda `wait`ms de silêncio */
function debounce(fn, wait = 150) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
