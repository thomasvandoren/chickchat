# ChickChat

ChickChat web chat application for December 2016
[ChickTech: Seattle](http://seattle.chicktech.org/) highschool workshop.

## Setup

### Find Github repo

* First, find your repository on Github. It should look something like:
  `https://github.com/YOUR_GITHUB_NAME_HERE/chickchat`

* Leave that open in one browser tab.

### Setup Cloud9 editor

Cloud9 is a code editor (like Atom from class!) that works in your browser!

* Open a new browser tab and go to: https://c9.io/

![c9-home](img/c9-home.png)

* Click the Github logo in the upper-right corner. You will have to sign into
  your Github account, and then "Authorize application". This will create a new
  Cloud9 account for you.

* Select "Create new Cloud9 account"

![c9-create-acct](img/c9-create-acct.png)

**FIXME:** We're working on setting up an edu org, so the CC number won't be necessary. (thomasvandoren, 2016-12-06)

* Fill out the form. You will need to enter a credit card during sign up. It
  won't charge you.

* When you have logged in, you should see this screen:

![c9-home](img/c9-home.png)

* Select "Create a new workspace"!

* Give your workspace a name. **It must begin with chichchat**.

* In the "Clone from Git or Mercurial URL" section, enter the URL of your
  Github repo. It should look something like:
  `https://github.com/YOUR_GITHUB_USERNAME/chickchat.git`

* Under "Choose a template", select `Node.js` box.

![c9-new](img/c9-new.png)

* Select "Create workspace"

* After a few seconds (or a minute) your code editor (or interactive
  development environment (IDE)) will open.

![c9-ide](img/c9-ide.png)

### Dev environment setup

* Click into the bottom box (your terminal), and enter: `npm install -g yarn`
  . Then press Enter and wait for the command to finish running.

![c9-install-yarn](img/c9-install-yarn.png)

* Enter this command next: `cd WebApp ; yarn` . Then press Enter.

![c9-yarn](img/c9-yarn.png)

After command finishes, you should see something like this:

![c9-yarn-done](img/c9-yarn-done.png)

* Press the green plus mark and choose "New Run Configuration".

![c9-run-conf](img/c9-run-conf.png)

* Enter `Run WebApp` in the first dark grey box.

* Enter `yarn start` in the second dark grey box.

* Select the `CWD` button, and choose the WebApp directory.

![c9-sel-webapp](img/c9-sel-webapp.png)

* The bottom screen section should now look like this:

![c9-run-conf-ready](img/c9-run-conf-ready.png)

* Click the `Run` button to start the chat application! When it's running it
  should look like:

![c9-running](img/c9-running.png)

* To view the app, select Preview from the top menu, then `Preview Running Application`:

![c9-preview](img/c9-preview.png)

* Your web app will open in a new tab in the editor. You can cut+paste the URL
  into a new tab.

![c9-tab-run](img/c9-tab-run.png)

* For example, my url is: https://chickchat-thomasvandorencttest.c9users.io/

![c9-run](img/c9-run.png)

Now your app is running!

### Making changes

Now that your app is running, you can open files, edit them, and then save. The
changes will automatically show up (it takes a few seconds sometimes) just like
in class. Make sure you save, though!

## Suggested features

0. Make all author images a circle.

0. Add conditional formatting so that all your messages have a different style
  than everyone else.

0. Use CSS animation to change the colors of the messages back-and-forth on the page.

0. Use CSS animation to grow the message when the mouse hovers over them.

0. Use CSS animation to spin images on page.

0. Use CSS to animate the image only when the mouse hovers over the image.

0. Implement the image upload if you didn't get a chance in class. Hint: look at
  the comments in
  [WebApp/src/util/attachImage.js](WebApp/src/util/attachImage.js).

0. The [Material-UI](http://www.material-ui.com/) library is included in the
  project. Replace some of your HTML in Chat.js render() method with
  Material-UI components for a modern web look.

0. Show an animation when someone says a particular word. For example, if
  someone says "pumpkin", you could make it rain pumpkins on your screen!
