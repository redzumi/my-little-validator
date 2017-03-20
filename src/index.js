class Field {
  constructor() {
    this.values = {};
    Object.keys(MyLittleValidator.AVAILABLE_VALIDATORS)
      .forEach((key) => {
        this[key] = (value) => {
          this.values[key] = value; return this;
        }
      });
  }

  //custom name
  name(name) {
    this.name = name;
    return this;
  }

  //return field error
  validate(data) {
    let fieldError = null;
    Object.keys(this.values).forEach((key) => {
      if(fieldError) return;
      if(!MyLittleValidator.AVAILABLE_VALIDATORS[key](data, this.values[key]))
        fieldError = { type: key, value: this.values[key] };
    });
    return fieldError;
  }
}

class Schema {
  constructor(fields) {
    this.fields = fields;
  }

  validate(data) {
    const schemaErrors = [];
    Object.keys(this.fields).forEach((key) => {
      const fieldError = this.fields[key].validate(data[key]);
      if(fieldError) {
        schemaErrors.push({
          ...fieldError,
          ...{ field: key, name: this.fields[key].name }
        });
      }
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

  static AVAILABLE_VALIDATORS = {
    string: (data) => (typeof data === 'string'),
    min:    (data, value) => data.length > value,
    max:    (data, value) => data.length < value
  };

  constructor() {
    this.locale = MyLittleValidator.DEFAULT_LOCALE;
  }

  registerValidator(name,  predicate) {
    MyLittleValidator.AVAILABLE_VALIDATORS[name] = predicate;
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
