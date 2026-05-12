// ============================================================
// BRB Investimentos — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // HEADER — esconder ao rolar para baixo, mostrar ao subir
  // ============================================================
  const header = document.getElementById('site-header');
  const ticker = document.getElementById('cotacaoBar');
  let lastScroll = 0;
  let scrollDelta = 0;

  const HIDE_THRESHOLD  = 80;   // px rolados para baixo antes de esconder
  const SHOW_THRESHOLD  = 60;   // px rolados para cima antes de mostrar
  const TOP_ZONE        = 120;  // sempre visível no topo da página

  const showHeader = () => {
    header.classList.remove('header-hidden');
    ticker?.classList.remove('ticker-hidden');
  };
  const hideHeader = () => {
    header.classList.add('header-hidden');
    ticker?.classList.add('ticker-hidden');
  };

  window.addEventListener('scroll', throttle(() => {
    const current = window.pageYOffset;

    // Sempre visível perto do topo
    if (current < TOP_ZONE) {
      showHeader();
      scrollDelta = 0;
      lastScroll = current;
      return;
    }

    const diff = current - lastScroll;
    scrollDelta += diff;

    if (scrollDelta > HIDE_THRESHOLD) {
      // Rolou bastante para baixo — esconde
      hideHeader();
      scrollDelta = 0;
    } else if (scrollDelta < -SHOW_THRESHOLD) {
      // Rolou bastante para cima — mostra
      showHeader();
      scrollDelta = 0;
    }

    lastScroll = current;
  }, 60));


  // ============================================================
  // MENU MOBILE
  // ============================================================
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks     = document.querySelector('.nav-links');
  const menuOverlay  = document.querySelector('.menu-overlay');
  const closeBtn     = document.querySelector('.mobile-menu-close');

  const openMenu = () => {
    navLinks.classList.add('active');
    mobileToggle.classList.add('active');
    menuOverlay.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    if (closeBtn) closeBtn.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navLinks.classList.remove('active');
    mobileToggle.classList.remove('active');
    menuOverlay.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    if (closeBtn) closeBtn.classList.remove('visible');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', () =>
    navLinks.classList.contains('active') ? closeMenu() : openMenu()
  );

  menuOverlay?.addEventListener('click', closeMenu);
  closeBtn?.addEventListener('click', closeMenu);

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
  // PORTFÓLIO — troca de conteúdo com fade
  // ============================================================
  

  const portfolioData = {
    default: {
      titulo:    'Conheça nossos principais produtos',
      descricao: 'O portfólio da BRB Investimentos é estruturado para atender diferentes perfis e objetivos financeiros, combinando segurança, diversificação e potencial de crescimento. A estratégia busca equilíbrio entre ativos de renda fixa e renda variável, permitindo ao investidor acessar oportunidades em diferentes mercados, sempre com gestão responsável e alinhada às melhores práticas do mercado financeiro.',
      link:      null,
    },
    1: {
      titulo:    'Renda Fixa',
      descricao: 'Os produtos de renda fixa da BRB Investimentos oferecem segurança e previsibilidade de retorno, ideais para investidores que buscam preservação de capital e rendimento consistente. Inclui CDBs, LCIs, LCAs, Tesouro Direto e debêntures, com diferentes prazos e rentabilidades para atender ao seu perfil.',
      link:      'renda-fixa.html',
    },
    2: {
      titulo:    'Renda Variável',
      descricao: 'Os produtos de renda variável da BRB Investimentos incluem ações de empresas listadas, fundos de investimento em ações (FIAs), fundos multimercado e ETFs. Esses instrumentos permitem ao investidor participar do desempenho de diferentes setores da economia, com potencial de valorização no longo prazo e recebimento de proventos, como dividendos.',
      link:      'renda-variavel.html',
    },
    3: {
      titulo:    'Fundos',
      descricao: 'Os fundos de investimento oferecem diversificação imediata com gestão profissional, permitindo ao investidor acessar uma variedade de estratégias de forma prática. A BRB Investimentos disponibiliza uma ampla gama de fundos, incluindo multimercados, renda fixa, ações e internacionais, atendendo a diferentes perfis de risco e objetivos de retorno.',
      link:      'fundos.html',
    },
    4: {
      titulo:    'Previdência',
      descricao: 'Os planos de previdência da BRB Investimentos são voltados para o planejamento financeiro de longo prazo, auxiliando na construção de uma aposentadoria mais segura. Com opções como PGBL e VGBL, esses produtos oferecem benefícios fiscais e flexibilidade de contribuições, adaptando-se a diferentes perfis de investidores.',
      link:      'previdencia.html',
    },
    5: {
      titulo:    'Mercado Futuro',
      descricao: 'O mercado de futuros permite aos investidores negociar contratos para a compra ou venda de ativos em uma data futura, com o objetivo de especular sobre as variações de preços ou hedging de riscos. A BRB Investimentos oferece acesso a esse mercado com ferramentas e suporte especializado.',
      link:      'mercado-futuro.html',
    },
    6: {
      titulo:    'Criptoativos',
      descricao: 'A BRB Investimentos está sempre evoluindo para oferecer o que há de mais moderno no mercado financeiro. Em breve, você terá acesso a uma nova classe de ativos diretamente na nossa plataforma: os Criptoativos.',
      link:      'site-em-construção.html',
    },
  };
  

  const contentBox   = document.getElementById('content-portifolio');
  const portfolioLis = document.querySelectorAll('.portfolio-list li');

  const renderPortfolio = (id = 'default') => {
    const data = portfolioData[id];
    if (!data || !contentBox) return;

    const btnHTML = data.link
      ? `<a href="${data.link}" class="portfolio-cta-btn">Saiba mais sobre ${data.titulo} <span aria-hidden="true">→</span></a>`
      : '';

    contentBox.classList.add('is-fading');
    setTimeout(() => {
      contentBox.innerHTML = `<h2>${data.titulo}</h2><p>${data.descricao}</p>${btnHTML}`;
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

  // ============================================================
  // TICKER COTAÇÃO — API Banco Central do Brasil (PTAX)
  // ============================================================
  iniciarCotacaoTicker();
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


// ============================================================
// TICKER COTAÇÃO — Banco Central do Brasil (PTAX)
// ============================================================

async function iniciarCotacaoTicker() {
  const contentEl = document.getElementById('cotacaoContent');
  if (!contentEl) return;

  // data no formato MM-DD-YYYY exigido pela API do BCB
  const formatarData = (date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  // buscar a cotação retroativa até 7 dias (fim de semana e feriados não têm dados)
  const buscarCotacao = async (moeda, nome) => {
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
      } catch (_) { /* segue tentando */ }
    }
    return null;
  };

  // Formata R$ com 4 casas para ficar no padrão PTAX
  const formatarBRL = (val) => `R$ ${val}`;

  const renderTicker = (cotacoes) => {
    if (!cotacoes.length) {
      contentEl.innerHTML = '<span class="cotacao-erro">Cotação indisponível no momento.</span>';
      return;
    }

    // Duplica o conteúdo para o loop infinito do ticker
    const itemsHTML = cotacoes.map(c => `
      <span class="cotacao-item">
        <span class="cotacao-item-flag">${c.flag}</span>
        <span class="cotacao-item-name">${c.moeda}/BRL</span>
        <span class="cotacao-item-buy">Compra: <span>${formatarBRL(c.compra)}</span></span>
        <span class="cotacao-item-sell">Venda: <span>${formatarBRL(c.venda)}</span></span>
        <span class="cotacao-item-time">PTAX ${c.hora}</span>
      </span>
      <span class="cotacao-separator" aria-hidden="true"></span>
    `).join('');

    // Duplicar para o scroll infinito ser contínuo
    contentEl.innerHTML = itemsHTML + itemsHTML + itemsHTML;
  };

  // Busca paralela USD + EUR
  const [usd, eur] = await Promise.all([
    buscarCotacao('USD', 'Dólar'),
    buscarCotacao('EUR', 'Euro'),
  ]);

  const cotacoes = [
    usd ? { ...usd, flag: '🇺🇸' } : null,
    eur ? { ...eur, flag: '🇪🇺' } : null,
  ].filter(Boolean);

  renderTicker(cotacoes);

  // Atualiza a cada 5 minutos
  setInterval(async () => {
    const [usdAtual, eurAtual] = await Promise.all([
      buscarCotacao('USD', 'Dólar'),
      buscarCotacao('EUR', 'Euro'),
    ]);
    const atualizadas = [
      usdAtual ? { ...usdAtual, flag: '🇺🇸' } : null,
      eurAtual ? { ...eurAtual, flag: '🇪🇺' } : null,
    ].filter(Boolean);
    renderTicker(atualizadas);
  }, 5 * 60 * 1000);
}







// ============================================================
// LÓGICA DAS PÁGINAS DE PRODUTOS — carregada condicionalmente
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ── renda-variavel ──
  if (document.querySelector('.rv-hero')) {
    // ── FAQ accordion ──
        document.querySelectorAll('.faq-trigger').forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const isOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq-item.is-open').forEach(i => {
              i.classList.remove('is-open');
              i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) { item.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); }
          });
        });
    
        // ── Scroll reveal ──
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
        // ── Expandable product cards ──
        document.querySelectorAll('.product-card').forEach(card => {
          card.addEventListener('click', () => {
            const isExp = card.classList.contains('expanded');
            document.querySelectorAll('.product-card.expanded').forEach(c => c.classList.remove('expanded'));
            if (!isExp) card.classList.add('expanded');
          });
        });
    
        // ── Product tabs / filter ──
        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            document.querySelectorAll('.product-card').forEach(card => {
              if (tab === 'all') { card.style.display = ''; return; }
              const prof = card.dataset.profile || '';
              card.style.display = prof.includes(tab) ? '' : 'none';
            });
          });
        });
    
        // ── Reading progress bar ──
        const bar = document.getElementById('readingBar');
        window.addEventListener('scroll', () => {
          const scrolled = window.scrollY;
          const total = document.body.scrollHeight - window.innerHeight;
          bar.style.width = (scrolled / total * 100) + '%';
        });
    
        // ── Floating CTA ──
        const floatingCta = document.getElementById('floatingCta');
        window.addEventListener('scroll', () => {
          if (window.scrollY > 600) floatingCta.classList.add('visible');
          else floatingCta.classList.remove('visible');
        });
    
        // ── Live market ticker ──
        function setTicker(id, chgId, value, change) {
          const el = document.getElementById(id);
          const chgEl = document.getElementById(chgId);
          if (el) { el.textContent = value; el.style.animation = 'none'; el.offsetHeight; el.style.animation = 'numberReveal .4s ease'; }
          if (chgEl) {
            chgEl.textContent = change;
            chgEl.className = 'rv-ticker-change ' + (parseFloat(change) >= 0 ? 'up' : 'down');
          }
        }
    
        function fmtBRL(n, prefix='') {
          return prefix + n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
        }
        function fmtPct(n) {
          return (n >= 0 ? '+' : '') + n.toFixed(2).replace('.',',') + '%';
        }
    
        async function fetchTickers() {
          // Tudo via AwesomeAPI — CORS aberto, sem key, confirmado funcionando
          try {
            const r = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,BTC-USD,EUR-BRL,XAU-USD');
            const d = await r.json();
    
            const usd = d['USDBRL'];
            if (usd) setTicker('tk-usd','tk-usd-chg',
              'R$ '+parseFloat(usd.bid).toFixed(2).replace('.',','),
              fmtPct(parseFloat(usd.pctChange)));
    
            const btc = d['BTCUSD'];
            if (btc) setTicker('tk-btc','tk-btc-chg',
              '$ '+Math.round(parseFloat(btc.bid)).toLocaleString('pt-BR'),
              fmtPct(parseFloat(btc.pctChange)));
    
            const eur = d['EURBRL'];
            if (eur) setTicker('tk-eur','tk-eur-chg',
              'R$ '+parseFloat(eur.bid).toFixed(2).replace('.',','),
              fmtPct(parseFloat(eur.pctChange)));
    
            const xau = d['XAUUSD'];
            if (xau) setTicker('tk-xau','tk-xau-chg',
              '$ '+parseFloat(xau.bid).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,'.'),
              fmtPct(parseFloat(xau.pctChange)));
    
          } catch(e) { console.warn('Ticker error:', e); }
        }
    
            // Inicializa e atualiza a cada 60 segundos
        fetchTickers();
        setInterval(fetchTickers, 60000);
  }

  // ── renda-fixa ──
  if (document.querySelector('.rf-hero')) {
    // Header hide/show
        const header = document.getElementById('site-header');
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
          const current = window.pageYOffset;
          if (current <= 10) header.classList.remove('header-hidden');
          else if (current > lastScroll) header.classList.add('header-hidden');
          else header.classList.remove('header-hidden');
          lastScroll = current;
        });
    
        // Mobile menu
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.querySelector('.menu-overlay');
        const closeMenu = () => { navLinks.classList.remove('active'); toggle.setAttribute('aria-expanded','false'); overlay.classList.remove('active'); document.body.style.overflow = ''; };
        toggle?.addEventListener('click', () => { const open = navLinks.classList.toggle('active'); toggle.setAttribute('aria-expanded', open); overlay.classList.toggle('active', open); document.body.style.overflow = open ? 'hidden' : ''; });
        overlay?.addEventListener('click', closeMenu);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
        document.querySelectorAll('.dropdown-toggle').forEach(t => { t.addEventListener('click', e => { if (window.innerWidth > 968) return; e.preventDefault(); t.closest('.dropdown').classList.toggle('is-open'); }); });
    
        // FAQ
        document.querySelectorAll('.faq-trigger').forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const isOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
            if (!isOpen) item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', !isOpen);
          });
        });
    
        // Scroll reveal
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('is-visible'), i * 80); revealObserver.unobserve(entry.target); }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
        // Product card expand
        document.querySelectorAll('.product-card').forEach(card => {
          card.addEventListener('click', () => {
            const isExp = card.classList.contains('expanded');
            document.querySelectorAll('.product-card.expanded').forEach(c => c.classList.remove('expanded'));
            if (!isExp) card.classList.add('expanded');
          });
        });
    
        // Comparator cards
        document.querySelectorAll('.comparator-card').forEach(card => {
          card.addEventListener('click', () => {
            document.querySelectorAll('.comparator-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const product = card.dataset.product;
            document.querySelectorAll('.product-card').forEach(p => p.classList.remove('expanded'));
            const target = document.getElementById(product);
            if (target) { target.scrollIntoView({behavior:'smooth', block:'center'}); target.classList.add('expanded'); }
          });
        });
    
        // Reading progress
        const bar = document.getElementById('readingBar');
        window.addEventListener('scroll', () => { const s = window.scrollY; const t = document.body.scrollHeight - window.innerHeight; bar.style.width = (s/t*100)+'%'; });
    
        // Floating CTA
        const floatingCta = document.getElementById('floatingCta');
        window.addEventListener('scroll', () => { if (window.scrollY > 600) floatingCta.classList.add('visible'); else floatingCta.classList.remove('visible'); });
  }

  // ── fundos ──
  if (document.querySelector('.fd-hero')) {
    // FAQ
        document.querySelectorAll('.faq-trigger').forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item'); const isOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq-item.is-open').forEach(i => { i.classList.remove('is-open'); i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false'); });
            if (!isOpen) { item.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); }
          });
        });
    
        // Scroll reveal
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry, i) => { if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('is-visible'), i * 80); revealObserver.unobserve(entry.target); } });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
        // Fund filter
        document.querySelectorAll('.fund-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            document.querySelectorAll('.fund-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const risk = pill.dataset.risk;
            document.querySelectorAll('.product-card').forEach(card => {
              if (risk === 'all') { card.style.display = ''; return; }
              card.style.display = (card.dataset.risk || '').includes(risk) ? '' : 'none';
            });
          });
        });
    
        // Card expand
        document.querySelectorAll('.product-card').forEach(card => {
          card.addEventListener('click', () => {
            const isExp = card.classList.contains('expanded');
            document.querySelectorAll('.product-card.expanded').forEach(c => c.classList.remove('expanded'));
            if (!isExp) card.classList.add('expanded');
          });
        });
    
        // Reading progress + floating CTA
        const bar = document.getElementById('readingBar');
        const floatingCta = document.getElementById('floatingCta');
        window.addEventListener('scroll', () => {
          bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
          if (window.scrollY > 600) floatingCta.classList.add('visible'); else floatingCta.classList.remove('visible');
        });
  }

  // ── previdencia ──
  if (document.querySelector('.pv-hero')) {
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item   = trigger.closest('.faq-item');
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
    
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
    
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
    function calcularSimulador() {
          const aporte = parseFloat(document.getElementById('simAporte').value) || 500;
          const anos = parseInt(document.getElementById('simAnos').value) || 20;
          const rent = parseFloat(document.getElementById('simRent').value) / 100 / 12;
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
        document.querySelectorAll('#simAporte,#simAnos,#simRent').forEach(el => el.addEventListener('input', calcularSimulador));
        const bar = document.getElementById('readingBar');
        const fc = document.getElementById('floatingCta');
        window.addEventListener('scroll', () => {
          bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
          if (window.scrollY > 600) fc.classList.add('visible'); else fc.classList.remove('visible');
        });
  }

  // ── mercado-futuro ──
  if (document.querySelector('.mf-hero')) {
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item   = trigger.closest('.faq-item');
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
    
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
    
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
    const bar = document.getElementById('readingBar');
        const fc = document.getElementById('floatingCta');
        window.addEventListener('scroll', () => {
          bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
          if (window.scrollY > 600) fc.classList.add('visible'); else fc.classList.remove('visible');
        });
  }

});
