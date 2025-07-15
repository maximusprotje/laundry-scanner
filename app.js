const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapBtn = document.getElementById('snap');
const binsDiv = document.getElementById('bins');

// 1. Vraag camera-toegang
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
  .then(stream => { video.srcObject = stream })
  .catch(err => alert('Geen camera-toegang: ' + err));

// 2. Foto maken en tonen bak-knoppen
snapBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  binsDiv.style.display = 'block';
});

// 3. Als gebruiker een bak kiest, stuur snapshot + bin
document.querySelectorAll('.bin').forEach(btn => {
  btn.addEventListener('click', async e => {
    const bin = e.target.dataset.bin;
    canvas.toBlob(async blob => {
      const form = new FormData();
      form.append('bin', bin);
      form.append('image', blob, 'scan.jpg');
      try {
        await fetch('http://213.119.206.157:8000/api/sort', {
          method: 'POST',
          body: form
        });
        alert(`Verzonden naar bak ${bin}!`);
      } catch (err) {
        alert('Fout bij verzenden: ' + err);
      }
    }, 'image/jpeg', 0.8);
  });
});
