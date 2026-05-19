import client from './client';

export const getFeed = async () => {
    const response = await client.get('/feed');
    return response.data;
};

export const createPost = async (texto) => {
    const response = await client.post('/posts', { texto });
    return response.data;
};

export const likePost = async (postId) => {
    const response = await client.post(`/posts/${postId}/like`);
    return response.data;
};

export const unlikePost = async (postId) => {
    const response = await client.delete(`/posts/${postId}/like`);
    return response.data;
};

export const getUserPosts = async (userId) => {
    const response = await client.get(`/users/${userId}/posts`);
    return response.data;
};

export const getUserProfile = async (userId) => {
    const response = await client.get(`/users/${userId}`);
    return response.data;
};

export const followUser = async (userId) => {
    const response = await client.post(`/users/${userId}/follow`);
    return response.data;
};

export const unfollowUser = async (userId) => {
    const response = await client.delete(`/users/${userId}/follow`);
    return response.data;
};

export const searchUsers = async (query) => {
    const response = await client.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data;
};

export const searchPosts = async (query) => {
    const response = await client.get(`/search/posts?query=${encodeURIComponent(query)}`);
    return response.data;
};