// Inicializar audio al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Crear un contexto de audio para "desbloquear" el audio en dispositivos móviles
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Preparar el audio cuando el usuario interactúe con la página
  document.addEventListener('click', function initAudio() {
    // Crear un oscilador silencioso para activar el contexto de audio
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.start(0);
    oscillator.stop(0.001); // Solo 1ms de sonido silencioso
    
    // Precargar nuestro sonido real
    const sonido = document.getElementById('sonido-carta');
    sonido.load(); // Asegurarse de que está cargado
    
    console.log("Audio desbloqueado");
    
    // Eliminar este evento después de la primera interacción
    document.removeEventListener('click', initAudio);
  });
});

function abrirSobre() {
  const sobre = document.querySelector('.sobre');
  const corazones = document.querySelector('.corazones');
  const corazonesItems = document.querySelectorAll('.corazon');
  const sonido = document.getElementById('sonido-carta');

  sobre.classList.toggle('abierto');
  
  if (sobre.classList.contains('abierto')) {
    // Intentar reproducir el sonido utilizando diferentes métodos
    try {
      // Método 1: Usando HTMLAudioElement directamente
      sonido.currentTime = 0;
      sonido.volume = 1.0; // Asegurarse de que el volumen está al máximo
      
      // Intentar reproducir y manejar errores
      let playPromise = sonido.play();
      
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          console.log("Sonido reproducido correctamente");
        })
        .catch(error => {
          console.error("Error reproduciendo sonido:", error);
          // Intentar método alternativo
          reproducirSonidoAlternativo();
        });
      } else {
        // Si play() no devuelve una promesa (navegadores antiguos)
        reproducirSonidoAlternativo();
      }
    } catch (e) {
      console.error("Error al intentar reproducir sonido:", e);
      reproducirSonidoAlternativo();
    }
    
    // Mostrar los corazones con un pequeño retraso
    setTimeout(() => {
      corazones.classList.add('mostrar');
      
      // Reiniciar animación de cada corazón
      corazonesItems.forEach(corazon => {
        corazon.style.animation = 'none';
        void corazon.offsetWidth; // Forzar reflow
        corazon.style.animation = null; // Restaurar animación definida en CSS
      });
    }, 300);
  } else {
    corazones.classList.remove('mostrar');
  }
}

// Función alternativa para reproducir sonido usando Web Audio API
function reproducirSonidoAlternativo() {
  console.log("Intentando método alternativo de reproducción...");
  
  // Comprobar si ya existe un contexto de audio
  if (!window.audioContext) {
    try {
      window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.error("No se pudo crear el contexto de audio:", e);
      return; // Fallar silenciosamente
    }
  }
  
  // Crear un oscilador para un sonido simple de "pop"
  const oscillator = window.audioContext.createOscillator();
  const gainNode = window.audioContext.createGain();
  
  // Configurar el oscilador
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, window.audioContext.currentTime); // Nota A4
  oscillator.frequency.exponentialRampToValueAtTime(880, window.audioContext.currentTime + 0.1); // Deslizar a A5
  
  // Configurar el volumen
  gainNode.gain.setValueAtTime(0, window.audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.7, window.audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, window.audioContext.currentTime + 0.1);
  
  // Conectar nodos
  oscillator.connect(gainNode);
  gainNode.connect(window.audioContext.destination);
  
  // Reproducir y detener
  oscillator.start();
  oscillator.stop(window.audioContext.currentTime + 0.1);
  
  console.log("Sonido alternativo generado");
}
