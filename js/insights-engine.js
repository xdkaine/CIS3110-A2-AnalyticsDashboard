/**
 * E-Commerce Analytics Dashboard - Insights Engine
 * 
 * This module analyzes the dashboard data and provides actionable insights
 * by detecting patterns, anomalies, and opportunities in the data.
 */

class InsightsEngine {
    constructor(dashboardData) {
        this.data = dashboardData;
        this.insights = [];
        this.insightCategories = {
            critical: [],     // Urgent attention needed
            opportunity: [],  // Positive potential to capitalize on
            trend: [],        // Notable patterns over time
            performance: [],  // Performance metrics analysis
            anomaly: []       // Unusual data points or outliers
        };
    }

    /**
     * Analyze all dashboard data and generate insights
     */
    analyzeAll() {
        this.analyzeRevenue();
        this.analyzeProductCategories();
        this.analyzeTrafficSources();
        this.analyzeDemographics();
        this.analyzeMarketingCampaigns();
        this.scoreAndPrioritizeInsights();
        return this.insights;
    }

    /**
     * Add a new insight to the collection
     */
    addInsight(category, title, description, impact, recommendation, dataPoints = []) {
        const insight = {
            id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique ID
            category,
            title,
            description,
            impact: impact,    // Impact score: 1-10
            recommendation,
            dataPoints,
            timestamp: new Date()
        };
        
        this.insights.push(insight);
        this.insightCategories[category].push(insight);
        return insight;
    }

    /**
     * Sort and prioritize insights by impact score
     */
    scoreAndPrioritizeInsights() {
        // Sort insights by impact score (descending)
        this.insights.sort((a, b) => b.impact - a.impact);
        
        // Sort within each category
        for (const category in this.insightCategories) {
            this.insightCategories[category].sort((a, b) => b.impact - a.impact);
        }
    }

