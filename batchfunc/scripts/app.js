const mainFunction = () => {
    const events =getTodaysEvents();
    const eventsTitles = getEventsTitle(events);
    console.log(eventsTitles);
    const formattedTasks = formatTasks(eventsTitles);
    const res = insertTasksOnNotion(formattedTasks);
    console.log(res);
    const tasks = getTodaysTasks();
    const message = createFixMessage(tasks);
    sendToLine(message);
}

const getEventsTitle = (events) => {
    const eventsArray = []
    for(let i = 0; i < events.length; i++){
        eventsArray.push(events[i].getTitle())
    }
    return eventsArray
}

const getTodaysEvents = () => {
    const today = new Date();//"2022-04-01"
    const calendar = CalendarApp.getDefaultCalendar();
    events = calendar.getEventsForDay(today);
    return events;
}

const formatTasks = (events) => {
    tasks = [];
        for(let i=0; i < events.length; i++){
            const task = attachExtraProp(events[i]);
            task ? tasks.push(task): console.log(task);
        }
        return tasks;
}

const attachExtraProp = (event) => {
        if(event.includes("[CUEBiC]")) {
            const type = "CUEBiC"
            const title = event.replace("[CUEBiC]", "");
            return [title, type]
        } else if (event.includes("[英語]")){
            const type = "英語";
            const title = event.replace("[英語]", "")
            return [title, type];
        } else if (event.includes("[あしたへ]")) {
            const type = "あしたへ";
            const title = event.replace("[あしたへ]", "");
            return [title, type];
        } else if (event.includes("[Loovic]")){
            const type = "Loovic";
            const title = event.replace("[Loovic]", "");
            return [title, type];
        } else if (event.includes("[大学]")){
            const type = "大学";
            const title = event.replace("[大学]", "")
            return [title, type];
        } else if (event.includes("[個人開発]")){
            const type = "個人開発";
            const title = event.replace("[個人開発]", "");
            return [title, type];
        } else {
            return false;
        }
}

const sendToLine = (message) => {
    return message;
}

const insertTasksOnNotion = (tasks) => {
    const headers = setHeader();
    const options = {
        headers: headers,
        method: "post",
        payload: ""
    };
    const url = "https://api.notion.com/v1/pages";
    const emoji = chooseRandomEmoji();
    for(let i = 0; i < tasks.length; i++){
        const taskJson = getTaskJson(tasks[i][1], tasks[i][0] , emoji);
        options["payload"] = JSON.stringify(taskJson);
        console.log(options["payload"])
        const response = UrlFetchApp.fetch(url, options);
    }
}

const createFixMessage = (tasks) => {
    return tasks;
}

const getTodaysTasks = () => {
    return ["aa", "bbb", "ccc"];
}

const getTaskJson = (type, title, emoji) => {
    const DATABASE_ID = PropertiesService.getScriptProperties().getProperty("DATABASE_ID");
    const template = {
        "parent": { "database_id": DATABASE_ID },
        "icon": {
            "emoji": "🥬"
        },
        "cover": {
            "external": {
                "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
            }
        },
        "properties": {
            "Status": {
                "select": {
                    "name": "Todo"
                }
            },
            "Type": {
                "select": {
                    "name": "個人開発"
                }
            },
            "優先順位": {
                "select": {
                    "name": "優先度１🔥"
                }
            },
            "緊急度": {
                "select": {
                    "name": "緊急度１💦"
                }
            },
            "Name": {
                "title": [
                    {
                        "text": {
                            "content": "Tuscan Kale"
                        }
                    }
                ]
            }
        }
    };
    template["icon"]["emoji"] = emoji
    template["properties"]["Name"]["title"][0]["text"]["content"] = title;
    template["properties"]["Type"]["select"]["name"] = type;
    return template;
}

const setHeader = () => {
    const NOTION_TOKEN = PropertiesService.getScriptProperties().getProperty("NOTION_TOKEN");
    headers = {
        "Authorization": "Bearer " + NOTION_TOKEN,
        "Notion-Version": "2022-02-22",
        "Content-Type": "application/json"
    }
    return headers
}

