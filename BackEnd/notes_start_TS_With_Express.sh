npm i typescript --save-dev

add "type": "module" to package.json
add "build": "tsc" to package.json "scripts"

npm install -D @types/node

npm install @types/express

# create tsconfig.json to configure typescript compiler
# we need to transpile ts to js
npx tsc --init

tsconfig.json:
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2020",
    "sourceMap": true,
    "outDir": "dist",
   
   
    "paths": {
      "@shared/types": ["../shared/types"]
    },

    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["src/**/*"]
}


  
npm run build to generate dist folder with js files

# dist directory is where the final js files are stored

#package.json:
"scripts": {
    "start": "node dist/server.js",
    "dev": "tsc -w & nodemon dist/server.js"
  },

# when using local files to our project, use *.js whereas when using node_modules, use without .js

# require is commonjs syntax
# import is es6 syntax

# files local to our project:
import {hey} from ./helper.js # has to be .js 

# when importing packages from node_modules:
import fs from 'fs' # no need for .js  


# if we create helper.cjs, we can use require syntax

helper.cjs:
module.exports = {
    hey: function() {
        console.log('hey')
    }
}
# back in index.ts we can use 
import {hey} from './helper.cjs'

# nodeNext gives us much better inneroperability between commonjs and es6 modules

