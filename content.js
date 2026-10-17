// Netnet Meme Maker content: captions, AI scene ideas, stickers.
// Captions are meme jokes and community talking points. No price targets, no financial advice.
window.NN_DUNLAP = "a confident middle-aged businessman with slick combed-back black hair, sharp dark charcoal suit, crisp white shirt, black tie, serious smug expression, clean-shaven";

window.NN_CAPTIONS = [
  ["P2E WAS THE WARM-UP", "RW-PLAY IS THE NEXT META"],
  ["@NETNETCAP COINED #RWPLAY", "EVERYONE ELSE WILL COPY IT"],
  ["EVERYONE CHASING THE CURRENT META", "DUNLAP: ALREADY LOOKING AT RW-PLAY"],
  ["DUNLAP, YEARS AGO: RW-PLAY IS THE FUTURE", "EVERYONE: LOL"],
  ["CT FINALLY DISCOVERS RW-PLAY", "DUNLAP: WELCOME. I'VE BEEN WAITING."],
  ["GAMERS: GAMES ARE A WASTE OF TIME", "RW-PLAY: HOLD MY $NVD"],
  ["THE MARKET: PLAYING CHECKERS", "DUNLAP: PLAYING RW-PLAY 3D CHESS"],
  ["CT: NETNET BONDS ARE INFLATIONARY", "DUNLAP: WE FILL THE BOND DESKS WITH NET BOUGHT AT MARKET"],
  ["MINTING NEW NET FOR BONDS?", "NO. BOUGHT AT MARKET. NOT MINTED."],
  ["REAL WORLD BONDS", "NO LONGER INFLATIONARY"],
  ["BEARS DON'T UNDERSTAND INVERSE BONDS", "DUNLAP: THAT'S THE POINT"],
  ["YOU: SELLING AT BACKING", "US: MORE SUPPLY TO BURN"],
  ["HE SOLD AT BACKING", "AND HELPED US BURN $NET"],
  ["TO EVERYONE WHO SOLD AT BACKING", "THANK YOU FOR YOUR SERVICE"],
  ["ME AT 3AM READING ABOUT $NET BACKING", "DUNLAP: YEAH, IT'S REAL"],
  ["THEY SAID IT'S JUST ANOTHER TOKEN", "DUNLAP: READ THE BACKING"],
  ["JUST DISCOVERED NETNET?", "DUNLAP: COME IN. TAKE A SEAT."],
  ["NEW HOLDER JOINS NETNET", "DUNLAP: YOU'RE FAMILY NOW"],
  ["SOLD YOUR $NET BAG FOR A QUICK FLIP?", "NGMI"],
  ["PANIC SOLD $NET", "PAPER HANDS APPLICATION: DENIED"],
  ["\"I'LL BUY $NET NEXT WEEK\"", "DUNLAP: THAT'S WHAT THEY ALL SAY"],
  ["STILL WAITING FOR THE PERFECT ENTRY?", "DUNLAP: I'M ALREADY IN"],
  ["HOW MUCH $NET IS ENOUGH?", "MORE THAN YOU HAVE"],
  ["ME LOOKING AT YOUR $NET BAG", "THAT'S IT?"],
  ["BEARS: WE'LL SHAKE OUT THE $NET HOLDERS", "DUNLAP: CHECKMATE"],
  ["BEARS TRYING TO PULL $NET DOWN", "DUNLAP: ONE HAND IS ENOUGH"],
  ["MARKET IS RED", "$NET HOLDERS: WE'VE SEEN WORSE"],
  ["FUD. BEARS. RUG PULLS.", "THE ROCK OF THE NETNET ECOSYSTEM"],
  ["SCAMMERS ONLY TARGET PROJECTS WORTH TARGETING", "THEY KNOW SOMETHING"],
  ["WITH A SNAP OF MY FINGERS", "NETNET LAUNCHES A NEW PRODUCT"],
  ["I DON'T ALWAYS BUY THE DIP", "BUT WHEN I DO, IT'S $NET"],
  ["COOL GUYS DON'T LOOK AT EXPLOSIONS", "THEY JUST HOLD $NET"],
  ["READ BEAR NEWS", "LAUGH. HOLD."],
  ["NOT FINANCIAL ADVICE", "JUST FINANCIAL CONVICTION"],
  ["OTHER PROJECTS: HYPE", "NETNET: BACKING"],
  ["ME BEFORE NETNET", "ME AFTER NETNET"],
  ["NOBODY:", "DUNLAP: ADDING MORE $NET"],
  ["THE BEAR: WAITING FOR $NET TO CRACK", "THE ROCK: DOESN'T CRACK"],
  ["WHY DO SCAMMERS NEVER TRY THE OTHER PROJECTS?", "NOTHING THERE WORTH STEALING"],
  ["BLUE PILL: KEEP CHASING HYPE", "GOLD COIN: JOIN NETNET"]
];

window.NN_SCENES = [
  "Dunlap calmly playing chess against a sweating grizzly bear in a candle-lit library",
  "Dunlap stepping off a private jet onto a red carpet at golden hour",
  "Dunlap closing a giant golden bank vault door while a crowd runs too late",
  "Dunlap at the head of a black marble boardroom table in a skyscraper penthouse at night",
  "Dunlap sipping espresso on a superyacht while a bear in a life jacket waves from a tiny rowboat",
  "Dunlap as a medieval king on a golden throne, bears kneeling",
  "Dunlap golfing on the moon with Earth in the background",
  "Dunlap riding a golden bull through Wall Street",
  "Dunlap as a video game boss in a neon arcade, holding a controller",
  "Dunlap calmly reading a newspaper while a storm rages around him on a rock in the ocean",
  "Dunlap in a tuxedo at a casino table pushing all his gold chips in",
  "Dunlap as a Roman emperor giving a thumbs down at the colosseum",
  "Dunlap teaching a classroom of bears, pointing at a blank chalkboard",
  "Dunlap as a samurai in a dark suit standing in a bamboo forest",
  "Dunlap looking through a telescope from a mountain top at a futuristic gaming city"
];

