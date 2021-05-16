import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/Task.service';
import { cors } from './middlewares/cors';

const app: Application = express();
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port: number = 3001;

const controllers = [
  new TaskController(express.Router(), new TaskService())
];

controllers.forEach(controller => {
  app.use(controller.router);
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
