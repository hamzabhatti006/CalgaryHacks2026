chrome.action.onClicked.addListener(e=>{(e==null?void 0:e.id)!=null&&chrome.tabs.sendMessage(e.id,{type:"OPEN_SIDEBAR"}).catch(()=>{})});
