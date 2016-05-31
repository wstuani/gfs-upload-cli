# gfs-upload-cli
[![Build Status](https://travis-ci.org/saurshaz/gfs-upload-cli.svg?branch=master)](https://travis-ci.org/saurshaz/gfs-upload-cli)  
Upload files to MongoDB GridFS using cli

## Install

```
$ npm install --global gfs-upload-cli
```

## Usage

```
$ gfs-upload --help

  Usage: gfs-upload -v -D <relaive_directory_path>  -H <db_uri>
  
  Upload files to MongoDB GridFS using cli.

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -H, --host <string>  MongoDB URI
    -D, --dir <string>   Relative directory path(to be uploaded)
    -v, --verbose        Verbose output

  Example Usage: 
     gfs-upload -v -D ./dashgum  -H mongodb://localhost/clitest  

```


In addition most times you would also want to add arbitrary information in `gridfs` metadata for searching files ina better manner in future.
This is now built in by writing a `hooks.js` file. which can have some hook functions

##### This would look a bit like below

```javascript
  module.exports = {
    // add logic to run after files have been created into datbase,
    // config._id is the new file created
    // config.filename is the created file name
    // config.filepath is the created file path
    // config.db is the db instance for any db operations
    postAddFileToDatabase: function (config, cb) {
      config.db.collection('fs.files').update({_id: config._id},
        {
          '$set': {
            'metadata.a': 'a', 'metadata.b': 'b'
          }
        },
        {$multi: true}
        , cb)
    }
  }

```

the function `postAddFileToDatabase` logic is all upto the caller of the module.

## License

MIT © [Saurabh Sharma](https://github.com/saurshaz)
