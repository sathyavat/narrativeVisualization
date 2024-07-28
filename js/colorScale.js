const palette = [
  '#f8b195', '#f67280', '#c06c84', '#6c5b7b', '#355c7d', '#c9ada7',
  '#ff677d', '#d3d3d3', '#f5f5f5', '#d9bf77', '#b9e3c6', '#e6e6ea',
  '#c1c1c1', '#f5f5f5', '#f7b7a3', '#b8c6db', '#e8d3c8', '#f0b1a3',
  '#d7e3fc', '#a2d9e5', '#e9c8b2', '#e6a6b5', '#c0c0c0', '#b5e4d3',
  '#b4a7d6', '#f7b7a3', '#b8c6db', '#e8d3c8', '#e9c8b2', '#e6a6b5'
];

export const colorScale = d3.scaleOrdinal(palette)
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
