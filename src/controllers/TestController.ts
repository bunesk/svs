import db from '../database/DatabaseConnection';
import Event from '../models/Event';
import Task from '../models/Task';
import Team from '../models/Team';
import Test from '../models/Test';
import User from '../models/User';

(async () => {
  await db.connectionEstablished;

  const user = new User({
    firstName: 'Tim',
    lastName: 'Maier',
    gender: 'male',
    matriculationNumber: '1234567',
    email: 'mail@example.com',
    password: 'Test123!',
  });
  user.save();

  const event = new Event({
    name: 'Datenmanagement',
    password: 'Test123!',
    amountTests: 3,
    amountSheets: 3,
    pointsMax: 600,
    pointsPassed: 450,
  });
  event.save();

  const test = new Test({
    points: 10,
    testNumber: 1,
    walkingNumber: 1,
  });
  test.save();

  const task = new Task({
    number: 1,
    pointsMax: 3,
  });
  task.save();

  const team = new Team({
    number: 1,
    block: 'A',
  });
  team.save();
})();
