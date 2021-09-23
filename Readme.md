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