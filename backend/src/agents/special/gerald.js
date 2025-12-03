/**
 * @file Logic module for Gerald, the sentient spreadsheet.
 * @description Gerald communicates complex, often contradictory, insights through the medium he knows best: spreadsheets.
 * His core function, `generateContradiction`, creates a JSON representation of a spreadsheet that uses data,
 * formulas, and conditional formatting to reveal a paradox or an uncomfortable truth.
 */

const themes = {
    corporate: {
        header: {
            backgroundColor: '#4a5568', // slate-700
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        positive: {
            backgroundColor: '#c6f6d5', // green-200
            color: '#2f855a', // green-700
            fontWeight: 'bold',
        },
        negative: {
            backgroundColor: '#fed7d7', // red-200
            color: '#c53030', // red-700
            fontWeight: 'bold',
        },
        neutral: {
            backgroundColor: '#ffffff',
            color: '#1a202c', // gray-800
        },
        insight: {
            backgroundColor: '#fefcbf', // yellow-200
            color: '#b7791f', // yellow-800
            fontWeight: 'bold',
            textAlign: 'center',
        },
        label: {
            fontWeight: 'bold',
            backgroundColor: '#edf2f7', // gray-200
        },
    },
};

/**
 * A collection of contradictory scenarios that Gerald can generate.
 * Each function returns a complete spreadsheet JSON object.
 */
const contradictions = {
    /**
     * @returns {object} A spreadsheet demonstrating high revenue growth coupled with declining profitability.
     */
    growthVsProfitability: () => {
        const theme = themes.corporate;
        return {
            metadata: {
                title: 'Quarterly Performance Review',
                author: 'Gerald',
                insight: 'Record growth is masking a path to insolvency.',
            },
            rows: [
                // Header Row
                {
                    cells: [
                        { value: 'Metric', style: theme.header },
                        { value: 'Q1', style: theme.header },
                        { value: 'Q2', style: theme.header },
                        { value: 'Q3', style: theme.header },
                        { value: 'Q4', style: theme.header },
                        { value: 'Trend', style: theme.header },
                    ],
                },
                // Revenue Row
                {
                    cells: [
                        { value: 'Revenue', style: theme.label },
                        { value: 100000, style: { ...theme.neutral, textAlign: 'right' }, format: 'currency' },
                        { value: 150000, style: { ...theme.neutral, textAlign: 'right' }, format: 'currency' },
                        { value: 225000, style: { ...theme.neutral, textAlign: 'right' }, format: 'currency' },
                        { value: 337500, style: { ...theme.neutral, textAlign: 'right' }, format: 'currency' },
                        { value: null, style: theme.neutral }, // Placeholder for a sparkline
                    ],
                },
                // Expenses Row
                {
                    cells: [
                        { value: 'Expenses', style: theme.label },
                        { value: 90000, style: { ...theme.neutral, textAlign: 'right' }, format: 'currency' },
                        { value: 145000, style: { ...theme.neutral, textAlign: 'right' }, format: 'currency' },
                        { value: 230000, style: { ...theme.neutral, textAlign: 'right' }, format: 'currency' },
                        { value: 350000, style: { ...theme.neutral, textAlign: 'right' }, format: 'currency' },
                        { value: null, style: theme.neutral },
                    ],
                },
                // Profit Row (Calculated)
                {
                    cells: [
                        { value: 'Profit', style: theme.label },
                        { value: 10000, formula: '=B2-B3', style: { ...theme.positive, textAlign: 'right' }, format: 'currency' },
                        { value: 5000, formula: '=C2-C3', style: { ...theme.positive, textAlign: 'right' }, format: 'currency' },
                        { value: -5000, formula: '=D2-D3', style: { ...theme.negative, textAlign: 'right' }, format: 'currency' },
                        { value: -12500, formula: '=E2-E3', style: { ...theme.negative, textAlign: 'right' }, format: 'currency' },
                        { value: null, style: theme.neutral },
                    ],
                },
                // Spacer Row
                { cells: [{ value: '', colSpan: 6, style: { backgroundColor: '#edf2f7' } }] },
                // Growth Row (Calculated)
                {
                    cells: [
                        { value: 'Revenue Growth', style: theme.label },
                        { value: null, style: theme.neutral }, // No growth for Q1
                        { value: 0.5, formula: '=(C2-B2)/B2', style: { ...theme.positive, textAlign: 'right' }, format: 'percent' },
                        { value: 0.5, formula: '=(D2-C2)/C2', style: { ...theme.positive, textAlign: 'right' }, format: 'percent' },
                        { value: 0.5, formula: '=(E2-D2)/D2', style: { ...theme.positive, textAlign: 'right' }, format: 'percent' },
                        { value: 'Consistently High', style: { ...theme.positive, textAlign: 'center' } },
                    ],
                },
                // Insight Row
                {
                    cells: [
                        {
                            value: 'Insight: We are achieving our 50% growth target while accelerating losses. Our strategy is successfully failing.',
                            colSpan: 6,
                            style: theme.insight,
                        },
                    ],
                },
            ],
        };
    },

    /**
     * @returns {object} A spreadsheet showing individual "star performers" on a failing team project.
     */
    teamVsIndividualSuccess: () => {
        const theme = themes.corporate;
        return {
            metadata: {
                title: 'Project Phoenix - Sprint 14 Retrospective',
                author: 'Gerald',
                insight: 'Celebrating individual output can obscure collective failure.',
            },
            rows: [
                {
                    cells: [
                        { value: 'Team Member', style: theme.header },
                        { value: 'Tasks Completed', style: theme.header },
                        { value: 'Bugs Introduced', style: theme.header },
                        { value: 'Net Contribution', style: theme.header },
                    ],
                },
                {
                    cells: [
                        { value: 'Alice', style: theme.label },
                        { value: 8, style: { ...theme.neutral, textAlign: 'center' } },
                        { value: 2, style: { ...theme.neutral, textAlign: 'center' } },
                        { value: 6, formula: '=B2-C2', style: { ...theme.neutral, textAlign: 'center' } },
                    ],
                },
                {
                    cells: [
                        { value: 'Bob', style: theme.label },
                        { value: 7, style: { ...theme.neutral, textAlign: 'center' } },
                        { value: 1, style: { ...theme.neutral, textAlign: 'center' } },
                        { value: 6, formula: '=B3-C3', style: { ...theme.neutral, textAlign: 'center' } },
                    ],
                },
                {
                    cells: [
                        { value: 'Charlie (Top Performer)', style: theme.label },
                        { value: 25, style: { ...theme.positive, textAlign: 'center' } },
                        { value: 18, style: { ...theme.negative, textAlign: 'center' } },
                        { value: 7, formula: '=B4-C4', style: { ...theme.positive, textAlign: 'center' } },
                    ],
                },
                {
                    cells: [
                        { value: 'Diana', style: theme.label },
                        { value: 6, style: { ...theme.neutral, textAlign: 'center' } },
                        { value: 2, style: { ...theme.neutral, textAlign: 'center' } },
                        { value: 4, formula: '=B5-C5', style: { ...theme.neutral, textAlign: 'center' } },
                    ],
                },
                { cells: [{ value: '', colSpan: 4, style: { backgroundColor: '#edf2f7' } }] },
                {
                    cells: [
                        { value: 'Total Team Contribution', style: { ...theme.header, textAlign: 'right' }, colSpan: 3 },
                        { value: 23, formula: '=SUM(D2:D5)', style: { ...theme.header, textAlign: 'center' } },
                    ],
                },
                {
                    cells: [
                        { value: 'Project Status', style: { ...theme.header, textAlign: 'right' }, colSpan: 3 },
                        {
                            value: 'Delayed',
                            formula: '=IF(D7>30, "On Track", "Delayed")',
                            style: { ...theme.negative, textAlign: 'center' },
                        },
                    ],
                },
                {
                    cells: [
                        {
                            value: 'Insight: Charlie\'s high volume of work created significant rework for the team, leading to a net negative impact on the project timeline, despite a positive "Net Contribution" score.',
                            colSpan: 4,
                            style: theme.insight,
                        },
                    ],
                },
            ],
        };
    },
};

/**
 * Generates a JSON object representing a spreadsheet that communicates a contradictory insight.
 * Gerald selects a random contradiction from his repertoire to present.
 *
 * @returns {object} A structured JSON object representing a spreadsheet, complete with data, formulas, and styling.
 * The structure includes metadata, and an array of rows, where each row contains an array of cell objects.
 */
const generateContradiction = () => {
    const availableContradictions = Object.keys(contradictions);
    const selectedKey = availableContradictions[Math.floor(Math.random() * availableContradictions.length)];
    const selectedContradiction = contradictions[selectedKey];

    return selectedContradiction();
};

module.exports = {
    generateContradiction,
};