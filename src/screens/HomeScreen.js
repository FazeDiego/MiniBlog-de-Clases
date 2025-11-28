// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, addPost } from '../features/posts/postsSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.posts);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    // Al montar, obtener publicaciones
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleAddPost = async () => {
    if (!title.trim() || !body.trim()) {
      // Mostrar Toast en Android o Alert en iOS
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Por favor, completa todos los campos',
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert('Campos vacíos', 'Por favor, completa todos los campos');
      }
      return;
    }

    const newPost = {
      title,
      body,
      userId: 1, // Dummy
    };

    try {
      await dispatch(addPost(newPost)).unwrap();
      // Limpiar formulario solo si fue exitoso
      setTitle('');
      setBody('');
      // Mostrar Toast de éxito en Android
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          '¡Publicación creada exitosamente!',
          ToastAndroid.SHORT
        );
      }
    } catch (err) {
      console.error('Error al crear la publicación:', err);
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Error al crear la publicación',
          ToastAndroid.LONG
        );
      } else {
        Alert.alert('Error', 'No se pudo crear la publicación');
      }
    }
  };

  const isLoading = status === 'loading';
  //Encabezado con el nombre de la app y un indicador de carga.
  //Tambien se maneja el listado de las publicaciones y el formulario para agregar nuevas.
  return (
    <View style={styles.container}>
      <Text style={styles.header}>MiniBlog de Clases</Text>

      {isLoading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item, index) => {
          return `post-${item.id}-${index}`;
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.empty}>No hay publicaciones todavía.</Text>
          )
        }
      />
{/*verificacion del formulario para los campos de titulo y contenido*/}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Nueva publicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Contenido"
          value={body}
          onChangeText={setBody}
          multiline
        />
        <Button
          title={isLoading ? 'Enviando...' : 'Publicar'}
          onPress={handleAddPost}
          disabled={isLoading} // Deshabilita mientras se envia la publicacion
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 }, // Ajuste de paddingTop para evitar notch
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 }, // Título de la app
  card: {
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
  title: { fontWeight: 'bold', marginBottom: 4 }, // Título de cada publicación
  empty: { textAlign: 'center', marginTop: 16, fontStyle: 'italic' }, // Mensaje cuando no hay publicaciones
  form: { marginTop: 16 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  multiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  error: { color: 'red', marginVertical: 8 },
});

export default HomeScreen;
