`<vaadin-grid>` is still experimental, track https://github.com/vaadin/vaadin-grid/issues/890 for compatibility.

After `bower install`, go to `src/assets/bower_components/vaadin-grid/vaadin-grid-column.html` and change line 107 from 

```js
if (template) {
```

to

```js
if (template && !template.templatizer) {
```
