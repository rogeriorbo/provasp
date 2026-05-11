const API_URL = '/api';

export interface UserProfile {
  uid: string;
  username: string;
  fullName: string;
  birthDate: string;
  role: 'masteradmin' | 'teacher' | 'student';
  profilePicture?: string;
  lastAccess?: string;
  password?: string;
}

export interface ResultRecord {
  id?: number;
  uid: string;
  username: string;
  date: string;
  sessionTitle: string;
  score: number;
  total: number;
  answersMap: any[];
}

export const getMe = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    localStorage.removeItem('token');
    return null;
  }
  return response.json() as Promise<UserProfile>;
};

export const getQuestionsData = async () => {
  const response = await fetch(`${API_URL}/questions-data`);
  if (!response.ok) throw new Error('Falha ao carregar banco de questões');
  return response.json();
};

export const saveQuestion = async (question: any) => {
  const response = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(question)
  });
  if (!response.ok) throw new Error('Erro ao salvar questão');
  return response.json();
};

export const updateQuestion = async (id: number, question: any) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(question)
  });
  if (!response.ok) throw new Error('Erro ao atualizar questão');
  return response.json();
};

export const deleteQuestion = async (id: number) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) throw new Error('Erro ao excluir questão');
  return response.json();
};

export const saveModule = async (module: any) => {
  const response = await fetch(`${API_URL}/modules`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(module)
  });
  if (!response.ok) throw new Error('Erro ao salvar módulo');
  return response.json();
};

export const updateModule = async (id: number, module: any) => {
  const response = await fetch(`${API_URL}/modules/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(module)
  });
  if (!response.ok) throw new Error('Erro ao atualizar módulo');
  return response.json();
};

export const deleteModule = async (id: number) => {
  const response = await fetch(`${API_URL}/modules/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) throw new Error('Erro ao excluir módulo');
  return response.json();
};

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao fazer login');
  }
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.user as UserProfile;
};

export const registerUser = async (userData: any) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao registrar');
  }
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.user as UserProfile;
};

export const saveUserProfile = async (profile: UserProfile) => {
  const response = await fetch(`${API_URL}/users/${profile.uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(profile)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao salvar perfil');
  }
  return response.json();
};

export const getUserProfile = async (uid: string) => {
  // In this simple setup, we might get it from the list or add a specific route
  const users = await getAllStudents();
  return users.find(u => u.uid === uid) || null;
};

export const getAllStudents = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) throw new Error('Erro ao buscar estudantes');
  return response.json() as Promise<UserProfile[]>;
};

export const saveResult = async (result: Omit<ResultRecord, 'id'>) => {
  const response = await fetch(`${API_URL}/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(result)
  });
  if (!response.ok) throw new Error('Erro ao salvar resultado');
  return response.json();
};

export const getUserResults = async (uid: string) => {
  const response = await fetch(`${API_URL}/results?uid=${uid}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) throw new Error('Erro ao buscar resultados');
  return response.json() as Promise<ResultRecord[]>;
};

export const getAllResults = async () => {
  const response = await fetch(`${API_URL}/results`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) throw new Error('Erro ao buscar todos os resultados');
  return response.json() as Promise<ResultRecord[]>;
};

export const deleteResult = async (resultId: number) => {
  const response = await fetch(`${API_URL}/results/${resultId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) throw new Error('Erro ao excluir resultado');
  return response.json();
};

export const updateUserRole = async (uid: string, role: string) => {
  const response = await fetch(`${API_URL}/students/${uid}/role`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    },
    body: JSON.stringify({ role })
  });
  if (!response.ok) throw new Error('Erro ao atualizar cargo');
  return response.json();
};
