/* HAEUM WIKI v2.6.2 — accessible navigation, expanded search and responsive controls */
const pages={main:"뭐해음",broadcast:"방송 활동",stats:"방송 통계",community:"SNS·팬 커뮤니티",avatar:"캐릭터·버추얼 모델",illustrations:"방송 일러스트",timeline:"활동 연혁",evaluation:"종합 평가",fandom:"토토단"};
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const sidebar=$('#sidebar'),menuButton=$('#menuBtn'),menuBackdrop=$('#menuBackdrop');
function closeMenu(){sidebar?.classList.remove('open');document.body.classList.remove('menu-open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','메뉴 열기');}
function openMenu(){sidebar?.classList.add('open');document.body.classList.add('menu-open');menuButton?.setAttribute('aria-expanded','true');menuButton?.setAttribute('aria-label','메뉴 닫기');}
function showPage(id){
 if(!pages[id])id='main';
 const target=$(`#page-${id}`);if(!target)return;
 $$('.navitem').forEach(a=>a.classList.toggle('active',a.dataset.page===id));
 const crumb=$('#crumbName');if(crumb)crumb.textContent=pages[id];
 document.title=pages[id]+' - 해음위키 v2.6.2';
 closeMenu();closeSearch();
 const search=$('#search');if(search){search.value='';updateClearButton();}
 target.scrollIntoView({behavior:reduceMotion()?'auto':'smooth',block:'start'});
}
document.addEventListener('click',event=>{
 const pageLink=event.target.closest('[data-page]');if(pageLink){event.preventDefault();showPage(pageLink.dataset.page);return;}
 if(event.target.closest('#homeBtn')){showPage('main');return;}
 if(event.target.closest('#menuBtn')){sidebar?.classList.contains('open')?closeMenu():openMenu();return;}
 if(event.target.closest('#menuBackdrop')){closeMenu();return;}
 if(event.target.closest('#backtop')){window.scrollTo({top:0,behavior:reduceMotion()?'auto':'smooth'});return;}
 if(sidebar?.classList.contains('open')&&!sidebar.contains(event.target)&&!menuButton?.contains(event.target))closeMenu();
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){closeMenu();closeSearch();}
 if(event.key==='/'&&!/input|textarea|select/i.test(document.activeElement?.tagName||'')){event.preventDefault();$('#search')?.focus();}
});

// Search across the visible text of each document, not only its title.
const searchInput=$('#search'),searchResults=$('#searchResults'),searchClear=$('#searchClear');
const searchIndex=Object.entries(pages).map(([id,title])=>{
 const section=$(`#page-${id}`);const text=(section?.innerText||'').replace(/\s+/g,' ').trim();
 return {id,title,text};
});
function updateClearButton(){if(searchClear)searchClear.hidden=!(searchInput?.value||'').trim();}
function closeSearch(){searchResults?.classList.remove('show');searchInput?.setAttribute('aria-expanded','false');}
function renderSearch(){
 if(!searchInput||!searchResults)return;
 const q=searchInput.value.trim().toLocaleLowerCase('ko');updateClearButton();
 if(!q){closeSearch();searchResults.innerHTML='';return;}
 const found=searchIndex.filter(row=>(row.title+' '+row.text).toLocaleLowerCase('ko').includes(q));
 const heading=`<div class="search-results-head"><span>검색 결과</span><small>${found.length}개 문서</small></div>`;
 const items=found.map(row=>{
  const at=row.text.toLocaleLowerCase('ko').indexOf(q);let snippet=row.text.slice(Math.max(0,at-38),Math.min(row.text.length,at+100));
  if(at<0)snippet=row.text.slice(0,105);if(snippet.length>=100)snippet+='…';
  return `<a class="result" role="option" href="#page-${row.id}" data-result="${row.id}"><span class="result-title">${row.title}</span><small>${snippet.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</small></a>`;
 }).join('');
 searchResults.innerHTML=heading+(items||'<div class="result-empty">검색 결과가 없습니다.</div>');
 searchResults.classList.add('show');searchInput.setAttribute('aria-expanded','true');
}
searchInput?.addEventListener('input',renderSearch);
searchInput?.addEventListener('keydown',event=>{
 if(event.key==='Enter'){const first=$('[data-result]',searchResults);if(first){event.preventDefault();showPage(first.dataset.result);}}
 if(event.key==='Escape'){closeSearch();searchInput.blur();}
 if(event.key==='ArrowDown'&&searchResults?.classList.contains('show')){$('[data-result]',searchResults)?.focus();}
});
searchClear?.addEventListener('click',()=>{if(!searchInput)return;searchInput.value='';renderSearch();searchInput.focus();});
searchResults?.addEventListener('keydown',event=>{if(event.key==='Escape'){closeSearch();searchInput?.focus();}});
searchResults?.addEventListener('click',event=>{const result=event.target.closest('[data-result]');if(result){event.preventDefault();showPage(result.dataset.result);}});
document.addEventListener('click',event=>{if(!event.target.closest('.searchwrap'))closeSearch();});

// Dark is the default. Persist an explicit choice without breaking private browsing.
(()=>{
 const root=document.documentElement,buttons=$$('.theme-btn[data-theme]');
 const colors={light:'#f4f6fa',dark:'#111318',signature:'#101b3c'},valid=new Set(Object.keys(colors));
 function applyTheme(value,save=false){
  const theme=valid.has(value)?value:'dark';root.dataset.theme=theme;root.style.colorScheme=theme==='light'?'light':'dark';
  buttons.forEach(button=>{const active=button.dataset.theme===theme;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  const meta=$('#themeColorMeta');if(meta)meta.setAttribute('content',colors[theme]);
  if(save){try{localStorage.setItem('haeum-wiki-theme-v2',theme);}catch(error){}}
 }
 document.addEventListener('click',event=>{const button=event.target.closest('.theme-btn[data-theme]');if(!button)return;event.preventDefault();applyTheme(button.dataset.theme,true);});
 let initial='dark';try{const saved=localStorage.getItem('haeum-wiki-theme-v2');if(saved&&valid.has(saved))initial=saved;}catch(error){}applyTheme(initial);
})();

// Back-to-top appears only after the reader has moved down the page.
(()=>{const button=$('#backtop');if(!button)return;let ticking=false;const update=()=>{button.hidden=window.scrollY<420;ticking=false;};window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});update();})();