    /**
     * Analyze monthly revenue data
     */
    analyzeRevenue() {
        const monthlySales = this.data.monthlySales;
        if (!monthlySales || monthlySales.length === 0) return;
        
        // Calculate month-over-month growth rates
        const growthRates = [];
        for (let i = 1; i < monthlySales.length; i++) {
            const currentRevenue = parseFloat(monthlySales[i].Revenue);
            const previousRevenue = parseFloat(monthlySales[i-1].Revenue);
            const growthRate = (currentRevenue - previousRevenue) / previousRevenue;
            growthRates.push({
                month: monthlySales[i].Month,
                rate: growthRate
            });
        }
        
        // Identify significant changes in revenue (>15% increase or decrease)
        const significantChanges = growthRates.filter(item => Math.abs(item.rate) > 0.15);
        
        // Check for continuous decline
        let consecutiveDeclines = 0;
        let currentDeclineTrend = 0;
        for (let i = 0; i < growthRates.length; i++) {
            if (growthRates[i].rate < 0) {
                currentDeclineTrend++;
            } else {
                if (currentDeclineTrend > consecutiveDeclines) {
                    consecutiveDeclines = currentDeclineTrend;
                }
                currentDeclineTrend = 0;
            }
        }
        
        // Update with the final streak if it's the longest
        if (currentDeclineTrend > consecutiveDeclines) {
            consecutiveDeclines = currentDeclineTrend;
        }
        
        // Check for seasonality patterns
        const seasonalityCheck = this.detectSeasonality(monthlySales.map(item => parseFloat(item.Revenue)));
        
        // Find months with highest AOV
        const sortedByAOV = [...monthlySales].sort((a, b) => 
            parseFloat(b.AOV) - parseFloat(a.AOV)
        );
        
        // Find months with highest order volume
        const sortedByOrders = [...monthlySales].sort((a, b) => 
            parseInt(b.Orders) - parseInt(a.Orders)
        );
        
        // Insight: Significant revenue changes
        if (significantChanges.length > 0) {
            for (const change of significantChanges) {
                const direction = change.rate > 0 ? 'increase' : 'decrease';
                const category = change.rate > 0 ? 'opportunity' : 'critical';
                const impact = change.rate > 0 ? Math.min(7 + Math.floor(change.rate * 10), 10) : Math.min(5 + Math.floor(Math.abs(change.rate) * 10), 10);
                
                this.addInsight(
                    category,
                    `${Math.abs(change.rate * 100).toFixed(1)}% revenue ${direction} in ${change.month}`,
                    `There was a significant ${direction} of ${Math.abs(change.rate * 100).toFixed(1)}% in monthly revenue during ${change.month}.`,
                    impact,
                    change.rate > 0 
                        ? `Analyze what factors contributed to this success and consider replicating these strategies.`
                        : `Investigate potential causes for this decline and develop strategies to address any underlying issues.`,
                    [{ label: 'Month', value: change.month }, { label: 'Change', value: `${(change.rate * 100).toFixed(1)}%` }]
                );
            }
        }
        
        // Insight: Consecutive monthly declines
        if (consecutiveDeclines >= 2) {
            this.addInsight(
                'critical',
                `${consecutiveDeclines} consecutive months of revenue decline`,
                `The business has experienced ${consecutiveDeclines} consecutive months of declining revenue, which indicates a concerning trend.`,
                8,
                `Conduct a comprehensive analysis to identify the root causes of this decline. Consider reviewing recent market changes, competitor actions, and internal operational factors.`,
                [{ label: 'Consecutive Declines', value: consecutiveDeclines }]
            );
        }
        
        // Insight: Highest AOV months
        const topAOV = sortedByAOV[0];
        this.addInsight(
            'opportunity',
            `Highest AOV in ${topAOV.Month}`,
            `${topAOV.Month} had the highest Average Order Value at $${parseFloat(topAOV.AOV).toFixed(2)}, suggesting effective upselling or premium product popularity.`,
            6,
            `Examine the product mix, promotions, and customer segments active during ${topAOV.Month} to understand what drove higher transaction values. Apply these insights to other periods.`,
            [{ label: 'Month', value: topAOV.Month }, { label: 'AOV', value: `$${parseFloat(topAOV.AOV).toFixed(2)}` }]
        );
        
        // Insight: Highest order volume
        const topOrders = sortedByOrders[0];
        this.addInsight(
            'opportunity',
            `Peak order volume in ${topOrders.Month}`,
            `${topOrders.Month} had the highest number of orders (${topOrders.Orders}), indicating strong customer acquisition or retention.`,
            5,
            `Review marketing campaigns, promotions, and customer engagement strategies used during ${topOrders.Month} to identify successful approaches.`,
            [{ label: 'Month', value: topOrders.Month }, { label: 'Orders', value: topOrders.Orders }]
        );
        
        // Insight: Seasonality detection
        if (seasonalityCheck.seasonal) {
            this.addInsight(
                'trend',
                'Seasonal revenue patterns detected',
                `Analysis indicates a seasonal pattern in revenue, with peaks occurring in ${seasonalityCheck.peakMonths.join(', ')}.`,
                7,
                `Develop season-specific strategies to capitalize on peak periods and mitigate the impact of slower months. Consider inventory planning, marketing budget allocation, and staffing based on these patterns.`,
                [{ label: 'Peak Months', value: seasonalityCheck.peakMonths.join(', ') }]
            );
        }
    }

    /**
     * Detect seasonality in time series data
     */
    detectSeasonality(values) {
        // This is a simplified seasonality detection
        // For a real implementation, more sophisticated statistical methods would be used
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Identify the highest values
        const threshold = Math.max(...values) * 0.8; // 80% of max value
        const peakIndices = values.map((v, i) => v > threshold ? i : -1).filter(i => i !== -1);
        
        // Extract month names from data.monthlySales
        const peakMonths = peakIndices.map(i => {
            const monthStr = this.data.monthlySales[i].Month;
            // Extract month name from formats like "Jan 2025" or just "January"
            const month = monthStr.split(' ')[0]; 
            return month;
        });
        
        // If we have at least 2 peaks and the data spans 12 months, we can check for seasonality
        return {
            seasonal: peakIndices.length >= 2,
            peakMonths: peakMonths
        };
    }

