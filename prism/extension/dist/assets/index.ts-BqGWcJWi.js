(function(){const b=["article",'[role="main"]',"main",".article-body",".post-content",".entry-content",".content",".article-content","#content","#main",".story-body",".page-content"],m=new Set("script style noscript iframe svg math nav footer header aside form button".split(" "));function E(t=document){for(const e of b){const o=t.querySelector(e);if(o&&y(o)>100)return o}return null}function p(t,e=0){const o=[],n=e>0?e+256:0;function r(i){var a,u;if(n>0&&o.join(" ").length>=n)return;if(i.nodeType===Node.TEXT_NODE){const c=(a=i.textContent)==null?void 0:a.trim();c&&o.push(c);return}if(i.nodeType!==Node.ELEMENT_NODE)return;const l=(u=i.tagName)==null?void 0:u.toLowerCase();if(!(l&&m.has(l))){for(let c=0;c<i.childNodes.length;c++)if(r(i.childNodes[c]),n>0&&o.join(" ").length>=n)return;["p","br","div","li","h1","h2","h3","h4","blockquote"].includes(l||"")&&o.push(`
`)}}r(t);let s=o.join(" ").replace(/\n{3,}/g,`

`).replace(/[ \t]+/g," ").trim();return e>0&&s.length>e&&(s=s.slice(0,e)+"..."),s}function y(t){const e=t.cloneNode(!0);for(const o of m)for(const n of e.querySelectorAll(o))n.remove();return(e.textContent||"").trim().length}const d=12e3,f=50,g='[data-testid="tweetText"]',T='article[data-testid="tweet"]',w=['[data-testid="post-content"]','[slot="full-post-content"]',".Post .UserPost",'[data-click-id="text"]'];function C(t){var r,s;const e=((s=(r=t.defaultView)==null?void 0:r.location)==null?void 0:s.hostname)??window.location.hostname;if(!/^(x\.com|twitter\.com)$/.test(e))return"";const o=t.querySelector(g);if(o)return p(o,d);const n=t.querySelector(T);return n?p(n,d):""}function _(t){var o,n;const e=((n=(o=t.defaultView)==null?void 0:o.location)==null?void 0:n.hostname)??window.location.hostname;if(!/^((?:www\.)?reddit\.com)$/.test(e))return"";for(const r of w){const s=t.querySelector(r);if(s){const i=p(s,d);if(i.length>=f)return i}}return""}function v(t=document){var r,s,i,l;const e=((s=(r=t.defaultView)==null?void 0:r.location)==null?void 0:s.href)??window.location.href,o=t.title||"Untitled";let n=C(t)||_(t);if(n.length<f){const a=E(t);n=a?p(a,d):""}if(n.length<f){const a=t.body;n=a?p(a,d):""}return n.length<f&&(n=((l=(i=t.body)==null?void 0:i.innerText)==null?void 0:l.slice(0,d))||o),{url:e,title:o,text:n}}const h=40,S=120,N=420;function x(){if(document.getElementById("prism-floating-root"))return;const t=document.createElement("div");t.id="prism-floating-root",t.style.cssText=`
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2147483646;
    font-family: system-ui, sans-serif;
  `;const e=document.createElement("div");e.id="prism-floating-tab",e.setAttribute("aria-label","Open Prism"),e.style.cssText=`
    width: ${h}px;
    height: ${S}px;
    background: #2C2C2C;
    border: 1px solid #404040;
    border-right: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -4px 0 12px rgba(0,0,0,0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.2s;
  `;const o=chrome.runtime.getURL("icons/logo.png"),n=document.createElement("img");n.src=o,n.alt="Prism",n.setAttribute("aria-hidden","true"),n.style.cssText=`
    width: 28px;
    height: 28px;
    object-fit: contain;
  `,e.appendChild(n);const r=document.createElement("div");r.id="prism-floating-panel",r.style.cssText=`
    position: absolute;
    right: ${h}px;
    top: 50%;
    transform: translateY(-50%);
    width: ${N}px;
    height: 90vh;
    max-height: 600px;
    background: #121212;
    border: 1px solid #404040;
    border-radius: 12px 0 0 12px;
    box-shadow: -8px 0 24px rgba(0,0,0,0.3);
    overflow: hidden;
    display: none;
  `;const s=document.createElement("iframe");s.src=chrome.runtime.getURL("popup.html"),s.style.cssText=`
    width: 100%;
    height: 100%;
    border: none;
  `;const i=document.createElement("button");i.textContent="×",i.setAttribute("aria-label","Close"),i.style.cssText=`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background: #2C2C2C;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #FFFFFF;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    z-index: 10;
  `,r.appendChild(s),r.appendChild(i);let l=!1;function a(){l=!0,r.style.display="block",e.style.display="none",e.style.borderRadius="0"}function u(){l=!1,r.style.display="none",e.style.display="flex",e.style.borderRadius="12px 0 0 12px"}e.addEventListener("mouseenter",()=>{l||(e.style.boxShadow="-6px 0 16px rgba(0,0,0,0.3)")}),e.addEventListener("mouseleave",()=>{l||(e.style.boxShadow="-4px 0 12px rgba(0,0,0,0.2)")}),e.addEventListener("click",()=>{l?u():a()}),i.addEventListener("click",u),window.addEventListener("prism-open-sidebar",()=>{l||a()}),t.appendChild(r),t.appendChild(e),document.body.appendChild(t)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",x):x();chrome.runtime.onMessage.addListener((t,e,o)=>{if((t==null?void 0:t.type)==="OPEN_SIDEBAR")return window.dispatchEvent(new CustomEvent("prism-open-sidebar")),o({ok:!0}),!0;if((t==null?void 0:t.type)==="EXTRACT"){try{const n=v(document);o({ok:!0,data:n})}catch(n){o({ok:!1,error:n instanceof Error?n.message:"Extraction failed"})}return!0}});
})()
