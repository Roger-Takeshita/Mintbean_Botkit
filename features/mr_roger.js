const axios = require('axios');

module.exports = function (controller) {
    controller.hears(
        new RegExp(/^\/help$/),
        ['message', 'direct_message'],
        async function (bot, message) {
            await bot.reply(message, {
                text: `Here are the available commands: </br>
                    - <strong>@user_name</strong> fetch all public GitHub repos from a specific user`,
            });
        }
    );

    controller.hears(
        new RegExp(/^@.+$/),
        ['message', 'direct_message'],
        async function (bot, message) {
            try {
                const links = [];
                const user = message.matches[0].replace('@', '');

                await axios({
                    method: 'GET',
                    url: `https://api.github.com/users/${user}/repos`,
                })
                    .then(async (res) => {
                        res.data.forEach((repo) => {
                            links.push({
                                repoName: repo.name,
                                repoUrl: `https://github.com/${repo.full_name}`,
                            });
                        });

                        let msg = `Found ${links.length} Result(s)</br>`;
                        links.forEach(async (link) => {
                            msg += `<a href=${link.repoUrl} target="_blank">${link.repoName}</a></br>`;
                        });

                        await bot.reply(message, {
                            text: msg,
                        });
                    })
                    .catch(async (error) => {
                        if (error.response.status === 404) {
                            return await bot.reply(message, {
                                text: `User <strong>${message.text}</strong> <u>not found</u>`,
                            });
                        }
                    });
            } catch (error) {
                return await bot.reply(message, {
                    text: `Something went wrong, ${error}`,
                });
            }
        }
    );

    controller.hears(
        new RegExp(/^\/\w+$/),
        ['message', 'direct_message'],
        async function (bot, message) {
            await bot.reply(message, {
                text: "Sorry, command doesn't exist",
            });
        }
    );

    controller.hears(
        ['hi', 'hello', 'howdy', 'hey', 'aloha', 'hola', 'bonjour', 'oi'],
        ['message'],
        async (bot, message) => {
            await bot.reply(message, 'Oh hello there!');
        }
    );

    controller.hears('.*', 'message', async (bot, message) => {
        await bot.reply(message, `Could you be more specific?`);
    });
};
