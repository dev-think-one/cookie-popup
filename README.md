
## Think Cookie Popup

Managing cookie settings (save setting in cookies and try to update ga() settings via dataLayer)
https://developers.google.com/tag-platform/tag-manager/datalayer

### Add npm package to your app
```
yarn add think-cookie-popup
```
or
```
npm install think-cookie-popup
```

### Implement in Vue app

In main.js
```
import CookieManagePopupVue from 'think-cookie-popup';

const app = createApp(App);
app.component('CookieManagePopup', CookieManagePopupVue);
```
use as compotent in your template
```
<template>
	<CookieManagePopup />
</template>
```

##### It apply props
ext-data where you can pass custom json content. See json example `cookies-manage-option.json`
```
<CookieManagePopup :ext-data="" />
```
ext-show for toggling show/hide popup
```
<CookieManagePopup :ext-show="" />
```
### Not vue
```
import {CookieManagePopup} from 'think-cookie-popup';

cosnt popup = new CookieManagePopup('#target_mount');
```
Accessing by hash link default `<a href="#cookiemanageshow">open popup</a>` or can pass custom hash link to `accessible()` method.
```
popup.accessible();
```
or custom
```
popup.accessible('myCustomHashLinks');
```

Custom content
```
import customJsonContent from './custom.json';

popup.useOption(customJsonContent)
```
------------

### Development
```
yarn install
```
#### Compiles and hot-reloads for development
```
yarn serve
```
#### Build library
```
yarn build
```

