import type React from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  variant?: 'default' | 'search';
}

const CustomInput: React.FC<CustomInputProps> = ({ variant = 'default', style, ...props }) => {
  return (
    <TextInput
      style={[styles.input, styles[variant], style]}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  default: {
    minHeight: 44,
  },
  search: {
    minHeight: 44,
    paddingLeft: 34,
    paddingRight: 10,
  },
});

export default CustomInput;
