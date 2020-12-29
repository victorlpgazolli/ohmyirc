<h1 align="center">
  Oh My Irc
</h1>

Oh My IRC is a Graphic User Interface IRC client for chatting with ease

🚧 **Oh My Irc is under development** 🚧

## Official Site

https://ohmyirc.ga

## Installing

```bash
$ sudo snap install ohmyirc
```

Or visit: https://ohmyirc.ga/download/all.html

## Building

You'll need [Node.js](https://nodejs.org) installed on your computer in order to build this app.

```bash
$ git clone https://github.com/victorlpgazolli/ohmyirc.git
$ cd ohmyirc
$ npm install
$ npm run dev
```
Runs the app in the development mode.<br/>

## Testing with local irc

You'll need [docker-compose](https://docker.com/) installed on your computer in order to test locally

```bash
$ docker-compose up irc
```

Runs the IRC server in localhost:6667<br/>


## Packaging

```bash
$ npm run package
```
OR
```bash
$ docker-compose up package
```

See packaging docs: https://www.electron.build/cli

Runs the packager and outputs into release folder <br/>

