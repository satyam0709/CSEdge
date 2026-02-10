import mongoose from 'mongoose';

const CompanyArticleSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  addedBy: { type: String, required: true }, // clerk user id
  addedAt: { type: Date, default: Date.now }
});

const CompanyArticle = mongoose.model('CompanyArticle', CompanyArticleSchema);
export default CompanyArticle;
