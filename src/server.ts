import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import ServerlessHttp from 'serverless-http';

import { errorHandler, routerNotFoundHandler } from './common/utils';
import './common/aws.connect';
import userRoutes from './users/users.router';


const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(json());

app.use('/', userRoutes);

app.use(routerNotFoundHandler);
app.use(errorHandler);
 
const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on ${port}`));

export const handler = ServerlessHttp(app)