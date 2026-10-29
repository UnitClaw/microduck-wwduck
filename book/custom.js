(function () {
  function target() {
    var path = window.location.pathname;
    var isEn = path.indexOf('/en/') !== -1;
    var href;
    if (isEn) {
      href = path.replace('/en/', '/');
    } else {
      var m = path.match(/^(\/[^/]+\/)/);
      href = m ? path.replace(m[1], m[1] + 'en/') : '/en/';
    }
    return { href: href, isEn: isEn };
  }

  var t = target();
  var a = document.createElement('a');
  a.className = 'icon-button lang-switch';
  a.href = t.href;
  a.title = t.isEn ? '切换到中文版' : 'Switch to English';
  a.setAttribute('aria-label', a.title);

  var icon = document.createElement('i');
  icon.className = 'fa fa-language';
  a.appendChild(icon);

  var label = document.createElement('span');
  label.textContent = t.isEn ? '中文' : 'EN';
  a.appendChild(label);

  var right = document.querySelector('#menu-bar .right-buttons');
  if (right) {
    right.insertBefore(a, right.firstChild);
  } else {
    document.body.appendChild(a);
  }
})();
