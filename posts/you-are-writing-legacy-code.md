---
path: you-are-writing-legacy-code
date: March 18th, 2020
readingtime: 10 min read
title: You are writing legacy code
image: /assets/youtube-talk.png
description: >-
  Technology is constantly evolving, and that makes the code we write today the
  one we are going to rewrite tomorrow.
---

Technology is constantly evolving, and that makes the code we write today the one we are going to rewrite tomorrow.

[![](/assets/youtube-talk.png)](https://www.youtube.com/watch?v=naZp50j6U74)

\-[_Saskatoon Dev Talks_](https://www.meetup.com/Saskatoon-DevTalks/)_, Feb 27th 2020_-

If you worked with frontend for some time, probably you have worked with many different technologies (server render web app, plain Javascript, JQuery, React, Angular, Vue) or a mix of them for doing the same thing: render a web page.

We need to keep in mind that _technology is in continuous evolution._

Let's take a look at how the way we use to build software might change throughout the years.

## A tale of one startup

No one wants to start a new business or project with old or deprecated technology, and everybody tries to choose current bleeding edge technologies that the team knows how to use.

Let’s say that we are building our new startup back in 2005. Our app does a lot of cool things. One of them is to show a list of heroes that looks like this:

![Heroes list](/assets/heroes-list.png "Heroes list")

### Server rendering

At that time, PHP was the technology to build your website with. We can render our pages on the server easily, so this is our choice to start our new promising project.

Considering `$heroes` is coming from a database, the following code is iterating on them and generating the output as HTML that is going to be returned to the browser.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=text%2Fx-php&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%253Cul%253E%250A%253C%253Fphp%2520foreach%2520%28%2524heroes%2520as%2520%2524hero%29%253A%2520%253F%253E%250A%2520%2520%2520%253Cli%253E%253C%253F%253D%2520%2524hero-%253Ename%2520%253F%253E%253C%252Fli%253E%250A%253C%253Fphp%2520endforeach%253B%2520%253F%253E%250A%253C%252Ful%253E"
  style="width: 100%; height: 173px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

Now we have our server-rendered app working fine in production. Sweet!

### JQuery

However, as time goes, we wanted more flexibility on the frontend side, so we looked around and found out that jQuery is booming, and it fits our needs. So, here we go to rewrite our amazing app to use jQuery:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=text%2Fx-php&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%253Cul%2520id%253D%2522heroes-list%2522%253E%253C%252Ful%253E%250A%253Cscript%253E%250A%2520%2520%2520%2524%28document%29.ready%28function%28%29%2520%257B%250A%2520%2520%2520%2520%2520%2520%2524.get%28%2522heroes.json%2522%252C%2520function%28heroes%252C%2520status%29%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520heroes.forEach%28hero%2520%253D%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2524%28%2522%2523heroes-list%2522%29.append%28%2522%253Cli%253E%2522%2520%252B%2520hero%2520%252B%2520%2522%253C%252Fli%253E%2522%29%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%29%253B%250A%2520%2520%2520%2520%2520%2520%257D%29%253B%250A%2520%2520%2520%257D%29%253B%250A%253C%252Fscript%253E"
  style="width: 100%; height: 260px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

[![Edit JQuery Ajax](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jquery-ajax-lyqly?fontsize=14&hidenavigation=1&theme=dark)

The code above is getting the data from the server (imagine `heroes.json` as a Rest API) and appending each hero to the DOM inside the `heroes-list` div.

### React

As our product grows, our team grows as well and we realize that jQuery doesn't scale very well. Adding routes, for example, requires a lot of effort as well as maintaining the code-base and adding new functionality. But if we look around we see that there is a lot of new hip frameworks floating around. [Angular](https://angular.io/), [Vue](https://vuejs.org/), [React](https://reactjs.org/), all of them offer great flexibility when working with frontend and make it easier for us to scale our app as there is a ton of libraries we can just add to our project in case we need something.

Here we go to rewrite our application to React:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%252C%2520%257B%2520Component%2520%257D%2520from%2520%2522react%2522%253B%250Aimport%2520%257B%2520fetchHeroes%2520%257D%2520from%2520%2522.%252Fapi%2522%253B%250Aimport%2520%2522.%252Fstyles.css%2522%253B%250A%250Aclass%2520App%2520extends%2520Component%2520%257B%250A%2520%2520constructor%28%29%2520%257B%250A%2520%2520%2520%2520super%28%29%253B%250A%2520%2520%2520%2520this.state%2520%253D%2520%257B%250A%2520%2520%2520%2520%2520%2520heroes%253A%2520%255B%255D%252C%250A%2520%2520%2520%2520%257D%253B%250A%2520%2520%257D%250A%250A%2520%2520componentDidMount%28%29%2520%257B%250A%2520%2520%2520%2520fetchHeroes%28%29.then%28%28data%29%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520%2520%2520this.setState%28%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520heroes%253A%2520data%252C%250A%2520%2520%2520%2520%2520%2520%257D%29%253B%250A%2520%2520%2520%2520%257D%29%253B%250A%2520%2520%257D%250A%250A%2520%2520render%28%29%2520%257B%250A%2520%2520%2520%2520return%2520%28%250A%2520%2520%2520%2520%2520%2520%253Cdiv%2520className%253D%2522App%2522%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%253Cul%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%257Bthis.state.heroes.map%28%28hero%29%2520%253D%253E%2520%28%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%253Cli%2520key%253D%257Bhero%257D%253E%257Bhero%257D%253C%252Fli%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%29%29%257D%250A%2520%2520%2520%2520%2520%2520%2520%2520%253C%252Ful%253E%250A%2520%2520%2520%2520%2520%2520%253C%252Fdiv%253E%250A%2520%2520%2520%2520%29%253B%250A%2520%2520%257D%250A%257D%250Aexport%2520default%2520App%253B"
  style="width: 100%; height: 473px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

[![Edit React Fetch Heroes - full lifecycle](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-fetch-heroes-59u61?fontsize=14&hidenavigation=1&theme=dark)

The code above fetches the data from the server once the component was loaded and renders the list.

Sometime later, `hooks` feature was added to React, improving the way our apps are written a lot. We started using it, and soon we updated our hero list to use hooks:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%252C%2520%257B%2520useState%252C%2520useEffect%2520%257D%2520from%2520%2522react%2522%253B%250Aimport%2520%257B%2520fetchHeroes%2520%257D%2520from%2520%2522.%252Fapi%2522%253B%250Aimport%2520%2522.%252Fstyles.css%2522%253B%250A%250Aconst%2520App%2520%253D%2520%28%29%2520%253D%253E%2520%257B%250A%2520%2520const%2520%255Bheroes%252C%2520setHeroes%255D%2520%253D%2520useState%28%255B%255D%29%253B%250A%250A%2520%2520useEffect%28%28%29%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520fetchHeroes%28%29.then%28%28data%29%2520%253D%253E%2520setHeroes%28data%29%29%253B%250A%2520%2520%257D%252C%2520%255BsetHeroes%255D%29%253B%250A%250A%2520%2520return%2520%28%250A%2520%2520%2520%2520%253Cdiv%2520className%253D%2522App%2522%253E%250A%2520%2520%2520%2520%2520%2520%253Cul%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%257Bheroes.map%28%28hero%29%2520%253D%253E%2520%28%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%253Cli%2520key%253D%257Bhero%257D%253E%257Bhero%257D%253C%252Fli%253E%250A%2520%2520%2520%2520%2520%2520%2520%2520%29%29%257D%250A%2520%2520%2520%2520%2520%2520%253C%252Ful%253E%250A%2520%2520%2520%2520%253C%252Fdiv%253E%250A%2520%2520%29%253B%250A%257D%253B%250Aexport%2520default%2520App%253B"
  style="width: 100%; height: 483px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

[![Edit React Fetch Heroes](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-fetch-heroes-jb1of?fontsize=14&hidenavigation=1&theme=dark)

In our startup case study, we are always rewriting to something newer as the time goes. The last one is written in React, but we don't certainly know what is going to take place in the coming years, maybe [Svelte](https://svelte.dev/), or [Polymer](https://www.polymer-project.org/) or maybe [Web Assembly](https://webassembly.org/)? Who knows.

## What is Legacy Code

All the examples above render just a simple list of heroes, but in practice, it could be much bigger with a lot of functionalities and features. That means changing technology or approach can take a lot of time and planning.

As we can see with this simple startup tale, we are always writing code that, somehow, is going to be rewritten later. I think that we can safely assume the following:

> A code becomes LEGACY CODE as soon as shipped into production!

## Dealing with technology changes

There are three possible ways of dealing with a huge technology change, for example from a server-rendered app to a React App:

### Keep maintaining/adding features the existing one

If your app isn’t that big and improving the app and adding features is not an issue with the current stack, chances are that you don't need to change the stack you are using currently.

### Rewrite it from scratch

Rewriting from scratch means you will throw away your current app and replace it with the new one. If your app is a small one and you can keep maintaining the current one while rewriting the new version, this could be a good approach for you.

But if your app is large, or it has years of knowledge applied throughout code, I wouldn’t recommend doing this.

### Progressively rewrite

This approach means you are going to keep the current app, progressively moving towards the new approach. For example, you can start moving one page to React while all the others still use the old tech, gradually moving towards a single page application (SPA).

It’s likely that this is the option you will choose if your app is a large one.

## Leaving behind a good legacy code

As we just saw, **we are writing legacy code all the time**! It does not matter if we are using the cutting edge technology of the moment, it is going to become legacy code as soon as shipped into production.

With that in mind, **what really matters is leaving behind a good code**, so ourselves or our coworkers can look back and understand what is going on.

There is just one rule to rule everything, and it is called [KISS](http://wiki.c2.com/?KeepItSimple):

![KISS - Keep It Simple Stupid](/assets/kiss.png "KISS - Keep It Simple Stupid")

Keeping it simple can be hard, though. It is not the scope of this article to cover how to keep your code simple, as this could take a whole new blog post, but simple actions can help your code to be clear, for example:

- [Naming components, variables, functions and others appropriately;](https://www.robinwieruch.de/javascript-naming-conventions)
- [Have a sense of when to break your component into multiple components;](https://kentcdodds.com/blog/when-to-break-up-a-component-into-multiple-components)
- Always cover your code with tests ([static code analysis, unit tests, integration tests, E2E tests](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests))

The main point is:

> Any fool can write code that a computer can understand. Good programmers write code that humans can understand
>
> \- Martin Fowler
