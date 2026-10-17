/* Netnet Meme Maker — static, no backend. */
(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const BASE_W = 1000;
let baseW = BASE_W, baseH = 563, zoom = 1, templates = [], tplCat = 'blank';
let history = [], hIndex = -1, restoring = false, histTimer = null;

fabric.Object.prototype.set({cornerColor:'#d4af37',cornerStrokeColor:'#111',borderColor:'#d4af37',cornerStyle:'circle',
  transparentCorners:false,cornerSize:16,touchCornerSize:44,padding:6,borderScaleFactor:2});
const canvas = new fabric.Canvas('c',{preserveObjectStacking:true,backgroundColor:'#0b0b0b',enableRetinaScaling:true,allowTouchScrolling:false});
window.__nnCanvas = canvas;

/* ---------- helpers ---------- */
function toast(msg, ms=2600){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),ms);}
function loading(on, text='Loading…'){$('#loading').classList.toggle('on',on);$('#loadingText').textContent=text;}
function fit(){
  const wrap=$('#canvasWrap'); const cw=wrap.clientWidth||window.innerWidth;
  const maxH = window.innerWidth<760 ? window.innerHeight*0.58 : window.innerHeight-230;
  zoom = Math.min(cw/baseW, Math.max(maxH,240)/baseH);
  canvas.setDimensions({width:Math.round(baseW*zoom),height:Math.round(baseH*zoom)});
  canvas.setZoom(zoom); canvas.requestRenderAll();
}
window.addEventListener('scroll',()=>canvas.calcOffset(),{passive:true});
window.addEventListener('resize',()=>{clearTimeout(fit._t);fit._t=setTimeout(fit,120);});

/* ---------- history ---------- */
const PROPS=['caps','nnKind'];
function commitSnapshot(){
  histTimer=null;
  const s=JSON.stringify({w:baseW,h:baseH,c:canvas.toJSON(PROPS)});
  if(history[hIndex]===s) return;
  history=history.slice(0,hIndex+1); history.push(s);
  if(history.length>40) history.shift();
  hIndex=history.length-1; updateUndo();
}
function snapshot(){
  if(restoring) return;
  clearTimeout(histTimer); histTimer=setTimeout(commitSnapshot,150);
}
function restore(i){
  if(histTimer){clearTimeout(histTimer);const before=hIndex;commitSnapshot();if(hIndex!==before&&i===before-1)i=hIndex-1;}
  if(i<0||i>=history.length) return;
  restoring=true; hIndex=i; const s=JSON.parse(history[i]);
  baseW=s.w; baseH=s.h; fit();
  canvas.loadFromJSON(s.c,()=>{canvas.renderAll();restoring=false;updateUndo();syncProps();});
}
function updateUndo(){ $('#btnUndo').disabled=hIndex<=0; $('#btnRedo').disabled=hIndex>=history.length-1; }
canvas.on('object:added',snapshot); canvas.on('object:modified',snapshot); canvas.on('object:removed',snapshot);

/* ---------- background ---------- */
function setBackground(url,{crop=0,keepObjects=true}={}){
  return new Promise((res,rej)=>{
    const el=new Image();
    el.onload=()=>{
      const srcH=Math.round(el.naturalHeight*(1-crop));
      const img=new fabric.Image(el,{left:0,top:0,originX:'left',originY:'top',width:el.naturalWidth,height:srcH,cropX:0,cropY:0});
      const oldH=baseH;
      baseW=BASE_W; baseH=Math.round(BASE_W*srcH/el.naturalWidth);
      img.set({scaleX:baseW/el.naturalWidth,scaleY:baseH/srcH});
      if(!keepObjects) canvas.getObjects().slice().forEach(o=>canvas.remove(o));
      else canvas.getObjects().forEach(o=>{ if(o._nnBottom||o.top>oldH*0.6){ o.top=Math.min(o.top*(baseH/oldH), baseH-20); o.setCoords(); } });
      fit();
      canvas.setBackgroundImage(img,()=>{canvas.renderAll();snapshot();res();});
    };
    el.onerror=rej; el.src=url;
  });
}
function blankCanvas(){
  canvas.setBackgroundImage(null,()=>{}); canvas.backgroundColor='#0b0b0b';
  baseW=BASE_W; baseH=BASE_W; fit(); canvas.renderAll(); snapshot();
  if(!textObjs().length) addDefaultTexts();
}

