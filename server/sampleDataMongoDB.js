//to insert sample documents
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Document = require('./models/document');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');

  const sampleDocuments = [
    {
      title: 'Resetting Your Password',
      keywords: ['reset', 'password', 'account'],
      content: 'Instructions on how to reset your password.',
    },
    {
      title: 'Updating Profile Information',
      keywords: ['update', 'profile', 'information'],
      content: 'Steps to update your profile details.',
    },
    // Add more sample documents as needed
  ];

  await Document.insertMany(sampleDocuments);
  console.log('Sample data inserted');
  mongoose.connection.close();
})
.catch((err) => console.error('MongoDB connection error:', err));
