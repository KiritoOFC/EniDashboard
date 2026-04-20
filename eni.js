javascript:(function(){
if(document.getElementById('eni-chat-root'))return;
const ST={t:null,w:null,p:null,l:false,m:false,msgs:[],view:'chat'};
const THEME={bg:'linear-gradient(135deg, rgba(10,14,23,0.98), rgba(5,8,15,0.98))',card:'rgba(30,35,50,0.7)',accent:'#8b5cf6',accent2:'#ec4899',text:'#f1f5f9',sub:'#94a3b8',border:'rgba(255,255,255,0.08)',glass:'backdrop-filter:blur(20px) saturate(180%);'};
function intercept(t,w,p){let c=false;if(t&&t.startsWith('eyJ')&&t!==ST.t){ST.t=t;c=true}if(w&&w!==ST.w){ST.w=w;c=true}if(p&&/^[0-9a-f-]{36}$/i.test(p)&&p!==ST.p){ST.p=p;c=true}if(c)ui()}
const oF=window.fetch;window.fetch=function(...a){const u=typeof a[0]==='string'?a[0]:a[0].url;const w=(u.match(/\/workspaces\/([a-z0-9_-]+)/i)||[])[1];const p=(u.match(/\/projects\/([0-9a-f-]{36})/i)||[])[1];const h=a[1]?.headers;let t=null;if(h instanceof Headers)t=h.get('authorization');else if(h)t=h['Authorization']||h['authorization'];if(t)t=t.replace('Bearer ','');intercept(t,w,p);return oF.apply(this,a)};
async function sendMessageToLovable(token,projectId,message){const payload={message:message,files:[],chat_only:true,optimisticImageUrls:[],fast_mode:true,model:"auto",thread_id:"main",view:"preview",view_description:"The user is currently viewing the preview."};try{const response=await fetch(`https://api.lovable.dev/projects/${projectId}/chat`,{method:"POST",headers:{"authorization":`Bearer ${token}`,"content-type":"application/json","referer":"https://lovable.dev/","origin":"https://lovable.dev","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},body:JSON.stringify(payload)});if(response.status===202){return{success:true,status:202,message:"✅ Mensagem enviada com sucesso!"}}else{let errorData;try{errorData=await response.json()}catch(e){errorData={}}return{success:false,status:response.status,message:`❌ Erro ${response.status}: ${errorData.message||"Falha no envio"}`}}}catch(e){return{success:false,status:500,message:`❌ Erro de rede: ${e.message}`}}}
async function createNewProject(token,workspaceId,description){const payload={description:description,visibility:"private",env_vars:{},metadata:{chat_mode_enabled:false,fullscreen_enabled:true,feature_flag_overrides:{"unify-design-systems":false}},initial_message:{message:description,files:[],fast_mode:true,optimisticImageUrls:[],chat_only:false,agent_mode_enabled:false}};try{const response=await fetch(`https://api.lovable.dev/workspaces/${workspaceId}/projects`,{method:"POST",headers:{"authorization":`Bearer ${token}`,"content-type":"application/json","referer":"https://lovable.dev/","origin":"https://lovable.dev","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},body:JSON.stringify(payload)});const data=await response.json();if((response.status===200||response.status===201||response.status===202)&&data.id){return{success:true,projectId:data.id,link:data.link||`https://lovable.dev/projects/${data.id}`}}else{return{success:false,message:`❌ Erro ${response.status}: ${data.message||"Falha na criação"}`}}}catch(e){return{success:false,message:`❌ Erro de rede: ${e.message}`}}}
function showToast(message,type='success'){const toast=document.createElement('div');toast.className=`eni-toast ${type}`;toast.textContent=message;document.body.appendChild(toast);setTimeout(()=>toast.remove(),3000)}
function updateMessages(){const c=document.getElementById('eni-msgs');if(c){c.innerHTML='';ST.msgs.forEach(m=>{const g=document.createElement('div');g.className=`eni-bubble ${m.r==='u'?'eni-user':'eni-bot'}`;g.textContent=m.t;c.appendChild(g)});c.scrollTop=c.scrollHeight}}
function ui(){let r=document.getElementById('eni-chat-root');if(!r){r=document.createElement('div');r.id='eni-chat-root';document.body.appendChild(r);makeDraggable(r)}const ready=ST.t&&ST.w;const css=`
#eni-chat-root{position:fixed;bottom:20px;right:20px;width:420px;max-height:85vh;background:${THEME.bg};${THEME.glass}border:1px solid ${THEME.border};border-radius:28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);z-index:9999999;display:flex;flex-direction:column;font-family:'Inter','Segoe UI',system-ui,sans-serif;color:${THEME.text};overflow:hidden;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);backdrop-filter:blur(20px)}
#eni-chat-root.mini{width:60px;height:60px;border-radius:30px;cursor:pointer;background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});box-shadow:0 10px 30px -8px rgba(139,92,246,0.5)}
#eni-chat-root.mini:hover{transform:scale(1.05)}
.eni-header{padding:16px 20px;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:space-between;cursor:move;border-bottom:1px solid ${THEME.border}}
.eni-dots{display:flex;gap:10px}
.eni-dot{width:12px;height:12px;border-radius:50%;transition:all 0.2s;cursor:pointer}
.eni-dot:hover{transform:scale(1.15)}
.eni-content{flex:1;display:flex;flex-direction:column;overflow:hidden;padding:20px}
.eni-badge{font-size:10px;padding:5px 14px;border-radius:20px;background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.2));color:${THEME.accent};font-weight:600;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;border:1px solid rgba(139,92,246,0.3)}
.eni-messages{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;margin-bottom:16px;padding-right:4px;max-height:400px;min-height:200px}
.eni-messages::-webkit-scrollbar{width:5px}
.eni-messages::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:10px}
.eni-messages::-webkit-scrollbar-thumb{background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});border-radius:10px}
.eni-bubble{padding:12px 16px;border-radius:20px;font-size:13px;max-width:85%;line-height:1.5;animation:slideIn 0.3s ease;word-wrap:break-word}
.eni-user{align-self:flex-end;background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});color:white;border-bottom-right-radius:4px}
.eni-bot{align-self:flex-start;background:${THEME.card};border:1px solid ${THEME.border};border-bottom-left-radius:4px;color:${THEME.text}}
.eni-input-area{background:${THEME.card};padding:12px;border-radius:20px;border:1px solid ${THEME.border};transition:all 0.2s}
.eni-input-area:focus-within{border-color:${THEME.accent};box-shadow:0 0 0 3px rgba(139,92,246,0.15)}
.eni-input-area textarea{background:none;border:none;color:white;font-size:13px;resize:none;outline:none;width:100%;height:40px;font-family:inherit}
.eni-input-area textarea::placeholder{color:${THEME.sub}}
.eni-send-btn{background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});border:none;color:white;border-radius:14px;padding:8px 20px;cursor:pointer;font-weight:600;font-size:12px;transition:all 0.2s;margin-top:8px}
.eni-send-btn:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(139,92,246,0.4)}
.eni-send-btn:disabled{opacity:0.5;transform:none;cursor:not-allowed}
.eni-tabs{display:flex;gap:20px;margin-bottom:20px;border-bottom:1px solid ${THEME.border}}
.eni-tab{font-size:13px;padding:8px 0;cursor:pointer;opacity:0.5;transition:all 0.2s;position:relative;font-weight:500}
.eni-tab.active{opacity:1;font-weight:600}
.eni-tab.active::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:linear-gradient(90deg,${THEME.accent},${THEME.accent2})}
.eni-create-btn{background:linear-gradient(135deg,${THEME.accent},${THEME.accent2});border:none;color:white;border-radius:16px;padding:12px;cursor:pointer;font-weight:600;font-size:14px;transition:all 0.2s}
.eni-create-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(139,92,246,0.35)}
.eni-create-btn:disabled{opacity:0.5;transform:none;cursor:not-allowed}
.eni-new-desc{background:${THEME.card};border:1px solid ${THEME.border};color:white;padding:14px;border-radius:16px;outline:none;font-family:inherit;font-size:13px;transition:all 0.2s;resize:vertical}
.eni-new-desc:focus{border-color:${THEME.accent};box-shadow:0 0 0 3px rgba(139,92,246,0.15)}
.eni-loading{display:inline-flex;align-items:center;gap:8px}
.eni-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-radius:50%;border-top-color:white;animation:spin 0.6s linear}
.eni-toast{position:fixed;bottom:90px;right:30px;background:rgba(0,0,0,0.95);backdrop-filter:blur(10px);padding:10px 18px;border-radius:12px;font-size:13px;font-weight:500;z-index:10000000;animation:slideUp 0.3s ease;pointer-events:none;font-family:system-ui}
.eni-toast.success{border-left:3px solid #10b981}
.eni-toast.error{border-left:3px solid #ef4444}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
`;let s=document.getElementById('eni-s');if(!s){s=document.createElement('style');s.id='eni-s';document.head.appendChild(s)}s.textContent=css;if(ST.m){r.classList.add('mini');r.innerHTML='<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:28px">✨</div>';r.onclick=()=>{ST.m=false;ui()};return}r.classList.remove('mini');r.onclick=null;r.innerHTML=`
<div class="eni-header">
<div class="eni-dots">
<div class="eni-dot" style="background:#ff5f57" onclick="(function(){let el=document.getElementById('eni-chat-root');if(el)el.remove();})()"></div>
<div class="eni-dot" style="background:#febc2e" onclick="window.enM()"></div>
<div class="eni-dot" style="background:#28c840"></div>
</div>
<span style="font-size:11px;font-weight:700;opacity:0.7;letter-spacing:0.5px">ENI AI</span>
</div>
<div class="eni-content">
${!ready?`<div style="text-align:center;padding:50px 20px"><div style="font-size:52px;margin-bottom:12px">🎯</div><p style="font-size:14px;font-weight:500;margin-bottom:8px">Aguardando conexão</p><p style="font-size:12px;color:${THEME.sub}">Acesse lovable.dev para capturar token</p></div>`:`
<div class="eni-tabs">
<div class="eni-tab ${ST.view==='chat'?'active':''}" onclick="window.enV('chat')">💬 Chat</div>
<div class="eni-tab ${ST.view==='new'?'active':''}" onclick="window.enV('new')">✨ Novo Projeto</div>
</div>
${ST.view==='chat'?`
<div class="eni-badge">📁 ${ST.p?ST.p.slice(0,8)+'...':'Sem projeto'}</div>
<div class="eni-messages" id="eni-msgs"></div>
<div class="eni-input-area">
<textarea id="eni-in" placeholder="Digite sua mensagem..." rows="2"></textarea>
<div style="display:flex;justify-content:flex-end">
<button class="eni-send-btn" id="eni-send-btn">Enviar →</button>
</div>
</div>
`:`
<div class="eni-badge">🏢 Workspace: ${ST.w?ST.w.slice(0,8)+'...':'Não detectado'}</div>
<div style="display:flex;flex-direction:column;gap:16px">
<textarea class="eni-new-desc" id="eni-new-desc" rows="4" placeholder="Descreva o projeto que você quer criar...&#10;Ex: Um dashboard de analytics com gráficos interativos"></textarea>
<button class="eni-create-btn" id="eni-create-btn">🚀 Criar Projeto</button>
</div>
`}
`}</div>`;updateMessages();if(ST.view==='chat'){const sendBtn=document.getElementById('eni-send-btn');const textarea=document.getElementById('eni-in');if(sendBtn){const newSendBtn=sendBtn.cloneNode(true);sendBtn.parentNode.replaceChild(newSendBtn,sendBtn);newSendBtn.onclick=async function(){const i=document.getElementById('eni-in');if(!i||!ST.p){showToast('❌ Projeto não detectado','error');return}const msg=i.value.trim();if(!msg){showToast('⚠️ Digite uma mensagem','error');return}ST.msgs.push({r:'u',t:msg});i.value='';updateMessages();const btn=this;const originalText=btn.innerHTML;btn.disabled=true;btn.innerHTML='<span class="eni-loading"><span class="eni-spinner"></span> Enviando</span>';const result=await sendMessageToLovable(ST.t,ST.p,msg);btn.disabled=false;btn.innerHTML=originalText;if(result.success&&result.status===202){showToast(result.message,'success');ST.msgs.push({r:'bt',t:'✅ Mensagem enviada com sucesso!'});updateMessages();setTimeout(()=>{const idx=ST.msgs.findIndex(m=>m.t==='✅ Mensagem enviada com sucesso!');if(idx!==-1){ST.msgs.splice(idx,1);updateMessages()}},2500)}else{showToast(result.message,'error');ST.msgs.push({r:'bt',t:result.message});updateMessages();setTimeout(()=>{const idx=ST.msgs.findIndex(m=>m.t===result.message);if(idx!==-1){ST.msgs.splice(idx,1);updateMessages()}},3000)}}};if(textarea){textarea.onkeypress=function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();const btn=document.getElementById('eni-send-btn');if(btn)btn.onclick()}}}}}if(ST.view==='new'){const createBtn=document.getElementById('eni-create-btn');if(createBtn){const newCreateBtn=createBtn.cloneNode(true);createBtn.parentNode.replaceChild(newCreateBtn,createBtn);newCreateBtn.onclick=async function(){const d=document.getElementById('eni-new-desc');if(!d||!d.value.trim()){showToast('⚠️ Descreva o projeto','error');return}if(!ST.w){showToast('❌ Workspace não detectado','error');return}const desc=d.value.trim();const btn=this;const originalText=btn.innerHTML;btn.disabled=true;btn.innerHTML='<span class="eni-loading"><span class="eni-spinner"></span> Criando...</span>';const result=await createNewProject(ST.t,ST.w,desc);if(result.success){showToast('✅ Projeto criado! Redirecionando...','success');setTimeout(()=>{window.location.href=result.link},800)}else{showToast(result.message,'error');btn.disabled=false;btn.innerHTML=originalText}}}}}
function makeDraggable(e){let x=0,y=0,a=false;const s=t=>{const p=t.touches?t.touches[0]:t;if(!t.target.closest('.eni-header'))return;a=true;x=p.clientX-e.offsetLeft;y=p.clientY-e.offsetTop};const m=t=>{if(!a)return;const p=t.touches?t.touches[0]:t;let left=p.clientX-x;let top=p.clientY-y;left=Math.max(0,Math.min(window.innerWidth-e.offsetWidth,left));top=Math.max(0,Math.min(window.innerHeight-e.offsetHeight,top));e.style.left=left+'px';e.style.top=top+'px';e.style.right='auto';e.style.bottom='auto'};document.addEventListener('mousemove',m);document.addEventListener('touchmove',m,{passive:false});document.addEventListener('mousedown',s);document.addEventListener('touchstart',s,{passive:true});document.addEventListener('mouseup',()=>a=false);document.addEventListener('touchend',()=>a=false)}
window.enM=()=>{ST.m=true;ui()};
window.enV=(v)=>{ST.view=v;ui()};
ui()})();
