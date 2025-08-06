document.addEventListener('DOMContentLoaded', () => {
  const tree = document.getElementById('encyclopedia');
  const inputRicerca = document.getElementById('search-input');
  const btnRicerca = document.getElementById('search-btn');
  const btnClear = document.getElementById('clear-btn');
  const toggleBtn = document.getElementById('toggle-theme');
  const btnCarica = document.getElementById("load");


  // Applica il tema salvato
  if (localStorage.getItem('tema') === 'scuro') {
    document.body.classList.add('dark-mode');
  }

  // CAMBIO TEMA
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('tema', isDark ? 'scuro' : 'chiaro');
  });

  
/////////////////////////////////////////////////////////////////////////
// chiudi tutto(dopo chiusura ricerca)
  function chiudiTutti() {
    document.querySelectorAll('.content.expanded').forEach(c => c.classList.remove('expanded'));
    document.querySelectorAll('.title.expanded').forEach(t => t.classList.remove('expanded'));
  }
// caricare nel local storage
  function caricaAlbero() {
    const salvato = localStorage.getItem('alberoEnciclopedia');
    if (salvato) {
      tree.innerHTML = salvato;
    }
  }

  caricaAlbero();
  chiudiTutti();




  //Ricerca
  btnRicerca.addEventListener('click', () => {
    chiudiTutti();
    const query = inputRicerca.value.trim().toLowerCase();
    if (!query) return;
    document.querySelectorAll('.title').forEach(t => {
      const text = t.firstChild.textContent.toLowerCase();
      if (text.includes(query)) {
        t.classList.add('highlight');
        let el = t;
        while (el && !el.classList.contains('main-item')) {
          el = el.parentElement.closest('.content');
          if (el) el.classList.add('expanded');
        }
        t.classList.add('expanded');
      } else {
        t.classList.remove('highlight');
        const cont = t.nextElementSibling;
        if (cont && cont.classList.contains('expanded')) cont.classList.remove('expanded');
      }
    });
  });
inputRicerca.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnRicerca.click();
    }
  });

  btnClear.addEventListener('click', () => {
    inputRicerca.value = '';
    document.querySelectorAll('.title').forEach(t => t.classList.remove('highlight') && t.classList.remove('expanded'));
  });

  btnCarica.addEventListener('click', async () => {
    try {
      const response = await fetch("/api/get");
      const data = await response.json();
      encyclopedia.innerHTML = data.html || "";
      reinitTree();
    } catch (err) {
      alert("❌ Errore durante il caricamento: " + err.message);
    }
  });

});
