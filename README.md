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

## License

MIT © [Saurabh Sharma](https://github.com/saurshaz)
