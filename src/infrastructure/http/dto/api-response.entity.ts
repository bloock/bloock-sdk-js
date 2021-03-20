export class ApiResponse<T> {
    public success: boolean;
    public data: T;

    constructor(data: {
        success: boolean,
        data: T
    }) {
        this.success = data.success;
        this.data = data.data;
    }
}