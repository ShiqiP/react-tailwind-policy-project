export interface SigninRequestType {
    email: string,
    password: string,
};

export interface SigninResponseType {
    email: string,
    name: string,
    token: string,
    img_url: string
}

export interface SignupRequestType {
    email: string,
    name: string,
    password: string
}

export interface GetPresignUrlRequestType {
    filename: string
}

export interface GetPresignUrlResponseType {
    upload_url: string
}