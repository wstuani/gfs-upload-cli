#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')

const app = require('commander')
const mongodb = require('mongodb')
const mime = require('mime')
const async = require('async')

app.version('0.0.1')
  .usage('[options] [files...]')
  .description('Upload files to MongoDB GridFS using cli.')
  .option('-H, --host <string>', 'MongoDB URI')
  .option('-D, --dir <string>', 'Directory')
  .option('-v, --verbose', 'Verbose output')
  .parse(process.argv)

if (!app.dir || !app.host) app.help()

console.log(' app.host >>> ', app.host)
mongodb.MongoClient.connect(app.host, (error, db) => {
  if (error) {
    console.log('error >>> ', error)
    process.exit(1)
  } else {
    let successCount = 0
    if (error) {
      process.exit(1)
    }

    let parentDir = path.join(path.resolve(app.dir))
    console.log(' app.dir >>> ', parentDir)

    let bucket = new mongodb.GridFSBucket(db)
    async.waterfall([
      function (cb) {
        fs.readdir(parentDir, cb)
      },
      function (files, cb) {
        // `files` is just an array of file names, not full path.
        // Consume 10 files in parallel.
        async.eachLimit(files, 10, function (filename, done) {
          let filepath = path.join(parentDir, filename)
          // Do with this files whatever you want.
          // Then don't forget to call `done()`.
          console.log(' filepath >>> ', filepath)
          if (!fs.lstatSync(filepath).isDirectory()) {
            let uploadStream = bucket.openUploadStream(filepath, {contentType: mime.lookup(filename)})
            uploadStream.on('error', (error) => {
              if (app.verbose) console.log('Error for', filepath)
            })

            uploadStream.on('finish', fileInfo => {
              successCount++
              if (app.verbose) console.log('Success for', filepath, '->', fileInfo._id)

              let config = {}
              config.db = db
              config.filename = filename
              config.filepath = filepath
              config._id = fileInfo._id

              let hooks
              try {
                hooks = require(parentDir + '/hooks.js')
              } catch (e) {
                console.log('error in getting hook >>> ', e)
              }

              if (hooks) {
                hooks.postAddFileToDatabase(config, (err, res) => {
                  if (err) {
                    console.log('err in >> post hook >> ', err)
                  } else {
                    console.log('result in >> post hook >> ', res.result)
                    if (successCount === files.length) {
                      console.log('end of files push. can terminate the process')
                    // db.close()
                    }
                  }
                })
              } else {
                if (successCount === files.length) {
                  console.log('end of files push. can terminate the process')
                // db.close()
                }
              }
            })

            // if (successCount === files.length) db.close()
            fs.createReadStream(filepath).pipe(uploadStream)
          } else {
            successCount++
            if (successCount === files.length) db.close()
          }
          done()
        }, cb)
      }
    ], function (err) {
      // db.close()
      err && console.trace(err)
      console.log('Done upload to gridfs')
    // process.exit(1)
    })
  }
})
