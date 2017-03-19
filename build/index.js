'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Field = function () {
  function Field() {
    var _this = this;

    (0, _classCallCheck3.default)(this, Field);

    this.fieldValidators = [];
    MyLittleValidator.AVAILABLE_VALIDATORS.forEach(function (validator) {
      _this[validator.name] = function (value) {
        _this.fieldValidators.push({ validator: validator, value: value });
        return _this;
      };
    });
  }

  //custom name


  (0, _createClass3.default)(Field, [{
    key: 'name',
    value: function name(_name) {
      this.name = _name;
      return this;
    }

    //return field error

  }, {
    key: 'validate',
    value: function validate(data) {
      //validating, will return validator with error
      return this.fieldValidators.find(function (fieldValidator) {
        return !fieldValidator.validator.validate(data, fieldValidator.value);
      });
    }
  }]);
  return Field;
}();

var Schema = function () {
  function Schema(fields) {
    (0, _classCallCheck3.default)(this, Schema);

    this.fields = fields;
  }

  (0, _createClass3.default)(Schema, [{
    key: 'validate',
    value: function validate(data) {
      var _this2 = this;

      var schemaErrors = [];
      (0, _keys2.default)(this.fields).map(function (key) {
        var validateError = _this2.fields[key].validate(data[key]);
        if (validateError) schemaErrors.push({
          type: validateError.validator.name,
          value: validateError.value,
          field: key,
          name: _this2.fields[key].name
        });
      });
      return schemaErrors;
    }
  }]);
  return Schema;
}();

var MyLittleValidator = function () {
  function MyLittleValidator(locale) {
    (0, _classCallCheck3.default)(this, MyLittleValidator);

    this.locale = (0, _extends3.default)({}, MyLittleValidator.DEFAULT_LOCALE, locale);
  }

  (0, _createClass3.default)(MyLittleValidator, [{
    key: 'validate',
    value: function validate(schema, data) {
      var errors = schema.validate(data);
      if (errors.length == 0) return null;
      return { errors: errors, message: this.error(errors[0]) };
    }
  }, {
    key: 'schema',
    value: function schema(fields) {
      return new Schema(fields);
    }
  }, {
    key: 'field',
    value: function field() {
      return new Field();
    }
  }, {
    key: 'error',
    value: function error(data) {
      return this.locale[data.type].replace('%%value%%', data.value).replace('%%field%%', data.name || data.field);
    }
  }]);
  return MyLittleValidator;
}();

MyLittleValidator.DEFAULT_LOCALE = {
  string: '%%field%% must be a string!',
  min: '%%field%% length must be longer than %%value%% characters.',
  max: '%%field%% length must be less than %%value%% characters.'
};
MyLittleValidator.AVAILABLE_VALIDATORS = [{
  name: 'string',
  validate: function validate(data) {
    return typeof data === 'string';
  }
}, {
  name: 'min',
  validate: function validate(data, value) {
    return data.length > value;
  }
}, {
  name: 'max',
  validate: function validate(data, value) {
    return data.length < value;
  }
}];
exports.default = MyLittleValidator;