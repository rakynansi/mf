self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", event => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; }
    catch { data = { title: "💌 Our World", body: event.data ? event.data.text() : "New message" }; }

    event.waitUntil(self.registration.showNotification(data.title || "💌 Our World", {
        body: data.body || "You received a new message",
        icon: data.icon || "images/favicon.png",
        badge: data.badge || "images/favicon.png",
        tag: data.tag || "ow-message",
        renotify: true,
        data: { url: data.url || self.registration.scope }
    }));
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
    event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
        for (const c of list) { if ("focus" in c) return c.focus(); }
        return self.clients.openWindow(url);
    }));
});
