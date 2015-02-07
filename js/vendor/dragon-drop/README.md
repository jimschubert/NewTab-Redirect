# angular-dragon-drop

"Drag and drop" directives for AngularJS. Work in progress.

## Install

```shell
bower install dragon-drop
```

or
```shell
npm install dragon-drop
```

## Usage

1. Include the `dist/dragon-drop.min.js` script provided by this component into your app.
2. Add `dragon-drop` as a module dependency to your app.

For example:

```html
<script src="dist/dragon-drop.min.js"></script>
<script>
    angular.module('ExampleApp', ['dragon-drop']).
            controller('MainCtrl', function ($scope, $log) {
            });
</script>
```

Repeats a template inside the dragon over a list.
```html
<div data-dragon="item in list">
  {{item.name}}
</div>
<div data-dragon="item in otherList">
  {{item.name}}
</div>
```
You can drag from one dragon onto another, and the models will be updated accordingly.

It also works on objects:
```html
<div data-dragon="(key, value) in list">
  {{key}}: {{value}}
</div>
<div data-dragon="(key, value) in otherList">
  {{key}}: {{value}}
</div>
```


## Config

This is not a kitchen sink every-option-you-can-think-of module.
This is a starting point.
Configure by forking and editing the code according to your needs.
Send a PR if you think your additions are widely useful. :)

### data-dragon-duplicate

Instead of removing values from the array this dragon is bound to, the values are duplicated.
Add the `data-dragon-duplicate` attribute to an element with the `data-dragon` attribute to get the behavior.

Example:
```html
<h2>These get copied</h2>
<div data-dragon="item in list" data-dragon-duplicate>
  {{item.name}}
</div>
<h2>These get moved</h2>
<div data-dragon="item in otherList">
  {{item.name}}
</div>
```

### data-dragon-accepts

Makes the dragon only accepts items that pass the truth test function given by this argument.
Add the `data-dragon-accepts` attribute to an element to get the behavior.

Example:
```html
<h2>You can only put shiny objects here</h2>h2>
<div data-dragon="item in list" data-dragon-accepts="shinyThings">
  {{item.name}}
</div>
<h2>This takes anything</h2>
<div data-dragon="item in otherList">
  {{item.name}}
</div>
```

```javascript
// in a Ctrl...
$scope.shinyThings = function (item) {
  return !!item.shiny;
};
```

### data-dragon-eliminate

Makes it so that the item is eliminated if it is not dropped inside of another dragon.
Add the `data-dragon-eliminate` attribute to an element to get the behavior.

Example:
```html
<h2>These get copied</h2>
<div data-dragon="item in list" data-dragon-duplicate>
  {{item.name}}
</div>
<h2>These get moved or eliminated</h2>
<div data-dragon="item in otherList" data-dragon-eliminate>
  {{item.name}}
</div>
```

### data-dragon-base / data-dragon-container

Makes it so the drop zone and template container can be separated.
Add `data-dragon-base` to the dragon and `data-dragon-container` to any child of the dragon.

Example:
```html
<div data-dragon="item in list">
  {{item.name}}
</div>
<h2>Here they are separate so you can drop anywhere under the base</h2>
<div data-dragon="item in otherList" data-dragon-base>
  <h1>Drop On Me</h1>
  <div data-dragon-container>
    {{item.name}}
  </div>
</div>
```

## Example

See [`example.html`](http://htmlpreview.github.io/?https://github.com/jimschubert/angular-dragon-drop/blob/master/example.html).

## License

MIT
