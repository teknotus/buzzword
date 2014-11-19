var buildRegex = function(){ // build regex from definitions in JSON
  var pattern = new RegExp('\\b(' + Object.keys(data).join('|') + ')\\b','g' );
  console.log('regex: ' + pattern);
  return pattern;
}
var findText = function(doc){ // process all text nodes
  pattern = buildRegex();
  tree = document.createTreeWalker(doc,NodeFilter.SHOW_TEXT);
  nodeArray = [];
  while(node = tree.nextNode()){
    nodeArray.push(tree.currentNode);
  }
  // double pass because otherwise treewalker finds spans as created
  for(var i = 0,l = nodeArray.length; i < l ; i++){
    findKeywords(nodeArray[i],pattern);
  }
};
// find keywords insert spans and click listeners
var findKeywords = function(node,pattern){
  var currentMatch,preSpan,inSpan,afterSpan;
  preSpan = node;
  while((currentMatch = pattern.exec(preSpan.nodeValue)) !== null){
    var begin = currentMatch.index;
    var end = pattern.lastIndex;
    inSpan = begin ? preSpan.splitText(begin) : preSpan;
    afterSpan = inSpan.splitText(end - begin);
    var spanElement = document.createElement('span');
    spanElement.className = 'highlight';
    inSpan.parentElement.replaceChild(spanElement,inSpan);
    spanElement.appendChild(inSpan);
    spanElement.addEventListener('click',clickDefine,false);
    preSpan = afterSpan;
    pattern.lastIndex = 0;
  }
};
var dialogClose = function(){
  var dialog = document.getElementsByClassName('dialog')[0];
  dialog.style.display = 'none';
}
var clickDefine = function(e){
  var keyword = e.target.textContent;
  document.getElementById('keyword').innerHTML = keyword;
  document.getElementById('definition').innerHTML = data[keyword];
  dialog = document.getElementsByClassName('dialog')[0];
  dialog.style.display = 'inline-block';
  dialog.style.top =  (e.clientY + 10) + 'px';
}
// run it
window.onload = function(){
  findText(document.getElementById("main"));
};

