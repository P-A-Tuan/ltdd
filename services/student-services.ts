import AsyncStorage from '@react-native-async-storage/async-storage';
import studentData from '../api/students.json';

export interface Student {
  id: number;
  hoten: string;
  mssv: string;
  lop: string;
  nganh: string;
}

export type StudentInput = Omit<Student, 'id'>;

const STORAGE_KEY = 'students';

export async function getStudents(): Promise<Student[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored !== null) return JSON.parse(stored) as Student[];

  const initialStudents = studentData as Student[];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
  return initialStudents;
}

export async function addStudent(input: StudentInput): Promise<Student[]> {
  const students = await getStudents();
  const student: Student = {
    ...input,
    id: students.reduce((max, item) => Math.max(max, item.id), 0) + 1,
  };
  const updated = [...students, student];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function updateStudent(id: number, input: StudentInput): Promise<Student[]> {
  const students = await getStudents();
  const updated = students.map((item) => item.id === id ? { ...item, ...input } : item);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteStudent(id: number): Promise<Student[]> {
  const students = await getStudents();
  const updated = students.filter((item) => item.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