(function(){
  const g = (id, a='#f5d77a', b='#d4af37', c='#8a6d1c') => `<defs><radialGradient id="${id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient></defs>`;
  const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  const S = {};
  S.coin = svg(240,240, g('a')+`<circle cx="120" cy="120" r="114" fill="#6b5313"/><circle cx="120" cy="120" r="108" fill="url(#a)"/><circle cx="120" cy="120" r="88" fill="none" stroke="#7a5f17" stroke-width="5"/><text x="120" y="152" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="96" fill="#2a1f05">N</text><text x="120" y="200" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="22" fill="#2a1f05">$NET</text>`);
  S.coinBlack = svg(240,240, g('b')+`<circle cx="120" cy="120" r="112" fill="url(#b)"/><circle cx="120" cy="120" r="96" fill="#0b0b0b"/><text x="120" y="150" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="92" fill="#d4af37">N</text><text x="120" y="196" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="20" fill="#d4af37">NETNET</text>`);
  S.badge = svg(520,150, g('c')+`<rect x="4" y="4" width="512" height="142" rx="24" fill="#0b0b0b" stroke="url(#c)" stroke-width="8"/><circle cx="78" cy="75" r="50" fill="url(#c)"/><text x="78" y="98" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="62" fill="#111">N</text><text x="150" y="78" font-family="Georgia,serif" font-weight="900" font-size="52" fill="#d4af37" letter-spacing="3">NETNET</text><text x="152" y="118" font-family="Arial,sans-serif" font-weight="700" font-size="26" fill="#f2e6c0" letter-spacing="9">CAPITAL</text>`);
  const stamp = (txt, col, w=440) => svg(w,150,`<g transform="rotate(-8 ${w/2} 75)"><rect x="14" y="20" width="${w-28}" height="110" rx="14" fill="none" stroke="${col}" stroke-width="10"/><text x="${w/2}" y="102" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="74" fill="${col}" letter-spacing="4">${txt}</text></g>`);
  S.bullish = stamp('BULLISH','#2ecc71');
  S.ngmi = stamp('NGMI','#e74c3c',360);
  S.approved = stamp('APPROVED','#d4af37',480);
  S.denied = stamp('DENIED','#e74c3c',400);
  S.rwplay = svg(420,140, g('d','#fff1b8','#d4af37','#7a5f17')+`<rect x="4" y="4" width="412" height="132" rx="66" fill="url(#d)"/><rect x="14" y="14" width="392" height="112" rx="56" fill="#0b0b0b"/><text x="210" y="96" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="66" fill="#d4af37" letter-spacing="3">#RWPLAY</text>`);
  S.backed = svg(300,300, g('e')+`<path d="M150 10 L270 55 L262 170 Q250 245 150 290 Q50 245 38 170 L30 55 Z" fill="url(#e)" stroke="#5a4510" stroke-width="6"/><text x="150" y="150" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="58" fill="#111">BACKED</text><text x="150" y="200" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="34" fill="#111">$NET</text>`);
  S.burn = svg(360,140, `<rect x="4" y="4" width="352" height="132" rx="20" fill="#1a0800" stroke="#ff7a00" stroke-width="7"/><text x="180" y="96" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="66" fill="#ff9a1f">🔥 BURNED</text>`);
  S.crown = svg(300,200, g('f')+`<path d="M20 180 L40 50 L105 120 L150 20 L195 120 L260 50 L280 180 Z" fill="url(#f)" stroke="#6b5313" stroke-width="6" stroke-linejoin="round"/><circle cx="150" cy="135" r="16" fill="#c0392b"/><circle cx="85" cy="150" r="11" fill="#2980b9"/><circle cx="215" cy="150" r="11" fill="#27ae60"/>`);
  let px=''; const P=['0000000000000000000000','1111111111111111111111','0111111110011111111100','0112211110011221111100','0122111100001221111000','0011111000000111110000'];
  P.forEach((r,y)=>[...r].forEach((v,x)=>{ if(v!=='0') px+=`<rect x="${x*20}" y="${y*20}" width="20" height="20" fill="${v==='1'?'#000':'#fff'}"/>`;}));
  S.shades = svg(440,120, px);
  window.NN_STICKERS = [
    {k:'coin',label:'$NET coin',svg:S.coin,w:180},
    {k:'coinBlack',label:'Netnet coin (black)',svg:S.coinBlack,w:180},
    {k:'badge',label:'Netnet Capital badge',svg:S.badge,w:320},
    {k:'rwplay',label:'#RWPLAY',svg:S.rwplay,w:280},
    {k:'backed',label:'Backed',svg:S.backed,w:180},
    {k:'bullish',label:'Bullish stamp',svg:S.bullish,w:300},
    {k:'ngmi',label:'NGMI stamp',svg:S.ngmi,w:260},
    {k:'approved',label:'Approved',svg:S.approved,w:300},
    {k:'denied',label:'Denied',svg:S.denied,w:280},
    {k:'burn',label:'Burned',svg:S.burn,w:260},
    {k:'crown',label:'Crown',svg:S.crown,w:200},
    {k:'shades',label:'Deal with it',svg:S.shades,w:260}
  ];
  window.NN_EMOJI = ['🚀','🔥','💎','🐻','🐂','👑','🎮','🥃','💼','🤝','🧠','🗿','😎','🏦','⚡'];
})();
