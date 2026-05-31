import client from './client';

export const getFollowRequests = async () => {
    const response = await client.get('/follow-requests');
    return response.data;
};

export const acceptFollowRequest = async (requestId) => {
    const response = await client.post(`/follow-requests/${requestId}/accept`);
    return response.data;
};

export const rejectFollowRequest = async (requestId) => {
    const response = await client.delete(`/follow-requests/${requestId}/reject`);
    return response.data;
};
