function initCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((pre) => {
        // Creamos el botón
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copiar';
        
        // Insertamos el botón directamente dentro de la cajetilla <pre>.
        // Como tu CSS ya tiene 'position: relative' en el pre, el botón se ubicará perfectamente en su esquina superior derecha.
        pre.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', () => {
            // Extraemos el texto a copiar asegurándonos de no incluir el texto del propio botón "📋 Copiar"
            const code = pre.querySelector('code');
            let textToCopy = '';
            
            if (code) {
                textToCopy = code.textContent;
            } else {
                // Si por algún motivo no hay etiqueta <code>, clonamos el pre y borramos el botón antes de copiar el texto
                const clone = pre.cloneNode(true);
                const btn = clone.querySelector('.copy-btn');
                if (btn) btn.remove();
                textToCopy = clone.textContent;
            }
            
            // Lógica de copiado
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Feedback visual de copiado exitoso
            copyBtn.textContent = '✅ Copiado!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = 'Copiar';
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    });
}

document.addEventListener('DOMContentLoaded', initCopyButtons);
