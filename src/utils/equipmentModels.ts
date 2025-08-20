// Predefined equipment models by manufacturer
export const EQUIPMENT_MODELS = {
  DJI: [
    // Mavic Series
    'Mavic 3',
    'Mavic 3 Pro',
    'Mavic 3 Classic',
    'Mavic 3 Cine',
    'Mavic Air 2S',
    'Mavic Air 2',
    'Mavic Air',
    'Mavic Mini 3',
    'Mavic Mini 3 Pro',
    'Mavic Mini 2',
    'Mavic Mini',
    'Mavic 2 Pro',
    'Mavic 2 Zoom',
    'Mavic 2 Enterprise',
    'Mavic Pro',
    'Mavic Pro Platinum',
    
    // Mini Series
    'DJI Mini 4 Pro',
    'DJI Mini 3',
    'DJI Mini 3 Pro',
    'DJI Mini 2',
    'DJI Mini SE',
    
    // Air Series
    'DJI Air 3',
    'DJI Air 2S',
    'DJI Air 2',
    
    // Matrice Series
    'Matrice 350 RTK',
    'Matrice 300 RTK',
    'Matrice 300',
    'Matrice 30',
    'Matrice 30T',
    'Matrice 210 V2',
    'Matrice 210 RTK V2',
    'Matrice 210',
    'Matrice 210 RTK',
    'Matrice 200',
    'Matrice 600 Pro',
    'Matrice 600',
    'Matrice 100',
    
    // Phantom Series
    'Phantom 4 RTK',
    'Phantom 4 Pro V2.0',
    'Phantom 4 Pro',
    'Phantom 4 Advanced',
    'Phantom 4',
    'Phantom 3 Professional',
    'Phantom 3 Advanced',
    'Phantom 3 Standard',
    'Phantom 3 4K',
    
    // Inspire Series
    'Inspire 3',
    'Inspire 2',
    'Inspire 1 Pro',
    'Inspire 1',
    
    // FPV Series
    'DJI FPV',
    'DJI Avata 2',
    'DJI Avata',
    
    // Agricultural Series
    'Agras T50',
    'Agras T40',
    'Agras T30',
    'Agras T25',
    'Agras T20',
    'Agras T16',
    'Agras MG-1P',
    
    // Others
    'Spark',
    'Ryze Tello',
    'Robomaster TT'
  ],
  
  'Autel Robotics': [
    // EVO II Series
    'EVO II Pro',
    'EVO II Dual',
    'EVO II Pro 6K',
    'EVO II Pro Rugged Bundle',
    'EVO II RTK',
    
    // EVO Max Series
    'EVO Max 4T',
    'EVO Max 4N',
    
    // EVO Lite Series
    'EVO Lite+',
    'EVO Lite',
    
    // EVO Nano Series
    'EVO Nano+',
    'EVO Nano',
    
    // Dragonfish Series
    'Dragonfish Pro',
    'Dragonfish Standard',
    'Dragonfish Lite',
    
    // Alpha Series
    'Alpha',
    
    // Titan Series
    'Titan'
  ],
  
  Dahua: [
    // X Series
    'Dahua X820',
    'Dahua X1200',
    'Dahua X1500',
    'Dahua X2000',
    
    // Sky Eye Series
    'Sky Eye X8-2000',
    'Sky Eye X10-3000',
    'Sky Eye X12-4000',
    'Sky Eye X15-5000',
    
    // Professional Series
    'Dahua Pro X1',
    'Dahua Pro X2',
    'Dahua Pro X3'
  ],
  
  Parrot: [
    'ANAFI',
    'ANAFI Thermal',
    'ANAFI USA',
    'ANAFI Ai',
    'Bebop 2',
    'Disco FPV',
    'Mambo',
    'Swing'
  ],
  
  Skydio: [
    'Skydio 2',
    'Skydio 2+',
    'Skydio X2',
    'Skydio X2D',
    'Skydio X2E'
  ],
  
  Yuneec: [
    'Typhoon H520',
    'Typhoon H Plus',
    'Typhoon H3',
    'Mantis G',
    'Mantis Q',
    'Breeze 4K',
    'E90',
    'E10T'
  ]
} as const;

