/* "What we make" explainers. Edit the copy here; the panel builds itself from this list.
   media: a looping .mp4 or a still image from /media. links: [label, href] — "#game-..." opens that game's row. */
window.WHAT = [
  // ---------------- GAMES ----------------
  {
    id: 'game-design', group: 'GAMES', title: 'Game design',
    what: 'Deciding what the player does, what it costs, and what they learn by doing it. Stamping a loan in Am I Approved?, choosing one answer a day in The Weight of the Crown, landing three stunts in one take in Five-Picture Deal.',
    why: 'A rule is the fastest way to tell a story. You learn who clerk #447-B is from what the desk lets them do, long before anyone explains it.',
    media: '/media/games/am-i-approved/gameplay.mp4',
    links: [['Am I Approved?', '#game-am-i-approved'], ['The Weight of the Crown', '#game-weight-of-the-crown'], ['Five-Picture Deal', '#game-five-picture-deal']],
  },
  {
    id: 'systems-design', group: 'GAMES', title: 'Systems design',
    what: 'Rules that push on each other. Every answer in The Weight of the Crown moves nine pillars of power at once. In HYPERDASH every repair makes the ship faster and the music follows it. In Five-Picture Deal every stunt is also your armour.',
    why: 'Systems write scenes nobody scripted. A plague, an empty treasury and an unpaid army is a story the player makes, and it never plays out the same way twice.',
    media: '/media/games/weight-of-the-crown/gameplay.mp4',
    links: [['The Weight of the Crown', '#game-weight-of-the-crown'], ['HYPERDASH', '#game-hyperdash'], ['Five-Picture Deal', '#game-five-picture-deal']],
  },
  {
    id: 'narrative', group: 'GAMES', title: 'Narrative & dialogue',
    what: 'The characters, lines and voice around the rules: clients whose stories don’t add up, petitioners at the throne, a dispatcher on the radio in a silent junction, a deadpan employee handbook.',
    why: 'Small worlds need strange people. A good line makes a rule feel lived in, and a strange one makes you look twice at the next client.',
    media: '/media/games/weight-of-the-crown/loop.mp4',
    links: [['Am I Approved?', '#game-am-i-approved'], ['The Weight of the Crown', '#game-weight-of-the-crown'], ['Rewind', '#game-rewind'], ['The Elder’s Saga', '#game-elders-saga']],
  },
  {
    id: 'level-design', group: 'GAMES', title: 'Level design',
    what: 'Spaces built around one question. The Badge & Blood container yard is 49 by 30 metres, with three staggered lanes and no sight line longer than about 17 metres; the second yard stacks three levels with ways up. In Rewind, the dark is the enemy, so the light decides the route.',
    why: 'Space is a rule you walk through. Short sight lines make a duel about corners and timing, not just aim.',
    media: '/media/games/bodycam/yard-golden.webp',
    links: [['Badge & Blood', '#game-badge-and-blood'], ['Rewind', '#game-rewind'], ['Kill’em All.io', '#game-kill-em-all']],
  },
  {
    id: 'jam-prototypes', group: 'GAMES', title: 'Jam prototypes',
    what: 'Whole games made against a clock: Five-Picture Deal for the 2026 Epic AI MegaJam, Rewind for Retro Horror Jam 2026, HYPERDASH for SlapJam #2, Am I Approved? for The $20K Coolmath Game Jam 2026, and The Weight of the Crown for EdenSpark Game Jam #2.',
    why: 'A deadline decides what matters. A jam forces a finished game, and the good ones keep growing after the jam ends.',
    media: '/media/games/hyperdash/loop.mp4',
    links: [['HYPERDASH', '#game-hyperdash'], ['Rewind', '#game-rewind'], ['All our games on itch.io', 'https://marysue.itch.io/']],
  },
  {
    id: 'trailers', group: 'GAMES', title: 'Trailers & itch pages',
    what: 'We cut our own trailers and build our own store pages: a written treatment, a timeline and a mixed, loudness-checked soundtrack for the Rewind trailer, and animated covers, banners and page backgrounds for every itch.io page.',
    why: 'Nobody plays a game they scrolled past. The first ten seconds of a trailer and the cover GIF have to show the thing that is actually fun.',
    media: '/media/games/rewind/loop.mp4',
    links: [['Rewind', '#game-rewind'], ['Badge & Blood', '#game-badge-and-blood'], ['Our itch.io page', 'https://marysue.itch.io/']],
  },

  // ---------------- CODE ----------------
  {
    id: 'unreal', group: 'CODE', title: 'Unreal Engine 5',
    what: 'Our 3D work. Five-Picture Deal and Rewind are built on Unreal Engine 5.8, and Badge & Blood is a bodycam shooter with its own plugin for the chest camera, the lens, climbing, breaking glass and one-on-one duels.',
    why: 'When the game lives in the camera (a stunt, a bodycam, a flashlight in a tunnel) we want real light, real lenses and real physics.',
    media: '/media/games/five-picture-deal/loop.mp4',
    links: [['Badge & Blood', '#game-badge-and-blood'], ['Five-Picture Deal', '#game-five-picture-deal'], ['Rewind', '#game-rewind']],
  },
  {
    id: 'haxe', group: 'CODE', title: 'Haxe / OpenFL',
    what: 'Our 2D browser games. HYPERDASH and Am I Approved? are written in Haxe on OpenFL and play straight from the itch.io page, with mouse, touch or keyboard.',
    why: 'Browser games get played. One click, no install, and it still works on a phone.',
    media: '/media/games/am-i-approved/cover.mp4',
    links: [['HYPERDASH', '#game-hyperdash'], ['Am I Approved?', '#game-am-i-approved'], ['HYPERDASH source', 'https://github.com/MarySueXLsD/HYPERDASH-web-game']],
  },
  {
    id: 'rust', group: 'CODE', title: 'Rust',
    what: 'Native games and tools that have to be fast and solid: The Elder’s Saga, a hardcore turn-based isometric tactics game, and SensePad, the DualSense drum machine.',
    why: 'Tactics games are rules all the way down. Rust keeps hundreds of them honest, and the game ships as one .exe with its assets folder beside it.',
    media: '/media/games/elders-saga/loop.mp4',
    links: [['The Elder’s Saga', '#game-elders-saga'], ['SensePad', 'https://github.com/MarySueXLsD/SensePad']],
  },
  {
    id: 'daslang', group: 'CODE', title: 'Daslang / EdenSpark',
    what: 'The scripting language of the EdenSpark engine. The Weight of the Crown and Kill’em All.io are written in it.',
    why: 'The EdenSpark jams run on it, and a fast scripting language lets a jam game keep growing into a real one.',
    media: '/media/games/kill-em-all/loop.mp4',
    links: [['The Weight of the Crown', '#game-weight-of-the-crown'], ['Kill’em All.io', '#game-kill-em-all'], ['Crown source', 'https://github.com/MarySueXLsD/The-Weight-of-the-Crown-game']],
  },
  {
    id: 'csharp', group: 'CODE', title: 'C# / MonoGame',
    what: 'MaryS Game Engine is written in C# on MonoGame: its own game loop, editor windows and module system on top of MonoGame’s rendering and input.',
    why: 'MonoGame is a framework, not an engine, so the engine on top of it can be ours, shaped for turn-based games from the editor up.',
    media: '/media/tools/marys-engine.mp4',
    links: [['MaryS Game Engine', 'https://github.com/MarySueXLsD/MaryS-Game-Engine']],
  },
  {
    id: 'ts-lua', group: 'CODE', title: 'TypeScript & Lua',
    what: 'TypeScript for desktop apps and bots: Maris Local AI and Brackets. Lua for scripting inside someone else’s game: the Silent Hill 2 co-op mod.',
    why: 'We write in the language the host speaks: TypeScript where we build the whole app ourselves, Lua where a game lets us in.',
    media: '/media/tools/maris-banner.mp4',
    links: [['Maris Local AI', 'https://github.com/MarySueXLsD/Maris-Local-AI'], ['Brackets', 'https://github.com/MarySueXLsD/Brackets-Twitch-Chat-Bot'], ['Silent Hill 2 Co-op Mod', 'https://github.com/MarySueXLsD/Silent-Hill-2-Remake-Cooperative-Mod']],
  },

  // ---------------- TOOLS ----------------
  {
    id: 'engines', group: 'TOOLS', title: 'Game engines & editors',
    what: 'MaryS Game Engine: a modular 2D engine for turn-based games, with a desktop-style editor, drag-and-drop tools and an AI assistant. Every editor tool is a module you can add or remove, and whatever a module makes stays in the game’s own folder.',
    why: 'Turn-based games share the same bones. An engine built around them means the next tactics game starts halfway done, and people who don’t code can build one too.',
    media: '/media/tools/marys-engine.mp4',
    links: [['MaryS Game Engine on GitHub', 'https://github.com/MarySueXLsD/MaryS-Game-Engine']],
  },
  {
    id: 'vscode', group: 'TOOLS', title: 'VS Code extensions',
    what: 'Travelling Kingdom: a sidebar travel companion for VS Code and Cursor. Walk the road, visit destinations and recruit companions while you work; your progress is saved between sessions.',
    why: 'We spend most days in the editor. A small kingdom walking beside the code turns a long session into a journey.',
    media: '/media/tools/travelling-kingdom.mp4',
    links: [['Travelling Kingdom on GitHub', 'https://github.com/MarySueXLsD/VS-Extension-Travelling-Kingdom']],
  },
  {
    id: 'mods', group: 'TOOLS', title: 'Game mods',
    what: 'An experimental two-player co-op mod and launcher for Silent Hill 2 (2024). An unofficial fan project.',
    why: 'Some games deserve a second player. Modding is also how we learn other people’s engines from the inside.',
    media: '/media/tools/sh2-coop.mp4',
    links: [['Silent Hill 2 Co-op Mod on GitHub', 'https://github.com/MarySueXLsD/Silent-Hill-2-Remake-Cooperative-Mod']],
  },
  {
    id: 'controller-audio', group: 'TOOLS', title: 'Controller & audio tools',
    what: 'SensePad turns a DualSense controller into a drum machine for Windows: pads, a looper and DJ effects.',
    why: 'A controller with pressure, motion and haptics in your hands is an instrument waiting to happen.',
    media: '/media/tools/sensepad.mp4',
    links: [['SensePad on GitHub', 'https://github.com/MarySueXLsD/SensePad']],
  },
  {
    id: 'local-ai', group: 'TOOLS', title: 'Local AI assistants',
    what: 'Maris Local AI: a private assistant that runs entirely on your PC. Chat, a coding agent, PC help that asks before it changes anything, memory that learns, web browsing, and local image and video generation.',
    why: 'Your files stay on your machine. An assistant that asks before it touches anything is one you can actually leave running.',
    media: '/media/tools/maris-loop.mp4',
    links: [['Maris Local AI on GitHub', 'https://github.com/MarySueXLsD/Maris-Local-AI']],
  },
  {
    id: 'twitch-bots', group: 'TOOLS', title: 'Twitch bots',
    what: 'Brackets: a Twitch chat bot that answers your viewers in your own manner while you play, with a launcher that shows every reply and why it was given.',
    why: 'Chat moves faster than a player can answer. A bot that sounds like you keeps the stream talking, and showing its reasons keeps it honest.',
    media: '/media/tools/brackets.mp4',
    links: [['Brackets on GitHub', 'https://github.com/MarySueXLsD/Brackets-Twitch-Chat-Bot']],
  },
];
