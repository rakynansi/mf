/* =====================================================
   OUR WORLD  –  script.js  (v2)
   Everything lives inside one closure so nothing clashes.
===================================================== */
/* Safe access to the Supabase client (it is created in another file).
   Returns null instead of throwing "supabaseClient is not defined". */
function owSupabase() {
    try {
        if (typeof supabaseClient !== "undefined" && supabaseClient) return supabaseClient;
        return window.supabaseClient || null;
    } catch (e) { return null; }
}

(function () {
    "use strict";

    /* =================================================
       1. EDIT HERE  –  passwords, albums, media lists
    ================================================= */

    const MAIN_PASSWORD = "9981";            // "Ask Me For Permission"

    // =====================================================
    //  YOUR SONGS  –  write the name you want for each song here
    //  1) put the mp3 files in the "music" folder (music1.mp3, music2.mp3 ...)
    //  2) change only the text inside  name: "..."  to the real song name
    //  To add a song: copy one line and change the file name.
    // =====================================================
   const MUSIC_TRACKS = [
        { name: "• L’Art Du Savoir • (Slowed)", file: "./music/music1.mp3" },
        { name: "505", file: "music/music2.mp3" },
        { name: "Ecstacy", file: "music/music3.mp3" },
        { name: "Headlock", file: "music/music4.mp3" },
        { name: "Wael Kfoury - Layel W Raad _ وائل كفوري - ليل و رعد", file: "music/music5.mp3" },
        { name: "I love you so", file: "music/music6.mp3" },
        { name: "I'll Keep You Safe", file: "music/music7.mp3" },
        { name: "Meen Ysadak", file: "music/music8.mp3" },
        { name: "Not Allowed", file: "music/music9.mp3" },
        { name: "Ragebait", file: "music/music10.mp3" },
        { name: "schnuffel - bunny party (slowed + reverb)", file: "music/music11.mp3" },
        { name: "Self Aware", file: "music/music12.mp3" },
        { name: "Me and you", file: "music/music13.mp3" },
        { name: "The Perfect Girl", file: "music/music14.mp3" },
        { name: "Those Eyes", file: "music/music15.mp3" }
       
    ];

  function imgs(prefix, count) {
    const list = [];

    for (let i = 1; i <= count; i++) {
        list.push(prefix + i + ".jpeg");
    }

    return list;
}

    const ALBUMS = {
        nails:   { design: "elegant",    cover: "images/nails3.jpeg",   photos: imgs("nails", 6) },
        normal:  { design: "polaroid",   cover: "images/normal3.jpeg",  photos: imgs("photo", 3).concat(imgs("normal", 7)) },
        legs:    { design: "masonry",    cover: "images/legs3.jpeg",    photos: imgs("legs", 5) },
        private: { design: "featured",   cover: "images/private3.jpeg", photos: imgs("private", 7), password: "5002" },
        secret:  { design: "fullscreen", cover: "images/secret4.png",  photos: imgs("secret", 15),  password: "4002" }
    };

    // Used by extras.js -> checkFiles() to find photos / songs missing on the live site
    window.OW_FILES = {
        music: MUSIC_TRACKS.map(function (x) { return x.file; }),
        images: Object.keys(ALBUMS).reduce(function (a, k) { return a.concat([ALBUMS[k].cover], ALBUMS[k].photos); }, [])
    };

    // Songs / games / apps shown in "Our Time". Change the names and links as you like.
    const mediaData = {
        songs: [
            { name: "Spotify",       icon: "🎧", link: "https://open.spotify.com/playlist/7IdkIL5QLnNoPXlE6tsxoC" },
            { name: "YouTube Music", icon: "▶", link: "https://music.youtube.com/playlist?list=PLXD-fliB9_xw" }
        ],
        games: [
            { name: "Mobile Legends", icon: "⚔️", link: "https://play.google.com/store/apps/details?id=com.mobile.legends" },
            { name: "God of war", icon: "🪓⚔️", link: "https://www.playstation.com/fr-fr/games/god-of-war/" },
            { name: "Elden Ring", icon: "🗡️💍", link: "https://store.steampowered.com/app/1245620/ELDEN_RING/" },
            { name: "Plato", icon: "🎲🎮", link: "https://platoapp.com/" }
        ],
        apps: [
            { name: "Discord",   icon: "💬", link: "https://discord.com/app" },
            { name: "WhatsApp",  icon: "📞", link: "https://web.whatsapp.com/" },
            { name: "Instagram", icon: "📸", link: "https://www.instagram.com/" },
            { name: "Messenger", icon: "💙", link: "https://www.messenger.com/" },
            { name: "Telegram",  icon: "✈️", link: "https://web.telegram.org/" },
            { name: "Rave",      icon: "🍿", link: "https://rave.io/" },
            { name: "Netflix",   icon: "🎬", link: "https://www.netflix.com/" }
        ]
    };

    // Optional: address of your push server (leave empty to disable push subscriptions).
    const PUSH_SERVER_URL = "";
    const VAPID_PUBLIC_KEY = "BLk5H7DupupxgqeiJVf4kwmwEZGjU48B3G2Et_lAtS8RIiiESDnXotwGOzc432vVNNTROgqf_jfbpDXzsEpw-k0";

    const siteNotifications = [
        "I hope you're having a beautiful day 🌸",
        "Someone is thinking about you 💭💗",
        "Don't forget to smile 😊",
        "You are really special to me 💕",
        "I hope you like this little website 🩷",
        "Take a little moment for yourself 🌷",
        "You are my favorite person 💗"
    ];

    const quizLevel1 = [
        { question: "What is my favorite color?", answers: ["green", "the color green", "light green", "dark green", "أخضر", "الأخضر", "اخضر", "الاخضر"] },
        { question: "What is my favorite game?", answers: ["mobile legends", "mlbb", "mobile legends mlbb", "mobile legend", "ml", "mobile legends bang bang", "موبايل ليجندز"] },
        { question: "What is something I really like about people?", answers: ["intelligence", "people who don't judge", "ppl who dont judge", "honesty", "people who don't judge and honesty", "intelligence honesty", "intelligence and honesty"] },
        { question: "What is my favorite food?", answers: ["pizza", "rafissa", "rfissa", "rfisa", "rafisa", "rfissa", "pizza and rfissa", "بيتزا", "رفيسة"] },
        { question: "What is something that makes me happy?", answers: ["darvan", "you", "talking to darvan", "darvan and you", "talking to you", "you darvan", "دارفان", "انت", "أنت", "الكلام مع دارفان"] },
        { question: "What is something I dislike?", answers: ["lying", "liars", "liar", "lies", "lie", "people who lie", "being lied to", "الكذب", "الكذابين"] },
        { question: "What is my dream place to visit?", answers: ["germany", "deutschland", "german", "ألمانيا", "المانيا"] },
        { question: "What is my favorite thing to do?", answers: ["playing games", "talking to darvan", "playing games and talking to darvan", "games", "gaming", "play games", "talking to you", "لعب الالعاب", "اللعب", "الالعاب"] },
        { question: "What is something I am afraid of?", answers: ["dark water", "deep dark water", "losing darvan", "dark water and losing darvan", "deep water", "the dark water", "losing you", "المياه المظلمة", "الماء المظلم", "فقدان دارفان"] },
        { question: "What is something special about me?", answers: ["my personality", "personality", "your personality", "the way i am", "شخصيتي", "شخصيتك"] }
    ];
    let quizQuestions = quizLevel1;          // the questions of the level being played


    /* =================================================
       2. TRANSLATIONS   ["English", "العربية"]
    ================================================= */

    const I = {
        "back": ["Back", "رجوع"],
        "login.name": ["Your name 💌", "اسمك 💌"],
        "login.name.ph": ["💗 your name here my love", "💗 اكتب اسمك هنا يا حبي"],
        "login.email": ["Your email 💌", "بريدك الإلكتروني 💌"],
        "login.email.ph": ["💗 my love put your email 💌", "💗 يا حبي اكتب بريدك💌"],
        "login.pass": ["Our password 💕", "كلمة سرنا 💕"],
        "login.pass.ph": ["🔐 our password habubu 💕"," 🔐 كلمة سرنا يا حبوبو 💕"],
        "login.enter": ["Enter ♡", "دخول ♡"],
        "err.name": ["Please enter your name 💕", "من فضلك اكتب اسمك 💕"],
        "err.email": ["My love 💗 please put your email 💌","يا حبي 💗 من فضلك اكتب ايميلك  💌"],
        "err.pass": ["Please enter our password, habubu 🩷", "اكتب كلمة سرنا يا حبوبو 🩷"],
        "err.wrong": ["Wrong email or password you really forget our password ? 💔", "البريد أو كلمة السر غير صحيحة أنت حقا نسيت كلمة سرنا؟💔"],
        "err.offline": ["broo you are poor 🤣😭", "يا أخي أنت فقير 🤣😭 "],

        "s.title": ["Settings", "الإعدادات"],
        "s.name": ["Display name", "الاسم المعروض"],
        "s.name.ph": ["Enter your name", "اكتب اسمك"],
        "s.logout": ["Log out", "تسجيل الخروج"],
        "s.connection": ["Connection", "الارتباط"],
        "s.connection.hint": ["Connect with your special person ♡", "اربط حسابك بشخصك المميز ♡"],
        "s.friend.incoming": ["💌 You have a friend request", "💌 لديك طلب صداقة"],
        "s.friend.accept": ["💗 Accept", "💗 قبول"],
        "s.friend.decline": ["Decline", "رفض"],
        "s.friend.connected": ["💞 You are connected", "💞 أنتما مرتبطان"],
        "s.friend.message": ["💌 Message me", "💌 راسلني"],
        "s.language": ["Language", "اللغة"],
        "s.theme": ["Theme", "المظهر"],
        "th.pink": ["Pink", "وردي"], "th.sweet": ["Sweet", "حلو"], "th.rose": ["Rose", "ورد"],
        "th.strawberry": ["Strawberry", "فراولة"], "th.purple": ["Purple", "بنفسجي"], "th.dreamy": ["Dreamy", "حالم"],
        "th.lavender": ["Lavender", "خزامى"], "th.blue": ["Blue", "أزرق"], "th.dark": ["Dark", "داكن"], "th.night": ["Night", "ليل"],
        "s.notifications": ["Notifications", "الإشعارات"],
        "s.notifications.toggle": ["Website notifications", "إشعارات الموقع"],
        "s.notifications.test": ["🔔 Send a test notification", "🔔 إرسال إشعار تجريبي"],
        "s.music": ["Music", "الموسيقى"],
        "s.music.toggle": ["Background music", "موسيقى الخلفية"],
        "s.volume": ["Volume", "الصوت"],
        "s.music.track": ["Song", "الأغنية"],
        "s.music.add": ["🎵 Add music from my device", "🎵 إضافة موسيقى من جهازي"],
        "s.music.remove": ["Remove my music", "حذف موسيقاي"],
        "s.music.custom": ["My music", "موسيقاي"],
        "music.notAudio": ["Please choose an audio file.", "اختر ملفاً صوتياً من فضلك."],
        "music.sessionOnly": ["Playing now, but it could not be saved for next time.", "تعمل الآن، لكن تعذر حفظها للمرة القادمة."],
        "s.relationship": ["Our relationship", "علاقتنا"],
        "s.startDate": ["Relationship start date", "تاريخ بداية العلاقة"],
        "s.firstMeeting": ["First meeting / first message", "أول لقاء / أول رسالة"],
        "s.daysTogether": ["Days together", "أيام معًا"],
        "s.daysSinceMeeting": ["Days since we met", "أيام منذ التعارف"],
        "s.appearance": ["Appearance", "المظهر العام"],
        "s.bgColor": ["Background color", "لون الخلفية"],
        "s.textColor": ["Text color", "لون النص"],
        "s.glow": ["Glow", "التوهج"],
        "s.bgImage": ["Background image", "صورة الخلفية"],
        "s.bgImage.remove": ["Remove background image", "إزالة صورة الخلفية"],
        "s.font": ["Font", "الخط"],
        "s.buttons": ["Button style", "شكل الأزرار"],
        "s.buttons.rounded": ["Rounded", "دائري"], "s.buttons.soft": ["Soft", "ناعم"], "s.buttons.square": ["Square", "مربع"],
        "s.fontSize": ["Font size", "حجم الخط"],
        "s.size.small": ["Small", "صغير"], "s.size.medium": ["Medium", "متوسط"], "s.size.large": ["Large", "كبير"],
        "s.appearance.reset": ["Reset colors & background", "إعادة الألوان والخلفية"],
        "s.privacy": ["Privacy", "الخصوصية"],
        "s.privacy.lock": ["Auto-lock private sections", "قفل الأقسام الخاصة تلقائيًا"],
        "s.privacy.hint": ["When you leave the page, the private albums close and ask for the password again.", "عند مغادرة الصفحة تُغلق الألبومات الخاصة وتطلب كلمة السر من جديد."],
        "s.data": ["Data", "البيانات"],
        "s.data.clear": ["Clear saved settings", "مسح الإعدادات المحفوظة"],
        "s.data.reset": ["Reset all website data", "إعادة ضبط كل بيانات الموقع"],
        "s.about": ["About", "حول الموقع"],
        "s.about.created": ["Website created", "تاريخ إنشاء الموقع"],
        "s.about.version": ["Version", "الإصدار"],
        "s.saved": ["Saved ✓", "تم الحفظ ✓"],
        "s.badImage": ["Could not read this image.", "تعذر قراءة هذه الصورة."],
        "msg.confirmDelete": ["Delete this message?", "حذف هذه الرسالة؟"],
        "msg.del.q": ["Are you worried about my storage 😭😑", "هل أنت قلقان على مساحة التخزين عندي 😭😑"],
        "msg.del.yes": ["yeah", "أيوه"],
        "msg.del.no": ["No I want your laptop get f", "لا، أريد أن يخرب لابتوبك"],
        "msg.react.fail": ["Reactions need the one-time Supabase setup 💗", "التفاعلات تحتاج إعداد Supabase لمرة واحدة 💗"],
        "alb.dl.all": ["⬇️ Download album", "⬇️ تنزيل الألبوم"],
        "alb.dl.one": ["⬇️ Download photo", "⬇️ تنزيل الصورة"],
        "alb.dl.busy": ["Preparing your photos… 💗", "جارٍ تحضير الصور… 💗"],
        "alb.dl.done": ["Downloaded ✅", "تم التنزيل ✅"],
        "quiz.level": ["Level", "المستوى"],
        "quiz.next.level": ["Next level 🚀", "المستوى التالي 🚀"],
        "quiz.level.done": ["Level {l} complete! 🎉", "انتهى المستوى {l}! 🎉"],
        "quiz.all.done": ["You finished all 10 levels 💗 you really know me", "أنهيت المستويات العشرة 💗 أنت فعلًا تعرفني"],
        "s.storageFull": ["Not enough storage to save this. Try a smaller image.", "لا توجد مساحة كافية للحفظ. جرّب صورة أصغر."],
        "s.confirm.clear": ["Clear your saved settings?", "هل تريد مسح إعداداتك المحفوظة؟"],
        "s.confirm.reset": ["Reset the entire website? Notes and settings will be deleted.", "إعادة ضبط الموقع بالكامل؟ سيتم حذف الملاحظات والإعدادات."],

        "welcome": ["Welcome", "أهلًا"],
        "days.together": ["days together", "يوم معًا"],
        "home.sub": ["Our little world", "عالمنا الصغير"],
        "home.time": ["Our Time", "وقتنا"],
        "home.time.sub": ["Songs, games and apps we share", "أغانينا وألعابنا وتطبيقاتنا"],
        "home.notes": ["Our Notes", "ملاحظاتنا"],
        "home.notes.sub": ["Memories worth keeping", "ذكريات تستحق الحفظ"],
        "home.messages": ["Message Me", "راسلني"],
        "home.messages.sub": ["Leave me a little message", "اترك لي رسالة صغيرة"],
        "home.quiz": ["Who Knows Me Better?", "من يعرفني أكثر؟"],
        "home.quiz.sub": ["Let's see how well you know me", "لنرَ كم تعرفني جيدًا"],
        "home.private": ["Ask Me For Permission", "اطلب مني الإذن"],
        "home.private.sub": ["Some things are just for us", "بعض الأشياء لنا فقط"],

        "time.title": ["Our Time ♡", "وقتنا ♡"],
        "time.sub": ["Pick something to enjoy together", "اختر شيئًا نستمتع به معًا"],
        "time.songs": ["Our Songs", "أغانينا"], "time.games": ["Our Games", "ألعابنا"], "time.apps": ["Our Apps", "تطبيقاتنا"],
        "media.songs": ["Our Songs 🎵", "أغانينا 🎵"], "media.songs.sub": ["Songs that remind us of each other", "أغانٍ تذكّرنا ببعضنا"],
        "media.games": ["Our Games 🎮", "ألعابنا 🎮"], "media.games.sub": ["Games we play together", "ألعاب نلعبها معًا"],
        "media.apps": ["Our Apps 📱", "تطبيقاتنا 📱"], "media.apps.sub": ["Apps we use together", "تطبيقات نستخدمها معًا"],
        "media.empty": ["Nothing here yet 💕", "لا يوجد شيء هنا بعد 💕"],

        "notes.title": ["Our Notes 💌", "ملاحظاتنا 💌"],
        "notes.sub": ["Write your little memories, thoughts and moments together ♡", "اكتب ذكرياتك وأفكارك ولحظاتنا معًا ♡"],
        "notes.new": ["＋ New note", "＋ ملاحظة جديدة"],
        "notes.newTitle": ["New Note 💗", "ملاحظة جديدة 💗"],
        "notes.editTitle": ["Edit Note ✏️", "تعديل الملاحظة ✏️"],
        "notes.f.title": ["Title", "العنوان"],
        "notes.f.title.ph": ["Give this memory a name...", "أعطِ هذه الذكرى اسمًا..."],
        "notes.f.date": ["Date", "التاريخ"],
        "notes.f.text": ["Your note", "ملاحظتك"],
        "notes.f.text.ph": ["Write something you want to remember...", "اكتب شيئًا تريد تذكّره..."],
        "notes.f.photos": ["Photos 📷", "الصور 📷"],
        "notes.f.add": ["📷 Add photos", "📷 إضافة صور"],
        "notes.save": ["💗 Save note", "💗 حفظ الملاحظة"],
        "notes.cancel": ["Cancel", "إلغاء"],
        "notes.empty": ["No notes yet", "لا توجد ملاحظات بعد"],
        "notes.empty.sub": ["Create your first little memory 💕", "اكتب أول ذكرى صغيرة 💕"],
        "notes.edit": ["✏️ Edit", "✏️ تعديل"],
        "notes.delete": ["🗑️ Delete", "🗑️ حذف"],
        "notes.confirmDelete": ["Delete this note?", "حذف هذه الملاحظة؟"],
        "notes.needContent": ["Write something or add a photo first 🥺", "اكتب شيئًا أو أضف صورة أولًا 🥺"],
        "notes.maxImages": ["You can add up to 6 photos.", "يمكنك إضافة 6 صور كحد أقصى."],
        "notes.defaultTitle": ["A Little Memory 💕", "ذكرى صغيرة 💕"],
        "notes.style.classic": ["Classic", "كلاسيكي"], "notes.style.rounded": ["Rounded", "دائري الحواف"],
        "notes.style.circle": ["Circle", "دائرة"], "notes.style.polaroid": ["Polaroid", "بولارويد"],

        "msg.title": ["Message Me 💌", "راسلني 💌"],
        "msg.sub": ["Leave a little message for me", "اترك لي رسالة صغيرة"],
        "msg.ph": ["Write your message...", "اكتب رسالتك..."],
        "msg.send": ["Send 💕", "إرسال 💕"],
        "msg.empty": ["📝 No messages yet... be the first one 💕", "📝 لا توجد رسائل بعد... كن أول من يكتب 💕"],
        "msg.login": ["📝 Please log in to see your messages 💕", "📝 سجّل الدخول لرؤية الرسائل 💕"],
        "msg.error": ["⚠️ Could not load messages.", "⚠️ تعذر تحميل الرسائل."],
        "msg.fail": ["Could not send the message.", "تعذر إرسال الرسالة."],
        "msg.noUser": ["Could not find the other user.", "لم يتم العثور على الشخص الآخر."],

        "quiz.title": ["lets see if you know me 😑? 💕", "😑لنرى هل تعرفني ؟ 💕"],
        "quiz.q": ["Question", "السؤال"],
        "quiz.ph": ["Your answer...", "إجابتك..."],
        "quiz.ph2": ["Another answer", "إجابة أخرى"],
        "quiz.other": ["＋ Other answer", "＋ إجابة أخرى"],
        "quiz.more": ["+ Add another answer", "+ إضافة إجابة أخرى"],
        "quiz.next": ["Next question 💗", "السؤال التالي 💗"],
        "quiz.done": ["Quiz finished! 💕", "انتهى الاختبار! 💕"],
        "quiz.again": ["Retry this level 🔁", "أعد هذا المستوى 🔁"],
        "quiz.need": ["Please answer the question first 💗", "من فضلك أجب عن السؤال أولًا 💗"],
        "quiz.result": ["You got {n} / {total} correct 💕 ({p}%)", "أجبت {n} / {total} إجابة صحيحة 💕 ({p}%)"],
        "quiz.m0": ["really? 😭", "بجد؟ 😭"],
        "quiz.m1": ["we need to talk abt that 😭", "لازم نتكلم في هذا الموضوع 😭"],
        "quiz.m2": ["yeah its okay ill accept it 😭💕", "حسنًا مقبول، سأتقبّله 😭💕"],
        "quiz.m3": ["owwww noiiiice 🥹💕", "أووووه حلو 🥹💕"],
        "quiz.m4": ["youuu areee myyy loooveee 💕🥹", "أنتتت حبييييي 💕🥹"],
        "quiz.m5": ["I love you so much 🥹💕💗", "أحبك كثيرًا 🥹💕💗"],
        "quiz.r.bad": ["fuck you 😭", "أكرهك 😭"],
        "quiz.r.good": ["owwww thank you thank you 🥹💕", "أووووه شكرًا شكرًا 🥹💕"],
        "quiz.r.meh": ["i love you 💗💕", "أنا أحبك💗💕"],

        "priv.title": ["My Albums 📸", "ألبوماتي 📸"],
        "priv.sub": ["Choose an album to open", "اختر ألبومًا لفتحه"],
        "alb.nails": ["Nails 💅", "الأظافر 💅"], "alb.nails.d": ["Nail photos", "صور الأظافر"],
        "alb.normal": ["Normal 📷", "عادي 📷"], "alb.normal.d": ["Normal photos", "صور عادية"],
        "alb.legs": ["Legs 🖤", "الأرجل 🖤"], "alb.legs.d": ["Private photos", "صور خاصة"],
        "alb.private": ["Private 🔐", "خاص 🔐"], "alb.private.d": ["Locked album", "ألبوم مقفل"],
        "alb.secret": ["Secret 💗", "سري 💗"], "alb.secret.d": ["Secret album", "ألبوم سري"],
        "alb.nails.t": ["💅 Nails 💕", "💅 الأظافر 💕"], "alb.normal.t": ["💕 My pics 💕", "💕 صوري 💕"],
        "alb.legs.t": ["Why you want to see my legs?😐🤨", "لماذا تريد ان ترى رجلي ؟😐🤨"], "alb.private.t": ["🔒 Private 💕", "🔒 خاص 💕"],
        "alb.secret.t": ["🤫 Secret 💕", "🤫 سري 💕"],

        "pw.ph": ["I dont want you to get horny😭 ", "لا اريدك ان تشعر بالنشوة 😭"],
        "pw.unlock": ["Unlock 💕", "فتح 💕"],
        "pw.main.title": ["Ask me for permission", "اطلب مني الإذن"],
        "pw.main.hint": ["bro go sleep why you watching me 😐.", "أخي اذهب الى النوم لماذا تشاهدني 😐."],
        "pw.album.title": ["Locked album", "ألبوم مقفل"],
        "pw.album.hint": ["Enter the password for “{name}”.", "أدخل كلمة سر ألبوم «{name}»."],
        "pw.wrong": ["💕 Wrong password my love 💕", "💕 كلمة السر خاطئة يا حبي 💕"],

        "fr.your": ["Your Person", "شخصك المميز"],
        "fr.none": ["Not connected yet", "غير مرتبط بعد"],
        "fr.outgoing": ["Friend request sent 💌", "تم إرسال الطلب 💌"],
        "fr.incoming": ["You have a friend request 💌", "لديك طلب صداقة 💌"],
        "fr.accepted": ["Connected 🩷", "مرتبطان 🩷"],
        "fr.add": ["♡ Add your lover", "♡ أضف حبيبك"],
        "fr.sent": ["Request sent 💌", "تم إرسال الطلب 💌"],
        "fr.notFound": ["Could not find the other person.", "لم يتم العثور على الشخص الآخر."],
        "fr.already": ["You are already connected 💕", "أنتما مرتبطان بالفعل 💕"],
        "fr.exists": ["A friend request already exists 💌", "يوجد طلب صداقة بالفعل 💌"],
        "fr.fail": ["Something went wrong. Please try again.", "حدث خطأ ما. حاول مرة أخرى."],
        "login.first": ["Please log in first 💗", "سجّل الدخول أولًا 💗"],

        "n.unsupported": ["Your browser does not support notifications. 🔔", "متصفحك لا يدعم الإشعارات. 🔔"],
        "n.blocked": ["Notifications are blocked. Allow them from your browser settings. 🔕", "الإشعارات محظورة. اسمح بها من إعدادات المتصفح. 🔕"],
        "n.denied": ["Notification permission was not granted. 🔕", "لم يتم منح إذن الإشعارات. 🔕"],
        "n.test": ["Heyyy, I misss youuu my loovee 🥺💗", "هااااي، اشتقتلك يا حبييي 🥺💗"],
        "n.welcome": ["Welcome back 💕", "أهلًا بعودتك 💕"],
        "n.fail": ["Could not show the notification.", "تعذر عرض الإشعار."],
        "music.missing": ["The music file could not be played.", "تعذر تشغيل ملف الموسيقى."],
        "music.saved": ["Saved with your songs 💗", "تم حفظها مع أغانيك 💗"],
        "s.music.mode": ["When a song ends", "عند انتهاء الأغنية"],
        "s.music.order": ["▶️ In order", "▶️ بالترتيب"],
        "s.music.repeat": ["🔁 Repeat", "🔁 إعادة"],
        "s.music.shuffle": ["🔀 Shuffle", "🔀 عشوائي"],
        "s.music.next": ["Play next (one time)", "شغّل بعدها (مرة واحدة)"],
        "s.music.nextNone": ["— just continue —", "— أكمل عادي —"],
        "s.music.mine": ["My added songs", "أغانيّ المضافة"],
        "s.music.removeOne": ["Remove this song", "حذف هذه الأغنية"],
        "home.dates": ["Our Dates", "تواريخنا"],
        "home.dates.sub": ["Special days & secret messages", "أيام مميزة ورسائل سرية"]
    };

    let langIdx = 0;
    const t = function (key) { return I[key] ? I[key][langIdx] : key; };
    const locale = function () { return langIdx === 1 ? "ar-u-nu-latn" : undefined; };


    /* =================================================
       3. HELPERS
    ================================================= */

    const $ = function (id) { return document.getElementById(id); };
    const show = function (el) { if (el) el.classList.remove("hidden"); };
    const hide = function (el) { if (el) el.classList.add("hidden"); };
    const clamp = function (n, min, max) { return Math.min(max, Math.max(min, n)); };
    const onReady = function (fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); };

    const store = {
        get: function (key, fallback) {
            try { const v = localStorage.getItem(key); return v === null ? fallback : v; }
            catch (e) { return fallback; }
        },
        set: function (key, value) {
            try { localStorage.setItem(key, value); return true; }
            catch (e) { console.warn("Storage error:", e); return false; }
        },
        del: function (key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
    };

    const KEY = { settings: "ourWorldSettings", bg: "ourWorldBackgroundImage", pic: "profilePicture", notes: "ourWorldNotes", quiz: "ourWorldQuizAnswers" };

    let toastTimer = null;
    function toast(message) {
        const el = $("toast");
        if (!el) return;
        el.textContent = message;
        el.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2400);
    }

    let savedTimer = null;
    function flashSaved() {
        const badge = $("savedBadge");
        if (!badge) return;
        badge.textContent = t("s.saved");
        badge.classList.add("show");
        clearTimeout(savedTimer);
        savedTimer = setTimeout(function () { badge.classList.remove("show"); }, 1400);
    }

    const PLACEHOLDER_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#f8dce5"/>' +
        '<text x="200" y="230" font-size="120" text-anchor="middle" fill="#e889a7">♡</text></svg>');

    // Broken image? show a soft placeholder instead of the browser icon.
    document.addEventListener("error", function (e) {
        const img = e.target;
        if (img && img.tagName === "IMG" && !img.dataset.fallback && img.id !== "imageViewerImage") {
            img.dataset.fallback = "1";
            img.src = PLACEHOLDER_IMG;
        }
    }, true);

    function addSwipe(el, onLeft, onRight) {
        if (!el) return;
        let startX = null;
        el.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
        el.addEventListener("touchend", function (e) {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            startX = null;
            if (Math.abs(dx) > 50) (dx < 0 ? onLeft : onRight)();
        });
    }


    /* =================================================
       4. SETTINGS  (every change is applied + saved instantly)
    ================================================= */

    const THEMES = ["pink", "dark", "lavender", "blue", "rose-love", "sweet-love", "strawberry-love", "purple-love", "love-night", "dreamy-love"];
    const LOVE_THEMES = ["rose-love", "sweet-love", "strawberry-love", "purple-love", "love-night", "dreamy-love"];

    const cfg = {
        name: "", language: "English", theme: "pink",
        notifications: false, music: false, volume: 50, musicTrack: "", musicMode: "order",
        relationshipDate: "", firstMeetingDate: "",
        backgroundColor: "", backgroundImage: "", backgroundGlow: 40,
        textColor: "", fontFamily: "Arial", buttonStyle: "rounded", fontSize: "medium",
        privacyLock: true, profilePicture: "", bgOpacity: 100
    };

    function saveSettingsData() {
        const copy = Object.assign({}, cfg);
        delete copy.backgroundImage;      // big images are stored under their own keys
        delete copy.profilePicture;
        store.set(KEY.settings, JSON.stringify(copy));
    }

    function loadSettings() {
        const raw = store.get(KEY.settings, null);
        if (raw) {
            try {
                const saved = JSON.parse(raw);
                if (saved && typeof saved === "object") Object.assign(cfg, saved);
            } catch (e) { console.error("Could not read saved settings:", e); }
        }
        if (cfg.backgroundColor === "#faf3f6") cfg.backgroundColor = "";
        if (cfg.textColor === "#3b3035") cfg.textColor = "";
        if (THEMES.indexOf(cfg.theme) === -1) cfg.theme = "pink";
        cfg.volume = clamp(Number(cfg.volume) || 0, 0, 100);
        cfg.backgroundGlow = clamp(Number(cfg.backgroundGlow) || 0, 0, 100);

        const bg = store.get(KEY.bg, null);
        if (bg !== null) cfg.backgroundImage = bg;
        const pic = store.get(KEY.pic, null);
        if (pic) cfg.profilePicture = pic;
    }

    function setSetting(key, value) {
        cfg[key] = value;
        saveSettingsData();
        applySettings();
        if (key === "musicMode") updateLoopFlag();
        flashSaved();
    }

    function applySettings() {
        const body = document.body;

        THEMES.forEach(function (name) { body.classList.remove("theme-" + name); });
        body.classList.add("theme-" + cfg.theme);
        body.classList.toggle("love-effect", LOVE_THEMES.indexOf(cfg.theme) !== -1);

        const glow = clamp(Number(cfg.backgroundGlow) || 0, 0, 100) / 100;
        body.style.backgroundColor = cfg.backgroundColor || "";
        if (cfg.backgroundImage) {
            body.style.backgroundImage = "none";
        } else {
            body.style.backgroundImage =
                "radial-gradient(circle at 50% 0%, rgba(255,255,255," + (0.75 * glow) + "), transparent 45%)," +
                "radial-gradient(circle at 50% 100%, rgba(255,255,255," + (0.35 * glow) + "), transparent 55%)";
        }
        let layer = $("bgLayer");
        if (!layer) { layer = document.createElement("div"); layer.id = "bgLayer"; document.body.prepend(layer); }
        layer.style.backgroundImage = cfg.backgroundImage ? 'url("' + cfg.backgroundImage + '")' : "none";
        layer.style.opacity = (cfg.bgOpacity == null ? 100 : cfg.bgOpacity) / 100;
        body.style.backgroundSize = "cover";
        body.style.backgroundPosition = "center";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundAttachment = "fixed";

        if (cfg.textColor) body.style.setProperty("--text", cfg.textColor);
        else body.style.removeProperty("--text");

        document.documentElement.style.setProperty("--site-font", '"' + (cfg.fontFamily || "Arial") + '", system-ui, sans-serif');
        document.documentElement.style.fontSize = { small: "14px", medium: "16px", large: "18px" }[cfg.fontSize] || "16px";

        ["rounded", "soft", "square"].forEach(function (s) { body.classList.remove("buttons-" + s); });
        body.classList.add("buttons-" + (cfg.buttonStyle || "rounded"));

        applyVolume();
        syncSettingsControls();
    }

    // Reflect the current values in the controls (active buttons, sliders, pickers…)
    function syncSettingsControls() {
        document.querySelectorAll("[data-setting]").forEach(function (btn) {
            btn.classList.toggle("active", String(cfg[btn.dataset.setting]) === btn.dataset.value);
        });

        const set = function (id, value) { const el = $(id); if (el && el !== document.activeElement) el.value = value; };
        set("displayName", cfg.name || "");
        set("relationshipDate", cfg.relationshipDate || "");
        set("firstMeetingDate", cfg.firstMeetingDate || "");
        set("fontFamily", cfg.fontFamily || "Arial");
        set("volumeControl", cfg.volume);
        set("backgroundGlow", cfg.backgroundGlow);
        set("bgOpacity", cfg.bgOpacity == null ? 100 : cfg.bgOpacity);

        const computed = getComputedStyle(document.body);
        const themeColor = function (name, fallback) {
            const v = computed.getPropertyValue(name).trim();
            return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
        };
        set("backgroundColor", cfg.backgroundColor || themeColor("--bg", "#fff0f6"));
        set("textColor", cfg.textColor || themeColor("--text", "#3b3035"));

        if ($("volumeValue")) $("volumeValue").textContent = cfg.volume + "%";
        if ($("backgroundGlowValue")) $("backgroundGlowValue").textContent = cfg.backgroundGlow + "%";
        if ($("musicToggle")) $("musicToggle").checked = !!cfg.music;
        if ($("notificationsToggle")) $("notificationsToggle").checked = !!cfg.notifications;
        if ($("privacyLock")) $("privacyLock").checked = !!cfg.privacyLock;

        updateDaysTogether();
        updateProfileUI();
    }

    function applyLanguage() {
        const arabic = cfg.language === "Arabic";
        langIdx = arabic ? 1 : 0;
        document.documentElement.lang = arabic ? "ar" : "en";
        document.documentElement.dir = arabic ? "rtl" : "ltr";

        document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
        document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });

        updateWelcomeText();
        updateDaysTogether();
        renderAlbumCards();
        renderNotes();
        renderFriendUI();
        renderMusicOptions();
        const view = currentView();
        if (view.id === "mediaSection") renderMedia(view.param);
        if (view.id === "albumPhotos") $("openedAlbumTitle").textContent = t("alb." + view.param + ".t");
        if (view.id === "quiz" && !$("quizContainer").classList.contains("hidden")) updateQuestionLabels();
    }

    function handleSettingButton(btn) {
        const key = btn.dataset.setting, value = btn.dataset.value;
        if (key === "language") { cfg.language = value; saveSettingsData(); applyLanguage(); applySettings(); flashSaved(); return; }
        if (key === "theme") { cfg.backgroundColor = ""; cfg.textColor = ""; }
        setSetting(key, value);
    }

    function updateProfileUI() {
        const has = !!cfg.profilePicture;
        [$("accountProfileImage"), $("topProfileImage")].forEach(function (img) {
            if (!img) return;
            if (has) { img.src = cfg.profilePicture; show(img); } else { hide(img); }
        });
        if ($("avatarFallback")) $("avatarFallback").classList.toggle("hidden", has);
    }

    function updateWelcomeText() {
        const el = $("welcomeText");
        if (el) el.textContent = t("welcome") + (cfg.name ? " " + cfg.name : "") + " 💕";
    }

    function daysSince(dateValue) {
        if (!dateValue) return 0;
        const start = new Date(dateValue + "T00:00:00");
        if (isNaN(start.getTime())) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return Math.max(0, Math.floor((today - start) / 86400000));
    }

    function updateDaysTogether() {
        const together = daysSince(cfg.relationshipDate);
        if ($("daysTogether")) $("daysTogether").textContent = together;
        if ($("daysSinceMeeting")) $("daysSinceMeeting").textContent = daysSince(cfg.firstMeetingDate);
        const pill = $("homeDays");
        if (pill) {
            if (cfg.relationshipDate) { pill.textContent = "💞 " + together + " " + t("days.together"); show(pill); }
            else hide(pill);
        }
    }

    function readImageFile(file, maxSize, quality) {
        return new Promise(function (resolve, reject) {
            const url = URL.createObjectURL(file), image = new Image();
            image.onerror = function () { URL.revokeObjectURL(url); reject(new Error("bad image")); };
            image.onload = function () {
                let w = image.naturalWidth, h = image.naturalHeight;
                if (w > maxSize) { h = h * (maxSize / w); w = maxSize; }
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(w)); canvas.height = Math.max(1, Math.round(h));
                canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            image.src = url;
        });
    }


    function initSettingsControls() {
        const on = function (id, eventName, fn) { const el = $(id); if (el) el.addEventListener(eventName, fn); };

        // Display name (saved while typing; server updated shortly after)
        let nameTimer = null;
        on("displayName", "input", function (e) {
            cfg.name = e.target.value.trim();
            saveSettingsData();
            updateWelcomeText();
            flashSaved();
            clearTimeout(nameTimer);
            nameTimer = setTimeout(pushProfileName, 700);
        });

        on("profilePicture", "change", function (e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            readImageFile(file, 400, 0.85).then(function (data) {
                cfg.profilePicture = data;
                if (!store.set(KEY.pic, data)) toast(t("s.storageFull"));
                updateProfileUI();
                flashSaved();
            }).catch(function () { toast(t("s.badImage")); });
            e.target.value = "";
        });

        on("backgroundImage", "change", function (e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            readImageFile(file, 1600, 0.8).then(function (data) {
                if (!store.set(KEY.bg, data)) { toast(t("s.storageFull")); return; }
                cfg.backgroundImage = data;
                applySettings();
                flashSaved();
            }).catch(function () { toast(t("s.badImage")); });
            e.target.value = "";
        });

        on("relationshipDate", "change", function (e) { setSetting("relationshipDate", e.target.value); });
        on("firstMeetingDate", "change", function (e) { setSetting("firstMeetingDate", e.target.value); });
        on("backgroundColor", "input", function (e) { setSetting("backgroundColor", e.target.value); });
        on("textColor", "input", function (e) { setSetting("textColor", e.target.value); });
        on("backgroundGlow", "input", function (e) { setSetting("backgroundGlow", Number(e.target.value)); });
        on("bgOpacity", "input", function (e) { setSetting("bgOpacity", Number(e.target.value)); });
        on("fontFamily", "change", function (e) { setSetting("fontFamily", e.target.value); });
        on("privacyLock", "change", function (e) { setSetting("privacyLock", e.target.checked); });
        on("volumeControl", "input", function (e) { setSetting("volume", Number(e.target.value)); });
        on("musicToggle", "change", function (e) { setSetting("music", e.target.checked); e.target.checked ? playMusic(true) : pauseMusic(); });
        on("notificationsToggle", "change", handleNotificationToggle);
        on("musicTrack", "change", function (e) { chooseTrack(e.target.value); });
        on("musicFile", "change", function (e) {
            if (e.target.files && e.target.files.length) handleMusicFiles(e.target.files);
            e.target.value = "";
        });
        on("musicNext", "change", function (e) { upNextId = e.target.value; updateLoopFlag(); flashSaved(); });
    }

    function removeBackgroundImage() {
        cfg.backgroundImage = "";
        store.del(KEY.bg);
        applySettings();
        flashSaved();
    }

    function resetAppearance() {
        cfg.backgroundColor = ""; cfg.textColor = ""; cfg.backgroundGlow = 40; cfg.bgOpacity = 100;
        cfg.backgroundImage = ""; store.del(KEY.bg);
        saveSettingsData();
        applySettings();
        flashSaved();
    }

    function clearSavedData() {
        if (!confirm(t("s.confirm.clear"))) return;
        store.del(KEY.settings);
        store.del(KEY.bg);
        location.reload();
    }

    function resetWebsite() {
        if (!confirm(t("s.confirm.reset"))) return;
        try { localStorage.clear(); } catch (e) { /* ignore */ }
        try { indexedDB.deleteDatabase("ourWorldMusic"); } catch (e) { /* ignore */ }
        location.reload();
    }


    /* =================================================
       5. MUSIC
    ================================================= */

    let musicNeedsGesture = false;
    let userTracks = [];          // songs added from the device: { id, key, name, src, user }
    let upNextId = "";            // one-time choice: "play this one after the current song"
    let autoAdvance = false;      // true while the site itself moves to another song
    let skipTries = 0;

    /* --- tiny IndexedDB helper: keeps the songs you add between visits --- */
    const musicDB = {
        open: function () {
            return new Promise(function (resolve, reject) {
                if (!window.indexedDB) { reject(new Error("no indexedDB")); return; }
                const req = indexedDB.open("ourWorldMusic", 1);
                req.onupgradeneeded = function () { req.result.createObjectStore("files"); };
                req.onsuccess = function () { resolve(req.result); };
                req.onerror = function () { reject(req.error); };
            });
        },
        run: function (mode, fn) {
            return musicDB.open().then(function (db) {
                return new Promise(function (resolve, reject) {
                    const tx = db.transaction("files", mode);
                    const req = fn(tx.objectStore("files"));
                    tx.oncomplete = function () { resolve(req && req.result); db.close(); };
                    tx.onerror = tx.onabort = function () { reject(tx.error); db.close(); };
                });
            });
        },
        all: function () {
            return musicDB.open().then(function (db) {
                return new Promise(function (resolve, reject) {
                    const tx = db.transaction("files", "readonly");
                    const out = [];
                    const req = tx.objectStore("files").openCursor();
                    req.onsuccess = function () {
                        const c = req.result;
                        if (c) { out.push({ key: c.key, value: c.value }); c.continue(); }
                    };
                    tx.oncomplete = function () { resolve(out); db.close(); };
                    tx.onerror = tx.onabort = function () { reject(tx.error); db.close(); };
                });
            });
        },
        put: function (key, value) { return musicDB.run("readwrite", function (st) { return st.put(value, key); }); },
        del: function (key) { return musicDB.run("readwrite", function (st) { return st.delete(key); }); }
    };

    function makeUserTrack(key, blob, name) {
        return {
            id: "u:" + String(key).replace(/^song:/, ""),
            key: key,
            name: name || t("s.music.custom"),
            src: URL.createObjectURL(blob),
            user: true
        };
    }

    // Reads every song you added (also the single song saved by the old version).
    function loadUserMusic() {
        return musicDB.all().then(function (rows) {
            userTracks.forEach(function (tr) { URL.revokeObjectURL(tr.src); });
            userTracks = rows.filter(function (r) {
                return r.value && r.value.blob && (r.key === "custom" || String(r.key).indexOf("song:") === 0);
            }).sort(function (a, b) {
                return (a.value.added || 0) - (b.value.added || 0);
            }).map(function (r) { return makeUserTrack(r.key, r.value.blob, r.value.name); });
        }).catch(function () { /* nothing saved yet */ });
    }

    // The playlist = your named songs + the songs added from the device.
    function allTracks() {
        return MUSIC_TRACKS.map(function (tr) { return { id: tr.file, name: tr.name, src: tr.file }; }).concat(userTracks);
    }
    function findTrack(id) {
        if (!id) return null;
        if (id === "custom") id = "u:custom";
        return allTracks().filter(function (tr) { return tr.id === id; })[0] || null;
    }
    function currentTrack() { return findTrack(cfg.musicTrack) || allTracks()[0] || null; }
    function currentTrackSource() { const tr = currentTrack(); return tr ? tr.src : ""; }

    function fillTrackSelect(select, prefix, first) {
        select.innerHTML = "";
        if (first) select.appendChild(first);
        allTracks().forEach(function (tr) {
            const option = document.createElement("option");
            option.value = tr.id;
            option.textContent = (tr.user ? "📱 " : prefix) + tr.name;
            select.appendChild(option);
        });
    }

    function renderMusicOptions() {
        const select = $("musicTrack");
        if (!select) return;
        const cur = currentTrack();
        if (upNextId && !findTrack(upNextId)) upNextId = "";

        fillTrackSelect(select, "🎵 ");
        if (cur) select.value = cur.id;

        const next = $("musicNext");
        if (next) {
            const none = document.createElement("option");
            none.value = ""; none.textContent = t("s.music.nextNone");
            fillTrackSelect(next, "➜ ", none);
            next.value = upNextId;
        }

        const list = $("myMusicList");
        if (list) {
            list.innerHTML = "";
            userTracks.forEach(function (tr) {
                const row = document.createElement("div");
                row.className = "my-song";
                const name = document.createElement("span");
                name.textContent = "📱 " + tr.name;
                const del = document.createElement("button");
                del.type = "button";
                del.className = "icon-btn";
                del.textContent = "🗑️";
                del.dataset.action = "removeSong";
                del.dataset.key = tr.key;
                del.title = t("s.music.removeOne");
                del.setAttribute("aria-label", t("s.music.removeOne"));
                row.append(name, del);
                list.appendChild(row);
            });
            const box = $("myMusicBox");
            if (box) box.classList.toggle("hidden", !userTracks.length);
        }

        const np = $("nowPlaying");
        if (np) np.textContent = cur ? "🎵 " + cur.name : "";
        updateLoopFlag();
        updateMediaSession();
    }

    // "Repeat" = the browser loops the song (unless you chose a song to play next).
    function updateLoopFlag() {
        const audio = $("backgroundMusic");
        if (audio) audio.loop = cfg.musicMode === "repeat" && !upNextId;
    }

    function updateMediaSession() {
        if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
        const cur = currentTrack();
        if (!cur) return;
        try {
            navigator.mediaSession.metadata = new MediaMetadata({ title: cur.name, artist: "Our World 💗" });
            navigator.mediaSession.setActionHandler("previoustrack", function () { stepTrack(-1); });
            navigator.mediaSession.setActionHandler("nexttrack", function () { stepTrack(1); });
        } catch (e) { /* not supported */ }
    }

    // Points the <audio> at the chosen song. Keeps playing if it was playing.
    function applyMusicTrack() {
        const audio = $("backgroundMusic");
        if (!audio) return;
        const src = currentTrackSource();
        if (!src || audio.dataset.src === src) return;
        const wasPlaying = !audio.paused;
        audio.dataset.src = src;
        audio.src = src;
        audio.load();
        if (wasPlaying) playMusic(false);
    }

    function selectTrack(id, autoplay) {
        cfg.musicTrack = id;
        saveSettingsData();
        if (autoplay && !cfg.music) { cfg.music = true; saveSettingsData(); applySettings(); }
        applyMusicTrack();
        renderMusicOptions();
        if (autoplay) playMusic(!autoAdvance);
    }

    // The song was picked by hand (menu).
    function chooseTrack(value) {
        autoAdvance = false; skipTries = 0;
        selectTrack(value, true);
        flashSaved();
    }

    // Previous / next song. Next follows the mode (in order or shuffle).
    function stepTrack(dir) {
        const list = allTracks();
        if (!list.length) return;
        const cur = currentTrack();
        let i = 0;
        list.forEach(function (tr, n) { if (cur && tr.id === cur.id) i = n; });
        let to;
        if (cfg.musicMode === "shuffle" && list.length > 1) {
            do { to = Math.floor(Math.random() * list.length); } while (to === i);
        } else {
            to = (i + dir + list.length) % list.length;
        }
        autoAdvance = true;
        selectTrack(list[to].id, true);
    }

    function onMusicEnded() {
        if (!cfg.music) return;
        const audio = $("backgroundMusic");
        if (cfg.musicMode === "repeat" && !upNextId) { audio.currentTime = 0; playMusic(false); return; }
        if (upNextId && findTrack(upNextId)) {
            const id = upNextId;
            upNextId = "";
            autoAdvance = true;
            selectTrack(id, true);
            return;
        }
        upNextId = "";
        stepTrack(1);
    }

    // A missing file while the site is moving on by itself: skip to the next one.
    function onMusicError() {
        const audio = $("backgroundMusic");
        if (!audio || !audio.getAttribute("src")) return;
        if (cfg.music && autoAdvance && skipTries < allTracks().length - 1) { skipTries++; stepTrack(1); return; }
        toast(t("music.missing"));
    }

    function wireMusic() {
        const audio = $("backgroundMusic");
        if (!audio) return;
        audio.addEventListener("ended", onMusicEnded);
        audio.addEventListener("error", onMusicError);
        audio.addEventListener("playing", function () { skipTries = 0; });
    }

    // Songs picked from the phone / computer: saved in the browser next to your own songs.
    async function handleMusicFiles(fileList) {
        const files = Array.prototype.slice.call(fileList).filter(function (f) {
            return f.type.indexOf("audio/") === 0 || /\.(mp3|m4a|aac|wav|ogg|opus|flac|webm)$/i.test(f.name);
        });
        if (!files.length) { toast(t("music.notAudio")); return; }
        let failed = false, first = null;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const key = "song:" + Date.now() + "-" + i;
            const name = file.name.replace(/\.[^.]+$/, "");
            const track = makeUserTrack(key, file, name);
            userTracks.push(track);
            if (!first) first = track;
            try { await musicDB.put(key, { blob: file, name: name, added: Date.now() + i }); }
            catch (e) { failed = true; }
        }
        try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* ignore */ }
        toast(failed ? t("music.sessionOnly") : t("music.saved"));
        autoAdvance = false; skipTries = 0;
        selectTrack(first.id, true);
    }

    function removeUserTrack(key) {
        const track = userTracks.filter(function (x) { return x.key === key; })[0];
        if (!track) return;
        musicDB.del(key).catch(function () { /* ignore */ });
        userTracks = userTracks.filter(function (x) { return x.key !== key; });
        if (upNextId === track.id) upNextId = "";
        if (cfg.musicTrack === track.id || (cfg.musicTrack === "custom" && track.id === "u:custom")) {
            cfg.musicTrack = "";
            saveSettingsData();
        }
        renderMusicOptions();
        applyMusicTrack();
        URL.revokeObjectURL(track.src);
        flashSaved();
    }

    function applyVolume() {
        const audio = $("backgroundMusic");
        if (audio) audio.volume = clamp(Number(cfg.volume) || 0, 0, 100) / 100;
    }

    function playMusic(userAction) {
        const audio = $("backgroundMusic");
        if (!audio) return;
        applyMusicTrack();
        applyVolume();
        updateLoopFlag();
        const promise = audio.play();
        if (promise && promise.catch) {
            promise.then(function () { musicNeedsGesture = false; }).catch(function (error) {
                if (error && error.name === "NotAllowedError") musicNeedsGesture = true;
                else if (userAction) toast(t("music.missing"));
            });
        }
    }

    function pauseMusic() {
        const audio = $("backgroundMusic");
        if (audio) audio.pause();
    }

    // Browsers block autoplay: start the music on the first tap if it is switched on.
    document.addEventListener("pointerdown", function () {
        if (musicNeedsGesture && cfg.music) playMusic(false);
    }, { passive: true });


    /* =================================================
       6. NOTIFICATIONS
    ================================================= */

    let notificationInterval = null, notificationTimeout = null;

    async function notify(title, body, skipLog) {
        if (!skipLog && window.pushNotice) window.pushNotice(title, body);
        if (!("Notification" in window) || Notification.permission !== "granted") return false;

        try {
            new Notification(title, { body: body });
            return true;
        } catch (error) {
            // Android Chrome: "new Notification()" is not allowed, use the service worker instead
            try {
                const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : null;
                if (reg && reg.showNotification) { await reg.showNotification(title, { body: body }); return true; }
            } catch (e2) { console.error("Notification error:", e2); }
            console.error("Notification error:", error);
            return false;
        }
    }

    async function askNotificationPermission() {
        if (!("Notification" in window)) { alert(t("n.unsupported")); return false; }
        if (Notification.permission === "granted") return true;
        if (Notification.permission === "denied") { alert(t("n.blocked")); return false; }
        try { return (await Notification.requestPermission()) === "granted"; }
        catch (e) { console.error(e); return false; }
    }

    async function testNotification() {
    const user = await getCurrentUser();

    if (!user || !owSupabase()) {
        toast("Please log in first.");
        return;
    }

    const title = "Our World 💗";
    const body = t("n.test");

    // Save notification to Supabase
    const { error } = await owSupabase()
        .from("notifications")
        .insert([{
            user_id: user.id,
            type: "general",
            title: title,
            message: body,
            is_read: false
        }]);

    if (error) {
        console.error("Error saving notification:", error);
        toast("Could not save the notification.");
        return;
    }

    // Show browser notification
    if (await askNotificationPermission()) {
        await notify(title, body, true);
    }

    // Refresh the notifications panel
    await loadNotifications();
}

    function showSiteNotification() {
        if (!cfg.notifications || !siteNotifications.length) return;
        notify("Our World 💗", siteNotifications[Math.floor(Math.random() * siteNotifications.length)]);
    }

    function startSiteNotifications() {
        stopSiteNotifications();
        if (!cfg.notifications || !("Notification" in window) || Notification.permission !== "granted") return;
        notificationTimeout = setTimeout(showSiteNotification, 15000);
        notificationInterval = setInterval(function () {
            if (cfg.notifications && Notification.permission === "granted") showSiteNotification();
            else stopSiteNotifications();
        }, 60000);
    }

    function stopSiteNotifications() {
        clearTimeout(notificationTimeout);
        clearInterval(notificationInterval);
        notificationTimeout = notificationInterval = null;
    }

    async function handleNotificationToggle(e) {
        const toggle = e.target;
        if (toggle.checked) {
            if (!(await askNotificationPermission())) {
                toggle.checked = false;
                cfg.notifications = false;
                saveSettingsData();
                stopSiteNotifications();
                return;
            }
            cfg.notifications = true;
            saveSettingsData();
            flashSaved();
            startSiteNotifications();
            subscribeToPush();
            return;
        }
        cfg.notifications = false;
        saveSettingsData();
        flashSaved();
        stopSiteNotifications();
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const raw = window.atob(base64);
        return Uint8Array.from(Array.prototype.map.call(raw, function (c) { return c.charCodeAt(0); }));
    }

    async function subscribeToPush() {
        if (!PUSH_SERVER_URL || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
        try {
            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                });
            }
            await fetch(PUSH_SERVER_URL + "/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscription)
            });
        } catch (e) { console.error("Push subscription failed:", e); }
    }

    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("service-worker.js").catch(function (e) {
                console.log("Service worker not registered:", e.message);
            });
        });
    }


    /* =================================================
       7. NAVIGATION  (Back = exactly one step)
    ================================================= */

    const VIEW_IDS = ["homePage", "datesSection", "ourTime", "mediaSection", "ourNotes", "messagesSection", "quiz", "privateSection", "albumPhotos"];

    let navStack = [{ id: "homePage" }];
    let ignorePop = 0;
    let replaceNext = false;
    const overlays = [];            // open windows: settings, password, image viewer

    function currentView() { return navStack[navStack.length - 1]; }

    function renderView() {
        const view = currentView();
        stopEmojiRain();
        stopMessagePolling();
        if (view.id !== "albumPhotos") clearAlbum();
        VIEW_IDS.forEach(function (id) { hide($(id)); });
        show($(view.id));
        window.scrollTo(0, 0);

        switch (view.id) {
            case "homePage": updateWelcomeText(); updateDaysTogether(); break;
            case "mediaSection": renderMedia(view.param); break;
            case "ourNotes": renderNotes(); break;
            case "messagesSection": loadMessages(true); startMessagePolling(); break;
            case "quiz": startQuiz(); break;
            case "datesSection": if (window.renderDates) window.renderDates(); break;
            case "privateSection": renderAlbumCards(); startEmojiRain(); break;
            case "albumPhotos": showAlbum(view.param); break;
        }
    }

    function navigate(id, param) {
        navStack.push({ id: id, param: param });
        const state = { nav: navStack.length };
        if (replaceNext) { history.replaceState(state, ""); replaceNext = false; }
        else history.pushState(state, "");
        renderView();
    }

    function goHome(extraEntries) {
        const steps = navStack.length - 1 + (extraEntries || 0);
        navStack = [{ id: "homePage" }];
        renderView();
        if (steps > 0) { ignorePop++; history.go(-steps); }
    }

    function goBack() {
        if (overlays.length) { dismissOverlay(overlays[overlays.length - 1].id); return; }
        if (navStack.length > 1) history.back();
        else goHome();
    }

    window.addEventListener("popstate", function () {
        if (ignorePop > 0) { ignorePop--; return; }
        if (overlays.length) { const o = overlays.pop(); o.close(); syncOverlayState(); return; }
        if (navStack.length > 1) { navStack.pop(); renderView(); }
    });

    function syncOverlayState() {
        document.body.classList.toggle("no-scroll", overlays.length > 0);
    }

    function pushOverlay(id, closeFn) {
        if (overlays.some(function (o) { return o.id === id; })) return;
        overlays.push({ id: id, close: closeFn });
        history.pushState({ overlay: id }, "");
        syncOverlayState();
    }

    // Close a window with the X / Back button (also removes its history entry).
    function dismissOverlay(id) {
        const i = overlays.findIndex(function (o) { return o.id === id; });
        if (i === -1) return;
        const o = overlays.splice(i, 1)[0];
        o.close();
        syncOverlayState();
        ignorePop++;
        history.back();
    }

    // Close a window and go straight to another page (the page replaces the window's history entry).
    function closeOverlayThenNavigate(id) {
        const i = overlays.findIndex(function (o) { return o.id === id; });
        if (i === -1) return;
        const o = overlays.splice(i, 1)[0];
        o.close();
        syncOverlayState();
        replaceNext = true;
    }


    /* ---------- Settings window (opens on the LEFT) ---------- */

    function openSettings() {
        const panel = $("settings"), scrim = $("settingsOverlay");
        if (!panel || overlays.some(function (o) { return o.id === "settings"; })) return;
        syncSettingsControls();
        panel.classList.add("open");
        panel.setAttribute("aria-hidden", "false");
        scrim.classList.add("active");
        panel.scrollTop = 0;
        pushOverlay("settings", closeSettingsUI);
        loadFriendConnection();
    }

    function closeSettingsUI() {
        const panel = $("settings");
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
        $("settingsOverlay").classList.remove("active");
    }


    /* ---------- Password window ---------- */

    let passwordContext = null;

    function openPasswordModal(options) {
        passwordContext = options;
        $("pwIcon").textContent = options.icon || "🔒";
        $("pwTitle").textContent = options.title;
        $("pwHint").textContent = options.hint || "";
        $("pwError").textContent = "";
        const input = $("pwInput");
        input.value = "";
        input.type = "password";
        const eye = document.querySelector('[data-target="pwInput"]');
        if (eye) eye.textContent = "👁️";
        const modal = $("passwordModal");
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        pushOverlay("password", closePasswordUI);
        setTimeout(function () { input.focus(); }, 120);
    }

    function closePasswordUI() {
        const modal = $("passwordModal");
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        $("pwInput").value = "";
        passwordContext = null;
    }

    function submitPassword() {
        if (!passwordContext) return;
        const input = $("pwInput");
        if (input.value === passwordContext.expected) {
            const done = passwordContext.onSuccess;
            closeOverlayThenNavigate("password");   // window disappears…
            done();                                  // …and the content appears
            return;
        }
        $("pwError").textContent = t("pw.wrong");
        const card = $("passwordModal").querySelector(".modal-card") || $("passwordModal");
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
        input.value = "";
        input.focus();
    }

    function askPermission() {
        openPasswordModal({
            icon: "🔒",
            title: t("pw.main.title"),
            hint: t("pw.main.hint"),
            expected: MAIN_PASSWORD,
            onSuccess: function () { navigate("privateSection"); }
        });
    }

    function togglePw(button) {
        const input = $(button.dataset.target);
        if (!input) return;
        const reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        button.textContent = reveal ? "🙈" : "👁️";
    }

    // Privacy lock: leaving the page closes the private albums.
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden || !cfg.privacyLock) return;
        const id = currentView().id;
        if (id === "privateSection" || id === "albumPhotos") {
            const extra = overlays.length;
            while (overlays.length) { overlays.pop().close(); }
            syncOverlayState();
            goHome(extra);
        }
    });


    /* =================================================
       8. AUTH  (Supabase)
    ================================================= */

    let currentUser = null, otherUser = null, currentFriendRequest = null;

    async function login(event) {
        if (event) event.preventDefault();
        const nameInput = $("loginNameInput"), emailInput = $("nameInput"), passInput = $("passwordInput"), error = $("passwordError");
        const name = nameInput.value.trim(), email = emailInput.value.trim(), password = passInput.value;

        if (!name) { error.textContent = t("err.name"); return; }
        if (!email) { error.textContent = t("err.email"); return; }
        if (!password) { error.textContent = t("err.pass"); return; }
        if (!owSupabase()) { error.textContent = t("err.offline"); return; }
        error.textContent = "";

        let result;
        try { result = await owSupabase().auth.signInWithPassword({ email: email, password: password }); }
        catch (e) { console.error(e); error.textContent = t("err.offline"); return; }

        if (result.error || !result.data || !result.data.user) {
            console.error("Login error:", result.error);
            error.textContent = t("err.wrong");
            return;
        }

        currentUser = result.data.user;
        cfg.name = name;
        saveSettingsData();

        try {
            const upsert = await owSupabase().from("profiles").upsert({ id: currentUser.id, name: name });
            if (upsert.error) console.error("Profile error:", upsert.error);
        } catch (e) { console.error("Profile error:", e); }

        passInput.value = "";
        showMainPage();
        loadNotifications();
        loadFriendConnection();
        if ("Notification" in window && Notification.permission === "granted" && cfg.notifications) {
            setTimeout(function () { notify("Our World 💗", t("n.welcome")); }, 300);
            startSiteNotifications();
        }
        if (cfg.music) playMusic(false);
    }

    async function pushProfileName() {
        if (!owSupabase() || !currentUser) return;
        const result = await owSupabase().from("profiles").update({ name: cfg.name }).eq("id", currentUser.id);
        if (result.error) console.error("Could not update profile name:", result.error);
    }

    function showMainPage() {
        hide($("loginPage"));
        show($("mainPage"));
        navStack = [{ id: "homePage" }];
        history.replaceState({ nav: 1 }, "");
        renderView();
        syncSettingsControls();
    }

    function showLoginPage() {
        while (overlays.length) overlays.pop().close();
        syncOverlayState();
        navStack = [{ id: "homePage" }];
        hide($("mainPage"));
        show($("loginPage"));
    }

    async function logout() {
        saveSettingsData();
        if (owSupabase()) {
            try {
                const result = await owSupabase().auth.signOut();
                if (result.error) console.error("Logout error:", result.error);
            } catch (e) { console.error("Logout error:", e); }
        }
        lastMessagesSig = "";
        currentUser = otherUser = currentFriendRequest = null;
        friendUI = { status: "none", name: "" };
        stopSiteNotifications();
        stopMessagePolling();
        pauseMusic();
        showLoginPage();
        ["loginNameInput", "nameInput", "passwordInput"].forEach(function (id) { if ($(id)) $(id).value = ""; });
        if ($("passwordError")) $("passwordError").textContent = "";
    }

    async function getCurrentUser() {
        if (!owSupabase()) return null;
        const result = await owSupabase().auth.getUser();
        if (result.error || !result.data || !result.data.user) { currentUser = null; return null; }
        currentUser = result.data.user;
        return currentUser;
    }

    // The site has exactly two users: the other profile is "your person".
    async function getOtherUser() {
        if (!currentUser) await getCurrentUser();
        if (!currentUser) return null;
        const result = await owSupabase().from("profiles").select("id, name").neq("id", currentUser.id).limit(1);
        if (result.error || !result.data || !result.data.length) { if (result.error) console.error(result.error); return null; }
        otherUser = result.data[0];
        return otherUser;
    }

    async function restoreSession() {
        if (!owSupabase()) return;
        try {
            const result = await owSupabase().auth.getSession();
            const session = result.data && result.data.session;
            if (!session || !session.user) return;
            currentUser = session.user;
            showMainPage();
            loadNotifications();
            if (cfg.music) playMusic(false);
            if (cfg.notifications) startSiteNotifications();

            const profile = await owSupabase().from("profiles").select("name").eq("id", currentUser.id).maybeSingle();
            if (profile.error) console.error("Could not load profile:", profile.error);
            if (profile.data && profile.data.name) {
                cfg.name = profile.data.name;
                saveSettingsData();
                updateWelcomeText();
                syncSettingsControls();
            }
            loadFriendConnection();
        } catch (e) { console.error("Could not restore session:", e); }
    }


    /* =================================================
       9. FRIEND CONNECTION
    ================================================= */

    let friendUI = { status: "none", name: "" };

    function updateFriendUI(status, friendName) {
        friendUI = { status: status, name: friendName || "" };
        renderFriendUI();
    }

    function renderFriendUI() {
        const status = friendUI.status;
        const button = $("friendActionButton");
        if (!button) return;
        if ($("friendName")) $("friendName").textContent = friendUI.name || t("fr.your");
        hide($("friendRequestArea"));
        hide($("connectedArea"));
        show(button);
        button.disabled = false;
        button.textContent = t("fr.add");

        const label = { none: "fr.none", rejected: "fr.none", outgoing: "fr.outgoing", incoming: "fr.incoming", accepted: "fr.accepted" }[status] || "fr.none";
        if ($("friendStatus")) $("friendStatus").textContent = t(label);

        if (status === "outgoing") { button.textContent = t("fr.sent"); button.disabled = true; }
        if (status === "incoming") { hide(button); show($("friendRequestArea")); }
        if (status === "accepted") { hide(button); show($("connectedArea")); }
    }

    function sameCouple(request, a, b) {
        if (request.sender_id !== a && request.sender_id !== b) return false;
        if (!request.receiver_id) return true;      // old requests saved without receiver_id
        return (request.sender_id === a && request.receiver_id === b) || (request.sender_id === b && request.receiver_id === a);
    }

    async function loadFriendConnection() {
    if (!owSupabase()) return;

    const user = await getCurrentUser();
    if (!user) return;

    const friend = await getOtherUser();

    if (!friend) {
        updateFriendUI("none", "");
        return;
    }

    const result = await owSupabase()
        .from("friend_requests")
        .select("*")
        .or("sender_id.eq." + user.id + ",receiver_id.eq." + user.id + ",sender_id.eq." + friend.id)
        .order("created_at", { ascending: false });

    if (result.error) {
        console.error(result.error);
        updateFriendUI("none", friend.name);
        return;
    }

    currentFriendRequest =
        (result.data || []).find(function (r) {
            return sameCouple(r, user.id, friend.id);
        }) || null;

    if (!currentFriendRequest) {
        updateFriendUI("none", friend.name);
        return;
    }

    const s = currentFriendRequest.status;

    if (s === "accepted") {
        updateFriendUI("accepted", friend.name);
    } else if (s === "pending") {
        updateFriendUI(
            currentFriendRequest.sender_id === user.id
                ? "outgoing"
                : "incoming",
            friend.name
        );
    } else if (s === "rejected") {
        updateFriendUI("rejected", friend.name);
    } else {
        updateFriendUI("none", friend.name);
    }
}

    async function sendFriendRequest() {
        const user = await getCurrentUser();
        if (!user) { alert(t("login.first")); return; }
        const friend = await getOtherUser();
        if (!friend) { alert(t("fr.notFound")); return; }

        const existingResult = await owSupabase().from("friend_requests").select("*")
            .or("sender_id.eq." + user.id + ",receiver_id.eq." + user.id + ",sender_id.eq." + friend.id);
        if (existingResult.error) { console.error(existingResult.error); alert(t("fr.fail")); return; }

        const existing = (existingResult.data || []).find(function (r) { return sameCouple(r, user.id, friend.id); });
        if (existing && existing.status === "accepted") { toast(t("fr.already")); await loadFriendConnection(); return; }
        if (existing && existing.status === "pending") { toast(t("fr.exists")); await loadFriendConnection(); return; }
        if (existing && existing.status === "rejected") {
            const del = await owSupabase().from("friend_requests").delete().eq("id", existing.id);
            if (del.error) { console.error(del.error); alert(t("fr.fail")); return; }
        }

        const insert = await owSupabase().from("friend_requests").insert([{ sender_id: user.id, receiver_id: friend.id, status: "pending" }]);
        if (insert.error) { console.error(insert.error); alert(t("fr.fail") + "\n" + (insert.error.message || "")); return; }
        await loadFriendConnection();
    }

    async function answerFriendRequest(status) {
        const user = await getCurrentUser();
        if (!user) return;
        if (!currentFriendRequest || currentFriendRequest.status !== "pending" || currentFriendRequest.sender_id === user.id) {
            await loadFriendConnection();
            return;
        }
        const result = await owSupabase().from("friend_requests").update({ status: status }).eq("id", currentFriendRequest.id);
        if (result.error) { console.error(result.error); alert(t("fr.fail") + "\n" + (result.error.message || "")); return; }
        await loadFriendConnection();
    }


    /* =================================================
       10. MEDIA  (songs / games / apps)
    ================================================= */

    function renderMedia(type) {
        if (!type) return;
        $("mediaTitle").textContent = t("media." + type);
        $("mediaSubtitle").textContent = t("media." + type + ".sub");
        const grid = $("mediaGrid");
        grid.innerHTML = "";
        const items = (mediaData[type] || []).filter(function (item) { return item && item.name && item.link; });
        if (!items.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = t("media.empty");
            grid.appendChild(empty);
            return;
        }
        items.forEach(function (item) {
            const a = document.createElement("a");
            a.className = "media-item";
            a.href = item.link;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            const icon = document.createElement("span");
            icon.className = "media-icon";
            icon.textContent = item.icon || "💗";
            const name = document.createElement("b");
            name.textContent = item.name;
            const go = document.createElement("span");
            go.className = "media-go";
            go.textContent = "↗";
            a.append(icon, name, go);
            grid.appendChild(a);
        });
    }


    /* =================================================
       11. NOTES  (saved in this browser)
    ================================================= */

    let notes = [];
    let noteImages = [];
    let editingNoteId = null;

    function loadNotes() {
        try {
            const parsed = JSON.parse(store.get(KEY.notes, "[]"));
            notes = Array.isArray(parsed) ? parsed : [];
        } catch (e) { notes = []; }
    }

    function saveNotesToStorage() {
        if (!store.set(KEY.notes, JSON.stringify(notes))) { toast(t("s.storageFull")); return false; }
        return true;
    }

    function getTodayDate() {
        const d = new Date();
        return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }

    function formatNoteDate(value) {
        if (!value) return "";
        const d = new Date(value + "T00:00:00");
        return isNaN(d.getTime()) ? value : d.toLocaleDateString(locale(), { year: "numeric", month: "long", day: "numeric" });
    }

    function openNewNote() {
        editingNoteId = null;
        noteImages = [];
        $("noteEditorTitle").textContent = t("notes.newTitle");
        $("noteTitle").value = "";
        $("noteText").value = "";
        $("noteDate").value = getTodayDate();
        renderNoteImagePreview();
        show($("noteEditor"));
        $("noteEditor").scrollIntoView({ behavior: "smooth", block: "start" });
        $("noteTitle").focus();
    }

    function closeNoteEditor() {
        editingNoteId = null;
        noteImages = [];
        hide($("noteEditor"));
        renderNoteImagePreview();
    }

    function handleNoteImages(event) {
        const files = Array.from(event.target.files || []);
        event.target.value = "";
        if (!files.length) return;
        const available = 6 - noteImages.length;
        if (available <= 0) { alert(t("notes.maxImages")); return; }
        files.slice(0, available).forEach(function (file) {
            if (!file.type.startsWith("image/")) return;
            readImageFile(file, 1200, 0.82).then(function (data) {
                noteImages.push({ src: data, style: "rounded" });
                renderNoteImagePreview();
            }).catch(console.error);
        });
    }

    function renderNoteImagePreview() {
        const box = $("noteImagePreview");
        box.innerHTML = "";
        noteImages.forEach(function (image, index) {
            const item = document.createElement("div");
            item.className = "note-preview-item";

            const img = document.createElement("img");
            img.src = image.src;
            img.alt = "";
            img.className = "note-image-" + (image.style || "rounded");

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "note-remove-image";
            remove.textContent = "✕";
            remove.setAttribute("aria-label", "Remove");
            remove.onclick = function () { noteImages.splice(index, 1); renderNoteImagePreview(); };

            const select = document.createElement("select");
            ["classic", "rounded", "circle", "polaroid"].forEach(function (style) {
                const option = document.createElement("option");
                option.value = style;
                option.textContent = t("notes.style." + style);
                option.selected = (image.style || "rounded") === style;
                select.appendChild(option);
            });
            select.onchange = function () { image.style = select.value; img.className = "note-image-" + image.style; };

            item.append(img, remove, select);
            box.appendChild(item);
        });
    }

    function saveNote() {
        const title = $("noteTitle").value.trim();
        const text = $("noteText").value.trim();
        const date = $("noteDate").value;
        if (!title && !text && !noteImages.length) { alert(t("notes.needContent")); return; }

        const data = {
            id: editingNoteId || Date.now().toString(),
            title: title || t("notes.defaultTitle"),
            date: date || getTodayDate(),
            text: text,
            images: noteImages.map(function (i) { return { src: i.src, style: i.style }; }),
            updatedAt: Date.now()
        };

        const previous = notes.slice();
        if (editingNoteId) {
            const index = notes.findIndex(function (n) { return n.id === editingNoteId; });
            if (index !== -1) notes[index] = data; else notes.unshift(data);
        } else {
            notes.unshift(data);
        }
        if (!saveNotesToStorage()) { notes = previous; return; }
        closeNoteEditor();
        renderNotes();
    }

    function renderNotes() {
        const list = $("notesList");
        if (!list) return;
        list.innerHTML = "";

        if (!notes.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.innerHTML = '<div class="empty-icon">📝</div><h3></h3><p></p>';
            empty.querySelector("h3").textContent = t("notes.empty");
            empty.querySelector("p").textContent = t("notes.empty.sub");
            list.appendChild(empty);
            return;
        }

        notes.forEach(function (note) {
            const card = document.createElement("article");
            card.className = "note-card";

            const head = document.createElement("div");
            head.className = "note-card-header";
            const title = document.createElement("h3");
            title.textContent = note.title;
            const date = document.createElement("time");
            date.textContent = formatNoteDate(note.date);
            head.append(title, date);
            card.appendChild(head);

            if (note.text) {
                const text = document.createElement("p");
                text.className = "note-card-text";
                text.textContent = note.text;
                card.appendChild(text);
            }

            if (note.images && note.images.length) {
                const gallery = document.createElement("div");
                gallery.className = "note-gallery";
                note.images.forEach(function (image, index) {
                    const wrap = document.createElement("div");
                    wrap.className = "note-gallery-item " + (image.style || "rounded");
                    const img = document.createElement("img");
                    img.src = image.src;
                    img.alt = "";
                    img.loading = "lazy";
                    wrap.onclick = function () { openViewer(note.images.map(function (i) { return i.src; }), index); };
                    wrap.appendChild(img);
                    gallery.appendChild(wrap);
                });
                card.appendChild(gallery);
            }

            const actions = document.createElement("div");
            actions.className = "note-actions";
            const edit = document.createElement("button");
            edit.type = "button";
            edit.className = "ghost-btn small";
            edit.dataset.action = "editNote";
            edit.dataset.id = note.id;
            edit.textContent = t("notes.edit");
            const del = document.createElement("button");
            del.type = "button";
            del.className = "danger-btn small";
            del.dataset.action = "deleteNote";
            del.dataset.id = note.id;
            del.textContent = t("notes.delete");
            actions.append(edit, del);
            card.appendChild(actions);

            list.appendChild(card);
        });
    }

    function editNote(id) {
        const note = notes.find(function (n) { return n.id === id; });
        if (!note) return;
        editingNoteId = id;
        $("noteEditorTitle").textContent = t("notes.editTitle");
        $("noteTitle").value = note.title || "";
        $("noteDate").value = note.date || getTodayDate();
        $("noteText").value = note.text || "";
        noteImages = (note.images || []).map(function (i) { return { src: i.src, style: i.style || "rounded" }; });
        renderNoteImagePreview();
        show($("noteEditor"));
        $("noteEditor").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function deleteNote(id) {
        if (!confirm(t("notes.confirmDelete"))) return;
        notes = notes.filter(function (n) { return n.id !== id; });
        saveNotesToStorage();
        renderNotes();
    }


    /* =================================================
       12. MESSAGES  (Supabase)
    ================================================= */

    let messagePoll = null;
    let messagesReq = 0, lastMessagesSig = "";

    let voiceRecorder = null;
let voiceChunks = [];
let voiceRecordingStartedAt = null;
let voiceRecordingStoppedAt = null;
let voiceRecordingTimer = null;


/* =========================================
   VOICE MESSAGE RECORDING
========================================= */

async function toggleVoiceRecording() {

    const button = $("voiceRecordButton");
    const status = $("voiceRecordingStatus");

    if (!button || !status) return;

    if (voiceRecorder && voiceRecorder.state === "recording") {
        stopVoiceRecording();
        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        alert(t("msg.login"));
        return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
        alert("Voice recording is not supported by this browser.");
        return;
    }

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        let mimeType = "";

        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
            mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
            mimeType = "audio/webm";
        }

        voiceRecorder = mimeType
            ? new MediaRecorder(stream, { mimeType: mimeType })
            : new MediaRecorder(stream);

        voiceChunks = [];

        voiceRecorder.ondataavailable = function (event) {

            if (event.data && event.data.size > 0) {
                voiceChunks.push(event.data);
            }

        };

        voiceRecorder.onstop = async function () {

            voiceRecordingStoppedAt = Date.now();

            stream.getTracks().forEach(function (track) {
                track.stop();
            });

            clearInterval(voiceRecordingTimer);

            button.classList.remove("recording");
            button.innerHTML = window.MIC_SVG || "🎤";

            status.classList.add("hidden");

            await uploadVoiceMessage();

        };

        voiceRecorder.start();

        voiceRecordingStartedAt = Date.now();

        button.classList.add("recording");
        button.innerHTML = window.STOP_SVG || "⏹";

        status.classList.remove("hidden");
        status.textContent = "Recording... 0:00";

        voiceRecordingTimer = setInterval(function () {

            const elapsed = Math.floor(
                (Date.now() - voiceRecordingStartedAt) / 1000
            );

            const minutes = Math.floor(elapsed / 60);
            const seconds = String(elapsed % 60).padStart(2, "0");

            status.textContent =
                "Recording... " + minutes + ":" + seconds;

        }, 1000);

    } catch (error) {

        console.error("Microphone error:", error);

        alert(
            "Microphone access was denied or could not be started."
        );
    }
}


