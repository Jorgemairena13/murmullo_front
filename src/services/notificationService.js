import client from './client';

export const getNotifications = async () => {
    const response = await client.get('/notifications');
    return response.data;
};

export const markAllAsRead = async () => {
    const response = await client.post('/notifications/read-all');
    return response.data;
};
