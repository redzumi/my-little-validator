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

    this.values = {};
    (0, _keys2.default)(MyLittleValidator.AVAILABLE_VALIDATORS).forEach(function (key) {
      _this[key] = function (value) {
        _this.values[key] = value;return _this;
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
      var _this2 = this;

      var fieldError = null;
      (0, _keys2.default)(this.values).forEach(function (key) {
        if (fieldError) return;
        if (!MyLittleValidator.AVAILABLE_VALIDATORS[key](data, _this2.values[key])) fieldError = { type: key, value: _this2.values[key] };
      });
      return fieldError;
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
      var _this3 = this;

      var schemaErrors = [];
      (0, _keys2.default)(this.fields).forEach(function (key) {
        var fieldError = _this3.fields[key].validate(data[key]);
        if (fieldError) {
          schemaErrors.push((0, _extends3.default)({}, fieldError, { field: key, name: _this3.fields[key].name }));
        }
      });
      return schemaErrors;
    }
  }]);
  return Schema;
}();

var MyLittleValidator = function () {
  function MyLittleValidator() {
    (0, _classCallCheck3.default)(this, MyLittleValidator);

    this.locale = MyLittleValidator.DEFAULT_LOCALE;
  }

  (0, _createClass3.default)(MyLittleValidator, [{
    key: 'registerValidator',
    value: function registerValidator(name, predicate) {
      MyLittleValidator.AVAILABLE_VALIDATORS[name] = predicate;
    }
  }, {
    key: 'updateLocale',
    value: function updateLocale(locale) {
      this.locale = (0, _extends3.default)({}, this.locale, locale);
    }
  }, {
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
MyLittleValidator.AVAILABLE_VALIDATORS = {
  string: function string(data) {
    return typeof data === 'string';
  },
  min: function min(data, value) {
    return data.length > value;
  },
  max: function max(data, value) {
    return data.length < value;
  }
};
exports.default = MyLittleValidator;