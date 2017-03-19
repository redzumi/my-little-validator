# my-little-validator
Just a small objects validator.

## Usage
```javascript
import MyLittleValidator from 'my-little-validator';

//custom validator
MyLittleValidator.AVAILABLE_VALIDATORS.push({
  name: 'nonspaces',
  validate: (data) => {
    return !data.includes(' ');
  }
});

const mlv = new MyLittleValidator({
  nonspaces:  '%%field%% must be without spaces.'
});

const schema = mlv.schema({
  username: mlv.field().name('Login').string().min(5).max(10).nonspaces(),
  name: mlv.field().name('Name').string().min(3)
});

//null if it is valid
console.log(mlv.validate(schema, {
  username: 'Foobar',
  name: 'Foo'
}));
```