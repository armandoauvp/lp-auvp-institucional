// Glow effect que segue o mouse (DEFERRED - non-critical animation)
// Aplicado a todas as seções com a classe .glow-section (ex: Ecossistema + Banner CTA).
// Um único listener no document acompanha o cursor por TODAS as seções ao mesmo tempo,
// para que o brilho não "resete" (fade out/in) ao cruzar a fronteira entre elas.
function setupGlowEffect() {
    if (window.innerWidth <= 768) return;

    const sections = Array.from(document.querySelectorAll('.glow-section'));
    if (!sections.length) return;

    let lastX = 0, lastY = 0, animationFrameId = null;

    const isInsideAnySection = (x, y) => sections.some((section) => {
        const rect = section.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });

    const updateGlow = () => {
        const inside = isInsideAnySection(lastX, lastY);
        sections.forEach((section) => {
            const glowOverlay = section.querySelector('.glow-overlay');
            if (!glowOverlay) return;
            const rect = section.getBoundingClientRect();
            section.style.setProperty('--mouse-x', `${lastX - rect.left}px`);
            section.style.setProperty('--mouse-y', `${lastY - rect.top}px`);
            glowOverlay.style.opacity = inside ? '1' : '0';
        });
        animationFrameId = null;
    };

    document.addEventListener('mousemove', (e) => {
        lastX = e.clientX;
        lastY = e.clientY;

        // Use requestAnimationFrame to throttle mousemove updates
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateGlow);
        }
    });
}

// Menu Mobile (CRITICAL - needed for navigation)
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-btn');
    if (btn) {
        btn.addEventListener('click', function () {
            const menu = document.getElementById('mobile-menu');
            menu?.classList.toggle('tw-hidden');
        });
    }
});

// FAQ Tabs (CRITICAL - main content interaction)
window.mostrarTab = function (event, tabId, elemento) {
    event.preventDefault();
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => { tab.style.display = 'none'; });
    const tabToShow = document.getElementById(tabId);
    if (tabToShow) { tabToShow.style.display = 'block'; }
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => { item.classList.remove('ativo'); });
    elemento.classList.add('ativo');
};

document.addEventListener('DOMContentLoaded', () => {
    const firstTab = document.getElementById('tabnews');
    if (firstTab) firstTab.style.display = 'block';
});

// Acordeão "O que você vai aprender" (DEFERRED)
function setupAccordion() {
    const learnBtns = document.querySelectorAll('.learn-btn');

    learnBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.learn-item');
            const body = item.querySelector('.learn-body');
            const icon = item.querySelector('.learn-icon');
            const isOpen = !body.classList.contains('tw-hidden');

            document.querySelectorAll('.learn-body').forEach(b => b.classList.add('tw-hidden'));
            document.querySelectorAll('.learn-btn').forEach(b => {
                b.classList.remove('tw-bg-gray-50');
                b.querySelector('.learn-icon').textContent = '+';
            });

            if (!isOpen) {
                body.classList.remove('tw-hidden');
                btn.classList.add('tw-bg-gray-50');
                icon.innerHTML = '&times;';
            }
        });
    });

    if (learnBtns.length > 0) {
        learnBtns[0].click();
    }
}

// Slider de Módulos (DEFERRED)
function setupModuleSlider() {
    const slider = document.getElementById('modulesSlider');
    const dotsContainer = document.getElementById('carouselDots');
    const items = document.querySelectorAll('.module-item-wrapper');

    function setupDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        if (!slider || !dotsContainer) return;
        const scrollLeft = slider.scrollLeft;
        const scrollWidth = slider.scrollWidth - slider.clientWidth;
        if (scrollWidth <= 0) return;
        const index = Math.round((scrollLeft / scrollWidth) * (items.length - 1));
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    setupDots();
    if (slider) slider.addEventListener('scroll', updateDots);
}

