<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    {{$acl.get}}
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { AclRule } from 'vue-acl'

export default {
  name: 'home',
  computed: {
    isLocalRule () {
      return new AclRule('create').generate()
    }
  }
}
</script>
