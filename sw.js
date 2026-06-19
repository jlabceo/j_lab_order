/**
 * 제이랩 주문시스템 Service Worker v5
 * GAS API 캐시 제외 — 항상 최신 주문 내역 반환
 */
const CACHE_NAME = "j-lab-order-v12";
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

self.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET") return;

                        const url = new URL(e.request.url);

                        // GAS API는 절대 캐시 안 함 (주문 내역 최신화)
                        if (
                              url.hostname.includes("script.google.com") ||
                              url.hostname.includes("script.googleusercontent.com")
                            ) {
                              return; // SW bypass → 브라우저가 직접 네트워크 요청
                        }

                        const isHtml =
                              url.pathname.endsWith("/") ||
                              url.pathname.endsWith(".html") ||
                              url.pathname.endsWith("/j_lab_order");

                        if (isHtml) {
                              // HTML: 네트워크 우선 → 실패 시 캐시
      e.respondWith(
              fetch(e.request)
                .then((resp) => {
                            if (resp && resp.status === 200) {
                                          const clone = resp.clone();
                                          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
                            }
                            return resp;
                })
                .catch(() => caches.match(e.request))
            );
                        } else {
                              // 정적 파일: 캐시 우선
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
