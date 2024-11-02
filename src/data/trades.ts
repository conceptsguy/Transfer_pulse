interface Trade {
  id: string;
  name: string;
  color: string;
  category: string;
}

export const tradeCategories = [
  {
    name: 'Site Work',
    trades: [
      { id: 'excavation', name: 'Excavation', color: '#FF6B6B', category: 'Site Work' },
      { id: 'grading', name: 'Grading', color: '#E84855', category: 'Site Work' },
      { id: 'utilities', name: 'Utilities', color: '#D72638', category: 'Site Work' },
    ]
  },
  {
    name: 'Structure',
    trades: [
      { id: 'foundation', name: 'Foundation', color: '#4ECDC4', category: 'Structure' },
      { id: 'framing', name: 'Framing', color: '#45B7D1', category: 'Structure' },
      { id: 'roofing', name: 'Roofing', color: '#C06C84', category: 'Structure' },
      { id: 'masonry', name: 'Masonry', color: '#8B5CF6', category: 'Structure' },
    ]
  },
  {
    name: 'MEP',
    trades: [
      { id: 'electrical', name: 'Electrical', color: '#96CEB4', category: 'MEP' },
      { id: 'plumbing', name: 'Plumbing', color: '#FFEEAD', category: 'MEP' },
      { id: 'hvac', name: 'HVAC', color: '#D4A5A5', category: 'MEP' },
      { id: 'fire-protection', name: 'Fire Protection', color: '#FF4858', category: 'MEP' },
    ]
  },
  {
    name: 'Finishes',
    trades: [
      { id: 'drywall', name: 'Drywall', color: '#9B9B9B', category: 'Finishes' },
      { id: 'painting', name: 'Painting', color: '#FFD93D', category: 'Finishes' },
      { id: 'flooring', name: 'Flooring', color: '#6C5B7B', category: 'Finishes' },
      { id: 'millwork', name: 'Millwork', color: '#8E7C68', category: 'Finishes' },
      { id: 'tile', name: 'Tile', color: '#4B8E8D', category: 'Finishes' },
    ]
  },
  {
    name: 'Specialty',
    trades: [
      { id: 'landscaping', name: 'Landscaping', color: '#7CB342', category: 'Specialty' },
      { id: 'security', name: 'Security Systems', color: '#5C6BC0', category: 'Specialty' },
      { id: 'elevator', name: 'Elevator', color: '#8D6E63', category: 'Specialty' },
    ]
  }
] as const;

export const trades: Trade[] = tradeCategories.flatMap(category => 
  category.trades.map(trade => ({
    ...trade,
    category: category.name
  }))
);