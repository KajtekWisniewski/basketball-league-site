const fs = require('fs');

class DatabaseHandler {
  async getAllDocuments(model, populateArray = '') {
    try {
      const documents = await model.find().populate(populateArray);
      return documents;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async patchDocument(model, identifier, updateData) {
    try {
      // const allowedFields = Object.keys(model.schema.paths);
      // const filteredUpdateData = {};
      // Object.keys(updateData).forEach((field) => {
      //   if (allowedFields.includes(field)) {
      //     filteredUpdateData[field] = updateData[field];
      //   }
      // });

      const document = await model.findOneAndUpdate(identifier, updateData, {
        new: true
      });
      return document;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async getSingleDocument(model, identifier, populateArray = '') {
    try {
      const document = await model.findOne({ _id: identifier }).populate(populateArray);
      return document;
    } catch (error) {
      console.error('Error getting the document', error);
      throw error;
    }
  }

  async addDocument(model, data) {
    try {
      const { name } = data;
      const existingDocument = await model.findOne({ name });
      if (existingDocument) {
        throw new Error(`Document with name '${name}' already exists.`);
      }
      if (
        Object.values(data).some((value) => {
          if (typeof value === 'string') {
            return value.trim() === '';
          }
          return value === '' || value === null || value === undefined;
        })
      ) {
        throw new Error('Fields cannot be empty if they are present in the data.');
      }
      const newDocument = await model.create(data);
      return newDocument;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async deleteDocument(model, identifier) {
    try {
      const deletedDocument = await model.findOneAndDelete(identifier);
      return deletedDocument;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async getAllDocumentsPopulated(model, populateFields = {}) {
    try {
      const query = Object.entries(populateFields).reduce(
        (q, [field, value]) => q.populate(field, value),
        model.find()
      );
      const documents = await query.exec();
      return documents;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async getDocumentsByField(model, fieldToSearch, valueToMatch) {
    try {
      const query = {};
      query[fieldToSearch] = valueToMatch;

      const documents = await model.find(query);
      return documents;
    } catch (error) {
      console.error(`Error fetching documents by ${fieldToSearch}:`, error);
      throw error;
    }
  }

  async countCollection(model) {
    try {
      const count = await model.countDocuments();
      return count;
    } catch (error) {
      console.error('Error counting documents:', error);
      throw error;
    }
  }

  async countDocuments(model, condition = {}) {
    try {
      const count = await model.countDocuments(condition);
      return count;
    } catch (error) {
      console.error('Error counting documents:', error);
      throw error;
    }
  }

  async getSpecificDocumentValuesByField(model, field, value, select = '') {
    try {
      const query = {};
      query[field] = value;

      const result = await model.find(query).select(select);

      return result;
    } catch (error) {
      console.error(`Error fetching documents by ${field}:`, error);
      throw error;
    }
  }

  async importDataFromFile(model, fileContent) {
    try {
      //const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(fileContent);
      const modifiedData = data.map((player) => {
        player.team = 'teamless';
        return player;
      });
      const result = await model.insertMany(modifiedData);
      return result;
    } catch (error) {
      console.error('Error importing data from file:', error);
      throw error;
    }
  }
}

module.exports = DatabaseHandler;
