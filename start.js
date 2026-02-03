const { groupEvents } = require('./path/to/groupEvents'); // apna sahi path

conn.ev.on('group-participants.update', async (update) => {
    await groupEvents(conn, update);
});
