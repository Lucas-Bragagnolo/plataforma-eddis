// Navegación de tabs para el bottombar móvil
window.addEventListener('DOMContentLoaded', function () {
  // Navegación accesible y funcional para todos los botones de la nueva bottombar
  const bottombarBtns = document.querySelectorAll('#bottombar .bottombar-btn');
  bottombarBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      setBottombarActive(btn);
      const tabName = btn.getAttribute('data-tab');
      if (tabName) {
        const tab = document.querySelector(`[data-tab="${tabName}"]`);
        if (tab) tab.click();
      } else if (btn.id === 'campusMobileBtn') {
        // El evento se maneja en script.js con abrirCampus()
      } else if (btn.id === 'cerrarSesionBtn') {
        const tab = document.querySelector('[data-tab="tab-configuracion"]');
        if (tab) tab.click();
      }
    });
  });
  // Set initial active
  setInitialBottombarActive();
  // Observer para sincronizar la bottom bar con el tab visible
  const tabContents = document.querySelectorAll('.tab-content');
  if (tabContents.length) {
    const observer = new MutationObserver(() => {
      setInitialBottombarActive();
    });
    tabContents.forEach(tab => {
      observer.observe(tab, { attributes: true, attributeFilter: ['class'] });
    });
  }
});

function setBottombarActive(activeBtn) {
  document.querySelectorAll('#bottombar .bottombar-btn').forEach(btn => {
    btn.classList.remove('bottombar-active');
  });
  if (activeBtn) activeBtn.classList.add('bottombar-active');
}

function setInitialBottombarActive() {
  // Marca activo el botón correspondiente al tab visible
  const visibleTab = document.querySelector('.tab-content:not(.hidden)');
  if (visibleTab) {
    let tabName = visibleTab.id;
    let btn = document.querySelector(`#bottombar .bottombar-btn[data-tab="${tabName}"]`);
    // Si el tab visible es de perfil/configuración, buscar el botón de perfil
    if (tabName === 'tab-configuracion') {
      btn = document.querySelector('#bottombar #cerrarSesionBtn');
    }
    setBottombarActive(btn);
  }
}


