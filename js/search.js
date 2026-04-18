document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('tipue_search_input');
    const searchContent = document.getElementById('tipue_search_content');
    
    if (!searchInput || !searchContent) return;

    let metadata = [];

    // 1. Detectar inteligentemente la ruta en la que estamos
    const currentPath = window.location.pathname;
    const isSubDir = currentPath.includes('/post/') || currentPath.includes('/posts/');
    const metadataUrl = isSubDir ? '../metadata.json' : 'metadata.json';

    // 2. Inyectar estilos para la scrollbar
    const styleId = 'tipue-search-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #tipue_search_content::-webkit-scrollbar { width: 6px; height: 6px; }
            #tipue_search_content::-webkit-scrollbar-track { background: #1a1a1a; }
            #tipue_search_content::-webkit-scrollbar-thumb { background-color: #444; border-radius: 10px; }
        `;
        document.head.appendChild(style);
    }

    // 3. Mover el contenedor de resultados al final del body
    document.body.appendChild(searchContent);

    // Ajustar el input a una tipografía normalizada
    searchInput.style.fontFamily = 'Arial, sans-serif';
    searchInput.style.fontSize = '1rem';
    searchInput.style.padding = '10px 14px';

    // 4. Aplicar estilos integrando los del CSS
    searchContent.style.position = 'absolute';
    searchContent.style.width = '80vw'; 
    searchContent.style.left = '50%';
    searchContent.style.transform = 'translateX(-50%)';
    searchContent.style.maxHeight = '500px';
    searchContent.style.overflowY = 'auto';
    searchContent.style.backgroundColor = '#111';
    searchContent.style.border = '1px solid #2a2a2a';
    searchContent.style.borderRadius = '12px';
    searchContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
    searchContent.style.zIndex = '9999';
    searchContent.style.display = 'none'; 
    searchContent.style.textAlign = 'left';
    searchContent.style.fontFamily = 'Arial, sans-serif';

    const updatePosition = () => {
        const rect = searchInput.getBoundingClientRect();
        searchContent.style.top = `${rect.bottom + window.scrollY + 10}px`;
    };

    // 5. Cargar los datos de metadata.json
    fetch(metadataUrl)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar metadata.json');
            return response.json();
        })
        .then(data => {
            metadata = data;
        })
        .catch(error => console.error('Error cargando buscador:', error));

    // --- ALGORITMO DE BÚSQUEDA DIFUSA (LEVENSHTEIN) ---
    const getLevenshteinDistance = (a, b) => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, 
                        matrix[i][j - 1] + 1,     
                        matrix[i - 1][j] + 1      
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    const getFuzzyScore = (query, item) => {
        const lowerQuery = query.toLowerCase().trim();
        const title = (item.title || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        
        if (title.includes(lowerQuery)) return 100;
        if (desc.includes(lowerQuery)) return 50;

        const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);
        const titleWords = title.split(/\W+/).filter(w => w.length > 0);
        const descWords = desc.split(/\W+/).filter(w => w.length > 0);

        let score = 0;

        const matchesAll = queryWords.every(qWord => {
            const maxTypos = qWord.length <= 3 ? 0 : (qWord.length <= 5 ? 1 : 2);
            
            const foundInTitle = titleWords.some(tWord => {
                if (tWord.includes(qWord)) return true;
                if (maxTypos > 0 && Math.abs(tWord.length - qWord.length) <= maxTypos) {
                    return getLevenshteinDistance(qWord, tWord) <= maxTypos;
                }
                return false;
            });

            if (foundInTitle) { 
                score += 20; 
                return true; 
            }

            const foundInDesc = descWords.some(dWord => {
                if (dWord.includes(qWord)) return true;
                if (maxTypos > 0 && Math.abs(dWord.length - qWord.length) <= maxTypos) {
                    return getLevenshteinDistance(qWord, dWord) <= maxTypos;
                }
                return false;
            });

            if (foundInDesc) { 
                score += 10; 
                return true; 
            }

            return false;
        });

        return matchesAll ? score : 0;
    };

    // --- FUNCIONES PARA RESALTADO ESTILO GOOGLE ---
    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])
        );
    };

    const getSnippet = (text, query) => {
        if (!text) return '';
        const terms = query.trim().toLowerCase().split(/\s+/).filter(w => w.length > 0);
        if (terms.length === 0) return text.length > 150 ? text.substring(0, 150) + '...' : text;
        
        const lowerText = text.toLowerCase();
        let firstMatchIdx = -1;
        
        for (const term of terms) {
            const idx = lowerText.indexOf(term);
            if (idx !== -1) {
                firstMatchIdx = idx;
                break;
            }
        }
        
        if (firstMatchIdx === -1) return text.length > 150 ? text.substring(0, 150) + '...' : text;
        
        const start = Math.max(0, firstMatchIdx - 60);
        const end = Math.min(text.length, firstMatchIdx + 90);
        let snippet = text.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
        
        return snippet;
    };

    const highlightText = (text, query) => {
        let escapedText = escapeHTML(text);
        if (!query.trim()) return escapedText;

        const terms = query.trim().split(/\s+/).filter(w => w.length > 0)
            .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); 
        
        if (terms.length === 0) return escapedText;

        const regex = new RegExp('(' + terms.join('|') + ')', 'gi');
        // Utiliza el color morado proporcionado en la imagen como fondo, y texto blanco para contraste
        return escapedText.replace(regex, '<span style="color: #ffffff; font-weight: bold; background-color: #673ab7; padding: 0 4px; border-radius: 4px;">$1</span>');
    };
    // ----------------------------------------------

    // 6. Función para renderizar los resultados
    const renderResults = (query) => {
        searchContent.innerHTML = '';
        
        if (!query.trim()) {
            searchContent.style.display = 'none';
            return;
        }

        updatePosition();
        
        const results = metadata
            .map(item => ({ ...item, score: getFuzzyScore(query, item) }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);

        if (results.length > 0) {
            const ul = document.createElement('ul');
            ul.style.listStyleType = 'none';
            ul.style.padding = '0';
            ul.style.margin = '0';

            results.forEach(item => {
                const li = document.createElement('li');
                li.style.borderBottom = '1px solid #2a2a2a';
                
                const dirPrefix = isSubDir ? '' : 'posts/';
                const datePart = item.date ? item.date.split(' ')[0] : '';
                const fileName = item.fileName ? item.fileName : item.title.toLowerCase().replace(/ /g, '-');
                const postUrl = `${dirPrefix}${datePart}-${fileName}.html`;

                const a = document.createElement('a');
                a.href = postUrl;
                a.style.display = 'block';
                a.style.padding = '18px 20px';
                a.style.textDecoration = 'none';
                a.style.transition = 'background 0.2s';
                
                a.addEventListener('mouseover', () => a.style.backgroundColor = '#1a1a1a');
                a.addEventListener('mouseout', () => a.style.backgroundColor = 'transparent');

                const titleDiv = document.createElement('div');
                titleDiv.style.fontWeight = 'bold';
                titleDiv.style.fontSize = '1.1rem';
                titleDiv.style.marginBottom = '6px';
                titleDiv.style.color = '#fff';
                // Resaltar título
                titleDiv.innerHTML = highlightText(item.title, query);

                const descDiv = document.createElement('div');
                descDiv.style.fontSize = '0.9rem'; 
                descDiv.style.lineHeight = '1.7'; 
                descDiv.style.color = '#d4d4d4'; 
                // Extraer fragmento relevante y resaltarlo
                const snippet = getSnippet(item.description, query);
                descDiv.innerHTML = highlightText(snippet, query);

                a.appendChild(titleDiv);
                a.appendChild(descDiv);
                li.appendChild(a);
                ul.appendChild(li);
            });
            
            if (ul.lastChild) {
                ul.lastChild.style.borderBottom = 'none';
            }

            searchContent.appendChild(ul);
            searchContent.style.display = 'block';
        } else {
            searchContent.innerHTML = '<div style="padding: 20px; color: #ccc; font-size: 0.9rem; text-align: center;">No se encontraron resultados.</div>';
            searchContent.style.display = 'block';
        }
    };

    // 7. Escuchar el evento de escritura en el input
    searchInput.addEventListener('input', (e) => {
        renderResults(e.target.value);
    });

    // 8. Ocultar resultados al hacer clic fuera del buscador
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchContent.contains(e.target)) {
            searchContent.style.display = 'none';
        }
    });

    // 9. Volver a mostrar resultados al enfocar el input si hay texto
    searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim()) {
            updatePosition();
            searchContent.style.display = 'block';
        }
    });
    
    // 10. Actualizar la posición si la ventana cambia de tamaño
    window.addEventListener('resize', () => {
        if (searchContent.style.display === 'block') {
            updatePosition();
        }
    });
});
