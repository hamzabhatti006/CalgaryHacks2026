(function(){const b=["article",'[role="main"]',"main",".article-body",".post-content",".entry-content",".content",".article-content","#content","#main",".story-body",".page-content"],m=new Set("script style noscript iframe svg math nav footer header aside form button".split(" "));function g(e=document){for(const n of b){const o=e.querySelector(n);if(o&&E(o)>100)return o}return null}function u(e,n=0){const o=[],t=n>0?n+256:0;function s(i){var l,f;if(t>0&&o.join(" ").length>=t)return;if(i.nodeType===Node.TEXT_NODE){const c=(l=i.textContent)==null?void 0:l.trim();c&&o.push(c);return}if(i.nodeType!==Node.ELEMENT_NODE)return;const a=(f=i.tagName)==null?void 0:f.toLowerCase();if(!(a&&m.has(a))){for(let c=0;c<i.childNodes.length;c++)if(s(i.childNodes[c]),t>0&&o.join(" ").length>=t)return;["p","br","div","li","h1","h2","h3","h4","blockquote"].includes(a||"")&&o.push(`
`)}}s(e);let r=o.join(" ").replace(/\n{3,}/g,`

`).replace(/[ \t]+/g," ").trim();return n>0&&r.length>n&&(r=r.slice(0,n)+"..."),r}function E(e){const n=e.cloneNode(!0);for(const o of m)for(const t of n.querySelectorAll(o))t.remove();return(n.textContent||"").trim().length}const d=12e3,p=50,T='[data-testid="tweetText"]',y='article[data-testid="tweet"]',w=['[data-testid="post-content"]','[slot="full-post-content"]',".Post .UserPost",'[data-click-id="text"]'];function C(e){var s,r;const n=((r=(s=e.defaultView)==null?void 0:s.location)==null?void 0:r.hostname)??window.location.hostname;if(!/^(x\.com|twitter\.com)$/.test(n))return"";const o=e.querySelector(T);if(o)return u(o,d);const t=e.querySelector(y);return t?u(t,d):""}function A(e){var o,t;const n=((t=(o=e.defaultView)==null?void 0:o.location)==null?void 0:t.hostname)??window.location.hostname;if(!/^((?:www\.)?reddit\.com)$/.test(n))return"";for(const s of w){const r=e.querySelector(s);if(r){const i=u(r,d);if(i.length>=p)return i}}return""}function _(e=document){var s,r,i,a;const n=((r=(s=e.defaultView)==null?void 0:s.location)==null?void 0:r.href)??window.location.href,o=e.title||"Untitled";let t=C(e)||A(e);if(t.length<p){const l=g(e);t=l?u(l,d):""}if(t.length<p){const l=e.body;t=l?u(l,d):""}return t.length<p&&(t=((a=(i=e.body)==null?void 0:i.innerText)==null?void 0:a.slice(0,d))||o),{url:n,title:o,text:t}}const h=40,S=120,v=420;function x(){if(document.getElementById("prism-floating-root"))return;const e=document.createElement("div");e.id="prism-floating-root",e.style.cssText=`
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2147483646;
    font-family: system-ui, sans-serif;
  `;const n=document.createElement("div");n.id="prism-floating-tab",n.setAttribute("aria-label","Open Prism"),n.style.cssText=`
    width: ${h}px;
    height: ${S}px;
    background: linear-gradient(135deg, #37353E 0%, #44444E 100%);
    border: 1px solid #715A5A;
    border-right: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -4px 0 12px rgba(0,0,0,0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.2s;
  `;const o=document.createElement("span");o.textContent="Prism",o.style.cssText=`
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 14px;
    font-weight: 600;
    color: #D3DAD9;
    letter-spacing: 1px;
  `,n.appendChild(o);const t=document.createElement("div");t.id="prism-floating-panel",t.style.cssText=`
    position: absolute;
    right: ${h}px;
    top: 50%;
    transform: translateY(-50%);
    width: ${v}px;
    height: 90vh;
    max-height: 600px;
    background: #37353E;
    border: 1px solid #715A5A;
    border-radius: 12px 0 0 12px;
    box-shadow: -8px 0 24px rgba(0,0,0,0.3);
    overflow: hidden;
    display: none;
  `;const s=document.createElement("iframe");s.src=chrome.runtime.getURL("popup.html"),s.style.cssText=`
    width: 100%;
    height: 100%;
    border: none;
  `;const r=document.createElement("button");r.textContent="×",r.setAttribute("aria-label","Close"),r.style.cssText=`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background: rgba(255,255,255,0.1);
    border: 1px solid #715A5A;
    border-radius: 6px;
    color: #D3DAD9;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    z-index: 10;
  `,t.appendChild(s),t.appendChild(r);let i=!1;function a(){i=!0,t.style.display="block",n.style.borderRadius="0"}function l(){i=!1,t.style.display="none",n.style.borderRadius="12px 0 0 12px"}n.addEventListener("mouseenter",()=>{i||(n.style.boxShadow="-6px 0 16px rgba(0,0,0,0.3)")}),n.addEventListener("mouseleave",()=>{i||(n.style.boxShadow="-4px 0 12px rgba(0,0,0,0.2)")}),n.addEventListener("click",()=>{i?l():a()}),r.addEventListener("click",l),e.appendChild(t),e.appendChild(n),document.body.appendChild(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",x):x();chrome.runtime.onMessage.addListener((e,n,o)=>{if((e==null?void 0:e.type)==="EXTRACT"){try{const t=_(document);o({ok:!0,data:t})}catch(t){o({ok:!1,error:t instanceof Error?t.message:"Extraction failed"})}return!0}});
})()
