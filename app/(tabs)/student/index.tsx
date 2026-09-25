import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Student {
  id: number;
  name: string;
  mssv: string;
  lop: string;
  nganh: string;
}

export default function StudentListScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/sinhvien_api/get_sinhvien.php')
      .then((response) => {
        console.log('API status:', response.status);

        if (!response.ok) {
          throw new Error('API lỗi: ' + response.status);
        }

        return response.json();
      })
      .then((data) => {
        console.log('Dữ liệu API:', data);

        const studentsFromAPI = data.map((student: any) => ({
          id: Number(student.id),
          name: student.hoten,
          mssv: student.mssv,
          lop: student.lop,
          nganh: student.nganh,
        }));

        setStudents(studentsFromAPI);

        // QUAN TRỌNG: tải xong thì tắt loading
        setLoading(false);
      })
      .catch((error) => {
        console.log('Lỗi API:', error);

        // Có lỗi cũng phải tắt loading
        setLoading(false);
      });
  }, []);

  const handleStudentPress = (student: Student) => {
    router.push({
      pathname: '/student/student-detail',
      params: {
        id: String(student.id),
        name: student.name,
        mssv: student.mssv,
        lop: student.lop,
        nganh: student.nganh,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Đang tải danh sách sinh viên...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách sinh viên</Text>

      {students.map((student) => (
        <Pressable
          key={student.id}
          style={styles.studentItem}
          onPress={() => handleStudentPress(student)}
          accessibilityRole="button"
          accessibilityLabel={`Xem thông tin sinh viên ${student.name}`}
        >
          <Text style={styles.studentName}>
            {student.name}
          </Text>

          <Text style={styles.studentInfo}>
            MSSV: {student.mssv}
          </Text>

          <Text style={styles.studentInfo}>
            Lớp: {student.lop}
          </Text>

          <Text style={styles.studentInfo}>
            Ngành: {student.nganh}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  studentItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },

  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  studentInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
});