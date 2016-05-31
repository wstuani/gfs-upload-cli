// module.exports = {
//   postAddFileToDatabase: function (config, cb) {

//   }
// }

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
