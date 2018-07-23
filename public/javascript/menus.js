function safeText(text) {
  var result = JSON.stringify(text);
  // remove the quotes that stringify adds in
  return result.substring(1,result.length - 1);
}



function createMenu_li(data) {
  var mdivs='';
  for (var i in data) {
    var d = data[i];
    var mid = safeText(d.id);
    var mtext = safeText(d.text);
    mdivs += '<li id="menuItem_'+mid+'"'
      + ' class="menuItem'+((i==0)?' active':'')+'"'
      + '><a>'+mtext+'</a></li>';
  }
  return mdivs;
};

