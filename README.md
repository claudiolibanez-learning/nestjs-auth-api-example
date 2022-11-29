## Docker

```bach
$ docker system prune -a && docker volume prune
``` 

```bach
$ docker run --name postgresql -e POSTGRES_USER=docker -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=docker -p 5432:5432 -d postgres
```

## Config and DotEnv

```bach
$ yarn add @nestjs/config 
```

<br>


## ORM - Object Relational Mapping

<br>

instalação do tyeporm:

```bach
$ yarn add @typejs/typeorm typeorm pg
```

<br>

## Migrations

```bach
# generate base migration
$ yarn migration:generate -- src/database/migrations/BaseMigraitons

# or 

# create migration user
$ yarn migration:create src/database/migrations/CreateUser
```

<br>

## Add class validator and class transformer

```bach
$ yarn yarn add class-validator class-transformer
```

<br>

## Add Users Module

```bach
$ nest g module users
```

## Add Auth Module

```bach
$ nest g module auth
```

### Local Strategy

```bach
$ yarn add @nestjs/passport passport passport-local

$ yarn add -D @types/passport-local
```

### Install Bcrypt

```bach
$ yarn add bcrypt

$ yarn add -D @types/bcrypt
```

### Install JWT

```bach
$ yarn add @nestjs/jwt passport-jwt

$ yarn add -D @types/passport-jwt
```