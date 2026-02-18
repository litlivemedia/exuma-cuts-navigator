export interface Shipwreck {
  name: string
  year: string
  location: string
  detail: string
}

export const shipwrecks: Shipwreck[] = [
  // ═══ SPANISH TREASURE SHIPS ═══
  {
    name: 'Nuestra Senora de las Maravillas',
    year: '1656',
    location: 'Little Bahama Bank',
    detail: 'A 36-cannon galleon carrying 5 million pesos collided with its own flagship at night. A 49-carat emerald and Ming Dynasty porcelain were recovered centuries later.',
  },
  {
    name: 'Nuestra Senora de la Concepcion',
    year: '1641',
    location: 'Silver Shoals',
    detail: 'Separated from its convoy in a hurricane carrying a massive silver cargo. Salvors pulled up 32 tons of silver, gold, and chests of pearls when rediscovered in 1687.',
  },
  {
    name: 'San Roque',
    year: '1605',
    location: 'Little Bahama Bank',
    detail: 'The 600-ton capitana of the Tierra Firme fleet was lost with three other galleons in a hurricane. Her treasure of over 1 million pesos has never been found.',
  },
  {
    name: 'Santo Domingo',
    year: '1605',
    location: 'Little Bahama Bank',
    detail: 'The almiranta of the ill-fated 1605 fleet, she went down in the same hurricane as the San Roque. Four of seven galleons were lost that night.',
  },
  {
    name: 'Nuestra Senora de Begona',
    year: '1605',
    location: 'Little Bahama Bank',
    detail: 'One of four richly laden galleons wrecked during a violent hurricane while sailing from Cartagena to Spain.',
  },
  {
    name: 'San Ambrosio',
    year: '1605',
    location: 'Little Bahama Bank',
    detail: 'The fourth galleon lost in the 1605 Tierra Firme fleet disaster. The three surviving ships turned back to the Caribbean.',
  },
  {
    name: 'La Primavera',
    year: '~1640',
    location: 'Bahamas',
    detail: 'A Spanish treasure ship reportedly carrying 300,000 in gold, 4 million in silver, and 250,000 in gems when she was lost.',
  },
  {
    name: 'Santiago',
    year: '~1550',
    location: 'Bahamas',
    detail: 'An early Spanish vessel reportedly carrying 500,000 gold coins and 250,000 silver bars when she went down in the reef-studded Bahamian waters.',
  },
  {
    name: 'Highbourne Cay Wreck',
    year: '~1513',
    location: 'Highbourne Cay, Exumas',
    detail: 'One of the oldest European wrecks in the Americas. May have been a spy ship sent by Columbus\'s son Diego to monitor Ponce de Leon\'s Florida expedition.',
  },

  // ═══ PIRATE ERA ═══
  {
    name: 'Whydah Gally',
    year: '1717',
    location: 'Captured in Bahamas',
    detail: 'Pirate "Black Sam" Bellamy captured this slave ship in the Bahamas and made it his flagship. It became the first positively identified pirate shipwreck ever found.',
  },
  {
    name: 'HMS Southampton',
    year: '1812',
    location: 'Conception Island',
    detail: 'This 32-gun frigate captured the USS Vixen, then both ships were wrecked on an uncharted reef by a strong current. All crew were saved.',
  },

  // ═══ SLAVE SHIPS ═══
  {
    name: 'Peter Mowell',
    year: '1860',
    location: 'Lynyard Cay, Abaco',
    detail: 'This slaving schooner wrecked carrying 400 captive Africans from the Congo. The crew panicked when they spotted a steamer, ran too close to shore, and grounded.',
  },
  {
    name: 'Guerrero',
    year: '1827',
    location: 'Great Bahama Bank',
    detail: 'A slave ship carrying 561 Africans was chased by HMS Nimble and struck a reef at speed, drowning 41 captives. Spanish crew hijacked wrecking vessels and took survivors to Cuba.',
  },
  {
    name: 'Nancy',
    year: '1767',
    location: 'Northern Bahamas',
    detail: 'This slave ship wrecked amid surf and rocks. Among the survivors was Olaudah Equiano, who went on to become one of history\'s most influential abolitionists.',
  },
  {
    name: 'Creole',
    year: '1841',
    location: 'Nassau',
    detail: 'In the most successful slave revolt in U.S. history, 128 enslaved people seized this brig and forced it to sail to Nassau, where British law set them free.',
  },

  // ═══ RUM RUNNING / PROHIBITION ═══
  {
    name: 'SS Sapona',
    year: '1926',
    location: 'Bimini',
    detail: 'This concrete-hulled WWI ship was sold to a bootlegger as a floating liquor warehouse. A 1926 hurricane drove her onto the reef. Her hulk still rises above the water.',
  },
  {
    name: 'Hesperus (Turtle Wreck)',
    year: '~1920s',
    location: 'Bimini',
    detail: 'A cement barge nicknamed "Turtle Wreck" because loggerhead turtles flock to it at night. Sits in just 20 feet of water on the edge of a dramatic drop-off.',
  },
  {
    name: 'Tomoka',
    year: '1920s',
    location: 'Bahamas',
    detail: 'Captain Bill McCoy\'s famous rum-running vessel between Bimini and Florida. His refusal to water down his product gave rise to the phrase "the Real McCoy."',
  },

  // ═══ WWII ═══
  {
    name: 'Mamura',
    year: '1942',
    location: 'NE of Great Abaco',
    detail: 'This 8,245-ton tanker loaded with gasoline was torpedoed by U-504. The explosion was so violent the U-boat had to crash-dive to escape burning fuel spreading across the water.',
  },
  {
    name: 'O.A. Knudsen',
    year: '1942',
    location: 'East of Abaco',
    detail: 'A Norwegian tanker torpedoed by U-128. Thirty-nine survivors in three lifeboats made it ashore, where the Duchess of Windsor personally arranged for their care.',
  },
  {
    name: 'Anglo Saxon',
    year: '1940',
    location: 'Mid-Atlantic (survivors reached Eleuthera)',
    detail: 'Sunk by the German raider Widder. Two survivors drifted 2,000 miles over 10 weeks in an open boat before washing ashore on Eleuthera.',
  },
  {
    name: 'SS Potlatch',
    year: '1942',
    location: 'Near Crooked Island',
    detail: 'Sunk by U-153. Survivors were rescued off Bird Rock by eccentric British millionairess Marion "Joe" Carstairs in her yacht.',
  },
  {
    name: 'Flight 19 (5 TBM Avengers)',
    year: '1945',
    location: 'Disappeared near Bahamas',
    detail: 'Five Navy torpedo bombers vanished after a training run that included bombing practice on the SS Sapona wreck near Bimini. Their loss helped create the Bermuda Triangle legend.',
  },

  // ═══ HURRICANES ═══
  {
    name: 'SS El Faro',
    year: '2015',
    location: 'NE of Acklins/Crooked Island',
    detail: 'This 790-foot cargo ship sailed into Hurricane Joaquin and sank with all 33 crew. Her voyage data recorder was recovered from 15,000 feet of ocean floor.',
  },
  {
    name: 'Minouche',
    year: '2015',
    location: 'Near Crooked Island',
    detail: 'A 230-foot freighter swallowed by Hurricane Joaquin the same night El Faro went down. The Coast Guard heroically rescued all 12 crew by helicopter during the storm.',
  },
  {
    name: 'Pretoria',
    year: '1929',
    location: 'Fresh Creek, Andros',
    detail: 'A 43-foot schooner that sank during the catastrophic 1929 hurricane, killing 35 of 38 aboard. The folk song "Run Come See Jerusalem" immortalizes the tragedy.',
  },
  {
    name: 'Potomac',
    year: '1929',
    location: 'Andros Island',
    detail: 'A British tanker that broke in two during the 1929 hurricane. The captain risked his life shutting off boiler valves to prevent the oil cargo from exploding.',
  },

  // ═══ DIVE SITE WRECKS (NASSAU) ═══
  {
    name: 'Tears of Allah (Bond Wreck)',
    year: '1983',
    location: 'SW New Providence',
    detail: 'A 92-foot tugboat sunk for the James Bond film Never Say Never Again. Sean Connery\'s Bond escapes a tiger shark through this wreck in the movie.',
  },
  {
    name: 'Vulcan Bomber (Thunderball Wreck)',
    year: '1965',
    location: 'SW New Providence',
    detail: 'A mock-up of a British Vulcan bomber built for the Bond film Thunderball. The fiberglass is long gone, leaving an eerie skeleton draped in sea fans.',
  },
  {
    name: 'Ray of Hope',
    year: '2003',
    location: 'SW New Providence',
    detail: 'A 200-foot Haitian freighter sunk as an artificial reef. Fully intact and sitting upright, her bow starts at 40 feet and stern reaches 60 feet.',
  },
  {
    name: 'Willaurie',
    year: '1988',
    location: 'Clifton Pier, Nassau',
    detail: 'A 130-foot steel freighter that spent her career as a mailboat serving Rum Cay and Cat Island. Sank under tow, leaving a dramatic "jail-cell-bar" cargo hold.',
  },
  {
    name: 'Bahama Mama',
    year: '1995',
    location: 'Nassau',
    detail: 'A 95-foot party cruise boat sunk to create a scuba attraction. She lies on sand at 50 feet and remains in remarkably good condition.',
  },
  {
    name: 'LCT Barge (Thunderball Wreck)',
    year: '~1940s',
    location: 'Nassau, near Athol Island',
    detail: 'A WWII landing craft that ferried troops between Paradise Island and Exuma. It starred in the climactic underwater battle of the 1965 James Bond film Thunderball.',
  },

  // ═══ DIVE SITE WRECKS (GRAND BAHAMA) ═══
  {
    name: "Theo's Wreck",
    year: '1982',
    location: 'Off Xanadu Beach, Grand Bahama',
    detail: 'A 230-foot Norwegian freighter, the first ship intentionally sunk as a dive site in the Bahamas. Named after the port engineer who persuaded the company to scuttle it.',
  },
  {
    name: 'Papa Doc',
    year: '~1960s',
    location: 'Freeport, Grand Bahama',
    detail: 'A 70-foot shrimp boat that sank transporting mercenaries and firearms to Haiti during the revolution against Papa Doc Duvalier. Divers still find ammunition in the coral.',
  },
  {
    name: 'Sugar Wreck',
    year: '~1800s',
    location: 'West End, Grand Bahama',
    detail: 'Ancient remains of a sailing ship that sank carrying sugar. Sitting in 20 feet of water near Tiger Beach, it is often visited by lemon sharks and tiger sharks.',
  },
  {
    name: 'Badger',
    year: '1997',
    location: 'Freeport, Grand Bahama',
    detail: 'An old Burma Oil tugboat deliberately sunk as a dive site. Standing upright in 50 feet of water, known for frequent reef shark sightings on nearby Pygmy Reef.',
  },

  // ═══ EXUMA CAYS ═══
  {
    name: 'Austin Smith',
    year: '~1990s',
    location: 'Exuma Cays',
    detail: 'A 90-foot Bahamian Defence Force patrol boat being towed to San Salvador sank en route. Now an oasis for grouper, barracuda, and reef sharks in 60 feet of water.',
  },
  {
    name: "Norman's Cay Drug Plane",
    year: '1980',
    location: "Norman's Cay, Exumas",
    detail: 'A WWII-era C-46 Commando flown to Norman\'s Cay for Medellin Cartel boss Carlos Lehder crashed in the shallows. It became the iconic symbol of the Bahamas\' cocaine era.',
  },
  {
    name: 'Staniel Cay Drug Plane',
    year: '~1980s',
    location: 'Staniel Cay, Exumas',
    detail: 'A plane so overloaded with marijuana that its occupants could not escape when it crashed offshore after an emergency call in broken English to the local airport.',
  },

  // ═══ MAILBOATS ═══
  {
    name: 'Brontes',
    year: '1926',
    location: 'Highbourne Cay, Exumas',
    detail: 'A mailboat tragically lost in the 1926 hurricane with 30 souls aboard near Highbourne Cay.',
  },
  {
    name: 'Lady Rosalind',
    year: '1997',
    location: 'Bahamas',
    detail: 'A 156-foot steel mailboat built in Louisiana that struck a rock and was damaged beyond repair. Her remains lingered at Potter\'s Cay in Nassau for years.',
  },
  {
    name: 'Captain Moxey',
    year: '~1998',
    location: 'West of Great Exuma',
    detail: 'A mailboat that sank west of Great Exuma, one of many inter-island vessels lost over two centuries of Bahamian mailboat service.',
  },
  {
    name: 'Cat Island Princess',
    year: '2018',
    location: 'Berry Islands',
    detail: 'A mailboat carrying cement from Grand Bahama that sank off the Berry Islands, one of the more recent inter-island vessel losses.',
  },
  {
    name: 'Hazel Dell',
    year: '1960',
    location: 'Bahamas',
    detail: 'A two-masted schooner built in 1906 that caught fire and sank after over half a century of faithful service in the Bahamas.',
  },

  // ═══ 19th CENTURY WRECKS ═══
  {
    name: 'Cato',
    year: '1851',
    location: 'Moselle Shoal, near Bimini',
    detail: 'Sailing from Liverpool with emigrants, she struck Moselle Shoal. Bahamian wreckers rescued all 300 emigrants aboard.',
  },
  {
    name: 'Osborne',
    year: '1853',
    location: 'Grand Bahama',
    detail: 'A fleet of wrecking schooners rescued over 200 Irish and English passengers, demonstrating the vital role of Bahamian wreckers.',
  },
  {
    name: 'HMS Nimble',
    year: '1827',
    location: 'Great Bahama Bank',
    detail: 'A British antislavery patrol schooner that ran onto a reef while chasing the slave ship Guerrero. The crew survived, but the enslaved cargo was largely re-enslaved.',
  },
  {
    name: 'USS Vixen',
    year: '1812',
    location: 'Conception Island',
    detail: 'An American brig captured by HMS Southampton. Both ships were then wrecked together on the same uncharted reef.',
  },

  // ═══ OTHER NOTABLE ═══
  {
    name: 'Comberbach',
    year: 'Unknown',
    location: 'Long Island',
    detail: 'A 110-foot freighter in 100 feet of water, famous for the mesmerizing spiraling schools of jacks that circle above its superstructure.',
  },
  {
    name: 'Marion',
    year: 'Unknown',
    location: 'Andros Island',
    detail: 'A construction barge from the AUTEC navy base deliberately sunk with a tractor and crane still aboard, creating an unusual artificial reef.',
  },
  {
    name: 'Lucayan Beach Wreck',
    year: '~1600s',
    location: 'Grand Bahama Island',
    detail: 'In 1964 a swimmer found roughly 10,000 silver coins from the 1600s in just 10 feet of water near a hotel. The ship\'s identity remains a mystery.',
  },
  {
    name: 'Repeat',
    year: '1929',
    location: 'Grassy Creek, Andros',
    detail: 'A schooner that sank during the 1929 hurricane, part of the storm that killed 134 people and ended the Bahamas\' sponging industry.',
  },
  {
    name: 'Sea Trader',
    year: '~1990s',
    location: 'SW New Providence',
    detail: 'A 250-foot oil tanker intentionally sunk as an artificial reef. She lies upright in 60-80 feet of water and is a favorite for wreck-penetration diving.',
  },
  {
    name: 'David Tucker II',
    year: '1997',
    location: 'SW New Providence',
    detail: 'A former U.S. Coast Guard cutter donated to the Royal Bahamas Defence Force, decommissioned, and sunk by Stuart Cove\'s as an artificial reef.',
  },
  {
    name: 'Emmanuelle',
    year: '2002',
    location: 'Freeport, Grand Bahama',
    detail: 'A 180-foot Italian-built freighter confiscated by the government and scuttled. Hurricanes Frances, Jeanne, and Matthew have repeatedly rearranged the wreck.',
  },
  {
    name: 'Central Andros Express',
    year: '2014',
    location: "Potter's Cay, Nassau",
    detail: 'A mailboat that sank at dock in Nassau and was not removed until 2016, blocking commercial activity for over two years.',
  },
]
