class DatabaseHandler {

    async getAllDocuments(model) {
        try {
          const documents = await model.find();
          return documents;
        } catch (error) {
          console.error('Error fetching documents:', error);
          throw error;
        }
      }

    async patchDocument(model, identifier, updateData) {
      try {

        const allowedFields = Object.keys(model.schema.paths);
        const filteredUpdateData = {};
        Object.keys(updateData).forEach((field) => {
          if (allowedFields.includes(field)) {
            filteredUpdateData[field] = updateData[field];
          }
        });
  
        const document = await model.findOneAndUpdate(identifier, filteredUpdateData, { new: true });
        return document;
      } catch (error) {
        console.error('Error updating document:', error);
        throw error;
      }
    }

    async getSingleDocument(model, identifier) {
      try {
        const document = await model.findOne({ _id: identifier });
        return document;
      } catch (error) {
        console.error('Error getting the document', error)
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
          const newDocument = await model.create(data);
          return newDocument;
      } catch (error) {
        console.error('Error adding document:', error);
        throw error;
      }
    }
}

module.exports = DatabaseHandler;