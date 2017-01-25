# battlerite-api

A RESTful API for interacting with and accessing data from the internal game API for Battlerite by Stunlock Studios.

Written in Node using Express and Docker.

This is a work in progress and this is a VERY initial release with only three moderately useful endpoints. There is a ton here that is commented out or not in use, I'm not marrying myself to the "versioned" API that is currently released. It will remain v1 until there is a tagged release on GitHub and the data contract is likely to change until then. Redis will eventually be the data store and there is some work done so far for it, I'll be adding up GitHub issues as I see fit to help track progress and show the direction this project will be taking.

Error handling is also crap. I apologize, I have every intention of fixing it.

For what it's worth, a lot of people have asked for an API, here's my first pass at one. I know a lot of folks haven't been able to figure out how to authenticate, or aren't familiar with using Wireshark or a .NET decompiler, so at the very least this can be a step in the right direction for them.

Also, I assume this will be the most common error, if you are receiving 401s on your queries, it's because you were unable to authenticate using SteamUser. Double check that your environment variables contain your username and password, and if you needed to add in a SteamGuard key you did so as well.

## Requirements

* Steam Account
* Owner of Battlerite
* Recommended to not have Steam Guard enabled

## Getting Started

If you're familiar with NodeJS and would prefer not to use Docker feel free, I won't be posting those specific instructions on how to get up and running that way though.

### Prerequisites

1. You'll need [Docker](https://docs.docker.com/), specifically we'll be using `docker-compose` for this project. If you're using a Mac I'd highly recommend Docker for Mac.
2. You'll also need `git`. Not going into details on that one.

### Running the API

1. Make sure you don't have anything running on port 8080 which is the default. Configs are located in `api/configs/index.js` feel free to modify them.
2. If you have Steam Guard enabled, I'd highly recommend disabling it. If not, you'll need to pass your Steam Guard code into the configs.
3. I'd recommend setting your Steam Username and Steam Password as environment variables:
	```
    export STEAM_ACCOUNT=youraccount
    export STEAM_PASSWORD=yourpassword
    ``` 
4. Clone the repo 
    ```
    git clone https://github.com/jlajoie/battlerite-api.git
    ```
5. Swap into the base directory
    ```
    cd battlerite-api
    ```
6. Run docker-compose up, you should see a few log messages if things are running well!
    ```
    docker-compose up
    ```
7. You can access the API at `localhost:8080` by default


### API Docs

Until I have a chance to implement Swagger docs, I'll do my best to keep this up to date.

#### /admin/ping

Returns a 200 Ok status. Used for simple health checks

```
{
  "code": 200,
  "message": "Ok"
}
```

#### /api/v1/ids/:account_name

Queries against the `account/profile/id/v1` internal endpoint.

Returns the user_id used for the accounts and teams endpoints.

Using account_name = Vexation, you'll get the following response.

```
{
  "code": 200,
  "message": "Ok",
  "data": {
    "user_id": 6389
  }
}
```

#### /api/v1/accounts/:account_id

Queries against the `account/profile/public/v1` internal endpoint.

Using account_id = 6389, you'll get the following response. 

```
{
  "code": 200,
  "message": "Ok",
  "data": {
    "name": "Vexation",
    "title": 31013,
    "picture": 39053,
    "user_id": 6389
  }
}
```

#### /api/v1/teams/:account_id

Queries against the `rankings/teams` internal endpoints. 

If you're interested in getting your Solo Queue statistics, the team has only a single person as a member.

Using account_id = 6389, you'll get the following response.

```
{
  "code": 200,
  "message": "Ok",
  "data": [
    {
      "name": "",
      "avatar": 0,
      "league": 6,
      "division": 1,
      "wins": 261,
      "losses": 163,
      "members": [
        6389
      ],
      "team_id": 809136671495954400,
      "division_rating": 0,
      "placement_games_left": 0
    },
    {
      "name": "Americomp",
      "avatar": 39053,
      "league": 3,
      "division": 4,
      "wins": 18,
      "losses": 9,
      "members": [
        6389,
        5976
      ],
      "team_id": 809896781805654000,
      "division_rating": 49,
      "placement_games_left": 0
    },
    ...
  ]
}
```
