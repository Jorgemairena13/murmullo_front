import client from './client'

export const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('photo', file)

    const { data } = await client.post('/upload', formData)
    return data
}
