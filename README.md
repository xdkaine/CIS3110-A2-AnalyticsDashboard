# E-Commerce Analytics Dashboard

## Project Overview
This project presents an interactive e-commerce analytics dashboard with multiple visualizations designed to provide comprehensive insights into business performance. The dashboard utilizes synthetic data to simulate a real-world e-commerce operation.

## Features
- **5 Distinct Visualization Types**: Line chart, horizontal bar chart, pie chart, radar chart, and bubble chart
- **Responsive Layout**: Different column configurations for each row using Bootstrap's grid system
- **Interactive Elements**: Hover tooltips with detailed information for each data point
- **Key Metrics**: Summary metrics for quick business performance assessment

## Data Sources
The dashboard utilizes 5 synthetic datasets generated in a Jupyter notebook to simulate real e-commerce data:

1. **Monthly Sales Data**: Revenue and order trends over the past 12 months
2. **Product Category Performance**: Revenue, profit, and growth metrics by product category
3. **Customer Demographics**: Spending patterns across different age groups and genders
4. **Website Traffic Sources**: Traffic metrics by source (organic search, paid search, social media, etc.)
5. **Marketing Campaign Performance**: ROI and effectiveness metrics for various marketing campaigns

## Implementation Details
- **Bootstrap**: Used for responsive grid layout with varying column configurations
- **Chart.js**: Implemented for all visualizations with custom styling and tooltips
- **Data Strategy**: Each chart uses a dedicated data getter function to parse and prepare data
- **Custom Formatting**: Proper currency, percentage, and number formatting throughout

## Industry Application
This dashboard simulates an e-commerce business analytics platform. In a real-world scenario, it would help:
- Track sales performance over time
- Identify top-performing product categories
- Analyze customer segments by demographics
- Optimize marketing spend based on campaign ROI
- Understand traffic sources and their conversion rates

## Project Demonstration

### YouTube Video Walkthrough
[![E-Commerce Analytics Dashboard Demo](http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](http://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE "E-Commerce Analytics Dashboard Demo")

*Note: Replace "YOUTUBE_VIDEO_ID_HERE" with your actual YouTube video ID after uploading your demonstration.*

## How to Run
1. Clone this repository
2. Run the Jupyter notebook `analytics_dashboard.ipynb` to generate the datasets
3. Open `test.html` in a modern web browser to view the dashboard

## Technologies Used
- HTML5, CSS3, JavaScript
- Bootstrap 4.5.2
- Chart.js
- PapaParse (for CSV parsing)
- Jupyter Notebook (Python)
- Pandas, NumPy, Matplotlib (for data generation)

## Future Enhancements
- Add interactive filtering capabilities
- Implement cross-filtering between charts
- Add geographic visualizations
- Real-time data updates
- User authentication and personalization
