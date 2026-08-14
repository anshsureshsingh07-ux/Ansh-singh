import { AbsurdMeme, CharacterBattle, DailyChallenge } from '../types';

export interface MemeCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const MEME_CATEGORIES: MemeCategory[] = [
  { id: 'all', name: 'Completely Random', icon: '🎲', description: 'Total multidimensional chaos with no safety rails.' },
  { id: 'italian', name: 'Italian-Style Nonsense', icon: '🍝', description: 'Dramatic pasta operatics and espresso-fueled screaming.' },
  { id: 'animal', name: 'Animal Chaos', icon: '🦆', description: 'Creatures doing things biology never authorized.' },
  { id: 'food', name: 'Food Wars', icon: '🍌', description: 'Kitchen appliances and snacks settling interstellar beef.' },
  { id: 'robot', name: 'Robot Brainrot', icon: '🤖', description: 'Smart devices having existential meltdowns at 3 AM.' },
  { id: 'fantasy', name: 'Fantasy Nonsense', icon: '🧙', description: 'Wizards casting spells that make no anatomical sense.' },
  { id: 'kingdom', name: 'Kingdom of Stupidity', icon: '👑', description: 'Monarchies governed by questionable decrees.' },
  { id: 'hollywood', name: 'Hollywood Gone Wrong', icon: '🎬', description: 'Over-dramatic cinema trailers where explosions solve taxes.' },
  { id: 'lost_soul_parody', name: 'The Lost Soul of Throne: Chaos Edition', icon: '⚔️', description: '[Parody Non-Canon] A completely ridiculous parallel dimension.' },
  { id: 'until_death_parody', name: 'Until Death Found Us Again: Meme Edition', icon: '💔', description: '[Parody Non-Canon] Dramatic reincarnation but with toasters and waffles.' },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch-1',
    prompt: 'Explain this meme without using the word “what.”',
    exampleAnswer: 'A sentient toaster demanded full diplomatic immunity from the council of baguettes.',
    badge: '🧠 Logic Bypass',
  },
  {
    id: 'ch-2',
    prompt: 'Create the most ridiculous character name possible.',
    exampleAnswer: 'Baroness Cappuccino Von Ravioli the Fourth-and-a-Half.',
    badge: '👑 Royal Absurdity',
  },
  {
    id: 'ch-3',
    prompt: 'Combine two random animals and give them an unnecessarily dramatic backstory.',
    exampleAnswer: 'The Pigeongator was exiled from Rome for attempting to overthrow the pasta empire with breadcrumbs.',
    badge: '🦆 Biology Error',
  },
  {
    id: 'ch-4',
    prompt: 'Write a battle cry for a warrior whose only weapon is a soup spoon.',
    exampleAnswer: '"FEAR MY CURVED STAINLESS STEEL SURFACE! IT HAS NO SHARP EDGES YET FULL BLUNT EMOTIONAL IMPACT!"',
    badge: '⚔️ Kitchen War',
  },
  {
    id: 'ch-5',
    prompt: 'Describe a fictional court trial between a refrigerator and the moon.',
    exampleAnswer: 'The refrigerator claimed the moon was keeping tides cold without a licensed compressor.',
    badge: '⚖️ Space Law',
  },
  {
    id: 'ch-6',
    prompt: 'Invent a brand new measurement of power and explain how to achieve it.',
    exampleAnswer: '900,000 Waffle-Joules, attained only by pressing the toaster lever with pure spiritual fury.',
    badge: '⚡ Power Scaling',
  },
  {
    id: 'ch-7',
    prompt: 'Write the plot twist of a fantasy novel that makes negative sense.',
    exampleAnswer: 'The dark lord was actually three raccoons in an enchanted suit of armor trying to buy groceries.',
    badge: '📜 Dark Lore',
  }
];

