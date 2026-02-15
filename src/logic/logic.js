import { initDB, getFlashcard, updateRecall } from '../database/db.js';

let currentCardId = 1;

export const flashcardsAPI = {
  init: () => {
    initDB();
    return getFlashcard(currentCardId);
  },
  getCurrentCard: () => getFlashcard(currentCardId),
  submitRecall: (quality) => {
    updateRecall(currentCardId, quality);
    return getFlashcard(currentCardId);
  }
};
