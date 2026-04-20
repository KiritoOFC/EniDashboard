javascript:(function(){
    if(document.getElementById('eni-chat-root')) return;
    const ST = {
        t: null, w: null, p: null, m: false, msgs: [], view: 'chat',
        supabaseUrl: 'https://ypdlnkrgjwsczaulkcxo.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZGxua3JnandzY3phdWxrY3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MjA4MzQsImV4cCI6MjA4OTA5NjgzNH0.UgQ7-EeKeDV6ANQ27SFhnH-YSz6VWn3KqWZGO8qDpnQ'
    };
    const THEME = {
        bg: 'rgba(10, 12, 18, 0.95)',
        card: 'rgba(30, 35, 50, 0.6)',
        accent: '#8b5cf6',
        accent2: '#d946ef',
        accent3: '#06b6d4',
        text: '#f8fafc',
        sub: '#94a3b8',
        border: 'rgba(255, 255, 255, 0.1)',
        glass: 'backdrop-filter: blur(24px) saturate(180%);'
    };
    function intercept(t, w, p) {
        let c = false;
        if (t && t.startsWith('eyJ') && t !== ST.t) { ST.t = t; c = true; }
        if (w && w !== ST.w) { ST.w = w; c = true; }
        if (p && /^[0-9a-f-]{36}$/i.test(p) && p !== ST.p) { ST.p = p; c = true; }
        if (c) ui();
    }
    const oF = window.fetch;
    window.fetch = function(...a) {
        const u = typeof a[0] === 'string' ? a[0] : a[0].url;
        const w = (u.match(/\/workspaces\/([a-z0-9_-]+)/i) || [])[1];
        const p = (u.match(/\/projects\/([0-9a-f-]{36})/i) || [])[1];
        const h = a[1]?.headers;
        let t = null;
        if (h instanceof Headers) t = h.get('authorization');
        else if (h) t = h['Authorization'] || h['authorization'];
        if (t) t = t.replace('Bearer ', '');
        intercept(t, w, p);
        return oF.apply(this, a);
    };
    async function apiReq(path, body) {
        try {
            const res = await fetch(`${ST.supabaseUrl}/functions/v1/${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': ST.anonKey,
                    'Authorization': `Bearer ${ST.anonKey}`
                },
                body: JSON.stringify(body)
            });
            return await res.json();
        } catch (e) {
            return { success: false, error: 'Erro de conexão' };
        }
    }
    function showToast(m, type) {
        const t = document.createElement('div');
        t.className = `eni-toast ${type}`;
        t.innerHTML = `<span>${m}</span>`;
        document.body.appendChild(t);
        setTimeout(() => t.classList.add('hide'), 2500);
        setTimeout(() => t.remove(), 3000);
    }
    function updateMessages() {
        const c = document.getElementById('eni-msgs');
        if (!c) return;
        c.innerHTML = '';
        ST.msgs.forEach(m => {
            const g = document.createElement('div');
            g.className = `eni-bubble ${m.r === 'u' ? 'eni-user' : 'eni-bot'}`;
            g.innerHTML = `<div class="bubble-content">${escapeHtml(m.t)}</div>`;
            c.appendChild(g);
        });
        c.scrollTop = c.scrollHeight;
    }
    function escapeHtml(s) {
        return s.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
    }
    function ui() {
        let r = document.getElementById('eni-chat-root');
        if (!r) {
            r = document.createElement('div');
            r.id = 'eni-chat-root';
            document.body.appendChild(r);
            makeDraggable(r);
        }
        const ready = ST.t && (ST.p || ST.w);
        const css = `
            #eni-chat-root {
                position: fixed; bottom: 24px; right: 24px; width: 400px; max-height: 80vh;
                background: ${THEME.bg}; ${THEME.glass} border: 1px solid ${THEME.border};
                border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                z-index: 9999999; display: flex; flex-direction: column;
                font-family: 'Inter', system-ui, sans-serif; color: ${THEME.text};
                overflow: hidden; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            #eni-chat-root.mini {
                width: 60px; height: 60px; border-radius: 30px; cursor: pointer;
                background: linear-gradient(135deg, ${THEME.accent}, ${THEME.accent2});
            }
            .eni-header {
                padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;
                cursor: move; border-bottom: 1px solid ${THEME.border}; background: rgba(255,255,255,0.02);
            }
            .eni-ctrls { display: flex; gap: 8px; }
            .eni-btn {
                width: 12px; height: 12px; border-radius: 50%; cursor: pointer; transition: 0.2s;
            }
            .eni-btn.close { background: #ff5f57; }
            .eni-btn.mini { background: #febc2e; }
            .eni-btn:hover { transform: scale(1.2); filter: brightness(1.2); }
            .eni-logo {
                font-size: 12px; font-weight: 800; letter-spacing: 1.5px;
                background: linear-gradient(135deg, ${THEME.accent}, ${THEME.accent3});
                -webkit-background-clip: text; color: transparent;
            }
            .eni-body { flex: 1; display: flex; flex-direction: column; padding: 20px; overflow: hidden; }
            .eni-tabs { display: flex; gap: 20px; margin-bottom: 15px; border-bottom: 1px solid ${THEME.border}; }
            .eni-tab {
                padding: 8px 0; font-size: 12px; font-weight: 700; cursor: pointer; opacity: 0.5; transition: 0.3s;
            }
            .eni-tab.active { opacity: 1; color: ${THEME.accent}; border-bottom: 2px solid ${THEME.accent}; }
            .eni-msgs {
                flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
                margin-bottom: 15px; padding-right: 5px; min-height: 200px;
            }
            .eni-msgs::-webkit-scrollbar { width: 4px; }
            .eni-msgs::-webkit-scrollbar-thumb { background: ${THEME.accent}; border-radius: 10px; }
            .eni-bubble {
                padding: 10px 14px; border-radius: 16px; font-size: 13px; max-width: 85%; line-height: 1.4;
            }
            .eni-user { background: ${THEME.accent}; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
            .eni-bot { background: ${THEME.card}; border: 1px solid ${THEME.border}; align-self: flex-start; border-bottom-left-radius: 4px; }
            .eni-input-wrap {
                background: ${THEME.card}; border: 1px solid ${THEME.border}; border-radius: 16px;
                padding: 10px; transition: 0.3s;
            }
            .eni-input-wrap:focus-within { border-color: ${THEME.accent}; box-shadow: 0 0 0 2px rgba(139,92,246,0.2); }
            .eni-input-wrap textarea {
                width: 100%; background: none; border: none; color: white; resize: none;
                outline: none; font-size: 13px; font-family: inherit; height: 40px;
            }
            .eni-action-btn {
                width: 100%; margin-top: 10px; padding: 10px; border-radius: 12px; border: none;
                background: linear-gradient(135deg, ${THEME.accent}, ${THEME.accent2});
                color: white; font-weight: 700; cursor: pointer; transition: 0.3s;
            }
            .eni-action-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(139,92,246,0.4); }
            .eni-action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            .eni-toast {
                position: fixed; bottom: 30px; right: 30px; padding: 12px 20px; border-radius: 12px;
                background: #1a1d23; color: white; font-size: 13px; z-index: 10000000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-left: 4px solid ${THEME.accent};
            }
            .eni-toast.error { border-left-color: #ef4444; }
            .eni-toast.hide { opacity: 0; transform: translateY(20px); transition: 0.3s; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .loader { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
        `;
        let s = document.getElementById('eni-style');
        if (!s) { s = document.createElement('style'); s.id = 'eni-style'; document.head.appendChild(s); }
        s.textContent = css;

        if (ST.m) {
            r.classList.add('mini');
            r.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px">🤖</div>';
            r.onclick = () => { ST.m = false; ui(); };
            return;
        }
        r.classList.remove('mini');
        r.onclick = null;
        r.innerHTML = `
            <div class="eni-header">
                <div class="eni-ctrls">
                    <div class="eni-btn close" onclick="document.getElementById('eni-chat-root').remove()"></div>
                    <div class="eni-btn mini" onclick="event.stopPropagation(); window.enM()"></div>
                </div>
                <span class="eni-logo">ENI AI</span>
                <div style="width:28px"></div>
            </div>
            <div class="eni-body">
                ${!ready ? `
                    <div style="text-align:center;padding:40px 10px">
                        <div style="font-size:48px;margin-bottom:15px">⚡</div>
                        <p style="font-weight:700;margin-bottom:5px">Aguardando Lovable</p>
                        <p style="font-size:12px;color:${THEME.sub}">Abra um projeto no lovable.dev</p>
                    </div>
                ` : `
                    <div class="eni-tabs">
                        <div class="eni-tab ${ST.view === 'chat' ? 'active' : ''}" onclick="window.enV('chat')">CHAT</div>
                        <div class="eni-tab ${ST.view === 'new' ? 'active' : ''}" onclick="window.enV('new')">NOVO</div>
                    </div>
                    ${ST.view === 'chat' ? `
                        <div class="eni-msgs" id="eni-msgs"></div>
                        <div class="eni-input-wrap">
                            <textarea id="eni-in" placeholder="Como posso ajudar?"></textarea>
                        </div>
                        <button class="eni-action-btn" id="eni-send">Enviar Mensagem</button>
                    ` : `
                        <div style="display:flex;flex-direction:column;gap:12px">
                            <div class="eni-input-wrap">
                                <textarea id="eni-desc" style="height:80px" placeholder="Descreva o novo projeto..."></textarea>
                            </div>
                            <button class="eni-action-btn" id="eni-create">Criar Projeto</button>
                        </div>
                    `}
                `}
            </div>
        `;
        updateMessages();
        attachEvents();
    }
    function attachEvents() {
        const sendBtn = document.getElementById('eni-send');
        const createBtn = document.getElementById('eni-create');
        if (sendBtn) {
            sendBtn.onclick = async () => {
                const ta = document.getElementById('eni-in');
                const msg = ta.value.trim();
                if (!msg || !ST.p) return showToast(ST.p ? 'Digite algo' : 'Projeto não detectado', 'error');
                ST.msgs.push({ r: 'u', t: msg });
                ta.value = '';
                updateMessages();
                sendBtn.disabled = true;
                sendBtn.innerHTML = '<span class="loader"></span>';
                const res = await apiReq('send-message', { token: ST.t, projectId: ST.p, message: msg });
                sendBtn.disabled = false;
                sendBtn.innerHTML = 'Enviar Mensagem';
                if (res.success) {
                    showToast('Enviado!', 'success');
                    ST.msgs.push({ r: 'b', t: 'Solicitação processada!' });
                    updateMessages();
                } else showToast(res.error || 'Erro', 'error');
            };
        }
        if (createBtn) {
            createBtn.onclick = async () => {
                const desc = document.getElementById('eni-desc').value.trim();
                if (!desc || !ST.w) return showToast(ST.w ? 'Descreva o projeto' : 'Workspace não detectado', 'error');
                createBtn.disabled = true;
                createBtn.innerHTML = '<span class="loader"></span>';
                const res = await apiReq('create-new', { token: ST.t, workspaceId: ST.w, message: desc });
                if (res.success) {
                    showToast('Criado!', 'success');
                    if (res.link) setTimeout(() => window.location.href = res.link, 1000);
                } else {
                    showToast(res.error || 'Erro', 'error');
                    createBtn.disabled = false;
                    createBtn.innerHTML = 'Criar Projeto';
                }
            };
        }
    }
    function makeDraggable(e) {
        let x, y, a = false;
        const s = t => {
            const p = t.touches ? t.touches[0] : t;
            if (!t.target.closest('.eni-header')) return;
            a = true; x = p.clientX - e.offsetLeft; y = p.clientY - e.offsetTop;
            e.style.transition = 'none';
        };
        const m = t => {
            if (!a) return;
            const p = t.touches ? t.touches[0] : t;
            e.style.left = (p.clientX - x) + 'px';
            e.style.top = (p.clientY - y) + 'px';
            e.style.right = 'auto'; e.style.bottom = 'auto';
        };
        const u = () => { a = false; e.style.transition = ''; };
        document.addEventListener('mousemove', m); document.addEventListener('mousedown', s); document.addEventListener('mouseup', u);
    }
    window.enM = () => { ST.m = true; ui(); };
    window.enV = (v) => { ST.view = v; ui(); };
    ui();
})();
