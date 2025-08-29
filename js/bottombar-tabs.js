// Navegación de tabs para el bottombar móvil
window.addEventListener('DOMContentLoaded', function () {
  // Cursos
  const btnCursos = document.querySelector('#bottombar [data-tab="tab-cursos-actuales"]');
  if (btnCursos) {
    btnCursos.addEventListener('click', function () {
      setBottombarActive(btnCursos);
      const tab = document.querySelector('[data-tab="tab-cursos-actuales"]');
      if (tab) tab.click();
    });
  }
  // Perfil
  const btnPerfil = document.querySelector('#bottombar #cerrarSesionBtn');
  if (btnPerfil) {
    btnPerfil.addEventListener('click', function () {
      setBottombarActive(btnPerfil);
      const tab = document.querySelector('[data-tab="tab-configuracion"]');
      if (tab) tab.click();
    });
  }
  // Set initial active
  setInitialBottombarActive();
});

function setBottombarActive(activeBtn) {
  document.querySelectorAll('#bottombar button').forEach(btn => {
    btn.classList.remove('bottombar-active');
  });
  if (activeBtn) activeBtn.classList.add('bottombar-active');
}

function setInitialBottombarActive() {
  // Marca activo el botón correspondiente al tab visible
  const tabCursos = document.querySelector('#bottombar [data-tab="tab-cursos-actuales"]');
  const tabPerfil = document.querySelector('#bottombar #cerrarSesionBtn');
  if (document.getElementById('tab-cursos-actuales')?.style.display !== 'none') {
    setBottombarActive(tabCursos);
  } else {
    setBottombarActive(tabPerfil);
  }
}

