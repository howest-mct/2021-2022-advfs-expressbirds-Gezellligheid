export class Bird {
  uuid?: string;
  id?: string;
  name?: string;
  short?: string;
  image?: string;
  recon?: string[];
  food?: Record<string, string>;
  see?: string;

  sayHello = () => {
    console.log(`Hello, I am ${this.name}`);
  };
}
