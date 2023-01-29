## Models

Enter your models here as `.ts` files using pascal case. You can see a full example below.

For the database connection including the models the node package [Sequelize](https://sequelize.org/) is used.
Every model must inherit from `../database/Model.js` which extends the functionality of the [sequelize model](https://sequelize.org/docs/v6/core-concepts/model-basics/) by
adding an automatically generated integer primary key field `id`.

```ts
import Model from '../database/Model.js';
class User extends Model {}
```

You need to default-export your model class.
As mentioned in the Sequelize documentation you call the `init` function to define your model attributes. One difference is that you don't have to pass the Sequelize object in there.

```ts
User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});
export default User;
```

### TypeScript

Because TypeScript cannot determine the model attributes at compile time we need to additionally declare them virtually.
Otherwise we will get an error on calling those attribute on model instances and don't get autocomplete while creating them.
To accomplish this we need to first add generics to our extending:

```ts
import Model from '../database/Model.js';
import {InferAttributes, InferCreationAttributes} from 'sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {}
```

Then we declare our virtual model attributes. For optional attributes you can use the generic `CreationOptional`.

```ts
import Model from '../database/Model.js';
import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes} from 'sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // Since TS cannot determine model attributes at compile time
  // we have to declare them here virtually
  declare name: string;
  declare isAdmin: CreationOptional<boolean>;
}

User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

export default User;
```

More information about Sequelize with TypeScript you can find [here](https://sequelize.org/docs/v6/other-topics/typescript/).

#### How to use models in controllers

Now we can create users without any problems. To get autocomplete use constructor by using the `new` operator to create new model instances.
Using `User.create()` will work to, but you will not receive autocomplete and validation while using it.

```ts
const user = new User({name: 'Tim Maier', isAdmin: true}); // do this
const user = User.create({name: 'Tim Maier', isAdmin: true}); // don't do this
```

After that we can call `user.name` and `user.isAdmin`.

```ts
console.log(user.name);
console.log(user.isAdmin);
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

#### TypeScript

Sequelize [adds multiple functions](https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances) to our model if we define associations.
Again TypeScript cannot determine these model association at compile time so we have to declare them virtually to use them without TypeScript complaining.

You can see in the Sequelize documentation which functions are added on which association to which of the both models.
Also in this case we use generics importing from `sequelize` as mentioned [here]().

```ts
// Example: we have an associations between 'Foo' and 'Bar'
// One bar belongs to one foo -> oneToOne(Foo, Bar)
// class Foo
declare BarId: ForeignKey<Bar['id']>;
declare getBar: HasOneGetAssociationMixin<Bar>;
declare setBar: HasOneSetAssociationMixin<Bar, number>;
declare createBar: HasOneCreateAssociationMixin<Bar>;
// class Bar
declare FooId: ForeignKey<Foo['id']>;
declare getFoo: BelongsToGetAssociationMixin<Foo>;
declare setFoo: BelongsToSetAssociationMixin<Foo, number>;
declare createFoo: BelongsToCreateAssociationMixin<Foo>;

// Foos have multiple Bars but one Bar belongs to one Foo -> oneToMany(Foo, Bar)
// class Foo
declare Bars?: NonAttribute<Bar[]>;
declare getBars: HasManyGetAssociationsMixin<Bar>;
declare addBar: HasManyAddAssociationMixin<Bar, number>;
declare addBars: HasManyAddAssociationsMixin<Bar, number>;
declare setBars: HasManySetAssociationsMixin<Bar, number>;
declare removeBar: HasManyRemoveAssociationMixin<Bar, number>;
declare removeBars: HasManyRemoveAssociationsMixin<Bar, number>;
declare hasBar: HasManyHasAssociationMixin<Bar, number>;
declare hasBars: HasManyHasAssociationsMixin<Bar, number>;
declare countBars: HasManyCountAssociationsMixin;
declare createBar: HasManyCreateAssociationMixin<Bar, 'ownerId'>;
// class Bar
declare FooId: ForeignKey<Foo['id']>;
declare getFoo: BelongsToGetAssociationMixin<Foo>;
declare setFoo: BelongsToSetAssociationMixin<Foo, number>;
declare createFoo: BelongsToCreateAssociationMixin<Foo>;

// Foos have multiple Bars and Bars belong to many Foo -> manyToMany(Foo, Bar)
// class Foo
declare Bars?: NonAttribute<Bar[]>;
declare getBars: HasManyGetAssociationsMixin<Bar>;
declare addBar: HasManyAddAssociationMixin<Bar, number>;
declare addBars: HasManyAddAssociationsMixin<Bar, number>;
declare setBars: HasManySetAssociationsMixin<Bar, number>;
declare removeBar: HasManyRemoveAssociationMixin<Bar, number>;
declare removeBars: HasManyRemoveAssociationsMixin<Bar, number>;
declare hasBar: HasManyHasAssociationMixin<Bar, number>;
declare hasBars: HasManyHasAssociationsMixin<Bar, number>;
declare countBars: HasManyCountAssociationsMixin;
declare createBar: HasManyCreateAssociationMixin<Bar, 'ownerId'>;
// class Bar
declare Foos?: NonAttribute<Foo[]>;
declare getFoos: BelongsToManyGetAssociationsMixin<Foo>;
declare addFoo: BelongsToManyAddAssociationMixin<Foo, number>;
declare addFoos: BelongsToManyAddAssociationsMixin<Foo, number>;
declare setFoos: BelongsToManySetAssociationsMixin<Foo, number>;
declare removeFoo: BelongsToManyRemoveAssociationMixin<Foo, number>;
declare removeFoos: BelongsToManyRemoveAssociationsMixin<Foo, number>;
declare hasFoo: BelongsToManyHasAssociationMixin<Foo, number>;
declare hasFoos: BelongsToManyHasAssociationsMixin<Foo, number>;
declare countFoos: BelongsToManyCountAssociationsMixin;
declare createFoo: BelongsToManyCreateAssociationMixin<Foo>;
