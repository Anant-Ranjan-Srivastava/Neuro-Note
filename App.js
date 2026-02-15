import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';


export default function App() {
  useEffect(() => {
    const db = SQLite.openDatabaseSync('neuronote.db');
    
    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ques_prompt TEXT NOT NULL,
        ans_prompt TEXT NOT NULL,
        date_of_creation TEXT NOT NULL,
        last_review_date TEXT NOT NULL,
        interval INTEGER NOT NULL DEFAULT 1,
        new_review_date TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_interval ON flashcards(interval);
    `);
    
    console.log('Neuronote DB ready');
  }, []);

  return (
    //The UI definition.
    <View style={styles.container}>
      <Text></Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
