import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Menu, GraduationCap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from './Sidebar';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export default function Header({ title = "FPT University", showLogo = true }: HeaderProps) {
  const { colors } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.menuButton} onPress={openSidebar}>
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          {showLogo && (
            <View style={styles.logo}>
              <GraduationCap size={20} color={colors.primary} />
            </View>
          )}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        <View style={styles.rightSpace} />
      </View>

      <Sidebar
        isVisible={sidebarVisible}
        onClose={closeSidebar}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  rightSpace: {
    width: 40,
  },
});