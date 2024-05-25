import {
  View,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Post } from "../components/Post";
import React from "react";
import axios from "axios";
import { Loading } from "../components/isLoading";
import { API_KEY } from "../Api_key";
import { formatDate } from "../components/formatDate";

export const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);

  const fetchPosts = () => {
    setIsLoading(true);
    axios
      .get(
        `https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=${API_KEY}`
      )
      .then((response) => {
        setItems(response.data.articles);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Помилка", "Помилка при отриманні статті");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(fetchPosts, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPosts} />
        }
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("FullPost", {
                title: item.title,
              })
            }
          >
            <Post
              title={item.title}
              createdAt={formatDate(item.publishedAt)}
              imageUrl={item.image}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
