---
path: react-libraries-switching-to-hooks
date: February 6th, 2020
readingtime: 12 min read
title: React libraries being empowered by hooks
image: /assets/hooks.jpeg
description: >-
  We will take a look at some of the most common libraries, seeing how they
  switched to using hooks, comparing what the code looked like before and after
  the switch.
---

We will take a look at some of the most common libraries, seeing how they switched to using hooks, comparing what the code looked like before and after the switch.

![Powerful hooks](/assets/hooks.jpeg "Powerful hooks")

_\-Image by Leticia Andrade-_

Since the release of hooks with React v16.8.0, the way we write our applications has changed. If you are not familiar with React hooks (I doubt it), I highly recommend you to check it out the [official documentation](https://reactjs.org/docs/hooks-intro.html) and [Dan Abramov's talk on React Conf](https://www.youtube.com/watch?v=dpw9EHDh2bM).

Before React 16.8.0, the main way to share behavior between components was using a pattern called [Higher Order Components (also known as HOC)](https://reactjs.org/docs/higher-order-components.html). It consists of changing the given component to have some extra functionality or to pass some extra props.

In this example, `withSpecialPower` adds `specialPower` to the component, which contains a random special power (just to exemplify).

`Hero.js`

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%2520from%2520%2522react%2522%253B%250Aimport%2520withSpecialPower%2520from%2520%2522.%252FwithSpecialPower%2522%253B%250A%250Aconst%2520Hero%2520%253D%2520%28%257B%2520name%252C%2520specialPower%2520%257D%29%2520%253D%253E%2520%257B%250A%2520%2520return%2520%28%250A%2520%2520%2520%2520%253Ch2%253E%250A%2520%2520%2520%2520%2520%2520%257Bname%257D%2520-%2520I%2520can%2520%257BspecialPower%257D%250A%2520%2520%2520%2520%253C%252Fh2%253E%250A%2520%2520%29%253B%250A%257D%253B%250A%250Aexport%2520default%2520withSpecialPower%28Hero%29%253B"
  style="width: 100%; height: 297px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

`withSpecialPower.js`

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%2520from%2520%2522react%2522%253B%250A%250Aconst%2520withSpecialPower%2520%253D%2520%28Component%29%2520%253D%253E%2520%257B%250A%2520%2520return%2520class%2520Wrapper%2520extends%2520React.Component%2520%257B%250A%2520%2520%2520%2520render%28%29%2520%257B%250A%2520%2520%2520%2520%2520%2520const%2520specialPowerList%2520%253D%2520%255B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522be%2520invisible%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522flight%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522see%2520the%2520future%2522%252C%250A%2520%2520%2520%2520%2520%2520%2520%2520%2522read%2520your%2520mind%2522%252C%250A%2520%2520%2520%2520%2520%2520%255D%253B%250A%2520%2520%2520%2520%2520%2520const%2520specialPower%2520%253D%250A%2520%2520%2520%2520%2520%2520%2520%2520specialPowerList%255BMath.floor%28Math.random%28%29%2520*%2520specialPowerList.length%29%255D%253B%250A%2520%2520%2520%2520%2520%2520return%2520%253CComponent%2520%257B...this.props%257D%2520specialPower%253D%257BspecialPower%257D%2520%252F%253E%253B%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%253B%250A%257D%253B%250A%250Aexport%2520default%2520withSpecialPower%253B"
  style="width: 100%; height: 428px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

[![Edit higher-order-components](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/sweet-cloud-bfx58?fontsize=14&hidenavigation=1&theme=dark)

This pattern has been widely used by a lot of libraries like [Redux](https://react-redux.js.org/), [Formik](https://jaredpalmer.com/formik), [React-DnD](https://react-dnd.github.io/react-dnd/about) and many others. However, since React v16.8.0, many of these libraries have started leveraging the power of hooks to improve the quality of their libraries. Don't get me wrong, sometimes this pattern can be very useful, especially if you need to wrap your component into something else like a Route or some Provider.

Let's take a look at how the code looks like using higher order components compared using hooks on those libraries. _Just a reminder that the idea here is not to give full examples of each library nor teach how they work, but instead, compare the code before and after hooks._

**Redux**

It is a library that helps manage the global state of the application. On the following piece of code, it is giving the component `HeroList` some extras props that allow it to access some data from the store and also dispatch some action, in this case, `callForHelp`.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520%257B%2520connect%2520%257D%2520from%2520%27react-redux%27%253B%250Aimport%2520%257B%2520callForHelp%2520%257D%2520from%2520%27.%252FheroActions%27%253B%250A%252F%252FThe%2520component%2520receives%2520%2560heroes%2560%2520and%2520%2560callHero%2560%2520from%2520%2560connect%2560%250Aconst%2520HeroList%2520%253D%2520%28%257B%2520heroes%252C%2520callHero%2520%257D%29%2520%253D%253E%2520...%250A%250Aconst%2520mapStateToProps%2520%253D%2520%28state%29%2520%253D%253E%2520%257B%250A%2520%2520return%2520%257B%250A%2520%2520%2520%2520heroes%253A%2520state.heroes%250A%2520%2520%257D%250A%257D%250A%250Aconst%2520mapDispatchToProps%2520%253D%2520dispatch%2520%253D%253E%2520%257B%250A%2520%2520callHero%253A%2520hero%2520%253D%253E%2520dispatch%28callForHelp%28hero%29%29%250A%257D%250A%250Aexport%2520default%2520connect%28%250A%2520%2520mapStateToProps%252C%250A%2520%2520mapDispatchToProps%250A%29%28HeroList%29"
  style="width: 100%; height: 428px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

Since React Redux v7.1.0, new hooks were added to make easier to access the store (`useSelector`) and dispatch actions (`useDispatch`). Below you can see the same component, with the same functionality, but much cleaner and easier to read.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520%257B%2520useSelector%252C%2520useDispatch%2520%257D%2520from%2520%27react-redux%27%253B%250Aimport%2520%257B%2520callForHelp%2520%257D%2520from%2520%27.%252FheroActions%27%253B%250A%250Aconst%2520HeroList%2520%253D%2520%28props%29%2520%253D%253E%2520%257B%2520%2520%252F%252FThe%2520component%2520uses%2520a%2520selector%2520to%2520get%2520%2560heroes%2560%250A%2520%2520const%2520heroes%2520%253D%2520useSelector%28state%2520%253D%253E%2520state.heroes%29%253B%250A%2520%2520const%2520dispatch%2520%253D%2520useDispatch%28%29%253B%250A%2520%2520const%2520callHero%2520%253D%2520hero%2520%253D%253E%2520dispatch%28callForHelp%28hero%29%29%253B%250A%2520%2520...%250A%257D%250A%250Aexport%2520default%2520HeroList%253B"
  style="width: 100%; height: 279px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

**Formik**

This is a library that helps us manage certain aspects of forms such as state, validation, errors, and schema definition. The following example shows how we can use it to manage a simple form.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%2520from%2520%27react%27%253B%250Aimport%2520%257B%2520withFormik%2520%257D%2520from%2520%27formik%27%253B%250A%250A%252F%252FThe%2520component%2520receives%2520all%2520these%2520props%2520from%2520%2560withFormik%2560%250Aconst%2520MyForm%2520%253D%2520%28%257B%250A%2520%2520%2520%2520values%252C%250A%2520%2520%2520%2520touched%252C%250A%2520%2520%2520%2520errors%252C%250A%2520%2520%2520%2520handleChange%252C%250A%2520%2520%2520%2520handleBlur%252C%250A%2520%2520%2520%2520handleSubmit%252C%250A%2520%2520%257D%29%2520%253D%253E%2520...%253B%250A%250Aconst%2520MyEnhancedForm%2520%253D%2520withFormik%28%257B%250A%2520%2520mapPropsToValues%253A%2520%28%29%2520%253D%253E%2520%28%257B%2520name%253A%2520%27%27%2520%257D%29%252C%250A%2520%2520%252F%252F%2520Custom%2520sync%2520validation%250A%2520%2520validate%253A%2520values%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520const%2520errors%2520%253D%2520%257B%257D%253B%250A%2520%2520%2520%2520if%2520%28%21values.name%29%2520%257B%250A%2520%2520%2520%2520%2520%2520errors.name%2520%253D%2520%27Required%27%253B%250A%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520return%2520errors%253B%250A%2520%2520%257D%252C%250A%2520%2520handleSubmit%253A%2520values%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520console.log%28%27Will%2520submit%27%252C%2520values%29%250A%2520%2520%257D%250A%257D%29%28MyForm%29%253B"
  style="width: 100%; height: 576px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

See this full example [here](https://jaredpalmer.com/formik/docs/api/withFormik).

Since Formik v2, we can use \`useFormik\` hook to do the same thing as before, but in a better and cleaner way.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%2520from%2520%27react%27%253B%250Aimport%2520%257B%2520withFormik%2520%257D%2520from%2520%27formik%27%253B%250A%250A%252F%252FThe%2520component%2520receives%2520all%2520these%2520props%2520from%2520%2560withFormik%2560%250Aconst%2520MyForm%2520%253D%2520%28%257B%250A%2520%2520%2520%2520values%252C%250A%2520%2520%2520%2520touched%252C%250A%2520%2520%2520%2520errors%252C%250A%2520%2520%2520%2520handleChange%252C%250A%2520%2520%2520%2520handleBlur%252C%250A%2520%2520%2520%2520handleSubmit%252C%250A%2520%2520%257D%29%2520%253D%253E%2520...%253B%250A%250Aconst%2520MyEnhancedForm%2520%253D%2520withFormik%28%257B%250A%2520%2520mapPropsToValues%253A%2520%28%29%2520%253D%253E%2520%28%257B%2520name%253A%2520%27%27%2520%257D%29%252C%250A%2520%2520%252F%252F%2520Custom%2520sync%2520validation%250A%2520%2520validate%253A%2520values%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520const%2520errors%2520%253D%2520%257B%257D%253B%250A%2520%2520%2520%2520if%2520%28%21values.name%29%2520%257B%250A%2520%2520%2520%2520%2520%2520errors.name%2520%253D%2520%27Required%27%253B%250A%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520return%2520errors%253B%250A%2520%2520%257D%252C%250A%2520%2520handleSubmit%253A%2520values%2520%253D%253E%2520%257B%250A%2520%2520%2520%2520console.log%28%27Will%2520submit%27%252C%2520values%29%250A%2520%2520%257D%250A%257D%29%28MyForm%29%253B"
  style="width: 100%; height: 576px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

See this full example [here](https://jaredpalmer.com/formik/docs/api/useFormik). Formik also provides `useField` and `useFormikContext` that can give you even more flexibility depending on the use case.

**React-DnD**

Another good example of a library completely changed by hooks is React-DnD. React-DnD is a library that helps us drag and drop elements. Before hooks, the code to make a drag and drop component looked like a nightmare. Only people who were familiar with the library could understand what was going on. Take a look at [DragSource](https://react-dnd.github.io/react-dnd/docs/api/drag-source) higher order component and also [DropTarget](https://react-dnd.github.io/react-dnd/docs/api/drop-target) under Legacy Decorator API on the React-Dnd documentation to have an idea of what I am talking about.

Since hooks were introduced to React-DnD it has been much easier to understand the code. \`useDrag\` and \`useDrop\` is much more readable, even if you are not familiar with the library, you know what it is doing, for instance, if a component is using \`useDrag\` you presume that component is draggable.

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520%257B%2520useDrag%2520%257D%2520from%2520%2522react-dnd%2522%253B%250A%250Afunction%2520DraggableComponent%28props%29%2520%257B%250A%2520%2520const%2520%255BcollectedProps%252C%2520drag%255D%2520%253D%2520useDrag%28%257B%250A%2520%2520%2520%2520item%253A%2520%257B%2520id%252C%2520type%2520%257D%252C%250A%2520%2520%257D%29%253B%250A%2520%2520return%2520%253Cdiv%2520ref%253D%257Bdrag%257D%253E...%253C%252Fdiv%253E%253B%250A%257D"
  style="width: 100%; height: 223px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

Example from [React DnD documentation](https://react-dnd.github.io/react-dnd/docs/api/use-drag).

## Concluding

As we can see, hooks have been empowering React libraries worldwide, simplifying how we interact with them. What I most like is, how it improves the code readability reducing boilerplate and a lot of lines of code. When Dan Abramov and Ryan Florence said [hooks could turn your application up to 90% cleaner](https://www.youtube.com/watch?v=wXLf18DsV-I), I was skeptical about it, but now, when I see this massive usage of hooks I know it is totally achievable.

It becomes easier to follow as well. Just by the word \`use\` you know the component is "using" something. Let's take a look at our first example, now, using hooks:
`Hero.js`

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=import%2520React%2520from%2520%2522react%2522%253B%250Aimport%2520useSpecialPower%2520from%2520%2522.%252FuseSpecialPower%2522%253B%250A%250Aconst%2520Hero%2520%253D%2520%28%257B%2520name%2520%257D%29%2520%253D%253E%2520%257B%250A%2520%2520const%2520specialPower%2520%253D%2520useSpecialPower%28%29%253B%250A%2520%2520return%2520%28%250A%2520%2520%2520%2520%253Ch2%253E%250A%2520%2520%2520%2520%2520%2520%257Bname%257D%2520-%2520I%2520can%2520%257BspecialPower%257D%250A%2520%2520%2520%2520%253C%252Fh2%253E%250A%2520%2520%29%253B%250A%257D%253B%250A%250Aexport%2520default%2520Hero%253B"
  style="width: 100%; height: 316px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

`useSpecialPower.js`

<iframe
  src="https://carbon.now.sh/embed?bg=rgba%280%2C0%2C0%2C1%29&t=seti&wt=none&l=javascript&ds=true&dsyoff=0px&dsblur=0px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=const%2520useSpecialPower%2520%253D%2520%28%29%2520%253D%253E%2520%257B%250A%2520%2520const%2520specialPowerList%2520%253D%2520%255B%250A%2520%2520%2520%2520%2522be%2520invisible%2522%252C%250A%2520%2520%2520%2520%2522flight%2522%252C%250A%2520%2520%2520%2520%2522see%2520the%2520future%2522%252C%250A%2520%2520%2520%2520%2522read%2520your%2520mind%2522%252C%250A%2520%2520%255D%253B%250A%2520%2520return%2520specialPowerList%255BMath.floor%28Math.random%28%29%2520*%2520specialPowerList.length%29%255D%253B%250A%257D%253B%250A%250Aexport%2520default%2520useSpecialPower%253B"
  style="width: 100%; height: 279px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

[![Edit heroes-app-using-hooks](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/heroes-app-using-hooks-h7wt4?fontsize=14&hidenavigation=1&theme=dark)
