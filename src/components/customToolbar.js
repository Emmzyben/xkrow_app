import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const CustomToolbar = ({ onSend, user, pickMedia }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend([{ text, user: { _id: user.id, name: user.name } }]);
      setText(''); // Clear input after sending
    }
  };

  return (
    <View style={styles.toolbarContainer}>
      <TouchableOpacity style={styles.attachmentButton} onPress={() => pickMedia(onSend, user)}>
        <FontAwesomeIcon icon={faPaperclip} size={24} color="grey" />
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity style={styles.sendingButton} onPress={handleSend}>
        <FontAwesomeIcon icon={faPaperPlane} size={24} color="rgba(98, 36, 143, 1)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
  },
  attachmentButton: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 15,
  },
  sendingButton: {
    padding: 10,
  },
});

export default CustomToolbar;
