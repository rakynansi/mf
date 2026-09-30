/* =====================================================
   quiz-levels.js  –  LEVELS 2 to 10 of "lets see if you know me"
   (Level 1 is still the original quiz inside script.js)

   Each question:
     [ "question", [options] or null, [correct answers], { extra rules } ]

   Extra rules (4th item, optional):
     any:    true          -> ANY answer is correct
     add:    ["text"]      -> the player must press "add answer" and type this
     addAny: true          -> the player must press "add answer" and type
                              anything (the typed answer is always correct)

   ⚠️ TODO = you did not give me an answer for that question.
===================================================== */
(function () {
    function level(items) {
        return items.map(function (it) {
            return [it[0], it[1], it[2] || [], it[3] || {}];
        });
    }

    window.QUIZ_LEVELS = [
        null, // level 1 = original quiz in script.js

        /* ---------- LEVEL 2 ---------- */
        level([
            ["What is my favorite season?", ["Winter", "Summer", "Autumn", "Spring"], ["Spring", "Winter"]],
            ["What is my favorite drink?", ["Coffee", "Tea", "Orange juice", "Milkshake"], ["Tea"]],
            ["What time of the day do I feel most alive?", ["Late night", "Morning", "Afternoon", "Sunset"], ["Late night"]],
            ["What kind of weather do I love?", ["Rainy", "Snowy", "Sunny", "Cloudy"], ["Rainy", "Cloudy"]],
            ["Cats or dogs?", ["Cats", "Dogs", "Both", "Neither"], ["Both"]],
            ["What is my favorite dessert?", ["Chocolate cake", "Ice cream", "Cheesecake", "Pancakes"], ["Ice cream"]],
            ["Which language do I most want to learn?", ["German", "Japanese", "French", "Korean"], ["German"]],
            ["What kind of movies do I like the most?", ["Romance", "Horror", "Anime", "Comedy"], ["Horror"], { add: ["AI movies", "أفلام الذكاء"] }],
            /* TODO: no answer given */
            ["What do I do when I'm upset?", ["Stay silent", "Cry", "Play games", "Sleep"], ["Stay silent"]],
            ["What was the first thing you noticed about me?", null, [], { any: true }]
        ]),

        /* ---------- LEVEL 3 ---------- */
        level([
            ["What do I do first when I wake up?", ["Check my phone", "Drink water", "Go back to sleep", "Take a shower"], ["Go back to sleep"]],
            ["How do I usually fall asleep?", ["Listening to music", "Scrolling", "Talking to you", "Watching a series"], ["Talking to you"]],
            ["What is my biggest bad habit?", ["Overthinking", "Staying up late", "Procrastinating", "Biting my nails"], ["Overthinking", "Staying up late", "Biting my nails"]],
            ["Which emoji do I use the most?", ["😭", "💗", "🥹", "😑"], [], { any: true }],
            ["How do I react to a surprise?", ["I cry", "I laugh", "I freeze", "I get shy"], ["I cry"]],
            ["How do I love to spend a free day?", ["Gaming", "Sleeping", "Watching series", "Going out"], ["Gaming"]],
            /* TODO: no answer given */
            ["What annoys me the most in a conversation?", ["Dry replies", "Being ignored", "Interrupting", "Lying"], ["Dry replies"]],
            ["What do I order at a restaurant?", ["Pizza", "Pasta", "Burger", "Salad"], ["Pizza"]],
            ["What is my comfort activity?", ["Music", "Blanket and a series", "A long shower", "Games"], ["Music", "Games"]],
            ["What is the most beautiful thing about me?", null, [], { any: true }]
        ]),

        /* ---------- LEVEL 4 ---------- */
        level([
            ["Where did we first meet?", ["Discord", "Instagram", "Plato", "Mobile Legends"], [], { add: ["Messenger"] }],
            ["What was the first game we played together?", ["Mobile Legends", "Plato", "Minecraft", "Elden Ring"], ["Plato"]],
            ["What kind of song did I send you first?", ["A romantic song", "A sad song", "A rap song", "A slow song"], ["A rap song"]],
            ["What did I call you first?", ["Habibi", "Darvan", "My love", "Habubu"], ["Darvan"]],
            ["What made me laugh the hardest with you?", ["A joke", "A voice message", "A meme", "A mistake"], ["A mistake"]],
            ["How did I feel the first time we talked?", ["Shy", "Excited", "Scared", "Calm"], [], { any: true }],
            ["What is the word we repeat the most?", ["Love", "Habubu", "Bro", "Lol"], ["Bro"], { addAny: true }],
            ["Which day of the week do we talk the most?", ["Friday", "Saturday", "Monday", "Wednesday"], [], { any: true }],
            ["What did I say the first time I got angry at you?", ["Nothing", "Bye", "Leave me alone", "I'm fine"], ["I'm fine"]],
            ["What is the best memory we have together?", null, [], { any: true }]
        ]),

        /* ---------- LEVEL 5 ---------- */
        level([
            ["What is my biggest dream?", ["Travel the world", "Live in Germany", "Be rich", "Be famous"], ["Travel the world"], { addAny: true }],
            ["What job do I dream about?", ["Designer", "Doctor", "Streamer", "Engineer"], [], { add: ["Staying at my husband's house", "البقاء في بيت زوجي"] }],
            ["Where do I want to live?", ["Germany", "Canada", "Japan", "Morocco"], [], { add: ["Living with you", "العيش معك"] }],
            ["What scares me the most about the future?", ["Losing people", "Failing", "Being alone", "Money"], [], { any: true }],
            ["What do I wish I could change about myself?", ["Overthinking", "Shyness", "Anger", "Nothing"], ["Anger"]],
            ["What is my perfect date?", ["Stargazing", "A nice dinner", "Gaming together", "Walking in the rain"], ["Gaming together"]],
            ["What would I do with a million dollars?", ["Travel", "Buy a house", "Help my family", "Buy games"], ["Buy games"]],
            ["What kind of house do I dream of?", ["Small and cozy", "A big villa", "An apartment", "A cabin by a lake"], ["An apartment"]],
            ["Which superpower would I choose?", ["Teleport", "Read minds", "Fly", "Stop time"], ["Read minds"]],
            ["What do I need the most from you?", null, [], { any: true }]
        ]),

        /* ---------- LEVEL 6 ---------- */
        level([
            ["What hurts me the most?", ["Being ignored", "Being lied to", "Being left", "Being judged"], ["Being lied to"]],
            ["What makes me feel loved?", ["Words", "Time", "Gifts", "Hugs"], ["Words"], { add: ["Actions", "الأفعال"] }],
            ["What do I do when I miss someone?", ["Look at photos", "Send a message", "Stay silent", "Listen to voice messages"], ["Look at photos", "Listen to voice messages"]],
            ["What is the thing I never say out loud?", ["I'm tired", "I miss you", "I'm scared", "I'm hurt"], ["I'm scared", "I'm tired"]],
            ["When do I feel the safest?", ["When talking to you", "When I'm alone", "At night", "At home"], ["When talking to you", "When I'm alone", "At night", "At home"]],
            /* TODO: no answer given */
            ["What is the hardest thing for me to forgive?", ["Lying", "Betrayal", "Disrespect", "Being ignored"], ["Lying"]],
            ["How do I show love?", ["Caring quietly", "Words", "Actions", "Time"], ["Caring quietly", "Words", "Actions"]],
            ["What makes me jealous?", ["Attention to others", "Old friends", "Silence", "Nothing"], ["Attention to others", "Old friends"]],
            ["What do I do when I can't sleep?", ["Think about everything", "Play a game", "Text you", "Listen to music"], ["Think about everything", "Play a game", "Text you", "Listen to music"]],
            ["What do you love most about how I love you?", null, [], { any: true }]
        ]),

        /* ---------- LEVEL 7 ---------- */
        level([
            ["In which month is my birthday?", ["April", "March", "June", "December"], ["April"]],
            ["What is my zodiac sign?", ["Aries", "Taurus", "Gemini", "I don't believe in this"], ["I don't believe in this"]],
            ["What is my lucky number?", ["4", "7", "9", "13"], ["4", "7"]],
            ["Which color do I wear the most?", ["Black", "Beige", "White", "Green"], ["Beige", "Black"]],
            ["Which phone brand do I use?", ["iPhone", "Samsung", "Xiaomi", "Huawei"], ["Samsung"]],
            ["What is my favorite hobby besides games?", ["Drawing", "Music", "Reading", "Photography"], ["Drawing"]],
            ["Which app do I open the most?", ["Discord", "Instagram", "WhatsApp", "Telegram"], ["Telegram"]],
            ["What do I search for the most?", ["Music", "Recipes", "Games", "Fashion"], ["Music"]],
            /* TODO: no answer given */
            ["What is my favorite fruit?", ["Strawberry", "Mango", "Watermelon", "Apple"], ["Strawberry"]],
            ["Describe me in one sentence", null, [], { any: true }]
        ]),

        /* ---------- LEVEL 8 ---------- */
        level([
            ["If I could travel anywhere tonight, where would I go?", ["To you", "Germany", "Japan", "Paris"], ["To you"]],
            ["If I beat you in a game, what would I say?", ["Easy", "Lucky", "GG", "Okay"], ["Okay"]],
            ["If you forgot our anniversary, what would I do?", ["Get quiet", "Get angry", "Joke about it", "Cry"], ["Get quiet"]],
            ["Stuck on an island, what one thing would I take?", ["My phone", "Music", "You", "Food"], ["You", "Food"]],
            ["If I had one free day with you, what would we do?", ["Play games", "Travel", "Stay on a call", "Walk outside"], ["Stay on a call"]],
            ["If someone hurt you, what would I do?", ["Get angry", "Stay by your side", "Take revenge", "Cry"], ["Get angry", "Stay by your side", "Take revenge", "Cry"]],
            ["If I got a tattoo, what would it be?", ["A heart", "A star", "Your name", "A quote"], ["Your name"]],
            ["If I got a pet, what would I name it?", ["Ivar", "Iva", "Masha", "Luna"], ["Ivar", "Iva", "Masha"]],
            ["What would I do if I saw you crying?", ["I'd call you gay", "Hug you", "Talk to you", "Make you laugh"], ["I'd call you gay"]],
            ["What would you do to make me smile on my worst day?", null, [], { any: true }]
        ]),

        /* ---------- LEVEL 9 ---------- */
        level([
            ["How many songs are in our website playlist?", ["More than 20", "17", "12", "15"], ["More than 20"]],
            ["How many albums are on this website?", ["5", "3", "4", "6"], ["5"]],
            ["Which theme did I like the most?", ["🌿 Green", "🌊 Ocean", "🌙 Night", "🌅 Sunset"], ["🌿 Green"]],
            ["If I were an animal, what would I be?", ["A fly", "A cat", "A dog", "A rabbit"], ["A fly"]],
            ["If you were an animal, what would you be?", ["A cat", "A wolf", "A lion", "A bear"], [], { any: true }],
            ["What is my birthday date?", ["April 4", "April 14", "March 4", "May 4"], ["April 4"]],
            ["How many brothers and sisters do I have?", ["4 girls and 4 boys", "3 girls and 3 boys", "2 girls and 5 boys", "5 girls and 2 boys"], ["4 girls and 4 boys"]],
            ["Do you love me?", ["No, not at all", "No way", "No, never", "Nope"], [], { addAny: true }],
            ["Rate my love for you", ["50%", "90%", "100%", "∞"], ["∞"], { add: ["∞", "infinity", "لا نهاية"] }],
            ["What do you promise me?", null, [], { any: true }]
        ]),

        /* ---------- LEVEL 10 ---------- */
        level([
            ["What is the one word that describes us?", ["Destiny", "Chaos", "Peace", "Home"], [], { any: true }],
            ["What is my biggest wish for us?", ["Meeting in real life", "Living together", "Traveling", "Growing old together"], ["Meeting in real life"]],
            ["Why did I make this website?", ["All of these", "To surprise you", "To keep our memories", "To say I love you"], ["All of these"]],
            ["What am I the most grateful for?", ["You", "My family", "My health", "My friends"], ["You"]],
            /* not answered separately – I used "You" like the previous one */
            ["What is the one thing I never want to lose?", ["You", "Trust", "Memories", "Peace"], ["You"]],
            ["What is my favorite thing to hear from you?", ["I miss you", "I love you", "I'm here", "You're beautiful"], ["I love you"]],
            ["Where do I see us in 5 years?", ["Together", "Traveling", "Married", "Still talking every day"], ["Together"]],
            ["What is my promise to you?", ["Always care", "Never leave", "Never lie", "All of them"], ["All of them"]],
            ["What is the first thing I'd do if we met tomorrow?", ["Hug you", "Cry", "Laugh", "Stay speechless"], ["Hug you"]],
            ["Say one thing you want me to remember forever", null, [], { any: true }]
        ])
    ];
})();
