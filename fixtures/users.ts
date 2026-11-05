import { faker } from '@faker-js/faker';
export interface NewUser {
  name: string; email: string; password: string; firstName: string; lastName: string;
  company: string; address1: string; address2: string; country: string;
  state: string; city: string; zipcode: string; mobile: string;
}
export function newUser(): NewUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    name: `${firstName} ${lastName}`,
    email: `qa-${faker.string.uuid()}@example.test`,
    password: faker.internet.password({ length: 14 }),
    firstName, lastName, company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(), country: 'Canada',
    state: faker.location.state(), city: faker.location.city(),
    zipcode: faker.location.zipCode(), mobile: '09' + faker.string.numeric(8),
  };
}
export function existingUser() {
  const email = process.env.AE_TEST_EMAIL;
  const password = process.env.AE_TEST_PASSWORD;
  const name = process.env.AE_TEST_NAME;
  if (!email || !password || !name) return null;
  return { email, password, name };
}
