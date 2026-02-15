import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';


export default function App() {
  const [flashcard, setFlashcard] = useState(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = () => {
    const db = SQLite.openDatabaseSync('neuronote.db');
    
    // Create table
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
    
    // Insert if empty
    const count = db.getFirstSync('SELECT COUNT(*) as count FROM flashcards');
    if (count.count === 0) {
      const today = new Date().toISOString().split('T')[0];
      db.runSync(
        `INSERT INTO flashcards (ques_prompt, ans_prompt, date_of_creation, last_review_date, interval, new_review_date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        ["How to find the middle of a linked list?", "Using slow and fast pointers.", today, today, 1, today]
      );
    }
    
    // Fetch latest flashcard
    const card = db.getFirstSync('SELECT * FROM flashcards ORDER BY id DESC LIMIT 1');
    setFlashcard(card);
  };

  if (!flashcard) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.idHeader}>ID: {flashcard.id}</Text>
      
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>Question</Text>
          <Text style={styles.value}>{flashcard.ques_prompt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Answer</Text>
          <Text style={styles.value}>{flashcard.ans_prompt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.value}>{flashcard.date_of_creation}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Last Review</Text>
          <Text style={styles.value}>{flashcard.last_review_date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Interval (days)</Text>
          <Text style={styles.value}>{flashcard.interval}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Next Review</Text>
          <Text style={styles.value}>{flashcard.new_review_date}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  idHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: '#333',
  },
});