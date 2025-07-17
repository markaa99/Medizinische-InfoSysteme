// components/MedicationList.js

import { useContext, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";

import AddMedicationModal from "./AddMedicationModal";
import RemindersContext from "./RemindersContext";

export default function MedicationList({ navigation }) {
  const { medications, addMedication, removeMedication } =
    useContext(RemindersContext);
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemTextContainer}
        onPress={() =>
          navigation.navigate("MedDetail", {
            medId: item.id,
            name: item.name,
          })
        }
      >
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medDose}>{item.dosage}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeMedication(item.id)}
      >
        <Text style={styles.deleteButtonText}>Löschen</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={medications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Keine Medikamente eingetragen.</Text>
        }
        contentContainerStyle={
          medications.length === 0 ? styles.flatListEmpty : null
        }
      />

      {/* Abstand nach unten, damit der '+'-Button nicht überlappt */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => navigation.navigate("DrugInfo")}
      >
        <Text style={styles.infoButtonText}>Medikamenten-Infos suchen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.profileButtonText}>Profil</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <AddMedicationModal
          onClose={() => setModalVisible(false)}
          onConfirm={(name, dosage, times) => {
            const newMed = {
              id: uuidv4(),
              name,
              dosage,
              times, // z. B. ["08:00", "20:00"]
            };
            addMedication(newMed);
            setModalVisible(false);
          }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemTextContainer: {
    flex: 1,
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  medDose: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#ef4444",
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  emptyText: {
    marginTop: 32,
    textAlign: "center",
    color: "#999",
  },

  infoButton: {
    marginTop: 16,
    marginBottom: 80,            // <-- Hier den Abstand nach unten vergrößern
    backgroundColor: "#6b21a8",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  infoButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#3b82f6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 10,
  },

  addButtonText: {
    fontSize: 32,
    color: "#fff",
    lineHeight: 36,
  },

  profileContainer: {
    alignItems: "flex-end",
    marginBottom: 12,
  },

  profileText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
  },

  profileButton: {
  position: "absolute",
  bottom: 24,
  left: 24,
  backgroundColor: "#10b981",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
  elevation: 4,
  zIndex: 10,
  },

  profileButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
