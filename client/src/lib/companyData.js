// src/lib/companyData.js

export const COMPANIES = [
  { id: 'accenture', name: 'Accenture', color: 'text-purple-600' },
  { id: 'microsoft', name: 'Microsoft', color: 'text-blue-600' },
  { id: 'adobe', name: 'Adobe', color: 'text-red-600' },
  { id: 'walmart', name: 'Walmart', color: 'text-yellow-600' },
  { id: 'paypal', name: 'PayPal', color: 'text-blue-800' }
];

// If you aren't using the internal test anymore, you can leave this empty or keep the old data.
// BUT DO NOT PUT HTML HERE.
export const getCompanyQuestions = (companyId) => {
  return []; 
};