/* ---------- text ---------- */
function textObjs(){return canvas.getObjects().filter(o=>o.type==='textbox');}
function addText(str='YOUR TEXT', pos='middle', select=true){
  const fs=Math.round(baseW/13);
  const t=new fabric.Textbox(str.toUpperCase(),{
    left:baseW/2, originX:'center', originY:pos==='bottom'?'bottom':'top', width:baseW*0.92,
    top: pos==='top'? baseH*0.03 : pos==='bottom'? baseH*0.97 : baseH*0.42,
    fontFamily:'Impact, Anton, sans-serif', fontSize:fs, fill:'#ffffff', stroke:'#000000', strokeWidth:Math.max(2,Math.round(fs/11)),
    paintFirst:'stroke', strokeLineJoin:'round', textAlign:'center', lineHeight:1.0, caps:true, nnKind:'text'
  });
  // normalize origin so later math is simple
  canvas.add(t); const p=t.getPointByOrigin('left','top'); t.set({originX:'left',originY:'top',left:p.x,top:p.y}); t.setCoords();
  if(select){canvas.setActiveObject(t);} canvas.requestRenderAll(); return t;
}
function fitText(t,maxLines=2){ t.initDimensions(); let g=0; while(t._textLines.length>maxLines && t.fontSize>22 && g++<30){ t.set('fontSize',Math.round(t.fontSize*0.92)); t.set('strokeWidth',Math.max(2,Math.round(t.fontSize/11))); t.initDimensions(); } }
const DEFAULTS=['TOP TEXT','BOTTOM TEXT','YOUR TEXT'];
function addDefaultTexts(){ addText('TOP TEXT','top',false); addText('BOTTOM TEXT','bottom',false); canvas.discardActiveObject(); canvas.requestRenderAll(); }
function randomCaption(){
  const [a,b]=NN_CAPTIONS[Math.floor(Math.random()*NN_CAPTIONS.length)];
  let ts=textObjs().sort((x,y)=>x.top-y.top);
  if(ts.length<2){ ts.forEach(t=>canvas.remove(t)); fitText(addText(a,'top',false)); const bt=addText(b,'bottom',false); fitText(bt); bt.top=baseH*0.97-bt.getScaledHeight(); bt.setCoords(); }
  else { ts[0].set('text',ts[0].caps?a.toUpperCase():a); fitText(ts[0]); const last=ts[ts.length-1]; const bottomEdge=last.top+last.getScaledHeight(); last.set('text',last.caps?b.toUpperCase():b); fitText(last); if(bottomEdge>baseH*0.8){last.top=bottomEdge-last.getScaledHeight();} last.setCoords(); ts[0].setCoords(); }
  textObjs().forEach(t=>{ if(t.top+t.getScaledHeight()>baseH){ t.top=Math.max(0,baseH-t.getScaledHeight()-baseH*0.02); t.setCoords(); } });
  canvas.discardActiveObject(); canvas.requestRenderAll(); snapshot(); syncProps();
}

/* ---------- stickers ---------- */
function addImageLayer(url,targetW,kind='sticker'){
  return new Promise(res=>{
    fabric.Image.fromURL(url,img=>{
      const s=targetW/img.width;
      img.set({scaleX:s,scaleY:s,left:baseW/2-img.width*s/2+ (Math.random()*60-30),top:baseH/2-img.height*s/2+(Math.random()*60-30),nnKind:kind});
      canvas.add(img); canvas.setActiveObject(img); canvas.requestRenderAll(); res(img);
    });
  });
}
function addEmoji(e){
  const t=new fabric.Text(e,{fontSize:120,left:baseW/2-60,top:baseH/2-60,nnKind:'emoji',fontFamily:'"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'});
  canvas.add(t); canvas.setActiveObject(t); canvas.requestRenderAll();
}
function buildStickers(){
  const g=$('#stickerGrid'); const add=(html,title,fn)=>{const b=document.createElement('button');b.className='stk';b.title=title;b.innerHTML=html;b.onclick=fn;g.appendChild(b);};
  Object.entries(NN_FACES).forEach(([k,url])=>add(`<img src="${url}" alt="">`, 'Al Dunlap '+k, ()=>addImageLayer(url,k.startsWith('bust')?380:260,'face')));
  NN_STICKERS.forEach(s=>{const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s.svg); add(`<img src="${url}" alt="">`,s.label,()=>addImageLayer(url,s.w));});
  NN_EMOJI.forEach(e=>add(e,'emoji',()=>addEmoji(e)));
}

