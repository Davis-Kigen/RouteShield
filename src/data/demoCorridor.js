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
      type: 'Origin / Student Stage',
      coords: [-1.3601, 36.7455],
      hint: 'Origin terminal & student boarding gate. Well-lit campus barrier with 24/7 security watch.',
      visual_cue: 'CUK Main Gate barrier, stone gatehouse, student bodaboda shed',
      icon: '🎓',
      image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
      map_query: '-1.3601,36.7455'
    },
    {
      id: 'galleria',
      name: 'Galleria Mall Junction',
      type: 'Major Interchange',
      coords: [-1.3486, 36.7592],
      hint: 'Major illuminated transfer point between Karen and Rongai. High pedestrian density.',
      visual_cue: 'Pedestrian overpass, Shell petrol station, perimeter security lights',
      icon: '🏬',
      image_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
      map_query: '-1.3486,36.7592'
    },
    {
      id: 'bomas',
      name: 'Bomas of Kenya Landmark',
      type: 'Primary Navigation Waypoint',
      coords: [-1.3392, 36.7698],
      hint: 'Key milestone: Confirms matatu is on the main Langata dual carriageway heading towards CBD.',
      visual_cue: 'Monumental arch entrance, Forest Edge junction, highway police post nearby',
      icon: '🏛️',
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      map_query: '-1.3392,36.7698'
    },
    {
      id: 'cemetery',
      name: 'Langata Cemetery / Barracks Stretch',
      type: 'Night Caution Zone',
      coords: [-1.3282, 36.7865],
      hint: 'Isolated forest section. Poor streetlighting; commuters advised to stay inside vehicle and not alight on this shoulder.',
      visual_cue: 'Dense forest canopy, absence of shops or open premises, military barracks fence',
      icon: '🌲',
      image_url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
      map_query: '-1.3282,36.7865'
    },
    {
      id: 'tmall',
      name: 'T-Mall / Mbagathi Junction',
      type: 'Route Split Point',
      coords: [-1.3106, 36.8115],
      hint: 'Decision node: Driver either continues toward Nyayo or diverts left into Mbagathi (Raila Odinga Way).',
      visual_cue: 'T-Mall overpass flyover, major junction traffic lights, busy commercial lighting',
      icon: '🚦',
      image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80',
      map_query: '-1.3106,36.8115'
    },
    {
      id: 'nyayo',
      name: 'Nyayo Stadium Roundabout',
      type: 'CBD Gateway',
      coords: [-1.3032, 36.8223],
      hint: 'Approaching city core. High-mast county lighting, traffic police post, and constant vehicle flow.',
      visual_cue: 'Nyayo National Stadium floodlight towers & Aerodrome Rd intersection',
      icon: '🏟️',
      image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      map_query: '-1.3032,36.8223'
    },
    {
      id: 'cbd_railways',
      name: 'Railways Bus Terminal (CBD Lit Zone)',
      type: 'Verified Lit Safe Terminal',
      coords: [-1.2905, 36.8256],
      hint: 'Verified Safe Haven: Kenya Railways Police Unit, high-mast floodlights, 24/7 tea kiosks & active security.',
      visual_cue: 'Historic clock tower, illuminated passenger concourse, visible transit marshals',
      icon: '★',
      image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      map_query: '-1.2905,36.8256'
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
      description: "Standard route via Bomas -> Lang'ata Rd -> Nyayo Stadium -> Haile Selassie",
      coordinates: [
        [-1.3601, 36.7455],
        [-1.3486, 36.7592],
        [-1.3392, 36.7698],
        [-1.3325, 36.7790],
        [-1.3282, 36.7865],
        [-1.3195, 36.7995],
        [-1.3106, 36.8115],
        [-1.3032, 36.8223],
        [-1.2950, 36.8245],
        [-1.2905, 36.8256]
      ]
    },
    {
      id: 'diversion',
      name: "Peak Bypass: Mbagathi / Raila Odinga Way",
      saccos: ['Naboka (Traffic Bypass)', 'G-City Express'],
      color: '#eab308',
      dashArray: '8, 8',
      weight: 4,
      description: "Diverts at T-Mall -> City Mortuary Roundabout -> Ngong Rd -> CBD",
      coordinates: [
        [-1.3106, 36.8115],
        [-1.3045, 36.8085],
        [-1.2985, 36.8062],
        [-1.2925, 36.8130],
        [-1.2885, 36.8190],
        [-1.2905, 36.8256]
      ]
    }
  ]
};
