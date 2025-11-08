
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  analysis: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true }
}, { timestamps: true });

export default (conn) => conn.models.Comment || conn.model('Comment', commentSchema);
