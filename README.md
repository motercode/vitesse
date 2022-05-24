pasos para crear un proyecto
Created by Fernando Gost
Last updated: less than a minute ago4 min read
primer creamos la aplicacion de vitesse que es un template de vit.

Getting Started | Vite 
npx degit antfu/vitesse vitesseapp
https://github.com/antfu/vitesse) - Connect to preview

borrar el .github

clonar el proyecto creado en gitlab 

npm install pnpm
pnpm install


si aparece el error 

ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies

.
└─┬ @intlify/vite-plugin-vue-i18n
└── ✕ unmet peer vue-i18n@next: found 9.1.10
esta ya metido como deuda técnica , no afecta en el proyecto por ahora.

 

configuración del proyecto 

seguimos los pasos de :
GitHub - antfu/vitesse: 🏕 Opinionated Vite Starter Template 
en este paso 

“Change the hostname in vite.config.ts”

no aparece el hostname lo mas parecido son las claves de server.host o preview.host, lo hemos pasado a deuda técnica pues no parece que afecte al proyecto.

“… remove routes”

no se a lo que se refiere con esto , porque se crean según los módulos que vas poniendo , creo un issue para mirarlo bien.

se puede seguir con el proyecto .

fix pinia SSG problem error when building with vite-ssg · Issue #665 · vuejs/pinia 


....
import { createPinia } from 'pinia'
....
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.globEager('./modules/*.ts')).forEach(i => i.install?.(ctx))
    const pinia = createPinia()
    ctx.app.use(pinia)
  },
)
debemos añadir esas dos lineas, que aunque en dev nos dan un warning , hacen que viteSSG cree en el build lo necesario para el objeto pinia store y se pueda usar la sintaxis nomal de pinia .

Podemos hacer el build sin ssg con el script  build:noSSG  y no seria necesario añadir lo anterior.


export const useStore = defineStore('main', {
  state: () => ({
  }),
  getters: {
    
  },
  actions: {
  }
}
 

repasando todos los scripts de pnpm

se han creado task y bugs de lo que no se entiende "preview-https": "serve dist", por ejemplo.
añadimos los scripts : 

"dev:silent": "vite --port 3333"

que sirve para poder poner el servidor en marcha sin que te abra una tab del navegador.

"test:e2e:silent": "cypress run"

lanza los test de cypress sin abrir el inteface , mostrando el resultado en el terminal.

"test:unit": "vitest --run" 

lo modificamos pues hay dos iguales que llamaban a vitest, en este caso test:unit hace un solo test sin activar el watch

pnpm i c8

la usaremos para producir el informe del test de cobertura compatible con gitlab. 

"test:and:coverage": "vitest run --coverage"

y añadimos esto al final de la configuración de vite.config.ts


 coverage: {
      reporter: ['text', 'cobertura'],
    },
 

añadimos lo siguiente para hacer los build sin SSG de forma que sorteamos los problemas con modulos commonJS 

"build:noSSG": "vite build"

Configuramos eslint para ignore patterns cypress segun indica en el index.js comentados

 

Configuracion del Gitlab CI

creamos el archivo en el ./ del proyecto llamado .gitlab-ci.yml


stages:    
  - prepare      
  - test
  - build

variables:
   CYPRESS_CACHE_FOLDER: "$CI_PROJECT_DIR/cache/Cypress"  

default:
   image: cypress/base:16.13.0
   cache: &cache
     key: "$CI_COMMIT_REF_SLUG"
     paths:
       - node_modules/
       - cache/Cypress
     policy: pull

prepare:
  stage: prepare
  interruptible: true
  cache:
    <<: *cache
    policy: push
  script:
    - npm ci
  
build-site:
  stage: build
  cache:
    <<: *cache
    policy: pull
  script:
    - CI=true npm run build 
  artifacts:
    expire_in: 1 day
    paths:
      - dist

unit-test-coverage: 
  stage: test   
  cache:
    <<: *cache
    policy: pull 
  script:
    - CI=true npm run test:and:coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

test:lint:
  stage: test 
  cache:
    <<: *cache
    policy: pull 
  interruptible: true
  script:
    - CI=true npm run lint

cypress-e2e:
  stage: test
  cache:
    <<: *cache
    policy: pull 
  script:
    - $(npm bin)/cypress cache path
    - $(npm bin)/cypress cache list
    - $(npm bin)/cypress verify
    - CI=true npm run dev:silent &
    - $(npm bin)/cypress run
  artifacts:
    expire_in: 1 week
    when: always
    paths:
    - cypress/screenshots
    - cypress/videos

cypress-e2e-chrome:
   image: cypress/browsers:node14.17.6-slim-chrome100-ff99-edge
   stage: test
   script:
     - CI=true npm run dev:silent &
     - $(npm bin)/cypress run --browser chrome
   artifacts:
     expire_in: 1 week
     when: always
     paths:
     - cypress/screenshots
     - cypress/videos
 

añadir al archivo .eslintignore


dist
public
cypress/plugins/index.js  
cache/*
cypress/support/index.js
y en .eslintrc


{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
  },
  "globals": {
    "i4t": true,
    "pdfjsLib": true,
    "module": true
  }
}
 

incorporación de los componentes de chakra

pnpm i @chakra-ui/vue-next

pnpm i -D @babel/core

create file on modules chakra.ts  


import ChakraUIVuePlugin, { chakra } from "@chakra-ui/vue-next";
import { domElements } from "@chakra-ui/vue-system";
import { type UserModule } from '~/types'


export const install: UserModule = ({ app, router, isClient }) => {
    app.use(ChakraUIVuePlugin)
  
  
  domElements.forEach((tag) => {
    app.component(`chakra.${tag}`, chakra(tag));
  });
}
añadir un script en el package.jon para hacer el build sin SSG 

"build:noSSG": "vite build"

Chakra UI Vue | Documentation 

Chakra UI Vue 

 

configurar los mensajes de gitlab

seguir las pautas del link para configurar los mensajes cada usuario 

Notification emails | GitLab 

https://gitlab.com/-/profile/notifications

usar custom notifications activar las de pipeline

