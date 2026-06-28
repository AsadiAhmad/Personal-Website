# Personal-Website

Create your personal academic portfolio with this repository. It focuses on SEO optimization, high performance, security best practices, and modern animations to deliver a fast and professional online presence.

<div display=flex align=center>
  <img src="/image/Screenshots/1-MainPageDark.PNG"/>
</div>

<div display=flex align=center>
  <img src="/image/Screenshots/2-MainPageLight.PNG"/>
</div>

## 🌐 Live at

The website live at [My Website](https://ahmadasadi.ir)

## 🛠️ Tech

<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original.svg" title="HTML" alt="HTML" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-original.svg" title="CSS" alt="CSS" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="javascript" alt="javascript" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/python/python-original.svg" title="Python" alt="Python" width="40" height="40"/>&nbsp;
</div>

## 🏭 Builder

The builder used for gathering websites resources and material like the CSS, JS and svg files then it mixed all dependencies of the html files that are in the HTML folder into the main root and the Pages Folder preparing the one static html file for increasing the performance of the website.

### Why not main format ?

The main format is nice for programming, maintaining the code and easy testing but what about performance ?, the downloading waterfall chain increase the latancy too much, Specially in mobile version it may more than three second! so the google not indexed your website easily and users thinks your website have bug and leave your website.

### Why using builder ?

Because every time you change the website with the css files or js files you should copy paste the files you have changed into the all html files add the version into header and test it multiple times. It bothers you so why not use a auto builder without any mistakes!

### How to run the builder

After cloning the repo open the cmd in your local computer change your directory to into the Python folder then run this code:

```cmd
python builder.py
```

the builder looks for the html files in the HTML folder localy then build the static html files for optimizing.

## 🎥 Animation

This website built with cool new css animation update transition for multi pages application. So this website have a sliding animation between multi pages. For keeping SEO safe `I've not used single page application`.

### Reliability
I've made the code very very reliable and `100% works` in `any time` and have `no bug`.

### Performance
I've used just a `single` fast line js and `most of the structure` is `CSS` and `HTML` so it loads very fast and with the functionality of the navigation links makes a reliable approach.

### Totutial
I've used the `:view-transition` to build transitions between pages and keep `SEO` safe. also I've watched this video and it's helped me a lot: [![Toturial](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=quvE1uu1f_I)

For better directing things we have three approachs in sliding animation:
- `right directing`: Means page should slide to right.
- `none directing`: Means page should have not slide or do anything.
- `left directing`: Means page should have slide to left.

And we put this information in each nav buttons in the href like `?direction=left"`:

```HTML
<nav class="parent-nav">
    <ul class="nav fw-medium">
      <li><a href="/HTML/index.html?direction=left">Home</a></li>
      <li><a href="/HTML/projects.html?direction=left">Projects</a></li>
      <li><a href="/HTML/publications.html?direction=none">Publications</a></li>
      <li><a href="/HTML/notes.html?direction=right">Notes</a></li>
      <li><a href="/HTML/about.html?direction=right">About</a></li>
      <div class="animation"></div>
    </ul>
</nav>
```

So each one of the links tell the JS code that where the user wants to go.

For enabling animations I've created `enable_animation.css` and I've put it on all of my pages:

```CSS
@view-transition {
  navigation: auto;
}
```

It's very important that add this css to all of pages other way the whole animation won't work.

Each page of this website have four animations:
- `slide-in-right`: For right directing the destination page should came from left to here.
- `slide-out-right`: For right directing the current page should came from here to the left.
- `slide-in-left`: For left directing the destination page should came from right to here.
- `slide-out-left`: For right directing the current page should came from here to the right.

```CSS
@keyframes slide-in-right {
  from { transform: translateX(100vw); }
  to { transform: translateX(0); }
}

@keyframes slide-out-right {
  from { transform: translateX(0); }
  to { transform: translateX(-100vw); }
}

@keyframes slide-in-left {
  from { transform: translateX(-100vw); }
  to { transform: translateX(0); }
}

@keyframes slide-out-left {
  from { transform: translateX(0); }
  to { transform: translateX(100vw); }
}
```

The data that needed for animation decistion is on the page so we can check it with this css:

```CSS
[data-direction="right"]::view-transition-old(main-page-content) {
  animation-name: slide-out-right;
}
```

In that code the CSS checked if the direction is right to enable that animation.

Also for keeping the nav bar we use a main tag for just moving the main tag in animation swapping:

```HTML
<nav>
  <!-- nav content -->
</nav>
<main class="main-slide-show">
  <!-- main content -->
</main>
```

```CSS
.main-slide-show{
  view-transition-name: main-page-content;
}
```

For adding smoothness and sharp animation I've used this:

For Desktop:
```CSS
::view-transition-old(main-page-content),
::view-transition-new(main-page-content) {
  animation-duration: 800ms;
  animation-timing-function: ease-in-out;
}
```

For Android:
```CSS
@media (max-width: 768px) {
  ::view-transition-old(main-page-content),
  ::view-transition-new(main-page-content) {
    animation-duration: 800ms;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }
}
```

Just an JS line helps us to attch it to the HTML document and the css should find it.

```Js
document.documentElement.dataset.direction = new URLSearchParams(location.search).get("direction");
```

when user clicks on the nav bar the link would refresh the url and it's `do not stack` like:

`/HTML/index.html?direction=none?direction=right`

## 🪪 License 

This project is licensed under the MIT License.
