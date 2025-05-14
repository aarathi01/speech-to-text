const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: String,
  keywords: [String],
  content: String,
});

// Create a text index for full-text search
DocumentSchema.index({ title: 'text', keywords: 'text', content: 'text' });

module.exports = mongoose.model('Document', DocumentSchema);
