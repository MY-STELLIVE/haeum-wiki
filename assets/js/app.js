const pages={main:"뭐해음",broadcast:"방송 활동",stats:"방송 통계",community:"SNS·팬 커뮤니티",avatar:"캐릭터·버추얼 모델",illustrations:"방송 일러스트",timeline:"활동 연혁",evaluation:"종합 평가",fandom:"토토단"};
function showPage(id){
if(!pages[id])id="main";
const target=document.getElementById("page-"+id);
document.querySelectorAll(".navitem").forEach(a=>a.classList.toggle("active",a.dataset.page===id));
document.getElementById("crumbName").textContent=pages[id];
document.title=pages[id]+" - 해음위키";
document.getElementById("sidebar").classList.remove("open");
document.getElementById("searchResults").classList.remove("show");
document.getElementById("search").value="";
if(target)window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-84),behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showPage(a.dataset.page)}));
document.getElementById("homeBtn").addEventListener("click",()=>showPage("main"));
document.querySelector(".brand").addEventListener("click",e=>{e.preventDefault();showPage("main")});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
const searchIndex=[
["뭐해음","main","문서 개요, 기본 정보, 첫 방송"],
["방송 활동","broadcast","토크, 게임, 방송 시간대"],
["방송 통계","stats","22회 방송 기록, 시청자, 채팅"],
["SNS·팬 커뮤니티","community","X, 네이버 팬카페, 공지"],
["캐릭터·버추얼 모델","avatar","일러스트, 3D 모델, 정식 데뷔 준비"],
["방송 일러스트","illustrations","대표 이미지, 방송 공간, 휴식 장면, 원본 일러스트"],
["활동 연혁","timeline","2026년 10월과 11월 주요 기록"],
["종합 평가","evaluation","초기 활동 종합, 향후 관찰 지표"],
["토토단","fandom","팬덤명 투표, 공식 발표"]
];
const input=document.getElementById("search"),results=document.getElementById("searchResults");
function renderSearch(){const q=input.value.trim().toLowerCase();if(!q){results.classList.remove("show");results.innerHTML="";return}const found=searchIndex.filter(x=>(x.join(" ").toLowerCase()).includes(q));results.innerHTML=found.length?found.map(x=>`<a class="result" href="#" data-result="${x[1]}">${x[0]}<small>${x[2]}</small></a>`).join(""):'<div class="result muted">검색 결과가 없습니다.</div>';results.classList.add("show");results.querySelectorAll("[data-result]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showPage(a.dataset.result)}));}
input.addEventListener("input",renderSearch);input.addEventListener("keydown",e=>{if(e.key==="Enter"){const first=results.querySelector("[data-result]");if(first)showPage(first.dataset.result)}if(e.key==="Escape")results.classList.remove("show")});
document.addEventListener("click",e=>{if(!e.target.closest(".searchwrap"))results.classList.remove("show")});
document.getElementById("backtop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

// Keep the sidebar selection synchronized with the section currently being read.
const sectionObserver = new IntersectionObserver(entries=>{
 const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
 if(!visible)return;
 const id=visible.target.id.replace("page-","");
 document.querySelectorAll(".navitem").forEach(a=>a.classList.toggle("active",a.dataset.page===id));
 const label=pages[id];
 if(label)document.getElementById("crumbName").textContent=label;
},{rootMargin:"-18% 0px -68% 0px",threshold:[0,.1,.25,.5]});
document.querySelectorAll('[id^="page-"]').forEach(section=>sectionObserver.observe(section));


const closeMobileNav=()=>document.getElementById("sidebar").classList.remove("open");
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMobileNav()});
document.addEventListener("click",e=>{
 const sidebar=document.getElementById("sidebar"),menu=document.getElementById("menuBtn");
 if(sidebar.classList.contains("open")&&!sidebar.contains(e.target)&&!menu.contains(e.target))closeMobileNav();
});


// v2.5: three selectable themes (saved on this device).
const themeButtons = document.querySelectorAll('[data-theme]');
const themeMeta = document.getElementById('themeColorMeta');
const themeColors = { light: '#f5f7fb', dark: '#111318', signature: '#090f26' };
function applyTheme(theme, save = false) {
  const selected = ['light', 'dark', 'signature'].includes(theme) ? theme : 'signature';
  document.documentElement.dataset.theme = selected;
  themeButtons.forEach(button => {
    const active = button.dataset.theme === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (themeMeta) themeMeta.setAttribute('content', themeColors[selected]);
  if (save) { try { localStorage.setItem('haeum-wiki-theme', selected); } catch (_) {} }
}
themeButtons.forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.theme, true)));
let savedTheme = 'signature';
try { savedTheme = localStorage.getItem('haeum-wiki-theme') || 'signature'; } catch (_) {}
applyTheme(savedTheme);