    /**
     * Analyze product category data
     */
    analyzeProductCategories() {
        const categories = this.data.productCategories;
        if (!categories || categories.length === 0) return;
        
        // Find categories with negative growth
        const decliningCategories = categories.filter(cat => parseFloat(cat.YoYGrowth) < 0);
        
        // Find highest margin categories
        const highMarginCategories = [...categories]
            .sort((a, b) => parseFloat(b.Margin) - parseFloat(a.Margin))
            .slice(0, 2);
        
        // Find highest growth categories
        const highGrowthCategories = [...categories]
            .filter(cat => parseFloat(cat.YoYGrowth) > 0.05)
            .sort((a, b) => parseFloat(b.YoYGrowth) - parseFloat(a.YoYGrowth));
        
        // Find categories with high revenue but low margin
        const highVolumeLowMargin = categories.filter(cat => 
            parseFloat(cat.Revenue) > 1000000 && parseFloat(cat.Margin) < 0.3
        );
        
        // Find categories with high margin but low revenue
        const highMarginLowVolume = categories.filter(cat => 
            parseFloat(cat.Revenue) < 700000 && parseFloat(cat.Margin) > 0.35
        );
        
        // Insight: Declining categories
        if (decliningCategories.length > 0) {
            for (const category of decliningCategories) {
                this.addInsight(
                    'critical',
                    `${category.Category} category declining (${(parseFloat(category.YoYGrowth) * 100).toFixed(1)}%)`,
                    `The ${category.Category} category is showing a year-over-year decline of ${Math.abs(parseFloat(category.YoYGrowth) * 100).toFixed(1)}%.`,
                    8,
                    `Conduct a detailed competitive analysis of the ${category.Category} category to identify market trends and competitive pressures. Consider product refreshes, pricing strategy adjustments, or targeted marketing campaigns.`,
                    [
                        { label: 'Category', value: category.Category },
                        { label: 'YoY Growth', value: `${(parseFloat(category.YoYGrowth) * 100).toFixed(1)}%` },
                        { label: 'Revenue', value: `$${parseInt(category.Revenue).toLocaleString()}` }
                    ]
                );
            }
        }
        
        // Insight: High-margin categories
        if (highMarginCategories.length > 0) {
            const topCategory = highMarginCategories[0];
            this.addInsight(
                'opportunity',
                `${topCategory.Category} has highest profit margin (${(parseFloat(topCategory.Margin) * 100).toFixed(0)}%)`,
                `The ${topCategory.Category} category has your highest profit margin at ${(parseFloat(topCategory.Margin) * 100).toFixed(0)}%, representing a significant opportunity for profit growth.`,
                7,
                `Increase marketing investment in the ${topCategory.Category} category and consider expanding the product range. Analyze what makes this category so profitable and apply those lessons to other categories.`,
                [
                    { label: 'Category', value: topCategory.Category },
                    { label: 'Margin', value: `${(parseFloat(topCategory.Margin) * 100).toFixed(0)}%` },
                    { label: 'Revenue', value: `$${parseInt(topCategory.Revenue).toLocaleString()}` },
                    { label: 'Profit', value: `$${parseInt(topCategory.Profit).toLocaleString()}` }
                ]
            );
        }
        
        // Insight: High growth categories
        if (highGrowthCategories.length > 0) {
            const fastestGrowing = highGrowthCategories[0];
            this.addInsight(
                'opportunity',
                `${fastestGrowing.Category} is fastest growing (${(parseFloat(fastestGrowing.YoYGrowth) * 100).toFixed(1)}%)`,
                `The ${fastestGrowing.Category} category is showing strong growth at ${(parseFloat(fastestGrowing.YoYGrowth) * 100).toFixed(1)}% year-over-year.`,
                8,
                `Capitalize on this growth by increasing inventory levels, expanding product selection, and allocating additional marketing resources to the ${fastestGrowing.Category} category.`,
                [
                    { label: 'Category', value: fastestGrowing.Category },
                    { label: 'YoY Growth', value: `${(parseFloat(fastestGrowing.YoYGrowth) * 100).toFixed(1)}%` },
                    { label: 'Revenue', value: `$${parseInt(fastestGrowing.Revenue).toLocaleString()}` }
                ]
            );
        }
        
        // Insight: High volume, low margin categories
        if (highVolumeLowMargin.length > 0) {
            const category = highVolumeLowMargin[0];
            this.addInsight(
                'performance',
                `${category.Category} has high revenue but low margins`,
                `${category.Category} generates $${(parseFloat(category.Revenue)/1000000).toFixed(1)}M in revenue but operates at only ${(parseFloat(category.Margin) * 100).toFixed(1)}% margin.`,
                6,
                `Evaluate pricing strategies, supply chain costs, and potential premium products for the ${category.Category} category to improve margins while maintaining sales volume.`,
                [
                    { label: 'Category', value: category.Category },
                    { label: 'Revenue', value: `$${parseInt(category.Revenue).toLocaleString()}` },
                    { label: 'Margin', value: `${(parseFloat(category.Margin) * 100).toFixed(1)}%` }
                ]
            );
        }
        
        // Insight: High margin, low volume categories
        if (highMarginLowVolume.length > 0) {
            const category = highMarginLowVolume[0];
            this.addInsight(
                'opportunity',
                `${category.Category} has high margin but low sales volume`,
                `${category.Category} operates at a strong ${(parseFloat(category.Margin) * 100).toFixed(1)}% margin but only generates $${(parseFloat(category.Revenue)/1000).toFixed(0)}K in revenue.`,
                7,
                `Consider expanding marketing efforts for ${category.Category} to increase sales volume while maintaining the strong profit margins, potentially through targeted advertising and expanding the product range.`,
                [
                    { label: 'Category', value: category.Category },
                    { label: 'Margin', value: `${(parseFloat(category.Margin) * 100).toFixed(1)}%` },
                    { label: 'Revenue', value: `$${parseInt(category.Revenue).toLocaleString()}` }
                ]
            );
        }
    }

