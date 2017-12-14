
export default interface LoginType {
    error_code: number
    data: {
        info: {
            uid: string
        }
        uuid: string
    }
}