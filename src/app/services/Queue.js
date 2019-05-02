const kue = require('kue')
const Sentry = require('@sentry/node')
const redisconfig = require('../../config/redis')
const jobs = require('../jobs')

const Queue = kue.createQueue({ redis: redisconfig })

Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle)

Queue.on('error', Sentry.captureException)

module.exports = Queue