    /**
     * Analyze traffic sources data
     */
    analyzeTrafficSources() {
        const sources = this.data.trafficSources;
        if (!sources || sources.length === 0) return;
        
        // Calculate conversion rate and sort
        const sortedByCR = [...sources].sort((a, b) => 
            parseFloat(b.ConversionRate) - parseFloat(a.ConversionRate)
        );
        
        // Calculate ROI (Revenue / Visits) as a proxy for channel efficiency
        const withROI = sources.map(source => ({
            ...source,
            channelROI: parseFloat(source.Revenue) / parseFloat(source.Visits)
        })).sort((a, b) => b.channelROI - a.channelROI);
        
        // Find sources with high bounce rate
        const highBounce = sources.filter(source => 
            parseFloat(source.BounceRate) > 0.5
        ).sort((a, b) => parseFloat(b.BounceRate) - parseFloat(a.BounceRate));
        
        // Find sources with high potential (low conversion but good AOV)
        const highPotential = sources.filter(source => 
            parseFloat(source.ConversionRate) < 0.03 && parseFloat(source.AOV) > 85
        );
        
        // Insight: Best converting channel
        const bestCR = sortedByCR[0];
        this.addInsight(
            'performance',
            `${bestCR.Source} has highest conversion rate (${(parseFloat(bestCR.ConversionRate) * 100).toFixed(2)}%)`,
            `${bestCR.Source} traffic converts at ${(parseFloat(bestCR.ConversionRate) * 100).toFixed(2)}%, significantly higher than other channels.`,
            8,
            `Increase investment in ${bestCR.Source} marketing initiatives while analyzing what makes this channel so effective. Apply these learnings to improve conversion rates across other channels.`,
            [
                { label: 'Source', value: bestCR.Source },
                { label: 'Conversion Rate', value: `${(parseFloat(bestCR.ConversionRate) * 100).toFixed(2)}%` },
                { label: 'AOV', value: `$${parseFloat(bestCR.AOV).toFixed(2)}` }
            ]
        );
        
        // Insight: Most efficient channel (by ROI proxy)
        const bestROI = withROI[0];
        this.addInsight(
            'opportunity',
            `${bestROI.Source} generates highest revenue per visitor ($${bestROI.channelROI.toFixed(2)})`,
            `${bestROI.Source} traffic generates $${bestROI.channelROI.toFixed(2)} in revenue per visitor, making it your most efficient acquisition channel.`,
            9,
            `Scale up investment in ${bestROI.Source} marketing to capitalize on its efficiency. Analyze the customer journey from this source to identify what drives its superior performance.`,
            [
                { label: 'Source', value: bestROI.Source },
                { label: 'Revenue per Visitor', value: `$${bestROI.channelROI.toFixed(2)}` },
                { label: 'Conversion Rate', value: `${(parseFloat(bestROI.ConversionRate) * 100).toFixed(2)}%` }
            ]
        );
        
        // Insight: High bounce rate sources
        if (highBounce.length > 0) {
            const worstBounce = highBounce[0];
            this.addInsight(
                'critical',
                `${worstBounce.Source} has excessive bounce rate (${(parseFloat(worstBounce.BounceRate) * 100).toFixed(0)}%)`,
                `${worstBounce.Source} traffic has a concerning bounce rate of ${(parseFloat(worstBounce.BounceRate) * 100).toFixed(0)}%, indicating potential issues with landing page relevance or user experience.`,
                7,
                `Review and optimize landing pages for ${worstBounce.Source} traffic. Ensure message match between ads and landing pages, improve page load speed, and enhance mobile experience.`,
                [
                    { label: 'Source', value: worstBounce.Source },
                    { label: 'Bounce Rate', value: `${(parseFloat(worstBounce.BounceRate) * 100).toFixed(0)}%` },
                    { label: 'Visits', value: parseFloat(worstBounce.Visits).toLocaleString() }
                ]
            );
        }
        
        // Insight: High potential channels
        if (highPotential.length > 0) {
            const channel = highPotential[0];
            this.addInsight(
                'opportunity',
                `${channel.Source} has untapped potential with high AOV`,
                `${channel.Source} traffic has a high AOV of $${parseFloat(channel.AOV).toFixed(2)} but a low conversion rate of ${(parseFloat(channel.ConversionRate) * 100).toFixed(2)}%.`,
                6,
                `Focus on conversion rate optimization for ${channel.Source} traffic. A small improvement in conversion rate could yield significant revenue given the high AOV.`,
                [
                    { label: 'Source', value: channel.Source },
                    { label: 'AOV', value: `$${parseFloat(channel.AOV).toFixed(2)}` },
                    { label: 'Conversion Rate', value: `${(parseFloat(channel.ConversionRate) * 100).toFixed(2)}%` }
                ]
            );
        }
    }

