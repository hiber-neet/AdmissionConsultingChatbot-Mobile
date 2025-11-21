import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
  overlay?: boolean;
}

export default function Loading({ 
  size = 'large', 
  text = 'Đang tải...', 
  color = colors.primary,
  overlay = false 
}: LoadingProps) {
  const containerStyle = overlay ? [styles.container, styles.overlay] : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={[styles.text, { color }]}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
