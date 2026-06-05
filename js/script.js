// ============================================================
// BRB Investimentos — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('BRB Investimentos — Iniciando scripts...');

  // Inicialização de Componentes Globais
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initGlobalLinks();
  initPortfolio();
  initStatCards();
  initAnimatedCounters();
  initHeroCarousel();
  initEducationalModals();
  iniciarCotacaoTicker();

  // Inicialização de Lógicas Específicas por Página
  initPageSpecificLogic();
});

// ============================================================
// 1. COMPONENTES GLOBAIS
// ============================================================

/**
 * Controla o comportamento do cabeçalho ao fazer scroll (esconder/mostrar)
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  const ticker = document.getElementById('cotacaoBar');
  
  if (!header) {
    return;
  }

  let lastScroll = 0;
  let scrollDelta = 0;
  const HIDE_THRESHOLD = 80;
  const SHOW_THRESHOLD = 60;
  const TOP_ZONE = 120;

  const showHeader = () => {
    header.classList.remove('header-hidden');
    if (ticker) {
      ticker.classList.remove('ticker-hidden');
    }
  };
  
  const hideHeader = () => {
    header.classList.add('header-hidden');
    if (ticker) {
      ticker.classList.add('ticker-hidden');
    }
  };

  window.addEventListener('scroll', throttle(() => {
    const current = window.pageYOffset;

    // Se estiver no topo da página, mostra sempre o cabeçalho
    if (current < TOP_ZONE) {
      showHeader();
      scrollDelta = 0;
      lastScroll = current;
      return;
    }

    const diff = current - lastScroll;
    scrollDelta += diff;

    // Esconde o cabeçalho ao descer
    if (scrollDelta > HIDE_THRESHOLD) {
      hideHeader();
      scrollDelta = 0;
    } 
    // Mostra o cabeçalho ao subir
    else if (scrollDelta < -SHOW_THRESHOLD) {
      showHeader();
      scrollDelta = 0;
    }

    lastScroll = current;
  }, 60));
}

/**
 * Controla a abertura e fecho do menu em dispositivos móveis
 */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const menuOverlay = document.querySelector('.menu-overlay');

  if (!mobileToggle || !navLinks || !menuOverlay) {
    return;
  }

  const openMenu = () => {
    navLinks.classList.add('active');
    mobileToggle.classList.add('active');
    menuOverlay.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Impede o scroll na página ao abrir o menu
  };

  const closeMenu = () => {
    navLinks.classList.remove('active');
    mobileToggle.classList.remove('active');
    menuOverlay.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuOverlay.addEventListener('click', closeMenu);

  // Lógica de clique para submenus exclusivos no mobile (ex: Fundos)
  document.querySelectorAll('.has-submenu > a').forEach(link => {
    link.addEventListener('click', (e) => {
      // Verifica se está na tela de celular
      if (window.innerWidth <= 968) {
        const submenu = link.nextElementSibling;
        // Se existir um submenu ali, cancela o link e abre a aba
        if (submenu && submenu.classList.contains('submenu')) {
          e.preventDefault(); 
          link.closest('.has-submenu').classList.toggle('is-open');
        }
      }
    });
  });

  // Fecha o menu ao clicar em qualquer link (exceto os que abrem dropdowns e o submenu de Fundos)
  document.querySelectorAll('.nav-links a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', (e) => {
      // Se estiver no celular e o link clicado tiver um submenu, NÃO fecha o menu principal
      if (window.innerWidth <= 968 && link.nextElementSibling && link.nextElementSibling.classList.contains('submenu')) {
        return; 
      }
      // Para todos os outros links normais, fecha o menu
      closeMenu();
    });
  });

  // Lógica de dropdown no mobile
  document.querySelectorAll('.nav-links .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth > 968) {
        return;
      }
      e.preventDefault();
      toggle.closest('.dropdown').classList.toggle('is-open');
    });
  });

  // Fecha o menu com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
}

/**
 * Adiciona o comportamento de scroll suave aos links de âncora
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      if (href === '#') {
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    });
  });
}

/**
 * Lida com redirecionamentos globais, como cliques no logo e botões de conta
 */
function initGlobalLinks() {
  const logoLink = document.querySelector('.logo a');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = logoLink.getAttribute('href');
    });
  }

  const accountLink = document.querySelector('.account-link');
  if (accountLink) {
    accountLink.addEventListener('click', () => {
      window.open('https://brb.genialinvestimentos.com.br/auth/login', '_blank', 'noopener,noreferrer');
    });
  }
}