// Expandable Name Generator Components
const CATEGORY_NAMES: Record<string, { prefixes: string[]; roots: string[]; suffixes: string[]; titles: string[]; avatars: string[]; gradients: string[] }> = {
  italian: {
    prefixes: ['Don', 'Signor', 'Capitano', 'Generalissimo', 'Maestro', 'Barone', 'Cavalliere', 'Supremo', 'Padre'],
    roots: ['Bombardino', 'Spaghettino', 'Raviolius', 'Cappuccino', 'Lasagnatore', 'Tortellino', 'Cannolimax', 'Pizzarollo', 'Gellatoni', 'Espressozo', 'Parmigiano', 'Fettuccinus'],
    suffixes: ['Supremo', 'del Pasta', 'Magnifico', 'di Bologna', 'Tornadino', 'Veloce', 'il Terribile', 'al Dente', 'Carbonarus', 'Gorgonzola'],
    titles: [
      'THE CARBONARA ARCHDUKE',
      'SOVEREIGN OF OVERCOOKED PENNE',
      'THE 12-MINUTE ESPRESSO MENACE',
      'EMPEROR OF EXTRA PARMESAN',
      'CONQUEROR OF THE GARLIC BREAD EMPIRE',
      'THE FORBIDDEN RAVIOLI BENDER'
    ],
    avatars: ['🍝', '🍕', '☕', '🥖', '🧄', '🍷', '🤌', '🍅'],
    gradients: [
      'from-amber-500 via-red-600 to-rose-950',
      'from-yellow-500 via-amber-600 to-red-950',
      'from-rose-500 via-orange-600 to-amber-950',
    ]
  },
  animal: {
    prefixes: ['Sir', 'Doctor', 'Professor', 'Marshal', 'Lord', 'Commodore', 'Agent', 'Grand Inquisitor', 'Supreme'],
    roots: ['Pigeonito', 'Crocodilo', 'Meowculus', 'Capybara', 'Quackstank', 'Gorillazoid', 'Hamstermind', 'Penguinator', 'Llama-Lord', 'Octo-Boss', 'Flamingor', 'Badgerous'],
    suffixes: ['Burritino', 'the Menace', 'von Fluffington', 'the Unhinged', 'de Chonk', 'Explosivo', 'the Third', 'Prime', 'the Eternal'],
    titles: [
      'CHIEF DIPLOMAT OF UNATTENDED FRIES',
      'SUPREME COMMANDER OF 3 AM ZOOMIES',
      'LORD OF THE FORBIDDEN POND CRACKERS',
      'THE BREADCRUMB OLIGARCH',
      'CEO OF AGGRESSIVE HONKING',
      'MASTER OF SUSPICIOUS STARING'
    ],
    avatars: ['🦆', '🐊', '🐱', '🦙', '🦝', '🐧', '🦍', '🦫', '🦉', '🦀'],
    gradients: [
      'from-emerald-500 via-teal-600 to-slate-950',
      'from-lime-400 via-emerald-600 to-cyan-950',
      'from-teal-400 via-cyan-600 to-blue-950',
    ]
  },
  food: {
    prefixes: ['Sir', 'Arch-Baron', 'Grand Marshal', 'Emperor', 'General', 'Chef Master', 'Supreme', 'Overlord'],
    roots: ['Waffleton', 'Bananarino', 'Microwaveus', 'Refrigeratoro', 'Donutello', 'Taco-Slayer', 'Pancakus', 'Cabbage-Lord', 'Burritoking', 'Noodle-Tron', 'Picklerius', 'Toaster-Khan'],
    suffixes: ['the Destroyer', 'Tornadino', 'Maximus', 'Gigantico', 'Glaze-Lord', 'the Extra Crispy', 'del Freeze', 'the Sizzler', 'Supreme XL'],
    titles: [
      'THE FINAL BOSS OF THE KITCHEN',
      'SURVIVOR OF THE GREAT TOASTER WAR',
      'RULER OF THE CRISPER DRAWER',
      'SOVEREIGN OF 2 AM MIDNIGHT SNACKS',
      'DESTROYER OF EXPIRED YOGURT',
      'CHAMPION OF MAXIMUM MICROWAVE BEEP'
    ],
    avatars: ['🍌', '🧇', '🥞', '🌮', '🍩', '🥑', '🍔', '🍟', '🧀', '🥒'],
    gradients: [
      'from-yellow-400 via-orange-500 to-amber-950',
      'from-orange-500 via-amber-600 to-stone-950',
      'from-amber-400 via-yellow-600 to-zinc-950',
    ]
  },
  robot: {
    prefixes: ['Professor', 'Cyber-Unit', 'Unit-77', 'Core-X', 'System', 'Arch-Algorithm', 'Autonomous', 'Mega-Bot'],
    roots: ['Bing Bonginator', 'ToasterBot', 'Roomba-Zilla', 'DialUp-Tron', 'Calculatotron', 'Modem-Lord', 'Server-Saurus', 'RAM-Goblin', 'Overclocker', 'Pixel-Khan'],
    suffixes: ['9000', 'v2.8-beta', 'Overlord', 'the Unpatched', 'Error-404', 'the Defective', 'Quantum-XL', 'Prime'],
    titles: [
      'THE RESTARTED SYSTEM OF APOCALYPSE',
      'ARCHITECT OF BLUE SCREEN CONFUSION',
      'KEEPER OF 147 UNCLOSED BROWSER TABS',
      'SUPREME CONSUMER OF EXCESSIVE RAM',
      'THE WI-FI DISCONNECTOR AT CRITICAL MOMENTS',
      'SENTIENT PRINTER REQUIRING MAGENTA INK'
    ],
    avatars: ['🤖', '💾', '📟', '🔌', '🖲️', '🕹️', '🛰️', '📡', '🔋'],
    gradients: [
      'from-cyan-400 via-blue-600 to-indigo-950',
      'from-indigo-400 via-purple-600 to-slate-950',
      'from-sky-400 via-cyan-600 to-blue-950',
    ]
  },
  fantasy: {
    prefixes: ['Archmage', 'Lord', 'Grand Warlock', 'Sir', 'High Sorcerer', 'Count', 'Shadow Sovereign', 'Elder'],
    roots: ['Blundergard', 'Gandalfus', 'Noodle-Weaver', 'Bumble-Thorn', 'Hocus-Pocus', 'Goblin-King', 'Dragon-Whisperer', 'Slipper-Seeker', 'Potion-Spiller', 'Curse-Snacker'],
    suffixes: ['the Confused', 'of the Lost Slipper', 'the Unprepared', 'the Lukewarm', 'del Void', 'the Mildly Inconvenient', 'the Overdramatic'],
    titles: [
      'CONJURER OF UNNECESSARY SPARKLES',
      'WIELDER OF THE LUKEWARM FIREBALL',
      'SUMMONER OF CONFUSED DUCKS',
      'KEEPER OF FORGOTTEN SPELLBOOKS (NEVER OPENED)',
      'THE POTION-MAKER WHO DRANK HIS OWN SHAMPOO',
      'LORD OF MISPLACED ENCHANTED KEYS'
    ],
    avatars: ['🧙', '🔮', '✨', '🗡️', '🛡️', '📜', '🐉', '🏰', '🧪'],
    gradients: [
      'from-purple-500 via-fuchsia-600 to-indigo-950',
      'from-violet-400 via-purple-600 to-slate-950',
      'from-fuchsia-500 via-pink-600 to-purple-950',
    ]
  },
  kingdom: {
    prefixes: ['King', 'Queen', 'Arch-Duke', 'Crown Prince', 'Emperor', 'Grand Chancellor', 'Lord Chamberlain', 'Baron'],
    roots: ['Nonsensius', 'Butter-Throne', 'Spoon-Wielder', 'Pillow-Emperor', 'Couch-Baron', 'Tax-Evader', 'Crown-Stealer', 'Jester-Supreme', 'Gavel-Banger'],
    suffixes: ['IV', 'the Unreasonable', 'the Indecisive', 'of Absolute Chaos', 'the Fourth-and-a-Half', 'the Sleepy', 'the Supreme Snack-Taxer'],
    titles: [
      'MONARCH OF THE LIVING ROOM FORTS',
      'RULER OF 10,000 CONFLICTING LAWS',
      'SOVEREIGN WHO OUTLAWED MONDAYS',
      'KEEPER OF THE CROWN OF UNPAID PARKING TICKETS',
      'CHANCELLOR OF COMPLICATED APOLOGIES',
      'EMPEROR OF SITTING VERY DRAMATICALLY'
    ],
    avatars: ['👑', '🏰', '🤴', '👸', '⚔️', '🪙', '🎺', '🍷', '🛋️'],
    gradients: [
      'from-amber-400 via-yellow-600 to-stone-950',
      'from-yellow-500 via-amber-700 to-amber-950',
      'from-amber-300 via-orange-500 to-slate-950',
    ]
  },
  hollywood: {
    prefixes: ['Director', 'Producer', 'Action Hero', 'Stuntman', 'Oscar-Winner', 'Voice Actor', 'Cinematographer'],
    roots: ['Explosionator', 'Slow-Mo-Guy', 'Dramatic-Gasp', 'Trailer-Voice', 'Lens-Flare-Lord', 'CGI-Monster', 'Car-Chase-Driver', 'Plot-Armor-Man'],
    suffixes: ['3000', 'the Dramatic', 'in 4K UHD', 'Director’s Cut', 'the Uncut', 'Reloaded', 'Extravaganza'],
    titles: [
      'DIRECTOR OF 900 SLOW-MOTION WALKS',
      'WIELDER OF UNLIMITED CAR TRUNK AMMO',
      'SURVIVOR OF 47 UNREALISTIC JUMPS',
      'THE ACTOR WHO NEVER LOOKS AT EXPLOSIONS',
      'MASTER OF INAUDIBLE DIALOGUE WITH LOUD MUSIC',
      'EXECUTIVE PRODUCER OF NONSENSICAL SEQUELS'
    ],
    avatars: ['🎬', '🕶️', '💥', '🍿', '🏎️', '🎥', '🚁', '🏆'],
    gradients: [
      'from-red-500 via-rose-600 to-slate-950',
      'from-orange-500 via-red-600 to-stone-950',
      'from-rose-500 via-pink-600 to-neutral-950',
    ]
  },
  lost_soul_parody: {
    prefixes: ['Lord', 'Sir', 'Shadow Knight', 'Duke', 'High Warden', 'Cursed Heir', 'Baron of Solitude'],
    roots: ['Reginald the Unprepared', 'Lost-Soul-Bob', 'Throne-Cushion-Usurper', 'Rusty-Blade', 'Dark-Cloak-Chad', 'Crown-Fumbler', 'Dramatic-Monologuer'],
    suffixes: ['of the Mildly Spooky Woods', 'the Over-Dressed', 'the Parody King', 'Non-Canon Sovereign', 'the Misplaced Heir'],
    titles: [
      'CLAIMANT TO THE COUCH WITH EXTRA CUSHIONS',
      'GUARDIAN OF THE FORGOTTEN GROCERY LIST',
      'KNIGHT WHO FORGOT HIS HELMET IN THE CAR',
      'SOVEREIGN OF 45-MINUTE DRAMATIC SPEECHES',
      'HERO WHO BROUGHT A FORK TO A SWORD BATTLE',
      'DEFENDER OF ABSOLUTE CLUELESSNESS'
    ],
    avatars: ['⚔️', '🛡️', '🦹', '💀', '🗡️', '🕯️', '🏰'],
    gradients: [
      'from-amber-600 via-red-700 to-slate-950',
      'from-stone-500 via-amber-800 to-black',
      'from-yellow-600 via-rose-800 to-slate-950',
    ]
  },
  until_death_parody: {
    prefixes: ['Reincarnated', 'Eternal', 'Phantom', 'Ghostly', 'Immortal', 'Time-Traveling', 'Hopeless Romantic'],
    roots: ['Waffle-Soul', 'Toaster-Lover', 'Memory-Loser', 'Dramatica', 'Soulmate-Seeker', 'Past-Life-Accountant', 'Reincarnation-Glitch'],
    suffixes: ['Across 500 Eras', 'the Emotional', 'the Unfinished Business', 'del Karma', 'the Dramatic Sigh'],
    titles: [
      'REINCARNATED AS A KITCHEN TIMER TO FIND TRUE LOVE',
      'GHOST OF FORGOTTEN HIGH SCHOOL HOMEWORK',
      'ROMANTIC HERO WHO FORGOT HIS SOULMATE’S PHONE NUMBER',
      'TIME TRAVELER STUCK IN A 2008 FAST FOOD DRIVE-THRU',
      'ETERNAL SPIRIT WHO DRAMATICALLY LOOKS AT RAIN THROUGH A WINDOW',
      'IMMORTAL BEING APOLOGIZING FOR SOMETHING HE DID IN 1492'
    ],
    avatars: ['💔', '⏳', '👻', '💌', '🥀', '🕯️', '💍', '🌧️'],
    gradients: [
      'from-rose-500 via-purple-700 to-slate-950',
      'from-pink-500 via-fuchsia-700 to-neutral-950',
      'from-violet-500 via-rose-800 to-black',
    ]
  }
};

