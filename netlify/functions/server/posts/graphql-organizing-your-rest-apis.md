---
path: graphql-as-rest-api-data-layer
date: July 6th, 2020
readingtime: 25 min read
title: GraphQL organizing your REST APIs
image: /assets/heroesmovies.png
description: GraphQL organizing your REST APIs
---

In this blog post, you will learn how you can fetch related data from REST endpoints without ending up with several HTTP requests on the front-end. We will use GraphQL as a REST API data layer.

My goal here is to go hands-on with the code, building a full application from scratch, so don't expect this to be short! If you are with me, let's get the party started!

We all know it is a good practice to structure REST APIs with [clear boundaries between the resources](https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9). When we have relationships between the resources we expose the entity id and then we can get the full information based on that id on the proper endpoint resource. Something like this:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=application%2Fjson&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252FGET%2520%252Fmovies%250A%255B%250A%2520%2520%2520%257B%250A%2520%2520%2520%2520%2520%2520name%253A%2520%27Avengers%253A%2520Infinity%2520War%27%252C%250A%2520%2520%2520%2520%2520%2520link%253A%2520%27youtube-trailer-link%27%252C%250A%2520%2520%2520%2520%2520%2520villain_id%253A%25201%252C%250A%2520%2520%2520%2520%2520%2520heroes_ids%253A%2520%255B1%252C%25202%255D%250A%2520%2520%2520%257D%250A%255D%250A%250A%252F%252FGET%2520%252Fvillains%252F%257Bid%257D%250A%257B%250A%2520%2520%2520%2520name%253A%2520%27Thanos%27%252C%250A%2520%2520%2520%2520photo%253A%2520%27thanos.jpg%27%250A%257D%250A%250A%252F%252FGET%2520%252Fheroes%252F%257Bid%257D%250A%257B%250A%2520%2520%2520%2520name%253A%2520%27Hulk%27%252C%250A%2520%2520%2520%2520photo%253A%2520%27hulk.jpg%27%250A%257D"
  style="width: 100%; height: 473px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

So far everything looks good but, things will get more complicated on the front-end side. Let's suppose we have the following application backed by those endpoints:

A list of heroes movie cards. For each card, it shows the villain’s picture and name as well as the heroes who saved the day. When clicking on a card it will open up the trailer on a separate tab.

![Heroes Movies application](/assets/heroesmovies.png "Heroes Movies application")

For every movie coming from `/movies`, we need to display the information of the villain and the heroes but we only have id's exposed. We would have to deal with multiple API calls on the front-end to get all the data needed, and also play with `Promises` to wait for the related data. Something like this:

```
FETCH MOVIES
ITERATE ON THE MOVIES COLLECTION. FOR EACH:
    - FETCH VILLAIN
    - FETCH HEROES
```

You could do some magic with `Promise.all()` but even that would be a nightmare and also not performant as it will hit the endpoints several times to fetch the `villain` and `heroes` for each movie from the browser.

The above application is a pretty simple one just to show the pain of fetching related data. I am sure you have a real, clear example of when you were struggling in the same situation.

GraphQL might be the hero to save the day! 🦸🏻‍♂️

For those that are not familiar, and is wondering what GraphQL is, here is the official definition:

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Basically, you ask for something and your GraphQL server will give it to you if it is available. The data might come from different sources, but in our case, we are using our Rest APIs to fulfill the requests.

