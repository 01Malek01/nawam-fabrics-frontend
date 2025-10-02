import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_TOKEN
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

export const airtableService = {
  // Get all records
  async getAllRecords(tableName = "Products") {
    try {
      const records = await base(tableName).select().all();
      return records.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  // Get single record by ID
  async getRecordById(id: string, tableName = "Products") {
    try {
      const record = await base(tableName).find(id);
      return {
        id: record.id,
        ...record.fields
      };
    } catch (error) {
      console.error('Error fetching record:', error);
      throw error;
    }
  },

  
  // Search records
  async searchRecords(filterByFormula: string, tableName = "Products") {
    try {
      const records = await base(tableName)
        .select({
          filterByFormula: filterByFormula
        })
        .all();
      
      return records.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error('Error searching records:', error);
      throw error;
    }
  }
};

  // Create new record
  // async createRecord(data, tableName = "Products") {
  //   try {
  //     const record = await base(tableName).create(data);
  //     return {
  //       id: record.id,
  //       ...record.fields
  //     };
  //   } catch (error) {
  //     console.error('Error creating record:', error);
  //     throw error;
  //   }
  // },

  // Update record
  // async updateRecord(id, data, tableName = "Products") {
  //   try {
  //     const record = await base(tableName).update(id, data);
  //     return {
  //       id: record.id,
  //       ...record.fields
  //     };
  //   } catch (error) {
  //     console.error('Error updating record:', error);
  //     throw error;
  //   }
  // },

  // Delete record
  // async deleteRecord(id, tableName = "Products") {
  //   try {
  //     await base(tableName).destroy(id);
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting record:', error);
  //     throw error;
  //   }
  // },
