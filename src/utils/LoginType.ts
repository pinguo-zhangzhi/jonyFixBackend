
export default interface LoginType {
    error_code: number
    data: {
        info: {
            uid: string
            avatar: string
            nickname: string
        }
        uuid: string
    }
}