# ⚡ Zapdos: GTM Internal Tag Inspector

**Zapdos** é um script utilitário em JavaScript desenvolvido para engenheiros de dados e analistas de Web Analytics que precisam auditar o coração do Google Tag Manager (GTM). 

Diferente do *dataLayer* (que mostra o que a página envia) ou da aba *Network* (que mostra o que sai para o servidor), o Zapdos intercepta a **engine interna do GTM**, revelando exatamente quais tags o contêiner está processando e formatando antes do disparo final.

## 🎯 O Problema que o Zapdos Resolve

O GTM ofusca e minifica seu código constantemente para otimização de performance. O array interno que armazena os disparos pode se chamar `mb.m` hoje e `zx.q` amanhã, quebrando scripts de monitoramento estáticos. 
O **Zapdos** possui um algoritmo "caçador" dinâmico que vasculha o objeto `window.google_tag_manager` e encontra o array de processamento automaticamente, tornando o script **à prova de atualizações do Google**.

## ✨ Funcionalidades

* **Escuta Dinâmica em Tempo Real:** Utiliza um *poller* inteligente para aguardar o GTM carregar e, em seguida, injeta um ouvinte no método `.push()` interno. Cada nova tag processada pisca no console com a etiqueta `⚡ zapdos_view`.
* **Tradução de Configurações:** Separa inteligentemente disparos de inicialização (`config_setup`) de eventos regulares, extraindo o ID da propriedade (ex: `G-XXXXX` ou `AW-XXXXX`) e o colocando em destaque no título da gaveta.
* **Formatador de E-commerce Nativo 🛒:** Detecta automaticamente arrays complexos (como listas de `items`) e os transforma em pastas retráteis organizadas. Ele extrai o `item_name` ou `item_id` para o título da sub-pasta, evitando que você precise abrir item por item para encontrar um produto.
* **Histórico Retroativo:** Perdeu os disparos que aconteceram durante o carregamento da página? Chame a função `Zapdos_agora()` e o script desenhará todo o passado na sua tela.

## 🚀 Como Instalar e Usar

A forma ideal de utilizar o Zapdos é salvando-o como um **Snippet** nativo no seu navegador.

1. Abra o painel DevTools (`F12` ou `Ctrl + Shift + I`).
2. Acesse a aba **Sources** (Fontes) e abra a sub-aba **Snippets** no painel lateral.
3. Clique em **+ New snippet**, nomeie como `Zapdos`.
4. Cole o código fonte do arquivo `zapdos.js` e salve (`Ctrl + S` / `Cmd + S`).

**Para rodar:**
Em qualquer página que possua o GTM instalado, abra o DevTools, aperte `Ctrl + P` (ou `Cmd + P`), digite `!Zapdos` e dê Enter. Navegue pelo site e veja as tags do GTM brotando em tempo real!

## 🛠️ Comandos Globais

Se você precisar revisar as tags que foram processadas *antes* da injeção do Zapdos ou quiser gerar um relatório rápido da sessão atual, digite no console:

```javascript
Zapdos_agora()
