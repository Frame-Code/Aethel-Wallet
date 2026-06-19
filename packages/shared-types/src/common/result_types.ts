export type SuccessResponse<T> = {
    success: true;
    data: T
}

export type ErrorResponse = {
    success: false;
    message: string;
    code?: string;
}

export type GenericResponse<T> = SuccessResponse<T> | ErrorResponse;