/**
 * Antivirus and form-helper extensions (Kaspersky `bis_skin_checked`,
 * Colorzilla `cz-shortcut-listen`) stamp attributes onto arbitrary DOM nodes
 * before React hydrates. Root `html`/`body` already use
 * `suppressHydrationWarning`; this script strips the same attrs from descendants
 * so the hydration pass does not treat them as a server/client mismatch.
 */
export const STRIP_EXTENSION_DOM_ATTRS_SCRIPT = `(function(){
  var ATTRS=["bis_skin_checked","cz-shortcut-listen"];
  function strip(node){
    if(!node||node.nodeType!==1)return;
    for(var i=0;i<ATTRS.length;i++) node.removeAttribute(ATTRS[i]);
  }
  function walk(node){
    strip(node);
    if(!node.querySelectorAll)return;
    var nodes=node.querySelectorAll("["+ATTRS.join("],[")+"]");
    for(var i=0;i<nodes.length;i++) strip(nodes[i]);
  }
  new MutationObserver(function(mutations){
    for(var i=0;i<mutations.length;i++){
      var mutation=mutations[i];
      if(mutation.type==="attributes") strip(mutation.target);
      else {
        for(var j=0;j<mutation.addedNodes.length;j++) walk(mutation.addedNodes[j]);
      }
    }
  }).observe(document.documentElement,{
    subtree:true,
    childList:true,
    attributes:true,
    attributeFilter:ATTRS
  });
  walk(document.documentElement);
})();`;
