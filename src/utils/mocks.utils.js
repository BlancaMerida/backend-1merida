import { faker } from '@faker-js/faker'

function createMockProduct() {
const code = faker.string.alphanumeric(10);
const title = faker.commerce.productName();
const description = faker.commerce.fakerDescription();
const price = faker.commerce.price({ min: 100, max: 200, dec: 2 })
const category = faker.commerce.department();
const stock = faker.number.int({ min: 0, max: 500 });
const status = faker.datatype.boolean();
const thumbnail = faker.image.url({width: 500, height: 500 })
return {code, title, description, price, category, stock, status, thumbnail}
}

function createMockUser() {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const email = faker.internet.email(first_name, last_name);
    const age = faker.number.int({ min: 18, max: 80 });
    const password = faker.internet.password({ length: 10 });
    const cart = faker.string.uuid();
    const role = faker.helpers.arrayElement(['user', 'admin']);
    
    return { first_name, last_name, email, age, password, cart, role };
}

export { createMockProduct, createMockUser }