(function(){const g=["article",'[role="main"]',"main",".article-body",".post-content",".entry-content",".content",".article-content","#content","#main",".story-body",".page-content"],x=new Set("script style noscript iframe svg math nav footer header aside form button".split(" "));function b(e=document){for(const n of g){const o=e.querySelector(n);if(o&&E(o)>100)return o}return null}function p(e,n=0){const o=[],t=n>0?n+256:0;function r(i){var a,u;if(t>0&&o.join(" ").length>=t)return;if(i.nodeType===Node.TEXT_NODE){const c=(a=i.textContent)==null?void 0:a.trim();c&&o.push(c);return}if(i.nodeType!==Node.ELEMENT_NODE)return;const l=(u=i.tagName)==null?void 0:u.toLowerCase();if(!(l&&x.has(l))){for(let c=0;c<i.childNodes.length;c++)if(r(i.childNodes[c]),t>0&&o.join(" ").length>=t)return;["p","br","div","li","h1","h2","h3","h4","blockquote"].includes(l||"")&&o.push(`
`)}}r(e);let s=o.join(" ").replace(/\n{3,}/g,`

`).replace(/[ \t]+/g," ").trim();return n>0&&s.length>n&&(s=s.slice(0,n)+"..."),s}function E(e){const n=e.cloneNode(!0);for(const o of x)for(const t of n.querySelectorAll(o))t.remove();return(n.textContent||"").trim().length}const d=12e3,f=50,T='[data-testid="tweetText"]',y='article[data-testid="tweet"]',w=['[data-testid="post-content"]','[slot="full-post-content"]',".Post .UserPost",'[data-click-id="text"]'];function C(e){var r,s;const n=((s=(r=e.defaultView)==null?void 0:r.location)==null?void 0:s.hostname)??window.location.hostname;if(!/^(x\.com|twitter\.com)$/.test(n))return"";const o=e.querySelector(T);if(o)return p(o,d);const t=e.querySelector(y);return t?p(t,d):""}function A(e){var o,t;const n=((t=(o=e.defaultView)==null?void 0:o.location)==null?void 0:t.hostname)??window.location.hostname;if(!/^((?:www\.)?reddit\.com)$/.test(n))return"";for(const r of w){const s=e.querySelector(r);if(s){const i=p(s,d);if(i.length>=f)return i}}return""}function _(e=document){var r,s,i,l;const n=((s=(r=e.defaultView)==null?void 0:r.location)==null?void 0:s.href)??window.location.href,o=e.title||"Untitled";let t=C(e)||A(e);if(t.length<f){const a=b(e);t=a?p(a,d):""}if(t.length<f){const a=e.body;t=a?p(a,d):""}return t.length<f&&(t=((l=(i=e.body)==null?void 0:i.innerText)==null?void 0:l.slice(0,d))||o),{url:n,title:o,text:t}}const h=40,S=120,N=420;function m(){if(document.getElementById("prism-floating-root"))return;const e=document.createElement("div");e.id="prism-floating-root",e.style.cssText=`
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
  `;const o=chrome.runtime.getURL("icons/logo.png"),t=document.createElement("img");t.src=o,t.alt="Prism",t.setAttribute("aria-hidden","true"),t.style.cssText=`
    width: 28px;
    height: 28px;
    object-fit: contain;
  `,n.appendChild(t);const r=document.createElement("div");r.id="prism-floating-panel",r.style.cssText=`
    position: absolute;
    right: ${h}px;
    top: 50%;
    transform: translateY(-50%);
    width: ${N}px;
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
  `;const i=document.createElement("button");i.textContent="×",i.setAttribute("aria-label","Close"),i.style.cssText=`
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
  `,r.appendChild(s),r.appendChild(i);let l=!1;function a(){l=!0,r.style.display="block",n.style.borderRadius="0"}function u(){l=!1,r.style.display="none",n.style.borderRadius="12px 0 0 12px"}n.addEventListener("mouseenter",()=>{l||(n.style.boxShadow="-6px 0 16px rgba(0,0,0,0.3)")}),n.addEventListener("mouseleave",()=>{l||(n.style.boxShadow="-4px 0 12px rgba(0,0,0,0.2)")}),n.addEventListener("click",()=>{l?u():a()}),i.addEventListener("click",u),e.appendChild(r),e.appendChild(n),document.body.appendChild(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m();chrome.runtime.onMessage.addListener((e,n,o)=>{if((e==null?void 0:e.type)==="EXTRACT"){try{const t=_(document);o({ok:!0,data:t})}catch(t){o({ok:!1,error:t instanceof Error?t.message:"Extraction failed"})}return!0}});
})()
