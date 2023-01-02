const TelegramApi = require("node-telegram-bot-api")
const {gameOption, restartOption} = require("./option")
const token = "5880785051:AAFHBB_tB33AMCzUymewkH9nJPLkwdHFxJU"

const bot = new TelegramApi(token, {polling: true})
const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Сейчас я загадаю число от 0 до 9, а тебе нужно его угадать!")
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, "Отгадывай", gameOption)
}


const startBot = () => {

    bot.setMyCommands([
        {command: "/start", description: "Начальное приветствие"},
        {command: "/info", description: "Информация о пользователе"},
        {command: "/game", description: "Начало игры"}
    ])

    bot.on("message", async msg => {
        const text = msg.text
        const id = msg.chat.id
        if (text === "/start") {
            await bot.sendSticker(id, `https://tlgrm.ru/_/stickers/99f/faf/99ffafc0-faa8-4948-b401-162cf7317e2a/1.webp`)
            return bot.sendMessage(id, "Добро пожаловать в игру угадай число! Выбери команду /game чтоб начать!")
        }
        if (text === "/info") {
            return bot.sendMessage(id, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === "/game") {
            startGame(id)
        }

        return bot.sendMessage(id, "Я тебя не понимаю")
    })

    bot.on("callback_query", async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === "/again") {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Ты выбрал отгадал цифру ${chats[chatId]}`, restartOption)
        } else {
            return bot.sendMessage(chatId, `Ты ошибся, бот загадал цифру ${chats[chatId]}`, restartOption)
        }
    })
}

startBot()