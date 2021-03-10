# Tu PornHub privado se llama Stash

Stash se describe así mismo como un servicio que te permite organizar y ver tu propia colección de archivos de imágenes y videos para adultos. Piense en ello como un sitio privado de PornHub para su colección de pornografía personal.

Cada archivo de video tiene su propia escena. Las escenas se pueden clasificar y etiquetar con artistas, etiquetas, películas y por estudio.

Marque sus partes favoritas de una escena con marcadores. Los marcadores se pueden etiquetar y aparecen en el depurador de video al ver una escena.

Las colecciones de imágenes comprimidas se pueden ver como galerías.

Obtenga una vista previa y vea todas sus escenas y galerías desde su navegador web en su PC, tablet o teléfono. Stash transmite videos directamente a su navegador web. Stash admite la transmisión de una gran variedad de formatos y códecs a la mayoría de los navegadores web.

Califica tus escenas y etiquétalas con artistas, etiquetas, películas y estudios. Filtre y ordene su contenido con una variedad de filtros y opciones de clasificación.

Stash también le permite derivar metadatos de escenas a partir de nombres de archivos de video. Alternativamente, puede extraer metadatos de escenas de sitios web utilizando raspadores seleccionados por la comunidad.

Lo mejor de todo, Stash esta desarrollado por voluntarios y tiene licencia de GNU AGPL. Esto significa que es y siempre será gratis.

## docker-compose para Raspberry, ARM, amd64,...

```
# APPNICENAME=Stash
# APPDESCRIPTION=An organizer for your porn, written in Go
version: '3.4'
services:
  stash:
    image: stashapp/stash:latest
    restart: unless-stopped
    ports:
      - "9999:9999"
    logging:
      driver: "json-file"
      options:
        max-file: "10"
        max-size: "2m"
    environment:
      - STASH_STASH=/data/
      - STASH_GENERATED=/generated/
      - STASH_METADATA=/metadata/
      - STASH_CACHE=/cache/
    volumes:
      - /etc/localtime:/etc/localtime:ro
      ## Adjust below paths (the left part) to your liking.
      ## E.g. you can change ./config:/root/.stash to ./stash:/root/.stash
      
      ## Keep configs here.
      - $HOME/docker/stash/config:/root/.stash
      ## Point this at your collection.
      - /x:/data
      ## This is where your stash's metadata lives
      - $HOME/docker/stash/metadata:/metadata
      ## Any other cache content.
      - $HOME/docker/stash/cache:/cache
      ## Where to store generated content (screenshots,previews,transcodes,sprites)
      - $HOME/docker/stash/generated:/generated
```

## Fuentes

* https://github.com/stashapp/stash
* https://stashapp.cc/
