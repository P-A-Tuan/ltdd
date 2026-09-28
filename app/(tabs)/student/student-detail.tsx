import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { getStudents, Student, StudentInput, updateStudent } from '../../../services/student-services';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<StudentInput>({ hoten: '', mssv: '', lop: '', nganh: '' });

  useEffect(() => {
    let active = true;
    getStudents()
      .then((students) => {
        if (!active) return;
        const found = students.find((item) => String(item.id) === id) ?? null;
        setStudent(found);
        if (found) setForm({ hoten: found.hoten, mssv: found.mssv, lop: found.lop, nganh: found.nganh });
      })
      .catch((error) => console.error('Không tải được thông tin sinh viên:', error))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  async function saveChanges() {
    if (!student) return;
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
      await updateStudent(student.id, cleanForm);
      setStudent({ ...student, ...cleanForm });
      setEditing(false);
    } catch (error) {
      console.error('Không cập nhật được sinh viên:', error);
      Alert.alert('Lỗi', 'Không lưu được thông tin sinh viên.');
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Chi tiết sinh viên' }} />
      {loading ? <ActivityIndicator size="large" /> : student ? editing ? (
        <>
          <Text style={styles.title}>Sửa thông tin sinh viên</Text>
          <TextInput style={styles.input} placeholder="Họ và tên" value={form.hoten} onChangeText={(hoten) => setForm({ ...form, hoten })} />
          <TextInput style={styles.input} placeholder="Mã số sinh viên" value={form.mssv} onChangeText={(mssv) => setForm({ ...form, mssv })} />
          <TextInput style={styles.input} placeholder="Lớp" value={form.lop} onChangeText={(lop) => setForm({ ...form, lop })} />
          <TextInput style={styles.input} placeholder="Ngành" value={form.nganh} onChangeText={(nganh) => setForm({ ...form, nganh })} />
          <View style={styles.actions}>
            <Pressable style={styles.saveButton} onPress={() => void saveChanges()}><Text style={styles.buttonText}>Lưu thay đổi</Text></Pressable>
            <Pressable style={styles.cancelButton} onPress={() => {
              setForm({ hoten: student.hoten, mssv: student.mssv, lop: student.lop, nganh: student.nganh });
              setEditing(false);
            }}><Text>Hủy</Text></Pressable>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>{student.hoten}</Text>
          <Text style={styles.info}>MSSV: {student.mssv}</Text>
          <Text style={styles.info}>Lớp: {student.lop}</Text>
          <Text style={styles.info}>Ngành: {student.nganh}</Text>
          <Pressable style={styles.saveButton} onPress={() => setEditing(true)}><Text style={styles.buttonText}>Sửa thông tin</Text></Pressable>
        </>
      ) : <Text style={styles.info}>Không tìm thấy sinh viên.</Text>}
      <Pressable style={styles.back} onPress={() => router.back()}><Text style={styles.buttonText}>Quay lại danh sách</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  info: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 7, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  actions: { flexDirection: 'row', gap: 8 },
  saveButton: { marginTop: 12, padding: 12, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center' },
  cancelButton: { marginTop: 12, padding: 12, backgroundColor: '#e5e7eb', borderRadius: 8, alignItems: 'center' },
  back: { marginTop: 20, padding: 12, backgroundColor: '#4b5563', borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