const chooseRandomEmoji = () => {
    const emojis = [
        '😄','😃','😀','😊','☺','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠',
        '😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩',
        '👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀',
        '👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁',
        '🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙',
        '💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭','🐶','🐺','🐱','🐭','🐹','🐰','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵',
        '🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐚','🐠','🐟','🐬','🐳','🐋','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐎','🐐',
        '🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐫','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🌾','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼',
        '🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','🌠','⭐','☀','⛅','☁','⚡','☔','❄','⛄','🌀','🌁','🌈','🌊','🎍','💝',
        '🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🎋','🎉','🎊','🎈','🎌','🔮','🎥','📷','📹','📼','💿','📀','💽','💾','💻','📱','☎','📞','📟','📠','📡',
        '📺','📻','🔊','🔉','🔈','🔇','🔔','🔕','📢','📣','⏳','⌛','⏰','⌚','🔓','🔒','🔏','🔐','🔑','🔎','💡','🔦','🔆','🔅','🔌','🔋','🔍','🛁','🛀','🚿','🚽','🔧','🔩','🔨',
        '🚪','🚬','💣','🔫','🔪','💊','💉','💰','💴','💵','💷','💶','💳','💸','📲','📧','📥','📤','✉','📩','📨','📯','📫','📪','📬','📭','📮','📦','📝','📄','📃','📑','📊','📈',
        '📉','📜','📋','📅','📆','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','📛','🔬','🔭','📰','🎨','🎬','🎤','🎧','🎼',
        '🎵','🎶','🎹','🎻','🎺','🎷','🎸','👾','🎮','🃏','🎴','🀄','🎲','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇','🏆','🎿','🏂','🏊','🏄','🎣','☕',
        '🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧',
        '🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽','🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨',
        '💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌃','🗽','🌉','🎠','🎡','⛲','🎢','🚢','⛵','🚤','🚣','⚓','🚀','✈','💺','🚁','🚂','🚊','🚉',
        '🚞','🚆','🚄','🚅','🚈','🚇','🚝','🚋','🚃','🚎','🚌','🚍','🚙','🚘','🚗','🚕','🚖','🚛','🚚','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚟','🚠','🚜','💈','🚏','🎫','🚦',
        '🚥','⚠','🚧','🔰','⛽','🏮','🎰','♨','🗿','🎪','🎭','📍','🚩','⬆','⬇','⬅','➡','🔠','🔡','🔤','↗','↖','↘','↙','↔','↕','🔄','◀','▶','🔼','🔽','↩','↪','ℹ','⏪','⏩','⏫',
        '⏬','⤵','⤴','🆗','🔀','🔁','🔂','🆕','🆙','🆒','🆓','🆖','📶','🎦','🈁','🈯','🈳','🈵','🈴','🈲','🉐','🈹','🈺','🈶','🈚','🚻','🚹','🚺','🚼','🚾','🚰','🚮','🅿','♿',
        '🚭','🈷','🈸','🈂','Ⓜ','🛂','🛄','🛅','🛃','🉑','㊙','㊗','🆑','🆘','🆔','🚫','🔞','📵','🚯','🚱','🚳','🚷','🚸','⛔','✳','❇','❎','✅','✴','💟','🆚','📳','📴','🅰','🅱',
        '🆎','🅾','💠','➿','♻','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','🔯','🏧','💹','💲','💱','©','®','™','〽','〰','🔝','🔚','🔙','🔛','🔜','❌','⭕','❗','❓',
        '❕','❔','🔃','🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕖','🕗','🕘','🕙','🕚','🕡','🕢','🕣','🕤','🕥','🕦','✖','➕','➖','➗','♠','♥','♣','♦','💮','💯',
        '✔','☑','🔘','🔗','➰','🔱','🔲','🔳','◼','◻','◾','◽','▪','▫','🔺','⬜','⬛','⚫','⚪','🔴','🔵','🔻','🔶','🔷','🔸','🔹'
    ];
    return emojis[Math.floor(Math.random() * emojis.length)]
}