import { nanoid } from 'nanoid'

export const getNanoidToken = () => {
    // 先从本地存储中获取
    let nanoid_token = localStorage.getItem('nanoid_token')
    if (!nanoid_token) {
        // 若本地存储没有，就生成，并放到本地存储
        nanoid_token = nanoid()
        localStorage.setItem('nanoid_token', nanoid_token)
    }
    return nanoid_token
}