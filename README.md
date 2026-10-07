# tayruni-kashitsu

Sitio estático (HTML/CSS/JS puro, sin build ni dependencias) publicado con GitHub Pages
desde la rama `main`. Para verlo local: abrir `index.html` en el navegador, o
`python3 -m http.server 8000` y entrar a `localhost:8000`.

## Estructura
- `index.html` — todo el contenido y las secciones (hero, sobre mí, personajes, carrusel, eventos, contacto)
- `style.css` — estilos. Ojo: el tamaño del carrusel (`.carousel-container`) se define
	4 veces (base + 3 media queries para tablet/móvil). Si lo cambiás, actualizá las 4.
- `script.js` — navbar, menú, reveal on scroll, carrusel, lightbox
- `images/` — todas las fotos

## Convenciones de imágenes
- Nombradas por personaje + número: `Ahri0.jpg`, `Ahri1.png`, etc. El número no indica
	orden de carga, el orden real está en el `<div class="carousel-slide">` de cada uno en index.html.
- Algunas `.png` son en realidad JPEG reencodeado (no importa para el navegador, pero si
	se abren con una librería que valida el formato por extensión, van a fallar).
- Las fotos marcadas como "Edición digital" en el sitio tienen fondo/escenario generado
	con IA; el traje y la persona son reales. Esto se declara con `.photo-tag` sobre la imagen.