function stopVoiceRecording() {

    if (
        voiceRecorder &&
        voiceRecorder.state === "recording"
    ) {

        voiceRecorder.stop();
    }
}


/* =========================================
   UPLOAD VOICE MESSAGE
========================================= */

async function uploadVoiceMessage() {

    if (!voiceChunks.length) return;

    const user = await getCurrentUser();

    if (!user) return;

    const recordedType = ((voiceRecorder && voiceRecorder.mimeType) || "audio/webm").split(";")[0] || "audio/webm";
    const voiceExt = /mp4|aac|m4a/.test(recordedType) ? "m4a" : /ogg/.test(recordedType) ? "ogg" : "webm";

    const audioBlob = new Blob(
        voiceChunks,
        { type: recordedType }
    );

    const duration = Math.max(
        1,
        Math.floor(
            ((voiceRecordingStoppedAt || Date.now()) - voiceRecordingStartedAt) / 1000
        )
    );

    const filePath =
        user.id +
        "/" +
        Date.now() +
        "." + voiceExt;


    /* Upload audio to Supabase Storage */

    const uploadResult =
        await owSupabase()
            .storage
            .from("voice-messages")
            .upload(
                filePath,
                audioBlob,
                {
                    contentType: recordedType,
                    upsert: false
                }
            );


    if (uploadResult.error) {

        console.error(
            "Voice upload error:",
            uploadResult.error
        );

        alert("Could not upload the voice message.");
        return;
    }


    /* Save message information in database */

    const sender =
        cfg.name ||
        (
            user.email
                ? user.email.split("@")[0]
                : "User"
        );


    const result = await owSupabase()
    .from("messages")
    .insert([{
        sender: sender,
        message: "",
        message_type: "voice",
        audio_url: filePath,
        audio_duration: duration
    }]);


    if (result.error) {

        console.error(
            "Voice message database error:",
            result.error
        );

        alert("Could not save the voice message.");
        return;
    }


    voiceChunks = [];

    await loadMessages(true);
}

    function startMessagePolling() {
        stopMessagePolling();
        messagePoll = setInterval(function () { if (!document.hidden) loadMessages(false); }, 8000);
    }
    function stopMessagePolling() { clearInterval(messagePoll); messagePoll = null; }

   let selectedMessageImage = null;


