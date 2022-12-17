# SVS

The SVS is a role-based adminstration tool.

## Used technologies

- [Vue 3](https://vuejs.org/) (using [`<script setup>` SFCs](https://vuejs.org/api/sfc-script-setup.html))
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [LDAP](https://ldap.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)

### Used packages

- [Sequelize](https://sequelize.org/)
- [Vue Router](https://router.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Vite Plugin Pages](https://github.com/hannoeru/vite-plugin-pages)
- [Unplugin Vue Components](https://www.npmjs.com/package/unplugin-vue-components)

## Recommended IDE Setup

The recommended IDE is [VSCode](https://code.visualstudio.com/) using the following extensions:

- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- [Volar](https://marketplace.visualstudio.com/items?itemName=vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project setup

### Installation

First ensure to have [NodeJS](https://nodejs.org/en/) installed.
It's recommended to use NodeJS 18 and the current version of NPM, required is NodeJS 16.14+.
Also you need to have [MySQL](https://www.mysql.com/) installed.

#### Install dependencies

```
npm install
```

#### Environment Variables

In the root directory is a `.env.initial` file.
Copy this file to the same directory naming it `.env`.
Then customize the variables for the database and LDAP configuration to your needs.

### Compiles and hot-reloads for development

```
npm start
```

### Build for production site

If you want to build the app for production run:

```
npm run build
```

Then you can execute the build running:

```
npm run serve
```

If you want to build the app as a static site instead:

```
npm run build::static
```

After that you can copy the files within `dist/static` to your web server.

### Update dependencies

```
npm run update
```
