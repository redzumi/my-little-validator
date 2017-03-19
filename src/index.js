class Field {
  constructor() {
    this.fieldValidators = [];
    MyLittleValidator.AVAILABLE_VALIDATORS.forEach((validator) => {
      this[validator.name] = (value) => {
        this.fieldValidators.push({ validator, value });
        return this;
      };
    });
  }

  //custom name
  name(name) {
    this.name = name;
    return this;
  }

  //return field error
  validate(data) {
    //validating, will return validator with error
    return this.fieldValidators.find((fieldValidator) => {
      return !fieldValidator.validator.validate(data, fieldValidator.value);
    });
  }
}

class Schema {
  constructor(fields) {
    this.fields = fields;
  }

  validate(data) {
    const schemaErrors = [];
    Object.keys(this.fields).map((key) => {
      const validateError = this.fields[key].validate(data[key]);
      if(validateError) schemaErrors.push({
        type: validateError.validator.name,
        value: validateError.value,
        field: key,
        name: this.fields[key].name
      });
    });
    return schemaErrors;
  }
}

class MyLittleValidator {

  static DEFAULT_LOCALE = {
    string:   '%%field%% must be a string!',
    min:      '%%field%% length must be longer than %%value%% characters.',
    max:      '%%field%% length must be less than %%value%% characters.'
  };

  static AVAILABLE_VALIDATORS = [
    {
      name: 'string',
      validate: (data) => (typeof data === 'string')
    },
    {
      name: 'min',
      validate: (data, value) => data.length > value
    },
    {
      name: 'max',
      validate: (data, value) => data.length < value
    }
  ];

  constructor() {
    this.locale = MyLittleValidator.DEFAULT_LOCALE;
  }

  registerValidator(name, validate) {
    MyLittleValidator.AVAILABLE_VALIDATORS.push({ name, validate });
  }

  updateLocale(locale) {
    this.locale = { ...this.locale, ...locale };
  }

  validate(schema, data) {
    const errors = schema.validate(data);
    if(errors.length == 0) return null;
    return { errors, message: this.error(errors[0]) };
  }

  schema(fields) {
    return new Schema(fields);
  }

  field() {
    return new Field();
  }

  error(data) {
    return this.locale[data.type]
      .replace('%%value%%', data.value)
      .replace('%%field%%', data.name || data.field);
  }
}

export default MyLittleValidator;