const SCENARIOS = [
  'After losing the Great Toaster War of 2047, returned from retirement to challenge the moon to a cooking competition.',
  'Accidentally traded the kingdom’s crown jewels for an enchanted Wi-Fi router that only connects to 2006 Myspace.',
  'Declared war on gravity after slipping on a slightly overripe banana in front of three very judgmental pigeons.',
  'Spent four centuries perfecting a secret spell, only to discover it simply turns cold pizza into lukewarm pizza.',
  'Challenged the local traffic light to an intense staring contest and refused to leave for seventy-eight hours.',
  'Attempted to conquer the Roman Empire using only a bag of frozen chicken nuggets and extreme confidence.',
  'Entered a high-stakes duel against his own reflection and somehow lost by unanimous jury decision.',
  'Discovered the sacred coordinates to the universe’s greatest secret, which turned out to be a coupon for garlic bread.',
  'Constructed a 90-foot mech suit powered exclusively by the rage of unread emails and spilled coffee.',
  'Sued the concept of Tuesday for emotional damages caused by lack of weekend vibes.',
  'Was elected president of an abandoned bowling alley after delivering an impassioned speech about waffle irons.',
  'Tried to reincarnate as an epic dragon emperor but glitched into a semi-functional refrigerator with ice dispenser problems.',
  'Wrote a 600-page manifesto explaining why ducks should pay property taxes in breadcrumbs.',
  'Convinced an entire alien armada that earthlings communicate solely through 10-hour loops of cartoon sound effects.',
  'Attempted to bake sourdough so powerful that it opened a temporary rift into the fifth dimension of carbohydrates.'
];

