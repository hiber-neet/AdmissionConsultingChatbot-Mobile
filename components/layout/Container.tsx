import { View, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function Container({ children, style }: ContainerProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
