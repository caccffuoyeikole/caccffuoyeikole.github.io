const fallback = {"site": {"name": "GreenWave", "logo": "G", "language": "en"}, "theme": {"primary": "#002900", "secondary": "#009A00", "accent": "#F5C810"}, "header": {"brand": "GreenWave", "cta": "Explore Media", "ctaLink": "#latest", "home": "Home", "latest": "Latest", "categories": "Categories", "popular": "Popular", "artists": "Artists"}, "hero": {"eyebrow": "MUSIC \u2022 AUDIO \u2022 MEDIA", "line1": "Discover it.", "line2": "Play it.", "line3": "Download it.", "text": "A clean, fast home for discovering high-quality audio and multimedia from independent creators.", "primaryText": "Explore latest", "primaryLink": "#latest", "secondaryText": "Browse categories", "secondaryLink": "#categories", "badge": "NEW", "badgeStrong": "RELEASE", "quality": "320", "qualityLabel": "KBPS"}, "stats": [{"number": "01", "text": "Fresh releases"}, {"number": "02", "text": "High-quality audio"}, {"number": "03", "text": "Fast downloads"}, {"number": "04", "text": "Creator-focused"}], "latest": {"eyebrow": "UPDATED REGULARLY", "title": "Latest releases", "viewAll": "View all \u2192", "viewAllLink": "#latest"}, "releases": [{"title": "Midnight Drive", "artist": "Artist One", "category": "Afrobeats", "downloads": 4821, "letter": "M", "audioUrl": "", "coverUrl": "", "featured": false}, {"title": "Golden Hour", "artist": "Artist Two", "category": "Amapiano", "downloads": 3910, "letter": "G", "audioUrl": "", "coverUrl": "", "featured": false}, {"title": "No Pressure", "artist": "Artist Three", "category": "Hip-Hop", "downloads": 3254, "letter": "N", "audioUrl": "", "coverUrl": "", "featured": false}, {"title": "Afterglow", "artist": "Artist Four", "category": "R&B", "downloads": 2876, "letter": "A", "audioUrl": "", "coverUrl": "", "featured": false}], "categories": [{"code": "AF", "name": "Afrobeats", "description": "Explore sounds"}, {"code": "HH", "name": "Hip-Hop", "description": "Explore sounds"}, {"code": "AM", "name": "Amapiano", "description": "Explore sounds"}, {"code": "RB", "name": "R&B", "description": "Explore sounds"}, {"code": "GO", "name": "Gospel", "description": "Explore sounds"}, {"code": "PC", "name": "Podcasts", "description": "Explore sounds"}], "popular": {"eyebrow": "TRENDING NOW", "title": "Popular downloads"}, "artists": {"eyebrow": "CREATORS", "title": "Featured artists", "allText": "All artists \u2192", "allLink": "#artists", "items": [{"avatar": "01", "name": "Artist One", "category": "Afrobeats"}, {"avatar": "02", "name": "Artist Two", "category": "Amapiano"}, {"avatar": "03", "name": "Artist Three", "category": "R&B"}, {"avatar": "04", "name": "Artist Four", "category": "Hip-Hop"}]}, "player": {"emptyTitle": "Select a track", "emptyArtist": "Nothing playing", "downloadTitle": "Download", "enabled": true}, "footer": {"brand": "GreenWave", "text": "Independent multimedia discovery, built for creators and listeners.", "aboutText": "About", "aboutLink": "#", "contactText": "Contact", "contactLink": "#", "privacyText": "Privacy", "privacyLink": "#", "copyright": "\u00a9 2026 GreenWave. All rights reserved."}, "seo": {"title": "GreenWave \u2014 Music & Media", "description": "A modern multimedia discovery and download platform.", "canonical": "", "socialImage": ""}};

let cfg = null, tracks = [];
const grid = document.querySelector("#latestGrid");
const popular = document.querySelector("#popularList");
const audio = document.querySelector("#audio");
const playBtn = document.querySelector("#playBtn");
const title = document.querySelector("#playerTitle");
const artist = document.querySelector("#playerArtist");
const mini = document.querySelector("#miniCover");
const progress = document.querySelector("#progress");
const time = document.querySelector("#time");
const download = document.querySelector("#downloadBtn");
let current = -1;

