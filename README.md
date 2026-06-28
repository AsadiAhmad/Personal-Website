# Personal-Website

Build your personal website with this repo. This website has the most SEO, Performace, Security and animations. Also this website known as academic protfolio.

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

This website built with new css animation update transition for multi pages application. So this website have a sliding animation between multi pages. For keeping SEO safe `I've not used single page application`.

This website built with cool animation desgin. I've used the ''':view-transition''' to build slide-in and slide-out animations for the right side and left side. for decision needed animation for navigation between right side and left side i used '''?direction=none''' for storing the information where the user wants to go then i added a js line to help css find it: 

```Js
document.documentElement.dataset.direction = new URLSearchParams(location.search).get("direction");
```

we had three decisiton url requests:
- `?direction=right`
- `?direction=none`
- `?direction=left`

after that when the user clicks the navigation bar the JS builds

## 🪪 License 

This project is licensed under the MIT License.