/* =========================================
   SELECT MESSAGE IMAGE
========================================= */

let imageMessageInput = null;

function wireMessageImageInput() {

    imageMessageInput = $("imageMessageInput");

    if (!imageMessageInput) return;

    imageMessageInput.addEventListener("change", function () {

        const file = this.files && this.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            alert("Please choose an image.");

            this.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {

            alert("Image must be smaller than 10 MB.");

            this.value = "";
            return;
        }

        selectedMessageImage = file;

        const preview = $("imageMessagePreview");

        if (preview) {

            preview.innerHTML = "";

            const image = document.createElement("img");

            image.src = URL.createObjectURL(file);
            image.alt = "Selected image";

            preview.appendChild(image);
            preview.classList.remove("hidden");
        }
    });
}


/* =========================================
   SEND TEXT OR IMAGE MESSAGE
========================================= */

let sendingMessage = false;

async function sendMessage() {

    if (sendingMessage) return;

    sendingMessage = true;

    try { await sendMessageInner(); }

    finally { sendingMessage = false; }
}

async function sendMessageInner() {

    const input = $("messageInput");

    const message = input.value.trim();

    if (!message && !selectedMessageImage) return;

    const user = await getCurrentUser();

    if (!user) {

        alert(t("login.first"));
        return;
    }

    const sender =
        cfg.name ||
        (user.email
            ? user.email.split("@")[0]
            : "User");


    /* =====================================
       SEND IMAGE
    ===================================== */

    if (selectedMessageImage) {

        const file = selectedMessageImage;

        const extension =
            file.name.split(".").pop().toLowerCase();

        const filePath =
            user.id +
            "/" +
            Date.now() +
            "-" +
            Math.random().toString(36).substring(2) +
            "." +
            extension;


        const uploadResult =
            await owSupabase()
                .storage
                .from("message-images")
                .upload(
                    filePath,
                    file,
                    {
                        contentType: file.type,
                        upsert: false
                    }
                );


        if (uploadResult.error) {

            console.error(
                "Image upload error:",
                uploadResult.error
            );

            alert("Could not upload the image.");

            return;
        }


        const result =
            await owSupabase()
                .from("messages")
                .insert([{

                    sender: sender,

                    message: message,

                    message_type: "image",

                    image_url: filePath

                }]);


        if (result.error) {

            console.error(
                "Image message error:",
                result.error
            );

            alert("Could not save the image message.");

            return;
        }


        selectedMessageImage = null;

        if (imageMessageInput) {
            imageMessageInput.value = "";
        }

        const preview = $("imageMessagePreview");

        if (preview) {

            preview.innerHTML = "";

            preview.classList.add("hidden");
        }

        input.value = "";

        await loadMessages(true);

        return;
    }


    /* =====================================
       SEND TEXT
    ===================================== */

    const result =
        await owSupabase()
            .from("messages")
            .insert([{

                sender: sender,

                message: message,

                message_type: "text"

            }]);


    if (result.error) {

        console.error(result.error);

        alert(t("msg.fail"));

        return;
    }


    input.value = "";

    await loadMessages(true);
}

    /* ---------- delete-message popup ---------- */
    function askDeleteMessage() {
        return new Promise(function (resolve) {
            const ov = document.createElement("div");
            ov.className = "delete-message-overlay";
            ov.innerHTML = '<div class="delete-message-modal" role="dialog" aria-modal="true">' +
                '<div class="clear-notifications-emoji">🗑️</div>' +
                '<div class="delete-message-text"></div>' +
                '<div class="delete-message-buttons">' +
                '<button type="button" class="delete-confirm-button"></button>' +
                '<button type="button" class="delete-cancel-button"></button></div></div>';
            ov.querySelector(".delete-message-text").textContent = t("msg.del.q");
            ov.querySelector(".delete-confirm-button").textContent = t("msg.del.yes");
            ov.querySelector(".delete-cancel-button").textContent = t("msg.del.no");
            let done = false;
            function close(v) {
                if (done) return;
                done = true;
                document.removeEventListener("keydown", onKey);
                ov.classList.add("closing");
                setTimeout(function () { ov.remove(); }, 180);
                resolve(v);
            }
            function onKey(e) { if (e.key === "Escape") close(false); }
            ov.querySelector(".delete-confirm-button").onclick = function () { close(true); };
            ov.querySelector(".delete-cancel-button").onclick = function () { close(false); };
            ov.addEventListener("click", function (e) { if (e.target === ov) close(false); });
            document.addEventListener("keydown", onKey);
            document.body.appendChild(ov);
        });
    }

    /* ---------- message reactions (table: message_reactions) ---------- */
    const REACTION_EMOJIS = ["❤️", "😂", "😭", "😮", "👍", "🔥", "🥹", "😡"];
    let reactState = {}, reactPicker = null;

    async function fetchReactions() {
        try {
            const r = await owSupabase().from("message_reactions").select("message_id, user_id, emoji");
            if (r.error) { console.warn("Reactions table not ready:", r.error.message); return {}; }
            const map = {};
            (r.data || []).forEach(function (x) { (map[String(x.message_id)] = map[String(x.message_id)] || []).push(x); });
            return map;
        } catch (e) { return {}; }
    }

    function closeReactPicker() { if (reactPicker) { reactPicker.remove(); reactPicker = null; } }
    document.addEventListener("click", closeReactPicker);

    function openReactPicker(anchor, item) {
        closeReactPicker();
        const box = document.createElement("div");
        box.className = "react-picker";
        REACTION_EMOJIS.forEach(function (em) {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = em;
            b.onclick = function (e) { e.stopPropagation(); closeReactPicker(); setReaction(item, em); };
            box.appendChild(b);
        });
        anchor.parentNode.appendChild(box);
        const listEl = $("messagesList");
        if (listEl && anchor.getBoundingClientRect().top - listEl.getBoundingClientRect().top < 80) box.classList.add("down");
        reactPicker = box;
    }

    async function setReaction(item, emoji) {
        const user = currentUser || await getCurrentUser();
        if (!user || item.id === undefined) return;
        const key = String(item.id);
        const mine = (reactState[key] || []).filter(function (x) { return x.user_id === user.id; })[0];
        let res;
        if (mine && mine.emoji === emoji) {
            res = await owSupabase().from("message_reactions").delete().eq("message_id", key).eq("user_id", user.id);
        } else {
            res = await owSupabase().from("message_reactions").upsert({ message_id: key, user_id: user.id, emoji: emoji }, { onConflict: "message_id,user_id" });
        }
        if (res.error) { console.error(res.error); toast(t("msg.react.fail")); return; }
        loadMessages(false);
    }

    function renderReactionPills(item, list, myId) {
        const wrap = document.createElement("span");
        wrap.className = "msg-reacts";
        const groups = {};
        list.forEach(function (x) {
            const g = groups[x.emoji] = groups[x.emoji] || { n: 0, mine: false };
            g.n++;
            if (x.user_id === myId) g.mine = true;
        });
        Object.keys(groups).forEach(function (em) {
            const p = document.createElement("button");
            p.type = "button";
            p.className = "react-pill" + (groups[em].mine ? " mine" : "");
            p.textContent = em + (groups[em].n > 1 ? " " + groups[em].n : "");
            p.onclick = function (e) { e.stopPropagation(); setReaction(item, em); };
            wrap.appendChild(p);
        });
        return wrap;
    }

    async function loadMessages(scrollDown) {
        const reqId = ++messagesReq;
        const list = $("messagesList");
        if (!list || !owSupabase()) return;

        const user = currentUser || await getCurrentUser();
        if (!user) { list.innerHTML = '<div class="empty-state"></div>'; list.firstChild.textContent = t("msg.login"); return; }

        const result = await owSupabase().from("messages").select("*").order("created_at", { ascending: true });
        if (result.error) {
            console.error(result.error);
            list.innerHTML = '<div class="empty-state"></div>';
            list.firstChild.textContent = t("msg.error");
            return;
        }

        const data = result.data || [];
        const reactMap = await fetchReactions();
        reactState = reactMap;
        if (window.noticeMessages) window.noticeMessages(data, cfg.name || (user.email ? user.email.split("@")[0] : ""));

        // an older request that finished after a newer one must not overwrite it
        if (reqId !== messagesReq) return;
        // nothing changed since the last refresh: keep the list as it is (voice messages keep playing)
        const sig = JSON.stringify([cfg.name || (user.email ? user.email.split("@")[0] : ""), cfg.language,
            data.map(function (m) { return [m.id, m.message, m.message_type, m.audio_url, m.image_url]; }), reactMap]);
        if (!scrollDown && sig === lastMessagesSig && list.childElementCount) return;
        lastMessagesSig = sig;
        const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
        list.innerHTML = "";

        if (!data.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = t("msg.empty");
            list.appendChild(empty);
            return;
        }

        const myName = cfg.name || (user.email ? user.email.split("@")[0] : "");
        data.forEach(async function (item) {
            const bubble = document.createElement("div");
            bubble.className = "message" + (item.sender === myName ? " mine" : "");
            const sender = document.createElement("div");
            sender.className = "message-sender";
            sender.textContent = item.sender || "User";
            if (item.message_type === "voice" && item.audio_url) {

    const voiceContainer = document.createElement("div");
    voiceContainer.className = "voice-message";

    const playButton = document.createElement("button");
    playButton.type = "button";
    playButton.className = "voice-play-button";
    playButton.textContent = "▶";

    const audio = document.createElement("audio");
    audio.preload = "metadata";

    const duration = document.createElement("span");
    duration.className = "voice-duration";

    const seconds = Number(item.audio_duration || 0);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, "0");

    duration.textContent = `${minutes}:${remainingSeconds}`;

    playButton.addEventListener("click", async function () {

        if (!audio.src) {

            const { data, error } = await owSupabase()
                .storage
                .from("voice-messages")
                .createSignedUrl(item.audio_url, 3600);

            if (error) {
                console.error("Audio URL error:", error);
                alert("Could not load the voice message.");
                return;
            }

            audio.src = data.signedUrl;
        }

        if (audio.paused) {
            document.querySelectorAll(".voice-message audio").forEach(function (other) { if (other !== audio) other.pause(); });
            try {
                await audio.play();
                playButton.textContent = "⏸";
            } catch (e) {
                console.error("Voice playback error:", e);
                playButton.textContent = "▶";
                alert("Could not play the voice message.");
            }
        } else {
            audio.pause();
        }
    });

    audio.addEventListener("ended", function () {
        playButton.textContent = "▶";
    });
    audio.addEventListener("pause", function () {
        playButton.textContent = "▶";
    });

    voiceContainer.appendChild(playButton);
    const wave = document.createElement("div"); wave.className = "voice-wave";
    let seed = 7; String(item.audio_url || "").split("").forEach(function (c) { seed = (seed * 31 + c.charCodeAt(0)) % 9973; });
    for (let i = 0; i < 28; i++) { seed = (seed * 7919 + 13) % 9973; const bar = document.createElement("i"); bar.style.height = (18 + seed % 82) + "%"; wave.appendChild(bar); }
    audio.addEventListener("timeupdate", function () { const p = audio.duration ? audio.currentTime / audio.duration : 0; wave.querySelectorAll("i").forEach(function (b, i) { b.classList.toggle("on", i / 28 < p); }); });
    voiceContainer.appendChild(wave);
    voiceContainer.appendChild(duration);
    voiceContainer.appendChild(audio);

    bubble.append(sender, voiceContainer);

}  
   else if (item.message_type === "image" && item.image_url) {

    const content = document.createElement("div");
    content.className = "message-content";

    if (item.message) {

        const text = document.createElement("div");
        text.className = "message-text";
        text.textContent = item.message;

        content.appendChild(text);
    }

    const image = document.createElement("img");
    image.className = "message-image";
    image.alt = "Image message";
    image.loading = "lazy";

    content.appendChild(image);

    bubble.append(sender, content);

    owSupabase().storage.from("message-images").createSignedUrl(item.image_url, 3600).then(function (imageResult) {
        if (!imageResult.error && imageResult.data) {
            image.src = imageResult.data.signedUrl;
            image.addEventListener("click", function () { window.open(imageResult.data.signedUrl, "_blank"); });
        }
    });

} else {

    const text = document.createElement("div");
    text.className = "message-text";
    text.textContent = item.message || "";

    bubble.append(sender, text);
}
            if (item.created_at) {
                const time = document.createElement("div");
                time.className = "message-time";
                time.textContent = new Date(item.created_at).toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" });
                bubble.appendChild(time);
            }
            if (item.id !== undefined) {
                const foot = document.createElement("div");
                foot.className = "msg-foot";
                const add = document.createElement("button");
                add.type = "button";
                add.className = "msg-react";
                add.textContent = "☺";
                add.setAttribute("aria-label", "React");
                add.onclick = function (e) { e.stopPropagation(); openReactPicker(add, item); };
                foot.append(renderReactionPills(item, reactMap[String(item.id)] || [], user.id), add);
                bubble.appendChild(foot);
            }
            if (item.sender === myName && item.id !== undefined) {
                const del = document.createElement("button"); del.type = "button"; del.className = "msg-del"; del.textContent = "🗑️";
                del.onclick = async function () {
                    if (!(await askDeleteMessage())) return;
                    const r = await owSupabase().from("messages").delete().eq("id", item.id);
                    if (r.error) { console.error(r.error); alert("Could not delete (check Supabase delete policy)."); return; }
                    owSupabase().from("message_reactions").delete().eq("message_id", String(item.id)).then(function () {}, function () {});
                    loadMessages(false);
                };
                bubble.appendChild(del);
            }
            list.appendChild(bubble);
        });
        if (scrollDown || nearBottom) list.scrollTop = list.scrollHeight;
    }


    /* =================================================
       13. QUIZ
    ================================================= */

    let currentQuestion = 0, quizAnswers = [], quizScore = 0, quizLevel = 0;
    const TOTAL_LEVELS = 10;

    // level 0 = the original quiz; levels 1..9 come from quiz-levels.js
    function levelQuestions(level) {
        if (level === 0) return quizLevel1;
        const L = window.QUIZ_LEVELS && window.QUIZ_LEVELS[level];
        if (!L || !L.length) return quizLevel1;
        return L.map(function (q) { return { question: q[0], options: q[1], answers: q[2] }; });
    }
    function optionsForCurrent() {
        if (quizLevel === 0) return QUIZ_OPTIONS[currentQuestion] || [];
        const q = quizQuestions[currentQuestion];
        return (q && q.options) || [];
    }

    function normalizeQuizAnswer(answer) {
        return typeof answer === "string"
            ? answer.toLowerCase().trim().replace(/[\u064B-\u065F\u0640]/g, "").replace(/['\u2019`]/g, "").replace(/[.,!?;:\u060C\u061F\u061B]/g, " ").replace(/\s+/g, " ").trim()
            : "";
    }

    // loose = true  ->  also accept a longer answer that CONTAINS an accepted answer as whole word(s)
    function isQuizAnswerCorrect(userAnswer, accepted, loose) {
        const value = normalizeQuizAnswer(userAnswer);
        if (!value || !accepted) return false;
        return accepted.some(function (a) {
            const n = normalizeQuizAnswer(a);
            if (!n) return false;
            if (n === value) return true;
            return !!loose && (" " + value + " ").indexOf(" " + n + " ") !== -1;
        });
    }

    const QUIZ_OPTIONS = [
        ["Green", "Pink", "Blue", "Black"],
        ["Mobile Legends", "PUBG", "Minecraft", "Genshin Impact"],
        ["Intelligence", "Honesty", "People who don't judge", "Humor"],
        ["Pizza", "Rfissa", "Burger", "Sushi"],
        ["Darvan", "Traveling", "Sleeping", "Shopping"],
        ["Lying", "Waiting", "Loud noise", "Rain"],
        ["Germany", "Japan", "Paris", "Canada"],
        ["Playing games", "Talking to Darvan", "Reading", "Drawing"],
        ["Dark water", "Losing Darvan", "Heights", "Spiders"]
    ];
    function shuffled(list) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    function renderQuizOptions() {
        const box = $("quizOptions"), single = $("answerInput");
        if (!box) return;
        box.innerHTML = "";
        hide(single);
        const other = document.createElement("button");
        const mark = function (btn) { box.querySelectorAll(".quiz-opt").forEach(function (b) { b.classList.remove("sel"); }); if (btn) btn.classList.add("sel"); };
        shuffled(optionsForCurrent()).forEach(function (o) {
            const b = document.createElement("button"); b.type = "button"; b.className = "quiz-opt"; b.textContent = o;
            b.onclick = function () { mark(b); single.value = o; hide(single); };
            box.appendChild(b);
        });
        other.type = "button"; other.className = "quiz-opt other"; other.textContent = t("quiz.other");
        other.onclick = function () { mark(other); single.value = ""; show(single); single.focus(); };
        box.appendChild(other);
    }

    function startQuiz(level) {
        quizLevel = typeof level === "number" ? clamp(level, 0, TOTAL_LEVELS - 1) : 0;
        quizQuestions = levelQuestions(quizLevel);
        currentQuestion = 0;
        quizAnswers = [];
        quizScore = 0;
        show($("quizContainer"));
        hide($("quizFinished"));
        showQuestion();
    }

    function updateQuestionLabels() {
        $("questionNumber").textContent = t("quiz.level") + " " + (quizLevel + 1) + " · " + t("quiz.q") + " " + (currentQuestion + 1) + " / " + quizQuestions.length;
        $("quizBar").style.width = (currentQuestion / quizQuestions.length * 100) + "%";
    }

    function showQuestion() {
        if ($("quizOptions")) $("quizOptions").innerHTML = "";
        const question = quizQuestions[currentQuestion];
        if (!question) return;
        $("questionText").textContent = question.question;
        updateQuestionLabels();

        const single = $("answerInput"), multi = $("answerInputsContainer"), more = $("addMoreAnswer");
        const isLast = currentQuestion === quizQuestions.length - 1;

        if (isLast) {
            hide(single);
            single.value = "";
            show(multi);
            multi.innerHTML = "";
            addAnswerField(t("quiz.ph"));
            show(more);
        } else {
            hide(multi);
            multi.innerHTML = "";
            hide(more);
            show(single);
            single.value = "";
            renderQuizOptions();
        }
    }

    function addAnswerField(placeholder) {
        const wrap = document.createElement("div");
        wrap.className = "answer-input-wrapper";
        const input = document.createElement("input");
        input.type = "text";
        input.className = "quiz-answer";
        input.placeholder = placeholder;
        input.autocomplete = "off";
        const reaction = document.createElement("div");
        reaction.className = "answer-reaction";
        input.addEventListener("input", function () { reaction.textContent = lastQuestionReaction(input.value); });
        wrap.append(input, reaction);
        $("answerInputsContainer").appendChild(wrap);
        return input;
    }

    function addMoreAnswer() {
        if (currentQuestion !== quizQuestions.length - 1) return;
        addAnswerField(t("quiz.ph2")).focus();
    }

    function lastQuestionReaction(raw) {
        const answer = raw.trim().toLowerCase();
        if (!answer) return "";
        const bad = ["the way you complain", "your boobs", "your ass", "your body", "your english"];
        const good = ["personality", "music taste", "you cant hide your feelings", "you can't hide your feelings", "beautiful", "cute", "smart", "the way you laugh", "your eyes", "special", "your hair", "love", "care", "kind", "sweet", "smile", "voice", "forever", "always", "أحبك", "احبك", "شخصية", "جميلة", "مميزة"];
        if (bad.some(function (w) { return answer.includes(w); })) return t("quiz.r.bad");
        if (good.some(function (w) { return answer.includes(w); })) return t("quiz.r.good");
        return t("quiz.r.meh");
    }

    function nextQuestion() {
        const question = quizQuestions[currentQuestion];
        if (!question) return;

        if (currentQuestion === quizQuestions.length - 1) {
            const answers = Array.from(document.querySelectorAll(".quiz-answer"))
                .map(function (i) { return i.value.trim(); }).filter(Boolean);
            if (!answers.length) { alert(t("quiz.need")); return; }
            quizAnswers.push(answers.join(" | "));
            if (answers.some(function (a) { return isQuizAnswerCorrect(a, question.answers, quizLevel > 0); })) quizScore++;
            finishQuiz();
            return;
        }

        const value = $("answerInput").value.trim();
        if (!value) { alert(t("quiz.need")); return; }
        quizAnswers.push(value);
        if (isQuizAnswerCorrect(value, question.answers)) quizScore++;
        currentQuestion++;
        showQuestion();
    }

    function finishQuiz() {
        store.set(KEY.quiz, JSON.stringify(quizAnswers));
        const total = quizQuestions.length;
        const percentage = Math.round(quizScore / total * 100);
        hide($("quizContainer"));
        show($("quizFinished"));
        $("quizResult").textContent = t("quiz.result").replace("{n}", quizScore).replace("{total}", total).replace("{p}", percentage);
        const level = percentage < 20 ? 0 : percentage < 50 ? 1 : percentage < 70 ? 2 : percentage < 80 ? 3 : percentage < 100 ? 4 : 5;
        $("quizMessage").textContent = t("quiz.m" + level);
        const nextData = window.QUIZ_LEVELS && window.QUIZ_LEVELS[quizLevel + 1];
        const hasNext = quizLevel < TOTAL_LEVELS - 1 && !!(nextData && nextData.length);
        if ($("quizLevelDone")) $("quizLevelDone").textContent = hasNext ? t("quiz.level.done").replace("{l}", quizLevel + 1) : t("quiz.all.done");
        const nb = $("nextLevelButton");
        if (nb) nb.classList.toggle("hidden", !hasNext);
    }


    /* =================================================
       14. ALBUMS
    ================================================= */

    function renderAlbumCards() {
        const grid = $("albumGrid");
        if (!grid) return;
        grid.innerHTML = "";
        Object.keys(ALBUMS).forEach(function (name) {
            const album = ALBUMS[name];
            const card = document.createElement("button");
            card.type = "button";
            card.className = "album-card" + (album.password ? " locked" : "");
            card.dataset.action = "openAlbum";
            card.dataset.name = name;

            const cover = document.createElement("div");
            cover.className = "album-cover";
            const img = document.createElement("img");
            img.src = album.cover;
            img.alt = "";
            img.loading = "lazy";
            cover.appendChild(img);
            if (album.password) {
                const lock = document.createElement("span");
                lock.className = "album-lock";
                lock.textContent = "🔒";
                cover.appendChild(lock);
            }

            const info = document.createElement("div");
            info.className = "album-info";
            const h = document.createElement("b");
            h.textContent = t("alb." + name);
            const p = document.createElement("small");
            p.textContent = t("alb." + name + ".d");
            info.append(h, p);

            card.append(cover, info);
            grid.appendChild(card);
        });
    }

    function openAlbum(name) {
        const album = ALBUMS[name];
        if (!album) return;
        if (!album.password) { navigate("albumPhotos", name); return; }
        openPasswordModal({
            icon: "🔐",
            title: t("pw.album.title"),
            hint: t("pw.album.hint").replace("{name}", t("alb." + name).replace(/\s*[^\p{L}\p{N}\s]+\s*$/u, "")),
            expected: album.password,
            onSuccess: function () { navigate("albumPhotos", name); }
        });
    }

    let currentAlbumName = "";
    const GALLERY_IDS = { elegant: "elegantGallery", polaroid: "polaroidGallery", masonry: "masonryGallery", featured: "featuredGallery", fullscreen: "fullscreenGallery" };
    let featuredPhotos = [], featuredIndex = 0, fullscreenPhotos = [], fullscreenIndex = 0;

    function clearAlbum() {
        ["elegantGallery", "polaroidGallery", "masonryGallery", "featuredThumbnails"].forEach(function (id) { if ($(id)) $(id).innerHTML = ""; });
        ["featuredMainImage", "fullscreenImage"].forEach(function (id) { if ($(id)) $(id).removeAttribute("src"); });
        Object.keys(GALLERY_IDS).forEach(function (k) { hide($(GALLERY_IDS[k])); });
        featuredPhotos = []; fullscreenPhotos = [];
    }

    function showAlbum(name) {
        const album = ALBUMS[name];
        if (!album) { goHome(); return; }
        currentAlbumName = name;
        clearAlbum();
        $("openedAlbumTitle").textContent = t("alb." + name + ".t");
        const photos = album.photos;

        if (album.design === "elegant") {
            const box = $("elegantGallery");
            photos.forEach(function (src, i) {
                const img = document.createElement("img");
                img.src = src; img.alt = ""; img.loading = "lazy";
                img.onclick = function () { openViewer(photos, i); };
                box.appendChild(img);
            });
            show(box);
        } else if (album.design === "polaroid") {
            const box = $("polaroidGallery");
            photos.forEach(function (src, i) {
                const card = document.createElement("figure");
                card.className = "polaroid-card";
                const img = document.createElement("img");
                img.src = src; img.alt = ""; img.loading = "lazy";
                const cap = document.createElement("figcaption");
                cap.textContent = "💕 " + (i + 1) + " 💕";
                card.append(img, cap);
                card.onclick = function () { openViewer(photos, i); };
                box.appendChild(card);
            });
            show(box);
        } else if (album.design === "masonry") {
            const box = $("masonryGallery");
            photos.forEach(function (src, i) {
                const item = document.createElement("div");
                item.className = "masonry-item";
                const img = document.createElement("img");
                img.src = src; img.alt = ""; img.loading = "lazy";
                item.appendChild(img);
                item.onclick = function () { openViewer(photos, i); };
                box.appendChild(item);
            });
            show(box);
        } else if (album.design === "featured") {
            featuredPhotos = photos; featuredIndex = 0;
            show($("featuredGallery"));
            updateFeatured();
        } else if (album.design === "fullscreen") {
            fullscreenPhotos = photos; fullscreenIndex = 0;
            show($("fullscreenGallery"));
            updateFullscreen();
        }
        window.scrollTo(0, 0);
    }

    function updateFeatured() {
        if (!featuredPhotos.length) return;
        $("featuredMainImage").src = featuredPhotos[featuredIndex];
        $("featuredCounter").textContent = (featuredIndex + 1) + " / " + featuredPhotos.length;
        const thumbs = $("featuredThumbnails");
        thumbs.innerHTML = "";
        featuredPhotos.forEach(function (src, i) {
            const img = document.createElement("img");
            img.src = src; img.alt = "";
            if (i === featuredIndex) img.classList.add("active");
            img.onclick = function () { featuredIndex = i; updateFeatured(); };
            thumbs.appendChild(img);
        });
        const active = thumbs.querySelector(".active");
        if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "center" });
    }
    function stepFeatured(d) {
        if (!featuredPhotos.length) return;
        featuredIndex = (featuredIndex + d + featuredPhotos.length) % featuredPhotos.length;
        updateFeatured();
    }

    function updateFullscreen() {
        if (!fullscreenPhotos.length) return;
        $("fullscreenImage").src = fullscreenPhotos[fullscreenIndex];
        $("fullscreenCounter").textContent = (fullscreenIndex + 1) + " / " + fullscreenPhotos.length;
    }
    function stepFullscreen(d) {
        if (!fullscreenPhotos.length) return;
        fullscreenIndex = (fullscreenIndex + d + fullscreenPhotos.length) % fullscreenPhotos.length;
        updateFullscreen();
    }

    /* ---------- Downloads ---------- */

    function saveBlob(blob, name) {
        const u = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = u; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 5000);
    }
    function fileNameOf(src) {
        let n = String(src).split("?")[0].split("/").pop() || "photo.jpeg";
        try { n = decodeURIComponent(n); } catch (e) { /* keep */ }
        return n;
    }
    async function downloadFile(url, name) {
        try {
            const r = await fetch(url);
            if (!r.ok) throw new Error("HTTP " + r.status);
            saveBlob(await r.blob(), name || fileNameOf(url));
        } catch (e) {
            const a = document.createElement("a");
            a.href = url; a.download = name || fileNameOf(url);
            document.body.appendChild(a); a.click(); a.remove();
        }
    }
    function loadJsZip() {
        return new Promise(function (resolve, reject) {
            if (window.JSZip) { resolve(window.JSZip); return; }
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
            s.onload = function () { if (window.JSZip) resolve(window.JSZip); else reject(new Error("zip missing")); };
            s.onerror = function () { reject(new Error("zip load failed")); };
            document.head.appendChild(s);
        });
    }
    async function downloadAlbum() {
        const album = ALBUMS[currentAlbumName];
        if (!album) return;
        toast(t("alb.dl.busy"));
        try {
            const JSZip = await loadJsZip();
            const zip = new JSZip();
            for (const src of album.photos) {
                const r = await fetch(src);
                if (!r.ok) throw new Error("HTTP " + r.status);
                zip.file(fileNameOf(src), await r.blob());
            }
            saveBlob(await zip.generateAsync({ type: "blob" }), "our-world-" + currentAlbumName + ".zip");
        } catch (e) {
            console.warn("Zip failed, downloading one by one:", e);
            for (const src of album.photos) {
                await downloadFile(src, fileNameOf(src));
                await new Promise(function (r) { setTimeout(r, 450); });
            }
        }
        toast(t("alb.dl.done"));
    }

    /* ---------- Large image viewer ---------- */

    let viewerList = [], viewerIndex = 0;

    function openViewer(list, index) {
        viewerList = list; viewerIndex = index;
        updateViewer();
        const v = $("imageViewer");
        v.classList.add("active");
        v.setAttribute("aria-hidden", "false");
        pushOverlay("viewer", closeViewerUI);
    }
    function updateViewer() {
        $("imageViewerImage").src = viewerList[viewerIndex];
        const multi = viewerList.length > 1;
        document.querySelectorAll(".viewer-arrow").forEach(function (b) { b.classList.toggle("hidden", !multi); });
    }
    function stepViewer(d) {
        if (viewerList.length < 2) return;
        viewerIndex = (viewerIndex + d + viewerList.length) % viewerList.length;
        updateViewer();
    }
    function closeViewerUI() {
        const v = $("imageViewer");
        v.classList.remove("active");
        v.setAttribute("aria-hidden", "true");
        $("imageViewerImage").removeAttribute("src");
    }


    /* =================================================
       15. FALLING EMOJIS (private section)
    ================================================= */

    const fallingEmojis = ["❄️", "☃️", "⛄", "🌨️", "🩵", "🤍", "✨", "🧣", "🧤", "💙", "💗", "☁️", "⭐", "💞", "🩷"];
    let emojiRainInterval = null;

    function startEmojiRain() {
        const box = $("emojiRain");
        if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        stopEmojiRain();
        emojiRainInterval = setInterval(function () {
            const el = document.createElement("span");
            el.className = "falling-emoji";
            el.textContent = fallingEmojis[Math.floor(Math.random() * fallingEmojis.length)];
            el.style.left = Math.random() * 100 + "%";
            el.style.fontSize = (40 + Math.random() * 40) + "px";
            const duration = 5 + Math.random() * 5;
            el.style.animationDuration = duration + "s";
            box.appendChild(el);
            setTimeout(function () { el.remove(); }, duration * 1000);
        }, 450);
    }

    function stopEmojiRain() {
        clearInterval(emojiRainInterval);
        emojiRainInterval = null;
        const box = $("emojiRain");
        if (box) box.innerHTML = "";
    }


    /* =================================================
       16. EVENTS
    ================================================= */

    const actions = {
        back: goBack,
        open: function (el) { navigate(el.dataset.view); },
        openMedia: function (el) { navigate("mediaSection", el.dataset.type); },
        askPermission: askPermission,
        openAlbum: function (el) { openAlbum(el.dataset.name); },

        openSettings: openSettings,
        closeSettings: function () { dismissOverlay("settings"); },
        closePassword: function () { dismissOverlay("password"); },
        submitPassword: submitPassword,
        togglePw: togglePw,
        logout: logout,

        sendFriendRequest: sendFriendRequest,
        acceptFriend: function () { answerFriendRequest("accepted"); },
        declineFriend: function () { answerFriendRequest("rejected"); },
        messageFromSettings: function () { closeOverlayThenNavigate("settings"); navigate("messagesSection"); },
        testNotification: testNotification,
        removeBackgroundImage: removeBackgroundImage,
        resetAppearance: resetAppearance,
        clearSavedData: clearSavedData,
        resetWebsite: resetWebsite,
        pickMusicFile: function () { $("musicFile").click(); },
        removeSong: function (el) { removeUserTrack(el.dataset.key); },
        musicPrev: function () { stepTrack(-1); },
        musicSkip: function () { stepTrack(1); },

        newNote: openNewNote,
        closeNoteEditor: closeNoteEditor,
        pickNoteImages: function () { $("noteImages").click(); },
        saveNote: saveNote,
        editNote: function (el) { editNote(el.dataset.id); },
        deleteNote: function (el) { deleteNote(el.dataset.id); },

        sendMessage: sendMessage,
        toggleVoiceRecording: toggleVoiceRecording,
        startQuiz: startQuiz,
        retryLevel: function () { startQuiz(quizLevel); },
        nextLevel: function () { startQuiz(quizLevel + 1); },
        nextQuestion: nextQuestion,
        addMoreAnswer: addMoreAnswer,

        featuredPrev: function () { stepFeatured(-1); },
        featuredNext: function () { stepFeatured(1); },
        fsPrev: function () { stepFullscreen(-1); },
        fsNext: function () { stepFullscreen(1); },
        closeViewer: function () { dismissOverlay("viewer"); },
        viewerPrev: function () { stepViewer(-1); },
        viewerNext: function () { stepViewer(1); },
        downloadAlbum: downloadAlbum,
        downloadViewer: function () { const s = viewerList[viewerIndex]; if (s) downloadFile(s); },
        downloadFeatured: function () { const s = featuredPhotos[featuredIndex]; if (s) downloadFile(s); },
        downloadFullscreen: function () { const s = fullscreenPhotos[fullscreenIndex]; if (s) downloadFile(s); }
    };

    document.addEventListener("click", function (e) {
        const actionEl = e.target.closest("[data-action]");
        if (actionEl) {
            const fn = actions[actionEl.dataset.action];
            if (fn) fn(actionEl, e);
            return;
        }
        const settingEl = e.target.closest("[data-setting]");
        if (settingEl) handleSettingButton(settingEl);
    });

    // Tap the dark area around a big photo to close it.
    function wireViewerBackdrop() {
        const viewer = $("imageViewer");
        if (!viewer) return;
        viewer.addEventListener("click", function (e) {
            if (e.target === e.currentTarget) dismissOverlay("viewer");
        });
    }

    document.addEventListener("keydown", function (e) {
        const target = e.target;

        if (e.key === "Enter") {
            if (target.id === "pwInput") { e.preventDefault(); submitPassword(); return; }
            if (target.id === "messageInput" && !e.shiftKey) { e.preventDefault(); sendMessage(); return; }
            if (target.id === "answerInput" || (target.classList && target.classList.contains("quiz-answer"))) { e.preventDefault(); nextQuestion(); return; }
        }

        if (e.key === "Escape" && overlays.length) { e.preventDefault(); dismissOverlay(overlays[overlays.length - 1].id); return; }

        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;

        if (overlays.some(function (o) { return o.id === "viewer"; })) { stepViewer(dir); return; }
        if (currentView().id === "albumPhotos") {
            if (fullscreenPhotos.length) stepFullscreen(dir);
            else if (featuredPhotos.length) stepFeatured(dir);
        }
    });

    function wireLoginForm() {
        const form = $("loginForm");
        if (form) form.addEventListener("submit", login);
    }


    /* =================================================
       17. START
    ================================================= */

    onReady(function () {
        wireMusic();
        wireMessageImageInput();
        wireViewerBackdrop();
        wireLoginForm();
        loadSettings();
        loadNotes();
        initSettingsControls();
        addSwipe($("featuredGallery"), function () { stepFeatured(1); }, function () { stepFeatured(-1); });
        addSwipe($("fullscreenGallery"), function () { stepFullscreen(1); }, function () { stepFullscreen(-1); });
        addSwipe($("imageViewer"), function () { stepViewer(1); }, function () { stepViewer(-1); });

        applySettings();
        applyLanguage();
        renderMusicOptions();
        applyMusicTrack();
        loadUserMusic().then(function () { renderMusicOptions(); applyMusicTrack(); });
        renderAlbumCards();
        renderFriendUI();
        history.replaceState({ nav: 1 }, "");
        restoreSession();
    });

})();
/* ================================
   NOTIFICATIONS PANEL
================================ */

