import React, { useEffect, useState } from "react";
import { useSepet } from "../context/SepetContext";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import UrunKarti from "../components/UrunKarti";

export default function AnaSayfa() {
  const router = useRouter();
  const { toplamAdet } = useSepet();

  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");
  const [arama, setArama] = useState("");

  async function urunleriGetir() {
    try {
      setYukleniyor(true);
      setHata("");

      const url =
        arama === ""
          ? "https://dummyjson.com/products?limit=20"
          : `https://dummyjson.com/products/search?q=${encodeURIComponent(arama)}`;

      const cevap = await fetch(url);

      if (!cevap.ok) {
        throw new Error("Ürünler alınamadı.");
      }

      const veri = await cevap.json();
      setUrunler(veri.products);
    } catch (error) {
      setHata(error.message);
    } finally {
      setYukleniyor(false);
    }
  }

  useEffect(() => {
    urunleriGetir();
  }, [arama]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.ustAlan}>
        <Text style={styles.baslik}>E-Ticaret Mağazam</Text>

        <Pressable
          style={styles.sepetButon}
          onPress={() => router.push("/sepet")}
        >
          <Text style={styles.butonYazi}>Sepetim ({toplamAdet})</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.arama}
        placeholder="Ürün ara..."
        value={arama}
        onChangeText={setArama}
      />
      {yukleniyor ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.yukleme}
        />
      ) : hata ? (
        <View style={styles.mesajAlani}>
          <Text style={styles.hata}>{hata}</Text>

          <Pressable style={styles.tekrarButon} onPress={urunleriGetir}>
            <Text style={styles.butonYazi}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={urunler}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.liste}
          ListEmptyComponent={<Text>Gösterilecek ürün bulunamadı.</Text>}
          renderItem={({ item }) => (
            <UrunKarti
              urun={item}
              onPress={() => router.push(`/urun/${item.id}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  ustAlan: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  baslik: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  sepetButon: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  butonYazi: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  liste: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  yukleme: {
    flex: 1,
    justifyContent: "center",
  },
  mesajAlani: {
    alignItems: "center",
    marginTop: 40,
    padding: 16,
  },
  hata: {
    color: "#dc2626",
    marginBottom: 16,
    textAlign: "center",
  },
  tekrarButon: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
  },
  arama: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
  },
});