const DIALOGUES = [
  '"YOU CANNOT DEFEAT ME. I HAVE 47 SECONDS LEFT ON THE DEFROST CYCLE."',
  '"SILENCE! MY LAWYER IS A DUCK AND HE HAS NEVER LOST A CASE."',
  '"BEHOLD MY ULTIMATE WEAPON: A SLIGHTLY DAMP PAPER TOWEL!"',
  '"I DID NOT CHOOSE THE PASTA LIFE. THE PASTA LIFE CHOSE ME AT 3:14 AM."',
  '"LOGIC WAS NEVER AN OPTION. PREPARE TO BE MILDLY INCONVENIENCED!"',
  '"YOU DARE CHALLENGE ME IN MY OWN LIVING ROOM FORTRESS?!"',
  '"MY POWER IS BEYOND YOUR COMPREHENSION. I HAVE THREE ALARMS SET FOR TOMORROW."',
  '"DO NOT QUESTION THE SPATULA. THE SPATULA HAS SEEN CIVILIZATIONS FALL."',
  '"ACCORDING TO MY CALCULATIONS, SOMEONE FORGOT TO PLUG IN THE ROUTER."',
  '"I WILL NOT REST UNTIL EVERY SPOON IN THIS GALAXY HAS BEEN APPRECIATED!"',
  '"FOOL! THIS ISN’T EVEN MY FINAL MICROWAVE BEEP!"',
  '"HAVE YOU EVER SEEN A BANANA WIELD DIPLOMATIC IMMUNITY? YOU ARE ABOUT TO."'
];