/**
 * Gere o conteúdo dinâmico da secção de Portefólio (Home)
 */
function initPortfolio() {
  const contentBox     = document.querySelector('#content-portifolio');
  let portfolioLis   = document.querySelectorAll('.portfolio-list li');
 
  if (!contentBox || portfolioLis.length === 0) return;
 
  // ──────────────────────────────────────────────
  // DADOS DOS PRODUTOS (idêntico ao original)
  // ──────────────────────────────────────────────
  const portfolioData = {
    default: {
      titulo   : 'Conheça nossos principais produtos',
      descricao: 'O portfólio da BRB Investimentos é estruturado para atender diferentes perfis e objetivos financeiros, combinando segurança, diversificação e potencial de crescimento. A estratégia busca equilíbrio entre ativos de renda fixa e renda variável, permitindo ao investidor acessar oportunidades em diferentes mercados, sempre com gestão responsável e alinhada às melhores práticas do mercado financeiro.',
      link     : 'https://lp.brbinvestimentos.com.br/perfis-brb-brb01-a/?gcode=GI-CRM-WEB-BRB01-X-CLIENTE-X-X-PON-X-HOTLIST-X&e=null&n=null&t=null&vlp=brb01-lpa'
    },
    1: { titulo: 'Renda Fixa',      descricao: 'Os produtos de renda fixa da BRB Investimentos oferecem segurança e previsibilidade de retorno, ideais para investidores que buscam preservação de capital e rendimento consistente. Inclui CDBs, LCIs, LCAs, Tesouro Direto e debêntures, com diferentes prazos e rentabilidades para atender ao seu perfil.',                                                                                                                                                                               link: 'produtos/renda-fixa.html'       },
    2: { titulo: 'Renda Variável',  descricao: 'Os produtos de renda variável da BRB Investimentos incluem ações de empresas listadas, fundos de investimento em ações (FIAs), fundos multimercado e ETFs. Esses instrumentos permitem ao investidor participar do desempenho de diferentes setores da economia, com potencial de valorização no longo prazo e recebimento de proventos, como dividendos.',                                                                                                                                   link: 'produtos/renda-variavel.html'   },
    3: { titulo: 'Fundos',          descricao: 'Os fundos de investimento oferecem diversificação imediata com gestão profissional, permitindo ao investidor acessar uma variedade de estratégias de forma prática. A BRB Investimentos disponibiliza uma ampla gama de fundos, incluindo multimercados, renda fixa, ações e internacionais, atendendo a diferentes perfis de risco e objetivos de retorno.',                                                                                                                                   link: 'produtos/fundos.html'           },
    4: { titulo: 'Previdência',     descricao: 'Os planos de previdência da BRB Investimentos são voltados para o planejamento financeiro de longo prazo, auxiliando na construção de uma aposentadoria mais segura. Com opções como PGBL e VGBL, esses produtos oferecem benefícios fiscais e flexibilidade de contribuições, adaptando-se a diferentes perfis de investidores.',                                                                                                                                                              link: 'produtos/previdencia.html'      },
    5: { titulo: 'Mercado Futuro',  descricao: 'O mercado de futuros permite aos investidores negociar contratos para a compra ou venda de ativos em uma data futura, com o objetivo de especular sobre as variações de preços ou hedging de riscos. A BRB Investimentos oferece acesso a esse mercado com ferramentas e suporte especializado.',                                                                                                                                                                                               link: 'produtos/mercado-futuro.html'   },
    6: { titulo: 'Tesouro Direto',  descricao: 'O Tesouro Direto é um programa do Tesouro Nacional que permite a compra e venda de títulos públicos diretamente pelo investidor, com rentabilidade vinculada à inflação e prazos variáveis. A BRB Investimentos oferece acesso a esse mercado com suporte especializado.',                                                                                                                                                                                                                      link: 'produtos/tesouro-direto.html'   },
    7: { titulo: 'O que vem por aí', descricao: 'A BRB Investimentos está sempre evoluindo para oferecer o que há de mais moderno no mercado financeiro. Em breve, você terá acesso a uma nova classe de ativos diretamente na nossa plataforma: os Criptoativos.',                                                                                                                                                                                                                                                                            link: null                    },
  };
 
  // Ícones SVG por produto (usados apenas no mobile)
  const portfolioIcons = {
    1: `<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,            // Renda Fixa — escudo
    2: `<svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`, // Renda Variável — trending up
    3: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`, // Fundos — pasta
    4: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,// Previdência — relógio
    5: `<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`, // Mercado Futuro — barras
    6: `<svg viewBox="0 0 24 24"><line x1="3" y1="22" x2="21" y2="22"/><rect x="6" y="2" width="12" height="20" rx="1"/><line x1="10" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="14" y2="6"/><line x1="10" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="14" y2="10"/><line x1="10" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="14" y2="14"/></svg>`, // Tesouro — banco
    7: `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`, // Em breve — estrela
  };
 
  // Textos dos botões secundários (taxa / condições)
  const titulosBotaoSecundario = {
    '1': 'Custos Renda Fixa',
    '2': 'Custos Operacionais',
    '3': 'Taxas de Administração',
    '4': 'Custos e Previdência',
    '5': 'Condições Comerciais',
    '6': 'Taxas do Tesouro Direto'
  };
 
  // ──────────────────────────────────────────────
  // UTILITÁRIO: detecta mobile
  // ──────────────────────────────────────────────
  const isMobile = () => window.innerWidth <= 968;
 
  // ──────────────────────────────────────────────
  // MODO DESKTOP — comportamento original
  // ──────────────────────────────────────────────
  const renderPortfolio = (id = 'default') => {
    const data = portfolioData[id];
    if (!data) return;
 
    const textoBotaoPrincipal = (id === 'default')
      ? 'Faça uma simulação agora'
      : `Saiba mais sobre ${data.titulo}`;
 
    const btnSaibaMais = data.link
      ? `<a href="${data.link}" class="portfolio-cta-btn">${textoBotaoPrincipal} <span aria-hidden="true">→</span></a>`
      : '';
 
    const textoBotaoSecundario = titulosBotaoSecundario[id] || 'Condições Comerciais';
    const btnTaxas = (id !== 'default' && id !== '7')
      ? `<a href="taxas.html" class="portfolio-cta-outline">${textoBotaoSecundario}</a>`
      : '';
 
    const btnHTML = (btnSaibaMais || btnTaxas)
      ? `<div class="portfolio-btns">\n  ${btnSaibaMais}\n  ${btnTaxas}\n</div>`
      : '';
 
    contentBox.classList.add('is-fading');
    setTimeout(() => {
      contentBox.innerHTML = `<h2>${data.titulo}</h2><p>${data.descricao}</p>${btnHTML}`;
      contentBox.classList.remove('is-fading');
    }, 280);
 
    portfolioLis.forEach(li => li.classList.remove('is-active'));
    if (id !== 'default') {
      const activeLi = document.querySelector(`.portfolio-list li[data-id="${id}"]`);
      if (activeLi) activeLi.classList.add('is-active');
    }
  };
 
  // ──────────────────────────────────────────────
  // MODO MOBILE — accordion animado
  // ──────────────────────────────────────────────
 
  /**
   * Injeta a estrutura de accordion dentro de cada <li>.
   * Só é chamado uma vez; a classe .pf-accordion-ready marca o li como pronto.
   */
  const buildAccordion = () => {
    portfolioLis.forEach(li => {
      if (li.classList.contains('pf-accordion-ready')) return;
 
      const id      = li.dataset.id;
      const data    = portfolioData[id];
      const label   = li.textContent.trim();
      const icon    = portfolioIcons[id] || portfolioIcons[1];
      if (!data) return;
 
      // Botões do body
      const btnSaibaMais = data.link
        ? `<a href="${data.link}" class="pf-accordion-cta">Saiba mais <span aria-hidden="true">→</span></a>`
        : `<span class="pf-accordion-cta" style="opacity:.5;cursor:default">Em breve</span>`;
 
      const textoBotaoSecundario = titulosBotaoSecundario[id] || '';
      const btnTaxas = (id !== '7' && textoBotaoSecundario)
        ? `<a href="taxas.html" class="pf-accordion-cta" style="background:transparent;color:var(--primary-blue);border:1.5px solid var(--primary-blue);box-shadow:none;">${textoBotaoSecundario}</a>`
        : '';
 
      // Constrói o HTML interno
      li.innerHTML = `
        <div class="pf-accordion-header" role="button" aria-expanded="false" tabindex="0">
          <span class="pf-accordion-label">
            <span class="pf-accordion-icon">${icon}</span>
            ${label}
          </span>
          <span class="pf-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
        <div class="pf-accordion-body" role="region">
          <div class="pf-accordion-body-inner">
            <h3>${data.titulo}</h3>
            <p>${data.descricao}</p>
            <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.25rem;">
              ${btnSaibaMais}
              ${btnTaxas}
            </div>
          </div>
        </div>
      `;
 
      li.classList.add('pf-accordion-ready');
 
      // Evento de clique no cabeçalho
      const header = li.querySelector('.pf-accordion-header');
      const body   = li.querySelector('.pf-accordion-body');
 
      const openItem = () => {
        li.classList.add('pf-open');
        header.setAttribute('aria-expanded', 'true');
        // Anima via max-height
        body.style.maxHeight = body.scrollHeight + 'px';
      };
 
      const closeItem = () => {
        li.classList.remove('pf-open');
        header.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = '0';
      };
 
      header.addEventListener('click', () => {
        const isOpen = li.classList.contains('pf-open');
 
        // Fecha todos os outros itens
        portfolioLis.forEach(otherLi => {
          if (otherLi !== li && otherLi.classList.contains('pf-open')) {
            otherLi.classList.remove('pf-open');
            const otherHeader = otherLi.querySelector('.pf-accordion-header');
            const otherBody   = otherLi.querySelector('.pf-accordion-body');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            if (otherBody)   otherBody.style.maxHeight = '0';
          }
        });
 
        isOpen ? closeItem() : openItem();
      });
 
      // Suporte a teclado
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  };
 
  /**
   * Remove a estrutura de accordion dos <li> e restaura ao estado original.
   * Chamado quando a janela é redimensionada de mobile para desktop.
   */
  const destroyAccordion = () => {
    portfolioLis.forEach((li, idx) => {
      if (!li.classList.contains('pf-accordion-ready')) return;
      const id    = li.dataset.id;
      const data  = portfolioData[id];
      const label = data ? data.titulo : `Item ${idx + 1}`;
 
      li.innerHTML = label;
      li.classList.remove('pf-accordion-ready', 'pf-open');
      li.style.maxHeight = '';
    });
  };
 
  // ──────────────────────────────────────────────
  // INICIALIZAÇÃO E RESIZE
  // ──────────────────────────────────────────────
 
  let currentlyMobile = isMobile();
 
  const setup = () => {
    if (isMobile()) {
      // Garante que o painel de desktop não mostre lixo no mobile
      contentBox.style.display = 'none';
      buildAccordion();
    } else {
      contentBox.style.display = '';
      // Se voltou do mobile, destrói e reconfigura para desktop
      if (currentlyMobile) {
        destroyAccordion();
        renderPortfolio();
        bindDesktopClicks();
      }
    }
    currentlyMobile = isMobile();
  };
 
  // Eventos de clique para desktop
  const bindDesktopClicks = () => {
    // MODIFICAÇÃO: Removemos listeners antigos clonando o elemento via query direta,
    // sem usar a variável portfolioLis que pode estar desatualizada.
    document.querySelectorAll('.portfolio-list li').forEach(li => {
      const clone = li.cloneNode(true);
      li.parentNode.replaceChild(clone, li);
    });

    // MODIFICAÇÃO IMPORTANTE: Re-seleciona os novos itens do DOM e ATUALIZA a variável
    // portfolioLis, garantindo que o restante do script (como o renderPortfolio)
    // trabalhe com os elementos "vivos" no HTML.
    portfolioLis = document.querySelectorAll('.portfolio-list li'); 
 
    portfolioLis.forEach(li => {
      li.addEventListener('click', () => renderPortfolio(li.dataset.id));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          renderPortfolio(li.dataset.id);
        }
      });
    });
  };
 
  // Inicializa corretamente conforme o viewport atual
  if (isMobile()) {
    contentBox.style.display = 'none';
    buildAccordion();
  } else {
    renderPortfolio();
    bindDesktopClicks();
  }
 
  // Adapta se o utilizador redimensionar a janela (ex: rotação de tablet)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const nowMobile = isMobile();
      if (nowMobile !== currentlyMobile) {
        setup();
      }
    }, 200);
  });
}

