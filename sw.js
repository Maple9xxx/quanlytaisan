/* Service worker: lưu sẵn toàn bộ ứng dụng để chạy offline.
   Khi sửa index.html, đổi số phiên bản V để máy người dùng tải bản mới. */
const V='qltt-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
  const net=fetch(r).then(res=>{if(res.ok)caches.open(V).then(c=>c.put(r,res.clone()));return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}            /* có sẵn: dùng ngay, âm thầm cập nhật nền */
  return net.then(res=>res||(r.mode==='navigate'?caches.match('./index.html'):Response.error()));
 }));
});