(function wireNotificationsPanel() {
    function wire() {
        const notificationsButton = document.getElementById("notificationsButton");
        const notificationsPanel = document.getElementById("notificationsPanel");
        const closeNotifications = document.getElementById("closeNotifications");
        const clearNotificationsButton = document.getElementById("clearNotificationsButton");
        const clearNotificationsModal = document.getElementById("clearNotificationsModal");
        const confirmClearNotifications = document.getElementById("confirmClearNotifications");
        const cancelClearNotifications = document.getElementById("cancelClearNotifications");

        if (clearNotificationsButton && clearNotificationsModal) {
            clearNotificationsButton.addEventListener("click", function () {
                clearNotificationsModal.classList.remove("hidden");
            });
        }
        if (cancelClearNotifications && clearNotificationsModal) {
            cancelClearNotifications.addEventListener("click", function () {
                clearNotificationsModal.classList.add("hidden");
            });
        }
        if (confirmClearNotifications && clearNotificationsModal) {
            confirmClearNotifications.addEventListener("click", clearAllNotifications);
        }
        if (notificationsButton && notificationsPanel) {
            notificationsButton.addEventListener("click", function () {
                notificationsPanel.classList.toggle("hidden");
            });
        }
        if (closeNotifications && notificationsPanel) {
            closeNotifications.addEventListener("click", function () {
                notificationsPanel.classList.add("hidden");
            });
        }
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
    else wire();
})();

async function clearAllNotifications() {
    try { localStorage.removeItem("ourWorldNotices"); } catch (e) {}

    try {
        const user = await getCurrentUser();
        if (user && owSupabase()) {
            const { error } = await owSupabase()
                .from("notifications")
                .delete()
                .eq("user_id", user.id);
            if (error) console.error("Error clearing notifications:", error);
        }
    } catch (e) {
        console.error("Error clearing notifications:", e);
    }

    const modal = document.getElementById("clearNotificationsModal");
    if (modal) modal.classList.add("hidden");
    await loadNotifications();
}

/* ================================
   LOAD NOTIFICATIONS
   (extras.js replaces this with the full version; this one is the safe fallback)
================================ */

async function getCurrentUser() {
    if (!owSupabase()) return null;

    const result = await owSupabase().auth.getUser();

    if (result.error || !result.data || !result.data.user) return null;

    return result.data.user;
}

async function loadNotifications() {
    const list = document.getElementById("notificationsList");
    const badge = document.getElementById("notificationBadge");
    if (!list) return;

    let data = [];
    try {
        const user = await getCurrentUser();
        if (!user) return;
        const result = await owSupabase()
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
        if (result.error) { console.error("Error loading notifications:", result.error); return; }
        data = result.data || [];
    } catch (e) {
        console.error("Error loading notifications:", e);
        return;
    }

    list.innerHTML = "";

    if (!data.length) {
        const empty = document.createElement("p");
        empty.className = "notifications-empty";
        empty.textContent = "No notifications yet 💗";
        list.appendChild(empty);
        if (badge) badge.classList.add("hidden");
        return;
    }

    const unread = data.filter(function (item) { return !item.is_read; }).length;
    if (badge) {
        badge.textContent = unread > 99 ? "99+" : unread;
        badge.classList.toggle("hidden", unread === 0);
    }

    data.forEach(function (item) {
        const box = document.createElement("div");
        box.className = "notification-item" + (item.is_read ? "" : " unread");
        const title = document.createElement("div");
        title.className = "notification-title";
        title.textContent = item.title || "";
        const message = document.createElement("div");
        message.className = "notification-message";
        message.textContent = item.message || "";
        box.append(title, message);
        list.appendChild(box);
    });
}
