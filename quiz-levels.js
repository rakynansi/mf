/* =====================================================
   quiz-levels.js  –  LEVELS 2 to 10 of "lets see if you know me"
   (Level 1 is still the original quiz inside script.js)

   Each question looks like:
       ["question text", ["option A", "option B", "option C", "option D"]]

   ⚠️ THE CORRECT ANSWER IS THE FIRST OPTION by default.
      (the options are shuffled on screen, so the order here doesn't matter)
   To choose a different correct answer, add a 3rd item:
       ["question", ["A", "B", "C", "D"], ["C"]]
   You can accept several answers:  ["C", "c", "maybe c"]

   The LAST question of every level is an open question (options = null).
   Its 3rd item is the list of accepted typed answers.
   Everything else (design, comments, score messages) is the same as level 1.
===================================================== */
(function () {
    function level(items) {
        return items.map(function (it) {
            var answers = it[2] || (it[1] ? [it[1][0]] : []);
            return [it[0], it[1], answers];
        });
    }

    window.QUIZ_LEVELS = [
        null, // level 1 = original quiz in script.js

        /* ---------- LEVEL 2 : little preferences ---------- */
        level([
            ["What is my favorite season?", ["Winter", "Summer", "Autumn", ["Spring"] ]],
            ["What is my favorite drink?", ["Coffee", ["Tea", "Orange juice", "Milkshake"]],
            ["What time of the day do I feel most alive?", [["Late night",] "Morning", "Afternoon", "Sunset"]],
            ["What kind of weather do I love?", [["Rainy",] "Snowy", "Sunny", "Cloudy"]],
            ["Cats or dogs?", ["Cats", "Dogs", "Both",] "Neither"]],
            ["What is my favorite dessert?", ["Chocolate cake", ["Ice cream",] "Cheesecake", "Pancakes"]],
            ["Which language do I most want to learn?", [["German",] "Japanese", "French", "Korean"]],
            ["What kind of movies do I like the most?", ["Romance", ["Horror",] "Anime", "Comedy"]],
            ["What do I do when I'm upset?", [["Stay silent", "Cry", ["Play games",] "Sleep"]],
            ["What was the first thing you noticed about me?", null, ["personality"]]
        ]),

        /* ---------- LEVEL 3 : my habits ---------- */
        level([
            ["What do I do first when I wake up?", ["Check my phone", "Drink water", "Go back to sleep", "Take a shower"]],
            ["How do I usually fall asleep?", ["Listening to music", "Scrolling", "Talking to you", "Watching a series"]],
            ["What is my biggest bad habit?", ["Overthinking", "Staying up late", "Procrastinating", "Biting my nails"]],
            ["Which emoji do I use the most?", ["😭", "💗", "🥹", "😑"]],
            ["How do I react to a surprise?", ["I cry", "I laugh", "I freeze", "I get shy"]],
            ["How do I love to spend a free day?", ["Gaming", "Sleeping", "Watching series", "Going out"]],
            ["What annoys me the most in a conversation?", ["Dry replies", "Being ignored", "Interrupting", "Lying"]],
            ["What do I order at a restaurant?", ["Pizza", "Pasta", "Burger", "Salad"]],
            ["What is my comfort activity?", ["Music", "Blanket and a series", "A long shower", "Games"]],
            ["What is the most beautiful thing about me?", null, ["personality", "kindness"]]
        ]),

        /* ---------- LEVEL 4 : our memories ---------- */
        level([
            ["Where did we first meet?", ["Discord", "Instagram", "Plato", "Mobile Legends"]],
            ["What was the first game we played together?", ["Mobile Legends", "Plato", "Minecraft", "Elden Ring"]],
            ["What kind of song did I send you first?", ["A romantic song", "A sad song", "A rap song", "A slow song"]],
            ["What did I call you first?", ["Habibi", "Darvan", "My love", "Habubu"]],
            ["What made me laugh the hardest with you?", ["A joke", "A voice message", "A meme", "A mistake"]],
            ["How did I feel the first time we talked?", ["Shy", "Excited", "Scared", "Calm"]],
            ["What is the word we repeat the most?", ["Love", "Habubu", "Bro", "Lol"]],
            ["Which day of the week do we talk the most?", ["Friday", "Saturday", "Monday", "Wednesday"]],
            ["What did I say the first time I got angry at you?", ["Nothing", "Bye", "Leave me alone", "I'm fine"]],
            ["What is the best memory we have together?", null, ["everything", "talking"]]
        ]),

        /* ---------- LEVEL 5 : dreams and fears ---------- */
        level([
            ["What is my biggest dream?", ["Travel the world", "Live in Germany", "Be rich", "Be famous"]],
            ["What job do I dream about?", ["Designer", "Doctor", "Streamer", "Engineer"]],
            ["Where do I want to live?", ["Germany", "Canada", "Japan", "Morocco"]],
            ["What scares me the most about the future?", ["Losing people", "Failing", "Being alone", "Money"]],
            ["What do I wish I could change about myself?", ["Overthinking", "Shyness", "Anger", "Nothing"]],
            ["What is my perfect date?", ["Stargazing", "A nice dinner", "Gaming together", "Walking in the rain"]],
            ["What would I do with a million dollars?", ["Travel", "Buy a house", "Help my family", "Buy games"]],
            ["What kind of house do I dream of?", ["Small and cozy", "A big villa", "An apartment", "A cabin by a lake"]],
            ["Which superpower would I choose?", ["Teleport", "Read minds", "Fly", "Stop time"]],
            ["What do I need the most from you?", null, ["attention", "support"]]
        ]),

        /* ---------- LEVEL 6 : deep feelings ---------- */
        level([
            ["What hurts me the most?", ["Being ignored", "Being lied to", "Being left", "Being judged"]],
            ["What makes me feel loved?", ["Words", "Time", "Gifts", "Hugs"]],
            ["What do I do when I miss someone?", ["Look at photos", "Send a message", "Stay silent", "Listen to songs"]],
            ["What is the thing I never say out loud?", ["I'm tired", "I miss you", "I'm scared", "I'm hurt"]],
            ["When do I feel the safest?", ["When talking to you", "When I'm alone", "At night", "At home"]],
            ["What is the hardest thing for me to forgive?", ["Lying", "Betrayal", "Disrespect", "Being ignored"]],
            ["How do I show love?", ["Caring quietly", "Words", "Gifts", "Time"]],
            ["What makes me jealous?", ["Attention to others", "Old friends", "Silence", "Nothing"]],
            ["What do I do when I can't sleep?", ["Think about everything", "Play a game", "Text you", "Listen to music"]],
            ["What do you love most about how I love you?", null, ["care"]]
        ]),

        /* ---------- LEVEL 7 : small details ---------- */
        level([
            ["In which month is my birthday?", ["April", "March", "June", "December"]],
            ["What is my zodiac sign?", ["Aries", "Taurus", "Gemini", "Pisces"]],
            ["What is my lucky number?", ["4", "7", "9", "13"]],
            ["Which color do I wear the most?", ["Black", "Pink", "White", "Green"]],
            ["Which phone brand do I use?", ["iPhone", "Samsung", "Xiaomi", "Huawei"]],
            ["What is my favorite hobby besides games?", ["Drawing", "Music", "Reading", "Photography"]],
            ["Which app do I open the most?", ["Discord", "Instagram", "WhatsApp", "Telegram"]],
            ["What do I search for the most?", ["Music", "Recipes", "Games", "Fashion"]],
            ["What is my favorite fruit?", ["Strawberry", "Mango", "Watermelon", "Apple"]],
            ["Describe me in one sentence", null, ["special", "beautiful"]]
        ]),

        /* ---------- LEVEL 8 : what would I do ---------- */
        level([
            ["If I could travel anywhere tonight, where would I go?", ["Germany", "Japan", "Paris", "The Maldives"]],
            ["If I beat you in a game, what would I say?", ["Easy", "Lucky", "GG", "Nothing"]],
            ["If you forgot our anniversary, what would I do?", ["Get quiet", "Get angry", "Joke about it", "Cry"]],
            ["Stuck on an island, what one thing would I take?", ["My phone", "Music", "You", "Food"]],
            ["If I had one free day with you, what would we do?", ["Play games", "Travel", "Stay on a call", "Walk outside"]],
            ["If someone hurt you, what would I do?", ["Get angry", "Stay by your side", "Take revenge", "Cry"]],
            ["If I got a tattoo, what would it be?", ["A heart", "A star", "Your name", "A quote"]],
            ["If I got a pet, what would I name it?", ["Habubu", "Luna", "Mochi", "Darvan"]],
            ["What would I do if I saw you crying?", ["Hug you", "Talk to you", "Stay silent beside you", "Make you laugh"]],
            ["What would you do to make me smile on my worst day?", null, ["hug", "talk"]]
        ]),

        /* ---------- LEVEL 9 : this website & us ---------- */
        level([
            ["How many songs are in our website playlist?", ["17", "12", "15", "20"]],
            ["How many albums are on this website?", ["5", "3", "4", "6"]],
            ["What emoji is the 'ocean' theme in Messages?", ["🌊", "🌙", "🌿", "🌅"]],
            ["What is the main color of this website?", ["Pink", "Blue", "Green", "Purple"]],
            ["What does the footer at the bottom say?", ["Made with 💗 just for you", "Made for my love", "Our little world", "Forever yours"]],
            ["What is my birthday date?", ["April 4", "April 14", "March 4", "May 4"]],
            ["What is his birthday date?", ["November 16", "November 6", "December 16", "October 16"]],
            ["Which section keeps the secret messages that open on a special day?", ["Our Dates", "Our Time", "Our Notes", "Our Secrets"]],
            ["How many levels does this quiz have?", ["10", "5", "8", "12"]],
            ["What do you promise me?", null, ["love", "always"]]
        ]),

        /* ---------- LEVEL 10 : the final level ---------- */
        level([
            ["What is the one word that describes us?", ["Destiny", "Chaos", "Peace", "Home"]],
            ["What is my biggest wish for us?", ["Meeting in real life", "Living together", "Traveling", "Growing old together"]],
            ["Why did I make this website?", ["All of these", "To surprise you", "To keep our memories", "To say I love you"]],
            ["What am I the most grateful for?", ["You", "My family", "My health", "My friends"]],
            ["What is the one thing I never want to lose?", ["You", "Trust", "Memories", "Peace"]],
            ["What is my favorite thing to hear from you?", ["I miss you", "I love you", "I'm here", "You're beautiful"]],
            ["Where do I see us in 5 years?", ["Together", "Traveling", "Married", "Still talking every day"]],
            ["What is my promise to you?", ["Always care", "Never leave", "Never lie", "All of them"]],
            ["What is the first thing I'd do if we met tomorrow?", ["Hug you", "Cry", "Laugh", "Stay speechless"]],
            ["Say one thing you want me to remember forever", null, ["i love you"]]
        ])
    ];
})();
