import mongoose from 'mongoose';

const queryLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming a User model exists
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  contradictoryResponses: {
    type: [String],
    required: true,
  },
  truthRhombusScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1, // Assuming a score between 0 and 1
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const QueryLog = mongoose.model('QueryLog', queryLogSchema);

export default QueryLog;