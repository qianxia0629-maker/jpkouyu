/* Original Japanese excerpts: Aozora Bunko. Chinese renderings and reading aids are editorial additions.
 * Texts and source links checked 2026-09-15. Keep the catalog order stable for deterministic daily rotation. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.JpDailyQuotes = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const quotes = [
  {
    "id": "literature-01",
    "author": "宮沢賢治",
    "work": "銀河鉄道の夜",
    "source": "https://www.aozora.gr.jp/cards/000081/files/456_15050.html",
    "text": "僕たちしっかりやろうねえ。",
    "reading": "ぼくたち しっかり やろうねえ。",
    "translation": "我们一起好好努力吧。",
    "context": "乔万尼和朋友谈论幸福后，感到新的力量涌上心头。",
    "prompt": "试着用「一緒に〜ましょう」邀请朋友一起做一件事。"
  },
  {
    "id": "literature-02",
    "author": "夏目漱石",
    "work": "草枕",
    "source": "https://www.aozora.gr.jp/cards/000148/files/776_14941.html",
    "text": "智に働けば角が立つ。情に棹させば流される。",
    "reading": "ちに はたらけば かどが たつ。じょうに さおさせば ながされる。",
    "translation": "只凭理智容易生出棱角，任凭感情又容易随波逐流。",
    "context": "小说开篇，画家登山时思考人与世间的关系。",
    "prompt": "说说最近一件让你难以拿捏分寸的小事。"
  },
  {
    "id": "literature-03",
    "author": "太宰治",
    "work": "走れメロス",
    "source": "https://www.aozora.gr.jp/cards/000035/files/1567_14913.html",
    "text": "私は約束を守ります。",
    "reading": "わたしは やくそくを まもります。",
    "translation": "我会遵守约定。",
    "context": "梅洛斯请求暂缓处刑，承诺回来履行约定。",
    "prompt": "用「〜を守ります」说一项你会遵守的约定。"
  },
  {
    "id": "literature-04",
    "author": "宮沢賢治",
    "work": "銀河鉄道の夜",
    "source": "https://www.aozora.gr.jp/cards/000081/files/456_15050.html",
    "text": "けれどもほんとうのさいわいは一体何だろう。",
    "reading": "けれども ほんとうの さいわいは いったい なんだろう。",
    "translation": "可是，真正的幸福究竟是什么呢？",
    "context": "这是乔万尼向同行的朋友提出的问题。",
    "prompt": "用「私にとって、幸せは〜です」说说你的理解。"
  },
  {
    "id": "literature-05",
    "author": "夏目漱石",
    "work": "草枕",
    "source": "https://www.aozora.gr.jp/cards/000148/files/776_14941.html",
    "text": "とかくに人の世は住みにくい。",
    "reading": "とかくに ひとの よは すみにくい。",
    "translation": "总之，生活在人世间并不容易。",
    "context": "开篇对理智、感情和执拗的思索之后，叙述者发出感叹。",
    "prompt": "用「〜にくい」说一件你觉得不太容易的事情。"
  },
  {
    "id": "literature-06",
    "author": "太宰治",
    "work": "走れメロス",
    "source": "https://www.aozora.gr.jp/cards/000035/files/1567_14913.html",
    "text": "歩ける。行こう。",
    "reading": "あるける。いこう。",
    "translation": "还能走。出发吧。",
    "context": "筋疲力尽的梅洛斯喝到泉水后，重新振作起来。",
    "prompt": "用「もう一度〜てみます」说一件想再试一次的事。"
  },
  {
    "id": "literature-07",
    "author": "宮沢賢治",
    "work": "銀河鉄道の夜",
    "source": "https://www.aozora.gr.jp/cards/000081/files/456_15050.html",
    "text": "どこまでもどこまでも僕たち一緒に進んで行こう。",
    "reading": "どこまでも どこまでも ぼくたち いっしょに すすんで いこう。",
    "translation": "不论走到哪里，我们都一起向前吧。",
    "context": "乔万尼在旅途中向朋友表达一同前行的愿望。",
    "prompt": "用「〜ていこう」说一句给自己的鼓励。"
  },
  {
    "id": "literature-08",
    "author": "夏目漱石",
    "work": "草枕",
    "source": "https://www.aozora.gr.jp/cards/000148/files/776_14941.html",
    "text": "人の世を作ったものは神でもなければ鬼でもない。",
    "reading": "ひとの よを つくったものは かみでも なければ おにでも ない。",
    "translation": "创造人世的，既不是神，也不是鬼。",
    "context": "叙述者接着指出，人世是由身边普通的人构成的。",
    "prompt": "用「〜でもなければ、〜でもない」描述一样东西。"
  },
  {
    "id": "literature-09",
    "author": "太宰治",
    "work": "走れメロス",
    "source": "https://www.aozora.gr.jp/cards/000035/files/1567_14913.html",
    "text": "私は、信頼に報いなければならぬ。",
    "reading": "わたしは、しんらいに むくいなければ ならぬ。",
    "translation": "我必须回应这份信任。",
    "context": "重新上路前，梅洛斯想到仍在等待他的朋友。",
    "prompt": "把书面语「ならぬ」换成「ならない」，再造一个日常句子。"
  },
  {
    "id": "literature-10",
    "author": "宮沢賢治",
    "work": "銀河鉄道の夜",
    "source": "https://www.aozora.gr.jp/cards/000081/files/456_15050.html",
    "text": "僕たちと一緒に乗って行こう。",
    "reading": "ぼくたちと いっしょに のって いこう。",
    "translation": "和我们一起坐车走吧。",
    "context": "面临分别，乔万尼邀请其他孩子继续同行。",
    "prompt": "用「一緒に〜ませんか」邀请朋友出门。"
  },
  {
    "id": "literature-11",
    "author": "夏目漱石",
    "work": "草枕",
    "source": "https://www.aozora.gr.jp/cards/000148/files/776_14941.html",
    "text": "あらゆる芸術の士は人の世を長閑にし、人の心を豊かにするが故に尊とい。",
    "reading": "あらゆる げいじゅつの しは ひとの よを のどかにし、ひとの こころを ゆたかにするが ゆえに たっとい。",
    "translation": "艺术家之所以可贵，是因为他们让人世安宁，让人心丰盈。",
    "context": "画家思考诗人和画家能为生活带来什么。",
    "prompt": "用一句日语介绍最近喜欢的一本书或一首歌。"
  },
  {
    "id": "literature-12",
    "author": "太宰治",
    "work": "走れメロス",
    "source": "https://www.aozora.gr.jp/cards/000035/files/1567_14913.html",
    "text": "信実とは、決して空虚な妄想ではなかった。",
    "reading": "しんじつとは、けっして くうきょな もうそうでは なかった。",
    "translation": "真诚与信义，绝不是空洞的幻想。",
    "context": "故事结尾，国王见证两位朋友的信任后说出这句话。",
    "prompt": "用「信頼できる人は〜」描述一个值得信任的人。"
  },
  {
    "id": "literature-13",
    "author": "夏目漱石",
    "work": "草枕",
    "source": "https://www.aozora.gr.jp/cards/000148/files/776_14941.html",
    "text": "ただまのあたりに見れば、そこに詩も生き、歌も湧く。",
    "reading": "ただ まのあたりに みれば、そこに しも いき、うたも わく。",
    "translation": "只要用心看眼前，诗便有了生命，歌也自然涌出。",
    "context": "叙述者认为，感受美未必一定要把它写下来或画下来。",
    "prompt": "用日语描述此刻窗外的一处景色。"
  },
  {
    "id": "literature-14",
    "author": "太宰治",
    "work": "走れメロス",
    "source": "https://www.aozora.gr.jp/cards/000035/files/1567_14913.html",
    "text": "友と友の間の信実は、この世で一ばん誇るべき宝なのだからな。",
    "reading": "ともと ともの あいだの しんじつは、この よで いちばん ほこるべき たからなのだからな。",
    "translation": "朋友之间的真诚信义，是世上最值得珍视的宝物。",
    "context": "梅洛斯在疲惫和动摇中，仍记着朋友给予的信任。",
    "prompt": "用「〜てくれて、ありがとう」说一句感谢。"
  }
];
  const DAY = 86400000;
  const anchor = Date.UTC(2026, 8, 15) / DAY;
  function localDateKey(date = new Date()) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }
  function getForDate(date = new Date()) {
    // UTC is used only to count calendar days AFTER extracting the computer's LOCAL Y/M/D.
    // Dividing elapsed local milliseconds would fail across daylight-saving transitions.
    const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY;
    const index = ((day - anchor) % quotes.length + quotes.length) % quotes.length;
    return { dateKey: localDateKey(date), index, quote: quotes[index] };
  }
  function millisecondsToNextDay(date = new Date()) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    return Math.max(50, next.getTime() - date.getTime() + 50);
  }
  return { quotes, localDateKey, getForDate, millisecondsToNextDay };
});
