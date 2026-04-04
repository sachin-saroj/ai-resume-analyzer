const mongoose = require('mongoose');

const embeddingCacheSchema = new mongoose.Schema({
  textHash: {
    type: String,
    required: true,
    unique: true, // MD5 or SHA256 of the text (e.g. 'react', 'frontend developer')
  },
  embeddingVector: {
    type: [Number], // The 1536-dimensional array from text-embedding-3-small
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('EmbeddingCache', embeddingCacheSchema);
