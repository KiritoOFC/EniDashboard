javascript:(function(){
if(document.getElementById('eni-chat-root'))return;
const ST={t:null,w:null,p:null,l:false,m:false,msgs:[],view:'chat',server:'http://localhost:7788'};
const THEME={bg:'linear-gradient(135deg, rgba(15,20,30,0.98), rgba(10,15,25,0.98))',card:'rgba(30,40,55,0.6)',accent:'#6366f1',accent2:'#8b5cf6',text:'#f8fafc',sub:'#94a3b8',border:'rgba(255,255,255,0.08)',glass:'backdrop-filter:blur(16px) saturate(180%);',success:'#10b981',error:'#ef4444'};
function intercept(t,w,p){let c=false;if(t&&t.startsWith('eyJ')&&t!==ST.t){ST.t=t;c=true}if(w&&w!==ST.w){ST.w=w;c=true}if(p&&/^[0-9a-f-]{36}$/i.test(p)&&p!==ST.p){ST.p=p;c=true}if(c)ui()}
const oF=window.fetch;window.fetch=function(...a){const u=typeof a[0]==='string'?a[0]:a[0].url;const w=(u.match(/\/workspaces\/([a-z0-9_-]+)/i)||[])[1];const p=(u.match(/\/projects\/([0-9a-f-]{36})/i)||[])[1];const h=a[1]?.headers;let t=null;if(h instanceof Headers)t=h.get('authorization');else if(h)t=h['Authorization']||h['authorization'];if(t)t=t.replace('Bearer ','');intercept(t,w,p);return oF.apply(this,a)};
function ui(){let r=document.getElementById('eni-chat-root');if(!r){r=document.createElement('div');r.id='eni-chat-root';document.body.appendChild(r);dr(r)}const ready=ST.t&&ST.w;const css=`
#eni-chat-root{position:fixed;bottom:20px;right:20px;width:400px;max-height:85vh;background:${THEME.bg};${THEME.glass}border:1px solid ${THEME.border};border-radius:28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);z-index:9999999;display:flex;flex-direction:column;font-family:'Inter','Segoe UI',system-ui,sans-serif;color:${THEME.text};overflow:hidden;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);backdrop-filter:blur(20px)}
#eni-chat-root.mini{width:60px;height:60px;border-radius:30px;cursor:pointer;background:${THEME.accent};box-shadow:0 10px 25px -5px rgba(99,102,241,0.4)}
#eni-chat-root.mini:hover{transform:scale(1.05)}
.eni-header{padding:16px 20px;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:space-between;cursor:move;border-bottom:1px solid ${THEME.border}}
.eni-dots{display:flex;gap:8px}
.eni-dot{width:12px;height:12px;border-radius:50%;transition:all 0.2s}
.eni-dot:hover{transform:scale(1.1)}
.eni-content{flex:1;display:flex;flex-direction:column;overflow:hidden;padding:20px}
.eni-badge{font-size:10px;padding:5px 12px;border-radius:20px;background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});color:white;font-weight:600;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;box-shadow:0 2px 8px rgba(99,102,241,0.3)}
.eni-messages{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;margin-bottom:16px;padding-right:4px}
.eni-messages::-webkit-scrollbar{width:4px}
.eni-messages::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:10px}
.eni-messages::-webkit-scrollbar-thumb{background:${THEME.accent};border-radius:10px}
.eni-bubble{padding:12px 16px;border-radius:20px;font-size:13px;max-width:85%;line-height:1.5;animation:fadeIn 0.3s ease}
.eni-user{align-self:flex-end;background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});color:white;border-bottom-right-radius:4px}
.eni-bot{align-self:flex-start;background:${THEME.card};border:1px solid ${THEME.border};border-bottom-left-radius:4px}
.eni-input-area{background:${THEME.card};padding:12px;border-radius:20px;border:1px solid ${THEME.border};transition:all 0.2s}
.eni-input-area:focus-within{border-color:${THEME.accent};box-shadow:0 0 0 3px rgba(99,102,241,0.1)}
.eni-input-area textarea{background:none;border:none;color:white;font-size:13px;resize:none;outline:none;width:100%;height:40px;font-family:inherit}
.eni-input-area textarea::placeholder{color:${THEME.sub}}
.eni-send-btn{background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});border:none;color:white;border-radius:14px;padding:8px 18px;cursor:pointer;font-weight:600;font-size:12px;transition:all 0.2s;margin-top:8px}
.eni-send-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,0.4)}
.eni-tabs{display:flex;gap:16px;margin-bottom:20px;border-bottom:1px solid ${THEME.border}}
.eni-tab{font-size:13px;padding:8px 0;cursor:pointer;opacity:0.6;transition:all 0.2s;position:relative}
.eni-tab.active{opacity:1;font-weight:600}
.eni-tab.active::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:linear-gradient(90deg,${THEME.accent},${THEME.accent2})}
.eni-create-btn{background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});border:none;color:white;border-radius:16px;padding:12px;cursor:pointer;font-weight:600;font-size:14px;transition:all 0.2s}
.eni-create-btn:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(99,102,241,0.3)}
.eni-create-btn:disabled{opacity:0.5;transform:none}
.eni-new-desc{background:${THEME.card};border:1px solid ${THEME.border};color:white;padding:14px;border-radius:16px;outline:none;font-family:inherit;font-size:13px;transition:all 0.2s}
.eni-new-desc:focus{border-color:${THEME.accent};box-shadow:0 0 0 3px rgba(99,102,241,0.1)}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.eni-status{font-size:11px;padding:6px 12px;border-radius:12px;text-align:center;margin-top:8px}
.eni-status.success{background:rgba(16,185,129,0.2);color:${THEME.success}}
.eni-status.error{background:rgba(239,68,68,0.2);color:${THEME.error}}
.eni-loading{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-radius:50%;border-top-color:white;animation:spin 0.6s linear}
@keyframes spin{to{transform:rotate(360deg)}
}
`;let s=document.getElementById('eni-s');if(!s){s=document.createElement('style');s.id='eni-s';document.head.appendChild(s)}s.textContent=css;if(ST.m){r.classList.add('mini');r.innerHTML='<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:28px">✨</div>';r.onclick=()=>{ST.m=false;ui()};return}r.classList.remove('mini');r.onclick=null;r.innerHTML=`
<div class="eni-header">
<div class="eni-dots">
<div class="eni-dot" style="background:#ff5f57" onclick="document.getElementById('eni-chat-root').remove()"></div>
<div class="eni-dot" style="background:#febc2e" onclick="window.enM()"></div>
<div class="eni-dot" style="background:#28c840"></div>
</div>
<span style="font-size:11px;font-weight:700;opacity:0.7;letter-spacing:0.5px">ENI AI</span>
</div>
<div class="eni-content">
${!ready?`<div style="text-align:center;padding:40px 20px"><div style="font-size:48px;margin-bottom:12px">🔌</div><p style="font-size:13px;color:${THEME.sub}">Acesse lovable.dev para conectar</p><p style="font-size:11px;color:${THEME.sub};margin-top:8px">O token será capturado automaticamente</p></div>`:`
<div class="eni-tabs">
<div class="eni-tab ${ST.view==='chat'?'active':''}" onclick="window.enV('chat')">💬 Chat</div>
<div class="eni-tab ${ST.view==='new'?'active':''}" onclick="window.enV('new')">✨ Novo Projeto</div>
</div>
${ST.view==='chat'?`
<div class="eni-badge">🎯 Projeto: ${ST.p?ST.p.slice(0,8)+'...':'Não detectado'}</div>
<div class="eni-messages" id="eni-msgs"></div>
<div class="eni-input-area">
<textarea id="eni-in" placeholder="Descreva a alteração desejada..."></textarea>
<div style="display:flex;justify-content:flex-end">
<button class="eni-send-btn" onclick="window.enS()">Enviar →</button>
</div>
</div>
`:`
<div class="eni-badge">🏢 Workspace: ${ST.w.slice(0,8)}...</div>
<div style="display:flex;flex-direction:column;gap:16px">
<textarea class="eni-new-desc" id="eni-new-desc" rows="4" placeholder="Ex: Crie um dashboard de vendas com gráficos interativos..."></textarea>
<button class="eni-create-btn" id="btn-create" onclick="window.enC()">🚀 Criar Projeto</button>
</div>
`}
`}</div>`;const c=document.getElementById('eni-msgs');if(c){ST.msgs.forEach(m=>{const g=document.createElement('div');g.className=`eni-bubble ${m.r==='u'?'eni-user':'eni-bot'}`;g.textContent=m.t;c.appendChild(g)});c.scrollTop=c.scrollHeight}}
window.enM=()=>{ST.m=true;ui()};
window.enV=(v)=>{ST.view=v;ui()};
window.enS=async()=>{const i=document.getElementById('eni-in');if(!i||!ST.p)return;const msg=i.value.trim();if(!msg)return;ST.msgs.push({r:'u',t:msg});i.value='';ui();const statusDiv=document.createElement('div');statusDiv.className='eni-status';statusDiv.innerHTML='<span class="eni-loading"></span> Enviando...';document.querySelector('.eni-messages')?.appendChild(statusDiv);try{const res=await fetch(`${ST.server}/api/send-message`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:ST.t,projectId:ST.p,message:msg})});const data=await res.json();statusDiv.remove();if(data.ok){ST.msgs.push({r:'bt',t:'✓ Mensagem enviada com sucesso!'});ui();setTimeout(()=>{ST.msgs=ST.msgs.filter(m=>m.t!=='✓ Mensagem enviada com sucesso!');ui()},2000)}else{ST.msgs.push({r:'bt',t:`✕ Erro: ${data.error||'Falha no servidor'}`});ui()}}catch(e){statusDiv.remove();ST.msgs.push({r:'bt',t:'✕ Erro de conexão com o servidor local'})}ui()};
window.enC=async()=>{const d=document.getElementById('eni-new-desc');if(!d||!d.value.trim())return;const btn=document.querySelector('.eni-create-btn');const originalText=btn.textContent;btn.disabled=true;btn.innerHTML='<span class="eni-loading"></span> Criando...';try{const res=await fetch(`${ST.server}/api/create-new`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:ST.t,workspaceId:ST.w,message:d.value.trim()})});const data=await res.json();if(data.ok&&data.link){window.location.href=data.link}else{throw new Error(data.error||'Falha na criação')}}catch(e){alert('Erro: '+e.message);btn.disabled=false;btn.textContent=originalText}};
function dr(e){let x=0,y=0,a=false;const s=t=>{const p=t.touches?t.touches[0]:t;if(!t.target.closest('.eni-header'))return;a=true;x=p.clientX-e.offsetLeft;y=p.clientY-e.offsetTop};const m=t=>{if(!a)return;const p=t.touches?t.touches[0]:t;let left=p.clientX-x;let top=p.clientY-y;left=Math.max(0,Math.min(window.innerWidth-e.offsetWidth,left));top=Math.max(0,Math.min(window.innerHeight-e.offsetHeight,top));e.style.left=left+'px';e.style.top=top+'px';e.style.right='auto';e.style.bottom='auto'};document.addEventListener('mousemove',m);document.addEventListener('touchmove',m,{passive:false});document.addEventListener('mousedown',s);document.addEventListener('touchstart',s,{passive:true});document.addEventListener('mouseup',()=>a=false);document.addEventListener('touchend',()=>a=false)}ui()})();
