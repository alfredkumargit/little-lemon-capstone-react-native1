import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';

// Map incorrect API filenames to correct ones on GitHub
const imageFixMap = {
  "lemonDessert.jpg": "lemonDessert%202.jpg", // Corrects filename issue
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
        const data = await response.json();
        setMenuItems(data.menu);
        setFilteredMenu(data.menu); // Default menu list
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    const filtered = menuItems.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMenu(filtered);
  }, [searchQuery, menuItems]);

  const filterMenu = (category) => {
    setSelectedCategory(category);
    if (category) {
      const filtered = menuItems.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
      setFilteredMenu(filtered);
    } else {
      setFilteredMenu(menuItems);
    }
  };

  // Function to apply fixes for image filenames without changing case
  const getFixedImageName = (imageName) => {
    return imageFixMap[imageName] || imageName.replace(/\s/g, '%20'); // Apply mapping or fix spaces
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Banner with Search Bar */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <View style={styles.textContainer}>
            <Text style={styles.bannerTitle}>Welcome to Little Lemon</Text>
            <Text style={styles.bannerDescription}>
              We are a family-owned Mediterranean restaurant focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image source={require('../assets/hero.png')} style={styles.heroImage} />
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search for food..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Title */}
      <Text style={styles.orderTitle}>ORDER FOR DELIVERY</Text>

      {/* Category Filter Buttons */}
      <View style={styles.categoryContainer}>
        {['Starters', 'Mains', 'Desserts', 'Full Menu'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.activeCategory]}
            onPress={() => filterMenu(category === 'Full Menu' ? null : category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu List */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.name ?? `item-${Math.random()}`}
        renderItem={({ item }) => {
          const fixedImageName = getFixedImageName(item.image);
          return (
            <View style={styles.menuItem}>
              <Image
                source={{
                  uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${fixedImageName}?raw=true`,
                }}
                style={styles.menuImage}
                onError={() => console.error(`Image failed to load: ${fixedImageName}`)}
              />
              <View style={styles.menuDetails}>
                <Text style={styles.menuTitle}>{item.name ?? 'Unnamed Item'}</Text>
                <Text style={styles.menuPrice}>{item.price ? `$${item.price.toFixed(2)}` : 'Price unavailable'}</Text>
                <Text style={styles.menuDescription}>{item.description ?? 'No description available'}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  banner: { backgroundColor: '#495e57', padding: 20, borderRadius: 10, marginVertical: 20 },
  bannerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textContainer: { flex: 1, paddingRight: 10 },
  bannerTitle: { fontSize: 24, fontWeight: 'bold', color: '#f3cd14', marginBottom: 8 },
  bannerDescription: { fontSize: 16, color: '#fff', lineHeight: 22 },
  heroImage: { width: 100, height: 100, borderRadius: 10 },
  searchBar: {
    marginTop: 15,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  orderTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  categoryButton: { padding: 10, borderRadius: 5, backgroundColor: '#999' },
  activeCategory: { backgroundColor: '#495E57' },
  categoryText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  menuImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  menuDetails: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: 'bold' },
  menuPrice: { fontSize: 16, color: '#495E57', marginVertical: 5 },
  menuDescription: { fontSize: 14, color: '#555' },
});