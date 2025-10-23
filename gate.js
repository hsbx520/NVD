(function(){
  // Allowed hashes (split strings to reduce plain-text matching)
  var ALLOW_ROOT_HASHES = [
    'Vgejs6TM1zqz+FOXF0AJ2/' + 'hbtsO0v5lkSF2ky/4nnOk='
  ];
  var ALLOW_FULL_HOST_HASHES = [
    '5PxOizmBMUTI+5Wh8vut9' + 'mckETnq51hzJbHCDW5rADs='
  ];

  function show403(host){
    document.documentElement.innerHTML =
      '<!doctype html><html><head><meta charset="utf-8"><title>403 Forbidden</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{height:100%;margin:0;background:#0b0b0b;color:#76b900;display:flex;align-items:center;justify-content:center;font:16px/1.6 system-ui,Segoe UI,Roboto}.box{max-width:720px;padding:32px;border:1px solid #234;border-radius:12px;background:rgba(0,0,0,.6)}h1{margin:0 0 8px}code{background:#111;padding:2px 6px;border-radius:6px}</style></head><body><div class="box"><h1>403 — Forbidden</h1><p>Invalid host: <code>'+host+'</code></p><p>This site can only be served from the authorized domain.</p></div></body></html>';
  }

  function b64(buf){
    var bin = '';
    var bytes = new Uint8Array(buf);
    for (var i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function getRootDomain(host){
    var parts = (host||'').toLowerCase().split('.');
    return parts.length >= 2 ? parts.slice(-2).join('.') : (host||'');
  }
  var enc = new TextEncoder();
  function sha256b64(text){
    return crypto.subtle.digest('SHA-256', enc.encode(text)).then(b64);
  }

  // Hide immediately (no !important style tag to avoid override issues)
  document.documentElement.style.visibility = 'hidden';

  var currHost = (location.hostname||'').toLowerCase();
  var root = getRootDomain(currHost);

  Promise.all([sha256b64(root), sha256b64(currHost)]).then(function(res){
    var rootHash = res[0], hostHash = res[1];
    var rootOK = ALLOW_ROOT_HASHES.indexOf(rootHash) !== -1;
    var fullOK = ALLOW_FULL_HOST_HASHES.indexOf(hostHash) !== -1;
    if (!(rootOK || fullOK)) {
      show403(currHost);
      return;
    }
    document.documentElement.style.visibility = 'visible';
  }).catch(function(){
    show403(currHost);
  });
})();