// Keep current navigation item aligned with the section in view.
if('IntersectionObserver'in window){
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;
  const id=visible.target.id.replace('page-','');$$('.navitem').forEach(a=>a.classList.toggle('active',a.dataset.page===id));
  if(pages[id]&&$('#crumbName'))$('#crumbName').textContent=pages[id];
 },{rootMargin:'-18% 0px -68% 0px',threshold:[0,.1,.25,.5]});
 $$('[id^="page-"]').forEach(section=>observer.observe(section));
}


// v2.6.0 — reading progress, compact mobile contents and table scroll hints.
(()=>{
 const bar=$('#readingProgressBar');let scheduled=false;
 const update=()=>{if(!bar)return;const root=document.documentElement;const max=root.scrollHeight-window.innerHeight;const value=max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0;bar.style.width=value+'%';scheduled=false;};
 window.addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(update);scheduled=true;}},{passive:true});window.addEventListener('resize',update);update();
})();

(()=>{
 $$('.toc').forEach((toc,index)=>{
  const title=$('.toc-title',toc),list=$('ol',toc);if(!title||!list)return;
  const button=document.createElement('button');button.type='button';button.className='toc-toggle';button.textContent='목차 열기';button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','문서 목차 펼치기');
  title.append(button);
  button.addEventListener('click',()=>{const open=toc.classList.toggle('is-open');button.textContent=open?'목차 접기':'목차 열기';button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'문서 목차 접기':'문서 목차 펼치기');});
  list.addEventListener('click',event=>{if(event.target.closest('a')&&window.matchMedia('(max-width:700px)').matches){toc.classList.remove('is-open');button.textContent='목차 열기';button.setAttribute('aria-expanded','false');}});
 });
})();

(()=>{
 const update=wrap=>{const scrollable=wrap.scrollWidth>wrap.clientWidth+2;wrap.classList.toggle('is-scrollable',scrollable);wrap.classList.toggle('is-at-end',scrollable&&wrap.scrollLeft+wrap.clientWidth>=wrap.scrollWidth-3);};
 $$('.tablewrap').forEach(wrap=>{update(wrap);wrap.addEventListener('scroll',()=>update(wrap),{passive:true});});
 window.addEventListener('resize',()=>$$('.tablewrap').forEach(update));
})();


// v2.6.2 — related-document navigation across the wiki.
(()=>{
 const relations={
  main:['broadcast','stats','community','avatar','illustrations','timeline','fandom'],
  broadcast:['stats','timeline','community','main'],
  stats:['broadcast','timeline','evaluation','main'],
  community:['fandom','timeline','broadcast','main'],
  avatar:['illustrations','main','timeline','evaluation'],
  illustrations:['avatar','main','broadcast'],
  timeline:['broadcast','community','stats','fandom'],
  evaluation:['stats','broadcast','community','avatar'],
  fandom:['community','timeline','main']
 };
 const descriptions={
  main:'방송인 기본 정보와 주요 활동을 소개합니다.',
  broadcast:'방송 콘텐츠와 진행 방식, 편성 기록을 살펴봅니다.',
  stats:'세션별 방송 시간과 시청자·채팅 지표를 확인합니다.',
  community:'X와 네이버 팬카페의 공개 활동을 정리합니다.',
  avatar:'캐릭터 디자인과 버추얼 모델 준비 내용을 정리합니다.',
  illustrations:'방송 관련 일러스트 자료와 설명을 모았습니다.',
  timeline:'방송 및 커뮤니티의 주요 날짜별 기록입니다.',
  evaluation:'확인된 자료를 바탕으로 초기 활동을 종합합니다.',
  fandom:'토토단 명칭과 관련된 공개 기록을 확인합니다.'
 };
 const titles={...pages};
 Object.entries(relations).forEach(([id,ids])=>{
  const article=$(`#page-${id} .article`);if(!article||$('.related-docs',article))return;
  const section=document.createElement('section');section.className='related-docs';section.setAttribute('aria-label','관련 문서');
  const heading=document.createElement('div');heading.className='related-head';
  const label=document.createElement('div');label.innerHTML='<span>EXPLORE MORE</span><h2>관련 문서</h2>';
  const hint=document.createElement('small');hint.textContent='함께 읽으면 좋은 문서';heading.append(label,hint);section.append(heading);
  const grid=document.createElement('div');grid.className='related-grid';
  ids.forEach(next=>{
   const a=document.createElement('a');a.className='related-card';a.href=`#page-${next}`;a.dataset.page=next;
   const top=document.createElement('span');top.className='related-card-kicker';top.textContent='HAEUM WIKI DOCUMENT';
   const title=document.createElement('strong');title.textContent=titles[next];
   const desc=document.createElement('small');desc.textContent=descriptions[next];
   const arrow=document.createElement('span');arrow.className='related-arrow';arrow.textContent='→';arrow.setAttribute('aria-hidden','true');
   a.append(top,title,desc,arrow);grid.append(a);
  });
  section.append(grid);
  const note=$('.note:last-of-type',article);
  article.append(section);
 });
})();
