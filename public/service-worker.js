self.addEventListener('push', (event) => {
    console.log("heyeyeyyeyye")
    const { title, body, icon } = event.data.json();
    const options = {
        body: body,
        icon: icon,
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
