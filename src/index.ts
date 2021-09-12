import * as express from 'express';
import * as dotenv from 'dotenv';
import { sendEmailController } from './controllers/send';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || '4000';

app.get('/:email', sendEmailController);
app.listen(port, () => {
  console.log(`server listen port http://localhost:${port}`);
});
