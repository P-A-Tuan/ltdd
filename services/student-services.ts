export interface Student {
  id: number;
  hoten: string;
  mssv: string;
  lop: string;
  nganh: string;
}

export type StudentInput = Omit<Student, 'id'>;

const API_BASE_URL = 'http://localhost:3000';

async function requestStudents(path: string, init?: RequestInit): Promise<Student[]> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Yêu cầu API thất bại (${response.status})`);
  }
  return response.json() as Promise<Student[]>;
}

export function getStudents(): Promise<Student[]> {
  return requestStudents('/students');
}

export function addStudent(input: StudentInput): Promise<Student[]> {
  return requestStudents('/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function updateStudent(id: number, input: StudentInput): Promise<Student[]> {
  return requestStudents(`/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function deleteStudent(id: number): Promise<Student[]> {
  return requestStudents(`/students/${id}`, { method: 'DELETE' });
}