// Modal da Calculadora (DEFERRED)
function setupCalculatorModal() {
    const modal = document.getElementById('calc-modal');
    const openBtn = document.getElementById('open-calc-modal');
    const closeBtn = document.getElementById('calc-modal-close');
    if (!modal || !openBtn || !closeBtn) return;

    openBtn.addEventListener('click', () => {
        modal.classList.remove('tw-hidden');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.classList.add('tw-hidden');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// Carrossel de Depoimentos com Loop Infinito (DEFERRED)
function setupTestimonialsCarousel() {
    let currentIndex = 0;
    let itemW = 0;
    const GAP = 20;

    const outer = document.querySelector('.testimonials-outer');
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    if (!outer || !track || !dotsContainer) return;

    const origItems = Array.from(track.querySelectorAll('.testimonial-item-wrapper'));
    const total = origItems.length;
    if (!total) return;

    // Clone all items and insert before/after originals for seamless infinite loop
    origItems.map(item => item.cloneNode(true)).forEach(clone => track.insertBefore(clone, track.firstChild));
    origItems.map(item => item.cloneNode(true)).forEach(clone => track.appendChild(clone));

    const allItems = Array.from(track.querySelectorAll('.testimonial-item-wrapper'));

    const getPerView = () => window.innerWidth >= 768 ? 2 : 1;

    function setItemWidths() {
        const perView = getPerView();
        const outerW = outer.offsetWidth;
        if (!outerW) return;
        itemW = Math.floor((outerW - GAP * (perView - 1)) / perView);
        allItems.forEach(item => { item.style.width = itemW + 'px'; item.style.flexShrink = '0'; });
    }

    // Build dots (one per real item)
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { stopAutoplay(); goTo(total + i); startAutoplay(); });
        dotsContainer.appendChild(dot);
    }

    function goTo(index, animated = true) {
        currentIndex = index;
        if (!animated) {
            track.style.transition = 'none';
            track.getBoundingClientRect(); // force reflow so 'none' applies immediately
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
        }
        track.style.transform = `translateX(-${currentIndex * (itemW + GAP)}px)`;
        const realIndex = ((currentIndex - total) % total + total) % total;
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === realIndex));
    }

    // Devolve o índice para a faixa dos itens reais sem animação. É a rede de
    // segurança de tudo o que depende do transitionend: sempre que o índice
    // escapa do intervalo clonado, uma chamada aqui recoloca o carrossel no
    // lugar sem que o visitante perceba.
    const foraDaFaixa = () => currentIndex >= total * 2 || currentIndex < total;
    function ressincronizar() {
        const realIndex = ((currentIndex - total) % total + total) % total;
        goTo(realIndex + total, false);
    }

    // After animated transition: silently jump to real item if we're in the clone zone
    track.addEventListener('transitionend', (e) => {
        if (e.target !== track || e.propertyName !== 'transform') return;
        if (foraDaFaixa()) ressincronizar();
    });

    // Autoplay
    let autoplayTimer;
    function startAutoplay() {
        // Nunca deixa dois timers correndo: hover, aba e viewport chamam este
        // start em sequências que se sobrepõem.
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
            // A dobra tem content-visibility: auto, então fora da tela ela não é
            // renderizada: a transição não roda, o transitionend não dispara e o
            // índice ia embora somando 1 a cada 5s até o track sair da tela e os
            // depoimentos "sumirem". Conferir a faixa antes de avançar corta o
            // problema na raiz, mesmo que algum transitionend se perca.
            if (foraDaFaixa()) ressincronizar();
            goTo(currentIndex + 1);
        }, 5000);
    }
    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { stopAutoplay(); goTo(currentIndex + (diff > 0 ? 1 : -1)); startAutoplay(); }
    });

    // Pause on hover
    outer.addEventListener('mouseenter', stopAutoplay);
    outer.addEventListener('mouseleave', startAutoplay);

    // Pause enquanto a aba está em segundo plano e resincroniza a posição ao
    // voltar (transições CSS não completam com a aba oculta, então o índice
    // pode "andar" para fora do intervalo clonado e os depoimentos somem).
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            ressincronizar();
            startAutoplay();
        }
    });

    // Mesma história para a rolagem: só gira enquanto a dobra está na tela, e
    // resincroniza ao voltar para ela.
    new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                ressincronizar();
                startAutoplay();
            } else {
                stopAutoplay();
            }
        },
        { threshold: 0 }
    ).observe(outer);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setItemWidths();
            track.style.transition = 'none';
            track.style.transform = `translateX(-${currentIndex * (itemW + GAP)}px)`;
        }, 100);
    });

    // Init: start at first real item (offset by prepended clones)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setItemWidths();
            goTo(total, false);
            startAutoplay();
        });
    });
}

