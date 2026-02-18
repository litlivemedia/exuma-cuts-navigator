export interface ShipwreckQuote {
  text: string
  source: string
  author: string
  year: string
}

export const shipwreckQuotes: ShipwreckQuote[] = [
  // ═══ HOMER ═══
  {
    text: 'Then the great wave smote down upon him, driving on in a terrible wise, and the raft reeled again. And he fell far from the raft, and let the helm go from his hand.',
    source: 'The Odyssey',
    author: 'Homer',
    year: '~800 BC',
  },
  {
    text: 'The wind blew the sails into the body of the ship, and the mast snapped in the middle. The sail and the yard arm fell into the hold.',
    source: 'The Odyssey',
    author: 'Homer',
    year: '~800 BC',
  },

  // ═══ VIRGIL ═══
  {
    text: 'A squall came howling from the north, striking the sail full on. The waves rose to the stars; the oars snapped; the prow swung round and gave the broadside to the waves.',
    source: 'The Aeneid',
    author: 'Virgil',
    year: '~19 BC',
  },
  {
    text: 'Three ships the south wind caught and hurled upon hidden rocks — rocks the Italians call the Altars, rising vast amid the waves.',
    source: 'The Aeneid',
    author: 'Virgil',
    year: '~19 BC',
  },

  // ═══ SHAKESPEARE ═══
  {
    text: 'All lost! To prayers, to prayers! All lost! We split, we split! Farewell, my wife and children! Farewell, brother! We split, we split, we split!',
    source: 'The Tempest',
    author: 'William Shakespeare',
    year: '1611',
  },
  {
    text: 'Methought I saw a thousand fearful wrecks, ten thousand men that fishes gnawed upon, wedges of gold, great anchors, heaps of pearl, inestimable stones, unvalued jewels.',
    source: 'Richard III',
    author: 'William Shakespeare',
    year: '1593',
  },
  {
    text: 'What cares these roarers for the name of king? To cabin! Silence! Trouble us not. If you can command these elements to silence, use your authority.',
    source: 'The Tempest',
    author: 'William Shakespeare',
    year: '1611',
  },

  // ═══ DANIEL DEFOE ═══
  {
    text: 'The sea went mountains high, and broke upon us every three or four minutes. I expected every wave would have swallowed us up.',
    source: 'Robinson Crusoe',
    author: 'Daniel Defoe',
    year: '1719',
  },
  {
    text: 'The ship struck upon a sand, and the sea broke over her in such a manner that we expected we should all have perished immediately.',
    source: 'Robinson Crusoe',
    author: 'Daniel Defoe',
    year: '1719',
  },
  {
    text: 'Nothing can describe the confusion of thought which I felt when I sunk into the water; for though I swam very well, yet I could not deliver myself from the waves so as to draw breath.',
    source: 'Robinson Crusoe',
    author: 'Daniel Defoe',
    year: '1719',
  },

  // ═══ JONATHAN SWIFT ═══
  {
    text: 'In three hours a violent storm came on. We reefed the foresail and set him, we hauled aft the foresheet. The ship lay very broad off, so we thought it better spooning before the sea.',
    source: "Gulliver's Travels",
    author: 'Jonathan Swift',
    year: '1726',
  },

  // ═══ SAMUEL TAYLOR COLERIDGE ═══
  {
    text: 'With sloping masts and dipping prow, as who pursued with yell and blow still treads the shadow of his foe, and forward bends his head, the ship drove fast, loud roared the blast.',
    source: 'The Rime of the Ancient Mariner',
    author: 'Samuel Taylor Coleridge',
    year: '1798',
  },
  {
    text: 'The ice was here, the ice was there, the ice was all around: it cracked and growled, and roared and howled, like noises in a swound!',
    source: 'The Rime of the Ancient Mariner',
    author: 'Samuel Taylor Coleridge',
    year: '1798',
  },

  // ═══ LORD BYRON ═══
  {
    text: 'Then rose from sea to sky the wild farewell — then shrieked the timid, and stood still the brave — then some leaped overboard with dreadful yell.',
    source: 'Don Juan',
    author: 'Lord Byron',
    year: '1819',
  },
  {
    text: 'She gave a heel, and then a lurch to port, and going down head foremost — sunk, in short.',
    source: 'Don Juan',
    author: 'Lord Byron',
    year: '1819',
  },
  {
    text: "At half-past eight o'clock, booms, hencoops, spars, and ballast were heaved overboard to lighten the vessel, which lay on her beam-ends.",
    source: 'Don Juan',
    author: 'Lord Byron',
    year: '1819',
  },

  // ═══ EDGAR ALLAN POE ═══
  {
    text: 'The whole sea was in a state of terrific agitation; but between us and the whirl, a wide expanse of foam lashed into fury — this the fishermen call the Ström.',
    source: 'A Descent into the Maelström',
    author: 'Edgar Allan Poe',
    year: '1841',
  },
  {
    text: 'A shriek, half stifled, as the ship lurched heavily and plunged — a cry such as might have risen from the throats of the damned in their agony.',
    source: 'MS. Found in a Bottle',
    author: 'Edgar Allan Poe',
    year: '1833',
  },
  {
    text: 'The ship proved to be in a sinking state. The pumps were kept continually going, the leak gaining upon us fast.',
    source: 'The Narrative of Arthur Gordon Pym',
    author: 'Edgar Allan Poe',
    year: '1838',
  },

  // ═══ HERMAN MELVILLE ═══
  {
    text: 'The ship! Great God, where is the ship? Soon they through dim, bewildering mediums saw her sidelong fading phantom, as in the gaseous Fata Morgana.',
    source: 'Moby-Dick',
    author: 'Herman Melville',
    year: '1851',
  },
  {
    text: 'Stubb saw him pause; and perhaps intending not yet to yield to his fate, he kept his place on the dismantled deck, while the wild waves circled round.',
    source: 'Moby-Dick',
    author: 'Herman Melville',
    year: '1851',
  },
  {
    text: 'Now small fowls flew screaming over the yet yawning gulf; a sullen white surf beat against its steep sides; then all collapsed, and the great shroud of the sea rolled on.',
    source: 'Moby-Dick',
    author: 'Herman Melville',
    year: '1851',
  },
  {
    text: 'The Pequod, ship and all, rolled into the vortex, carrying everything down to the bottom, where the sea closed over all like a pall.',
    source: 'Moby-Dick',
    author: 'Herman Melville',
    year: '1851',
  },

  // ═══ CHARLES DICKENS ═══
  {
    text: 'One great wave swept over the wreck. I saw her people run together, clinging to one another. The mast went over the side carrying people with it.',
    source: 'David Copperfield',
    author: 'Charles Dickens',
    year: '1850',
  },
  {
    text: 'Every plank and timber creaked, as if the ship were made of wicker-work; and now a great sea, striking her with the noise of a cannon, decided the contest.',
    source: 'David Copperfield',
    author: 'Charles Dickens',
    year: '1850',
  },

  // ═══ JOSEPH CONRAD ═══
  {
    text: 'The seas in the dark seemed to rush from all sides to keep her back where she might perish. There was hate in the way she was handled.',
    source: 'Typhoon',
    author: 'Joseph Conrad',
    year: '1902',
  },
  {
    text: 'She was a wall-sided, iron, cargo-steamer, frightened by this gale, she lurched in a manner that set every loose thing adrift.',
    source: 'Typhoon',
    author: 'Joseph Conrad',
    year: '1902',
  },
  {
    text: 'She went down head first under me. I heard the boilers burst with a low heavy thud. The smoke rushed up her funnel, went out — and all was still.',
    source: 'Youth',
    author: 'Joseph Conrad',
    year: '1898',
  },
  {
    text: 'She sank like a stone. The light went out. And the black sea rose over her like a wall.',
    source: 'Lord Jim',
    author: 'Joseph Conrad',
    year: '1900',
  },
  {
    text: 'There was a crash as if the earth had split, a sudden hiss, a blinding sheet of foam over the vessel from stern to stern.',
    source: 'The Nigger of the "Narcissus"',
    author: 'Joseph Conrad',
    year: '1897',
  },

  // ═══ STEPHEN CRANE ═══
  {
    text: 'A seat in this boat was not unlike a seat upon a bucking broncho, and by the same token a broncho is not much smaller. The craft pranced and reared and plunged like an animal.',
    source: 'The Open Boat',
    author: 'Stephen Crane',
    year: '1897',
  },
  {
    text: 'In the wan light the faces of the men must have been grey. Their eyes must have glinted in strange ways as they gazed steadily astern.',
    source: 'The Open Boat',
    author: 'Stephen Crane',
    year: '1897',
  },

  // ═══ ROBERT LOUIS STEVENSON ═══
  {
    text: 'The reef thundered, and the great sea with white impotent passion, the breakers pursued their dance of death, and the seabirds wheeled and cried.',
    source: 'The Ebb-Tide',
    author: 'Robert Louis Stevenson',
    year: '1894',
  },
  {
    text: 'She struck with a sickening plunge. The sea burst clean across her deck. I heard the men washing to and fro.',
    source: 'Kidnapped',
    author: 'Robert Louis Stevenson',
    year: '1886',
  },

  // ═══ VICTOR HUGO ═══
  {
    text: 'A cannon that breaks its moorings is suddenly transformed into a supernatural beast. That short mass on two wheels becomes a monster. The monster runs on its wheels like a billiard ball.',
    source: 'Ninety-Three',
    author: 'Victor Hugo',
    year: '1874',
  },
  {
    text: 'The vessel was strained in every joint. She was being beaten to pieces. The sea was making a clean breach over her.',
    source: 'The Toilers of the Sea',
    author: 'Victor Hugo',
    year: '1866',
  },

  // ═══ JULES VERNE ═══
  {
    text: 'The sea was running mountains high. Our vessel was tossed about like a nutshell. At every instant she seemed about to be overwhelmed.',
    source: 'Twenty Thousand Leagues Under the Seas',
    author: 'Jules Verne',
    year: '1870',
  },

  // ═══ WALT WHITMAN ═══
  {
    text: 'O the bleeding drops of red, where on the deck my Captain lies, fallen cold and dead.',
    source: 'O Captain! My Captain!',
    author: 'Walt Whitman',
    year: '1865',
  },

  // ═══ HENRY WADSWORTH LONGFELLOW ═══
  {
    text: 'She struck where the white and fleecy waves looked soft as carded wool, but the cruel rocks, they gored her side like the horns of an angry bull.',
    source: 'The Wreck of the Hesperus',
    author: 'Henry Wadsworth Longfellow',
    year: '1842',
  },
  {
    text: 'At daybreak, on the bleak sea-beach, a fisherman stood aghast, to see the form of a maiden fair, lashed close to a drifting mast.',
    source: 'The Wreck of the Hesperus',
    author: 'Henry Wadsworth Longfellow',
    year: '1842',
  },

  // ═══ JACK LONDON ═══
  {
    text: 'The Ghost wallowed in the trough of the sea, her rail buried till the ocean threatened to pour in, the whole vessel shaking with every impact.',
    source: 'The Sea-Wolf',
    author: 'Jack London',
    year: '1904',
  },

  // ═══ RUDYARD KIPLING ═══
  {
    text: 'We could hear the rivets drawing when she took it green over the scuttle, and wood cracking under our feet.',
    source: 'Captains Courageous',
    author: 'Rudyard Kipling',
    year: '1897',
  },

  // ═══ WILLIAM COWPER ═══
  {
    text: 'We perished, each alone: But I beneath a rougher sea, and whelmed in deeper gulfs than he.',
    source: 'The Castaway',
    author: 'William Cowper',
    year: '1799',
  },

  // ═══ MATTHEW ARNOLD ═══
  {
    text: 'The sea of faith was once, too, at the full, and round earth\'s shore lay like the folds of a bright girdle furled. But now I only hear its melancholy, long, withdrawing roar.',
    source: 'Dover Beach',
    author: 'Matthew Arnold',
    year: '1867',
  },

  // ═══ OVID ═══
  {
    text: 'The waters rise and overwhelm the towers. No difference now between the sea and land; all is sea without a shore.',
    source: 'Metamorphoses',
    author: 'Ovid',
    year: '~8 AD',
  },
]
