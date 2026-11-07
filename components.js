/**
 * components.js — Gerenciador de Componentes Modulares e Eventos
 * La Lechuza Coramar
 */

// 1. Carregador genérico assíncrono de componentes HTML
async function loadComponent(elementId, filePath) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Erro ao carregar componente ${filePath} (Status: ${response.status})`);
    }
    const html = await response.text();
    element.innerHTML = html;
  } catch (error) {
    console.error(`Falha no carregamento de ${filePath}:`, error);
  }
}

// 2. Destaca o link da página atual no menu de navegação
function highlightActiveNavLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-desktop a, .mobile-nav-links a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// 3. Inicializador de eventos do Header e Menu Lateral Mobile
function initializeHeader() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburgerBtn || !mobileDrawer) return;

  const openMenu = () => {
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (drawerOverlay) {
      drawerOverlay.classList.add('is-open');
      drawerOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (drawerOverlay) {
      drawerOverlay.classList.remove('is-open');
      drawerOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = mobileDrawer.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMenu);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMenu);
  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // Acessibilidade: fecha gaveta com a tecla Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

// 4. Inicializador de eventos do Footer
function initializeFooter() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// 5. Inicializador Principal dos Componentes Modulares
async function initComponents() {
  await Promise.all([
    loadComponent('site-header', 'header.html'),
    loadComponent('site-footer', 'footer.html')
  ]);

  // Inicializa eventos e comportamentos após injeção no DOM
  initializeHeader();
  initializeFooter();
  highlightActiveNavLinks();
}

// Execução segura: aguarda DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComponents);
} else {
  initComponents();
}