// Calculadora de Investimentos (DEFERRED)
function setupCalculator() {
    const investmentSlider = document.getElementById('investmentSlider');
    const monthlySlider = document.getElementById('monthlySlider');
    const timeSlider = document.getElementById('timeSlider');

    const initialSpan = document.getElementById('initialValue');
    const monthlySpan = document.getElementById('monthlyValue');
    const timeSpan = document.getElementById('timeValue');
    const finalSpan = document.getElementById('finalValue');
    const savingsSpan = document.getElementById('savingsValue');
    const disclaimerRateSpan = document.getElementById('disclaimerRate');

    const popup = document.getElementById('sliderPopup');

    const ANNUAL_RATES_BY_YEAR = {
        1: 0.2287,
        2: 0.1311,
        3: 0.1766,
        4: 0.1508,
        5: 0.1030,
        6: 0.0865,
        7: 0.1056,
        8: 0.1090,
        9: 0.1228
    };

    const FIXED_MONTHLY_SAVINGS = 0.005;
    const ESTIMATED_MONTHLY_TR = 0.0009;
    const MONTHLY_RATE_SAVINGS = FIXED_MONTHLY_SAVINGS + ESTIMATED_MONTHLY_TR;

    const calculateMonthlyRate = (annualRate) => Math.pow(1 + annualRate, 1 / 12) - 1;

    const INITIAL_MIN_REAL = 1000;
    const INITIAL_MAX_REAL = 10000000;
    const MONTHLY_MIN_LOG_START = 50;
    const MONTHLY_MAX_REAL = 500000;

    function smartRound(value) {
        if (value < 1000) return Math.round(value / 50) * 50;
        if (value < 10000) return Math.round(value / 100) * 100;
        if (value < 100000) return Math.round(value / 500) * 500;
        if (value < 1000000) return Math.round(value / 1000) * 1000;
        return Math.round(value / 5000) * 5000;
    }

    function getLogInitialInvestment(position) {
        const minp = 0;
        const maxp = 1000;
        const minv = Math.log(INITIAL_MIN_REAL);
        const maxv = Math.log(INITIAL_MAX_REAL);
        const scale = (maxv - minv) / (maxp - minp);
        const value = Math.exp(minv + scale * (position - minp));
        return smartRound(value);
    }

    function getLogMonthlyContribution(position) {
        if (position == 0) return 0;
        const minp = 1;
        const maxp = 1000;
        const minv = Math.log(MONTHLY_MIN_LOG_START);
        const maxv = Math.log(MONTHLY_MAX_REAL);
        const scale = (maxv - minv) / (maxp - minp);
        const value = Math.exp(minv + scale * (position - minp));
        return smartRound(value);
    }

    const formatCurrency = (value, showCents = true) => {
        const options = {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: showCents ? 2 : 0,
            maximumFractionDigits: showCents ? 2 : 0,
        };
        return value.toLocaleString('pt-BR', options);
    };

    const formatPercent = (value) => {
        return (value * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
    };

    const calculateFutureValueAnnuity = (monthlyContribution, monthlyRate, totalMonths) => {
        if (monthlyContribution <= 0) return 0;
        const fvFactor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
        return monthlyContribution * fvFactor * (1 + monthlyRate);
    };

    function updateValues() {
        if (!investmentSlider) return;
        const initialInvestment = getLogInitialInvestment(parseInt(investmentSlider.value));
        const monthlyContribution = getLogMonthlyContribution(parseInt(monthlySlider.value));
        const years = parseInt(timeSlider.value, 10);
        const totalMonths = years * 12;

        const currentAnnualRate = ANNUAL_RATES_BY_YEAR[years] || 0.12;
        const currentMonthlyRate = calculateMonthlyRate(currentAnnualRate);

        const fvInitialPortfolio = initialInvestment * Math.pow((1 + currentMonthlyRate), totalMonths);
        const fvMonthlyPortfolio = calculateFutureValueAnnuity(monthlyContribution, currentMonthlyRate, totalMonths);
        const finalValue = fvInitialPortfolio + fvMonthlyPortfolio;

        const fvInitialSavings = initialInvestment * Math.pow((1 + MONTHLY_RATE_SAVINGS), totalMonths);
        const fvMonthlySavings = calculateFutureValueAnnuity(monthlyContribution, MONTHLY_RATE_SAVINGS, totalMonths);
        const savingsFinalValue = fvInitialSavings + fvMonthlySavings;

        const scale = 0.8 + ((years - timeSlider.min) / (timeSlider.max - timeSlider.min)) * 0.2;

        initialSpan.textContent = formatCurrency(initialInvestment, false);
        monthlySpan.textContent = formatCurrency(monthlyContribution, false);
        timeSpan.textContent = `${years} ano${years > 1 ? 's' : ''}`;

        finalSpan.textContent = formatCurrency(finalValue, true);
        savingsSpan.textContent = formatCurrency(savingsFinalValue, true);

        disclaimerRateSpan.textContent = formatPercent(currentAnnualRate);

        finalSpan.style.transform = `scale(${scale})`;

        movePopupToThumb();
    }

    function movePopupToThumb() {
        if (!investmentSlider || !popup) return;
        const percent = (investmentSlider.value - investmentSlider.min) / (investmentSlider.max - investmentSlider.min);
        const thumbX = investmentSlider.offsetLeft + percent * investmentSlider.offsetWidth;
        popup.style.left = `${thumbX}px`;
        const verticalCenter = investmentSlider.offsetTop + (investmentSlider.offsetHeight / 2);
        popup.style.top = `${verticalCenter}px`;
    }

    if (investmentSlider) {
        investmentSlider.addEventListener('input', () => {
            updateValues();
            popup.classList.remove('show');
        });
        monthlySlider?.addEventListener('input', updateValues);
        timeSlider?.addEventListener('input', updateValues);
        updateValues();
    }
}

// Calculadora: inicializa modal + widget apenas no primeiro clique do botão
function setupLazyCalculator() {
    const openBtn = document.getElementById('open-calc-modal');
    if (!openBtn) return;
    let initialized = false;

    openBtn.addEventListener('click', () => {
        const modal = document.getElementById('calc-modal');
        const closeBtn = document.getElementById('calc-modal-close');
        if (!modal || !closeBtn) return;

        if (!initialized) {
            initialized = true;
            setupCalculator();

            function closeModal() {
                modal.classList.add('tw-hidden');
                document.body.style.overflow = '';
            }

            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
            document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
        }

        modal.classList.remove('tw-hidden');
        document.body.style.overflow = 'hidden';
    });
}

// Timeline Ecossistema (DEFERRED - ativa animação ao entrar na viewport)
function setupEcosysTimeline() {
    const tl = document.getElementById('ecosys-timeline');
    if (!tl) return;
    new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { tl.classList.add('is-visible'); } },
        { threshold: 0.15 }
    ).observe(tl);
}

