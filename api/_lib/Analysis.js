
import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String },
  title: { type: String, required: true },
  year: { type: Number },
  inputType: { type: String, enum: ['tmdb', 'upload', 'text'], required: true },
  textHash: { type: String },
  result: {
    pass: { type: Boolean, required: true },
    explanation: { type: String, required: true },
    criteria: {
      namedWomen: { type: Boolean },
      womenTalk: { type: Boolean },
      talkNotAboutMen: { type: Boolean }
    }
  }
}, { timestamps: true });

export default (conn) => conn.models.Analysis || conn.model('Analysis', analysisSchema);
