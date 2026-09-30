self.addEventListener("push", event => {
    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch {
        data = {
            title: "New Message",
            body: event.data ? event.data.text() : "You received a new message"
        };
    }

    const title = data.title || "New Message";

    const options = {
        body: data.body || "You received a new message",
        icon: data.icon || "icon.png",
        badge: data.badge || "icon.png",
        data: {
            url: data.url || self.registration.scope
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});


self.addEventListener("notificationclick", event => {
    event.notification.close();

    const url = (event.notification.data && event.notification.data.url) || self.registration.scope;

    event.waitUntil(
        clients.openWindow(url)
    );
});