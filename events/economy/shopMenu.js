module.exports = {
    name: `interactionCreate`,
    async execute(menu) {
        if (!menu.isSelectMenu()) return
        if (!menu.customId.startsWith("shopMenu")) return

        if (isMaintenance(menu.user.id)) return

        if (menu.customId.split(",")[1] != menu.user.id) return menu.deferUpdate()

        menu.deferUpdate()

        var userstats = userstatsList.find(x => x.id == menu.user.id);
        if (!userstats) return

        var select = new Discord.MessageSelectMenu()
            .setCustomId(`shopMenu, ${menu.user.id} `)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "Technology",
                emoji: "๐ฅ๏ธ",
                value: "shopTechnology",
            })
            .addOptions({
                label: "Food",
                emoji: "๐",
                value: "shopFood",
            })
            .addOptions({
                label: "Home",
                emoji: "๐ ",
                value: "shopHome",
            })
            .addOptions({
                label: "Mezzi di trasporto",
                emoji: "๐ป",
                value: "shopMezziTrasporto",
            })
            .addOptions({
                label: "Abbigliamento",
                emoji: "๐",
                value: "shopAbbigliamento",
            })

        var row = new Discord.MessageActionRow()
            .addComponents(select)

        var category;
        var embed = new Discord.MessageEmbed()
            .setDescription(`
Con \`!shop [item]\` puoi avere piรน **informazioni** riguardo un oggetto, quando costa **comprarlo**, **venderlo**, il suo **id** e altro
Utilizza invece i comandi \`!buy [item]\` e \`!sell [item]\` per comprare o vendere piรน velocemente
`)

        switch (menu.values[0]) {
            case "shopTechnology": {
                category = "technology"
                embed
                    .setTitle("๐ฅ๏ธ TECHNOLOGY items ๐ฅ๏ธ")
                    .setColor("#999999")
            } break
            case "shopFood": {
                category = "food"
                embed
                    .setTitle("๐ FOOD items ๐")
                    .setColor("#db8616")
            } break
            case "shopHome": {
                category = "home"
                embed
                    .setTitle("๐  HOME items ๐ ")
                    .setColor("#1dbfaa")
            } break
            case "shopMezziTrasporto": {
                category = "mezziTrasporto"
                embed
                    .setTitle("๐ป TRANSPORT items ๐ป")
                    .setColor("#c43812")
            } break
            case "shopAbbigliamento": {
                category = "abbigliamento"
                embed
                    .setTitle("๐ CLOTHING items ๐")
                    .setColor("#2683c9")
            } break
        }

        var items = require("../../config/items.json").filter(x => x.category == category)

        items.forEach(item => {
            embed
                .addField(`${!item.priviled || (item.priviled && userstats.level >= item.priviled) ? item.icon : item.iconUnlocked} ${item.name}`, !item.priviled || (item.priviled && userstats.level >= item.priviled) ? `
Price: ${item.price}$
ID: \`#${item.id}\`` : `
_Sblocca con \r<@&${settings.ruoliLeveling["level" + item.priviled]}>_`, true)
        });


        menu.message.edit({ embeds: [embed], components: [row] })
    },
};