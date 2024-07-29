# Exploring Fuel Efficiency in 2024

## Overview
This project presents a narrative visualization aimed at exploring the complex relationship between fuel efficiency and various vehicle characteristics, including fuel type, manufacturer, and engine power. The visualization delivers data-driven insights through an interactive format to help users understand factors influencing fuel efficiency and the potential trade-offs involved.

## Narrative Structure
The visualization employs an interactive slideshow format, progressing logically through the following scenes:
1. **Introduction**: Provides context and introduces interactive elements.
2. **Fuel Efficiency by Fuel Type**: Examines the impact of different fuel types on fuel efficiency.
3. **Vehicle Manufacturers**: Compares average fuel efficiency across various car manufacturers.
4. **Fuel Efficiency vs. Horsepower**: Investigates the relationship between fuel efficiency and horsepower.

Users navigate through the slideshow using "Next" and "Previous" buttons, with transitions controlled by an author-defined sequence. This approach contrasts with drill-down structures, where users have more freedom to explore data independently.

## Visual Structure
The visualization maintains a consistent visual structure across scenes:
- **Dark Background with White Text**: Enhances readability.
- **Clear Headings and Descriptions**: Provide context for the data.
- **Familiar Chart Types**:
  - **Bar Charts**: For quantitative vs. nominal data.
  - **Scatter Plots**: For quantitative vs. quantitative data.
- **Consistent Layout and Navigation**: Includes previous/next buttons.
- **Consistent Coloring**: For manufacturers across scenes.
- **Consistent Chart Spacing**: Within each scene.

## Scenes
The visualization includes four main scenes:
1. **Introduction**: Sets up the exploration and interactive elements.
2. **Fuel Efficiency by Fuel Type**: Focuses on the effect of fuel types on efficiency.
3. **Vehicle Manufacturers**: Compares fuel efficiency among manufacturers.
4. **Fuel Efficiency vs. Horsepower**: Analyzes the correlation between fuel efficiency and horsepower.

The scenes are organized to provide a progressive understanding of fuel efficiency.

## Annotations
Annotations use a white callout style to maintain high contrast with the dark background. They highlight the data points with the best and worst fuel efficiency in each category (manufacturer and fuel type). Annotations are displayed with a delay to allow users to draw their own insights before key data points are highlighted. Annotations naturally change in the “Fuel Type” scene based on user-selected parameters but maintain a consistent layout.

## Parameters
The visualization includes the following parameters:
- **Emission Filter**: In the "Fuel Type" scene, allows filtering data by emission levels (zero, non-zero, or all). The x-axis of the bar charts and annotations update based on the selected emission level.
- **Manufacturer Filter**: In the "Vehicle Manufacturers" scene, allows filtering the scatter plot by selecting specific manufacturers from the legend.

## Triggers
Interactive elements include:
- **"Previous" and "Next" Buttons**: Navigate through different scenes.
- **Emission Filters**: In the "Fuel Type" scene, filter data based on emission levels.
- **Manufacturer Filters**: In the "Vehicle Manufacturers" scene, filter data based on car manufacturers.

Buttons and interactive elements are designed to be user-friendly, with clear labels and visually distinct clickable areas. The bar chart in the "Fuel Type" scene is initially empty and renders only after selecting a category of fuel emissions. The scatter plot is pre-filtered to a key data point (Tesla - highest fuel efficiency in the dataset) with a bolded legend for this manufacturer.

## Usage
To interact with the visualization:
1. Navigate between scenes using the "Previous" and "Next" buttons.
2. Apply filters to explore different emission levels and manufacturers.
3. Observe changes in charts and annotations as you interact with the data.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

