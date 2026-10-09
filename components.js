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

// 2. Inicializador de eventos do Header (Com auto-fechamento e rolagem)
function initializeHeader() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link'); // Captura os links da gaveta

  if (hamburgerBtn && mobileDrawer) {
    // Alterna o estado do menu (Abre/Fecha)
    const toggleMenu = (event) => {
      if (event) event.stopPropagation(); // Evita conflitos de clique duplo
      hamburgerBtn.classList.toggle('is-active');
      mobileDrawer.classList.toggle('is-open');
      if (drawerOverlay) drawerOverlay.classList.toggle('is-open');
    };

    // Força o fechamento do menu
    const closeMenu = () => {
      hamburgerBtn.classList.remove('is-active');
      mobileDrawer.classList.remove('is-open');
      if (drawerOverlay) drawerOverlay.classList.remove('is-open');
    };

    // Abre o menu ao clicar nas 2 barras
    hamburgerBtn.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar no X ou no overlay escuro
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMenu);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMenu);

    // FECHA O MENU AUTOMATICAMENTE AO CLICAR EM QUALQUER LINK
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
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