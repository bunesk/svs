# SVS

The SVS (Studentenverwaltungssystem) is a role-based adminstration tool implemented as a Single Page Application using server-side rendering.
It was developed during a bachelor thesis from October 2022 to February 2023 at the Mannheim University of Applied Sciences.

## Goal of this project

The Mannheim University of Applied Sciences has been using a tool for years to manage scores that students receive for tests and sheets within an event.
However, the previous version of the tool is older and uses technologies that are no longer state-of-the-art, such as Jakarta Servlet and JSP.
Therefore, this tool is to be redeveloped once again using modern technologies, such as Vue.js and TypeScript.
All functionality of the old SVS should also be available in the new one, such as an LDAP connection.
In addition, the tool should have an intuitive and more modern design.

## User roles in the SVS

Users will be automatically created if they exist in the LDAP directory. Alternately they can be added by admins or register themselves.

There are 3 roles for users:
- students: are able to join events, view points for tests & sheets and see their team members
- tutors: are able to join events, can rate tests & sheets of students
- admins: can manage events, teams, tests & sheets (add, edit, delete)

## Used technologies

- [Vue 3](https://vuejs.org/) (using [`<script setup>` SFCs](https://vuejs.org/api/sfc-script-setup.html))
- [Express](https://expressjs.com/)
- [MariaDB](https://mariadb.org/)
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
Also you need to have [MariaDB](https://mariadb.org/) installed.

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

### Update dependencies

```
npm run update
```
