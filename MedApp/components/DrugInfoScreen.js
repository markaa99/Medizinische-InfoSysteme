// components/DrugInfoScreen.js

import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DrugInfoScreen({ route }) {
  const initialQuery = route.params?.initialQuery ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);

    try {
      const encoded = encodeURIComponent(query);
      const resp = await axios.get(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encoded}"+OR+openfda.generic_name:"${encoded}"&limit=20`
      );
      const parsed = resp.data.results.map((item) => {
        const of = item.openfda || {};
        return {
          brand_name: Array.isArray(of.brand_name)
            ? of.brand_name.join(", ")
            : of.brand_name || "—",
          generic_name: Array.isArray(of.generic_name)
            ? of.generic_name.join(", ")
            : of.generic_name || "—",
          manufacturer_name: Array.isArray(of.manufacturer_name)
            ? of.manufacturer_name.join(", ")
            : of.manufacturer_name || "—",
          purpose: Array.isArray(item.purpose)
            ? item.purpose.join("\n")
            : item.purpose || "—",
          dosage: Array.isArray(item.dosage_and_administration)
            ? item.dosage_and_administration.join("\n")
            : item.dosage_and_administration || "—",
        };
      });
      setResults(parsed);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setResults([]);
      } else {
        console.warn("Fehler bei API-Anfrage:", e);
        Alert.alert(
          "Fehler bei der Suche",
          "Wir konnten keine Daten abrufen. Bitte versuche es später erneut."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.drugName}>
        {item.brand_name}{" "}
        {item.generic_name !== "—" ? `(${item.generic_name})` : ""}
      </Text>
      <Text style={styles.sectionHeader}>Hersteller:</Text>
      <Text style={styles.drugInfo}>{item.manufacturer_name}</Text>
      <Text style={styles.sectionHeader}>Wirkzweck / Indikation:</Text>
      <Text style={styles.drugInfo}>{item.purpose}</Text>
      <Text style={styles.sectionHeader}>Dosierung:</Text>
      <Text style={styles.drugInfo}>{item.dosage}</Text>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading) return null;
    if (query.trim() === "") {
      return (
        <Text style={styles.emptyText}>
          Gib einen Begriff ein und tippe auf „Suchen“
        </Text>
      );
    }
    return <Text style={styles.emptyText}>Keine Ergebnisse gefunden.</Text>;
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Medikamentenname eingeben"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? "Suche..." : "Suchen"}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#3b82f6"
          style={styles.spinner}
        />
      )}

      <View style={styles.listWrapper}>
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,               // Gesamter Bildschirm
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  searchButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  spinner: {
    marginVertical: 16,
  },
  listWrapper: {
    flex: 1,              // Wichtiger Teil: FlatList erhält Flex-Platz zum Scrollen
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 8,
    backgroundColor: "#fafafa",
    borderRadius: 6,
  },
  drugName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    color: "#555",
  },
  drugInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 24,
    fontSize: 16,
  },
});