// Colunas do Ecossistema (DEFERRED - descrições recolhíveis)
// As quatro colunas abrem e fecham juntas: elas formam uma etapa só da
// jornada, e abrir uma de cada vez fazia as vizinhas dançarem de altura.
function setupEcosysCollapse() {
    const toggles = Array.from(document.querySelectorAll('.ecosys-tl-toggle'));
    if (!toggles.length) return;

    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const abrir = btn.getAttribute('aria-expanded') !== 'true';
            toggles.forEach(outro => {
                outro.setAttribute('aria-expanded', String(abrir));
                const panel = document.getElementById(outro.getAttribute('aria-controls'));
                if (panel) panel.classList.toggle('is-open', abrir);
            });
        });
    });
}

// Novidades: cartões e roadmap surgem em cascata ao entrar na viewport (DEFERRED)
function setupNewsReveal() {
    const grid = document.getElementById('news-grid');
    // A classe só entra aqui: sem JS os cartões nunca ficam invisíveis.
    if (grid) grid.classList.add('js-reveal');

    [grid, document.getElementById('news-roadmap')].forEach(el => {
        if (!el) return;
        new IntersectionObserver(
            ([entry], observer) => {
                if (!entry.isIntersecting) return;
                el.classList.add('is-visible');
                observer.disconnect();
            },
            { threshold: 0.15 }
        ).observe(el);
    });
}

