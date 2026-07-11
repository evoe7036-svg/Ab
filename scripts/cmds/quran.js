const axios = require("axios");

const surahMap = {
    1: ["Fatiha", "ফাতিহা"], 2: ["Baqarah", "বাকারাহ"], 3: ["Imran", "ইমরান"], 4: ["Nisa", "নিসা"], 5: ["Maidah", "মায়েদাহ"],
    6: ["Anam", "আনআম"], 7: ["Araf", "আরাফ"], 8: ["Anfal", "আনফাল"], 9: ["Taubah", "তাওবাহ"], 10: ["Yunus", "ইউনুস"],
    11: ["Hud", "হুদ"], 12: ["Yusuf", "ইউসুফ"], 13: ["Raad", "রাদ"], 14: ["Ibrahim", "ইব্রাহিম"], 15: ["Hijr", "হিজর"],
    16: ["Nahl", "নাহল"], 17: ["Isra", "ইসরা"], 18: ["Kahf", "কাহফ"], 19: ["Maryam", "মারইয়াম"], 20: ["Taha", "ত্বা-হা"],
    21: ["Anbiya", "আম্বিয়া"], 22: ["Hajj", "হজ"], 23: ["Muminoon", "মুমিনুন"], 24: ["Nur", "নূর"], 25: ["Furqan", "ফুরকান"],
    26: ["Shuara", "শুআরা"], 27: ["Naml", "নামল"], 28: ["Qasas", "কাসাস"], 29: ["Ankubut", "আনকাবুত"], 30: ["Rum", "রূম"],
    31: ["Luqman", "লোকমান"], 32: ["Sajda", "সাজদা"], 33: ["Ahzab", "আহজাব"], 34: ["Saba", "সাবা"], 35: ["Fatir", "ফাতির"],
    36: ["Yasin", "ইয়াসিন"], 37: ["Saffat", "সাফফাত"], 38: ["Sad", "সা’দ"], 39: ["Zumar", "যুমার"], 40: ["Ghafir", "গাফির"],
    41: ["Fussilat", "ফুসসিলাত"], 42: ["Shura", "শূরা"], 43: ["Zukhruf", "যুখরুফ"], 44: ["Dukhan", "দুখান"], 45: ["Jasiyah", "জাসিয়া"],
    46: ["Ahqaf", "আহকাফ"], 47: ["Muhammad", "মুহাম্মাদ"], 48: ["Fath", "ফাতহ"], 49: ["Hujurat", "হুজুরাত"], 50: ["Qaf", "ক্বাফ"],
    51: ["Dhariyat", "যারিয়াত"], 52: ["Tur", "ত্বূর"], 53: ["Najm", "নাজম"], 54: ["Qamar", "কামার"], 55: ["Rahman", "রহমান"],
    56: ["Waqiah", "ওয়াকিয়া"], 57: ["Hadid", "হাদীদ"], 58: ["Mujadilah", "মুজাদিলা"], 59: ["Hashr", "হাশর"], 60: ["Mumtahanah", "মুমতাহিনা"],
    61: ["Saff", "সাফ"], 62: ["Jumuah", "জুমু’আ"], 63: ["Munafiqun", "মুনাফিকুন"], 64: ["Taghabun", "তাগাবুন"], 65: ["Talaq", "তালাক"],
    66: ["Tahrim", "তাহরীম"], 67: ["Mulk", "মুলক"], 68: ["Qalam", "কলম"], 69: ["Haqqah", "হাক্বক্বাহ"], 70: ["Ma'arij", "মাআরিজ"],
    71: ["Nuh", "নূহ"], 72: ["Jinn", "জ্বিন"], 73: ["Muzzammil", "মুযাম্মিল"], 74: ["Muddaththir", "মুদ্দাসসির"], 75: ["Qiyamah", "কিয়ামাহ"],
    76: ["Insan", "ইনসান"], 77: ["Mursalat", "মুরসালাত"], 78: ["Naba", "নাবা’"], 79: ["Naziyat", "নাযিয়াত"], 80: ["Abasa", "আবাসা"],
    81: ["Takwir", "তাকভির"], 82: ["Infitar", "ইনফিতার"], 83: ["Mutaffifin", "মুতাফফিফিন"], 84: ["Inshiqaq", "ইনশিক্বাক"], 85: ["Buruj", "বুরুজ"],
    86: ["Tariq", "তারিক"], 87: ["Ala", "আ'লা"], 88: ["Ghashiyah", "গাশিয়াহ"], 89: ["Fajr", "ফজর"], 90: ["Balad", "বালাদ"],
    91: ["Shams", "শামস"], 92: ["Layl", "লাইল"], 93: ["Duha", "দুহা"], 94: ["Sharh", "ইনশিরাহ"], 95: ["Tin", "তীন"],
    96: ["Alaq", "আলাক"], 97: ["Qadr", "কদর"], 98: ["Bayyinah", "বাইয়্যিনাহ"], 99: ["Zilzal", "যিলযাল"], 100: ["Adiyat", "আদিয়াত"],
    101: ["Qariah", "কারিয়াহ"], 102: ["Takathur", "তাকাসুর"], 103: ["Asr", "আসর"], 104: ["Humazah", "হুমাযাহ"], 105: ["Fil", "ফীল"],
    106: ["Quraish", "কুরাইশ"], 107: ["Maun", "মাউন"], 108: ["Kawthar", "কাওসার"], 109: ["Kafirun", "কাফিরুন"], 110: ["Nasr", "নাসর"],
    111: ["Masad", "লাহাব"], 112: ["Ikhlas", "ইখলাস"], 113: ["Falaq", "ফালাক"], 114: ["Nas", "নাস"]
};

