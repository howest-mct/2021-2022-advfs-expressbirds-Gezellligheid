# Advanced Full Stack Web Development - Express Birds

## Installation

### If you want to work with your virtual machine

Make sure to connect to your virtual machine with Teleport (and the Howest VPN).
**Execute all these steps on your Ubuntu WSL (or natively from Mac/Linux)**
- Make sure to tunnel your virtual machine's ports to your localhost ports: [Teleport Tunneling Guide (Leho)](https://leho-howest.instructure.com/courses/12573/pages/teleport-tunnel?module_item_id=375810)
- Login to Teleport with the `tsh login --user=segers-nathan --proxy=teleport.vapus.be` command. Use the password provided in your email.
- Check to see if you have access to your virtual machine `tsh ls -v`
- Connect to your Teleport virtual machine `tsh ssh student@segers-nathan` (Change to your own hostname, which is the username you logged in with). Keep the connection open.

**You can now try to connect to your virtual machine through Visual Studio Code**
- Add a new SSH remote host `student@localhost`. As we have tunneled port 22, we allow the port to be open on our localhost machine, which means we can now connect with localhost. Remember to keep the connection through Teleport open.

**On the virtual machine, we didn't preinstall everything yet**.

- `curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -`
- `sudo apt-get install -y nodejs` to install Node on your virtual machine
- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash` to install nvm
- `source ~/.bashrc` to load the changes in the `.bashrc` file.
Now you should have everything that needs to be installed.

### Setting up the project.

Follow the instructions in [this repository](https://github.com/MLoth/adv-fullstack-dev-docs#backend) to get started with the basic project.
- `nvm use` to use the node version. Install your Node version if required.
- Add a `.gitignore` file as well.
**Skip the GraphQL part!**

> **WINDOWS**
> On Windows, you might have to use this line instead:
> `"dev": "npx nodemon --watch server/**/* --exec ts-node server/app.ts"`

## Adding middleware

Middleware allows us to add some custom data to a request. We will quickly set this up with Express, to show how easy it is.

- Create a new folder inside `server` > `middleware`.
- Add a new file inside called `demo.ts`.
- Enter the following content and try to understand what is going on.
    ```typescript
    import { NextFunction, Request, Response } from 'express';

    // Every request gets a header set.
    export const middlewareDemo = (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        response.set('Grapje', ':-)');
        next();
    };

    ```
- Go to `main.ts`
    - Import the `middlewareDemo`.
    - Add `app.use(middlewareDemo)`

## Adding more routes

We are going to build a Bird counting app, together with the frontend you will build in Framework and Patterns.

Notice we have given you a `birds.json` file you will be able to read from. We will use this to start building some routes.

- Add a basic route like this
    ```typescript
    const birds = ['vink', 'arend', 'meeuw', 'duif']
    app.get('/birds', (request: Request, response: Response) => {     
        response.send(birds);
    })
    ```

- More advanced routes
    ```typescript
    app.get('/bird/:id', (request: Request, response: Response) => {    
        const id: number = parseInt(request.params.id);
        response.send(birds[id]);
    })

    app.post('/bird', (request: Request, response: Response) => {    
        const bird = request.body;
        birds.push(bird.name);
        response.send(birds);
    })
    ```

### Adding more advanced routes, with the effective birds dataset
- Move the `birds.json` file into your `server` directory.
- Try to import it `import birds from 'birds.json'`. It will give an error.
- Go to `tsconfig.json` and uncomment line 36: `"resolveJsonModule": true,`

We are going to add a little more structure to our app, in order to get it cleaner for future edits.

- Create an `entity` folder inside your `server` directory.
- Create a `bird.ts` file in there.
    ```typescript
    export class Bird {
        uuid?: string
        id?: string
        name?: string
        short?: string
        image?: string
        recon?: string[]
        food?: Record<string, string>
        see?: string
    }
    ```
- Now add a method `sayHello()` to the class so that our bird can introduce itself.

- We want to convert our whole JSON file to objects of the `Bird` class. For this, we will use a package called `class-transformer`. Install that.

- `import { plainToClass } from 'class-transformer'`
- To use the plainToClass transformer, give it the Class to transform the objects into:
    ```typescript
    import birds from './birds.json';
    import { Bird } from './entity/bird';
    const allBirds = plainToClass(Bird, birds);
    ```
- Try and adapt your `app.get('/bird/:id')` route to print out the name of the bird now.
- You can also adapt the route to require a name for the bird instead of the index of the list.

Notice that our app can become quite complex already, if we are going to add a lot more entities and objects? Currently, we only have our Bird entity.

To prepare for future additions, let's introduce a little bit of structure for our app.

- Create a folder called `controllers` inside the `server` directory.
    - Create a file called `bird.controller.ts` inside of it.
    - Start off with this content, and add the rest of it:
    ```typescript
    export class BirdController {
        public router = Router();
        public birds: Array<Bird>;

        constructor() {
            this.birds = plainToClass(Bird, birds);

            // Initialize the routes in here, like this
            this.router.get('/all', this.all);
        }

        // Make sure to use an arrow function, so 'this' is properly bound.
        all = (request: Request, response: Response, next: NextFunction) => {
            response.send(this.birds);
        }
    }
    ```
- Go back to `app.ts`. Remove the currently active routes.
- Import `birdController`.
    ```typescript
    const birdController = new BirdController(); // Because it was a class, we need to initialize it!

    app.use('/bird', birdController.router);
    ```

## Adding a database
Now that we have our basic structure ready, it is time to get started with adding a database. 
Last year we already did something similar in .NET 5, so it won't be so much new for you.

- Add a `docker-compose` file to the root of our project.
- It should contain two services:
    - A `mariadb` service with the latest image available (but don't use `:latest`). The port `3306` should be open to other services outside of the Docker network as well. It should have a `.env` file. It should have persistent storage. Please search for the right directory inside the MySQL container for the files.
    - The `.env` file should contain these values:
        ```
        MYSQL_ROOT_PASSWORD=stronger_password
        MYSQL_DATABASE=birds
        MYSQL_USER=admin
        MYSQL_PORT=3306
        MYSQL_PASSWORD=strong_password
        MYSQL_HOST=localhost
        ```
    - An `adminer` service with the latest image available (but don't use `:latest`). Map the container port `8080` to `9999` on your laptop.
    - Start the services and try to connect to `localhost:9999` and see if you can access your database. Remember the hostname you should fill in for the database?

- Now we will get started with `typeorm`. Think of it as our Entity Framework like we used in .NET 
- Install it with `npm i typeorm typeorm-extension`. Because it is not a development package, we do not need to use `-d`.
- The database package we will use is `mysql` so install it with `npm i mysql`

- We will add our Typeorm config into an `ormconfig.env` file, so we can easily adapt it when we are going to work with Docker and Kubernetes later on.
    The Host should be `localhost` if you are not running this NodeJS app in Docker yet. 
    ```
    TYPEORM_CONNECTION = mysql
    TYPEORM_HOST = localhost
    TYPEORM_PORT = 3306
    TYPEORM_USERNAME = root
    TYPEORM_PASSWORD = stronger_password
    TYPEORM_DATABASE = birds
    TYPEORM_SYNCHRONIZE = true
    TYPEORM_LOGGING = false
    TYPEORM_ENTITIES = server/entity/**/*.ts
    TYPEORM_ENTITIES_DIR = server/entity
    ```

- In `app.ts` we will have to change a little bit to initialize our database connection.
- We'll have to make sure to use `await` within a scoped function. If we wrap it in an async closure, we can do that.  
    Adapt the file so it looks like this:
    ```typescript
    (async () => {

        const app = express();

        // The rest of the app methods

        app.listen(port, () => { // The correct way is to use the callback method to properly log when the app starts listening
              console.info(`\nServer 👾 \nListening on http://localhost:${port}/`);
        });

    })(); // Automatically execute
    ```

    - Inside of this closure, we will start creating our database (and also preparing to seed it later on!)  
    Add these lines.

    ```typescript
    import { ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';
    import { createDatabase } from 'typeorm-extension';
    
    (async () => {
        const connectionOptions: ConnectionOptions = await getConnectionOptions(); // This line will get the connection options from the typeorm
        createDatabase({ifNotExist: true}, connectionOptions)
        .then(() => console.log('Database created successfully!'));
        .then(createConnection)
        .then(async () => {
            const app = express();

            // The rest of the app methods

            app.listen(port, () => { // The correct way is to use the callback method to properly log when the app starts listening
                console.info(`\nServer 👾 \nListening on http://localhost:${port}/`);
            });
        })
        .catch(error => console.error(error)); // If it crashed anywhere, let's log the error!
    })();
    ```



- To work with typeorm on our entities, we will have to uncomment `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in `tsconfig.json`.
- Now, we can add columns to our Bird entity, so it becomes registered as a table inside our database. Adapt your code to the following:
    ```typescript
    @Entity('birds') // The table name
    export class Bird {
        @PrimaryGeneratedColumn('uuid') // Generated as UUID in the database
        uuid?: string

        @Column({unique: true})
        id?: string
        
        @Column({ length: 100 })
        name?: string
        
        @Column('text') 
        short?: string
        
        @Column() 
        image?: string
        
        @Column('simple-array') 
        recon?: string[]
        
        @Column('simple-json') // Parses the object as JSON in the database
        food?: Record<string, string>
        
        @Column('text') 
        see?: string

        sayHello() {
            console.log(`Hallo, ik ben een ${this.name}`);
        }
    }
    ```
- Run your application and check out your created tables in the Adminer service, log in as Root.
- If everything works, go to the next step. If not, go back!

### Updating the routes to work with the database
- Now that we have our database setup. It is time to implement the routes to work with the database as well.

- Go to the `bird.controller.ts` file and add `this.repository = getRepository(Bird);` to your contructor. Don't forget to import the `getRepository` method as well.
- Also make sure you have the `repository` property: `public repository: Repository<Bird>;` This is the connection towards the database table that we need.
- We can now change our route methods to use this repository instead of the old `birds` property. So you can remove that.
- Adapt the routes like this:
    ```typescript
    all = async (request: Request, response: Response, next: NextFunction) => {
        const birds = await this.repository.find(); // Use the correct methods on the repository, depending on the CRUD operation you want to perform.
        response.send(birds);
    }

:::info
**TIP**  
Find more information on the TypeORM queries on the website: https://typeorm.io/#/find-options and https://typeorm.io/#/repository-api  
There you will find the difference between `find`, `findOne` and all the options you have to query your database objects.
:::

### Adding a seeder
- We will quickly learn how to seed our database as well. That might be interesting to add the list of our birds during the initial setup.
- Create a new directory in your `server` folder, called `seeders`. This will contain all our initial starting data, but also the code necessary to seed it into the database.
- Move the `birds.json` into that directory.
- Create a new file called `seeder.ts`. Start it off with an empty `async` arrow-function called `seedDatabase`. Make sure to export it as default:
`export default seedDatabase`.
- This function will require a Connection parameter, which is of the `Connection` type: `import { Connection } from "typeorm";`.

Remember how we read in our `birds.json` and converted them to `Bird` entities? Do it again, so you can get all the birds inside of the seedDatabase function. You know how to do it.

- To save all our birds at once, we can get the Connection Manager from TypeOrm. It will require certain Entities (can be a list, or just one item), and it will save it to the right table associated with the entity. `allBirds` is my list of all Bird entities.
```typescript
await connection.manager.save(allBirds); // Seed birds
```

- Execute the `seedDatabase` function from `app.ts`.
    ```typescript
    // ...
      .then(createConnection)
      .then(async (connection: Connection) => {

        seedDatabase(connection);
        // ...
    ```

- You will notice that the application will seed these items into the database on every start-up. We will have to keep track of the seeded-state somewhere. I chose to do it in a very easy way, by keeping a Config table into my database. If you find another way to do it, please try so.
- Create an Entity into the database called `Config`. This only takes a `key` and `value`. Make sure to add a new item into our database once the database was seeded. Check if that key already exists in the database or not.
- Implement the checks on your own. If you are stuck, you can ask for a free hint!

> **TIP**
> You'll have to drop your Birds table after you've created it the first time. Because it will keep on trying to seed, and fill in unique values that already exist.

- Test to see if your application still functions properly.
## Adding more entities
- If you are finished with adding a Bird entity, try the same with a User entity.
    - A user contains a `uuid`, a `name`, a `locationOfResidence`, `age`, `gender` and `registrationDate`.
    - Add a few routes for the User objects
    - Add a few test users in a `user.json` file.
    - Add a controller.
    - Seed the users

- We also need an `Observation` entity, which contains a `uuid`, `location`, `date`, and a relation to the `User` object.
    - For the `date` you can use a special column for the date the object was created. Search in [the docs](https://typeorm.io/#/entities) about the special kind of columns which you can use for this.
    - The relations can be configured as follows:
    ```typescript
        @ManyToOne(() => User) // One user can have many observations
        @JoinColumn( {name: "user_id"} ) // Store the ID of the user inside the 'observations' table under the column 'user_id'
        user?: User;
    ```
    - You can also configure the relation on the other side, in the `User` entity. Here, we will need the opposite. a `OneToMany` relation. Figure out how to do it, following the documentation on the Typeorm website.

- POST some requests through Postman to test out your API and see if you can get the relations working as well.

- Eventually, we will add a final entity called `BirdObservation` so we can register which birds we have found during the observation.
- The entity should contain a ManyToOne relation with both `Bird` and `Observation`.
- Beside that, we also want to regsiter the `amount` of that type of bird that was seen in the observation.
- When you register the relations, also make sure you register them on the other side of the relation.

- Update your routes to allow the relations to come through as well. For example the `bird.controller.ts` would have something like this:
```typescript
const birds = await this.repository.find({ relations: ['birdObservations'] });
```
- For more complex queries, you can chain them like this:
```typescript
const observations = await this.repository.createQueryBuilder("observations")
        .leftJoinAndSelect("observations.user", "user")
        .leftJoinAndSelect("observations.birdObservations", "bo")
        .leftJoinAndSelect("bo.bird", "bo-bird")
        .getMany();
```
- Test out what you need and update your routes where necessary.

## Building your app

We are now ready to build our app. We just need to add a build script to our `package.json` file.
`"build": "tsc -p ."` is more than enough.

Try to build your app and see if it gives any errors or not. `npm run build`. Check the generated files of your application, which end up inside the `dist` folder. Try and run the app with `pm2-runtime` (`npm install pm2`): `npx pm2-runtime dist/app.js`.

Notice that you will get a problem. Try to fix the issue yourself.

> **Tip**:
> It's something with the `ormconfig.env` file, and our new setup.

## Dockerize

Our built app is ready to be deployed in Docker.

- Create a Dockerfile
- Create a `docker.ormconfig.env` with special settings for your Docker container connection to the database.

### Dockerfile
The Dockerfile we will create for production needs to be built in a multi-stage.  
In the first step, we install all the packages to build our app.

In the second step, we only install the runtime necessary for our application to be run somewhere else. You will notice we don't need our source code anymore in the effective application.

```dockerfile

# First, we build our app to be compiled as Javascript
FROM node:16.9.1-alpine as build-container
WORKDIR /usr/app
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
RUN npm ci
COPY server ./src
RUN npm run build

## Now, we create a secondary container, to be used in production
FROM node:16.9.1-alpine as production-container
WORKDIR /usr/app

COPY ["package.json", "package-lock.json", "./"]
RUN npm ci --only=production
RUN npm install pm2 -g
COPY --from=build-container /usr/app/dist .
EXPOSE 80

CMD ["pm2-runtime","app.js"]

```


> **Note**
> As we have built our package, and our application now has a little different structure, we are working with `*.js` files, and we have copied our built directory into `/usr/app`. This is why we have to change the values to adapt to the Docker environment. Use the ormconfig you tested during the previous step.

- Add a new service to your `docker-compose.yml`
    - Open port `3000`.
    - Pass the `docker.ormconfig.env` as an `.env` file.
    - Make sure your app gets built as well, remember the build context ?
    - Give it a name you like. For now, you can work with a Dockerhub image. We will later convert it to GitHub Container Registry (GHCR). So we can have more private images.
    - You can also set the `NODE_ENV` to `Production` if you like. It doesn't do much right now, but we could use it if we wanted to.

- Stop your running application and see if you can build your app. If everything works correctly, your app should build and start running a service on port 3000
## *Optional:* Dependency injection

The following exercises are optional, but can help you in creating a beautiful API, with an easy-to-adapt structure.

### Inheriting the controllers

You might've noticed that we have a few duplicate actions on your controllers. If we make everything inherit from a base `CrudController`, we can prevent that.

```typescript
export class CrudController<T> { // We will have to inherit it in a special way to use the T-parameter.

  public repository: Repository<T>; // The T-parameter will be linked in here as well ...

  constructor(model: EntityTarget<T>) { // ... And here
    this.repository = getRepository(model); // Because we set the repository property in here, we can use it in our generic queries.
  }

}
```

You can now extend any other controller from this `CrudController`:

```typescript
export class BirdController extends CrudController<Bird> {

    // Your custom properties

    constructor() {
        super(Bird);

        // Your routes
    }

    // Methods to override

    all = async () => {
        // ...
    }
}

```

### Interfaces

Remember the interfaces from last year? We can also use them in Typescript. This will be a good example on how to force a certain structure on your app.
Let's say I want my application to function with at least a `get all`, `get one by ID` and a `create` method on my BirdController. I need to make sure that everyone who creates certain implementations, always implements these methods, at least.

To force that, I can create an interface, and ask other developers to implement it as well.

Let's create an interface for our `CrudController` and call it an `ICrudController`. We can just put it in our `crud.controller.ts` file.

```typescript

/**
 * The interface to use for every Crud Controller.
 */
 export interface ICrudController  {
  all(request: Request, response: Response, next: NextFunction): void;
  one(request: Request, response: Response, next: NextFunction): void;
  save(request: Request, response: Response, next: NextFunction): void;
}

export class CrudController<T> implements ICrudController {}
```

Let's also create similar interfaces for our `BirdController`, `UserController` and `ObservationController`. I will later on explain why we need that. You can make it extend from the `ICrudController` so it automatically inherits from that.

Go back to your `app.ts` file, and notice how we have some more duplicate code in here.

```typescript

const birdController = new BirdController(); // Because it was a class, we need to initialize it!
const userController = new UserController(); // Because it was a class, we need to initialize it!
const observationController = new ObservationController(); // Because it was a class, we need to initialize it!

app.use('/bird', birdController.router);
app.use('/user', userController.router);
app.use('/observation', observationController.router);

```

We always have to add a new line for every controller that gets added, and we could easily create a for-loop for this.

- Create a new interface `IController` which has a `router` property. All the other controller interfaces should inherit from that one. You will end up with empty interfaces. But that's ok.

We can now create an object with a key as a `string`, and a value as an `IController`-object. 

Let's add our Controllers to the object and loop over it.

```typescript

const controllers: Record<string, IController> = {
      'bird': new BirdController(),
      'user': new UserController(),
      'observation': new ObservationController()
}

Object.keys(controllers).forEach((key: string) => {
    app.use(`/${key}`, controllers[key].router);
});

```

We can enforce even one more thing, to make sure our developers are always providing us with at least these three controllers, by adding yet another interface:

```typescript

interface IAppControllers {
      'bird': IBirdController
      'user': IUserController
      'observation': IObservationController
  }

    const controllers: IAppControllers = {
      'bird': new BirdController(),
      'user': new UserController(),
      'observation': new ObservationController()
    };

    // Entries: [ ['bird', 'BirdController'], ['user', 'UserController'], ['observation', 'ObservationController'] ]
    Object.entries(controllers).forEach((entry: any) => {
        const key = entry[0] as string,
              controller = entry[1] as IController;
        app.use(`/${key}`, controller.router);
    });

```

Try to comment out one of the controllers inside our `controllers` const. You will see that you get an error because you are not implementing all the objects inside the interface. This is exactly the type of code-hinting we need. It enforces us to use the correct implementations.  
Also try to use the wrong kind of Controller. It will only fail if your `BirdController` needs some kind of other property that the `UserController` is not implementing.

### Recap:

We have now enforced a way to keep our app functioning like we intended it to be. Any other developer should keep to our rules from now on. 😈

## Optional: Extra

### Listing your endpoints

For now, I haven't found a nice way to introduce Swagger for our API yet. As an alternative, I have found a way to list all the avaliable endpoints. This does, however, not show us the required payloads for our API endpoints.

- `npm i --save-dev @types/express-list-endpoints`
- `import listEndpoints from 'express-list-endpoints';`

## Uploading to GitHub Containers

Because we are going to use our Docker container into Kubernetes next week, it is important for us to try and get everything set up for that already.

The most important thing is to **Push** our Docker image to somewhere public. We *can* do that on Docker Hub, but know that your image will not be private. Docker Hub only allows for one private image per account.

We can however work with **GitHub Container Registry**. That is a service that is available for us to use on our GitHub Account. We will configure it to work on our virtual machine and laptop if necessary.

- Go to GitHub and create a Personal Access Token (PAT) on the [developer settings](https://github.com/settings/apps).
- Check the following scopes:
    - `write:packages`
    - `delete:packages`
- Set the expiration date at a time you prefer. (One year is fine, unless you want to come back next year!)
- Export this PAT in your terminal: `export PAT='your-personal-access-token-here'`.
- Try and check if the export succeeded by executing `echo $PAT`.
- Now log in to the GHCR with this PAT: `echo $PAT | docker login ghcr.io --username YOURGITHUBUSER --password-stdin`.
- We can now tag an image like `ghcr.io/nathansegers/01_ExpressBirds`.
- Push it and you'll see it in your profile under `Packages`.

## Kubernetize

We now have to get our app into Kubernetes. We can do that by using the Rancher UI, or by creating `.yaml` files for our Kubernetes objects.

Both steps will be explained below.

### Rancher UI

We will first try and set up a Rancher project and Kubernetes Namespace on the Rancher dashboard.

Go to the [Rancher dashboard](https://172.23.82.60:8100). Make sure you are connected to the Howest network (VPN or on campus).

Use the credentials for your virtual machine. Go to the `advfs` cluster.

**The first time you're doing this, create a new project for your user**.
- I will create a project called `segers-nathan` inside this cluster.
- You will also get the option to create a namespace. This namespace must be unique across the whole cluster, so you cannot just go and enter 'birds'. You'll need to specify `segers-nathan-birds` to be safe.
- Navigate to `Cluster > Projects/Namspaces` again and choose the namespace you just created.
- Go to `Workload > Deployments` and create a new deployment.

On this page you can go and deploy your own applications. We will start off by deploying an `adminer` and `vue-docker` app to get the hang of it. Later on, we will continue with more complex applications.

- Create a new deployment
    - Enter a name for the deployment you want to create
    - Choose the namespace you created earlier
    - Enter at least one replica. 
    - Choose the container name you want to deploy: `nathansegers/vue-docker:1.0.0`
        - If you are deploying an image from a private registry, make sure you select the right Pull Secrets. More on this later
    - Add a necessary port mapping
        - Choose Cluster IP if you want to keep it privately (similar to Expose in Docker)
        - Choose a Node Port if you want to get it publically available (like the Ports in Docker)
        - Note that the Node Port must be higher than 30.000. Ports from 30.000 untill 30.020 have been forwarded to your laptop through Teleport. If you need more, forward them accordingly.
    - Choose the right Node Scheduling: This is important, if you take the wrong one on your project assignment, you can not get graded.
        - `Run pods on specific node(s)` Then select your machine
        - `Run pods on node(s) matching scheduling rules` is also an option. Here you can work with the `kubernetes.io/hostname` key and the value `in list` `segers-nathan` to specify one hostname. Adding multiple of these rules will allow to schedule over multiple machines.
    - Try to go to `localhost` together with the NodePort you selected for your app. Check if you can view the app you wanted to deploy.

#### Scaling your application
If we are going to scale out our application, please note that you are going to deploy the same application multiple times (replica's), but with the same Ports. To allow this to succeed, we will need to add a **Service** which can access multiple pods and expose them through one service.

- Go to the `Service Discovery` app

    - Scale your application to more replica's, for example **5**. You won't notice it in the `:1.0.0` version yet.
    - Upgrade the app to `nathansegers/vue-docker:2.0.0` now, and refresh your app to see the rollout happen live. You can rollback anytime you want.
    - 

:::warning
**REMEMBER**  
Because we are all inside the same Kubernetes cluster, we need to specify the **Node** our workloads should be deployed on.
Choose to deploy your application on your **own** virtual machines, by specifiying it with the **Node selector** option. Selecting the wrong virtual machine will not allow you to view your own deployments.
:::

We will go on with Kubernetes in the assignment of next week. This is just a demo.

### TODO: Yaml

### TOOD: Helm

### TODO: CI/CD