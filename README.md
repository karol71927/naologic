# Solution

## My solution

### Description

I have used:

- NestJS with Scheduler
- Bull with Redis
- MikroORM with MongoDB
- LangChain with OpenAI

![My solution](./docs/NAO%20-%20My%20solution.jpg)

In simple solution documents will be fetched in a scheduler every 24 hours and then split into batches. Batches will go on bull queue, so the scheduler won't process whole file. It will be more efficient, when Node doesn't process file on a main thread. Because of that it is a showcase, I pushed 10 products on the same queue to process them after creating. In the last step I have used OpenAI to generate a description.

Modules description:

- core - this is core of my application, so there is a product module
- generic - I can use this kind of module across application. I can use custom configuration every time those modules are imported
- supporting - I haven't used this kind of module in this app, but it is not part of core business logic. For example this module could contain authentication logic

### How to run it

1. Add `.env` file

```env
DB_PORT=27017
DB_USER=root
DB_PASSWORD=root
DB_NAME=naologic
DB_HOST=naologic-mongo
REDIS_PORT=6379
REDIS_HOST=naologic-redis
OPEN_AI_MAX_TOKENS= #number of tokens
OPEN_AI_API_KEY= #your key
```

2. Run docker compose

```sh
docker compose up
```

3. If you want to run scheduler immediately then uncomment line 9 in file [main.ts](./src/main.ts)

## Better solution

This solution will involve some cloud services (GCP for example)

- cloud scheduler - this service is responsible for scheduling tasks
- cloud functions - those functions are serverless, so when they are called it doesn't affect your app

![Better solution](./docs/NAO%20-%20Better%20solution.jpg)

Cloud function will fetch the file and split data into batches. Then it will call endpoint from the app. Probably there can be some kind of a load balancer for example on instance group. Load balancer will take the least used instance and this instance will process documents.

There will be two queues. First one will process products, so it will create and update products. Then it will push message on second queue which will add description enhanced by AI to documents.

This solution is better, because it takes multi instance app into consideration. The first solution uses scheduler, so every instance of app will try to process documents.

## Answers

1. If I want to inform all vendors about product creation, update or deletion then I will use inbox outbox pattern. So firstly I will save event and inform everyone about the change and then I will save entity. For core of my application I want to use this pattern, because message will be delivered at least once.
2. If deleted products have an order I will inform every module with event. Then other module probably will send an email with apologize that product is unavailable.
