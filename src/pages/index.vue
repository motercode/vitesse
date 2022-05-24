<script setup lang="ts">
import { CFlex, CBox, CBadge, CIcon, CText } from "@chakra-ui/vue-next";
const user = useUserStore()
const favorites = useFavoritesPiniaStore()
const name = $ref(user.savedName)

const router = useRouter()
const go = () => {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}
const { t } = useI18n()
</script>

<template>
<div v-if="favorites.getSize>=0"> Pinia standard sintax works </div>
<div v-else> PINIA STANDARD SINTAX ITS NOT WORKING </div>
<div v-if="CBox">
<CBox
    w="300px"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';"
  >
    <CBox w="100%" shadow="md" rounded="lg" p="5">
      <CText
          ml="2"
          text-transform="uppercase"
          font-size="sm"
          font-weight="bold"
          color="pink.800"
        >
          chakra is working 
        </CText>
      <chakra.img alt="" rounded="md" w="100%" src="https://bit.ly/2k1H1t6" />
      <CFlex align="baseline" mt="2">
        <CBadge color-scheme="purple"> Plus </CBadge>
        <CText
          ml="2"
          text-transform="uppercase"
          font-size="sm"
          font-weight="bold"
          color="pink.800"
        >
          Verified &bull; Cape Town
        </CText>
      </CFlex>
      <CText mt="2" font-size="xl" font-weight="semibold" line-height="short">
        Modern, Chic Penthouse with Mountain, City & Sea Views
      </CText>
      <CText mt="2"> $119/night </CText>
      <CFlex mt="2" align="center">
        <CIcon name="star" color="orange.400" />
        <CText ml="1" font-size="sm"> <b>4.84</b> (190) </CText>
      </CFlex>
    </CBox>
  </CBox>
  </div>
  <div v-else> NOT CHAKRA LOADED CHECK IMPORTING THE TAGS </div>
  <div>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank">
        Vitesse
      </a>
    </p>
    <p>
      <em text-sm opacity-75>{{ t('intro.desc') }}</em>
    </p>

    <div py-4 />

    <input
      id="input"
      v-model="name"
      :placeholder="t('intro.whats-your-name')"
      :aria-label="t('intro.whats-your-name')"
      type="text"
      autocomplete="false"
      p="x4 y2"
      w="250px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @keydown.enter="go"
    >
    <label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>

    <div>
      <button
        btn m-3 text-sm
        :disabled="!name"
        @click="go"
      >
        {{ t('button.go') }}
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
