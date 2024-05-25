import React from "react";
import styled from "styled-components/native";
import axios from "axios";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Alert,
  Linking,
} from "react-native";
import { Loading } from "../components/isLoading";
import { API_KEY } from "../Api_key";
import { formatDate } from "../components/formatDate";

const PostImage = styled.Image`
  border-radius: 10px;
  width: 100%;
  height: 250px;
  margin-bottom: 20px;
`;

const PostDescription = styled.Text`
  font-size: 16px;
  font-style: italic;
  color: gray;
  margin-bottom: 10px;
`;

const PostContent = styled.Text`
  font-size: 16px;
  line-height: 22px;
`;

const SourceLink = styled(Text)`
  color: blue;
  font-size: 16px;
  text-decoration: underline;
  margin-bottom: 20px;
`;

const SourceText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

export const FullPostScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState({});
  const [refreshing, setRefreshing] = React.useState(false);

  const { title } = route.params;

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(
        `https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=${API_KEY}`
      )
      .then((response) => {
        const article = response.data.articles.find(
          (article) => article.title === title
        );
        setData(article);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Помилка", "Помилка", "Помилка при отриманні статті");
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  React.useEffect(() => {
    navigation.setOptions({
      title,
    });
    fetchData();
  }, [title]);
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }
  return (
    <ScrollView
      style={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <PostImage
        source={{
          uri: data.image,
        }}
      />
      <PostDescription>{data.description}</PostDescription>
      <PostContent>{data.content}</PostContent>
      <SourceLink onPress={() => Linking.openURL(data.url)}>
        Читати повністю
      </SourceLink>
      <SourceText>Джерело: {data.source.name}</SourceText>
      <SourceText>Опубліковано: {formatDate(data.publishedAt)}</SourceText>
    </ScrollView>
  );
};