// Novidades: indicadores do carrossel no mobile (DEFERRED)
function setupNewsCarousel() {
    const slider = document.getElementById('news-grid');
    const dotsContainer = document.getElementById('newsDots');
    if (!slider || !dotsContainer) return;

    const items = Array.from(slider.querySelectorAll('.news-item'));
    if (!items.length) return;

    dotsContainer.innerHTML = '';
    items.forEach((item, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ir para a novidade ${index + 1} de ${items.length}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            // Rola só o carrossel: scrollIntoView levaria a página junto no
            // eixo vertical, tirando a dobra do lugar embaixo do dedo.
            const alvo =
                item.getBoundingClientRect().left -
                slider.getBoundingClientRect().left +
                slider.scrollLeft -
                (slider.clientWidth - item.clientWidth) / 2;
            slider.scrollTo({ left: alvo, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    slider.addEventListener('scroll', () => {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (maxScroll <= 0) return;
        const index = Math.round((slider.scrollLeft / maxScroll) * (items.length - 1));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    });
}

// Gráfico da dobra de simulação (DEFERRED)
// As constantes são as MESMAS da calculadora do modal — a taxa de 9 anos de
// ANNUAL_RATES_BY_YEAR e a regra da poupança (0,5% a.m. + TR estimada). Assim o
// número que a dobra promete é o mesmo que o simulador entrega para esse
// cenário; mexeu numa taxa, mexa nas duas.
const CALC_CHART = {
    inicial: 4000,
    mensal: 500,
    anos: 9,
    taxaAnualCarteira: 0.1228,
    taxaMensalPoupanca: 0.005 + 0.0009,
};

function setupCalcChart() {
    const figura = document.getElementById('calc-chart');
    const plot = document.getElementById('calc-chart-plot');
    const eixo = document.getElementById('calc-chart-axis');
    if (!figura || !plot || !eixo) return;

    const { inicial, mensal, anos, taxaAnualCarteira, taxaMensalPoupanca } = CALC_CHART;
    const taxaMensalCarteira = Math.pow(1 + taxaAnualCarteira, 1 / 12) - 1;

    // Montante com aporte inicial + aportes mensais no fim de cada mês.
    const montante = (taxa, meses) =>
        inicial * Math.pow(1 + taxa, meses) +
        mensal * ((Math.pow(1 + taxa, meses) - 1) / taxa) * (1 + taxa);

    const carteira = [];
    const poupanca = [];
    for (let ano = 0; ano <= anos; ano++) {
        const meses = ano * 12;
        carteira.push(ano === 0 ? inicial : montante(taxaMensalCarteira, meses));
        poupanca.push(ano === 0 ? inicial : montante(taxaMensalPoupanca, meses));
    }

    const dinheiro = valor => valor.toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0,
    });

    // Geometria do desenho. O SVG usa preserveAspectRatio="none" para esticar
    // no espaço disponível, e as linhas ganham vector-effect para a espessura
    // não deformar junto.
    const L = 600, A = 260, TOPO = 16, BASE = 16;
    const teto = carteira[anos] * 1.06;
    const x = i => (i / anos) * L;
    const y = valor => TOPO + (1 - valor / teto) * (A - TOPO - BASE);
    const linha = serie => serie.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    // A faixa pintada é o vão ENTRE as duas curvas, não a área sob a carteira:
    // o que a dobra tem a dizer é o tamanho da diferença, então é ela que ganha
    // cor. Vai pela carteira e volta pela poupança, fechando o polígono.
    const faixaEntre = () =>
        linha(carteira) + ' ' +
        poupanca.map((v, i) => `L${x(anos - i).toFixed(1)} ${y(poupanca[anos - i]).toFixed(1)}`).join(' ') +
        ' Z';

    const grades = [0.25, 0.5, 0.75, 1]
        .map(p => `<line class="calc-grid" x1="0" y1="${(TOPO + p * (A - TOPO - BASE)).toFixed(1)}" x2="${L}" y2="${(TOPO + p * (A - TOPO - BASE)).toFixed(1)}" vector-effect="non-scaling-stroke" />`)
        .join('');

    plot.innerHTML = `
        <svg viewBox="0 0 ${L} ${A}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="calc-area-carteira" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#00c642" stop-opacity="0.10" />
                    <stop offset="100%" stop-color="#00c642" stop-opacity="0.32" />
                </linearGradient>
            </defs>
            ${grades}
            <path class="calc-area" d="${faixaEntre()}" fill="url(#calc-area-carteira)" />
            <path class="calc-line calc-line--poupanca" d="${linha(poupanca)}" vector-effect="non-scaling-stroke" />
            <path class="calc-line calc-line--carteira" d="${linha(carteira)}" vector-effect="non-scaling-stroke" />
        </svg>
        <div class="calc-cursor" id="calc-cursor">
            <span class="calc-cursor-linha"></span>
            <span class="calc-cursor-ponto calc-cursor-ponto--poupanca"></span>
            <span class="calc-cursor-ponto calc-cursor-ponto--carteira"></span>
            <span class="calc-cursor-balao"></span>
        </div>`;

    eixo.innerHTML = [0, 3, 6, 9]
        .map(ano => `<span>${ano === 0 ? 'hoje' : `${ano} anos`}</span>`)
        .join('');

    // O traçado precisa do comprimento real de cada curva para animar.
    plot.querySelectorAll('.calc-line').forEach(p => {
        p.style.setProperty('--tamanho', p.getTotalLength().toFixed(1));
    });

    figura.classList.add('is-ready');

    // ---- Números que sobem junto com o traçado ----
    const alvos = [
        [document.getElementById('calc-val-carteira'), carteira[anos]],
        [document.getElementById('calc-val-poupanca'), poupanca[anos]],
        [document.getElementById('calc-val-diff'), carteira[anos] - poupanca[anos]],
    ];
    const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function contar() {
        if (semAnimacao) {
            alvos.forEach(([el, valor]) => { if (el) el.textContent = dinheiro(valor); });
            return;
        }
        const duracao = 1600;
        const inicio = performance.now();
        const passo = agora => {
            const t = Math.min((agora - inicio) / duracao, 1);
            const suave = 1 - Math.pow(1 - t, 3);
            alvos.forEach(([el, valor]) => { if (el) el.textContent = dinheiro(valor * suave); });
            if (t < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
    }

    new IntersectionObserver(
        ([entrada], observer) => {
            if (!entrada.isIntersecting) return;
            figura.classList.add('is-visible');
            contar();
            observer.disconnect();
        },
        { threshold: 0.3 }
    ).observe(figura);

    // ---- Cursor de leitura: mouse, toque e teclado ----
    const cursor = document.getElementById('calc-cursor');
    const linhaGuia = cursor.querySelector('.calc-cursor-linha');
    const pontoCarteira = cursor.querySelector('.calc-cursor-ponto--carteira');
    const pontoPoupanca = cursor.querySelector('.calc-cursor-ponto--poupanca');
    const balao = cursor.querySelector('.calc-cursor-balao');
    let anoAtivo = anos;

    const posY = valor => `${(y(valor) / A) * 100}%`;

    function mostrar(ano) {
        anoAtivo = Math.max(0, Math.min(anos, ano));
        const px = `${(anoAtivo / anos) * 100}%`;
        linhaGuia.style.left = px;
        pontoCarteira.style.left = px;
        pontoCarteira.style.top = posY(carteira[anoAtivo]);
        pontoPoupanca.style.left = px;
        pontoPoupanca.style.top = posY(poupanca[anoAtivo]);
        balao.style.left = px;
        balao.style.top = posY(carteira[anoAtivo]);
        balao.classList.toggle('no-inicio', anoAtivo <= 1);
        balao.classList.toggle('no-fim', anoAtivo >= anos - 1);
        balao.innerHTML =
            `<span class="balao-ano">${anoAtivo === 0 ? 'Hoje' : `Ano ${anoAtivo}`}</span>` +
            `<b class="balao-carteira">${dinheiro(carteira[anoAtivo])}</b> na carteira<br>` +
            `<b>${dinheiro(poupanca[anoAtivo])}</b> na poupança`;
        cursor.classList.add('is-on');
    }
    const esconder = () => cursor.classList.remove('is-on');

    const anoNoPonteiro = evento => {
        const caixa = plot.getBoundingClientRect();
        if (!caixa.width) return 0;
        return Math.round(((evento.clientX - caixa.left) / caixa.width) * anos);
    };

    plot.addEventListener('pointermove', e => mostrar(anoNoPonteiro(e)));
    plot.addEventListener('pointerdown', e => mostrar(anoNoPonteiro(e)));
    plot.addEventListener('pointerleave', esconder);

    // Pelo teclado a régua anda de ano em ano.
    plot.tabIndex = 0;
    plot.setAttribute('role', 'img');
    plot.setAttribute(
        'aria-label',
        `Projeção de ${anos} anos com ${dinheiro(inicial)} iniciais e ${dinheiro(mensal)} por mês: ` +
        `${dinheiro(carteira[anos])} numa carteira diversificada contra ${dinheiro(poupanca[anos])} na poupança.`
    );
    plot.addEventListener('focus', () => mostrar(anoAtivo));
    plot.addEventListener('blur', esconder);
    plot.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        mostrar(anoAtivo + (e.key === 'ArrowRight' ? 1 : -1));
    });
}

// Banner "Faça parte..." (DEFERRED - fade-up ao entrar na viewport)
function setupCtaBannerAnimation() {
    const el = document.querySelector('.cta-fade-up');
    if (!el) return;
    new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); } },
        { threshold: 0.2 }
    ).observe(el);
}

