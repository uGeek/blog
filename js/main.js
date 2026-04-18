function initCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((pre) => {
        const container = document.createElement('div');
        container.className = 'code-container';
        pre.parentNode.insertBefore(container, pre);
        container.appendChild(pre);
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '📋 Copiar';
        container.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', () => {
            const code = pre.querySelector('code');
            const textToCopy = code ? code.textContent : pre.textContent;
            
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            copyBtn.textContent = '✅ Copiado!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = '📋 Copiar';
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    });
}

document.addEventListener('DOMContentLoaded', initCopyButtons);