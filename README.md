# my-little-validator
Just a small objects validator.

## Usage
```javascript
import MyLittleValidator from 'my-little-validator';

const mlv = new MyLittleValidator();

//custom validator
mlv.registerValidator('nonspaces', (data) => !data.includes(' '));
mlv.updateLocale({ nonspaces: '%%field%% must be without spaces.' });

const schema = mlv.schema({
  username: mlv.field().name('Login').string().min(5).max(10).nonspaces(),
  name: mlv.field().name('Name').string().min(3)
});

//return null if it is valid
console.log(mlv.validate(schema, {
  username: 'Brdnadhvd',
  name: 'Brdn'
}));
```