// Model compatibility mapping - maps equipment models to accessory catalog models
export const MODEL_COMPATIBILITY_MAP: Record<string, string[]> = {
  // DJI Matrice 200 Series compatibility
  'Matrice 210': ['Matrice 200'],
  'Matrice 210 RTK': ['Matrice 200'],
  'Matrice 210 V2': ['Matrice 200'],
  'Matrice 210 RTK V2': ['Matrice 200'],
  'Matrice 200': ['Matrice 200'],
  
  // DJI Matrice 300 Series compatibility  
  'Matrice 350 RTK': ['Matrice 300'],
  'Matrice 300': ['Matrice 300'],
  'Matrice 300 RTK': ['Matrice 300'],
  'Matrice 30': ['Matrice 300'],
  'Matrice 30T': ['Matrice 300'],
  
  // DJI Mavic 3 Series compatibility
  'Mavic 3': ['Mavic 3'],
  'Mavic 3 Pro': ['Mavic 3'],
  'Mavic 3 Classic': ['Mavic 3'],
  'Mavic 3 Cine': ['Mavic 3'],
  'Mavic Mini 3': ['Mavic 3'],
  'Mavic Mini 3 Pro': ['Mavic 3'],
  
  // DJI Mavic 2 Series compatibility
  'Mavic 2 Pro': ['Mavic 2'],
  'Mavic 2 Zoom': ['Mavic 2'],
  'Mavic 2 Enterprise': ['Mavic 2'],
  
  // DJI Air Series compatibility
  'DJI Air 3': ['Air 3'],
  'DJI Air 2S': ['Air 2S'],
  'Mavic Air 2S': ['Air 2S'],
  'DJI Air 2': ['Air 2'],
  'Mavic Air 2': ['Air 2'],
  'Mavic Air': ['Air'],
  
  // DJI Mini Series compatibility
  'DJI Mini 4 Pro': ['Mini 4'],
  'DJI Mini 3': ['Mini 3'],
  'DJI Mini 3 Pro': ['Mini 3'],
  'DJI Mini 2': ['Mini 2'],
  'Mavic Mini 2': ['Mini 2'],
  'DJI Mini SE': ['Mini'],
  'Mavic Mini': ['Mini'],
  
  // DJI Phantom Series compatibility
  'Phantom 4 RTK': ['Phantom 4'],
  'Phantom 4 Pro V2.0': ['Phantom 4'],
  'Phantom 4 Pro': ['Phantom 4'],
  'Phantom 4 Advanced': ['Phantom 4'],
  'Phantom 4': ['Phantom 4'],
  'Phantom 3 Professional': ['Phantom 3'],
  'Phantom 3 Advanced': ['Phantom 3'],
  'Phantom 3 Standard': ['Phantom 3'],
  'Phantom 3 4K': ['Phantom 3'],
  
  // DJI Inspire Series compatibility
  'Inspire 3': ['Inspire'],
  'Inspire 2': ['Inspire'],
  'Inspire 1 Pro': ['Inspire'],
  'Inspire 1': ['Inspire'],
  
  // Autel EVO II Series compatibility
  'EVO II Pro': ['EVO II'],
  'EVO II Dual': ['EVO II'],
  'EVO II Pro 6K': ['EVO II'],
  'EVO II Pro Rugged Bundle': ['EVO II'],
  'EVO II RTK': ['EVO II'],
  
  // Autel EVO Max Series compatibility
  'EVO Max 4T': ['EVO Max'],
  'EVO Max 4N': ['EVO Max'],
  
  // Autel EVO Nano Series compatibility
  'EVO Nano+': ['EVO Nano'],
  'EVO Nano': ['EVO Nano'],
  
  // Autel EVO Lite Series compatibility
  'EVO Lite+': ['EVO Lite'],
  'EVO Lite': ['EVO Lite'],
  
  // Dahua compatibility
  'Dahua X820': ['X820'],
  'Dahua X1200': ['X820', 'X1200'],
  'Dahua X1500': ['X1500'],
  'Dahua X2000': ['X2000'],
  
  // Parrot compatibility
  'ANAFI': ['ANAFI'],
  'ANAFI Thermal': ['ANAFI'],
  'ANAFI USA': ['ANAFI'],
  'ANAFI Ai': ['ANAFI'],
  
  // Skydio compatibility
  'Skydio 2': ['Skydio 2'],
  'Skydio 2+': ['Skydio 2'],
  'Skydio X2': ['Skydio X2'],
  'Skydio X2D': ['Skydio X2'],
  'Skydio X2E': ['Skydio X2']
};

/**
 * Get compatible accessory models for a given equipment model
 * @param equipmentModel - The model of the equipment
 * @returns Array of compatible accessory catalog models
 */
export const getCompatibleModels = (equipmentModel: string): string[] => {
  if (!equipmentModel) return [];
  
  // Direct compatibility mapping
  const directCompatibility = MODEL_COMPATIBILITY_MAP[equipmentModel];
  if (directCompatibility) {
    return directCompatibility;
  }
  
  // Fallback: try case-insensitive matching
  const normalizedInput = equipmentModel.toLowerCase();
  for (const [model, compatibility] of Object.entries(MODEL_COMPATIBILITY_MAP)) {
    if (model.toLowerCase() === normalizedInput) {
      return compatibility;
    }
  }
  
  // If no mapping found, return the original model for exact match
  return [equipmentModel];
};

/**
 * Check if an accessory is compatible with the equipment model
 * @param accessoryCompatibility - Array of compatible models from accessory catalog
 * @param equipmentModel - The model of the parent equipment
 * @returns boolean indicating compatibility
 */
export const isAccessoryCompatible = (
  accessoryCompatibility: string[] | null | undefined,
  equipmentModel: string
): boolean => {
  // If no compatibility list, assume compatible with all
  if (!accessoryCompatibility || accessoryCompatibility.length === 0) {
    return true;
  }
  
  // If no equipment model, show all accessories
  if (!equipmentModel) {
    return true;
  }
  
  // Get compatible models for the equipment
  const compatibleModels = getCompatibleModels(equipmentModel);
  
  // Check if any compatible model matches the accessory's compatibility list
  return compatibleModels.some(compatibleModel => 
    accessoryCompatibility.some(accModel => 
      accModel.toLowerCase().includes(compatibleModel.toLowerCase()) ||
      compatibleModel.toLowerCase().includes(accModel.toLowerCase())
    )
  );
};
