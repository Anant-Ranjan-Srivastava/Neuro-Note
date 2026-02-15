import * as SQLite from 'expo-sqlite';

const dbName = 'neuronote.db';

export const initDB = () => {
  const db = SQLite.openDatabaseSync(dbName);
  db.execSync(`CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ques_prompt TEXT NOT NULL,
    ans_prompt TEXT NOT NULL,
    date_of_creation TEXT NOT NULL,
    last_review_date TEXT NOT NULL,
    interval INTEGER NOT NULL DEFAULT 1,
    new_review_date TEXT NOT NULL
  )`);
  db.execSync(`CREATE INDEX IF NOT EXISTS idx_interval ON flashcards(interval)`);
  
  const count = db.getFirstSync('SELECT COUNT(*) as count FROM flashcards');
  if (count.count === 0) {
    const today = new Date().toISOString().split('T')[0];
    db.runSync(`INSERT INTO flashcards (ques_prompt, ans_prompt, date_of_creation, last_review_date, interval, new_review_date) 
                VALUES (?, ?, ?, ?, ?, ?)`, 
      ["How to find the middle of a linked list?", "Using slow and fast pointers.", today, today, 1, today]);
  }
  return db;
};

export const getFlashcard = (id) => {
  const db = SQLite.openDatabaseSync(dbName);
  return db.getFirstSync('SELECT * FROM flashcards WHERE id = ?', [id]);
};

export const updateRecall = (id, quality) => {
  const db = SQLite.openDatabaseSync(dbName);
  const today = new Date().toISOString().split('T')[0];
  let newInterval = quality === 'easy' ? 2 : quality === 'good' ? 2 : 1;
  db.runSync(`UPDATE flashcards SET last_review_date = ?, interval = ?, new_review_date = ? WHERE id = ?`,
    [today, newInterval, today, id]);
};