function safe(v){return String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

async function load(){
  try{ const r=await fetch("content.json",{cache:"no-store"}); if(!r.ok) throw new Error(); cfg=await r.json(); }
  catch(e){ cfg=fallback; }
  tracks=cfg.releases||[];
  applyConfig();
  renderAll();
}
function applyConfig(){
  document.title=cfg.seo?.title||"GreenWave — Music & Media";
  const desc=document.querySelector('meta[name="description"]'); if(desc) desc.content=cfg.seo?.description||"";
  const root=document.documentElement;
  if(cfg.theme?.primary)root.style.setProperty("--primary",cfg.theme.primary);
  if(cfg.theme?.secondary)root.style.setProperty("--secondary",cfg.theme.secondary);
  if(cfg.theme?.accent)root.style.setProperty("--accent",cfg.theme.accent);

  const brand=document.querySelector(".brand"); if(brand){brand.querySelector(".brand-mark").textContent=cfg.site.logo;brand.querySelector("span:last-child").textContent=cfg.header.brand;}
  const nav=[...document.querySelectorAll(".nav a")];
  [cfg.header.home,cfg.header.latest,cfg.header.categories,cfg.header.popular,cfg.header.artists].forEach((x,i)=>{if(nav[i])nav[i].textContent=x});
  const cta=document.querySelector(".header-download"); cta.textContent=cfg.header.cta; cta.href=cfg.header.ctaLink;

  const ey=document.querySelector(".hero .eyebrow"); if(ey)ey.textContent=cfg.hero.eyebrow;
  const h=document.querySelector(".hero h1"); if(h)h.innerHTML=`${safe(cfg.hero.line1)}<br><span>${safe(cfg.hero.line2)}</span><br>${safe(cfg.hero.line3)}`;
  document.querySelector(".hero-text").textContent=cfg.hero.text;
  const heroBtns=document.querySelectorAll(".hero-actions a"); if(heroBtns[0]){heroBtns[0].textContent=cfg.hero.primaryText;heroBtns[0].href=cfg.hero.primaryLink} if(heroBtns[1]){heroBtns[1].textContent=cfg.hero.secondaryText;heroBtns[1].href=cfg.hero.secondaryLink}
  const badges=document.querySelectorAll(".floating-card"); if(badges[0])badges[0].innerHTML=`${safe(cfg.hero.badge)}<br><strong>${safe(cfg.hero.badgeStrong)}</strong>`; if(badges[1])badges[1].innerHTML=`${safe(cfg.hero.quality)}<br><small>${safe(cfg.hero.qualityLabel)}</small>`;

  const statEls=document.querySelectorAll(".quick-stats div"); (cfg.stats||[]).forEach((s,i)=>{if(statEls[i]){statEls[i].querySelector("strong").textContent=s.number;statEls[i].querySelector("span").textContent=s.text}});
  const latest=document.querySelector("#latest .section-heading"); if(latest){latest.querySelector(".eyebrow").textContent=cfg.latest.eyebrow;latest.querySelector("h2").textContent=cfg.latest.title;latest.querySelector(".text-link").textContent=cfg.latest.viewAll;latest.querySelector(".text-link").href=cfg.latest.viewAllLink}
  const catButtons=document.querySelectorAll(".category-grid button"); (cfg.categories||[]).forEach((c,i)=>{if(catButtons[i]){catButtons[i].dataset.category=c.name;catButtons[i].querySelector("span").textContent=c.code;catButtons[i].querySelector("b").textContent=c.name;catButtons[i].querySelector("small").textContent=c.description}});
  const pop=document.querySelector("#popular .section-heading"); if(pop){pop.querySelector(".eyebrow").textContent=cfg.popular.eyebrow;pop.querySelector("h2").textContent=cfg.popular.title}
  const art=document.querySelector("#artists .section-heading"); if(art){art.querySelector(".eyebrow").textContent=cfg.artists.eyebrow;art.querySelector("h2").textContent=cfg.artists.title;art.querySelector(".text-link").textContent=cfg.artists.allText;art.querySelector(".text-link").href=cfg.artists.allLink}
  const artists=[...document.querySelectorAll(".artist")]; (cfg.artists.items||[]).forEach((a,i)=>{if(artists[i]){artists[i].querySelector(".avatar").textContent=a.avatar;artists[i].querySelector("h3").textContent=a.name;artists[i].querySelector("p").textContent=a.category}});
  title.textContent=cfg.player.emptyTitle; artist.textContent=cfg.player.emptyArtist; download.title=cfg.player.downloadTitle;
  const foot=document.querySelector("footer"); if(foot){foot.querySelector(".footer-brand strong").textContent=cfg.footer.brand;foot.querySelector("p").textContent=cfg.footer.text;const links=foot.querySelectorAll(".footer-links a");[[cfg.footer.aboutText,cfg.footer.aboutLink],[cfg.footer.contactText,cfg.footer.contactLink],[cfg.footer.privacyText,cfg.footer.privacyLink]].forEach((x,i)=>{if(links[i]){links[i].textContent=x[0];links[i].href=x[1]}});foot.querySelector("small").textContent=cfg.footer.copyright}
}
function card(t,i){
  const cover=t.coverUrl?`<img src="${safe(t.coverUrl)}" alt="" style="width:100%;height:100%;object-fit:cover">`:safe(t.letter||t.title?.[0]||"•");
  return `<article class="media-card"><div class="cover">${t.featured?'<span class="tag">FEATURED</span>':`<span class="tag">${safe(t.category)}</span>`}${cover}</div><div class="media-info"><h3>${safe(t.title)}</h3><p>${safe(t.artist)}</p><div class="media-bottom"><button class="play-card" data-play="${i}">▶ Play</button><button class="download-card" data-download="${i}">↓ Download</button></div></div></article>`;
}
function renderAll(){
  grid.innerHTML=tracks.map(card).join("");
  popular.innerHTML=[...tracks].sort((a,b)=>(b.downloads||0)-(a.downloads||0)).map((t,i)=>`<div class="popular-item"><span class="number">${String(i+1).padStart(2,"0")}</span><div><strong>${safe(t.title)}</strong><p>${safe(t.artist)} · ${safe(t.category)}</p></div><span class="downloads">${Number(t.downloads||0).toLocaleString()} downloads</span><button class="list-play" data-play="${tracks.indexOf(t)}">▶</button></div>`).join("");
}
function selectTrack(i){
  const t=tracks[i]; if(!t)return; current=i; title.textContent=t.title; artist.textContent=t.artist+" · "+t.category; mini.textContent=t.letter||t.title?.[0]||"•";
  if(t.audioUrl){audio.src=t.audioUrl;}else{audio.removeAttribute("src");}
  playBtn.textContent="▶";
}
document.addEventListener("click",e=>{
  const p=e.target.closest("[data-play]"); if(p)selectTrack(Number(p.dataset.play));
  const d=e.target.closest("[data-download]"); if(d){const t=tracks[Number(d.dataset.download)];selectTrack(Number(d.dataset.download));if(t?.audioUrl){const a=document.createElement("a");a.href=t.audioUrl;a.download="";a.click()}else alert("This release has no audio file connected yet.")}
});
playBtn.addEventListener("click",()=>{if(current<0)selectTrack(0);if(audio.src){audio.paused?audio.play():audio.pause()}});
audio.addEventListener("play",()=>playBtn.textContent="Ⅱ");audio.addEventListener("pause",()=>playBtn.textContent="▶");
audio.addEventListener("timeupdate",()=>{if(!audio.duration)return;progress.style.width=(audio.currentTime/audio.duration*100)+"%";const s=Math.floor(audio.currentTime);time.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`});
document.querySelectorAll(".category-grid button").forEach(b=>b.addEventListener("click",()=>{const cat=b.dataset.category;const filtered=tracks.filter(t=>t.category===cat);grid.innerHTML=(filtered.length?filtered:tracks).map(t=>card(t,tracks.indexOf(t))).join("");document.querySelector("#latest").scrollIntoView({behavior:"smooth"})}));
document.querySelector(".menu-toggle").addEventListener("click",()=>alert("Mobile navigation will be expanded in the next UI pass."));
load();