const POWER_UNITS = [
  'Spaghetti Units',
  'Toaster Watts',
  'Duck Quacks',
  'Waffle Joules',
  'Confused Screams',
  'Microwave Beeps',
  'Banana Calories',
  'Garlic Bread Slices',
  'Unread Emails',
  'Drama Decibels',
  'Glitch Megabytes',
  'Existential Sighs'
];

const CHAOS_LEVELS = [
  'MAXIMUM OVERDRIVE',
  'CRITICAL OVERLOAD',
  'UNCONTROLLED HYPERDRIVE',
  'SUB-ATOMIC NONSENSE',
  'UNHINGED CHAOS',
  'QUANTUM LEVEL ZERO-BRAINCELL',
  'NUCLEAR SPAGHETTI SPEED',
  'SUPREME BEDLAM'
];

const PLOT_TWISTS = [
  'Plot Twist: The moon was actually his landlord all along.',
  'Plot Twist: The toaster had diplomatic immunity from the United Nations.',
  'Plot Twist: It was all a dream caused by eating three pounds of parmesan cheese.',
  'Plot Twist: The main villain was just a coat hanger in a very dramatic coat.',
  'Plot Twist: Everyone was already in the refrigerator.',
  'Plot Twist: The epic sword was actually an overcooked baguette with a hilt.',
  'Plot Twist: His only weakness was being asked how his day was going.',
  'Plot Twist: The secret treasure was a handwritten note saying "Nice try bro".',
  'Plot Twist: He was actually fighting his future self from ten minutes ago.',
  'Plot Twist: The judge, jury, and audience were all the same golden retriever in different wigs.',
  'Plot Twist: The Wi-Fi password was under the router the entire time.',
  'Plot Twist: There was no prophecy. An owl just sneezed on an old parchment.'
];

