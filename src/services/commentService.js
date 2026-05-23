import client from './client';

export const createComment = async (postId, texto) => {
    const response = await client.post(`/posts/${postId}/comment`, { texto });
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await client.delete(`/comment/${commentId}`);
    return response.data;
};

export const getComments = async (postId) => {
    const response = await client.get(`/posts/${postId}/comments`);
    return response.data;
};