// ড্রাইভ আইডিগুলো এখানে যোগ করুন
const driveAudioIds = {
    1: "1QVxonQa7JBcBbuQQHWySwsp4wJpvDonG",
    3: "1QgawsTyDvdrrcDbtD57X13CKCIievFAD",
    112: "1hz3dKc3gyRSHkTz78VnEr-wkM7vCOTW2",
    114: "1rsm7ZmOnqSlUDHhZtFSBL6LM9uREnIdv"
};

function getSurahNumber(input) {
    input = input.toLowerCase();
    if (!isNaN(input)) return parseInt(input);
    for (const [num, names] of Object.entries(surahMap)) {
        if (names.some(n => n.toLowerCase() === input)) return parseInt(num);
    }
    return null;
}

module.exports = {
    config: {
        name: "quran",
        version: "3.5",
        author: "MR_FARHAN",
        role: 0,
        shortDescription: "📖 কুরআন পড়ুন ও শুনুন",
        category: "islam",
        guide: {
            en: "/quran list\n/quran [নাম|নম্বর]\n/quran [নাম|নম্বর] audio"
        }
    },

    onStart: async function ({ api, args, message, event }) {
        if (!args[0]) {
            return message.reply("🕌 উদাহরণ:\n/quran list\n/quran ফাতিহা\n/quran 112\n/quran 1 audio");
        }

        const input = args[0].toLowerCase();
        const type = args[1]?.toLowerCase();

        if (input === "list") {
            let listText = "📖 ১১৪ সূরার তালিকা:\n\n";
            for (let i = 1; i <= 114; i++) {
                if (surahMap[i]) {
                    listText += `${i}. ${surahMap[i][1]} (${surahMap[i][0]})\n`;
                }
            }
            return message.reply(listText);
        }

        const surahNum = getSurahNumber(input);
        if (!surahNum || surahNum < 1 || surahNum > 114) {
            return message.reply("❌ সঠিক সূরার নাম বা নম্বর দিন (১-১১৪)।");
        }

        const surahName = surahMap[surahNum][1];

        if (type === "audio") {
            const fileId = driveAudioIds[surahNum];
            if (!fileId) return message.reply(`❌ সূরা "${surahName}" এর অডিও এখনো সার্ভারে যুক্ত করা হয়নি।`);

            const audioUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
            
            try {
                // অডিও পাঠানোর জন্য স্ট্রিম ব্যবহার (বট অনুযায়ী এটি পরিবর্তন হতে পারে)
                const stream = (await axios.get(audioUrl, { responseType: "stream" })).data;
                return message.reply({
                    body: `🔊 সূরা ${surahName} (অডিও)`,
                    attachment: stream
                });
            } catch (err) {
                return message.reply("❌ অডিও ফাইলটি পাঠাতে সমস্যা হচ্ছে।");
            }
        } else {
            return message.reply(`📖 সূরা ${surahName} (নম্বর: ${surahNum})\n\nঅডিও শুনতে লিখুন: /quran ${surahNum} audio`);
        }
    }
};
