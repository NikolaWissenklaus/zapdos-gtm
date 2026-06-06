console.log('%c [Zapdos] Init ', 'background: #ffffff; color: black; padding: 3px 8px; border-radius: 4px; font-weight: bold; border-left: 3px solid #ddff00;');

function findGTMMessageArray() {
    const gtm = window.google_tag_manager;
    if (!gtm) return null;

    for (const key in gtm) {
        const subObj = gtm[key];
        if (typeof subObj === 'object' && subObj !== null) {
            for (const subKey in subObj) {
                const target = subObj[subKey];
                if (Array.isArray(target) && target.length > 0 && target[0].hasOwnProperty('message')) {
                    return target; 
                }
            }
        }
    }
    return null;
}

function renderGTMTag(e, badgeTexto, isRealTime = false) {
    if (!e.message) return;

    const type = e.message['0'] || 'Desconhecido';
    let en = e.message['1'] || '';
    const params = e.message['2'] || {};
    let stream_id = 'Padrão da Propriedade';

    if (type === 'config') {
        stream_id = en; 
        en = 'config_setup';
    } else if (params.send_to) {
        stream_id = params.send_to;
    }

    const styleTag = isRealTime 
        ? 'background: #111; color: #ddff00; padding: 3px 6px; border-radius: 3px; font-weight: bold; border: 1px solid #ddff00;' 
        : 'background: #111; color: #ddff00; padding: 3px 6px; border-radius: 3px; font-weight: bold; border: 1px solid #ddff00;';
    
    console.groupCollapsed(`%c ${badgeTexto}: ${en} | ID: ${stream_id}`, styleTag);
    
    console.log('%c▪ Tipo de Disparo:', 'color: #3498db; font-weight: bold;', type);
    console.log('%c▪ Nome do Evento:', 'color: #2ecc71; font-weight: bold;', en);

    if (Object.keys(params).length > 0) {
        console.groupCollapsed('%c📦 Parâmetros Anexados', 'color: #e67e22; font-weight: bold;');
        
        for (const [key, val] of Object.entries(params)) {
            if (Array.isArray(val)) {
                console.groupCollapsed(`%c 🛒 Lista: ${key} (${val.length} itens)`, 'color: #f1c40f; font-weight: bold; font-size: 11px;');
                val.forEach((item, idx) => {
                    if (typeof item === 'object' && item !== null) {
                        const itemName = item.item_name || item.name || item.id || item.item_id || `Item ${idx}`;
                        console.groupCollapsed(`%c📦 [${idx}] ${itemName}`, 'color: #fdcb6e; font-size: 11px;');
                        for (const [propKey, propVal] of Object.entries(item)) {
                            const valStyle = typeof propVal === 'number' ? 'color: #66ff66; font-weight: bold;' : 'color: #ecf0f1;';
                            console.log(`%c▪ ${propKey}: %c${propVal}`, 'color: #f1c40f; font-weight: bold;', valStyle);
                        }
                        console.groupEnd();
                    } else {
                        console.log(`%c[${idx}]: %c${item}`, 'color: #f1c40f; font-weight: bold;', 'color: #ecf0f1;');
                    }
                });
                console.groupEnd();
            } 
            else if (typeof val === 'object' && val !== null) {
                console.groupCollapsed(`%c 🧩 Objeto: ${key}`, 'color: #00cec9; font-weight: bold; font-size: 11px;');
                for (const [propKey, propVal] of Object.entries(val)) {
                    const valStyle = typeof propVal === 'number' ? 'color: #66ff66; font-weight: bold;' : 'color: #ecf0f1;';
                    console.log(`%c▪ ${propKey}: %c${propVal}`, 'color: #00cec9; font-weight: bold;', valStyle);
                }
                console.groupEnd();
            } 
            else {
                const valStyle = typeof val === 'number' ? 'color: #66ff66; font-weight: bold;' : 'color: #ecf0f1;';
                console.log(`%c▪ ${key}: %c${val}`, 'color: #e67e22; font-weight: bold;', valStyle);
            }
        }
        console.groupEnd();
    } else {
        console.log('%c▪ Parâmetros: (Nenhum parâmetro extra enviado)', 'color: #95a5a6; font-style: italic;');
    }
    
    console.groupEnd();
}

let isGtmListening = false;

function attachRealTimeListener() {
    const tagArray = findGTMMessageArray();
    if (tagArray && !isGtmListening) {
        const originalPush = tagArray.push;
        
        tagArray.push = function(...args) {
            originalPush.apply(this, args); 
            renderGTMTag(args[0], '⚡ zapdos_view', true); 
        };
        
        isGtmListening = true;
        console.log('%c [Zapdos] Pronto! Monitorando o GTM ⚡ ', 'background: #ddff00; color: black; padding: 3px 8px; border-radius: 4px; font-weight: bold;');
    }
}

const gtmPoller = setInterval(() => {
    if (findGTMMessageArray()) {
        attachRealTimeListener();
        clearInterval(gtmPoller); 
    }
}, 500);

function zapdos_agora() {
    const tagArray = findGTMMessageArray();

    if (!tagArray) {
        console.log('%c [GTM Inspector] Nenhuma tag foi processada internamente ainda ou o array está vazio.', 'color: #e74c3c; font-weight: bold; font-style: italic;');
        return;
    }

    console.log(`%c 🗂️ [GTM Inspector] Histórico Interno de Tags (${tagArray.length} disparos) `, 'background: #2c3e50; color: #ddff00; padding: 4px 8px; border-radius: 4px; font-weight: bold; border-left: 3px solid #ddff00; margin-top: 10px;');

    tagArray.forEach(function(e) {
        renderGTMTag(e, '🏷️', false);
    });
};