    /**
     * Analyze customer demographics data
     */
    analyzeDemographics() {
        const demographics = this.data.customerDemographics;
        if (!demographics || demographics.length === 0) return;
        
        // Group by gender
        const genderGroups = this.groupBy(demographics, 'Gender');
        
        // Find highest value segments by average spend
        const highestAvgSpend = [...demographics].sort((a, b) => 
            parseFloat(b.AvgAnnualSpend) - parseFloat(a.AvgAnnualSpend)
        ).slice(0, 3);
        
        // Find largest customer segments by count
        const largestSegments = [...demographics].sort((a, b) => 
            parseInt(b.CustomerCount) - parseInt(a.CustomerCount)
        ).slice(0, 3);
        
        // Find highest total revenue segments
        const highestTotalSpend = [...demographics].sort((a, b) => 
            parseFloat(b.TotalSpend) - parseFloat(a.TotalSpend)
        ).slice(0, 3);
        
        // Calculate gender difference in spending
        if (genderGroups.Male && genderGroups.Female) {
            const maleTotal = genderGroups.Male.reduce((sum, item) => sum + parseFloat(item.TotalSpend), 0);
            const femaleTotal = genderGroups.Female.reduce((sum, item) => sum + parseFloat(item.TotalSpend), 0);
            const maleAvg = maleTotal / genderGroups.Male.reduce((sum, item) => sum + parseInt(item.CustomerCount), 0);
            const femaleAvg = femaleTotal / genderGroups.Female.reduce((sum, item) => sum + parseInt(item.CustomerCount), 0);
            
            const diff = Math.abs(maleAvg - femaleAvg);
            const diffPercent = diff / Math.min(maleAvg, femaleAvg) * 100;
            
            if (diffPercent > 10) {
                const higherGender = maleAvg > femaleAvg ? 'Male' : 'Female';
                this.addInsight(
                    'trend',
                    `${higherGender} customers spend ${diffPercent.toFixed(1)}% more annually`,
                    `On average, ${higherGender} customers spend $${Math.max(maleAvg, femaleAvg).toFixed(2)} annually, which is ${diffPercent.toFixed(1)}% more than ${higherGender === 'Male' ? 'Female' : 'Male'} customers.`,
                    7,
                    `Develop targeted marketing strategies for ${higherGender === 'Male' ? 'Female' : 'Male'} customers to increase their average spend, while continuing to nurture the high-value ${higherGender} segment.`,
                    [
                        { label: 'Male Avg Spend', value: `$${maleAvg.toFixed(2)}` },
                        { label: 'Female Avg Spend', value: `$${femaleAvg.toFixed(2)}` },
                        { label: 'Difference', value: `${diffPercent.toFixed(1)}%` }
                    ]
                );
            }
        }
        
        // Insight: Highest value age-gender segment
        const topSegment = highestAvgSpend[0];
        this.addInsight(
            'opportunity',
            `${topSegment.AgeGroup} ${topSegment.Gender} customers are highest value`,
            `${topSegment.AgeGroup} ${topSegment.Gender} customers spend an average of $${parseFloat(topSegment.AvgAnnualSpend).toFixed(2)} annually, making them your most valuable demographic segment.`,
            8,
            `Develop premium product offerings and loyalty programs specifically for the ${topSegment.AgeGroup} ${topSegment.Gender} segment. Increase marketing efforts to acquire more customers in this high-value demographic.`,
            [
                { label: 'Segment', value: `${topSegment.AgeGroup} ${topSegment.Gender}` },
                { label: 'Avg Annual Spend', value: `$${parseFloat(topSegment.AvgAnnualSpend).toFixed(2)}` },
                { label: 'Customer Count', value: topSegment.CustomerCount }
            ]
        );
        
        // Insight: Largest customer segment
        const largestSegment = largestSegments[0];
        this.addInsight(
            'trend',
            `${largestSegment.AgeGroup} ${largestSegment.Gender} is your largest customer segment`,
            `The ${largestSegment.AgeGroup} ${largestSegment.Gender} segment represents your largest customer base with ${parseInt(largestSegment.CustomerCount).toLocaleString()} customers.`,
            6,
            `Ensure product offerings and marketing messages are well-aligned with the preferences of ${largestSegment.AgeGroup} ${largestSegment.Gender} customers to maximize retention and lifetime value.`,
            [
                { label: 'Segment', value: `${largestSegment.AgeGroup} ${largestSegment.Gender}` },
                { label: 'Customer Count', value: parseInt(largestSegment.CustomerCount).toLocaleString() },
                { label: 'Avg Annual Spend', value: `$${parseFloat(largestSegment.AvgAnnualSpend).toFixed(2)}` }
            ]
        );
        
        // Insight: Highest total revenue segment
        const highestRevenueSegment = highestTotalSpend[0];
        this.addInsight(
            'performance',
            `${highestRevenueSegment.AgeGroup} ${highestRevenueSegment.Gender} generates highest total revenue`,
            `The ${highestRevenueSegment.AgeGroup} ${highestRevenueSegment.Gender} segment generates $${(parseFloat(highestRevenueSegment.TotalSpend)/1000000).toFixed(2)}M in annual revenue, making them your most important customer segment by total spend.`,
            9,
            `Prioritize customer experience and retention initiatives for the ${highestRevenueSegment.AgeGroup} ${highestRevenueSegment.Gender} segment. Develop exclusive offerings and implement a VIP program to enhance loyalty.`,
            [
                { label: 'Segment', value: `${highestRevenueSegment.AgeGroup} ${highestRevenueSegment.Gender}` },
                { label: 'Total Annual Spend', value: `$${parseInt(highestRevenueSegment.TotalSpend).toLocaleString()}` },
                { label: 'Customer Count', value: parseInt(highestRevenueSegment.CustomerCount).toLocaleString() }
            ]
        );
    }

