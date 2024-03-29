import { generateCPF, getStates } from '@brazilian-utils/brazilian-utils';
import { faker } from '@faker-js/faker';
import { createOrUpdateEnrollmentSchema } from '@/schemas';

describe('createEnrollmentSchema', () => {
  const generateValidInput = () => ({
    name: faker.person.fullName(),
    cpf: generateCPF(),
    birthday: faker.date.past().toISOString(),
    phone: '(21) 98999-9999',
    address: {
      cep: '90830-563',
      street: faker.location.street(),
      city: faker.location.city(),
      number: faker.number.int().toString(),
      state: faker.helpers.arrayElement(getStates()).code,
      neighborhood: faker.location.secondaryAddress(),
      addressDetail: faker.lorem.sentence(),
    },
  });

  it('should return an error if input is not present', () => {
    const result = createOrUpdateEnrollmentSchema.validate(null);

    expect(result.error).toBeDefined();
  });

  describe('name', () => {
    it('should return error if name is not present', () => {
      const input = generateValidInput();
      delete input.name;

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if name is less than 3 characters', () => {
      const input = generateValidInput();
      input.name = faker.lorem.word(2);

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe('cpf', () => {
    it('should return error if cpf is not present', () => {
      const input = generateValidInput();
      delete input.cpf;

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if cpf is invalid', () => {
      const input = generateValidInput();
      input.cpf = '12345678901';

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if cpf is masked', () => {
      const input = generateValidInput();
      input.cpf = '012.345.678-90';

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe('birthday', () => {
    it('should return error if birthday is not present', () => {
      const input = generateValidInput();
      delete input.birthday;

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return an error if birthday is not an iso date', () => {
      const input = generateValidInput();
      input.birthday = 'not an iso date';

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe('phone', () => {
    it('should return error if phone is not present', () => {
      const input = generateValidInput();
      delete input.phone;

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if phone is not a mobile phone', () => {
      const input = generateValidInput();
      input.phone = '1234567890';

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });

    it('should return error if phone is not masked', () => {
      const input = generateValidInput();
      input.phone = '12999887766';

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe('address', () => {
    it('should return error if address is not present', () => {
      const input = generateValidInput();
      delete input.address;

      const { error } = createOrUpdateEnrollmentSchema.validate(input);

      expect(error).toBeDefined();
    });

    describe('cep', () => {
      it('should return error if cep is not present', () => {
        const input = generateValidInput();
        delete input.address.cep;

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return error if cep is not a cep', () => {
        const input = generateValidInput();
        input.address.cep = '1234567890';

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return error if cep is not masked', () => {
        const input = generateValidInput();
        input.address.cep = '12345678';

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    describe('street', () => {
      it('should return error if street is not present', () => {
        const input = generateValidInput();
        delete input.address.street;

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return error if street is not a string', () => {
        const input = generateValidInput();

        const { error } = createOrUpdateEnrollmentSchema.validate({
          ...input,
          address: {
            ...input.address,
            street: faker.number.int(),
          },
        });

        expect(error).toBeDefined();
      });
    });

    describe('city', () => {
      it('should return error if city is not present', () => {
        const input = generateValidInput();
        delete input.address.city;

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return error if city is not a string', () => {
        const input = generateValidInput();

        const { error } = createOrUpdateEnrollmentSchema.validate({
          ...input,
          address: {
            ...input.address,
            city: faker.number.int(),
          },
        });

        expect(error).toBeDefined();
      });
    });

    describe('number', () => {
      it('should return error if number is not present', () => {
        const input = generateValidInput();
        delete input.address.number;

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return error if number is not a string', () => {
        const input = generateValidInput();

        const { error } = createOrUpdateEnrollmentSchema.validate({
          ...input,
          address: {
            ...input.address,
            number: faker.number.int(),
          },
        });

        expect(error).toBeDefined();
      });
    });

    describe('state', () => {
      it('should return error if state is not present', () => {
        const input = generateValidInput();
        delete input.address.state;

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return error if state is not a valid brazilian state', () => {
        const input = generateValidInput();

        const { error } = createOrUpdateEnrollmentSchema.validate({
          ...input,
          address: {
            ...input.address,
            state: 'XX',
          },
        });

        expect(error).toBeDefined();
      });

      it('should return error if state is not a string', () => {
        const input = generateValidInput();

        const { error } = createOrUpdateEnrollmentSchema.validate({
          ...input,
          address: {
            ...input.address,
            state: faker.number.int(),
          },
        });

        expect(error).toBeDefined();
      });
    });

    describe('neighborhood', () => {
      it('should return error if neighborhood is not present', () => {
        const input = generateValidInput();
        delete input.address.neighborhood;

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeDefined();
      });

      it('should return error if neighborhood is not a string', () => {
        const input = generateValidInput();

        const { error } = createOrUpdateEnrollmentSchema.validate({
          ...input,
          address: {
            ...input.address,
            neighborhood: faker.number.int(),
          },
        });

        expect(error).toBeDefined();
      });
    });

    describe('addressDetail', () => {
      it('should not return error if addressDetail is not present', () => {
        const input = generateValidInput();
        delete input.address.addressDetail;

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeUndefined();
      });

      it('should not return error if addressDetail is an empty string', () => {
        const input = generateValidInput();
        input.address.addressDetail = '';

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeUndefined();
      });

      it('should not return error if addressDetail is null', () => {
        const input = generateValidInput();
        input.address.addressDetail = null;

        const { error } = createOrUpdateEnrollmentSchema.validate(input);

        expect(error).toBeUndefined();
      });

      it('should return error if addressDetail is not a string', () => {
        const input = generateValidInput();

        const { error } = createOrUpdateEnrollmentSchema.validate({
          ...input,
          address: {
            ...input.address,
            addressDetail: faker.number.int(),
          },
        });

        expect(error).toBeDefined();
      });
    });
  });

  it('should return no error if schema is valid', () => {
    const input = generateValidInput();

    const { error } = createOrUpdateEnrollmentSchema.validate(input);

    expect(error).toBeUndefined();
  });
});
