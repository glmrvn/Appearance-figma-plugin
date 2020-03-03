# Appearance. Figma plugin. 

This plugin generates a dark/light mode from your selection.
The plugin works with external library styles and local styles.
[Link to the Figma plugin page](https://www.figma.com/c/plugin/760927481606931799/Appearance)

<img width="640" alt="image" src="https://i.imgur.com/6U35R8K.gif">

## How it works:
1. Use [day] and [night] in your style names. Example: Style name[day]/ Style name[night].
2. Apply your color styles.
3. Select any object, then choose Appearance → Dark mode or Appearance → Light mode.

## How it works with external library styles:
1. Open external library file and use [day] and [night] in color style names. Example: Style name[day]/ Style name[night].
2. Publish changes.
3. Select Appearance → Save styles for saving external color styles to the plugin.
4. Open any file linked to the library. 
5. Apply color styles.
6. Select any object then choose Appearance → Dark mode or Appearance → Light mode”

## Styles name examples:
You can use [day] / [night] at any place of your style name.
```
Color name [day]
Color name [night]
```
```
Style [day] / color-name
Style [nigth] / color-name
```
```
Style / color-name [day]
Style / color-name [night]
```
## How to install in the Dev environment
* Select the Plugins Page in the Figma File Browser
* Use the plus (+) button in the Development section
* Choose file manifest.json 
* Done