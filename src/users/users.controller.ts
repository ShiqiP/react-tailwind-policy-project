import { RequestHandler } from "express";
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { ErrorWithStatus, StandardResponse } from "../common/utils";
import { SigninResponseType, SigninRequestType, SignupRequestType, GetPresignUrlRequestType, GetPresignUrlResponseType } from "./types/user.types";
import { dynamoClient, s3Client } from "../common/aws.connect";
import { PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const signin: RequestHandler<unknown, StandardResponse<SigninResponseType>, SigninRequestType, unknown> = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const params = new GetCommand({
            TableName: 'UsersTable',
            Key: {
                email
            }
        })
        const user = (await dynamoClient.send(params)).Item;

        if (!user) throw new ErrorWithStatus('User not found', 404);

        if (!password) throw new ErrorWithStatus('Password not found', 404);
        const match = await compare(password, user.password!);
        if (!match) throw new ErrorWithStatus('Passwords do not match', 401);

        if (!process.env.TOKEN_SECRET) throw new ErrorWithStatus('Secret not found', 401);

        const token = sign({
            name: user.name,
            email: user.email
        }, process.env.TOKEN_SECRET);

        res.status(200).json({ success: true, data: { token, email: user.email, name: user.name, img_url: user.img_url } });

    } catch (err) {
        next(err);
    }
};

export const signup: RequestHandler<unknown, StandardResponse<null>, SignupRequestType, unknown> = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;
        if (!password) throw new Error('Password is required');
        const hashed_password = await hash(password, 10);

        const params = new PutCommand({
            TableName: 'UsersTable',
            Item: {
                email,
                password: hashed_password,
                name
            }
        })
        await dynamoClient.send(params);

        res.status(201).json({ success: true, data: null });

    } catch (err) {
        next(err);
    }
};

export const getPresignUrl: RequestHandler<unknown, StandardResponse<GetPresignUrlResponseType>, GetPresignUrlRequestType, unknown> = async (req, res, next) => {
    try {

        const { filename } = req.body
        const uploadParams = {
            Bucket: process.env.S3_NAME_FOR_UPLOADS_FILES,
            Key: filename,
        }

        const command = new PutObjectCommand(uploadParams)
        const upload_url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        res.status(200).json({ success: true, data: { upload_url } });

    } catch (err) {
        next(err);
    }
};

export const updateURL: RequestHandler<unknown, StandardResponse<null>, { image_url: string }, unknown> = async (req, res, next) => {
    try {
        const { image_url } = req.body;
        const { email } = req['user']

        const command = new UpdateCommand({
            TableName: 'UsersTable',
            Key: {
                email,
            },
            UpdateExpression: "set image_url = :image_url",
            ExpressionAttributeValues: {
                ":image_url": image_url,
            },
            ReturnValues: "ALL_NEW",
        })
        await dynamoClient.send(command);
        res.status(200).json({ success: true, data: null });

    } catch (err) {
        next(err);
    }
};
