import client from './client';

export const updateProfile = async (userId, formData) => {
    formData.append('_method', 'PUT');
    const response = await client.post(`/users/${userId}`, formData);
    return response.data;
};

export const deleteAccount = async (userId) => {
    const response = await client.delete(`/users/${userId}`);
    return response.data;
};