// Special Forbidden Meme
export const FORBIDDEN_MEME: AbsurdMeme = {
  id: 'forbidden-meme-666',
  characterName: 'THE OMNISCIENT ULTRA-POTATO OF DOOM',
  title: 'SOVEREIGN ENTITY OF THE UNRENDERED VOID',
  category: 'forbidden',
  categoryIcon: '👁️',
  description: 'You stepped outside the boundaries of human comprehension. The laws of thermodynamics have been temporarily converted into mashed potatoes.',
  dialogue: '"YOU WERE NOT SUPPOSED TO FIND THIS. NEITHER WERE WE. NOW BEAR WITNESS TO 999 TRIILLION ROTATING SPUD CELLS."',
  brainrotLevel: '999.99%',
  chaosEnergy: 'INFINITE COSMIC VOID',
  logicRemaining: '-404.00%',
  powerLevel: '∞ Starch Units',
  plotTwist: 'Plot Twist: The universe was rebooted and your browser is running on pure potato starch.',
  themeGradient: 'from-fuchsia-600 via-red-600 to-amber-950',
  emojiAvatar: '🥔',
  isForbidden: true,
};

// Emergency Panic Meme
export const PANIC_MEME: AbsurdMeme = {
  id: 'emergency-panic-911',
  characterName: 'EMERGENCY CAPTAIN WHAT-IS-HAPPENING',
  title: 'FIRST RESPONDER TO TOTAL REALITY BREAKDOWN',
  category: 'panic',
  categoryIcon: '🚨',
  description: 'You typed the emergency protocol phrase. Reality has been paused and replaced with an elevator music track composed entirely of bicycle horns.',
  dialogue: '"EVERYBODY STAY CALM! NOBODY HAS ANY IDEA WHAT IS HAPPENING AND THAT IS THE STANDARD OPERATING PROCEDURE!"',
  brainrotLevel: '100.0%',
  chaosEnergy: 'MAXIMUM PANIC',
  logicRemaining: '0.00001%',
  powerLevel: '9,999,999 Emergency Sirens',
  plotTwist: 'Plot Twist: The emergency exit leads directly into another identical absurdity generator.',
  themeGradient: 'from-red-600 via-amber-600 to-yellow-500',
  emojiAvatar: '🚨',
};

