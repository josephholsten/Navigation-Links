// ==UserScript==
// @name           Link Navigation Keyboard Shortcuts
// @namespace      http://scripts.josephholsten.com
// @description    Use CTRL+Left for prev, CTRL+Right for next CTRL+down for first, CTRL+up for last
// @include        *
// ==/UserScript==

document.addEventListener('keyup', function(e) {
  if (!e) e = window.event;
  var k = e.keyCode ? e.keyCode : e.which;
  if (e.ctrlKey && k == 37) //
    var s = 'prev';
  else if (e.ctrlKey && k == 39) //
    s = 'next';
  else if (e.ctrlKey && k == 38) //up
    s = 'last';
  else if (e.ctrlKey && k == 40) //down
    s = 'first';
  else {
    return;
  }
  var i = document.querySelector('[rel~='+s+']');
  if (i)
    window.location = i.href;
  else
    alert('link not found');
}, false);

