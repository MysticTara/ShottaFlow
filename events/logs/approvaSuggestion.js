const Discord = require("discord.js");

const { MessageButton } = require('discord-buttons');
const { MessageActionRow } = require('discord-buttons')

module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "approvaSuggestion") return

        var idUtente = button.message.embeds[0].fields[0].value.slice(button.message.embeds[0].fields[0].value.length - 22, -4)
        if (!idUtente) return

        var utente = client.users.cache.get(idUtente)
        if (!utente) return

        var embed = new Discord.MessageEmbed()
            .setTitle("💡Suggestion by " + (utente.username ? utente.username : utente.user.username))
            .setDescription(button.message.embeds[0].fields[2].value)
            .setThumbnail(button.message.embeds[0].thumbnail.url)
            .addField(":first_place: Votes", `
Opinion: **0**
Upvotes: **0** - 0%
Downvotes: **0** - 0%
`)

        var canale = client.channels.cache.find(channel => channel.id == config.idCanaliServer.suggestions);
        canale.send(embed)
            .then(msg => {
                msg.react("😍")
                msg.react("💩")

                var embed = new Discord.MessageEmbed()
                    .setTitle("💡Suggestion ACCETTATO")
                    .setColor("#18B83B")
                    .setDescription(`Un tuo suggerimento è stato **accettato** dallo staff, ora tutti gli utenti potranno votarlo\r[Clicca qui](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) per andare a vederlo`)
                    .addField(":bookmark_tabs: Suggestion", button.message.embeds[0].fields[2].value)

                utente.send(embed)
                    .catch(() => { return })

                button.message.embeds[0].fields[1].value = "```Approved by " + button.clicker.user.username + "```"
                button.message.embeds[0].color = "1620027"
                button.message.embeds[0].fields[2].value = `${button.message.embeds[0].fields[2].value}[Message](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`
                button.message.edit(button.message.embeds[0], null)
            })
    },
};