# WIP components for [influxdata/giraffe](https://github.com/influxdata/giraffe/)
[<img src="https://influxdata.github.io/branding/img/mascots/mascot-chronograf--white_png.png" height="100" alt="giraffe"/>](https://github.com/influxdata/giraffe/)

## To run project:
 1. have [node](https://nodejs.org/) and [yarn](https://yarnpkg.com/) installed
 1. call `yarn dev` (starts server)
 1. open [`localhost:3000`](http://localhost:3000) or start __vscode debug__


# Bullet graph - Mini gauge _(progress-bar)_

## Current state:
![01.jpg](./images/01.jpg)

## TODO:

 - bullet mode background min-max only -> gradient
 - formaters for SI values

### BUG: 
 - bullet mode background has to overlap, or page backgroud will make fake borders for all thresholds, same for value bar when is in front of background bar with same height and for start + end

### Before giraffe release:
 - create default themes
 - create tooltip
