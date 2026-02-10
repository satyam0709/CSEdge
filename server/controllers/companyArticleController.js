import CompanyArticle from '../models/CompanyArticle.js';
import { clerkClient } from '@clerk/express';

export const createArticle = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { companyId, title, url } = req.body;

    if (!companyId || !title || !url) {
      return res.status(400).json({ success: false, message: 'companyId, title and url required' });
    }

    const newArticle = await CompanyArticle.create({
      companyId,
      title,
      url,
      addedBy: userId
    });

    res.json({ success: true, article: newArticle });
  } catch (error) {
    console.error('createArticle error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listArticles = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!companyId) return res.status(400).json({ success: false, message: 'companyId required' });

    const articles = await CompanyArticle.find({ companyId }).sort({ addedAt: -1 });
    res.json({ success: true, articles });
  } catch (error) {
    console.error('listArticles error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Article id required' });

    await CompanyArticle.findByIdAndDelete(id);
    res.json({ success: true, message: 'Article removed' });
  } catch (error) {
    console.error('deleteArticle error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
