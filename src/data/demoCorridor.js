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
      coords: [-1.3601, 36.7455],
      hint: 'Origin terminal & student boarding gate. Well lit near security post.',
      icon: '🎓'
    },
    {
      id: 'galleria',
      name: 'Galleria Mall Junction',
      type: 'Key Interchange',
      coords: [-1.3486, 36.7592],
      hint: 'Major transfer hub to Ongata Rongai / Magadi Road. High foot traffic.',
      icon: '🏬'
    },
    {
      id: 'bomas',
      name: 'Bomas of Kenya Landmark',
      type: 'Primary Waypoint',
      coords: [-1.3392, 36.7698],
      hint: 'Major navigational landmark. Indicates matatu is on Langata Road spine.',
      icon: '🏛️'
    },
    {
      id: 'cemetery',
      name: 'Langata Cemetery / Barracks Stretch',
      type: 'Night Caution Zone',
      coords: [-1.3282, 36.7865],
      hint: 'Unlit forest section. Stay inside vehicle; verified safe transit corridor only.',
      icon: '🌲'
    },
    {
      id: 'tmall',
      name: 'T-Mall / Mbagathi Junction',
      type: 'Split Junction',
      coords: [-1.3106, 36.8115],
      hint: 'Diversion point: Straight to Nyayo Stadium, or turn into Raila Odinga Way.',
      icon: '🚦'
    },
    {
      id: 'nyayo',
      name: 'Nyayo Stadium Roundabout',
      type: 'CBD Approach',
      coords: [-1.3032, 36.8223],
      hint: 'Entering central urban core. Traffic police post & round-the-clock lighting.',
      icon: '🏟️'
    },
    {
      id: 'cbd_railways',
      name: 'Railways Bus Terminal (CBD Lit Zone)',
      type: 'Destination Terminal',
      coords: [-1.2905, 36.8256],
      hint: 'Verified Lit Safe Haven: 24/7 Police Post, CCTV concourse, High-mast floodlight.',
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
        [-1.3601, 36.7455], // CUK
        [-1.3486, 36.7592], // Galleria
        [-1.3392, 36.7698], // Bomas
        [-1.3325, 36.7790], // Otiende turnoff
        [-1.3282, 36.7865], // Cemetery
        [-1.3195, 36.7995], // Wilson Airport
        [-1.3106, 36.8115], // T-Mall
        [-1.3032, 36.8223], // Nyayo Stadium
        [-1.2950, 36.8245], // Haile Selassie Roundabout
        [-1.2905, 36.8256]  // Railways Terminal
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
        [-1.3106, 36.8115], // T-Mall Junction
        [-1.3045, 36.8085], // Raila Odinga Way (Mbagathi)
        [-1.2985, 36.8062], // City Mortuary Roundabout
        [-1.2925, 36.8130], // Ngong Road / Community
        [-1.2885, 36.8190], // Kenyatta Ave
        [-1.2905, 36.8256]  // CBD Railways
      ]
    }
  ]
};
