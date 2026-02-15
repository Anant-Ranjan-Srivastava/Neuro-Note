import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const Interface = ({ flashcard, onRecall }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [pressedButton, setPressedButton] = useState(null);

  const buttons = [
    { label: 'Fail', value: 'fail', color: '#DC143C', hoverColor: '#B22222' },
    { label: 'Hard', value: 'hard', color: '#D2691E', hoverColor: '#B5651D' },
    { label: 'Good', value: 'good', color: '#DAA520', hoverColor: '#B8860B' },
    { label: 'Easy', value: 'easy', color: '#006400', hoverColor: '#004d00' }
  ];

  const handleRecall = (button) => {
    setPressedButton(button.value);
    onRecall(button.value);
    setTimeout(() => setPressedButton(null), 200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.idHeader}>ID: {flashcard.id}</Text>
      <View style={styles.card}>
        <Text style={styles.question}>{flashcard.ques_prompt}</Text>
        {showAnswer && <Text style={styles.answer}>{flashcard.ans_prompt}</Text>}
      </View>
      
      {!showAnswer ? (
        <TouchableOpacity style={styles.showAnswerBtn} onPress={() => setShowAnswer(true)}>
          <Text style={styles.btnText}>Show Answer</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.bottomBar}>
          {buttons.map((button) => (
            <TouchableOpacity
              key={button.value}
              style={[
                styles.recallButton,
                {
                  backgroundColor: pressedButton === button.value ? button.hoverColor : button.color,
                  borderColor: pressedButton === button.value ? button.color : 'transparent',
                  borderWidth: pressedButton === button.value ? 3 : 0,
                  width: (screenWidth - 100) / 4,
                }
              ]}
              onPress={() => handleRecall(button)}
            >
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingBottom: 100 },
  idHeader: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', margin: 20, color: '#333' },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 25, marginHorizontal: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  question: { fontSize: 20, fontWeight: '600', textAlign: 'center', color: '#333', lineHeight: 28 },
  answer: { fontSize: 18, textAlign: 'center', color: '#666', marginTop: 15, fontStyle: 'italic', lineHeight: 24 },
  showAnswerBtn: { backgroundColor: '#667eea', padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 20 },
  bottomBar: { position: 'absolute', bottom: 30, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 25, paddingHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  recallButton: { borderRadius: 20, height: 50, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 14, letterSpacing: 0.5 }
});

export default Interface;