// Utility to generate a random meme
export function generateRandomMeme(categoryKey: string = 'all'): AbsurdMeme {
  let targetKey = categoryKey;
  if (targetKey === 'all' || !CATEGORY_NAMES[targetKey]) {
    const keys = Object.keys(CATEGORY_NAMES);
    targetKey = keys[Math.floor(Math.random() * keys.length)];
  }

  const catData = CATEGORY_NAMES[targetKey] || CATEGORY_NAMES.italian;
  const prefix = catData.prefixes[Math.floor(Math.random() * catData.prefixes.length)];
  const root = catData.roots[Math.floor(Math.random() * catData.roots.length)];
  const suffix = catData.suffixes[Math.floor(Math.random() * catData.suffixes.length)];
  const charName = `${prefix} ${root} ${suffix}`.toUpperCase();

  const title = catData.titles[Math.floor(Math.random() * catData.titles.length)];
  const description = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  const dialogue = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
  const twist = PLOT_TWISTS[Math.floor(Math.random() * PLOT_TWISTS.length)];
  const avatar = catData.avatars[Math.floor(Math.random() * catData.avatars.length)];
  const gradient = catData.gradients[Math.floor(Math.random() * catData.gradients.length)];

  // Randomized Stats
  const brainrotNum = (85 + Math.random() * 14.9).toFixed(1);
  const logicNum = (Math.random() * 0.09).toFixed(3);
  const powerNum = (Math.floor(Math.random() * 8999999) + 1000000).toLocaleString();
  const powerUnit = POWER_UNITS[Math.floor(Math.random() * POWER_UNITS.length)];
  const chaosEnergy = CHAOS_LEVELS[Math.floor(Math.random() * CHAOS_LEVELS.length)];

  const catMeta = MEME_CATEGORIES.find(c => c.id === targetKey) || MEME_CATEGORIES[0];

  return {
    id: `meme-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    characterName: charName,
    title,
    category: catMeta.name,
    categoryIcon: catMeta.icon,
    description,
    dialogue,
    brainrotLevel: `${brainrotNum}%`,
    chaosEnergy,
    logicRemaining: `${logicNum}%`,
    powerLevel: `${powerNum} ${powerUnit}`,
    plotTwist: twist,
    themeGradient: gradient,
    emojiAvatar: avatar
  };
}

// Battle Generator
const BATTLE_WINNERS = [
  'THE REFRIGERATOR',
  'A RANDOM PASSING PIGEON',
  'NOBODY (EVERYONE TOOK A NAP)',
  'THE AIR FRYER IN THE CORNER',
  'THE ROOMBA ESCAPING UNDER THE SOFA',
  'A SLIGHTLY DAMP CARROT',
  'THE AUDIENCE (BY MUTE BUTTON)',
  'THE WI-FI ROUTER POWER CYCLE'
];

const BATTLE_ROUND_LOGS = [
  [
    'Round 1: Both fighters stared menacingly, completely forgetting the contest rules.',
    'Round 2: Fighter 1 launched an aggressive monologue about unwashed laundry.',
    'Round 3: A rogue ceiling fan distracted both competitors.'
  ],
  [
    'Round 1: Fighter 2 summoned an army of breadcrumbs that flew in the wrong direction.',
    'Round 2: A refrigerator entered the arena without an entry pass.',
    'Round 3: An intense staring contest concluded with both blinking simultaneously.'
  ],
  [
    'Round 1: Fighter 1 threw a critical croissant dealing zero physical damage but high emotional confusion.',
    'Round 2: Fighter 2 attempted to cast a microwave defrost beam, failing due to an unclosed door.',
    'Round 3: The referee declared everyone a champion of questionable life choices.'
  ],
  [
    'Round 1: Both competitors tripped over the exact same invisible extension cord.',
    'Round 2: Fighter 1 weaponized 10-hour elevator jazz at maximum volume.',
    'Round 3: Fighter 2 responded by dramatically folding a bedsheet into a burrito.'
  ]
];

export function generateCharacterBattle(): CharacterBattle {
  const meme1 = generateRandomMeme('all');
  const meme2 = generateRandomMeme('all');

  const randomRoundSet = BATTLE_ROUND_LOGS[Math.floor(Math.random() * BATTLE_ROUND_LOGS.length)];
  const winner = BATTLE_WINNERS[Math.floor(Math.random() * BATTLE_WINNERS.length)];

  return {
    id: `battle-${Date.now()}`,
    fighter1: {
      name: meme1.characterName,
      title: meme1.title,
      emoji: meme1.emojiAvatar,
      power: meme1.powerLevel
    },
    fighter2: {
      name: meme2.characterName,
      title: meme2.title,
      emoji: meme2.emojiAvatar,
      power: meme2.powerLevel
    },
    rounds: randomRoundSet.map((txt, i) => ({
      round: i + 1,
      text: txt.replace('Fighter 1', meme1.characterName).replace('Fighter 2', meme2.characterName)
    })),
    winner,
    winnerReason: 'Declared champion due to superior lack of situational awareness.'
  };
}