// Modal dos Termos do Programa de Indicação (DEFERRED)
// O link do rodapé usa o hash #termos-indicacao para que a URL possa ser
// compartilhada no fluxo de indicação e já abrir o termo ao carregar a página.
function setupReferralTermsModal() {
    const HASH = '#termos-indicacao';
    const modal = document.getElementById('referral-terms-modal');
    const openBtn = document.getElementById('open-referral-terms');
    const closeBtn = document.getElementById('referral-terms-close');
    if (!modal || !openBtn || !closeBtn) return;

    let lastFocused = null;

    function openModal(updateHash = true) {
        lastFocused = document.activeElement;
        modal.classList.remove('tw-hidden');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
        if (updateHash && window.location.hash !== HASH) {
            history.replaceState(null, '', HASH);
        }
    }

    function closeModal() {
        modal.classList.add('tw-hidden');
        document.body.style.overflow = '';
        if (window.location.hash === HASH) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        if (lastFocused) lastFocused.focus();
    }

    openBtn.addEventListener('click', e => { e.preventDefault(); openModal(); });
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.classList.contains('tw-hidden')) closeModal();
    });

    if (window.location.hash === HASH) openModal(false);
    window.addEventListener('hashchange', () => {
        if (window.location.hash === HASH) openModal(false);
    });
}

// ============================================================
// INITIALIZATION: Load deferred features after page loads
// ============================================================
// Use requestIdleCallback for non-critical features if available
const loadDeferredFeatures = () => {
    setupAccordion();
    setupModuleSlider();
    setupLazyCalculator();
    setupTestimonialsCarousel();
    setupGlowEffect();
    setupEcosysTimeline();
    setupEcosysCollapse();
    setupCtaBannerAnimation();
    setupNewsReveal();
    setupNewsCarousel();
    setupCalcChart();
    setupReferralTermsModal();
};

if ('requestIdleCallback' in window) {
    requestIdleCallback(loadDeferredFeatures, { timeout: 2000 });
} else {
    // Fallback for browsers that don't support requestIdleCallback
    window.addEventListener('load', loadDeferredFeatures);
}
