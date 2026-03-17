import axios from 'axios';

class GovApiService {
  constructor() {
    this.dataGovKey = process.env.DATA_GOV_INDIA_API_KEY;
    this.apiSetuId = process.env.API_SETU_CLIENT_ID;
    this.apiSetuSecret = process.env.API_SETU_CLIENT_SECRET;
  }

  async getEconomicTrends() {
    // If keys are missing, return high-quality mock data for India
    if (!this.dataGovKey) {
      return this.getMockEconomicData();
    }

    try {
      // Example call to data.gov.in (hypothetical endpoint for CPI)
      // Note: Actual endpoints require specific resource IDs from the catalog
      // const response = await axios.get(`https://api.data.gov.in/resource/RESOURCE_ID?api-key=${this.dataGovKey}&format=json`);
      return this.getMockEconomicData(); // Defaulting to mock for reliability in dev
    } catch (error) {
      console.error('Error fetching gov data:', error);
      return this.getMockEconomicData();
    }
  }

  getMockEconomicData() {
    return {
      inflation: {
        headline: 5.6,
        food: 7.2,
        core: 4.1,
        trend: 'decreasing',
        source: 'MoSPI / RBI'
      },
      spending: {
        infrastructure: '↑ 11% (Budget 2024-25)',
        education: '↑ 5% (Budget 2024-25)',
        defense: '↑ 8% (Budget 2024-25)'
      },
      taxation: {
        gstCollection: '₹1.70 Lakh Cr (Avg)',
        incomeTaxSlabs: 'New Regime Standard Deduction: ₹75,000',
        updates: 'Lowered tax for mid-income in new regime.'
      },
      updates: [
        { id: 1, title: 'Pradhan Mantri Awas Yojana extension announced.', date: '2024-03-10' },
        { id: 2, title: 'RBI maintains repo rate at 6.5%.', date: '2024-02-08' },
        { id: 3, title: 'Digital Rupee (e-Rupee) pilot expands to more cities.', date: '2024-03-01' }
      ]
    };
  }
}

export default new GovApiService();
