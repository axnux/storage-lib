'use strict'

var main = require('./../src/main')
var chai = require('chai')
var fs = require('fs')
var expect = chai.expect

describe('higher level s3 storage helpers', function () {
  var filePath = 'pixel.gif'
  var remoteFile = 'https://s3-ap-southeast-1.amazonaws.com/dummy-test-fixtures-sp/pixel.gif'
  var storageInstance = main({
    s3Options: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION
    },
    uploads: {
      s3Bucket: process.env.S3_BUCKET,
      dest: process.env.UPLOAD_DIR || '/tmp/upload'
    }
  })

  it('should be able to tell remote file exist', function (done) {
    storageInstance.remoteFileExists(remoteFile, function (err, fileExists) {
      if (err) {
        //
      }
      expect(fileExists).to.be.true
      done()
    })
  })

  context('download context', function () {
    var fullPath = storageInstance.storageFolder() + '/' + filePath

    afterEach(function (done) {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
      done()
    })

    it('should be able to download media from url', function (done) {
      this.timeout(10000)
      storageInstance.downloadFile(remoteFile, filePath, function (err, fullPath) {
        if (err) {
          //
        }
        var fileExists = fs.existsSync(fullPath)
        expect(fileExists).to.be.true
        done()
      })
    })
  })

  context('upload context', function () {
    var filePath = './test/fixtures/pixel.gif'
    var removePath = 'output/pixel.gif'
    var remotePath = removePath

    afterEach(function (done) {
      storageInstance.removeFile(removePath, function (err) {
        if (err) {
          //
        }
        done()
      })
    })

    it.only('should be able to upload media to s3', function (done) {
      this.timeout(20000)
      storageInstance.toS3(filePath, remotePath, function (err, url) {
        if (err) {
          //
        }
        storageInstance.remoteFileExists(url, function (err, fileExists) {
          if (err) {
            //
          }
          expect(fileExists).to.be.true
          done()
        })
      })
    })
  })
})
