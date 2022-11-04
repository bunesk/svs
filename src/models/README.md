## Models

Enter your models here as `.ts` files using pascal case.

For the database connection including the models the node package [Sequelize](https://sequelize.org/) is used.
Every model must inherit from `../database/Model` which extends the functionality of the [sequelize model](https://sequelize.org/docs/v6/core-concepts/model-basics/) by
adding an automatically generated integer primary key field `id`.
It also activates the paranoid mode where items can be just soft-deleted.

You need to default-export your model class.
It is recommended to also declare the properties directly in the class additional to the init function to get auto-completion.

### Example content

```ts
import Model from '../database/Model';
import {DataTypes} from 'sequelize';

class User extends Model {
  declare name: string;
}

User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
```

### Associations

If you need associations between two models add them into the `setAssociations` function in `../database/associations`.
First you need to import your models using the `importModel` function.
Then you can call the inner functions `oneToOne`, `oneToMany` or `manyToMany` passing the models to associate.

```ts
const Test = await importModel('Test');
const Task = await importModel('Task');

// Example: A test has multiple tasks and a task belongs to a specific test.
oneToMany(Test, Task);
```

For complexer association options create the relations yourself as mentioned in the [Sequelize docs](https://sequelize.org/docs/v6/core-concepts/assocs/).
