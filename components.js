/**
 * components.js — Gerenciador de Componentes Modulares e Eventos
 * La Lechuza Coramar
 */

// 1. Carregador genérico assíncrono de componentes
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

// 2. Inicializador de eventos do Header (Menu Hambúrguer, Botão Fechar e Drawer Mobile)
function initializeHeader() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!mobileDrawer) return;

  function toggleDrawer(open) {
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('is-open');
    
    if (hamburgerBtn) {
      hamburgerBtn.classList.toggle('is-active', shouldOpen);
      hamburgerBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
    
    mobileDrawer.classList.toggle('is-open', shouldOpen);
    mobileDrawer.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
    
    if (drawerOverlay) {
      drawerOverlay.classList.toggle('is-open', shouldOpen);
    }
    
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer(false);
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => toggleDrawer(false));
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      toggleDrawer(false);
    }
  });
}

// 3. Inicializador de eventos do Footer (Ano dinâmico)
function initializeFooter() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// 4. Inicializador Principal
async function initComponents() {
  await Promise.all([
    loadComponent('site-header', 'header.html'),
    loadComponent('site-footer', 'footer.html')
  ]);

  // Inicializa os scripts apenas após o HTML estar completamente injetado no DOM
  initializeHeader();
  initializeFooter();
}

// Execução ao carregar a página
document.addEventListener('DOMContentLoaded', initComponents);