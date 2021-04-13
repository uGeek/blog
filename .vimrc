set encoding=utf-8
set nocompatible "no utilizar vi"
filetype plugin indent on


setlocal spell spelllang=es,ca

syntax on "Resaltar sitaxis"

set ignorecase "ignorar en búsqueda entre mayúsculas o minúsculas" 
set hlsearch   "resaltar palabras en la búsqueda"
set incsearch  "búsqueda incremental"


set autoindent   "autoidentado"
set shiftwidth=4 "identado y espacios"

set tabstop=4    "tabulado 4 espacios"



set mouse+=a   "copiar desde ratón"
set paste      "copiar si copiar los números de línea"
 
set pastetoggle=<F9>  


set number
set relativenumber

set cursorline
set cursorcolumn

set textwidth=80
set colorcolumn=+1



" Instalar Plugins: curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
" abre vim y escribe :PlugInstall

call plug#begin('~/.vim/plugged')
"===============================
"Plug 'itchyny/lightline.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" Cursor pequeño
Plug 'wincent/terminus'

Plug 'jceb/vim-orgmode'
" Plug 'axvr/org.vim' 
"===============================
"Plug 'godlygeek/tabular'
"Plug 'plasticboy/vim-markdown'
"Plug 'dracula/dracula-theme'
 
call plug#end ()