/**
 * Animação de entrada (fade-in) para os cartões de estatísticas
 */
function initStatCards() {
  const cards = document.querySelectorAll('.stat-card');
  if (cards.length === 0) return;

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, i * 130);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => cardObserver.observe(card));
}

/**
 * Animação de contagem numérica para as estatísticas
 */
function initAnimatedCounters() {
  const numbers = document.querySelectorAll('.stat-number');
  if (numbers.length === 0) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) {
        return;
      }
      
      entry.target.dataset.counted = 'true';
      counterObserver.unobserve(entry.target);

      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(2, -10 * progress);
        el.textContent = prefix + Math.floor(eased * target) + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target + suffix;
        }
      };

      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  numbers.forEach(el => counterObserver.observe(el));
}

/**
 * Controla o carrossel principal
 */
function initHeroCarousel() {
  const track = document.getElementById('carouselTrack');
  
  if (!track) return;
  
  const slides = track.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;

  const dots = document.querySelectorAll('.cdot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let current = 0;
  let autoplayTimer;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  };

  const startAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      goTo(current + 1);
    }, 5000);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goTo(current - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goTo(current + 1);
      startAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.index));
      startAutoplay();
    });
  });

  // Suporte a gestos touch para mobile
  const wrapper = document.querySelector('.carousel-track-wrapper');
  if (wrapper) {
    let startX = 0;
    
    wrapper.addEventListener('touchstart', e => { 
      startX = e.touches[0].clientX; 
    }, { passive: true });
    
    wrapper.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
        startAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();
}