/* ---------- templates ---------- */
async function loadTemplates(){
  const r=await fetch('templates.json'); templates=await r.json(); renderGrid();
}
function renderGrid(){
  const q=$('#tplSearch').value.trim().toLowerCase(); const g=$('#tplGrid'); g.innerHTML='';
  templates.filter(t=>t.cat===tplCat && (!q||t.name.toLowerCase().includes(q))).forEach(t=>{
    const b=document.createElement('button'); b.className='tpl'; b.innerHTML=`<img loading="lazy" src="${t.thumb}" alt=""><span>${t.name}</span>`;
    b.onclick=()=>useTemplate(t); g.appendChild(b);
  });
}
const packCache={};
function getPack(n){ if(!packCache[n]) packCache[n]=fetch(`p/p${n}.json`).then(r=>{if(!r.ok)throw new Error(r.status);return r.json();}).catch(e=>{delete packCache[n];throw e;}); return packCache[n]; }
async function useTemplate(t,scroll=true){
  loading(true,'Loading template…');
  try{
    const pk=await getPack(t.pack); const b64=pk[t.id]; if(!b64) throw new Error('missing');
    if(t.cat==='remix') textObjs().filter(o=>DEFAULTS.includes(o.text)).forEach(o=>canvas.remove(o));
    await setBackground('data:image/webp;base64,'+b64);
    if(t.cat==='blank' && !textObjs().length) addDefaultTexts();
    if(scroll&&window.innerWidth<760) $('#canvasWrap').scrollIntoView({behavior:'smooth',block:'center'});
  }catch(e){toast('Could not load template, try again.');console.error(e);}
  loading(false);
}

