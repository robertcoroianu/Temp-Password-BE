// @ts-nocheck
import Fastify from 'fastify'
import fastifyRedis from 'fastify-redis'
import { generate_pwd }  from './utils/pwd-generator.js'

// Fastify
const fastify = Fastify({
    logger: true
})

// Check for jSON body
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
      var json = JSON.parse(body)
      done(null, json)
    } catch (err) {
      err.statusCode = 400
      done(err, undefined)
    }
})

// Redis
fastify.register(fastifyRedis, { 
    host: 'redis-16584.c293.eu-central-1-1.ec2.cloud.redislabs.com',
    password: 'IMVkzbH96iRbBL42RrsNcK9v4hcmPHLy',
    port: 16584
  })

// Routes
fastify.post('/generate', (req, reply) => {
    const { redis } = fastify
    const id = req.body.id 
    const randomPwd = parseInt(Date.now() * Math.random())
    redis.set(id, randomPwd, (err) => {
        reply.status(err ? 400 : 201)
        reply.send(err || { status: 'ok', password: randomPwd })
    })
    redis.expire(id, 30)
})

// Run
fastify.listen(3000, (err, address) => {
    if (err) throw err
})