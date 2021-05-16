import express, { Application } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/Task.service';
import { cors } from './middlewares/cors';
import { TaskRepository } from './repositories/Task.repository';
import { database } from './db';
import { catchAllErrors } from './middlewares/catchAllErrors';

const app: Application = express();
app.use(morgan('combined'));
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port: number = 3001;

const controllers = [
  new TaskController(express.Router(), new TaskService(new TaskRepository(database)))
];

controllers.forEach(controller => {
  app.use(controller.router);
});

app.use(catchAllErrors);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
