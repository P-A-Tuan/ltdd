import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import {
  addStudent,
  deleteStudent,
  getStudents,
  Student,
  StudentInput,
} from '../../../services/student-services';

const emptyForm: StudentInput = { hoten: '', mssv: '', lop: '', nganh: '' };

export default function StudentListScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<StudentInput>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setStudents(await getStudents());
    } catch (e) {
      console.error('Không tải được danh sách sinh viên:', e);
      setError('Không thể tải danh sách sinh viên.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void loadStudents(); }, [loadStudents]));

  function startAdd() {
    setForm(emptyForm);
    setShowForm(true);
  }

  async function saveStudent() {
    if (!form.hoten.trim() || !form.mssv.trim() || !form.lop.trim() || !form.nganh.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin sinh viên.');
      return;
    }
    try {
      const cleanForm = {
        hoten: form.hoten.trim(),
        mssv: form.mssv.trim(),
        lop: form.lop.trim(),
        nganh: form.nganh.trim(),
      };
      const updated = await addStudent(cleanForm);
      setStudents(updated);
      setShowForm(false);
      setForm(emptyForm);
    } catch (e) {
      console.error('Không lưu được sinh viên:', e);
      Alert.alert('Lỗi', 'Không lưu được thông tin sinh viên.');
    }
  }

  function confirmDelete(student: Student) {
    if (Platform.OS === 'web') {
      if (window.confirm(`Bạn có chắc muốn xóa ${student.hoten}?`)) {
        void deleteStudent(student.id).then(setStudents).catch((error) => {
          console.error('Không xóa được sinh viên:', error);
          window.alert('Không xóa được sinh viên.');
        });
      }
      return;
    }

    Alert.alert('Xóa sinh viên', `Bạn có chắc muốn xóa ${student.hoten}?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          void deleteStudent(student.id)
            .then(setStudents)
            .catch((e) => {
              console.error('Không xóa được sinh viên:', e);
              Alert.alert('Lỗi', 'Không xóa được sinh viên.');
            });
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Danh sách sinh viên' }} />
      <View style={styles.header}>
        <Text style={styles.heading}>Danh sách sinh viên</Text>
        <Pressable style={styles.addButton} onPress={startAdd}>
          <Text style={styles.buttonText}>+ Thêm</Text>
        </Pressable>
      </View>
      <Text style={styles.count}>Tổng số: {students.length} sinh viên</Text>

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Thêm sinh viên</Text>
          <TextInput style={styles.input} placeholder="Họ và tên" value={form.hoten} onChangeText={(hoten) => setForm({ ...form, hoten })} />
          <TextInput style={styles.input} placeholder="Mã số sinh viên" value={form.mssv} onChangeText={(mssv) => setForm({ ...form, mssv })} />
          <TextInput style={styles.input} placeholder="Lớp" value={form.lop} onChangeText={(lop) => setForm({ ...form, lop })} />
          <TextInput style={styles.input} placeholder="Ngành" value={form.nganh} onChangeText={(nganh) => setForm({ ...form, nganh })} />
          <View style={styles.formActions}>
            <Pressable style={styles.addButton} onPress={() => void saveStudent()}><Text style={styles.buttonText}>Lưu</Text></Pressable>
            <Pressable style={styles.cancelButton} onPress={() => setShowForm(false)}><Text>Hủy</Text></Pressable>
          </View>
        </View>
      )}

      {loading ? <ActivityIndicator size="large" /> : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : students.length === 0 ? <Text>Chưa có sinh viên.</Text> : (
        <ScrollView contentContainerStyle={styles.list}>
          {students.map((student) => (
            <View key={student.id} style={styles.card}>
              <Pressable onPress={() => router.push({ pathname: '/student/student-detail', params: { id: String(student.id) } })}>
                <Text style={styles.name}>{student.hoten}</Text>
                <Text style={styles.info}>MSSV: {student.mssv} · Lớp: {student.lop}</Text>
                <Text style={styles.info}>Ngành: {student.nganh}</Text>
              </Pressable>
              <Pressable style={[styles.deleteButton, styles.cardDelete]} onPress={() => confirmDelete(student)}><Text style={styles.buttonText}>Xóa sinh viên</Text></Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { fontSize: 24, fontWeight: 'bold' },
  count: { fontSize: 16, color: '#4b5563', marginBottom: 14 },
  list: { gap: 10, paddingBottom: 20 },
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 10, elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  info: { fontSize: 14, color: '#555', marginTop: 2 },
  form: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 7, padding: 10, marginBottom: 8, backgroundColor: '#fff' },
  formActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  addButton: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignItems: 'center' },
  deleteButton: { backgroundColor: '#dc2626', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 7 },
  cardDelete: { alignSelf: 'flex-start', marginTop: 10 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#e5e7eb' },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: '#b91c1c' },
});
