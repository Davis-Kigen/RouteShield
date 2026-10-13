export const DEMO_CORRIDOR = {
  id: 'coop-cbd',
  name: "Co-op University / Karen to CBD",
  summary: "Lang'ata Road Corridor via Bomas, Lang'ata Cemetery & Nyayo",
  saccos: [
    {
      id: 'naboka',
      name: 'Naboka Sacco',
      tagline: 'Main Pick: CUK Main Gate & Galleria',
      cbd_stage: 'Railways Bus Terminal / Haile Selassie Ave',
      off_peak: 'KES 50 - 70',
      peak_ceiling: 'KES 80 - 100',
      color: '#000000',
      badge_bg: 'bg-black text-yellow-400',
      fleet_type: '33-Seater Minibuses',
      status: 'Normal Operations'
    },
    {
      id: 'g-city',
      name: 'G-City Sacco',
      tagline: 'Main Pick: Karen Roundabout & Bogani Junction',
      cbd_stage: 'Ambassador / Kencom Concourse',
      off_peak: 'KES 50 - 60',
      peak_ceiling: 'KES 70 - 90',
      color: '#eab308',
      badge_bg: 'bg-yellow-400 text-black',
      fleet_type: '14-Seater & 33-Seater',
      status: 'Normal Operations'
    }
  ],
  landmarks: [
    {
      id: 'cuk',
      name: 'Co-operative University (CUK)',
      type: 'Origin / Stage',
      coords: [-1.3653, 36.7441],
      hint: 'Origin terminal & student boarding gate. Well lit near security post.',
      visual_cue: 'CUK Ushirika Rd entrance gate & bodaboda stage',
      icon: '🎓'
    },
    {
      id: 'galleria',
      name: 'Galleria Mall Junction',
      type: 'Key Interchange',
      coords: [-1.3503, 36.7601],
      hint: 'Major transfer hub to Ongata Rongai / Magadi Road. High foot traffic.',
      visual_cue: 'Galleria roundabout, pedestrian flyover & Shell station',
      icon: '🏬'
    },
    {
      id: 'bomas',
      name: 'Bomas of Kenya Landmark',
      type: 'Primary Waypoint',
      coords: [-1.3364, 36.7708],
      hint: 'Major navigational landmark. Indicates matatu is on Langata Road spine.',
      visual_cue: 'Bomas monumental entrance arch & Forest Edge junction',
      icon: '🏛️'
    },
    {
      id: 'cemetery',
      name: 'Langata Cemetery / Barracks Stretch',
      type: 'Night Caution Zone',
      coords: [-1.3282, 36.7865],
      hint: 'Unlit forest section. Stay inside vehicle; verified safe transit corridor only.',
      visual_cue: 'Dense forest canopy & Langata perimeter wall, zero lit shops',
      icon: '🌲'
    },
    {
      id: 'tmall',
      name: 'T-Mall / Mbagathi Junction',
      type: 'Split Junction',
      coords: [-1.3115, 36.8122],
      hint: 'Diversion point: Straight to Nyayo Stadium, or turn into Raila Odinga Way.',
      visual_cue: 'T-Mall overpass flyover & Mbagathi Way turnoff',
      icon: '🚦'
    },
    {
      id: 'nyayo',
      name: 'Nyayo Stadium Roundabout',
      type: 'CBD Approach',
      coords: [-1.3038, 36.8228],
      hint: 'Entering central urban core. Traffic police post & round-the-clock lighting.',
      visual_cue: 'Nyayo Stadium floodlights & Aerodrome Rd roundabout',
      icon: '🏟️'
    },
    {
      id: 'cbd_railways',
      name: 'Railways Bus Terminal (CBD Lit Zone)',
      type: 'Destination Terminal',
      coords: [-1.2908, 36.8266],
      hint: 'Verified Lit Safe Haven: 24/7 Police Post, CCTV concourse, High-mast floodlight.',
      visual_cue: 'Railways terminal platforms & Haile Selassie Ave concourse',
      icon: '★'
    }
  ],
  routes: [
    {
      id: 'main',
      name: "Primary Route: Lang'ata Road Direct",
      saccos: ['Naboka Sacco', 'G-City Sacco'],
      color: '#000000',
      dashArray: null,
      weight: 5,
      description: "Standard daily route via Bomas -> Lang'ata Rd -> Nyayo Stadium -> Haile Selassie",
      coordinates: [
        [-1.3653, 36.7441], // CUK Gate
        [-1.3503, 36.7601], // Galleria Roundabout
        [-1.3364, 36.7708], // Bomas Gate
        [-1.3320, 36.7790], // Otiende turn
        [-1.3282, 36.7865], // Lang'ata Cemetery stretch
        [-1.3195, 36.7995], // Wilson Airport
        [-1.3115, 36.8122], // T-Mall
        [-1.3038, 36.8228], // Nyayo Roundabout
        [-1.2950, 36.8245], // Haile Selassie roundabout
        [-1.2908, 36.8266]  // Railways Bus Terminal
      ]
    },
    {
      id: 'diversion',
      name: "Peak Bypass: Mbagathi / Raila Odinga Way",
      saccos: ['Naboka Sacco (Peak traffic avoid)', 'G-City Express'],
      color: '#eab308',
      dashArray: '8, 8',
      weight: 4,
      description: "Used during heavy Nyayo gridlock: branches off at T-Mall -> City Mortuary -> Community -> CBD",
      coordinates: [
        [-1.3115, 36.8122], // T-Mall
        [-1.3045, 36.8085], // Raila Odinga Way
        [-1.2985, 36.8062], // City Mortuary Roundabout
        [-1.2925, 36.8130], // Kenyatta National Hospital / Ngong Rd
        [-1.2885, 36.8190], // Haile Selassie / Uhuru Highway
        [-1.2908, 36.8266]  // Railways Terminal
      ]
    }
  ]
};