/**
 * Gere a abertura e fecho das modais de produtos educativos
 */
function initEducationalModals() {
  const overlay = document.getElementById('eduOverlay');
  if (!overlay) return;

  const cards = document.querySelectorAll('.edu-card');
  const closebtns = document.querySelectorAll('.edu-modal__close');
  let activeModal = null;
  let scrollY = 0; // Variável para guardar a posição do scroll

  // Função robusta para travar o scroll fixando o body
  const lockScroll = () => {
    scrollY = window.scrollY; // Salva a posição atual
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    // Adiciona classe de fallback do CSS só por segurança
    document.body.classList.add('travar-rolagem');
  };

  // Função para destravar e devolver a tela pro lugar certo
  const unlockScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('travar-rolagem');
    window.scrollTo(0, scrollY); // Volta exatamente pra onde estava
  };

  function openModal(productKey) {
    document.querySelectorAll('.edu-modal').forEach(m => {
      m.style.display = 'none';
    });
    
    const modal = document.getElementById('modal-' + productKey);
    if (!modal) return;

    modal.style.display = 'block';
    modal.scrollTop = 0;
    activeModal = modal;

    overlay.classList.add('is-open');
    
    // ATENÇÃO AQUI: Chama a função que trava o scroll de verdade
    lockScroll();

    const title = modal.querySelector('.edu-modal__title');
    if (title) {
      title.setAttribute('tabindex', '-1');
      title.focus();
    }
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    
    // ATENÇÃO AQUI: Chama a função que destrava
    unlockScroll();
    
    setTimeout(() => {
      if (activeModal) {
        activeModal.style.display = 'none';
      }
      activeModal = null;
    }, 320);
  }

  cards.forEach(card => {
    const key = card.dataset.modal;
    
    // Prevenindo o default do click para não subir pro topo
    card.addEventListener('click', (e) => {
      e.preventDefault(); 
      openModal(key);
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(key);
      }
    });
  });

  closebtns.forEach(btn => btn.addEventListener('click', closeModal));
  
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });
}

