/**
 * 제이랩 주문시스템 Service Worker v3
 */
const CACHE_NAME = "j-lab-order-v11"
const ASSETS = [
  "./index.html",
  "./manifest.json",
  "./admin.html",
  "./admin-manifest.json",
];

// 설치 — 핵심 파일 캐시
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 활성화 — 이전 버전 캐시 전체 삭제
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — index.html은 항상 네트워크 우선 (최신 코드 보장)
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  const isHtml = url.pathname.endsWith("/") || url.pathname.endsWith(".html") || url.pathname.endsWith("/j_lab_order");

  if (isHtml) {
    // HTML: 네트워크 우선 → 실패 시 캐시 (charset 명시로 인코딩 버그 방지)
    e.respondWith(
      fetch(e.request).then((resp) => {
        if (resp && resp.status === 200) {
          const headers = new Headers(resp.headers);
          headers.set('Content-Type', 'text/html; charset=utf-8');
          const newResp = new Response(resp.body, {status: resp.status, statusText: resp.statusText, headers});
          caches.open(CACHE_NAME).then((c) => c.put(e.request, newResp.clone()));
          return newResp;
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // 기타 정적 파일: 캐시 우선
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((resp) => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          }
          return resp;
        });
      })
    );
  }
});