    /**
     * Analyze marketing campaign data
     */
    analyzeMarketingCampaigns() {
        const campaigns = this.data.marketingCampaigns;
        if (!campaigns || campaigns.length === 0) return;
        
        // Group campaigns by type
        const campaignTypes = this.groupBy(campaigns, 'Type');
        
        // Calculate average ROI by campaign type
        const typePerformance = Object.entries(campaignTypes).map(([type, campaigns]) => {
            const avgROI = campaigns.reduce((sum, camp) => sum + parseFloat(camp.ROI_Percent), 0) / campaigns.length;
            const totalSpend = campaigns.reduce((sum, camp) => sum + parseFloat(camp.Spend), 0);
            const totalRevenue = campaigns.reduce((sum, camp) => sum + parseFloat(camp.Revenue), 0);
            return { type, avgROI, totalSpend, totalRevenue, campaigns: campaigns.length };
        }).sort((a, b) => b.avgROI - a.avgROI);
        
        // Find best and worst performing campaigns
        const sortedByROI = [...campaigns].sort((a, b) => 
            parseFloat(b.ROI_Percent) - parseFloat(a.ROI_Percent)
        );
        
        const bestCampaign = sortedByROI[0];
        const worstCampaign = sortedByROI[sortedByROI.length - 1];
        
        // Find campaigns with high CAC
        const highCAC = campaigns.filter(camp => 
            parseFloat(camp.CAC) > 90
        ).sort((a, b) => parseFloat(b.CAC) - parseFloat(a.CAC));
        
        // Insight: Most effective campaign type
        if (typePerformance.length > 0) {
            const bestType = typePerformance[0];
            this.addInsight(
                'opportunity',
                `${bestType.type} campaigns deliver highest ROI (${bestType.avgROI.toFixed(1)}%)`,
                `${bestType.type} campaigns consistently outperform other types with an average ROI of ${bestType.avgROI.toFixed(1)}%.`,
                8,
                `Increase allocation to ${bestType.type} campaigns in your marketing budget. Analyze the success factors of these campaigns and apply them to other marketing initiatives.`,
                [
                    { label: 'Campaign Type', value: bestType.type },
                    { label: 'Avg ROI', value: `${bestType.avgROI.toFixed(1)}%` },
                    { label: 'Total Revenue', value: `$${parseInt(bestType.totalRevenue).toLocaleString()}` },
                    { label: 'Total Spend', value: `$${parseInt(bestType.totalSpend).toLocaleString()}` }
                ]
            );
        }
        
        // Insight: Most effective individual campaign
        this.addInsight(
            'performance',
            `${bestCampaign.Campaign} is your highest-ROI campaign (${parseFloat(bestCampaign.ROI_Percent).toFixed(1)}%)`,
            `The ${bestCampaign.Campaign} campaign achieved an exceptional ROI of ${parseFloat(bestCampaign.ROI_Percent).toFixed(1)}%, generating $${parseInt(bestCampaign.Revenue).toLocaleString()} in revenue from $${parseInt(bestCampaign.Spend).toLocaleString()} in spend.`,
            9,
            `Scale this campaign if possible, and apply its successful elements to future campaigns. Analyze what made this campaign so effective (messaging, channel, timing, offer, etc.).`,
            [
                { label: 'Campaign', value: bestCampaign.Campaign },
                { label: 'Type', value: bestCampaign.Type },
                { label: 'ROI', value: `${parseFloat(bestCampaign.ROI_Percent).toFixed(1)}%` },
                { label: 'Revenue', value: `$${parseInt(bestCampaign.Revenue).toLocaleString()}` },
                { label: 'New Customers', value: bestCampaign.NewCustomers }
            ]
        );
        
        // Insight: Least effective campaign
        this.addInsight(
            'critical',
            `${worstCampaign.Campaign} underperforming with ${parseFloat(worstCampaign.ROI_Percent).toFixed(1)}% ROI`,
            `The ${worstCampaign.Campaign} campaign delivered the lowest ROI at ${parseFloat(worstCampaign.ROI_Percent).toFixed(1)}%, well below your portfolio average.`,
            7,
            `Consider restructuring or discontinuing this campaign. Analyze what factors contributed to its underperformance and adjust future campaign planning accordingly.`,
            [
                { label: 'Campaign', value: worstCampaign.Campaign },
                { label: 'Type', value: worstCampaign.Type },
                { label: 'ROI', value: `${parseFloat(worstCampaign.ROI_Percent).toFixed(1)}%` },
                { label: 'Spend', value: `$${parseInt(worstCampaign.Spend).toLocaleString()}` },
                { label: 'CAC', value: `$${parseFloat(worstCampaign.CAC).toFixed(2)}` }
            ]
        );
        
        // Insight: High CAC campaigns
        if (highCAC.length > 0) {
            const expensive = highCAC[0];
            this.addInsight(
                'critical',
                `${expensive.Campaign} has concerning customer acquisition cost ($${parseFloat(expensive.CAC).toFixed(2)})`,
                `The ${expensive.Campaign} campaign has an exceptionally high customer acquisition cost of $${parseFloat(expensive.CAC).toFixed(2)}, significantly increasing your marketing expenses.`,
                8,
                `Review the targeting, messaging, and conversion funnel for this campaign to identify inefficiencies. Consider A/B testing alternative approaches or reallocating budget to more efficient channels.`,
                [
                    { label: 'Campaign', value: expensive.Campaign },
                    { label: 'Type', value: expensive.Type },
                    { label: 'CAC', value: `$${parseFloat(expensive.CAC).toFixed(2)}` },
                    { label: 'ROI', value: `${parseFloat(expensive.ROI_Percent).toFixed(1)}%` },
                    { label: 'New Customers', value: expensive.NewCustomers }
                ]
            );
        }
    }

    /**
     * Helper function to group array items by a property
     */
    groupBy(array, key) {
        return array.reduce((result, item) => {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
    }

    /**
     * Get insights by category
     */
    getInsightsByCategory(category) {
        return this.insightCategories[category] || [];
    }

    /**
     * Get all critical insights
     */
    getCriticalInsights() {
        return this.insightCategories.critical || [];
    }

    /**
     * Get top insights across all categories
     */
    getTopInsights(limit = 5) {
        return this.insights.slice(0, limit);
    }
}

// Export the InsightsEngine class for use in the main dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InsightsEngine };
} else {
    // For browser use
    window.InsightsEngine = InsightsEngine;
}