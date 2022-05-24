import ChakraUIVuePlugin, { chakra } from "@chakra-ui/vue-next";
import { domElements } from "@chakra-ui/vue-system";
import { type UserModule } from '~/types'


export const install: UserModule = ({ app, router, isClient }) => {
    app.use(ChakraUIVuePlugin)
  
  
  domElements.forEach((tag) => {
    app.component(`chakra.${tag}`, chakra(tag));
  });
}