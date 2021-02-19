import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import Autocomplete from 'react-native-autocomplete-input';

const App = () => {
  const [movies, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});

  useEffect(() => {
    let i = 0;
    let auxArr = [];
    while (i < 5) {
      i = i + 1
      async function fetchData() {
        try {
          await fetch((`http://www.omdbapi.com/?apikey=5eec5adc&s=love&y=2020&type=movie&page=${i}`)).then((res) => res.json())
            .then((json) => {
              if (json.Search.length > 0) {
                for (let f in json.Search) {
                  auxArr.push(json.Search[f])
                }
              };
              return {
                Search: auxArr
              };
            })
            .then((data) => {
              const { Search: movies } = data;
              setFilms(movies);
            })
        } catch (error) {
          if (error) throw error;
        }
      }
      fetchData();
    }
  }, []);

  const searchMovie = (query) => {
    if (query) {
      const regex = new RegExp(`${query.trim()}`, 'i');
      setFilteredFilms(
        movies.filter((film) => {
          console.log(film.Title)
          return film.Title.search(regex) >= 0
        })
      );
    } else {
      // Si no hay resultado, retorna vacío
      setFilteredFilms([]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          data={filteredFilms}
          defaultValue={
            JSON.stringify(selectedValue) === '{}' ?
              '' :
              selectedValue.title
          }
          onChangeText={(text) => searchMovie(text)}
          placeholder="Ingrese el título de la película"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedValue(item);
                setFilteredFilms([]);
              }}>
              <Text style={styles.itemText}>
                {item.Title}
              </Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.descriptionContainer}>
          {movies.length > 0 ? (
            <>
              <Text>
                Título: {JSON.stringify(selectedValue.Title)}
              </Text>
              <Text>
                Año: {JSON.stringify(selectedValue.Year)}
              </Text>
              <Text>
                Tipo: {JSON.stringify(selectedValue.Type) == '"movie"' ? 'Película' : ''}
              </Text>
            </>
          ) : (
              <Text style={styles.infoText}>
                Espere que carguen las películas, por favor!
              </Text>
            )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6788db",
    flex: 1,
    padding: 16,
    marginTop: 0,
  },
  autocompleteContainer: {
    backgroundColor: '#6788db',
    borderWidth: 0,
  },
  descriptionContainer: {
    flex: 10,
    justifyContent: 'center',
    alignContent: 'center'
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
export default App;