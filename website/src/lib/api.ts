import api from '../config/axios';

export const createOrUpdateUser = async (user: any) => {
  try {
    const response = await api.post('/api/users', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
    return response.data;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};