const darkPalette = [
  '#1F3A93',  // Dark Blue
  '#2C3E50',  // Dark Slate Blue
  '#E74C3C',  // Bright Red
  '#8E44AD',  // Dark Purple
  '#3498DB',  // Bright Blue
  '#27AE60',  // Dark Green
  '#F39C12',  // Bright Orange
  '#E67E22',  // Dark Orange
  '#F1C40F',  // Bright Yellow
  '#D35400',  // Burnt Orange
  '#9B59B6',  // Medium Purple
  '#1ABC9C',  // Teal
  '#E84393',  // Light Pink
  '#FF6F61',  // Coral
  '#7F8C8D',  // Medium Dark Blue
  '#BDC3C7',  // Light Silver
  '#C0392B',  // Dark Red
  '#FFBF00',  // Bright Yellow Orange
  '#2980B9',  // Darker Blue
  '#DFFF00',  // Light Yellow
  '#FF4500',  // Orange Red
  '#4B0082',  // Indigo
  '#9ACD32',  // Yellow Green
  '#DAA520',  // Golden Rod
  '#FF6347',  // Tomato
  '#8A2BE2',  // Blue Violet
  '#ADFF2F',  // Green Yellow
  '#FF1493',  // Deep Pink
  '#00FA9A',  // Medium Spring Green
  '#4B0082',  // Indigo (Reused for consistency)
];

export const colorScale = d3.scaleOrdinal(darkPalette)
  .domain([
    'aston martin', 'BMW', 'Bugatti Rimac LLC', 'Canoo Technologies',
    'FCA US LLC', 'Ferrari', 'Fisker Group Inc.', 'FOMOCO', 'GM',
    'Honda', 'Hyundai', 'Ineos Automotive Li', 'Jaguar Land Rover L',
    'Kia', 'Lotus', 'Lucid USA, Inc', 'Maserati', 'MAZDA',
    'Mercedes-Benz', 'Mitsubishi Motors Co', 'Mullen Automotive',
    'Nissan', 'Pagani S.p.A.', 'Porsche', 'Rivian Automotive L',
    'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota', 'Vinfast Trading and',
    'Volkswagen Group of', 'Volvo'
  ]);
