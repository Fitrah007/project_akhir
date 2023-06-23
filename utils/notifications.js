const { Notification } = require('../db/models');

module.exports = {
    sendNotif: async (notifs) => {
        try {
            const notificationPromises = notifs.map(async (notif) => {
                await Notification.create({
                    title: notif.title,
                    description: notif.description,
                    user_id: notif.user_id,
                    is_read: false,
                });
            });

            await Promise.all(notificationPromises);

        } catch (err) {
            throw err;
        }
    },
};
