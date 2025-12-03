import {
    getFoundationData,
    getAnomalyData,
    getOutlierData
} from '../utils/dataFetcher'; // Assuming these utilities exist

/**
 * Service that provides the data for the Data Garden visualization.
 * It processes the Foundation's internal datasets and formats them for rendering,
 * including metadata about outliers and anomalies.
 */
class DataGardenService {
    /**
     * Fetches and processes all necessary data for the Data Garden visualization.
     * @returns {Promise<object>} A promise that resolves to an object containing
     *                            processed foundation data, anomaly data, and outlier data.
     */
    async getAllDataForVisualization() {
        try {
            const [foundationData, anomalyData, outlierData] = await Promise.all([
                getFoundationData(),
                getAnomalyData(),
                getOutlierData(),
            ]);

            const processedFoundationData = this.processFoundationData(foundationData);
            const processedAnomalyData = this.processAnomalyData(anomalyData);
            const processedOutlierData = this.processOutlierData(outlierData);

            return {
                foundation: processedFoundationData,
                anomalies: processedAnomalyData,
                outliers: processedOutlierData,
            };
        } catch (error) {
            console.error('Error fetching or processing Data Garden data:', error);
            throw error; // Re-throw to allow calling services to handle errors
        }
    }

    /**
     * Processes raw foundation data into a format suitable for visualization.
     * This is a placeholder and should be implemented based on the actual data structure.
     * @param {Array<object>} data - The raw foundation data.
     * @returns {Array<object>} Processed foundation data.
     */
    processFoundationData(data) {
        // Example processing: Ensure data has required fields, perhaps add IDs, etc.
        if (!Array.isArray(data)) {
            console.warn('processFoundationData received non-array data:', data);
            return [];
        }
        return data.map((item, index) => ({
            id: item.id || `foundation-${index}`, // Ensure unique IDs
            value: item.value,
            timestamp: item.timestamp,
            category: item.category,
            // Add any other relevant fields for visualization
            ...item, // Include original properties
        }));
    }

    /**
     * Processes raw anomaly data into a format suitable for visualization.
     * This is a placeholder and should be implemented based on the actual data structure.
     * @param {Array<object>} data - The raw anomaly data.
     * @returns {Array<object>} Processed anomaly data, including metadata.
     */
    processAnomalyData(data) {
        // Example processing: Link anomalies to foundation data, add severity, description, etc.
        if (!Array.isArray(data)) {
            console.warn('processAnomalyData received non-array data:', data);
            return [];
        }
        return data.map((item, index) => ({
            id: item.id || `anomaly-${index}`,
            foundationItemId: item.foundationItemId, // Link to foundation data
            severity: item.severity || 'medium', // Default severity
            description: item.description || 'Anomalous event detected',
            timestamp: item.timestamp,
            // Add any other relevant fields for visualization
            ...item, // Include original properties
        }));
    }

    /**
     * Processes raw outlier data into a format suitable for visualization.
     * This is a placeholder and should be implemented based on the actual data structure.
     * @param {Array<object>} data - The raw outlier data.
     * @returns {Array<object>} Processed outlier data, including metadata.
     */
    processOutlierData(data) {
        // Example processing: Link outliers to foundation data, add reason, threshold, etc.
        if (!Array.isArray(data)) {
            console.warn('processOutlierData received non-array data:', data);
            return [];
        }
        return data.map((item, index) => ({
            id: item.id || `outlier-${index}`,
            foundationItemId: item.foundationItemId, // Link to foundation data
            reason: item.reason || 'Value outside expected range',
            threshold: item.threshold,
            timestamp: item.timestamp,
            // Add any other relevant fields for visualization
            ...item, // Include original properties
        }));
    }

    /**
     * Fetches and processes specific foundation data by ID.
     * @param {string} id - The ID of the foundation data item.
     * @returns {Promise<object|null>} A promise that resolves to the processed foundation data item or null if not found.
     */
    async getFoundationDataItem(id) {
        try {
            const foundationData = await getFoundationData();
            const item = foundationData.find(d => d.id === id);
            if (item) {
                return this.processFoundationData([item])[0];
            }
            return null;
        } catch (error) {
            console.error(`Error fetching foundation data item with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Fetches and processes anomalies related to a specific foundation data item.
     * @param {string} foundationItemId - The ID of the foundation data item.
     * @returns {Promise<Array<object>>} A promise that resolves to an array of processed anomaly data items.
     */
    async getAnomaliesForFoundationItem(foundationItemId) {
        try {
            const anomalyData = await getAnomalyData();
            const relatedAnomalies = anomalyData.filter(a => a.foundationItemId === foundationItemId);
            return this.processAnomalyData(relatedAnomalies);
        } catch (error) {
            console.error(`Error fetching anomalies for foundation item ID ${foundationItemId}:`, error);
            throw error;
        }
    }

    /**
     * Fetches and processes outliers related to a specific foundation data item.
     * @param {string} foundationItemId - The ID of the foundation data item.
     * @returns {Promise<Array<object>>} A promise that resolves to an array of processed outlier data items.
     */
    async getOutliersForFoundationItem(foundationItemId) {
        try {
            const outlierData = await getOutlierData();
            const relatedOutliers = outlierData.filter(o => o.foundationItemId === foundationItemId);
            return this.processOutlierData(relatedOutliers);
        } catch (error) {
            console.error(`Error fetching outliers for foundation item ID ${foundationItemId}:`, error);
            throw error;
        }
    }
}

export default new DataGardenService();