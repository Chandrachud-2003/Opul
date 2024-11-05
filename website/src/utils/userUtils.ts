import { User } from 'firebase/auth';
import api from '../config/axios';

export const createOrUpdateUser = async (user: User) => {
  try {
    console.log('Attempting to create/update user:', {
      email: user.email,
      uid: user.uid
    });

    const token = await user.getIdToken();
    
    const response = await api.post('/api/users', {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Server response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error creating/updating user:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
}; 