/* ---------- AI ---------- */
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function generateAI(){
  const idea=$('#aiIdea').value.trim();
  if(!idea){toast('Type an idea first, or tap 🎲 Random scene idea');return;}
  const [w,h]=$('#aiSize').value.split('x').map(Number);
  const prompt=`${idea.replace(/\b(al\s+)?dunlap\b/ig,'the businessman')}. the businessman is ${NN_DUNLAP}. ${$('#aiStyle').value}. No text, no letters, no watermark.`.slice(0,900);
  const btn=$('#btnAI'); btn.disabled=true; const status=$('#aiStatus');
  loading(true,'Dunlap is getting into position… (10–40s)');
  try{
    let blob=null;
    for(let attempt=1;attempt<=6 && !blob;attempt++){
      const seed=Math.floor(Math.random()*1e9);
      const url=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${Math.round(h*1.06)}&seed=${seed}&nologo=true&private=true&safe=true`;
      const ctl=new AbortController(); const to=setTimeout(()=>ctl.abort(),120000);
      try{
        const r=await fetch(url,{signal:ctl.signal}); clearTimeout(to);
        const ct=r.headers.get('content-type')||'';
        if(r.ok && ct.startsWith('image/')){ blob=await r.blob(); break; }
        const wait=(parseInt(r.headers.get('retry-after'))||8+attempt*4)*1000;
        status.textContent=`AI is busy (attempt ${attempt}/6), retrying in ${Math.round(wait/1000)}s…`;
        $('#loadingText').textContent=`Free AI is busy — retrying (${attempt}/6)…`;
        await sleep(wait);
      }catch(e){ clearTimeout(to); status.textContent=`Network hiccup (attempt ${attempt}/6), retrying…`; await sleep(5000); }
    }
    if(!blob) throw new Error('busy');
    const obj=URL.createObjectURL(blob);
    await setBackground(obj,{crop:0.055});
    if(!textObjs().length) addDefaultTexts();
    status.textContent='Done! Add captions, then download.'; toast('Scene ready — now add your caption ✍️');
    if(window.innerWidth<760) $('#canvasWrap').scrollIntoView({behavior:'smooth',block:'center'});
  }catch(e){ status.textContent='The free AI is overloaded right now. Wait a minute and try again, or use a template.'; toast('AI busy — try again in a minute'); }
  btn.disabled=false; loading(false);
}

/* ---------- properties panel ---------- */
const SW=['#ffffff','#000000','#d4af37','#f5d77a','#e74c3c','#2ecc71','#3498db','#ff7a00'];
function syncProps(){
  const o=canvas.getActiveObject();
  $('#propsEmpty').classList.toggle('hidden',!!o);
  $('#propsCommon').classList.toggle('hidden',!o);
  const isText=o&&(o.type==='textbox');
  $('#propsText').classList.toggle('hidden',!isText);
  if(!o) return;
  $('#pScale').value=Math.round((o.scaleX||1)*100); $('#pRot').value=Math.round(((o.angle||0)+180)%360-180); $('#pOpacity').value=Math.round((o.opacity??1)*100);
  if(isText){
    if(document.activeElement!==$('#pText')) $('#pText').value=o.text;
    $('#pFont').value=o.fontFamily; $('#pSize').value=o.fontSize; $('#pFill').value=toHex(o.fill); $('#pStroke').value=toHex(o.stroke||'#000000');
    $('#pStrokeW').value=o.strokeWidth||0; $('#pCaps').checked=!!o.caps;
    $$('#pAlign button').forEach(b=>b.classList.toggle('on',b.dataset.a===o.textAlign));
  }
}
function toHex(c){ if(!c||typeof c!=='string') return '#ffffff'; if(c[0]==='#'&&c.length===7) return c; const x=new fabric.Color(c); return '#'+x.toHex(); }
function act(fn,commit=true){ const o=canvas.getActiveObject(); if(!o) return; fn(o); if(o.initDimensions) o.initDimensions(); o.setCoords(); canvas.requestRenderAll(); if(commit) snapshot(); }
function bindProps(){
  $('#pText').addEventListener('input',e=>act(o=>o.set('text',o.caps?e.target.value.toUpperCase():e.target.value)));
  $('#pFont').addEventListener('change',async e=>{const f=e.target.value; try{await document.fonts.load(`40px ${f.includes(',')?f:'"'+f+'"'}`);}catch(_){} fabric.util.clearFabricFontCache(); act(o=>o.set('fontFamily',f));});
  $('#pSize').addEventListener('input',e=>act(o=>o.set({fontSize:+e.target.value,strokeWidth:Math.min(+$('#pStrokeW').value,Math.max(1,Math.round(e.target.value/8)))}),false));
  $('#pSize').addEventListener('change',snapshot);
  $('#pFill').addEventListener('input',e=>act(o=>o.set('fill',e.target.value),false)); $('#pFill').addEventListener('change',snapshot);
  $('#pStroke').addEventListener('input',e=>act(o=>o.set('stroke',e.target.value),false)); $('#pStroke').addEventListener('change',snapshot);
  $('#pStrokeW').addEventListener('input',e=>act(o=>o.set('strokeWidth',+e.target.value),false)); $('#pStrokeW').addEventListener('change',snapshot);
  $('#pCaps').addEventListener('change',e=>act(o=>{o.caps=e.target.checked; if(o.caps) o.set('text',o.text.toUpperCase()); $('#pText').value=o.text;}));
  $$('#pAlign button').forEach(b=>b.onclick=()=>{act(o=>o.set('textAlign',b.dataset.a));syncProps();});
  $('#pScale').addEventListener('input',e=>act(o=>{const s=e.target.value/100;o.set({scaleX:s,scaleY:s});},false)); $('#pScale').addEventListener('change',snapshot);
  $('#pRot').addEventListener('input',e=>act(o=>o.rotate(+e.target.value),false)); $('#pRot').addEventListener('change',snapshot);
  $('#pOpacity').addEventListener('input',e=>act(o=>o.set('opacity',e.target.value/100),false)); $('#pOpacity').addEventListener('change',snapshot);
  const sw=$('#swatches'); SW.forEach(c=>{const b=document.createElement('button');b.style.background=c;b.title=c;b.onclick=()=>{act(o=>o.set('fill',c));syncProps();};sw.appendChild(b);});
  ['selection:created','selection:updated','selection:cleared','object:modified','object:scaling','object:rotating','text:changed'].forEach(ev=>canvas.on(ev,syncProps));
  canvas.on('text:changed',snapshot);
}

/* ---------- export ---------- */
function renderPNG(){
  canvas.discardActiveObject(); canvas.requestRenderAll();
  let wm=null;
  if($('#wm').checked){
    restoring=true;
    wm=new fabric.Text('Made with the Netnet Meme Maker',{fontFamily:'Inter, Arial, sans-serif',fontWeight:700,fontSize:Math.round(baseW*0.022),fill:'rgba(245,215,122,0.92)',
      shadow:new fabric.Shadow({color:'rgba(0,0,0,0.9)',blur:6,offsetX:1,offsetY:1}),selectable:false,evented:false});
    wm.set({left:baseW-wm.width-baseW*0.015,top:baseH-wm.height-baseW*0.012}); canvas.add(wm);
  }
  canvas.renderAll();
  const url=canvas.toDataURL({format:'png',multiplier:1/zoom});
  if(wm){canvas.remove(wm);canvas.renderAll();restoring=false;}
  return url;
}
function dataURLtoBlob(u){const [h,b]=u.split(',');const bin=atob(b);const a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:h.match(/:(.*?);/)[1]});}
function download(){
  try{
    const url=renderPNG(); const a=document.createElement('a'); a.href=URL.createObjectURL(dataURLtoBlob(url)); a.download=`netnet-meme-${Date.now()}.png`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    window.__nnLastExport=url.length; toast('Downloaded! Post it with #NetNet $NET 🪙');
  }catch(e){console.error(e);toast('Download failed: '+e.message);}
}
const SHARE_TEXT='Made this with the Netnet Meme Maker 🪙 #NetNet $NET @NetNetCap';
async function share(){
  const intent='https://x.com/intent/tweet?text='+encodeURIComponent(SHARE_TEXT);
  try{
    const url=renderPNG(); const file=new File([dataURLtoBlob(url)],'netnet-meme.png',{type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]}) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)){
      await navigator.share({files:[file],text:SHARE_TEXT}); return;
    }
  }catch(e){ if(e.name==='AbortError') return; }
  window.open(intent,'_blank','noopener');
  download(); toast('Meme downloaded — attach it to your X post 📎',4000);
}

/* ---------- wiring ---------- */
function wire(){
  $$('#tabs button').forEach(b=>b.onclick=()=>{$$('#tabs button').forEach(x=>x.classList.toggle('on',x===b));$$('.tab').forEach(t=>t.classList.toggle('on',t.id==='tab-'+b.dataset.tab));});
  $$('#tplFilter button').forEach(b=>b.onclick=()=>{tplCat=b.dataset.cat;$$('#tplFilter button').forEach(x=>x.classList.toggle('on',x===b));renderGrid();});
  $('#tplSearch').addEventListener('input',renderGrid);
  $('#btnBlankCanvas').onclick=blankCanvas;
  $('#btnText').onclick=()=>{addText('YOUR TEXT','middle');syncProps();};
  $('#btnCaption').onclick=randomCaption;
  $('#btnUndo').onclick=()=>restore(hIndex-1); $('#btnRedo').onclick=()=>restore(hIndex+1);
  $('#btnUp').onclick=()=>{const o=canvas.getActiveObject();if(o){canvas.bringForward(o);canvas.requestRenderAll();snapshot();}};
  $('#btnDown').onclick=()=>{const o=canvas.getActiveObject();if(o){canvas.sendBackwards(o);canvas.requestRenderAll();snapshot();}};
  $('#btnDel').onclick=delActive;
  $('#btnDup').onclick=()=>{const o=canvas.getActiveObject();if(!o)return;o.clone(c=>{c.set({left:o.left+30,top:o.top+30});canvas.add(c);canvas.setActiveObject(c);canvas.requestRenderAll();},PROPS);};
  $('#btnDownload').onclick=download; $('#btnShare').onclick=share;
  $('#btnAI').onclick=generateAI;
  $('#btnAIIdea').onclick=()=>{$('#aiIdea').value=NN_SCENES[Math.floor(Math.random()*NN_SCENES.length)];};
  const readFile=(f,cb)=>{const r=new FileReader();r.onload=()=>cb(r.result);r.readAsDataURL(f);};
  $('#upBg').onchange=e=>{const f=e.target.files[0];if(f)readFile(f,u=>setBackground(u).then(()=>{if(!textObjs().length)addDefaultTexts();}));e.target.value='';};
  $('#upLayer').onchange=e=>{const f=e.target.files[0];if(f)readFile(f,u=>addImageLayer(u,baseW*0.4,'upload'));e.target.value='';};
  document.addEventListener('keydown',e=>{
    const tag=(document.activeElement||{}).tagName; const o=canvas.getActiveObject();
    if(tag==='INPUT'||tag==='TEXTAREA'||(o&&o.isEditing)) return;
    if(e.key==='Delete'||e.key==='Backspace'){if(o){e.preventDefault();delActive();}}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?restore(hIndex+1):restore(hIndex-1);}
  });
}
function delActive(){const os=canvas.getActiveObjects();if(!os.length)return;os.forEach(o=>canvas.remove(o));canvas.discardActiveObject();canvas.requestRenderAll();syncProps();}

async function init(){
  wire(); bindProps(); buildStickers(); fit();
  try{ await Promise.race([Promise.all(['Anton','Bebas Neue','Bangers','Playfair Display','Inter'].map(f=>document.fonts.load(`40px "${f}"`))),sleep(2500)]); }catch(_){}
  document.fonts.ready.then(()=>{fabric.util.clearFabricFontCache();textObjs().forEach(t=>{t.initDimensions();t.setCoords();});canvas.requestRenderAll();});
  await loadTemplates();
  const first=templates.find(t=>t.id==='b70')||templates[0];
  await useTemplate(first,false);
  history=[];hIndex=-1;snapshot();
  window.__nnReady=true;
}
init();
})();