It is not a software you can download, but a [specification](https://spec.graphql.org/). Following that specification, awesome libraries have arisen adding support for a large number of [languages and platforms](https://graphql.org/code/). In the JavaScript world [Relay](https://relay.dev/) and [Apollo](https://www.apollographql.com/) are the most popular libraries.

The theory is cool, but let's code! Let's build our application from scratch.

For that to work we will need to build:

1. The REST API Server
2. The GraphQL Server
3. The Front end application

The full code-base you can find [here](https://github.com/galexandrade/heroes-graphql). Feel free to clone it and play with it!

## REST API Server

I have decided to use NodeJS with [hapi](https://hapi.dev) to build our Rest API Server. You can use whatever language you are more familiar with.

Before following the [hapi start guide](https://hapi.dev/tutorials/gettingstarted/?lang=en_US) inside the folder `rest-api-server` I have created an `index.js` to configure the routes:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252Findex.js%250Aconst%2520init%2520%253D%2520async%2520%28%29%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520...%250A%2520%2520%2520%2520server.route%28%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520method%253A%2520%27GET%27%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520path%253A%2520%27%252Fheroes%252F%257Bid%257D%27%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520handler%253A%2520handleFindHeroRequest%250A%2520%2520%2520%2520%257D%29%253B%250A%2520%2520%2520%2520server.route%28%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520method%253A%2520%27GET%27%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520path%253A%2520%27%252Fvillains%252F%257Bid%257D%27%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520handler%253A%2520handleFindVillainRequest%250A%2520%2520%2520%2520%257D%29%253B%250A%2520%2520%2520%2520server.route%28%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520method%253A%2520%27GET%27%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520path%253A%2520%27%252Fmovies%27%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520handler%253A%2520handleGetMovies%250A%2520%2520%2520%2520%257D%29%253B%250A%2520%2520%2520%2520...%250A%257D%253B"
  style="width: 100%; height: 473px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

It will create three endpoints `/movies`, `/villains/{id}` and `/heroes/{id}` returning some mock data, as my goal here is to just focus on the GraphQL part. You can take a look [here](https://github.com/galexandrade/heroes-graphql/blob/master/rest-api-server/index.js) to see the full code.

Running `yarn start` or `npm start` you should be able to start the server and hit those endpoints.

## GraphQL Server

Now we have our REST API server ready, we need to build the GraphQL server using as data-loader the endpoints we just built.

I have decided to use [Apollo](http://apollographql.com/) as I am more familiar with it, but you can use whatever you are more comfortable with.

I have created a folder called `graphql-server` and followed the [Apollo start guide](https://www.apollographql.com/docs/apollo-server/getting-started/) to install it there.

An Apollo server is pretty simple, this is the entry point `index.js`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252Findex.js%250Aconst%2520%257B%2520ApolloServer%252C%2520gql%2520%257D%2520%253D%2520require%28%2522apollo-server%2522%29%253B%250Aconst%2520typeDefs%2520%253D%2520require%28%2522.%252FtypeDefs%2522%29%253B%250Aconst%2520resolvers%2520%253D%2520require%28%2522.%252Fresolvers%2522%29%253B%250Aconst%2520RestAPI%2520%253D%2520require%28%2522.%252FdataSource%2522%29%253B%250A%250Aconst%2520server%2520%253D%2520new%2520ApolloServer%28%257B%250A%2520%2520typeDefs%252C%250A%2520%2520resolvers%252C%250A%2520%2520dataSources%253A%2520%28%29%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520return%2520%257B%2520restAPI%253A%2520new%2520RestAPI%28%29%2520%257D%253B%250A%2520%2520%257D%252C%250A%257D%29%253B%250A%250A%252F%252F%2520The%2520%2560listen%2560%2520method%2520launches%2520a%2520web%2520server.%250Aserver.listen%28%29.then%28%28%257B%2520url%2520%257D%29%2520%253D%253E%2520%257B%250A%2520%2520console.log%28%2560%25F0%259F%259A%2580%2520%2520Server%2520ready%2520at%2520%2524%257Burl%257D%2560%29%253B%250A%257D%29%253B"
  style="width: 100%; height: 409px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

It is just grouping together three files into the class `ApolloServer`, witch one referring to one important concept when we talk about GraphQL Server: `typeDefs`, `Resolvers`, and `dataSources`. Let's take a closer look at them:

**1 - TypeDefs**

It is where we define our graphs, I mean, the schema. Here is the place where we define the domain relationships. Forget all about API schemas, [switch your mind to think only about domains and entities](https://graphqlme.com/2017/11/11/build-better-graphql-apis-thinking-in-graphs/).

Let's create the following entities:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=graphql&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252FtypeDefs.js%250Aconst%2520%257B%2520gql%2520%257D%2520%253D%2520require%28%2522apollo-server%2522%29%253B%250A%250Aconst%2520typeDefs%2520%253D%2520gql%2560%250A%2520%2520type%2520Hero%2520%257B%250A%2520%2520%2520%2520id%253A%2520ID%250A%2520%2520%2520%2520name%253A%2520String%21%250A%2520%2520%2520%2520photo%253A%2520String%21%250A%2520%2520%257D%250A%250A%2520%2520type%2520Villain%2520%257B%250A%2520%2520%2520%2520id%253A%2520ID%250A%2520%2520%2520%2520name%253A%2520String%21%250A%2520%2520%2520%2520photo%253A%2520String%21%250A%2520%2520%257D%250A%250A%2520%2520type%2520Movie%2520%257B%250A%2520%2520%2520%2520id%253A%2520ID%250A%2520%2520%2520%2520name%253A%2520String%21%250A%2520%2520%2520%2520link%253A%2520String%21%250A%2520%2520%2520%2520villain%253A%2520Villain%21%250A%2520%2520%2520%2520heroes%253A%2520%255BHero%21%255D%21%250A%2520%2520%257D%250A%250A%2520%2520type%2520Query%2520%257B%250A%2520%2520%2520%2520getMovies%253A%2520%255BMission%21%255D%21%250A%2520%2520%257D%250A%2560%253B%250A%250Amodule.exports%2520%253D%2520typeDefs%253B"
  style="width: 100%; height: 473px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

Let's take a closer look at the `Movie` entity. There, we say it has a villain of the type `Villain` and it also has multiple heroes, as a collection of `Hero`.

The exclamation mark says that property cannot be `null`.

**2 - Resolvers**

The resolver is the guy responsible for getting a piece of data that was requested.

First, we have defined a resolver for `Query` and inside `getMovies`, it will be our entry point for when we query for `movies`. There it is calling a data-source (we will talk more about data-sources) to fetch our movies witch is the same response we return on the `/movies` endpoint.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252Fresolvers.js%250Aconst%2520resolvers%2520%253D%2520%257B%250A%2520%2520%2520%2520Query%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520getMMovies%253A%2520%28_source%252C%2520_args%252C%2520%257B%2520dataSources%2520%257D%29%2520%253D%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520dataSources.restAPI.getMovies%28%29%252C%250A%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520...%250A%257D%253B%250A%250Amodule.exports%2520%253D%2520resolvers%253B"
  style="width: 100%; height: 473px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

Wait? How will it load the villain and the heroes as we have defined in our type definition?

This is important! 👇👇

There is a resolver for `Movies`. Whenever a `Movie` type is returned this resolver will be invoked to grab related data (if the user requested it). Here it has a resolver for `villain`, it basically calls a data-source and then it brings data from `/villains/{id}` with the `id` coming from the parent, I mean, the movie.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252Fresolvers.js%250Aconst%2520resolvers%2520%253D%2520%257B%250A%2520%2520%2520%2520...%250A%2520%2520%2520%2520Movie%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520villain%253A%2520%28parent%252C%2520_args%252C%2520%257B%2520dataSources%2520%257D%29%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520return%2520dataSources.restAPI.getVillain%28parent.villain_id%29%253B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520...%250A%2520%2520%2520%2520%257D%252C%250A%257D%253B%250A%250Amodule.exports%2520%253D%2520resolvers%253B"
  style="width: 100%; height: 297px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

The same happens with heroes. It maps all the `heroes_ids` and calls the endpoint `/heroes/{id}` for each element.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252Fresolvers.js%250Aconst%2520resolvers%2520%253D%2520%257B%250A%2520%2520%2520%2520...%250A%2520%2520%2520%2520Movie%253A%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520...%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520heroes%253A%2520%28parent%252C%2520_args%252C%2520%257B%2520dataSources%2520%257D%29%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520return%2520parent.heroes_ids.map%28%28heroId%29%2520%253D%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520dataSources.restAPI.getHero%28heroId%29%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%29%253B%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%252C%250A%2520%2520%2520%2520%257D%252C%250A%257D%253B%250A%250Amodule.exports%2520%253D%2520resolvers%253B"
  style="width: 100%; height: 335px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

You might be concerned about performance as it will be calling the `/heroes/{id}` endpoint several times. As I said, my goal here is just to explain how you can merge and load related data easily. But, YES! This might be a problem and there is a solution, it is called [data-loader](https://www.apollographql.com/docs/apollo-server/data/data-sources/) where you can batch and make only one request.

Also, in production, the GraphQL server will be in the same network as the REST API server decreasing the load time compared with the client (browser) making those requests.

**3 - DataSources**

DataSources define where load things from. In this case, I have used the `apollo-datasource-rest` to link with the REST APIs. It is used by the resolver that we talked about above.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252FdataSource.js%250Aconst%2520%257B%2520RESTDataSource%2520%257D%2520%253D%2520require%28%2522apollo-datasource-rest%2522%29%253B%250A%250Aclass%2520RestAPI%2520extends%2520RESTDataSource%2520%257B%250A%2520%2520constructor%28%29%2520%257B%250A%2520%2520%2520%2520super%28%29%253B%250A%2520%2520%2520%2520this.baseURL%2520%253D%2520%2522http%253A%252F%252Flocalhost%253A3030%252F%2522%253B%250A%2520%2520%257D%250A%250A%2520%2520async%2520getMovies%28%29%2520%257B%250A%2520%2520%2520%2520return%2520this.get%28%2522movies%2522%29%253B%250A%2520%2520%257D%250A%250A%2520%2520async%2520getVillain%28id%29%2520%257B%250A%2520%2520%2520%2520return%2520this.get%28%2560villains%252F%2524%257Bid%257D%2560%29%253B%250A%2520%2520%257D%250A%250A%2520%2520async%2520getHero%28id%29%2520%257B%250A%2520%2520%2520%2520return%2520this.get%28%2560heroes%252F%2524%257Bid%257D%2560%29%253B%250A%2520%2520%257D%250A%257D%250A%250Amodule.exports%2520%253D%2520RestAPI%253B"
  style="width: 100%; height: 502px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

**Wrapping up our GraphQL Server**

At this point, if you run `yarn start` or `npm start` you will start the server. Remember the REST API server needs to be up.

On your browser, navigating to http://localhost:4000/ should open the GraphQL playground.

![Apollo playground](/assets/graphqlplayground.png "Apollo playground")

Cool! Now we have our GraphQL running! Can you feel the power? ⚡

[Here](https://github.com/galexandrade/heroes-graphql/tree/master/graphql-server) you can find the full code-base of our ApolloServer.

## Front end

Now, let’s connect the final missing piece of our puzzle, the front-end.

My focus here is on the GraphQL part, so, I'm not concerned about styling or testing the components properly.

First, we need to [create a new React application](https://reactjs.org/docs/create-a-new-react-app.html) with `create-react-app` and then install the [Apollo client for React](https://www.apollographql.com/docs/react/get-started/):

```sh
npm install apollo-boost @apollo/react-hooks graphql
```

Now we need to connect our Apollo Server with our front-end through `ApolloProvider`.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%252F%252Findex.js%250Aimport%2520%257B%2520ApolloProvider%2520%257D%2520from%2520%2522%2540apollo%252Freact-hooks%2522%253B%250Aimport%2520ApolloClient%2520from%2520%2522apollo-boost%2522%253B%250A%250Aconst%2520client%2520%253D%2520new%2520ApolloClient%28%257B%250A%2520%2520uri%253A%2520%2522http%253A%252F%252Flocalhost%253A4000%2522%252C%250A%257D%29%253B%250A%250AReactDOM.render%28%250A%2520%2520%253CReact.StrictMode%253E%250A%2520%2520%2520%2520%253CApolloProvider%2520client%253D%257Bclient%257D%253E%250A%2520%2520%2520%2520%2520%2520%253CApp%2520%252F%253E%250A%2520%2520%2520%2520%253C%252FApolloProvider%253E%250A%2520%2520%253C%252FReact.StrictMode%253E%252C%250A%2520%2520document.getElementById%28%2522root%2522%29%250A%29%253B"
  style="width: 100%; height: 372px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

Perfect! Now let's create the `graphql/query.js` file to create our first query asking for what we want:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520%257B%2520useQuery%2520%257D%2520from%2520%2522%2540apollo%252Freact-hooks%2522%253B%250Aimport%2520%257B%2520gql%2520%257D%2520from%2520%2522apollo-boost%2522%253B%250A%250Aexport%2520const%2520MOVIES_QUERY%2520%253D%2520gql%2560%250A%2520%2520%257B%250A%2520%2520%2520%2520getMovies%2520%257B%250A%2520%2520%2520%2520%2520%2520name%250A%2520%2520%2520%2520%2520%2520villain%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520name%250A%2520%2520%2520%2520%2520%2520%2520%2520photo%250A%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520heroes%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520name%250A%2520%2520%2520%2520%2520%2520%2520%2520photo%250A%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%2560%253B"
  style="width: 100%; height: 409px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

Awesome! Now, we just need to use it!

Let's open the `App.js` and hook it up (literally) with the query that we just built using `useQuery`:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%2520from%2520%2522react%2522%253B%250Aimport%2520MovieCard%2520from%2520%2522.%252Fcomponents%252FMovieCard%2522%253B%250Aimport%2520%257B%2520useQuery%2520%257D%2520from%2520%2522%2540apollo%252Freact-hooks%2522%253B%250Aimport%2520%257B%2520gql%2520%257D%2520from%2520%2522apollo-boost%2522%253B%250Aimport%2520%257B%2520MISSIONS_QUERY%2520%257D%2520from%2520%2522.%252Fgraphql%252Fquery%2522%253B%250A%250Aconst%2520App%2520%253D%2520%28%29%2520%253D%253E%2520%257B%250A%2520%2520const%2520%257B%2520loading%252C%2520error%252C%2520data%2520%257D%2520%253D%2520useQuery%28MISSIONS_QUERY%29%253B%250A%250A%2520%2520if%2520%28loading%29%2520return%2520%253Cp%253ELoading...%253C%252Fp%253E%253B%250A%2520%2520if%2520%28error%29%2520return%2520%253Cp%253EError%2520%253A%28%253C%252Fp%253E%253B%250A%2520%2520const%2520movies%2520%253D%2520data.getMovies%253B%250A%250A%2520%2520return%2520%28%250A%2520%2520%2520%2520%253Cdiv%2520className%253D%2522app%2522%253E%250A%2520%2520%2520%2520%2520%2520%253Cheader%2520className%253D%2522app-header%2522%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%253Ch1%253EHeroes%2520movies%2520%25F0%259F%258D%25BF%25F0%259F%258E%25AC%253C%252Fh1%253E%250A%2520%2520%2520%2520%2520%2520%253C%252Fheader%253E%250A%2520%2520%2520%2520%2520%2520%253Cdiv%2520className%253D%2522list%2522%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%257Bmovies.map%28%28movie%252C%2520index%29%2520%253D%253E%2520%28%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%253CMovieCard%2520key%253D%257Bindex%257D%2520%257B...movie%257D%2520%252F%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%29%29%257D%250A%2520%2520%2520%2520%2520%2520%253C%252Fdiv%253E%250A%2520%2520%2520%2520%253C%252Fdiv%253E%250A%2520%2520%29%253B%250A%257D%253B%250A%250Aexport%2520default%2520App%253B"
  style="width: 100%; height: 473px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

`useQuery` returns an object containing `loading`, `error`, and `data`. Inside `data`, all the movies we asked for will be included, containing the information about the villains and heroes.

Now we just need to render it. On the code above I am rendering each `movie` with the component `MovieCard`. Let's take a closer look at that component:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%2520from%2520%2522react%2522%253B%250Aimport%2520ListItem%2520from%2520%2522.%252FListItem%2522%253B%250A%250Aconst%2520MovieCard%2520%253D%2520%28%257B%2520name%252C%2520link%252C%2520villain%252C%2520heroes%2520%257D%29%2520%253D%253E%2520%28%250A%2520%2520%253Cdiv%2520className%253D%2522movie%2522%2520onClick%253D%257B%28%29%2520%253D%253E%2520window.open%28link%252C%2520%2522_blank%2522%29%257D%253E%250A%2520%2520%2520%2520%253Ch2%2520className%253D%2522title%2522%253E%257Bname%257D%253C%252Fh2%253E%250A%2520%2520%2520%2520%253Cdiv%2520className%253D%2522label%2522%253EVillain%253A%253C%252Fdiv%253E%250A%2520%2520%2520%2520%253CListItem%2520name%253D%257Bvillain.name%257D%2520photo%253D%257Bvillain.photo%257D%2520%252F%253E%250A%250A%2520%2520%2520%2520%253Cdiv%2520className%253D%2522label%2522%253EHeroes%2520who%2520saved%2520the%2520day%253A%253C%252Fdiv%253E%250A%2520%2520%2520%2520%257Bheroes.map%28%28hero%252C%2520index%29%2520%253D%253E%2520%28%250A%2520%2520%2520%2520%2520%2520%253CListItem%2520key%253D%257Bindex%257D%2520name%253D%257Bhero.name%257D%2520photo%253D%257Bhero.photo%257D%2520%252F%253E%250A%2520%2520%2520%2520%29%29%257D%250A%2520%2520%253C%252Fdiv%253E%250A%29%253B%250A%250Aexport%2520default%2520MovieCard%253B"
  style="width: 100%; height: 390px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

As you can see it receives `villain` and `heroes` with name and photo and just renders it. AMAZING!!

## Conclusion

As you saw, with only one HTTP request we were able to receive all the data we needed to render our movie cards displaying the villain and the heroes associated with each movie.

The GraphQL server was able to handle our request and join all the associated data making the REST API calls on demand. We didn't dive deep, but Apollo provides awesome performance tools. One of the greatest features is caching. I really recommend you to take a deep dive into it.

GraphQL brings great benefits:

1. Front-end and mobile just receive what they want! Nothing more, nothing less!
2. No need to make several requests to grab related data from other endpoints.
3. Less network traffic between your front-end application and backend as GraphQL might be on the same network as the REST Server.
4. Better user experience as the user will probably see fewer spinners and it will be faster (much faster when using cache).
5. Many more benefits that cannot fit in this article... :)

Enjoy it!
