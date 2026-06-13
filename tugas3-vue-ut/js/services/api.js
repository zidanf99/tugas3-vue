// File: /js/services/api.js

const ApiService = {
    async fetchBahanAjar() {
        try {
            // Path JSON
            const response = await fetch('./data/dataBahanAjar.json'); 
            if (!response.ok) {
                throw new Error('Gagal memuat data JSON');
            }
            return await response.json();s
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }
};