// ============================================================
// 2. FUNÇÕES PARTILHADAS
// ============================================================

function initFAQ() {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      
      document.querySelectorAll('.faq-item.is-open').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) { 
        item.classList.add('is-open'); 
        trigger.setAttribute('aria-expanded', 'true'); 
      }
    });
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => revealObserver.observe(el));
}

function initExpandableProductCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const isExp = card.classList.contains('expanded');
      
      document.querySelectorAll('.product-card.expanded').forEach(c => {
        c.classList.remove('expanded');
      });
      
      if (!isExp) {
        card.classList.add('expanded');
      }
    });
  });
}

function initReadingProgressAndCTA() {
  const bar = document.getElementById('readingBar');
  const floatingCta = document.getElementById('floatingCta');
  
  window.addEventListener('scroll', () => {
    if (bar) {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (scrolled / total * 100) + '%';
    }
    
    if (floatingCta) {
      if (window.scrollY > 600) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }
  });
}

// ============================================================
// 3. LÓGICA ESPECÍFICA POR PÁGINA
// ============================================================

function initPageSpecificLogic() {
  
  // ── FUNÇÕES COMUNS A VÁRIAS PÁGINAS INTERNAS ──
  initFAQ();
  initScrollReveal();
  initExpandableProductCards();
  initReadingProgressAndCTA();

  // ── RENDA VARIÁVEL ──
  if (document.querySelector('.rv-hero')) {
    
    // Filtro de abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        document.querySelectorAll('.product-card').forEach(card => {
          if (tab === 'all') {
            card.style.display = '';
            return;
          }
          const prof = card.dataset.profile || '';
          card.style.display = prof.includes(tab) ? '' : 'none';
        });
      });
    });

    // Ticker Mercado Ao Vivo (AwesomeAPI)
    const setTicker = (id, chgId, value, change) => {
      const el = document.getElementById(id);
      const chgEl = document.getElementById(chgId);
      
      if (el) { 
        el.textContent = value; 
        el.style.animation = 'none'; 
        el.offsetHeight; // Reflow
        el.style.animation = 'numberReveal .4s ease'; 
      }
      
      if (chgEl) {
        chgEl.textContent = change;
        chgEl.className = 'rv-ticker-change ' + (parseFloat(change) >= 0 ? 'up' : 'down');
      }
    };

    const fmtPct = (n) => {
      return (n >= 0 ? '+' : '') + n.toFixed(2).replace('.', ',') + '%';
    };

    async function fetchTickers() {
      try {
        const r = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,BTC-USD,EUR-BRL,XAU-USD');
        const d = await r.json();

        if (d['USDBRL']) {
          const usdValue = `R$ ${parseFloat(d['USDBRL'].bid).toFixed(2).replace('.', ',')}`;
          const usdChange = fmtPct(parseFloat(d['USDBRL'].pctChange));
          setTicker('tk-usd', 'tk-usd-chg', usdValue, usdChange);
        }

        if (d['BTCUSD']) {
          const btcValue = `$ ${Math.round(parseFloat(d['BTCUSD'].bid)).toLocaleString('pt-BR')}`;
          const btcChange = fmtPct(parseFloat(d['BTCUSD'].pctChange));
          setTicker('tk-btc', 'tk-btc-chg', btcValue, btcChange);
        }

        if (d['EURBRL']) {
          const eurValue = `R$ ${parseFloat(d['EURBRL'].bid).toFixed(2).replace('.', ',')}`;
          const eurChange = fmtPct(parseFloat(d['EURBRL'].pctChange));
          setTicker('tk-eur', 'tk-eur-chg', eurValue, eurChange);
        }

        if (d['XAUUSD']) {
          const xauValue = `$ ${parseFloat(d['XAUUSD'].bid).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
          const xauChange = fmtPct(parseFloat(d['XAUUSD'].pctChange));
          setTicker('tk-xau', 'tk-xau-chg', xauValue, xauChange);
        }
      } catch (e) {
        console.warn('Ticker error:', e);
      }
    }
    
    fetchTickers();
    setInterval(fetchTickers, 60000);
  }

  // ── RENDA FIXA ──
  if (document.querySelector('.rf-hero')) {
    document.querySelectorAll('.comparator-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.comparator-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const product = card.dataset.product;
        document.querySelectorAll('.product-card').forEach(p => p.classList.remove('expanded'));
        
        const target = document.getElementById(product);
        if (target) { 
          target.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
          target.classList.add('expanded'); 
        }
      });
    });
  }

  // ── FUNDOS ──
  if (document.querySelector('.fd-hero')) {
    document.querySelectorAll('.fund-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.fund-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        const risk = pill.dataset.risk;
        document.querySelectorAll('.product-card').forEach(card => {
          if (risk === 'all') {
            card.style.display = '';
            return;
          }
          card.style.display = (card.dataset.risk || '').includes(risk) ? '' : 'none';
        });
      });
    });
  }

  // ── PREVIDÊNCIA (Simulador) ──
  if (document.querySelector('.pv-hero')) {
    function calcularSimulador() {
      const aporteEl = document.getElementById('simAporte');
      const anosEl = document.getElementById('simAnos');
      const rentEl = document.getElementById('simRent');

      const aporte = parseFloat(aporteEl?.value) || 500;
      const anos = parseInt(anosEl?.value) || 20;
      const rent = parseFloat(rentEl?.value) / 100 / 12;
      
      if (!document.getElementById('simTotal')) return;

      const meses = anos * 12;
      const total = aporte * ((Math.pow(1 + rent, meses) - 1) / rent);
      const investido = aporte * meses;
      const juros = total - investido;
      
      const fmt = v => 'R$ ' + v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      document.getElementById('simTotal').textContent = fmt(total);
      document.getElementById('simInvestido').textContent = fmt(investido);
      document.getElementById('simJuros').textContent = fmt(juros);
    }
    
    calcularSimulador();
    
    document.querySelectorAll('#simAporte, #simAnos, #simRent').forEach(el => {
      el.addEventListener('input', calcularSimulador);
    });
  }
}

// ============================================================
// 4. TICKER PTAX (Banco Central do Brasil)
// ============================================================

async function iniciarCotacaoTicker() {
  const contentEl = document.getElementById('cotacaoContent');
  if (!contentEl) return;

  const formatarData = (date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const buscarCotacao = async (moeda, nome) => {
    // Tenta procurar a cotação nos últimos 7 dias
    for (let diasAtras = 0; diasAtras <= 7; diasAtras++) {
      const data = new Date();
      data.setDate(data.getDate() - diasAtras);
      const dataFormatada = formatarData(data);

      const url = moeda === 'USD'
        ? `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${dataFormatada}%27&$top=1&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
        : `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda=%27${moeda}%27&@dataCotacao=%27${dataFormatada}%27&$top=1&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;

      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        
        const json = await res.json();
        if (json.value && json.value.length > 0) {
          const item = json.value[0];
          return {
            nome,
            moeda,
            compra: item.cotacaoCompra.toFixed(4).replace('.', ','),
            venda:  item.cotacaoVenda.toFixed(4).replace('.', ','),
            hora:   item.dataHoraCotacao.slice(11, 16),
            data:   dataFormatada,
          };
        }
      } catch (_) {
        // Ignora erros e tenta a data do dia anterior
      }
    }
    return null;
  };

  const renderTicker = (cotacoes) => {
    if (!cotacoes.length) {
      contentEl.innerHTML = '<span class="cotacao-erro">Cotação indisponível no momento.</span>';
      return;
    }

    const itemsHTML = cotacoes.map(c => `
      <span class="cotacao-item">
        <span class="cotacao-item-flag">${c.flag}</span>
        <span class="cotacao-item-name">${c.moeda}/BRL</span>
        <span class="cotacao-item-buy">Compra: <span>R$ ${c.compra}</span></span>
        <span class="cotacao-item-sell">Venda: <span>R$ ${c.venda}</span></span>
        <span class="cotacao-item-time">PTAX ${c.hora}</span>
      </span>
      <span class="cotacao-separator" aria-hidden="true"></span>
    `).join('');

    // Repete os itens várias vezes para garantir que preencham até monitores ultrawide
    const bloco = itemsHTML.repeat(8); 

    // Junta dois blocos gigantes idênticos. 
    // Assim, ao mover -50% (metade do total) no CSS, o loop de reinício fica invisível!
    contentEl.innerHTML = bloco + bloco;
  };

  const atualizarTudo = async () => {
    const [usd, eur] = await Promise.all([
      buscarCotacao('USD', 'Dólar'), 
      buscarCotacao('EUR', 'Euro')
    ]);
    
    const cotacoes = [
      usd ? { ...usd, flag: '🇺🇸' } : null,
      eur ? { ...eur, flag: '🇪🇺' } : null,
    ].filter(Boolean);
    
    renderTicker(cotacoes);
  };

  await atualizarTudo();
  
  // Atualiza as cotações a cada 5 minutos
  setInterval(atualizarTudo, 5 * 60 * 1000);
}

// ============================================================
// 5. UTILITÁRIOS
// ============================================================

/** * Função Throttle: garante no máximo 1 chamada à função a cada `limit` milissegundos.
 * Usado para otimizar eventos como scroll.
 */
function throttle(fn, limit = 100) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { 
        inThrottle = false; 
      }, limit);
    }
  };
}


/**
 * Inicializa a lógica de Accordion nos Cards Inteiros de Fundos
 */
function initFundCardsAccordion() {
  const toggleButtons = document.querySelectorAll('.fund-toggle-btn');
  
  if (toggleButtons.length === 0) return;

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Pega a DIV colapsável logo em seguida do botão do cabeçalho
      const panel = btn.nextElementSibling;
      if (!panel) return;

      const isOpen = btn.classList.contains('is-active');

      // (Opcional) Fecha todos os outros cards abertos
      document.querySelectorAll('.fund-toggle-btn').forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.classList.remove('is-active');
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.classList.remove('is-open');
            otherBtn.nextElementSibling.style.maxHeight = null;
          }
        }
      });

      // Se já estava aberto, fecha. Se não, abre definindo o MaxHeight
      if (isOpen) {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
        panel.style.maxHeight = null;
      } else {
        btn.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        // Usando a altura real do conteúdo para a animação funcionar sem engasgo
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

(function () {
    /* ── Accordion ── */
    const ANIM = 420;
    document.querySelectorAll('.fund-toggle-btn').forEach(btn => {
      const col = document.getElementById(btn.getAttribute('aria-controls'));
      if (!col) return;
      btn.addEventListener('click', () => {
        const open = btn.classList.contains('is-active');
        if (open) {
          col.style.maxHeight = col.scrollHeight + 'px';
          col.getBoundingClientRect();
          col.style.maxHeight = '0px';
          col.classList.remove('is-open');
          btn.classList.remove('is-active');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          col.classList.add('is-open');
          col.style.maxHeight = col.scrollHeight + 'px';
          btn.classList.add('is-active');
          btn.setAttribute('aria-expanded', 'true');
          setTimeout(() => { if (col.classList.contains('is-open')) col.style.maxHeight = 'none'; }, ANIM);
          setTimeout(() => {
            const card = btn.closest('.fund-card');
            if (card) window.scrollTo({ top: card.getBoundingClientRect().top + scrollY - 100, behavior: 'smooth' });
          }, 80);
        }
      });
    });

    /* ── Filtros ── */
    const allCards   = Array.from(document.querySelectorAll('.fund-card[data-cat]'));
    const allSects   = Array.from(document.querySelectorAll('.fd-category-section'));
    const searchInput = document.getElementById('searchInput');
    const countEl    = document.getElementById('countVisible');
    const emptyEl    = document.getElementById('emptyState');
    const clearBtn   = document.getElementById('clearFilters');

    let activeCat   = 'todos';
    let activeRisco = 'todos';
    let activeDist  = 'todos';
    let searchVal   = '';

    function applyFilters() {
      let visible = 0;

      allCards.forEach(card => {
        const cat   = card.dataset.cat;
        const dist  = card.dataset.dist;
        const risco = card.dataset.risco;
        const name  = (card.dataset.name || '').toLowerCase();

        const matchCat   = activeCat   === 'todos' || cat === activeCat;
        const matchDist  = activeDist  === 'todos' || dist === activeDist;
        const matchRisco = activeRisco === 'todos' || risco === activeRisco;
        const matchSearch = !searchVal || name.includes(searchVal);

        const show = matchCat && matchDist && matchRisco && matchSearch;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      // Esconder seções sem cards visíveis
      allSects.forEach(sect => {
        const hasSect = activeCat === 'todos' || sect.dataset.section === activeCat;
        const visibleCards = Array.from(sect.querySelectorAll('.fund-card[data-cat]'))
          .filter(c => c.style.display !== 'none');
        const hasVisible = visibleCards.length > 0;
        sect.style.display = (hasSect && hasVisible) ? '' : 'none';

        // Atualizar contagens por categoria
        const secName = sect.dataset.section;
        const countId = {
          'renda-fixa-simples': 'count-rfs',
          'renda-fixa': 'count-rf',
          'acoes': 'count-ac',
          'multimercado': 'count-mm',
          'estruturados': 'count-fii'
        }[secName];
        if (countId) {
          const el = document.getElementById(countId);
          if (el) el.textContent = visibleCards.length;
        }
      });

      countEl.textContent = visible;
      emptyEl.classList.toggle('visible', visible === 0);

      // Mostrar botão limpar se algum filtro ativo
      const dirty = activeCat !== 'todos' || activeRisco !== 'todos' || activeDist !== 'todos' || searchVal;
      clearBtn.classList.toggle('visible', !!dirty);
    }

    // Chips categoria
    document.querySelectorAll('[data-cat]').forEach(chip => {
      if (!chip.classList.contains('fund-card')) {
        chip.addEventListener('click', () => {
          document.querySelectorAll('[data-cat]:not(.fund-card)').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          activeCat = chip.dataset.cat;
          applyFilters();
        });
      }
    });

    // Chips risco
    document.querySelectorAll('[data-risco]:not(.fund-card)').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-risco]:not(.fund-card)').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeRisco = chip.dataset.risco;
        applyFilters();
      });
    });

    // Toggle distribuição
    document.querySelectorAll('[data-dist]').forEach(btn => {
      if (!btn.classList.contains('fund-card')) {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-dist]:not(.fund-card)').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeDist = btn.dataset.dist;
          applyFilters();
        });
      }
    });

    // Busca
    searchInput.addEventListener('input', () => {
      searchVal = searchInput.value.trim().toLowerCase();
      applyFilters();
    });

    // Limpar tudo
    clearBtn.addEventListener('click', () => {
      activeCat = 'todos';
      activeRisco = 'todos';
      activeDist = 'todos';
      searchVal = '';
      searchInput.value = '';
      document.querySelectorAll('[data-cat]:not(.fund-card)').forEach(c => c.classList.toggle('active', c.dataset.cat === 'todos'));
      document.querySelectorAll('[data-risco]').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('[data-dist]:not(.fund-card)').forEach(b => b.classList.toggle('active', b.dataset.dist === 'todos'));
      applyFilters();
    });

    // Init
    applyFilters();
  })();
