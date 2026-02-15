import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Interface from './src/components/interface';
import { flashcardsAPI } from './src/logic/logic';

export default function App() {
  const [flashcard, setFlashcard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const card = flashcardsAPI.init();
      setFlashcard(card);
    } catch (error) {
      console.error('Init error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRecall = (quality) => {
    try {
      flashcardsAPI.submitRecall(quality);
      setFlashcard(flashcardsAPI.getCurrentCard());
    } catch (error) {
      console.error('Recall error:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading flashcards...</Text>
      </View>
    );
  }

  if (!flashcard) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No flashcards found</Text>
      </View>
    );
  }

  return <Interface flashcard={flashcard} onRecall={handleRecall} />;
}
