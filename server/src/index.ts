import express, { Request, Response } from 'express'
import morgan from 'morgan'

import knex from './knex'

const getKnowledgeCheckBlocks = async (req: Request, res: Response) => {
  const knowledgeCheckBlocks = await knex('knowledgeCheckBlocks')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(knowledgeCheckBlocks)
}

const getQuestions = async (req: Request, res: Response) => {
  const questions = await knex('questions')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(questions)
}

const getAnswers = async (req: Request, res: Response) => {
  const answers = await knex('answers')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(answers)
}

const getMedia = async (req: Request, res: Response) => {
  //get the route mediaId, use it to query knex and respond with result
  const mediaId = req.params.mediaId
  const media = await knex('media').where('id', mediaId)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(media)
}


const app = express()
const port = 5001

app.use(morgan('dev'))

app.get('/knowledge-check-blocks', getKnowledgeCheckBlocks)

app.get('/questions', getQuestions)

app.get('/answers', getAnswers)

app.get('/media/:mediaId', getMedia)

app.listen(port, () => console.log(`Listening on port ${port}`))
